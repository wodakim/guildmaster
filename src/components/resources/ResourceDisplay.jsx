import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaCoins, FaHammer, FaStar, FaGem, FaArrowUp } from 'react-icons/fa';
import { generateResources } from '../../store/slices/resourcesSlice';

/**
 * ResourceDisplay component - Shows resources with icons and generation rates
 */
const ResourceDisplay = ({ showRates = true, compact = false }) => {
  const resources = useSelector(state => state.resources);
  const dispatch = useDispatch();
  
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(generateResources(1)); // Générer des ressources chaque seconde
    }, 1000);

    return () => clearInterval(interval);
  }, [dispatch]);
  
  const resourceIcons = {
    gold: <FaCoins className="text-yellow-400" />,
    materials: <FaHammer className="text-gray-400" />,
    reputation: <FaStar className="text-yellow-300" />,
    gems: <FaGem className="text-blue-400" />
  };
  
  const resourceNames = {
    gold: 'Or',
    materials: 'Matériaux',
    reputation: 'Réputation',
    gems: 'Gemmes'
  };
  
  const resourceTypes = ['gold', 'materials', 'reputation', 'gems'];
  
  if (compact) {
    // Compact display for mobile or small containers
    return (
      <div className="flex justify-between items-center bg-gray-800 text-white p-2 rounded-md">
        {resourceTypes.map(type => (
          <div key={type} className="flex items-center">
            <div className="mr-1">{resourceIcons[type]}</div>
            <span className="text-sm">{Math.floor(resources[type])}</span>
          </div>
        ))}
      </div>
    );
  }
  
  // Full display with generation rates
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3">
      {resourceTypes.map(type => (
        <div 
          key={type} 
          className="bg-white rounded-lg shadow-md p-3 border-l-4 border-gray-800"
        >
          <div className="flex items-center mb-1">
            <div className="p-2 bg-gray-100 rounded-md mr-2">
              {resourceIcons[type]}
            </div>
            <div>
              <div className="text-sm text-gray-600">{resourceNames[type]}</div>
              <div className="font-bold">{Math.floor(resources[type])}</div>
            </div>
          </div>
          
          {showRates && resources.generationRates[type] > 0 && (
            <div className="text-xs text-green-600 flex items-center mt-1">
              <FaArrowUp className="mr-1" size={10} />
              {resources.generationRates[type].toFixed(1)}/sec
            </div>
          )}
          
          {/* Show capacity for resources that have limits */}
          {resources.capacity[type] !== undefined && resources.capacity[type] !== Infinity && (
            <div className="mt-1">
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-blue-600 h-1.5 rounded-full" 
                  style={{ width: `${Math.min(100, (resources[type] / resources.capacity[type]) * 100)}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 text-right mt-0.5">
                {Math.floor(resources[type])}/{resources.capacity[type]}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ResourceDisplay;