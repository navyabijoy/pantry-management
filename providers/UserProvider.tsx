"use client"

import { createContext, useContext, useState } from 'react';
import { User } from '@supabase/auth-helpers-nextjs';

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

// Create the context
export const UserContext = createContext<UserContextType | undefined>(undefined);

// Create the hook
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// Create the provider component
export default function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}