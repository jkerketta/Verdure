
import { Link } from 'react-router-dom';
import { MapPin, Sun, Droplets, DollarSign } from 'lucide-react';
import { Plant } from '@/contexts/PlantContext';
import { Button } from '@/components/ui/button';

interface PlantCardProps {
  plant: Plant;
  showActions?: boolean;
  onLike?: () => void;
  onPass?: () => void;
}

const PlantCard: React.FC<PlantCardProps> = ({ 
  plant, 
  showActions = false, 
  onLike, 
  onPass 
}) => {
  const getLightIcon = (level: string) => {
    const iconProps = { size: 16 };
    switch (level) {
      case 'high': return <Sun className="text-yellow-500" {...iconProps} />;
      case 'medium': return <Sun className="text-orange-400" {...iconProps} />;
      case 'low': return <Sun className="text-gray-400" {...iconProps} />;
      default: return <Sun {...iconProps} />;
    }
  };

  const getWaterIcon = (level: string) => {
    const iconProps = { size: 16 };
    switch (level) {
      case 'high': return <Droplets className="text-blue-500" {...iconProps} />;
      case 'medium': return <Droplets className="text-blue-400" {...iconProps} />;
      case 'low': return <Droplets className="text-gray-400" {...iconProps} />;
      default: return <Droplets {...iconProps} />;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={plant.image}
          alt={plant.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-sm font-medium text-green-700">
          ${plant.price}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">{plant.name}</h3>
            <p className="text-sm text-gray-500 italic">{plant.species}</p>
          </div>
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
            {plant.size}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {plant.description}
        </p>
        
        <div className="flex items-center space-x-4 mb-3 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            {getLightIcon(plant.lightNeeds)}
            <span className="capitalize">{plant.lightNeeds} light</span>
          </div>
          <div className="flex items-center space-x-1">
            {getWaterIcon(plant.waterNeeds)}
            <span className="capitalize">{plant.waterNeeds} water</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 mb-4 text-sm text-gray-500">
          <MapPin size={14} />
          <span>{plant.location}</span>
        </div>
        
        {showActions ? (
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onPass}
              className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
            >
              Pass
            </Button>
            <Button 
              size="sm" 
              onClick={onLike}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              Like
            </Button>
          </div>
        ) : (
          <Button asChild size="sm" className="w-full bg-green-600 hover:bg-green-700">
            <Link to={`/plant/${plant.id}`}>View Details</Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default PlantCard;
