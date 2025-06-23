import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface Plant {
  id: string;
  name: string;
  species: string;
  image_url: string;
  price: number;
  size: 'small' | 'medium' | 'large';
  light_needs: 'low' | 'medium' | 'high';
  water_needs: 'low' | 'medium' | 'high';
  description: string;
  location: string;
  delivery_options: string[];
  owner_id: string;
  tags: string[];
  is_featured?: boolean;
  created_at: string;
}

interface PlantContextType {
  plants: Plant[];
  isLoading: boolean;
  addPlant: (plant: Omit<Plant, 'id' | 'created_at' | 'owner_id'>) => Promise<void>;
  getRecommendedPlants: (userId: string | null) => Plant[];
  likedPlants: string[];
  likePlant: (plantId: string) => void;
  unlikePlant: (plantId: string) => void;
}

const PlantContext = createContext<PlantContextType | undefined>(undefined);

export const usePlants = () => {
  const context = useContext(PlantContext);
  if (context === undefined) {
    throw new Error('usePlants must be used within a PlantProvider');
  }
  return context;
};

const seedInitialData = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null; // Can't seed without a user

  const mockPlantData = [
    { name: 'Monstera Albo', species: 'Monstera deliciosa \'Albo Variegata\'', description: 'Highly sought-after variegated Monstera with stunning white patches. Fully rooted with new growth.', price: 150, size: 'medium', light_needs: 'medium', water_needs: 'medium', location: 'San Francisco, CA', delivery_options: ['pickup', 'local delivery'], tags: ['rare', 'variegated', 'collector'], image_url: 'https://images.unsplash.com/photo-1616220891820-24244d8b8a0d?w=400&h=400&fit=crop', is_featured: true },
    { name: 'ZZ Plant', species: 'Zamioculcas zamiifolia', description: 'The perfect plant for beginners. Extremely low-maintenance and thrives on neglect.', price: 30, size: 'medium', light_needs: 'low', water_needs: 'low', location: 'New York, NY', delivery_options: ['pickup'], tags: ['beginner', 'low-maintenance', 'drought-tolerant'], image_url: 'https://images.unsplash.com/photo-1612048992211-5b22b7d8d086?w=400&h=400&fit=crop', is_featured: true },
    { name: 'Calathea Orbifolia', species: 'Calathea orbifolia', description: 'Beautiful plant with large, round leaves striped with silver. Requires higher humidity.', price: 45, size: 'large', light_needs: 'medium', water_needs: 'high', location: 'Miami, FL', delivery_options: ['pickup'], tags: ['pet-friendly', 'humidity-loving'], image_url: 'https://images.unsplash.com/photo-1598233306935-3ba0a7c49156?w=400&h=400&fit=crop', is_featured: false },
    { name: 'String of Pearls', species: 'Senecio rowleyanus', description: 'Lovely trailing succulent with pearl-like leaves. Perfect for hanging baskets.', price: 20, size: 'small', light_needs: 'high', water_needs: 'low', location: 'Austin, TX', delivery_options: ['pickup', 'shipping'], tags: ['trailing', 'succulent', 'hanging-plant'], image_url: 'https://images.unsplash.com/photo-1620138243365-d0c3c834a36f?w=400&h=400&fit=crop', is_featured: false },
    { name: 'Pink Princess Philodendron', species: 'Philodendron erubescens \'Pink Princess\'', description: 'Stunning philodendron with vibrant pink variegation on dark green leaves. A must-have!', price: 85, size: 'medium', light_needs: 'medium', water_needs: 'medium', location: 'Los Angeles, CA', delivery_options: ['pickup'], tags: ['trendy', 'pink-plant', 'variegated'], image_url: 'https://images.unsplash.com/photo-1629126487994-555e78b8a0d?w=400&h=400&fit=crop', is_featured: true },
    { name: 'Bird of Paradise', species: 'Strelitzia nicolai', description: 'Large, upright plant that gives a tropical feel to any room. About 4 feet tall and very healthy.', price: 75, size: 'large', light_needs: 'high', water_needs: 'medium', location: 'San Diego, CA', delivery_options: ['pickup'], tags: ['tropical', 'statement', 'floor-plant'], image_url: 'https://images.unsplash.com/photo-1560942485-0679b882d33b?w=400&h=400&fit=crop', is_featured: false },
    { name: 'Chinese Money Plant', species: 'Pilea peperomioides', description: 'Quirky and charming plant with pancake-shaped leaves. Very easy to propagate and share.', price: 25, size: 'small', light_needs: 'medium', water_needs: 'medium', location: 'Portland, OR', delivery_options: ['pickup', 'local delivery'], tags: ['easy-to-propagate', 'pet-friendly'], image_url: 'https://images.unsplash.com/photo-1509423350611-21c33e8b6b15?w=400&h=400&fit=crop', is_featured: false },
    { name: 'Aglaonema Red Siam', species: 'Aglaonema \'Siam Aurora\'', description: 'A very colorful and easy-care plant. Its green leaves are edged and veined in red.', price: 35, size: 'medium', light_needs: 'low', water_needs: 'medium', location: 'Chicago, IL', delivery_options: ['pickup'], tags: ['colorful', 'low-light', 'easy-care'], image_url: 'https://images.unsplash.com/photo-1599898555813-f5b9ea1b2e88?w=400&h=400&fit=crop', is_featured: false },
    { name: 'Fiddle Leaf Fig Tree', species: 'Ficus lyrata', description: 'A tall and dramatic Fiddle Leaf Fig. It has been acclimated for over a year and is very stable. About 5ft tall.', price: 120, size: 'large', light_needs: 'high', water_needs: 'medium', location: 'Seattle, WA', delivery_options: ['pickup'], tags: ['statement', 'tree', 'popular'], image_url: 'https://images.unsplash.com/photo-1586770285491-944efbbc1bb9?w=400&h=400&fit=crop', is_featured: true },
    { name: 'Sweetheart Hoya', species: 'Hoya kerrii', description: 'A single-leaf cutting of a Hoya Kerrii, rooted in a small pot. It makes a great gift.', price: 15, size: 'small', light_needs: 'high', water_needs: 'low', location: 'Denver, CO', delivery_options: ['shipping'], tags: ['hoya', 'succulent', 'gift'], image_url: 'https://images.unsplash.com/photo-1593454282361-8a436e29683e?w=400&h=400&fit=crop', is_featured: false }
  ];

  const { data, error } = await supabase
    .from('plants')
    .insert(mockPlantData.map(p => ({ ...p, owner_id: user.id })))
    .select();

  if (error) {
    toast({ title: "Error seeding database", description: error.message, variant: "destructive" });
    return null;
  }
  
  return data;
};

