import React from 'react';
import { useSelector } from 'react-redux';
import { FaCoins, FaHammer, FaStar, FaGem, FaHome, FaUsers, FaMapMarkedAlt, FaBuilding, FaTools } from 'react-icons/fa';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * DesktopLayout component - Provides the desktop-optimized layout with sidebar navigation
 */
const DesktopLayout = ({ children, activePage, setActivePage }) => {
  const guild = useSelector(state => state.guild);
  const resources = useSelector(state => state.resources);

  const pages = [
    { id: 'guild', label: 'Tableau de bord', icon: <FaHome /> },
    { id: 'adventurers', label: 'Aventuriers', icon: <FaUsers /> },
    { id: 'missions', label: 'Missions', icon: <FaMapMarkedAlt /> },
    { id: 'buildings', label: 'Bâtiments', icon: <FaBuilding /> },
    { id: 'upgrades', label: 'Améliorations', icon: <FaTools /> }
  ];

  return (
    <div className="flex h-screen max-h-screen overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        {/* Guild name and level */}
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold truncate">{guild.name}</h1>
          <div className="text-sm text-gray-400">Niveau {guild.level}</div>
        </div>

        {/* Navigation */}
        <nav className="flex-1">
          <ul className="py-4">
            {pages.map(page => (
              <li key={page.id}>
                <button
                  onClick={() => setActivePage(page.id)}
                  className={`w-full flex items-center px-4 py-3 ${
                    activePage === page.id 
                      ? 'bg-gray-700 border-l-4 border-blue-500' 
                      : 'border-l-4 border-transparent hover:bg-gray-700'
                  }`}
                >
                  <span className="mr-3">{page.icon}</span>
                  <span>{page.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Resources at bottom of sidebar */}
        <div className="p-4 border-t border-gray-700">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center">
              <FaCoins className="text-yellow-400 mr-2" />
              <div>
                <div className="text-sm">{Math.floor(resources.gold)}</div>
                <div className="text-xs text-gray-400">Or</div>
              </div>
            </div>
            <div className="flex items-center">
              <FaHammer className="text-gray-400 mr-2" />
              <div>
                <div className="text-sm">{Math.floor(resources.materials)}</div>
                <div className="text-xs text-gray-400">Matériaux</div>
              </div>
            </div>
            <div className="flex items-center">
              <FaStar className="text-yellow-300 mr-2" />
              <div>
                <div className="text-sm">{Math.floor(resources.reputation)}</div>
                <div className="text-xs text-gray-400">Réputation</div>
              </div>
            </div>
            <div className="flex items-center">
              <FaGem className="text-blue-400 mr-2" />
              <div>
                <div className="text-sm">{Math.floor(resources.gems)}</div>
                <div className="text-xs text-gray-400">Gemmes</div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header with resource generation rates */}
        <header className="bg-white p-4 shadow-md flex items-center justify-between">
          <h2 className="text-xl font-semibold">{pages.find(p => p.id === activePage)?.label || 'Guilde'}</h2>
          
          <div className="flex space-x-4 text-sm">
            <div className="flex items-center">
              <FaCoins className="text-yellow-400 mr-1" />
              <span>+{resources.generationRates.gold.toFixed(1)}/sec</span>
            </div>
            <div className="flex items-center">
              <FaHammer className="text-gray-400 mr-1" />
              <span>+{resources.generationRates.materials.toFixed(1)}/sec</span>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>

      {/* Toast notifications */}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default DesktopLayout;