import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Sun, Droplets, Heart, MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Plant, usePlants } from '@/contexts/PlantContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';

interface Profile {
  id: string;
  full_name: string;
  avatar_url: string | null;
}

const PlantDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { likedPlants, likePlant, unlikePlant } = usePlants();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [plant, setPlant] = useState<Plant | null>(null);
  const [owner, setOwner] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPlantAndOwner = async () => {
      if (!id) return;

      setIsLoading(true);
      // Fetch plant details
      const { data: plantData, error: plantError } = await supabase
        .from('plants')
        .select('*')
        .eq('id', id)
        .single();

      if (plantError || !plantData) {
        toast({ title: "Error", description: "Plant not found.", variant: "destructive" });
        navigate('/browse');
        return;
      }
      setPlant(plantData);

      // Fetch owner profile
      const { data: ownerData, error: ownerError } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .eq('id', plantData.owner_id)
        .single();
      
      if (ownerData) {
        setOwner(ownerData);
      }
      
      setIsLoading(false);
    };

    fetchPlantAndOwner();
  }, [id, navigate]);

  const isLiked = plant ? likedPlants.includes(plant.id) : false;
  const isOwner = user && plant && plant.owner_id === user.id;

  if (isLoading) {
    return <div className="text-center p-8">Loading plant details...</div>;
  }

  if (!plant) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Plant not found</h2>
        <Button asChild>
          <Link to="/browse">← Back to Browse</Link>
        </Button>
      </div>
    );
  }

  const handleToggleLike = () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to save plants to your favorites",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    if (isLiked) {
      unlikePlant(plant.id);
      toast({ title: "Removed from favorites", description: `${plant.name} has been removed from your favorites` });
    } else {
      likePlant(plant.id);
      toast({ title: "Added to favorites", description: `${plant.name} has been added to your favorites` });
    }
  };

  const handleContact = () => {
    if (!user) {
      toast({ title: "Login required", description: "Please log in to contact plant owners", variant: "destructive" });
      navigate('/login');
      return;
    }
    toast({ title: "Contact feature coming soon!", description: "Messaging functionality will be available in a future update" });
  };

  const getLightIcon = (level: string) => {
    const iconProps = { size: 20 };
    switch (level) {
      case 'high': return <Sun className="text-yellow-500" {...iconProps} />;
      case 'medium': return <Sun className="text-orange-400" {...iconProps} />;
      case 'low': return <Sun className="text-gray-400" {...iconProps} />;
      default: return <Sun {...iconProps} />;
    }
  };

  const getWaterIcon = (level: string) => {
    const iconProps = { size: 20 };
    switch (level) {
      case 'high': return <Droplets className="text-blue-500" {...iconProps} />;
      case 'medium': return <Droplets className="text-blue-400" {...iconProps} />;
      case 'low': return <Droplets className="text-gray-400" {...iconProps} />;
      default: return <Droplets {...iconProps} />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 mb-20 md:mb-0">
      <Button variant="ghost" asChild className="mb-6">
        <Link to="/browse"><ArrowLeft className="mr-2" size={16} />Back to Browse</Link>
      </Button>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden">
            <img
              src={plant.image_url}
              alt={plant.name}
              className="w-full h-96 lg:h-[500px] object-cover"
            />
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 text-lg font-bold text-green-700">
              ${plant.price}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{plant.name}</h1>
            <p className="text-lg text-gray-600 italic">{plant.species}</p>
            <div className="flex items-center space-x-2 mt-2">
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                {plant.size}
              </span>
              {plant.tags.map(tag => (
                <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">{tag}</span>
              ))}
            </div>
          </div>

          <p className="text-gray-700 leading-relaxed">{plant.description}</p>

          <div className="bg-green-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Care Requirements</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                {getLightIcon(plant.light_needs)}
                <span className="text-sm text-gray-700 capitalize">{plant.light_needs} Light</span>
              </div>
              <div className="flex items-center space-x-2">
                {getWaterIcon(plant.water_needs)}
                <span className="text-sm text-gray-700 capitalize">{plant.water_needs} Water</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin size={18} />
              <span>{plant.location}</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Delivery Options:</h4>
              <div className="flex flex-wrap gap-2">
                {plant.delivery_options.map(option => (
                  <span key={option} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {owner && (
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <img
                  src={owner.avatar_url || `https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face`}
                  alt={owner.full_name}
                  className="w-12 h-12 rounded-full border-2 border-green-100"
                />
                <div>
                  <p className="font-medium text-gray-900">{owner.full_name}</p>
                  <p className="text-sm text-gray-500">Plant parent</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {!isOwner && (
              <>
                <Button onClick={handleContact} className="w-full bg-green-600 hover:bg-green-700" size="lg">
                  <MessageCircle className="mr-2" size={20} />Contact Owner
                </Button>
                <Button onClick={handleToggleLike} variant="outline" className="w-full" size="lg">
                  <Heart className={`mr-2 ${isLiked ? 'fill-current text-red-500' : ''}`} size={20} />
                  {isLiked ? 'Remove from Favorites' : 'Add to Favorites'}
                </Button>
              </>
            )}
            {isOwner && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm font-medium">This is your listing</p>
                <p className="text-blue-600 text-sm">Manage your listing from your profile page</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantDetailPage;
