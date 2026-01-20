'use client';

import { useEffect, useState } from 'react';
import Papa from 'papaparse';

interface TimezoneData {
  huso: number;
  cant_total_dientes: number;
}

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQiIrCmmqMbArDPdqpCohU9NYGtUqCLk4Wk5oV_Ock4LRhC4IfseyKuOc7IKXUawQ9DQTREfrSRQr7y/pub?gid=1842497142&single=true&output=csv';

function formatNumber(num: number): string {
  return Math.floor(num).toLocaleString('es-ES');
}

export default function ChildrenVisited() {
  const [childrenCount, setChildrenCount] = useState<number | null>(null);
  const [currentTimezone, setCurrentTimezone] = useState<number | null>(null);
  const [timezoneData, setTimezoneData] = useState<TimezoneData[]>([]);
  const [currentTime, setCurrentTime] = useState<string>('');

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
          // Remover comas y convertir a número
          return parseFloat(value.replace(/,/g, ''));
        }
        return value;
      },
      complete: (results) => {
        const data = results.data.filter(d => d.huso !== undefined && d.cant_total_dientes > 0);
        setTimezoneData(data);
      },
    });
  }, []);

  useEffect(() => {
    const updateCount = () => {
      const now = new Date();
      const utcHours = now.getUTCHours();
      const utcMinutes = now.getUTCMinutes();
      
      // Formatear hora actual
      setCurrentTime(now.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit',
        timeZoneName: 'short'
      }));

      // Encontrar el huso horario que está a medianoche (00:00)
      // Si son las 00:00 UTC, el huso UTC+0 está a medianoche
      // Si son las 01:00 UTC, el huso UTC-1 está a medianoche (porque allí son las 00:00)
      // Si son las 13:00 UTC, el huso UTC-13 está a medianoche
      // Si son las 23:00 UTC, el huso UTC+1 está a medianoche (del día siguiente)
      // Fórmula: si UTC_hours < 12, huso = -UTC_hours
      //          si UTC_hours >= 12, huso = 24 - UTC_hours (huso positivo del día siguiente)
      let targetTimezone: number;
      if (utcHours < 12) {
        targetTimezone = -utcHours;
      } else {
        targetTimezone = 24 - utcHours;
      }
      
      setCurrentTimezone(targetTimezone);

      // Buscar datos para este huso horario (permitir coincidencia aproximada)
      // Buscar primero coincidencia exacta o muy cercana
      const matchingData = timezoneData.find(d => {
        return Math.abs(d.huso - targetTimezone) < 0.6;
      }) || timezoneData.find(d => {
        // Si no hay coincidencia exacta, buscar el más cercano
        const husoFloor = Math.floor(d.huso);
        return Math.abs(husoFloor - targetTimezone) < 1;
      });
      
      if (matchingData) {
        // Asumimos que cada niño pierde un diente, así que el número de dientes = número de niños
        setChildrenCount(matchingData.cant_total_dientes);
      } else {
        // Si no hay datos exactos, buscar el más cercano
        const closest = timezoneData.reduce((prev, curr) => {
          const prevDiff = Math.abs(Math.floor(prev.huso) - targetTimezone);
          const currDiff = Math.abs(Math.floor(curr.huso) - targetTimezone);
          return currDiff < prevDiff ? curr : prev;
        }, timezoneData[0]);
        
        if (closest) {
          setChildrenCount(closest.cant_total_dientes);
        } else {
          setChildrenCount(0);
        }
      }
    };

    updateCount();
    const interval = setInterval(updateCount, 1000);

    return () => clearInterval(interval);
  }, [timezoneData]);

  return (
    <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-3xl p-8 shadow-lg border-2 border-blue-200">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-blue-800 mb-4 animate-pulse-gentle">
          🐭 Niños que Visita Ahora 🐭
        </h2>
        {childrenCount !== null ? (
          <>
            <div className="text-5xl font-bold text-cyan-700 mb-2 transition-all duration-300">
              {formatNumber(childrenCount)}
            </div>
            <p className="text-blue-600 text-sm mt-2">
              Hora actual: {currentTime}
            </p>
            {currentTimezone !== null && (
              <p className="text-blue-500 text-xs mt-1">
                Visitando huso horario UTC{currentTimezone >= 0 ? '+' : ''}{currentTimezone}
              </p>
            )}
          </>
        ) : (
          <div className="text-blue-600">Cargando datos...</div>
        )}
      </div>
    </div>
  );
}
