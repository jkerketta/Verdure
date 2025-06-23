import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Heart, Settings, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { usePlants } from '@/contexts/PlantContext';
import { Button } from '@/components/ui/button';
import PlantCard from '@/components/PlantCard';

const ProfilePage = () => {
  const { user } = useAuth();
  const { plants, likedPlants } = usePlants();
  const [activeTab, setActiveTab] = useState<'listings' | 'favorites'>('listings');

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h2>
        <p className="text-gray-600 mb-6">You need to be logged in to view your profile</p>
        <Button asChild className="bg-green-600 hover:bg-green-700">
          <Link to="/login">Login to Continue</Link>
        </Button>
      </div>
    );
  }

  const userPlants = plants.filter(plant => plant.owner_id === user.id);
  const favoritePlants = plants.filter(plant => likedPlants.includes(plant.id));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 mb-20 md:mb-0">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
        <div className="flex items-start space-x-4">
          <img
            src={user.avatar || `https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face`}
            alt={user.name}
            className="w-20 h-20 rounded-full border-4 border-green-100"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-gray-600 mb-1">{user.email}</p>
            {user.city && (
              <p className="text-gray-500 mb-1">City: {user.city}</p>
            )}
            {user.favoritePlantType && (
              <p className="text-gray-500 mb-1">Favorite Plant Type: {user.favoritePlantType}</p>
            )}
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <span>{userPlants.length} listings</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart size={14} />
                <span>{favoritePlants.length} favorites</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Button asChild className="bg-green-600 hover:bg-green-700 h-auto py-4">
          <Link to="/add-plant" className="flex flex-col items-center space-y-2">
            <Plus size={24} />
            <span>Add Plant</span>
          </Link>
        </Button>
        <Button variant="outline" asChild className="h-auto py-4">
          <Link to="/swipe" className="flex flex-col items-center space-y-2">
            <Heart size={24} />
            <span>Plant Swipe</span>
          </Link>
        </Button>
        <Button variant="outline" asChild className="h-auto py-4">
          <Link to="/browse" className="flex flex-col items-center space-y-2">
            <MapPin size={24} />
            <span>Browse</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex flex-col items-center space-y-2">
          <Settings size={24} />
          <span>Edit Profile</span>
        </Button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('listings')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'listings'
                  ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              My Listings ({userPlants.length})
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'favorites'
                  ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Favorites ({favoritePlants.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'listings' ? (
            <div>
              {userPlants.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="text-green-600" size={24} />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No listings yet</h3>
                  <p className="text-gray-500 mb-4">Start by listing your first plant</p>
                  <Button asChild className="bg-green-600 hover:bg-green-700">
                    <Link to="/add-plant">List a Plant</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userPlants.map(plant => (
                    <PlantCard key={plant.id} plant={plant} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              {favoritePlants.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="text-green-600" size={24} />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
                  <p className="text-gray-500 mb-4">Use Plant Swipe to discover plants you'll love</p>
                  <Button asChild className="bg-green-600 hover:bg-green-700">
                    <Link to="/swipe">Start Swiping</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favoritePlants.map(plant => (
                    <PlantCard key={plant.id} plant={plant} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
