import React, { useState, useEffect } from 'react';
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useSupabase } from '@/providers/SupabaseProvider';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
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

export function EditItemSidebar({ open, setOpen, itemData, refreshItems }) {
  const [formData, setFormData] = useState({
    item_name: '',
    quantity: '',
    unit: '',
    image_url: ''
  });
  const { supabase } = useSupabase();

  useEffect(() => {
    if (itemData) {
      setFormData({
        item_name: itemData.item_name,
        quantity: itemData.quantity,
        unit: itemData.unit,
        image_url: itemData.image_url
      });
    }
  }, [itemData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const { data, error } = await supabase
        .from('pantry_items')
        .update({
          item_name: formData.item_name,
          quantity: parseFloat(formData.quantity),
          unit: formData.unit,
          image_url: formData.image_url
        })
        .eq('id', itemData.id);

      if (error) throw error;

      console.log('Item updated successfully:', data);
      setOpen(false);
      if (refreshItems) refreshItems();
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-bold">Edit Item</SheetTitle>
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
                type="number"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Metric</label>
              <Select 
                value={formData.unit} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, unit: value }))}
              >
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

          {formData.image_url && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Image</label>
              <img
                src={formData.image_url}
                alt={formData.item_name}
                className="w-full rounded-lg object-cover"
              />
            </div>
          )}

          <Button 
            className="w-full"
            onClick={handleSubmit}
          >
            Save Changes
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default EditItemSidebar;