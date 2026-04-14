'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Building2 } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const isAdmin = user?.role === 'admin';
  const isEmployer = user?.role === 'employer';

  return (
    <nav className="glass sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#06cc99] to-[#05ae82] tracking-tighter">
          RecruitMe
        </Link>

        <div className="flex items-center space-x-6 text-sm font-black uppercase tracking-widest">
          <Link href="/" className="hover:text-[#06cc99] transition-colors">Home</Link>
          <Link href="/jobs" className="hover:text-[#06cc99] transition-colors">Jobs</Link>

          {user ? (
            <>
              {isAdmin && (
                <>
                  <Link href="/dashboard" className="hover:text-[#06cc99] transition-colors">Dashboard</Link>
                  <Link href="/admin/jobs" className="hover:text-[#06cc99] transition-colors text-emerald-600">Post Jobs</Link>
                  <Link href="/admin/applications" className="hover:text-[#06cc99] transition-colors text-emerald-600">Applicants</Link>
                </>
              )}

              {isEmployer && (
                <>
                  <Link href="/employer/dashboard" className="hover:text-[#06cc99] transition-colors flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <Link href="/employer/jobs" className="hover:text-[#06cc99] transition-colors text-indigo-600">Post Jobs</Link>
                  <Link href="/employer/applications" className="hover:text-[#06cc99] transition-colors text-indigo-600">My Applicants</Link>
                </>
              )}

              {!isAdmin && !isEmployer && (
                <>
                  <Link href="/dashboard" className="hover:text-[#06cc99] transition-colors">Dashboard</Link>
                  <Link href="/profile" className="hover:text-[#06cc99] transition-colors">Profile</Link>
                </>
              )}

              <button
                onClick={handleLogout}
                className="bg-slate-900 text-white px-6 py-2.5 rounded-xl hover:bg-[#06cc99] transition-all shadow-xl active:scale-95"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <Link href="/login" className="hover:text-[#06cc99] transition-colors">Login</Link>
              <Link
                href="/signup"
                className="bg-[#06cc99] text-white px-6 py-2.5 rounded-xl hover:bg-slate-900 transition-all shadow-xl active:scale-95"
              >
                Join Now
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
