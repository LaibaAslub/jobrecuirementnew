'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import AdminHeader from '@/components/AdminHeader';
import {
  Search,
  Send,
  Mail,
  CheckCheck,
  MessageSquare,
  Info,
  Paperclip,
  Check,
  Settings,
  SlidersHorizontal,
} from 'lucide-react';

export default function AdminMessagesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [companies, setCompanies] = useState([]);
  const [activeCompany, setActiveCompany] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;

    const fetchRealCompanies = async () => {
      try {
        const res = await fetch('/api/community?role=admin');
        const data = await res.json();
        if (data.success && Array.isArray(data.companies)) {
          setCompanies(data.companies);
          if (data.companies.length > 0 && !activeCompany) {
            setActiveCompany(data.companies[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load registered companies:', err);
      }
    };

    fetchRealCompanies();
  }, [user]);

  const fetchActiveMessages = async (company) => {
    if (!user || !company) return;
    setLoadingMessages(true);
    try {
      const res = await fetch(
        `/api/messages?userEmail=${encodeURIComponent(user.email)}&partnerEmail=${encodeURIComponent(
          company.email
        )}`
      );
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    if (activeCompany) {
      fetchActiveMessages(activeCompany);
    }
  }, [activeCompany]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!messageInput.trim() || !activeCompany || sending) return;

    setSending(true);
    const content = messageInput.trim();
    setMessageInput('');

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_id: user.id || 'admin_static_id',
          receiver_id: activeCompany.id,
          sender_email: user.email,
          receiver_email: activeCompany.email,
          sender_name: 'System Admin',
          receiver_name: activeCompany.companyName,
          sender_role: 'admin',
          receiver_role: 'employer',
          job_id: null,
          job_title: 'Employer Administration Channel',
          application_id: null,
          content,
        }),
      });

      const data = await res.json();
      if (data.success && data.message) {
        setMessages((prev) => [...prev, data.message]);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  if (authLoading || !user || user.role !== 'admin') {
    return (
      <div className="flex justify-center items-center h-screen bg-[#f8f9fb]">
        <div className="w-8 h-8 border-4 border-[#006745] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const filteredCompanies = companies.filter(
    (c) =>
      c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.contactPerson && c.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const quickNotices = [
    'Welcome to RecruitMe! Your employer account has been verified.',
    'Your recent job posting has been promoted on the public portal.',
    'Please verify your company billing and tax documentation.',
    'Thank you for partnering with RecruitMe.',
  ];

  return (
    <div className="flex min-h-screen bg-[#f8f9fb]">
      <AdminSidebar activeTab="message" />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />

        {/* Sub-Header Breadcrumb Bar matching Reference Image 5 */}
        <div className="h-12 bg-white border-b border-slate-200/80 flex items-center justify-between px-6 lg:px-8 shrink-0">
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1.5 text-[#006745] font-black tracking-wide">
              <span className="w-2 h-2 rounded-full bg-[#10b981]" />
              SECURE CHANNEL
            </span>
            <span className="text-slate-300 font-bold">/</span>
            <span className="font-extrabold text-slate-800 tracking-tight">Admin Messages - RecruitMe</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">PRIORITY DISPATCH</span>
            <span className="text-[10px] font-black bg-[#ebfbf3] text-[#006745] px-2.5 py-0.5 rounded-full border border-[#bbf7d0]">
              {companies.length} Active Orgs
            </span>
          </div>
        </div>

        {/* ═══ Main Two-Panel Chat Interface matching Reference Image 5 ═══ */}
        <div className="flex-1 flex overflow-hidden p-6 gap-6 max-w-[1440px] w-full mx-auto">
          {/* ── LEFT: EMPLOYER DIRECTORY LIST (width ~340px) ── */}
          <div className="w-80 lg:w-96 bg-white rounded-3xl border border-slate-200/80 shadow-2xs flex flex-col overflow-hidden shrink-0">
            {/* Search input with filter toggle icon */}
            <div className="p-4 border-b border-slate-100 flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search registered employers..."
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl py-2 pl-9 pr-3 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#006745] focus:bg-white transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                type="button"
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
                title="Filter options"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* List of employers */}
            <div className="flex-1 overflow-y-auto p-2.5 space-y-1">
              {filteredCompanies.length > 0 ? (
                filteredCompanies.map((c) => {
                  const isActive = activeCompany?.email === c.email;
                  return (
                    <div
                      key={c.email}
                      onClick={() => setActiveCompany(c)}
                      className={`p-3.5 rounded-2xl cursor-pointer transition-all flex items-start gap-3.5 ${
                        isActive
                          ? 'bg-[#e6f7ef] border border-[#a7f3d0] shadow-xs'
                          : 'hover:bg-slate-50 border border-transparent'
                      }`}
                    >
                      {/* Avatar Circle */}
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm shrink-0 transition-colors ${
                          isActive
                            ? 'bg-[#006745] text-white shadow-xs'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {c.companyName.charAt(0).toUpperCase()}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <h4
                            className={`text-xs font-black truncate max-w-[130px] ${
                              isActive ? 'text-slate-900' : 'text-slate-800'
                            }`}
                          >
                            {c.companyName}
                          </h4>
                          <span
                            className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                              isActive
                                ? 'bg-white/80 text-[#006745] border border-[#a7f3d0]'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            EMPLOYER
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium truncate">
                          {c.contactPerson || c.companyName}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                          {c.email}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No registered employers found.
                </div>
              )}
            </div>

            {/* Bottom Status Bar */}
            <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                {companies.length} DIRECTORY CHANNELS
              </span>
              <span className="text-[#006745] uppercase tracking-wider text-[10px] font-black">
                LIVE SYNC
              </span>
            </div>
          </div>

          {/* ── RIGHT: CHAT PANEL matching Reference Image 5 ── */}
          <div className="flex-1 bg-white rounded-3xl border border-slate-200/80 shadow-2xs flex flex-col overflow-hidden">
            {activeCompany ? (
              <>
                {/* 1. Chat Header */}
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-full bg-[#006745] text-white font-black text-base flex items-center justify-center shadow-xs">
                      {activeCompany.companyName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-black text-slate-900">
                          {activeCompany.companyName}
                        </h3>
                        <span className="text-[9px] font-black text-[#006745] bg-[#ebfbf3] border border-[#bbf7d0] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          VERIFIED COMPANY
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">
                        Contact: {activeCompany.contactPerson || 'Alex Turner'} •{' '}
                        {activeCompany.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-400">
                    <a
                      href={`mailto:${activeCompany.email}`}
                      className="p-2 rounded-xl hover:bg-slate-50 hover:text-slate-700 transition-colors cursor-pointer"
                      title="Email Employer"
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                    <button
                      type="button"
                      className="p-2 rounded-xl hover:bg-slate-50 hover:text-slate-700 transition-colors cursor-pointer"
                      title="Company Info"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 2. Messages Canvas */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#fafcff]/50">
                  {/* Channel Tag Banner */}
                  <div className="text-center my-3">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 bg-white border border-slate-200/80 px-4 py-1.5 rounded-full shadow-2xs">
                      OFFICIAL ADMIN COMMUNICATION WITH {activeCompany.companyName.toUpperCase()}
                    </span>
                  </div>

                  {loadingMessages ? (
                    <div className="text-center text-xs text-slate-400 py-12">Loading messages...</div>
                  ) : messages.length > 0 ? (
                    messages.map((m) => {
                      const isMe =
                        String(m.sender_email || '').toLowerCase() === String(user.email || '').toLowerCase() ||
                        m.sender_role === 'admin';

                      return (
                        <div
                          key={m.id}
                          className={`flex items-end gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}
                        >
                          {!isMe && (
                            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-black text-xs flex items-center justify-center shrink-0">
                              {activeCompany.companyName.charAt(0).toUpperCase()}
                            </div>
                          )}

                          <div
                            className={`max-w-md rounded-2xl px-4 py-3 shadow-2xs text-xs leading-relaxed ${
                              isMe
                                ? 'bg-[#006745] text-white rounded-br-xs'
                                : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
                            }`}
                          >
                            <p className="whitespace-pre-line font-medium">{m.content}</p>
                            <div
                              className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                                isMe ? 'text-white/60' : 'text-slate-400'
                              }`}
                            >
                              <span>
                                {new Date(m.created_at || Date.now()).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                              {isMe && <CheckCheck className="w-3.5 h-3.5 text-[#34d399]" />}
                            </div>
                          </div>

                          {isMe && (
                            <div className="w-8 h-8 rounded-full bg-[#006745] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                              SA
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    /* Clean Empty State matching Reference Image 5 */
                    <div className="py-24 flex flex-col items-center justify-center text-center max-w-md mx-auto">
                      <div className="w-14 h-14 rounded-2xl bg-[#f0f4ff] border border-[#e0e7ff] text-[#006745] flex items-center justify-center mb-4 shadow-2xs">
                        <MessageSquare className="w-7 h-7" />
                      </div>
                      <h4 className="text-base font-black text-slate-900 tracking-tight">
                        No prior administrative messages
                      </h4>
                      <p className="text-xs text-slate-400 font-medium leading-relaxed mt-1.5">
                        No previous conversation with{' '}
                        <span className="font-extrabold text-slate-700">
                          {activeCompany.companyName}
                        </span>
                        . Send an administrative message or select a rapid compliance notice below.
                      </p>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* 3. Quick Notice Preset Bar */}
                <div className="px-6 py-2.5 bg-white border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 shrink-0">
                      QUICK NOTICE:
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setMessageInput(
                          'Welcome to RecruitMe! Your employer account has been verified.'
                        )
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 hover:bg-[#ebfbf3] hover:text-[#006745] text-slate-600 rounded-full text-xs font-semibold border border-slate-200 transition-colors whitespace-nowrap cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5 text-[#006745]" />
                      <span>Welcome to RecruitMe! Your employer account has been verified.</span>
                    </button>
                  </div>
                  <button
                    type="button"
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors shrink-0"
                    title="Notice presets configuration"
                  >
                    <Settings className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 4. Chat Input Bar matching Reference Image 5 */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-4 bg-white border-t border-slate-100 flex items-center gap-3"
                >
                  <div className="flex-1 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center px-4 py-2.5 focus-within:border-[#006745] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#006745]/15 transition-all">
                    <button
                      type="button"
                      className="text-slate-400 hover:text-slate-600 mr-2.5 cursor-pointer"
                      title="Attach file"
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>
                    <input
                      type="text"
                      placeholder={`Message ${activeCompany.companyName}...`}
                      className="flex-1 bg-transparent text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!messageInput.trim() || sending}
                    className={`w-10 h-10 rounded-full bg-[#006745] hover:bg-[#005438] text-white flex items-center justify-center shadow-xs transition-all active:scale-95 shrink-0 cursor-pointer ${
                      !messageInput.trim() || sending ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-400">
                <MessageSquare className="w-12 h-12 text-slate-200 mb-3" />
                <p className="text-sm font-black text-slate-700">Select a company to open chat</p>
                <p className="text-xs text-slate-400 mt-1">Choose an employer from the left directory</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
