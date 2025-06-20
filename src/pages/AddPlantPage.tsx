
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin } from 'lucide-react';
import { usePlants } from '@/contexts/PlantContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

const AddPlantPage = () => {
  const { user } = useAuth();
  const { addPlant } = usePlants();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    description: '',
    price: '',
    size: 'medium' as 'small' | 'medium' | 'large',
    lightNeeds: 'medium' as 'low' | 'medium' | 'high',
    waterNeeds: 'medium' as 'low' | 'medium' | 'high',
    location: '',
    deliveryOptions: [] as string[],
    tags: [] as string[]
  });
  
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h2>
        <p className="text-gray-600 mb-6">You need to be logged in to list a plant</p>
        <Button asChild className="bg-green-600 hover:bg-green-700">
          <a href="/login">Login to Continue</a>
        </Button>
      </div>
    );
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDeliveryToggle = (option: string) => {
    setFormData(prev => ({
      ...prev,
      deliveryOptions: prev.deliveryOptions.includes(option)
        ? prev.deliveryOptions.filter(o => o !== option)
        : [...prev.deliveryOptions, option]
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.species || !formData.description || !formData.price) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Generate tags based on form data
      const autoTags = [];
      if (formData.size === 'small') autoTags.push('compact');
      if (formData.lightNeeds === 'low') autoTags.push('low-maintenance');
      if (formData.waterNeeds === 'low') autoTags.push('drought-tolerant');
      
      const plantData = {
        ...formData,
        price: parseInt(formData.price),
        image: imagePreview || 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop',
        ownerId: user.id,
        ownerName: user.name,
        ownerAvatar: user.avatar,
        tags: [...autoTags, 'indoor'],
        isFeatured: Math.random() > 0.7 // 30% chance to be featured
      };
      
      addPlant(plantData);
      
      toast({
        title: "Plant listed successfully!",
        description: "Your plant is now available for others to discover"
      });
      
      navigate('/profile');
    } catch (error) {
      toast({
        title: "Error listing plant",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 mb-20 md:mb-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">List Your Plant</h1>
        <p className="text-gray-600">Help your plant find a new loving home</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload */}
        <div className="space-y-2">
          <Label>Plant Photo</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-400 transition-colors">
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Plant preview"
                  className="mx-auto h-48 w-48 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => setImagePreview('')}
                >
                  Remove Photo
                </Button>
              </div>
            ) : (
              <div>
                <Camera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <div className="text-sm text-gray-600 mb-2">
                  <label className="cursor-pointer">
                    <span className="text-green-600 font-medium hover:text-green-500">
                      Upload a photo
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                  <span> or drag and drop</span>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
              </div>
            )}
          </div>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Plant Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="e.g., Fiddle Leaf Fig"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="species">Species/Scientific Name *</Label>
            <Input
              id="species"
              value={formData.species}
              onChange={(e) => handleInputChange('species', e.target.value)}
              placeholder="e.g., Ficus lyrata"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            rows={4}
            placeholder="Tell potential adopters about your plant's history, care needs, and why you're rehoming it..."
            required
          />
        </div>

        {/* Care Requirements */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="size">Size</Label>
            <select
              id="size"
              value={formData.size}
              onChange={(e) => handleInputChange('size', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lightNeeds">Light Needs</Label>
            <select
              id="lightNeeds"
              value={formData.lightNeeds}
              onChange={(e) => handleInputChange('lightNeeds', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="low">Low Light</option>
              <option value="medium">Medium Light</option>
              <option value="high">Bright Light</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="waterNeeds">Water Needs</Label>
            <select
              id="waterNeeds"
              value={formData.waterNeeds}
              onChange={(e) => handleInputChange('waterNeeds', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="low">Low Water</option>
              <option value="medium">Medium Water</option>
              <option value="high">High Water</option>
            </select>
          </div>
        </div>

        {/* Price and Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Price ($) *</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              placeholder="0"
              min="0"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="City, State"
                className="pl-10"
                required
              />
            </div>
          </div>
        </div>

        {/* Delivery Options */}
        <div className="space-y-2">
          <Label>Delivery Options</Label>
          <div className="flex flex-wrap gap-2">
            {['pickup', 'local delivery', 'shipping'].map(option => (
              <button
                key={option}
                type="button"
                onClick={() => handleDeliveryToggle(option)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  formData.deliveryOptions.includes(option)
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          {isSubmitting ? 'Listing Plant...' : 'List My Plant'}
        </Button>
      </form>
    </div>
  );
};

export default AddPlantPage;
