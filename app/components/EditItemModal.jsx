// client/app/components/EditItemModal.jsx
import React, { useState, useEffect } from 'react';
import {
  Input,
  Select,
  Option,
  Button,
  Dialog,
  IconButton,
  Typography,
  DialogBody,
  DialogHeader,
  DialogFooter,
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useSupabase } from '@/providers/SupabaseProvider';

export function EditItemModal({ open, setOpen, itemData, refreshItems }) {
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
          quantity: parseInt(formData.quantity),
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
    <Dialog open={open} handler={setOpen}>
      <DialogHeader>
        <Typography variant="h1" color="blue-gray text-xl font-bold">
          Edit Item
        </Typography>
        <IconButton
          size="sm"
          variant="text"
          className="!absolute right-1 top-0"
          onClick={() => setOpen(false)}
        >
          <XMarkIcon className="h-4 w-4 stroke-2" />
        </IconButton>
      </DialogHeader>
      <DialogBody className="space-y-4 pb-6 max-h-[80vh] overflow-y-auto">
        <div>
          <Typography variant="small" color="blue-gray" className="mb-2 text-left font-medium">
            Name
          </Typography>
          <Input
            color="gray"
            size="lg"
            placeholder="eg. Tomatoes"
            name="item_name"
            value={formData.item_name}
            onChange={handleInputChange}
            className="placeholder:opacity-100 focus:!border-t-gray-900"
            containerProps={{
              className: "!min-w-full",
            }}
            labelProps={{
              className: "hidden",
            }}
          />
        </div>
        <div className="flex gap-4">
          <div className="w-full">
            <Typography variant="small" color="blue-gray" className="mb-2 text-left font-medium">
              Quantity
            </Typography>
            <Input
              color="gray"
              size="lg"
              placeholder="eg. 10"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              className="placeholder:opacity-100 focus:!border-t-gray-900"
              containerProps={{
                className: "!min-w-full",
              }}
              labelProps={{
                className: "hidden",
              }}
            />
          </div>
          <div className="w-full">
            <Typography variant="small" color="blue-gray" className="mb-2 text-left font-medium">
              Metric
            </Typography>
            <Select
              className="!w-full !border-[1.5px] !border-blue-gray-200/90 bg-white text-gray-800 ring-4 ring-transparent placeholder:text-gray-600 focus:!border-primary"
              placeholder="Select Metric"
              value={formData.unit}
              onChange={(value) => setFormData((prev) => ({ ...prev, unit: value }))}
              labelProps={{
                className: "hidden",
              }}
            >
              {METRIC_OPTIONS.map((option) => (
                <Option key={option.value} value={option.value} className="text-gray-600 font-normal text-sm cursor-pointer hover:bg-gray-100 ml-1 py-1">
                  {option.label}
                </Option>
              ))}
            </Select>
          </div>
        </div>
        {/* Add more fields as necessary */}
      </DialogBody>
      <DialogFooter>
        <Button
          className="ml-auto items-center bg-customYellow text-white font-bold rounded-lg p-2 w-40 h-10 text-center text-sm"
          onClick={handleSubmit}
        >
          Save Changes
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

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