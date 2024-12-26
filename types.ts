export interface UserDetails { 
    id:string;
    first_name: string;
    last_name: string;
    full_name?: string;
    email: string;
    avatar_url?:string;
    created_at?:string;
};

export interface pantry_item {
    id: string;
    name: string;
    quantity: number;
    unit: string;
    category: string;
    user_id: string;
    created_at: string;
    updated_at: string;
    image?:string;
};