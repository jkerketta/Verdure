
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Plant {
  id: string;
  name: string;
  species: string;
  image: string;
  price: number;
  size: 'small' | 'medium' | 'large';
  lightNeeds: 'low' | 'medium' | 'high';
  waterNeeds: 'low' | 'medium' | 'high';
  description: string;
  location: string;
  deliveryOptions: string[];
  ownerId: string;
  ownerName: string;
  ownerAvatar?: string;
  tags: string[];
  isFeatured?: boolean;
  createdAt: Date;
}

interface PlantContextType {
  plants: Plant[];
  likedPlants: string[];
  addPlant: (plant: Omit<Plant, 'id' | 'createdAt'>) => void;
  likePlant: (plantId: string) => void;
  unlikePlant: (plantId: string) => void;
  getRecommendedPlants: () => Plant[];
}

const PlantContext = createContext<PlantContextType | undefined>(undefined);

export const usePlants = () => {
  const context = useContext(PlantContext);
  if (context === undefined) {
    throw new Error('usePlants must be used within a PlantProvider');
  }
  return context;
};

const mockPlants: Plant[] = [
  {
    id: '1',
    name: 'Fiddle Leaf Fig',
    species: 'Ficus lyrata',
    image: 'https://images.unsplash.com/photo-1586770285491-944efbbc1bb9?w=400&h=400&fit=crop',
    price: 45,
    size: 'large',
    lightNeeds: 'high',
    waterNeeds: 'medium',
    description: 'Beautiful fiddle leaf fig, perfect for bright corners. Has been my plant baby for 2 years but moving to a smaller apartment.',
    location: 'Brooklyn, NY',
    deliveryOptions: ['pickup', 'local delivery'],
    ownerId: '2',
    ownerName: 'Sarah',
    ownerAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    tags: ['indoor', 'statement', 'bright-light'],
    isFeatured: true,
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Snake Plant',
    species: 'Sansevieria trifasciata',
    image: 'https://images.unsplash.com/photo-1493663284031-b7e3aaa4cab7?w=400&h=400&fit=crop',
    price: 25,
    size: 'medium',
    lightNeeds: 'low',
    waterNeeds: 'low',
    description: 'Super low maintenance snake plant. Great for beginners or busy plant parents!',
    location: 'Manhattan, NY',
    deliveryOptions: ['pickup'],
    ownerId: '3',
    ownerName: 'Mike',
    tags: ['beginner', 'low-maintenance', 'air-purifying'],
    isFeatured: true,
    createdAt: new Date('2024-01-20')
  },
  {
    id: '3',
    name: 'Monstera Deliciosa',
    species: 'Monstera deliciosa',
    image: 'https://images.unsplash.com/photo-1545239705-1564e58b9e4a?w=400&h=400&fit=crop',
    price: 35,
    size: 'large',
    lightNeeds: 'medium',
    waterNeeds: 'medium',
    description: 'Gorgeous monstera with beautiful fenestrations. Comes with a moss pole for support.',
    location: 'Queens, NY',
    deliveryOptions: ['pickup', 'local delivery'],
    ownerId: '4',
    ownerName: 'Emma',
    tags: ['trendy', 'statement', 'climbing'],
    createdAt: new Date('2024-01-18')
  },
  {
    id: '4',
    name: 'Pothos Collection',
    species: 'Epipremnum aureum',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop',
    price: 20,
    size: 'small',
    lightNeeds: 'low',
    waterNeeds: 'low',
    description: 'Set of 3 pothos cuttings in water. Perfect for propagation enthusiasts!',
    location: 'Brooklyn, NY',
    deliveryOptions: ['pickup'],
    ownerId: '5',
    ownerName: 'Alex',
    tags: ['propagation', 'beginner', 'trailing'],
    createdAt: new Date('2024-01-22')
  }
];

export const PlantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [plants, setPlants] = useState<Plant[]>(mockPlants);
  const [likedPlants, setLikedPlants] = useState<string[]>([]);

  useEffect(() => {
    const savedLikes = localStorage.getItem('verdure_liked_plants');
    if (savedLikes) {
      setLikedPlants(JSON.parse(savedLikes));
    }
  }, []);

  const addPlant = (plantData: Omit<Plant, 'id' | 'createdAt'>) => {
    const newPlant: Plant = {
      ...plantData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date()
    };
    setPlants(prev => [newPlant, ...prev]);
  };

  const likePlant = (plantId: string) => {
    const newLikedPlants = [...likedPlants, plantId];
    setLikedPlants(newLikedPlants);
    localStorage.setItem('verdure_liked_plants', JSON.stringify(newLikedPlants));
  };

  const unlikePlant = (plantId: string) => {
    const newLikedPlants = likedPlants.filter(id => id !== plantId);
    setLikedPlants(newLikedPlants);
    localStorage.setItem('verdure_liked_plants', JSON.stringify(newLikedPlants));
  };

  const getRecommendedPlants = () => {
    const likedPlantsData = plants.filter(plant => likedPlants.includes(plant.id));
    const commonTags = likedPlantsData.flatMap(plant => plant.tags);
    const tagFrequency: Record<string, number> = {};
    
    commonTags.forEach(tag => {
      tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
    });

    return plants
      .filter(plant => !likedPlants.includes(plant.id))
      .sort((a, b) => {
        const aScore = a.tags.reduce((score, tag) => score + (tagFrequency[tag] || 0), 0);
        const bScore = b.tags.reduce((score, tag) => score + (tagFrequency[tag] || 0), 0);
        return bScore - aScore;
      });
  };

  return (
    <PlantContext.Provider value={{
      plants,
      likedPlants,
      addPlant,
      likePlant,
      unlikePlant,
      getRecommendedPlants
    }}>
      {children}
    </PlantContext.Provider>
  );
};
