import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { usePlants } from '@/contexts/PlantContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import PlantCard from '@/components/PlantCard';

const BrowsePage = () => {
  const { plants } = usePlants();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedLight, setSelectedLight] = useState<string>('');
  const [selectedWater, setSelectedWater] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  const filteredPlants = plants.filter(plant => {
    const matchesSearch = plant.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSize = !selectedSize || plant.size === selectedSize;
    const matchesLight = !selectedLight || plant.light_needs === selectedLight;
    const matchesWater = !selectedWater || plant.water_needs === selectedWater;
    const matchesPrice = !maxPrice || plant.price <= parseInt(maxPrice);
    
    return matchesSearch && matchesSize && matchesLight && matchesWater && matchesPrice;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-green-800">Browse Our Plants</h1>
      
      <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
        <div className="flex-grow">
          <Input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        
        <select
          value={selectedSize}
          onChange={(e) => setSelectedSize(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">All Sizes</option>
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
        
        <select
          value={selectedLight}
          onChange={(e) => setSelectedLight(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">All Light Needs</option>
          <option value="low">Low Light</option>
          <option value="medium">Medium Light</option>
          <option value="high">High Light</option>
        </select>
        
        <select
          value={selectedWater}
          onChange={(e) => setSelectedWater(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">All Water Needs</option>
          <option value="low">Low Water</option>
          <option value="medium">Medium Water</option>
          <option value="high">High Water</option>
        </select>
        
        <Input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Results */}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-gray-600">
          {filteredPlants.length} plant{filteredPlants.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {filteredPlants.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="text-gray-400" size={24} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No plants found</h3>
          <p className="text-gray-500">Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPlants.map(plant => (
            <PlantCard key={plant.id} plant={plant} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowsePage;
