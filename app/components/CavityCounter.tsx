'use client';

import { useEffect, useState } from 'react';

const TEETH_PER_DAY = 111316449;
const CAVITY_PERCENTAGE = 0.05; // 5% de dientes cariados
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

function formatNumber(num: number): string {
  return Math.floor(num).toLocaleString('es-ES');
}

export default function CavityCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Calcular dientes cariados desde el inicio del año (5% del total)
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
    const now = new Date();
    const daysSinceStartOfYear = (now.getTime() - startOfYear.getTime()) / MILLISECONDS_PER_DAY;
    const totalTeeth = daysSinceStartOfYear * TEETH_PER_DAY;
    const initialCount = totalTeeth * CAVITY_PERCENTAGE;
    
    setCount(initialCount);

    // Actualizar cada segundo
    const interval = setInterval(() => {
      const now = new Date();
      const daysSinceStartOfYear = (now.getTime() - startOfYear.getTime()) / MILLISECONDS_PER_DAY;
      const totalTeeth = daysSinceStartOfYear * TEETH_PER_DAY;
      const newCount = totalTeeth * CAVITY_PERCENTAGE;
      setCount(newCount);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-br from-orange-100 to-red-100 rounded-3xl p-8 shadow-lg border-2 border-orange-200">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-orange-800 mb-4 animate-pulse-gentle">
          🦷 Dientes Cariados Este Año 🦷
        </h2>
        <div className="text-6xl font-bold text-red-700 mb-2 transition-all duration-300">
          {formatNumber(count)}
        </div>
        <p className="text-orange-600 text-sm mt-4">
          El 5% de los dientes recogidos necesitan atención especial...
        </p>
      </div>
    </div>
  );
}