export const PlantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [likedPlants, setLikedPlants] = useState<string[]>([]);

  useEffect(() => {
    const initializePlants = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('plants')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({ title: 'Error fetching plants', description: error.message, variant: 'destructive' });
        setPlants([]);
      } else if (data.length === 0) {
        toast({ title: "Welcome!", description: "Adding some demo plants to get you started." });
        const seededPlants = await seedInitialData();
        if (seededPlants) {
          setPlants(seededPlants);
        }
      } else {
        setPlants(data);
      }
      setIsLoading(false);
    };
    initializePlants();
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) {
        setLikedPlants([]);
        return;
      }
      const { data, error } = await supabase
        .from('favorites')
        .select('plant_id')
        .eq('user_id', user.id);
      if (error) {
        setLikedPlants([]);
      } else {
        setLikedPlants(data.map((fav: { plant_id: string }) => fav.plant_id));
      }
    };
    fetchFavorites();
  }, [user]);

  const addPlant = async (plantData: Omit<Plant, 'id' | 'created_at' | 'owner_id'>) => {
    const { data, error } = await supabase
      .from('plants')
      .insert([plantData])
      .select();

    if (error) {
      throw new Error(error.message);
    }

    if (data) {
      setPlants(prev => [data[0], ...prev]);
    }
  };
  
  const likePlant = async (plantId: string) => {
    if (!user) return;
    setLikedPlants(prev => [...prev, plantId]);
    await supabase.from('favorites').upsert({ user_id: user.id, plant_id: plantId });
  };

  const unlikePlant = async (plantId: string) => {
    if (!user) return;
    setLikedPlants(prev => prev.filter(id => id !== plantId));
    await supabase.from('favorites').delete().eq('user_id', user.id).eq('plant_id', plantId);
  };

  const getRecommendedPlants = (userId: string | null) => {
    if (!userId) {
      return plants.filter(plant => !likedPlants.includes(plant.id));
    }
    return plants.filter(plant => plant.owner_id !== userId && !likedPlants.includes(plant.id));
  };

  return (
    <PlantContext.Provider value={{
      plants,
      isLoading,
      addPlant,
      getRecommendedPlants,
      likedPlants,
      likePlant,
      unlikePlant
    }}>
      {children}
    </PlantContext.Provider>
  );
};
