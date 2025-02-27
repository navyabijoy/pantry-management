import { GoTrueClient } from '@supabase/gotrue-js';

let instance;

export function getGoTrueClient() {
    if (!instance) {
        instance = new GoTrueClient({
            // Your configuration here
            url: process.env.NEXT_PUBLIC_SUPABASE_URL,
            headers: { 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}` },
            // other options
        });
    }
    return instance;
}