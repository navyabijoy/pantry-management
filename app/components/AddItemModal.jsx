import React, { useState, useRef, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import useAuthModal from '@/hooks/useAuthModal';
import {
  Input,
  Button,
  Dialog,
  Select,
  Option,
  IconButton,
  Typography,
  DialogBody,
  DialogHeader,
  DialogFooter,
} from "@material-tailwind/react";
import { CameraIcon, PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useSupabase } from '@/providers/SupabaseProvider';

export function AddItemModal({ open, setOpen, refreshItems }) {
  const [formData, setFormData] = useState({
    item_name: '',
    quantity: '',
    unit: '',
    image_url: ''
  });
  const [model, setModel] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const { supabase } = useSupabase();
  const [imagePreview, setImagePreview] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);

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

  useEffect(() => {
    const loadModel = async () => {
      try {
        const loadedModel = await mobilenet.load();
        setModel(loadedModel);
      } catch (error) {
        console.error('Failed to load MobileNet model:', error);
      }
    };
    loadModel();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMetricChange = (value) => {
    setFormData((prev) => ({ ...prev, unit: value }));
  };
  
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'pantry_management');

            const response = await fetch('https://api.cloudinary.com/v1_1/dmjjyduak/image/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            console.log('Cloudinary response:', data);

            if (data.secure_url) {
                const imageUrl = data.secure_url;
                setFormData((prev) => ({ ...prev, image_url: imageUrl }));
                setImagePreview(imageUrl);
            } else {
                console.error('Error uploading image:', data.error);
            }
        } catch (error) {
            console.error('Error processing image:', error);
        } finally {
            setIsLoading(false);
        }
    }
};

  const captureImage = async () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
    
    canvas.toBlob(async (blob) => {
      const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
      await handleImageUpload({ target: { files: [file] } });
      
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach(track => track.stop());
    }, 'image/jpeg');
  };

  const handleSubmit = async () => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            console.error('User not authenticated');
            return;
        }

        const dataToInsert = { ...formData, user_id: user.id };

        const { data, error } = await supabase
            .from('pantry_items')
            .insert([dataToInsert]);

        if (error) {
            console.error('Error adding item:', error);
            return;
        }

        console.log('Item added:', data);
        setOpen(false);
        setAddModalOpen(false);
        setFormData({ item_name: '', quantity: '', unit: '', image_url: '' });

        if (refreshItems) refreshItems();
    } catch (error) {
        console.error('Unexpected error:', error);
    }
  };

  return (
    <>
      <button
      onClick={() => setAddModalOpen(true)}
    >
    </button>
      <Dialog open={open} handler={setOpen}>
        <DialogHeader>
          <Typography variant="h1" color="blue-gray text-xl font-bold">
            Add New Item
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
              className="placeholder:opacity-100 focus:!border-t-gray-900 p-3"
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
                className="placeholder:opacity-100 focus:!border-t-gray-900 p-3"
                containerProps={{
                  className: "!min-w-full",
                }}
                labelProps={{
                  className: "hidden",
                }}
              />
            </div>
            <div className="w-full">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="mb-2 text-left font-medium"
                    >
                      Metric
                    </Typography>
                    <Select
                      className="!w-full !border-[1.5px] !border-blue-gray-200/90 bg-white text-gray-800 ring-4 ring-transparent placeholder:text-gray-600 focus:!border-primary"
                      onChange={handleMetricChange}
                      placeholder="Select Metric"
                      labelProps={{
                        className: "hidden",
                      }}
                    >
                      {METRIC_OPTIONS.map((option) => (
                        <Option key={option.value} value={option.value} className="text-gray-600 font-normal text-sm cursor-pointer hover:bg-gray-100 ml-1 py-1 p-3">
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </div>
          </div>
          <div className="space-y-2">
            <Typography variant="small" color="blue-gray" className="mb-2 font-medium text-black">
              Image
            </Typography>
            <div className="flex gap-2">
              <Button
                size="sm"
                className="flex items-center gap-2 text-black"
                onClick={() => fileInputRef.current.click()}
              >
                <PhotoIcon className="h-4 w-4 text-black" />
                Upload Image
              </Button>
              
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
            <video
              ref={videoRef}
              className={`w-full ${!videoRef.current?.srcObject ? 'hidden' : ''}`}
            />
            {videoRef.current?.srcObject && (
              <Button onClick={captureImage} className="text-white bg-customYellow w-full mt-2 rounded-lg font-bold p-2">Capture</Button>
            )}
            {imagePreview && (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-w-full h-auto rounded"
                />
                {predictions.length > 0 && (
                  <div className="mt-2">
                    <Typography variant="small" className="font-medium">
                      Detected: {predictions[0].className} 
                      ({Math.round(predictions[0].probability * 100)}% confidence)
                    </Typography>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            className="ml-auto items-center bg-customYellow text-white font-bold rounded-lg p-2 w-20 h-10 text-center text-sm"
            onClick={handleSubmit}
          >
            Add Item
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}