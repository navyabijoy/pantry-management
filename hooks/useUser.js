import { createContext, useContext, useEffect, useState } from 'react';
import { useSessionContext, useUser as useSupaUser } from "@supabase/auth-helpers-react";
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

const MyUserContext = createContext(undefined);

export const MyUserContextProvider = ({ children }) => {
    const router = useRouter();
    const {     
        session, 
        isLoading: isLoadingUser, 
        supabaseClient: supabase 
    } = useSessionContext();
    const user = useSupaUser();
    const accessToken = session?.access_token ?? null;

    const [isLoadingData, setIsLoadingData] = useState(false);
    const [pantryItems, setPantryItems] = useState([]);

    const getPantryItems = async () => {
        const { data, error } = await supabase
            .from('pantry_items')
            .select('*')
            .eq('user_id', user?.id);

        if (error) {
            console.error('Error fetching pantry items:', error);
            return [];
        }

        return data;
    };

    useEffect(() => {
        if (user && !isLoadingUser && !isLoadingData) {
            setIsLoadingData(true);

            getPantryItems()
                .then((pantryItemsData) => {
                    setPantryItems(pantryItemsData);
                })
                .catch((err) => {
                    console.error('Error loading pantry items:', err);
                })
                .finally(() => {
                    setIsLoadingData(false);
                });
        } else if (!user && !isLoadingUser) {
            // Reset pantry items when user logs out
            setPantryItems([]);
        }
    }, [user, isLoadingUser]);

    // Add auth state change listener
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT') {
                setPantryItems([]);
            }
            else {
                router.push('/dashboard');
                toast.success('Logged in successfully');
            }
        });

        return () => {
            subscription?.unsubscribe();
        };
    }, [supabase.auth]);

    const value = {
        user,
        accessToken,
        pantryItems,
        isLoading: isLoadingUser || isLoadingData,
    };

    return (
        <MyUserContext.Provider value={value}>
            {children}
        </MyUserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(MyUserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a MyUserContextProvider');
    }
    return context;
};