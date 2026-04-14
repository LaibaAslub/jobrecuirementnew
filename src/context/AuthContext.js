'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize session from Supabase on mount
  useEffect(() => {
    const initializeSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            ...session.user.user_metadata
          });
        }
      } catch (error) {
        console.error('Session initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeSession();

    // Listen to Auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          ...session.user.user_metadata
        });
      } else {
        // Only clear user if the event is strictly sign_out, or it's genuinely empty
        if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signup = async (fullName, email, password, role = 'user', companyName = '') => {
    // Basic validation
    if (!email || !password || !fullName) {
      throw new Error("All basic fields are required.");
    }
    const lowerEmail = email.toLowerCase();
    
    // Prevent registering reserved admin email
    if (lowerEmail === 'admin@gmail.com') {
      throw new Error("This email is reserved and cannot be registered.");
    }

    try {
      // Use Supabase auth
      const { data, error } = await supabase.auth.signUp({
        email: lowerEmail,
        password,
        options: {
          data: {
            fullName,
            role,
            companyName: role === 'employer' ? companyName : null,
          }
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      // Sync state if session exists (sometimes signUp auto-logs in based on email confirmation settings)
      if (data.session) {
        const sessionUser = {
          id: data.user.id,
          email: data.user.email,
          ...data.user.user_metadata
        };
        setUser(sessionUser);
      }

      return { user: data.user };
    } catch (e) {
      throw e;
    }
  };

  const login = async (email, password) => {
    if (!email || !password) {
      throw new Error("Email and password are required.");
    }
    const lowerEmail = email.toLowerCase();

    // Hardcoded admin login override
    if (lowerEmail === 'admin@gmail.com' && password === 'admin') {
      const adminUser = { 
        id: 'admin_static_id', 
        email: lowerEmail, 
        fullName: 'System Admin', 
        role: 'admin',
        companyName: null
      };
      setUser(adminUser);
      return { user: adminUser };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: lowerEmail,
        password
      });

      if (error) {
        throw new Error("Invalid Login Credentials.");
      }

      const sessionUser = {
        id: data.user.id,
        email: data.user.email,
        ...data.user.user_metadata
      };

      setUser(sessionUser);
      return { user: sessionUser };
    } catch (e) {
      throw e;
    }
  };

  const logout = async () => {
    // Allow static admin logout bypass
    if (user?.id === 'admin_static_id') {
      setUser(null);
      return;
    }

    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
       console.error(error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
