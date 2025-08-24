import React from 'react';
import { useDispatch } from 'react-redux';
import { FaSword, FaHatWizard, FaBullseye, FaSkull, FaCross } from 'react-icons/fa';
import { levelUpAdventurer, setAdventurerStatus } from '../../store/slices/adventurersSlice';
import { calculateExperienceProgress } from '../../utils/gameCalculations';
import { motion } from 'framer-motion';

/**
 * AdventurerCard component - Displays an adventurer with stats and actions
 */
const AdventurerCard = ({ adventurer, onAssign, showActions = true }) => {
  const dispatch = useDispatch();
  
  if (!adventurer) return null;
  
  // Class-specific icon and color
  const classInfo = {
    Warrior: { icon: <FaSword />, color: 'text-red-500', bg: 'bg-red-100' },
    Mage: { icon: <FaHatWizard />, color: 'text-blue-500', bg: 'bg-blue-100' },
    Archer: { icon: <FaBullseye />, color: 'text-green-500', bg: 'bg-green-100' },
    Rogue: { icon: <FaSkull />, color: 'text-gray-700', bg: 'bg-gray-100' },
    Cleric: { icon: <FaCross />, color: 'text-yellow-500', bg: 'bg-yellow-100' }
  };
  
  const { icon, color, bg } = classInfo[adventurer.class] || classInfo.Warrior;
  
  // Calculate experience progress
  const expProgress = calculateExperienceProgress(adventurer);
  
  // Get status-specific styling
  const getStatusStyle = (status) => {
    switch (status) {
      case 'mission':
        return 'bg-blue-100 text-blue-800';
      case 'training':
        return 'bg-green-100 text-green-800';
      case 'wounded':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Handle level up when enough experience
  const handleLevelUp = () => {
    if (adventurer.experience >= adventurer.experienceToNextLevel) {
      dispatch(levelUpAdventurer({ adventurerId: adventurer.id }));
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="border rounded-lg shadow-sm overflow-hidden bg-white"
    >
      {/* Header with name and level */}
      <div className="p-3 border-b flex justify-between items-center">
        <div className="flex items-center">
          <div className={`p-2 rounded-full ${bg} ${color} mr-2`}>
            {icon}
          </div>
          <div>
            <h3 className="font-semibold">{adventurer.name}</h3>
            <div className="text-xs text-gray-500">{adventurer.class}</div>
          </div>
        </div>
        <div className="bg-gray-800 text-white rounded-full w-8 h-8 flex items-center justify-center">
          {adventurer.level}
        </div>
      </div>
      
      {/* Status badge */}
      <div className="px-3 py-1">
        <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${getStatusStyle(adventurer.status)}`}>
          {adventurer.status === 'idle' ? 'Disponible' : 
           adventurer.status === 'mission' ? 'En mission' :
           adventurer.status === 'training' ? 'En entraînement' : 'Blessé'}
        </span>
      </div>
      
      {/* Stats */}
      <div className="p-3 grid grid-cols-2 gap-2 text-sm">
        {adventurer.stats && Object.entries(adventurer.stats).map(([stat, value]) => (
          <div key={stat} className="flex justify-between">
            <span className="capitalize">{stat}:</span>
            <span className="font-medium">{value}</span>
          </div>
        ))}
      </div>
      
      {/* Experience bar */}
      <div className="px-3 pb-2">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>Exp: {expProgress.current}/{expProgress.required}</span>
          <span>{expProgress.percentage}%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full">
          <div
            className="h-2 bg-blue-500 rounded-full"
            style={{ width: `${expProgress.percentage}%` }}
          />
        </div>
      </div>
      
      {/* Actions */}
      {showActions && (
        <div className="p-3 border-t bg-gray-50 flex justify-between">
          {adventurer.experience >= adventurer.experienceToNextLevel ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLevelUp}
              className="w-full bg-green-500 text-white py-1 rounded font-medium hover:bg-green-600"
            >
              Monter de niveau !
            </motion.button>
          ) : (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => dispatch(setAdventurerStatus({
                  adventurerId: adventurer.id,
                  status: 'training'
                }))}
                disabled={adventurer.status !== 'idle'}
                className={`px-3 py-1 rounded text-sm ${
                  adventurer.status === 'idle'
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                Entraîner
              </motion.button>
              
              {onAssign && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onAssign(adventurer.id)}
                  disabled={adventurer.status !== 'idle'}
                  className={`px-3 py-1 rounded text-sm ${
                    adventurer.status === 'idle'
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Assigner
                </motion.button>
              )}
            </>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default AdventurerCard;