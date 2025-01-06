import React, { useState, useRef } from 'react';
import { XMarkIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { useSupabase } from '@/providers/SupabaseProvider';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import toast from 'react-hot-toast';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "../components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

export function AddItemSidebar({ open, setOpen, refreshItems }) {
  const [formData, setFormData] = useState({
    item_name: '',
    quantity: '',
    unit: '',
    image_url: ''
  });
  const { supabase } = useSupabase();
  const [imagePreview, setImagePreview] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);


  const METRIC_OPTIONS = [
    { label: "Grams (g)", value: "grams" },
    { label: "Kilograms (kg)", value: "kilograms" },
    { label: "Pounds (lbs)", value: "pounds" },
    { label: "Ounces (oz)", value: "ounces" },
    { label: "Milliliters (ml)", value: "milliliters" },
    { label: "Liters (l)", value: "liters" },
    { label: "Pieces (pcs)", value: "pieces" },
    { label: "Packs", value: "packs" },
    { label: "Dozen", value: "dozen" },
    { label: "Units", value: "units" },
  ];
  

const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleMetricChange = (value) => {
    setFormData((prev) => ({ ...prev, unit: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const fileExt = file.name.split('.').pop();
      const fileName = `pantry_items/${user.id}-${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('pantry-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const { data: urlData } = await supabase.storage
        .from('pantry-images')
        .createSignedUrl(fileName, 60 * 60 * 24 * 365);

      if (!urlData?.signedUrl) {
        throw new Error('Failed to generate image URL');
      }

      const imageUrl = urlData.signedUrl;
      setFormData((prev) => ({ ...prev, image_url: imageUrl }));
      setImagePreview(imageUrl);

      toast.success('Image uploaded successfully');

    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error uploading image: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

    const handleSubmit = async () => {
    // Basic validation
    if (!formData.item_name.trim()) {
      toast.error('Please enter an item name');
      return;
    }
    
    if (!formData.quantity.trim()) {
      toast.error('Please enter a quantity');
      return;
    }
    
    if (!formData.unit) {
      toast.error('Please select a unit of measurement');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please log in to add items');
        return;
      }

      const dataToInsert = { 
        ...formData, 
        user_id: user.id,
        quantity: parseFloat(formData.quantity) // Ensure quantity is a number
      };

      const { data, error } = await supabase
        .from('pantry_items')
        .insert([dataToInsert]);

      if (error) {
        throw error;
      }

      toast.success('Item added successfully');

      setOpen(false);
      setFormData({ item_name: '', quantity: '', unit: '', image_url: '' });
      setImagePreview(null);
      setPredictions([]);

      if (refreshItems) refreshItems();
    } catch (error) {
      console.error('Error adding item:', error);
      toast.error('Error adding item: ' + error.message);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-bold">Add New Item</SheetTitle>
            <SheetClose className="rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100">
            </SheetClose>
          </div>
        </SheetHeader>

        <div className="mt-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input
              placeholder="eg. Tomatoes"
              name="item_name"
              value={formData.item_name}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Quantity</label>
              <Input
                placeholder="eg. 10"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Metric</label>
              <Select onValueChange={handleMetricChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Metric" />
                </SelectTrigger>
                <SelectContent>
                  {METRIC_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium">Image</label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => fileInputRef.current.click()}
                disabled={isLoading}
              >
                <PhotoIcon className="h-4 w-4" />
                {isLoading ? 'Uploading...' : 'Upload Image'}
              </Button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />

            
{imagePreview && (
          <div className="space-y-2">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full rounded-lg object-cover"
            />
            
            
          </div>
        )}
          </div>

          <Button 
            className="w-full"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Add Item'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default AddItemSidebar;