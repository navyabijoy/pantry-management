'use client'

import React, { useRef, useEffect } from "react";
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { CameraIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import {
  Input,
  Option,
  Select,
  Button,
  Dialog,
  IconButton,
  Typography,
  DialogBody,
  DialogHeader,
  DialogFooter,
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/router';
import { getGoTrueClient } from '../../utils/goTrueClient';

// Use authClient for authentication operations
export function AddProductDialog({ open, setOpen, editMode, formData, setFormData, refreshItems, router }) {
  const [model, setModel] = React.useState(null);
  const [imagePreview, setImagePreview] = React.useState(null);
  const [predictions, setPredictions] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const [session, setSession] = React.useState(null);
  const authClient = getGoTrueClient();
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);

  // Initialize Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  // Check for session on component mount
  useEffect(() => {
    const getSession = async () => {
      const { data: { session }, error } = await authClient.getSession();
      if (error) {
        console.error('Error getting session:', error);
      } else {
        console.log('Session:', session);
        setSession(session);
      }
    };
  
    getSession();
  
    const { data: { subscription } } = authClient.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', session);
      setSession(session);
    });
  
    return () => subscription.unsubscribe();
  }, [authClient]);

  // Load MobileNet model
  React.useEffect(() => {
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

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session);
    });
  }, []);
  // Modified image upload handler with session check
  const handleImageUpload = async (e) => {
    

    const file = e.target.files[0];
    if (file) {
      setIsLoading(true);
      try {
        // Create preview
        const preview = URL.createObjectURL(file);
        setImagePreview(preview);

        // Predict with MobileNet
        const img = new Image();
        img.src = preview;
        img.onload = async () => {
          if (model) {
            const predictions = await model.classify(img);
            setPredictions(predictions);
            if (predictions[0].probability > 0.8) {
              setFormData(prev => ({ ...prev, name: predictions[0].className }));
            }
          }
        };

        const user = session.user;
        
        // Upload to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${user.id}/${Date.now()}_${fileName}`;

        const { data, error } = await supabase.storage
          .from('items')
          .upload(filePath, file);

        if (error) throw error;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('items')
          .getPublicUrl(filePath);

        // Update form data with image URL
        setFormData(prev => ({ 
          ...prev,
          image_url: publicUrl
        }));

      } catch (error) {
        console.error('Error processing image:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  // Handle camera capture
  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    } catch (error) {
      console.error('Error accessing camera:', error);
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
      
      // Stop camera stream
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach(track => track.stop());
    }, 'image/jpeg');
  };

  // Modified submit handler with session check
  // At the top of your component, add this immediately after initializing supabase
useEffect(() => {
  const checkInitialSession = async () => {
    const { data, error } = await supabase.auth.getSession();
    console.log('Initial session check:', data.session);
    if (error) console.error('Session check error:', error);
  };
  checkInitialSession();
}, []);

const handleSubmit = async () => {
  console.log('Starting submission...');
  console.log('Current session state:', session);

  // Get current session directly from supabase
  const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
  console.log('Fresh session check:', currentSession);
  if (sessionError) {
    console.error('Session error:', sessionError);
  }

  // if (!currentSession) {
  //   console.error('No user logged in');
  //   return;
  // }

  try {
    const { data, error } = await supabase
      .from('pantry_items')
      .insert([{
        item_name: formData.item_name,
        quantity: parseInt(formData.quantity),
        unit: formData.unit,
        image_url: formData.image_url,
        user_id: currentSession.user.id
      }]);

    if (error) {
      console.error('Insert error:', error);
      throw error;
    }

    console.log('Item added successfully:', data);
    setOpen(false);
    setFormData({ item_name: '', quantity: '', unit: '', image_url: '' });
    if (refreshItems) refreshItems();
  } catch (error) {
    console.error('Error adding item:', error);
  }
};
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
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Session:', session);
      if (!session && router) {
        router.replace('/login');
      }
    };

    checkSession();
  }, [supabase, router]);

  const fetchItems = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.error('No user logged in');
        return;
      }

      console.log('Fetching items for user:', session.user.id);

      const { data, error } = await supabase
        .from('pantry_items')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      console.log('Fetched items:', data);
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching items:', error.message);
    }
  };

  return (
    <>
      <Button 
        onClick={handleOpen} 
        variant="gradient" 
        className="bg-customYellow text-white font-bold rounded-lg p-2 w-40  h-10 text-center text-sm"
      >
        Add Item
      </Button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={handleClose} />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <Dialog 
              size="sm" 
              open={open} 
              handler={handleClose}
              className="relative w-full max-w-md rounded-lg bg-white p-4 shadow-xl"
            >
              <DialogHeader>
                <Typography variant="h1" color="blue-gray text-xl font-bold">
                  Add New Item
                </Typography>
                <IconButton
                  size="sm"
                  variant="text"
                  className="!absolute right-1 top-0"
                  onClick={handleClose}
                >
                  <XMarkIcon className="h-4 w-4 stroke-2" />
                </IconButton>
              </DialogHeader>
              <DialogBody className="space-y-4 pb-6 max-h-[80vh] overflow-y-auto">
                <div>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="mb-2 text-left font-medium"
                  >
                    Name
                  </Typography>
                  <Input
                    color="gray"
                    size="lg"
                    placeholder="  eg. Tomatoes"
                    name="name"
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
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="mb-2 text-left font-medium"
                    >
                      Quantity
                    </Typography>
                    <Input
                      color="gray"
                      size="lg"
                      placeholder="  eg. 10"
                      name="weight"
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
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="mb-2 text-left font-medium"
                    >
                      Metric
                    </Typography>
                    <Select
                      className="!w-full !border-[1.5px] !border-blue-gray-200/90 bg-white text-gray-800 ring-4 ring-transparent placeholder:text-gray-600 focus:!border-primary"
                      placeholder="Select Metric"
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
                    
                    <Button
                      size="sm"
                      className="flex items-center gap-2 text-black"
                      onClick={handleCameraCapture}
                    >
                      <CameraIcon className="h-4 w-4 text-black" />
                      Take Photo
                    </Button>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />

                  {/* Camera Preview */}
                  <video
                    ref={videoRef}
                    className={`w-full ${!videoRef.current?.srcObject ? 'hidden' : ''}`}
                  />
                  {videoRef.current?.srcObject && (
                    <Button onClick={captureImage} className="text-white bg-customYellow w-full mt-2 rounded-lg font-bold p-2">Capture</Button>
                  )}

                  {/* Image Preview */}
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
          </div>
        </>
      )}
    </>
  );
}