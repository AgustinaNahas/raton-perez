'use client';

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';

export default function TimeZoneMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [currentTimezone, setCurrentTimezone] = useState<number>(0);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'raster-tiles': {
            type: 'raster',
            tiles: [
              'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
            ],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors'
          }
        },
        layers: [
          {
            id: 'simple-tiles',
            type: 'raster',
            source: 'raster-tiles',
            minzoom: 0,
            maxzoom: 22
          }
        ]
      },
      center: [0, 20],
      zoom: 2
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    // Esperar a que el mapa cargue completamente
    map.current.on('load', () => {
      setMapLoaded(true);
    });

    return () => {
      // Limpiar marcadores
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      setMapLoaded(false);
    };
  }, []);

  useEffect(() => {
    const updateTimezone = () => {
      const now = new Date();
      const utcHours = now.getUTCHours();
      // Calcular el huso horario que está a medianoche
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

  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Calcular la longitud del huso horario actual
    // Cada huso horario tiene 15 grados de ancho (360/24)
    // El huso UTC+0 está centrado en 0°, UTC+1 en 15°, UTC-1 en -15°, etc.
    const longitude = currentTimezone * 15;
    const halfWidth = 7.5; // Mitad del ancho del huso horario

    // Remover marcadores anteriores
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Remover fuentes y capas anteriores si existen
    if (map.current.getSource('timezone-highlight')) {
      if (map.current.getLayer('timezone-fill')) {
        map.current.removeLayer('timezone-fill');
      }
      if (map.current.getLayer('timezone-outline')) {
        map.current.removeLayer('timezone-outline');
      }
      map.current.removeSource('timezone-highlight');
    }

    // Crear una geometría de polígono para el huso horario
    const coordinates: [number, number][] = [
      [longitude - halfWidth, 85], // Norte
      [longitude + halfWidth, 85],
      [longitude + halfWidth, -85], // Sur
      [longitude - halfWidth, -85],
      [longitude - halfWidth, 85] // Cerrar polígono
    ];

    map.current.addSource('timezone-highlight', {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [coordinates]
        },
        properties: {}
      }
    });

    // Agregar capa de relleno
    map.current.addLayer({
      id: 'timezone-fill',
      type: 'fill',
      source: 'timezone-highlight',
      paint: {
        'fill-color': '#ff6b9d',
        'fill-opacity': 0.3
      }
    });

    // Agregar capa de borde
    map.current.addLayer({
      id: 'timezone-outline',
      type: 'line',
      source: 'timezone-highlight',
      paint: {
        'line-color': '#ff1744',
        'line-width': 3,
        'line-opacity': 0.8
      }
    });

    // Centrar el mapa en el huso horario actual
    map.current.easeTo({
      center: [longitude, 20],
      duration: 1000
    });

    // Crear dientes con animación de latido después de que el mapa se haya centrado
    const timeoutId = setTimeout(() => {
      if (!map.current) return;

      // Calcular los límites exactos del huso horario
      const timezoneLeft = longitude - halfWidth;  // Borde izquierdo del huso
      const timezoneRight = longitude + halfWidth; // Borde derecho del huso
      const timezoneWidth = timezoneRight - timezoneLeft; // Ancho total del huso (15 grados)
      
      // Rango de latitud para el área visible
      const minLat = -50;
      const maxLat = 50;
      const latRange = maxLat - minLat;
      
      // Número de dientes a mostrar
      const numTeeth = 12;
      
      for (let i = 0; i < numTeeth; i++) {
        // Posición aleatoria dentro del huso horario
        const randomLat = minLat + Math.random() * latRange;
        
        // Posición de longitud dentro del huso horario (con margen del 10% a cada lado)
        const margin = timezoneWidth * 0.1;
        const lngMin = timezoneLeft + margin;
        const lngMax = timezoneRight - margin;
        const randomLng = lngMin + Math.random() * (lngMax - lngMin);
        
        // Crear elemento HTML para el diente con animación de latido
        const el = document.createElement('div');
        el.className = 'tooth-marker';
        el.innerHTML = '🦷';
        el.style.fontSize = `${24 + Math.random() * 8}px`; // Tamaño entre 24-32px
        el.style.pointerEvents = 'none';
        el.style.cursor = 'pointer';
        el.style.opacity = '0'; // Empezar invisible
        el.style.animation = 'toothPulse 3s ease-in-out infinite';
        el.style.animationDelay = `${Math.random() * 3}s`; // Delay aleatorio para efecto más natural
        el.style.animationFillMode = 'both'; // Mantener estados inicial y final
        
        // Crear marcador
        const marker = new maplibregl.Marker({
          element: el,
          anchor: 'center'
        })
          .setLngLat([randomLng, randomLat])
          .addTo(map.current!);
        
        markersRef.current.push(marker);
      }
    }, 1100); // Esperar a que el mapa termine de centrarse

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
    };
  }, [currentTimezone, mapLoaded]);

  return (
    <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-3xl p-6 shadow-lg border-2 border-yellow-200">
      <h2 className="text-2xl font-bold text-orange-800 mb-4 text-center animate-pulse-gentle">
        🗺️ Ruta del Ratón Pérez 🗺️
      </h2>
      <div className="text-center mb-2">
        <p className="text-orange-600 text-sm">
          Huso horario actual: UTC{currentTimezone >= 0 ? '+' : ''}{currentTimezone}
        </p>
      </div>
      <div 
        ref={mapContainer} 
        className="w-full h-96 rounded-2xl overflow-hidden border-2 border-pink-300"
        style={{ minHeight: '400px' }}
      />
    </div>
  );
}
