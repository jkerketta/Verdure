
import { useState } from 'react';
import { Heart, X, RotateCcw } from 'lucide-react';
import { usePlants } from '@/contexts/PlantContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import PlantCard from '@/components/PlantCard';
import { Link } from 'react-router-dom';

const PlantSwipePage = () => {
  const { user } = useAuth();
  const { getRecommendedPlants, likePlant, likedPlants } = usePlants();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastAction, setLastAction] = useState<'like' | 'pass' | null>(null);
  
  const recommendedPlants = getRecommendedPlants();
  const currentPlant = recommendedPlants[currentIndex];

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="text-green-600" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
          <p className="text-gray-600">You need to be logged in to use Plant Swipe</p>
        </div>
        <Button asChild className="bg-green-600 hover:bg-green-700">
          <Link to="/login">Login to Continue</Link>
        </Button>
      </div>
    );
  }

  const handleLike = () => {
    if (currentPlant) {
      likePlant(currentPlant.id);
      setLastAction('like');
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePass = () => {
    setLastAction('pass');
    setCurrentIndex(prev => prev + 1);
  };

  const handleUndo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setLastAction(null);
    }
  };

  if (currentIndex >= recommendedPlants.length) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="text-green-600" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">All caught up!</h2>
          <p className="text-gray-600 mb-6">
            You've seen all available plants. Check back later for new listings!
          </p>
          <div className="space-y-3">
            <Button 
              onClick={() => setCurrentIndex(0)} 
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Start Over
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link to="/browse">Browse All Plants</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8 mb-20 md:mb-0">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Plant Swipe</h1>
        <p className="text-gray-600">Swipe to find plants you'll love</p>
        <div className="mt-2 text-sm text-gray-500">
          {currentIndex + 1} of {recommendedPlants.length}
        </div>
      </div>

      {currentPlant ? (
        <div className="space-y-6">
          <div className="relative">
            <PlantCard 
              plant={currentPlant} 
              showActions={true}
              onLike={handleLike}
              onPass={handlePass}
            />
            
            {/* Action feedback */}
            {lastAction && currentIndex > 0 && (
              <div className="absolute top-4 left-4 right-4 flex justify-center">
                <div className={`px-4 py-2 rounded-full text-white font-medium ${
                  lastAction === 'like' ? 'bg-green-500' : 'bg-red-500'
                }`}>
                  {lastAction === 'like' ? 'Liked!' : 'Passed'}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              size="lg"
              onClick={handlePass}
              className="w-16 h-16 rounded-full border-red-200 text-red-600 hover:bg-red-50"
            >
              <X size={24} />
            </Button>
            
            {currentIndex > 0 && (
              <Button
                variant="outline"
                size="lg"
                onClick={handleUndo}
                className="w-16 h-16 rounded-full border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                <RotateCcw size={20} />
              </Button>
            )}
            
            <Button
              size="lg"
              onClick={handleLike}
              className="w-16 h-16 rounded-full bg-green-600 hover:bg-green-700"
            >
              <Heart size={24} />
            </Button>
          </div>

          <div className="text-center text-sm text-gray-500">
            <p>❤️ Like • ✕ Pass • ↻ Undo</p>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading plants...</p>
        </div>
      )}
    </div>
  );
};

export default PlantSwipePage;
