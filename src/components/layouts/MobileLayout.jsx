import React from 'react';
import { useSelector } from 'react-redux';
import { FaCoins, FaHammer, FaStar, FaGem } from 'react-icons/fa';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * MobileLayout component - Provides the mobile-optimized layout with tab navigation
 */
const MobileLayout = ({ children, activePage, setActivePage }) => {
  const guild = useSelector(state => state.guild);
  const resources = useSelector(state => state.resources);

  const pages = [
    { id: 'guild', label: 'Guilde', icon: <FaStar className="text-yellow-400" /> },
    { id: 'adventurers', label: 'Héros', icon: <FaStar className="text-blue-400" /> },
    { id: 'missions', label: 'Missions', icon: <FaStar className="text-green-400" /> },
    { id: 'buildings', label: 'Bâtiments', icon: <FaStar className="text-red-400" /> }
  ];

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-gray-100">
      {/* Top header with guild name and resources */}
      <header className="bg-gray-800 text-white p-2 shadow-md">
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-bold truncate">{guild.name}</h1>
          <div className="text-sm">Niveau {guild.level}</div>
        </div>
        
        {/* Resource bar */}
        <div className="flex justify-between mt-2 text-sm">
          <div className="flex items-center">
            <FaCoins className="text-yellow-400 mr-1" />
            <span>{Math.floor(resources.gold)}</span>
          </div>
          <div className="flex items-center">
            <FaHammer className="text-gray-400 mr-1" />
            <span>{Math.floor(resources.materials)}</span>
          </div>
          <div className="flex items-center">
            <FaStar className="text-yellow-300 mr-1" />
            <span>{Math.floor(resources.reputation)}</span>
          </div>
          <div className="flex items-center">
            <FaGem className="text-blue-400 mr-1" />
            <span>{Math.floor(resources.gems)}</span>
          </div>
        </div>
      </header>

      {/* Main content area */}
      <main className="flex-1 overflow-y-auto p-2">
        {children}
      </main>

      {/* Bottom navigation */}
      <nav className="bg-gray-800 text-white grid grid-cols-4 p-1">
        {pages.map(page => (
          <button
            key={page.id}
            onClick={() => setActivePage(page.id)}
            className={`flex flex-col items-center justify-center p-2 ${
              activePage === page.id ? 'text-white bg-gray-700 rounded-lg' : 'text-gray-400'
            }`}
          >
            <div>{page.icon}</div>
            <span className="text-xs mt-1">{page.label}</span>
          </button>
        ))}
      </nav>

      {/* Toast notifications */}
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="dark"
        className="mb-14" // Ensure toasts appear above bottom navigation
      />
    </div>
  );
};

export default MobileLayout;