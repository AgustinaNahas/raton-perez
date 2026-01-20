'use client';

import { useEffect, useState, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Papa from 'papaparse';

interface TimezoneData {
  huso: number;
  cant_total_dientes: number;
}

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQiIrCmmqMbArDPdqpCohU9NYGtUqCLk4Wk5oV_Ock4LRhC4IfseyKuOc7IKXUawQ9DQTREfrSRQr7y/pub?gid=1842497142&single=true&output=csv';

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

export default function TimezoneBarChart() {
  const [data, setData] = useState<TimezoneData[]>([]);
  const [currentTimezone, setCurrentTimezone] = useState<number | null>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Cargar datos del CSV
    Papa.parse<TimezoneData>(CSV_URL, {
      download: true,
      header: true,
      skipEmptyLines: true,
      transform: (value, field) => {
        if (field === 'huso') {
          return parseFloat(value);
        }
        if (field === 'cant_total_dientes') {
          return parseFloat(value.replace(/,/g, ''));
        }
        return value;
      },
      complete: (results) => {
        const parsedData = results.data
          .filter(d => d.huso !== undefined && d.cant_total_dientes > 0)
          .sort((a, b) => a.huso - b.huso);
        setData(parsedData);
      },
    });
  }, []);

  useEffect(() => {
    const updateTimezone = () => {
      const now = new Date();
      const utcHours = now.getUTCHours();
      let targetTimezone: number;
      if (utcHours < 12) {
        targetTimezone = -utcHours;
      } else {
        targetTimezone = 24 - utcHours;
      }
      setCurrentTimezone(targetTimezone);
    };

    updateTimezone();
    const interval = setInterval(updateTimezone, 1000);

    return () => clearInterval(interval);
  }, []);

  const chartData = data.map(item => ({
    huso: `UTC${item.huso >= 0 ? '+' : ''}${item.huso}`,
    husoValue: item.huso,
    niños: item.cant_total_dientes,
    isCurrent: currentTimezone !== null && 
      (Math.abs(item.huso - currentTimezone) < 0.6 || 
       Math.abs(Math.floor(item.huso) - currentTimezone) < 0.6 ||
       Math.abs(Math.ceil(item.huso) - currentTimezone) < 0.6)
  }));

  return (
    <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl p-8 shadow-lg border-2 border-green-200">
      <h2 className="text-2xl font-bold text-green-800 mb-6 text-center animate-pulse-gentle">
        📊 Niños por Huso Horario 📊
      </h2>
      {data.length > 0 ? (
        <div ref={chartContainerRef} className="relative">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} margin={{ top: 50, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
              <XAxis 
                dataKey="huso" 
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fill: '#4a5568', fontSize: 12 }}
              />
              <YAxis 
                tick={{ fill: '#4a5568', fontSize: 12 }}
                tickFormatter={formatNumber}
              />
              <Tooltip 
                formatter={(value: number) => [formatNumber(value), 'Niños']}
                contentStyle={{ 
                  backgroundColor: '#fef7f7', 
                  border: '2px solid #fecdd3',
                  borderRadius: '8px',
                  color: '#5a4a4a'
                }}
              />
              <Bar dataKey="niños" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => {
                  return (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.isCurrent ? '#ff6b9d' : '#a78bfa'}
                      opacity={entry.isCurrent ? 1 : 0.7}
                      stroke={entry.isCurrent ? '#ff1744' : 'none'}
                      strokeWidth={entry.isCurrent ? 3 : 0}
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          
          {/* Marcador de ratón sobre la barra actual */}
          {currentTimezone !== null && chartData.length > 0 && (() => {
            const currentIndex = chartData.findIndex(entry => entry.isCurrent);
            if (currentIndex === -1) return null;
            
            // Calcular posición basada en el ancho del contenedor
            const containerWidth = chartContainerRef.current?.offsetWidth || 0;
            const marginLeft = 20;
            const marginRight = 30;
            const chartWidth = containerWidth - marginLeft - marginRight;
            const barWidth = chartWidth / chartData.length;
            const barCenterX = marginLeft + (currentIndex * barWidth) + (barWidth / 2);
            
            return (
              <div
                className="absolute pointer-events-none animate-pulse-gentle"
                style={{
                  left: `${barCenterX}px`,
                  top: '10px',
                  transform: 'translateX(-50%)',
                  textAlign: 'center',
                  zIndex: 10
                }}
              >
                <div className="text-3xl mb-1" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>
                  🐭
                </div>
                <div 
                  className="text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap"
                  style={{
                    backgroundColor: '#ff1744',
                    color: 'white',
                    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))'
                  }}
                >
                  Visitando ahora
                </div>
              </div>
            );
          })()}
        </div>
      ) : (
        <div className="text-center text-green-600 py-20">Cargando datos...</div>
      )}
    </div>
  );
}
