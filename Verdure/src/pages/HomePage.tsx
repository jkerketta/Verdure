import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Heart, Search } from 'lucide-react';
import { usePlants } from '@/contexts/PlantContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import PlantCard from '@/components/PlantCard';

const HomePage = () => {
  const { plants } = usePlants();
  const { user } = useAuth();
  const featuredPlants = plants.filter(plant => plant.is_featured).slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-emerald-500/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              {user ? (
                <>
                  Welcome back, <span className="text-green-600">{user.name}</span>!
                </>
              ) : (
                <>
                  Give Your Plants a <span className="text-green-600">New Home</span>
                </>
              )}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Connect with fellow plant lovers. Find new green friends or rehome plants you can no longer care for.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <>
                  <Button size="lg" asChild className="bg-green-600 hover:bg-green-700">
                    <Link to="/browse">
                      <Search className="mr-2" size={20} />
                      Browse Plants
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/swipe">
                      <Heart className="mr-2" size={20} />
                      Plant Swipe
                    </Link>
                  </Button>
                </>
              ) : (
                <Button size="lg" asChild className="bg-green-600 hover:bg-green-700">
                  <Link to="/login">Join Now</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How Verdure Works
            </h2>
            <p className="text-lg text-gray-600">
              Simple steps to rehome plants or find your next green companion
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-green-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Discover Plants</h3>
              <p className="text-gray-600">
                Browse local listings or use our Plant Swipe feature to find plants you'll love
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-green-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect</h3>
              <p className="text-gray-600">
                Message plant owners directly to arrange pickup or delivery
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="text-green-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Rehome</h3>
              <p className="text-gray-600">
                Give your plants a loving new home when you can no longer care for them
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Plants */}
      <section className="py-20 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Featured Plants
              </h2>
              <p className="text-gray-600">
                Recently added plants looking for new homes
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/browse">
                View All
                <ArrowRight className="ml-2" size={16} />
              </Link>
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPlants.map(plant => (
              <PlantCard key={plant.id} plant={plant} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Explore the Community
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Find your next favorite plant or connect with other enthusiasts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/browse">Browse Plants</Link>
            </Button>
            {user ? (
              <Button size="lg" variant="secondary" asChild>
                <Link to="/profile">Go to Profile</Link>
              </Button>
            ) : (
              <Button size="lg" variant="secondary" asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
