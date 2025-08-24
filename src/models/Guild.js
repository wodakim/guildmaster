// Guild model
import { v4 as uuidv4 } from 'uuid';

export class Guild {
  constructor({
    id = uuidv4(),
    name = 'New Guild',
    level = 1,
    experience = 0,
    experienceToNextLevel = 100,
    reputation = 0,
    maxAdventurers = 3,
    maxMissions = 2,
  } = {}) {
    this.id = id;
    this.name = name;
    this.level = level;
    this.experience = experience;
    this.experienceToNextLevel = experienceToNextLevel;
    this.reputation = reputation;
    this.maxAdventurers = maxAdventurers;
    this.maxMissions = maxMissions;
  }

  addExperience(amount) {
    this.experience += amount;
    while (this.experience >= this.experienceToNextLevel) {
      this.levelUp();
    }
  }

  levelUp() {
    this.experience -= this.experienceToNextLevel;
    this.level += 1;
    this.experienceToNextLevel = Math.floor(this.experienceToNextLevel * 1.5);
    
    // Increase max adventurers every 3 levels
    if (this.level % 3 === 0) {
      this.maxAdventurers += 1;
    }
    
    // Increase max missions every 5 levels
    if (this.level % 5 === 0) {
      this.maxMissions += 1;
    }
  }

  addReputation(amount) {
    this.reputation += amount;
    return this.reputation;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      level: this.level,
      experience: this.experience,
      experienceToNextLevel: this.experienceToNextLevel,
      reputation: this.reputation,
      maxAdventurers: this.maxAdventurers,
      maxMissions: this.maxMissions,
    };
  }
}

export default Guild;