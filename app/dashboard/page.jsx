'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/providers/SupabaseProvider';
import { AddProductDialog } from '../components/AddItemModal';
import { Input } from "@material-tailwind/react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

const TABLE_HEAD = ["S.No", "Product", "Quantity", "Metric", "Image", "Actions"];

export default function Dashboard() {
  const { supabase } = useSupabase();
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    metric: '',
    image_url: ''
  });

  useEffect(() => {
    if (!supabase) return;

    const checkSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        
        if (!session) {
          router.replace('/');
          return false;
        } else {
          setUsername(session.user.email?.split('@')[0] || 'user');
          return true;
        }
      } catch (error) {
        console.error('Session check error:', error);
        return false;
      }
    };

    const fetchItems = async () => {
      try {
        const { data, error } = await supabase
          .from('pantry_items')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setItems(data || []);
      } catch (error) {
        console.error('Error fetching items:', error.message);
        setError(error.message);
      }
    };

    const loadInitialData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const sessionValid = await checkSession();
        if (sessionValid) {
          await fetchItems();
        }
      } catch (error) {
        console.error('Initial load error:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [supabase, router]);

  const handleDelete = async (id, imageUrl) => {
    try {
      if (imageUrl) {
        const filePath = imageUrl.split('/').pop();
        const { error: storageError } = await supabase.storage
          .from('items')
          .remove([filePath]);

        if (storageError) throw storageError;
      }

      const { error } = await supabase
        .from('pantry_items')
        .delete()
        .match({ id });

      if (error) throw error;
      
      const { data, error: fetchError } = await supabase
        .from('pantry_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setItems(data || []);
    } catch (error) {
      console.error('Error deleting item:', error.message);
    }
  };

  // In your Dashboard component
// In your Dashboard component
const filteredItems = items.filter((item) => {
  const itemName = item.name || '';
  const query = searchQuery || '';
  return itemName.toLowerCase().includes(query.toLowerCase());
});

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Error: {error}
      </div>
    );
  }
  

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl mb-3 font-bold">Welcome,</h1>
      <p className=" text-sm text-gray-600 mb-6">
        Track your pantry items, manage inventory, and never run out of essentials.
      </p>

      {/* Search and Add Section */}
      <div className="flex gap-4 mb-6">
        <Input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow max-w-[100%] rounded-full border-2 border-gray-300 px-4"
        />
        <AddProductDialog 
          open={open}
          setOpen={setOpen}
          editMode={false}
          formData={formData}
          setFormData={setFormData}
          refreshItems={async () => {
            const { data, error } = await supabase
              .from('pantry_items')
              .select('*')
              .order('created_at', { ascending: false });
            
            if (error) {
              console.error('Error refreshing items:', error);
              return;
            }
            setItems(data || []);
          }}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-600"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item, index) => (
              <tr key={item.id} className="border-b border-gray-100 last:border-b-0">
                <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{item.item_name}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{item.quantity}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{item.unit}</td>
                <td className="px-6 py-4 text-sm">
                  {item.image_url ? (
                    <a
                      href={item.image_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700"
                    >
                      View Image
                    </a>
                  ) : (
                    "No image"
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(item.id)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <PencilIcon className="h-5 w-5 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.image_url)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <TrashIcon className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Generate Recipe Button */}
      <div className="flex justify-center mt-6">
        <button className="px-8 py-2 border-2 border-gray-300 rounded-full hover:bg-gray-50">
          Generate Recipe
        </button>
      </div>
    </div>
  );
}