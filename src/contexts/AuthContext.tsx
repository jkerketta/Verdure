import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface User {
  id: string;
  email: string;
  name: string;
  city?: string;
  favoritePlantType?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    email: string,
    password: string,
    name: string,
    city: string,
    favoritePlantType: string
  ) => Promise<any>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, location, favorite_plant_type, avatar_url')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        throw error;
      }
      
      if (data) {
        const userProfile = {
          id: data.id,
          name: data.full_name,
          email: data.email,
          city: data.location,
          favoritePlantType: data.favorite_plant_type,
          avatar: data.avatar_url,
        };
        setUser(userProfile);
      }
    } catch (error: any) {
      console.error("Error fetching profile:", error.message);
      setUser(null);
    }
  };

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          await fetchProfile(session.user.id);
        }
      } catch (error) {
        console.error("Error in getSession:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error || !data.session) {
        throw error || new Error('Login failed');
      }
      await fetchProfile(data.session.user.id);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    email: string,
    password: string,
    name: string,
    city: string,
    favoritePlantType: string
  ) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            location: city,
            favorite_plant_type: favoritePlantType,
            avatar_url: 'https://em-content.zobj.net/source/twitter/391/potted-plant_1fab4.png',
          },
        },
      });

      if (error) {
        throw error;
      }

      // The onAuthStateChange listener will handle setting the user state.
      // This function will return the session if email confirmation is disabled,
      // and just the user if it's enabled. We'll use that in the UI.
      return data;

    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
