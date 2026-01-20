import ToothCounter from './components/ToothCounter';
import ChildrenVisited from './components/ChildrenVisited';
import TimeZoneMap from './components/TimeZoneMap';
import TimezoneBarChart from './components/TimezoneBarChart';
import CavityCounter from './components/CavityCounter';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12 animate-float">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 mb-4">
            🐭 El Ratón Pérez 🐭
          </h1>
          <p className="text-xl text-pink-600 font-medium">
            Descubre la magia de los dientes de leche
          </p>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Contador de dientes */}
          <div className="lg:col-span-1">
            <ToothCounter />
          </div>

          {/* Niños visitados */}
          <div className="lg:col-span-1">
            <ChildrenVisited />
          </div>
        </div>

        {/* Mapa */}
        <div className="mb-8">
          <TimeZoneMap />
        </div>

        {/* Gráfico de barras */}
        <div className="mb-8">
          <TimezoneBarChart />
        </div>

        {/* Contador de dientes cariados */}
        <div className="mb-8">
          <CavityCounter />
        </div>

        {/* Footer */}
        <footer className="text-center text-pink-500 text-sm mt-12">
          <p>✨ Hecho con amor para todos los niños que esperan al Ratón Pérez ✨</p>
        </footer>
      </div>
    </div>
  );
}
