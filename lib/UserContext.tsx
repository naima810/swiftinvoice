'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from './supabase';

interface UserContextType {
  user: any | null;
  loading: boolean;
  logout: () => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  logout: () => {}
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        // Try to get the current session first
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) console.error('Session error:', sessionError);

        setUser(session?.user ?? null);
        setLoading(false);
      } catch (err) {
        console.error('Auth init error:', err);
        setUser(null);
        setLoading(false);
      }

      // Listen for auth changes
      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });

      return () => listener.subscription.unsubscribe();
    };

    init();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, loading, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
