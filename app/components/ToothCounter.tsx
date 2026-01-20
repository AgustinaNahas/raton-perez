'use client';

import { useEffect, useState } from 'react';

const TEETH_PER_DAY = 111316449;
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

function formatNumber(num: number): string {
  return Math.floor(num).toLocaleString('es-ES');
}

export default function ToothCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Calcular dientes desde el inicio del año
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
    const now = new Date();
    const daysSinceStartOfYear = (now.getTime() - startOfYear.getTime()) / MILLISECONDS_PER_DAY;
    const initialCount = daysSinceStartOfYear * TEETH_PER_DAY;
    
    setCount(initialCount);

    // Actualizar cada segundo
    const interval = setInterval(() => {
      const now = new Date();
      const daysSinceStartOfYear = (now.getTime() - startOfYear.getTime()) / MILLISECONDS_PER_DAY;
      const newCount = daysSinceStartOfYear * TEETH_PER_DAY;
      setCount(newCount);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-3xl p-8 shadow-lg border-2 border-pink-200">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-pink-800 mb-4 animate-pulse-gentle">
          🦷 Dientes Recogidos Este Año 🦷
        </h2>
        <div className="text-6xl font-bold text-purple-700 mb-2 transition-all duration-300">
          {formatNumber(count)}
        </div>
        <p className="text-pink-600 text-sm mt-4">
          El Ratón Pérez está trabajando sin descanso...
        </p>
      </div>
    </div>
  );
}
