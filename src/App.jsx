import React from 'react';
import ResponsiveLayout from './components/layouts/ResponsiveLayout';
import ResourceDisplay from './components/resources/ResourceDisplay';
import AdventurerCard from './components/adventurers/AdventurerCard';

// Images temporaires
const guildBackground = 'https://placehold.co/1920x1080/2a2a2a/ffffff?text=Guild+Background';
const adventurerBackground = 'https://placehold.co/400x600/2a2a2a/ffffff?text=Adventurer';
const missionBackground = 'https://placehold.co/800x600/2a2a2a/ffffff?text=Mission';

function App() {
  // Paramètres facilement modifiables
  const guildName = 'Ma Guilde';
  const guildLevel = 1;
  const resources = {
    gold: 100,
    materials: 50,
    reputation: 0,
    gems: 0,
    generationRates: {
      gold: 1,
      materials: 0.5,
    },
    capacity: {
      gold: 1000,
      materials: 500,
    },
  };

  return (
    <ResponsiveLayout>
      {/* Ajouter les visuels 2D ici */}
      <img src={guildBackground} alt="Guild Background" className="absolute inset-0 w-full h-full object-cover" />
      <div className="relative z-10">
        <h1>{guildName}</h1>
        <p>Niveau {guildLevel}</p>
        <ResourceDisplay resources={resources} />
        <AdventurerCard adventurer={{ name: 'Aventurier', class: 'Warrior', level: 1, status: 'idle' }} />
      </div>
    </ResponsiveLayout>
  );
}

export default App;
