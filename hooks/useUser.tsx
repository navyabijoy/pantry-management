import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSessionContext, useUser as useSupaUser } from "@supabase/auth-helpers-react";
import { User } from '@supabase/supabase-js';

interface Props {
    children: React.ReactNode;
}

export interface PantryItem {
    id: string;
    user_id: string;
    item_name: string;
    quantity: number;
    unit: string;
    created_at: string;
    image?: string;
}

interface MyUserContextType {
    user: User | null;  // Add this
    accessToken: string | null;
    pantryItems: PantryItem[];
    isLoading: boolean;
}

const MyUserContext = createContext<MyUserContextType | undefined>(undefined);

export const MyUserContextProvider = (props: Props) => {
    const { 
        session, 
        isLoading: isLoadingUser, 
        supabaseClient: supabase 
    } = useSessionContext();
    const user = useSupaUser();
    const accessToken = session?.access_token ?? null;

    const [isLoadingData, setIsLoadingData] = useState(false);
    const [pantryItems, setPantryItems] = useState<PantryItem[]>([]);

    const getPantryItems = async (): Promise<PantryItem[]> => {
        const { data, error } = await supabase
            .from('pantry_items')
            .select('*')
            .eq('user_id', user?.id);

        if (error) {
            console.error('Error fetching pantry items:', error);
            return [];
        }

        return data as PantryItem[];
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
        }
    }, [user, isLoadingUser]);

    const value: MyUserContextType = {
        user,  // Add this
        accessToken,
        pantryItems,
        isLoading: isLoadingUser || isLoadingData,
    };

    return (
        <MyUserContext.Provider value={value}>
            {props.children}
        </MyUserContext.Provider>
    );
};

export const useMyUserContext = () => {
    const context = useContext(MyUserContext);
    if (context === undefined) { 
        throw new Error('useMyUserContext must be used within a MyUserContextProvider');
    }
    return context;
};