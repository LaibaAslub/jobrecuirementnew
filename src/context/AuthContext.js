'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize session from Supabase or server-side session (Admin / Employer) on mount
  useEffect(() => {
    const initializeSession = async () => {
      try {
        // 1. Check Supabase session first
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (session?.user) {
          const metaRole = session.user.user_metadata?.role;
          // Protect admin role: only server-validated admin sessions can have role 'admin'
          const safeRole = metaRole === 'admin' ? 'user' : (metaRole || 'user');
          setUser({
            id: session.user.id,
            email: session.user.email,
            ...session.user.user_metadata,
            role: safeRole
          });
          setLoading(false);
          return;
        }

        // 2. If no Supabase user, verify if there is an active HTTP-only server session (Admin / Employer)
        try {
          const res = await fetch('/api/auth/session');
          if (res.ok) {
            const data = await res.json();
            if (data.authenticated && data.user) {
              setUser(data.user);
              setLoading(false);
              return;
            }
          }
        } catch {
          // Gracefully continue if session check fails
        }
      } catch (error) {
        console.error('Session initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeSession();

    // Listen to Supabase Auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const metaRole = session.user.user_metadata?.role;
        const safeRole = metaRole === 'admin' ? 'user' : (metaRole || 'user');
        setUser({
          id: session.user.id,
          email: session.user.email,
          ...session.user.user_metadata,
          role: safeRole
        });
      } else {
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
    if (!email || !password || !fullName) {
      throw new Error("All basic fields are required.");
    }
    const lowerEmail = email.toLowerCase().trim();
    
    // Prevent registering reserved admin email
    if (lowerEmail === 'admin@gmail.com') {
      throw new Error("This email is reserved and cannot be registered.");
    }

    // Enforce safe roles so external users cannot grant themselves admin access
    const safeRole = role === 'employer' ? 'employer' : 'user';

    try {
      const { data, error } = await supabase.auth.signUp({
        email: lowerEmail,
        password,
        options: {
          data: {
            fullName,
            role: safeRole,
            companyName: safeRole === 'employer' ? companyName : null,
          }
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.session) {
        const sessionUser = {
          id: data.user.id,
          email: data.user.email,
          ...data.user.user_metadata,
          role: safeRole
        };
        setUser(sessionUser);
      }

      // Automatically create company record if registering as employer
      if (safeRole === 'employer' && companyName) {
        try {
          const slug = companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          await supabase.from('companies').upsert([{
            name: companyName,
            slug: slug,
            user_id: data.user?.id || null,
            email: lowerEmail,
            is_verified: true,
            description: `${companyName} is an active verified employer on RecruitMe.`,
            location: 'Remote • Worldwide'
          }], { onConflict: 'slug' });
        } catch (compErr) {
          console.warn('Company auto-creation warning:', compErr);
        }
      }

      // Automatically create initial profile record
      try {
        await supabase.from('profiles').upsert([{
          email: lowerEmail,
          "fullName": fullName,
          "firstName": fullName.split(' ')[0] || fullName,
          "lastName": fullName.split(' ').slice(1).join(' ') || '',
          user_id: data.user?.id || null
        }], { onConflict: 'email' });
      } catch (profErr) {
        console.warn('Profile auto-creation warning:', profErr);
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
    const lowerEmail = email.toLowerCase().trim();

    // 1. Authenticate server-managed accounts (Admin & Employer) securely via server API
    // No passwords hardcoded in frontend code!
    try {
      const serverRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: lowerEmail, password })
      });

      const serverData = await serverRes.json();

      if (serverRes.ok && serverData.success && serverData.user) {
        setUser(serverData.user);
        return { user: serverData.user };
      }

      // If this was a recognized server account and password failed
      if (serverData.isServerAccount && !serverData.success) {
        throw new Error(serverData.error || 'Invalid Login Credentials.');
      }
    } catch (err) {
      if (err.message === 'Invalid Login Credentials.' || err.message?.includes('Invalid')) {
        throw err;
      }
    }

    // 2. Supabase authentication for standard users and registered accounts
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: lowerEmail,
        password
      });

      if (error) {
        throw new Error("Invalid Login Credentials.");
      }

      const metaRole = data.user.user_metadata?.role;
      // Prevent regular users from accessing admin role
      const safeRole = metaRole === 'admin' ? 'user' : (metaRole || 'user');

      const sessionUser = {
        id: data.user.id,
        email: data.user.email,
        ...data.user.user_metadata,
        role: safeRole
      };

      setUser(sessionUser);
      return { user: sessionUser };
    } catch (e) {
      throw e;
    }
  };

  const logout = async () => {
    // Clear server-side session cookie if active
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // Ignore network errors on logout
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
