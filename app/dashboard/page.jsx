'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/providers/SupabaseProvider';
import { AddItemSidebar } from '../components/AddItemSidebar';
import { EditItemModal } from '../components/EditItemModal';
import { Input } from "@material-tailwind/react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { toast } from 'react-hot-toast';
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const TABLE_HEAD = ["S.No", "Product", "Quantity", "Metric", "Image", "Actions"];

export default function Dashboard() {
  const { supabase } = useSupabase();
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [recipes, setRecipes] = useState("")
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    metric: '',
    image_url: ''
  });
  
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showRecipes, setShowRecipes] = useState(true);

  const handleSearch = async () => {
    try {
      const { data, error } = await supabase
        .from('pantry_items')
        .select('*')
        .ilike('item_name', `%${searchTerm}%`); 

      if (error) {
        console.error('Error fetching items:', error);
        return;
      }

      const itemsArray = data.map((item) => ({
        id: item.id,
        ...item,
      }));

      setItems(itemsArray);
    } catch (error) {
      console.error('Unexpected error:', error);
    }
    setSearchTerm("");
  };
  const handleEdit = (item) => {
    setSelectedItem(item);
    setEditModalOpen(true);
  };

  useEffect(() => {
    if (!supabase) {
      console.log('Supabase client not initialized');
      return;
    }

    const checkSession = async () => {
      try {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            // console.log('Auth state changed:', event, session);
            if (session) {
              setUsername(session.user.email?.split('@')[0] || 'user');
            } else if (event === 'SIGNED_OUT') {
              router.replace('/');
            }
          }
        );

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log('Initial session check:', session, sessionError);

        if (sessionError) {
          console.error('Session error:', sessionError);
          throw sessionError;
        }
        
        if (!session) {
          console.log('No active session found');
          router.replace('/');
          return false;
        } else {
          console.log('Session found:', session.user);
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
        console.log('Fetched items:', data);
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
        console.log('Session valid:', sessionValid);
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

    return () => {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {});
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  const handleDelete = async (id, imageUrl) => {
    try {
      if (imageUrl) {
        const filePath = imageUrl.split('/').pop();
        const { error: storageError } = await supabase.storage
          .from('items')
          .remove([filePath]);

        if (storageError) throw storageError;
        toast.success('Item deleted successfully');
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

  const filteredItems = items.filter((item) => {
    const itemName = item.name || '';
    const query = searchTerm || '';
    return itemName.toLowerCase().includes(query.toLowerCase());
  });

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen text-customYellow font-bold text-2xl">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  const suggestRecipes = async () => {
    if (items.length === 0) {
      toast.error("Please add some items to your pantry first!");
      return;
    }
  
    const suggestRecipeHelper = async () => {
      try {
        console.log('Starting recipe suggestion...');
        
        const ingredients = items
          .map((item) => item.item_name)
          .filter(Boolean)
          .join(", ");
        
        console.log('Sending ingredients to API:', ingredients);
  
        const response = await fetch("/api/recipes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ingredients }),
        });
  
        console.log('Response received:', response.status);
  
        const result = await response.json();
        console.log('Recipe data received:', result);
  
        if (result.error) {
          if (result.code === 429) {
            throw new Error("Too many requests. Please try again in a few minutes.");
          }
          throw new Error(result.error.message || "Failed to get recipes");
        }
  
        if (!result.choices || !result.choices[0] || !result.choices[0].message) {
          throw new Error("Invalid response format from recipe service");
        }
  
        const rawRecipes = result.choices[0].message.content;
        const formattedRecipes = formatRecipes(rawRecipes);
        setRecipes(formattedRecipes);
  
      } catch (error) {
        console.error("Recipe suggestion error:", error);
        throw new Error(
          error.message === "Failed to fetch" 
            ? "Cannot connect to recipe service. Please check your internet connection and try again." 
            : error.message
        );
      }
    };
  
    await toast.promise(suggestRecipeHelper(), {
      loading: "Finding recipes for your ingredients...",
      success: "Here are your recipe suggestions!",
      error: (err) => `${err.message}`,
    });
  };

  const formatRecipes = (rawRecipes) => {
  // First clean up any double line breaks or extra spaces
  let formattedText = rawRecipes
  //   .replace(/\n\s*\n/g, '\n\n')  // Standardize multiple line breaks
  //   .trim();                       // Remove leading/trailing whitespace

  // Format recipe titles
  formattedText = formattedText.replace(
    /Recipe \d+:|([A-Z][A-Za-z\s]+:)/g,
    match => `<h3 class="text-xl font-bold mt-6 mb-3 text-gray-800">${match}</h3>`
  );

  // Format section headers (Ingredients:, Instructions:, etc.)
  formattedText = formattedText.replace(
    /(Ingredients:|Instructions:|Steps:|Directions:|Method:)/g,
    match => `<h4 class="text-lg font-semibold mt-4 mb-2 text-gray-700">${match}</h4>`
  );

  // Format numbered items (1., 2., etc.)
  formattedText = formattedText.replace(
    /(\d+)\.\s+([^\n]+)/g,
    (match, number, content) => `<div class="flex gap-2 mb-2">
      <span class="font-bold text-gray-600">${number}.</span>
      <span>${content}</span>
    </div>`
  );

  // Format ingredient lists with available/unavailable indicators
  formattedText = formattedText.replace(
    /- (.*?)(✓|✗|\(available\)|\(not available\))?([\n$])/g,
    (match, ingredient, availability, ending) => {
      const isAvailable = availability && (availability === '✓' || availability === '(available)');
      const icon = isAvailable ? 
        '<span class="text-green-500">✓</span>' : 
        availability ? '<span class="text-red-500">✗</span>' : '';
      
      return `<div class="flex items-center gap-2 mb-1">
        <span class="text-gray-600">•</span>
        <span>${ingredient.trim()}</span>
        ${icon}
      </div>${ending}`;
    }
  );

  // Format any remaining bullet points
  formattedText = formattedText.replace(
    /- (.*?)(?=\n|$)/g,
    '<div class="flex gap-2 mb-1"><span class="text-gray-600">•</span><span>$1</span></div>'
  );

  // Format any bold text
  formattedText = formattedText.replace(
    /\*\*(.*?)\*\*/g,
    '<strong class="font-semibold text-gray-800">$1</strong>'
  );

  // Handle remaining line breaks
  // formattedText = formattedText.replace(/\n/g, '<br />');

  // Wrap the entire content in a styled container
  return `<div class="recipe-container space-y-4 text-gray-700">
    ${formattedText}
  </div>`;
};
  

  return (
    
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl mb-3 font-bold">Welcome, {username}</h1>
      <p className=" text-sm text-gray-600 mb-6">
        Track your pantry items, manage inventory, and never run out of essentials.
      </p>

      <div className="flex gap-4 mb-6">
        <Input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow max-w-[100%] rounded-full border-2 border-gray-300 px-4"
        />
        <button
          onClick={handleSearch}
          className="p-2 bg-customYellow rounded-full"
        >
          <MagnifyingGlassIcon className="h-5 w-5 text-white" />
        </button>
        <button
      onClick={() => setAddModalOpen(true)}
      className="bg-customYellow text-white font-bold rounded-lg p-2 w-40 h-10 text-center text-sm"
    >
      Add Item
    </button>
         <AddItemSidebar
          open={addModalOpen}
          setOpen={setAddModalOpen}
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
                      onClick={() => handleEdit(item)}
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

      <EditItemModal
        open={editModalOpen}
        setOpen={setEditModalOpen}
        itemData={selectedItem}
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

      <div className="flex justify-center mt-6">
        <button 
          onClick={suggestRecipes}
          className="px-8 py-2 border-2 border-gray-300 rounded-full hover:bg-gray-50">
          Generate Recipe
        </button>
      </div>
      {recipes && (
    <div className="mt-8 bg-white rounded-lg border-2 border-gray-200 p-6">
      <h2 className="text-2xl font-bold mb-4">Recipe Suggestions</h2>
      <button
        onClick={() => setShowRecipes(!showRecipes)}
        className="ml-auto bg-red-500 text-white font-bold rounded-lg p-2 mb-4"
      >
        {showRecipes ? 'Close Recipes' : 'Show Recipes'}
      </button>
      {showRecipes && (
        <div 
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: recipes }} 
        />
      )}
    </div>
  )}
      
    </div>
  );
}
