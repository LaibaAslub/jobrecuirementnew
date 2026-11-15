'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { useRouter } from 'next/navigation';
import {
  Search,
  Send,
  SlidersHorizontal,
  Archive,
  MoreVertical,
  MessageSquare,
  CheckCheck,
  Zap,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import EmployerSidebar from '@/components/EmployerSidebar';
import EmployerHeader from '@/components/EmployerHeader';

export default function EmployerMessagesPage() {
  const { user, loading: authLoading } = useAuth();
  const { myEmployerJobs, myEmployerApplications, profiles } = useData();
  const router = useRouter();

  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
    if (!authLoading && user && user.role !== 'employer') router.push('/');
  }, [user, authLoading, router]);

  // Derive ONLY authorized contacts:
  // 1. System Administrator (admin@gmail.com)
  // 2. Applicants who applied to THIS employer's jobs
  useEffect(() => {
    if (!user || user.role !== 'employer') return;

    const contactMap = new Map();

    // 1. System Admin Contact
    contactMap.set('admin@gmail.com', {
      email: 'admin@gmail.com',
      name: 'System Admin',
      role: 'admin',
      badge: 'PLATFORM ADMINISTRATION',
      badgeStyle: 'bg-slate-900 text-white',
      jobTitle: 'Portal Operator',
      companyName: 'RecruitMe Platform',
      avatar: 'A',
      avatarBg: 'bg-[#0f172a]',
      applicationId: null,
      jobId: null,
    });

    // 2. Real applicants who applied to this employer's jobs
    myEmployerApplications.forEach((app) => {
      const email = String(app.user_email || '').toLowerCase().trim();
      if (!email || contactMap.has(email)) return;

      const profile = profiles[email] || {};
      const job = myEmployerJobs.find((j) => j.id === app.job_id) || {};

      contactMap.set(email, {
        email: email,
        name: app.user_name || profile.fullName || 'laiba',
        role: 'user',
        badge: 'APPLICANT',
        badgeStyle: 'bg-[#a7f3d0] text-[#065f46]',
        jobTitle: app.job_title || job.title || 'dev',
        companyName: user.companyName || 'newdev',
        avatar: (app.user_name || 'L').charAt(0).toUpperCase(),
        avatarBg: 'bg-[#006745]',
        phone: profile.phone || '123456789',
        status: app.status || 'Pending',
        applicationId: app.id,
        jobId: app.job_id,
      });
    });

    const contactList = Array.from(contactMap.values());
    setContacts(contactList);

    if (contactList.length > 0 && !activeContact) {
      setActiveContact(contactList[0]);
    }
  }, [user, myEmployerApplications, myEmployerJobs, profiles]);

  // Fetch messages with the active contact
  const fetchActiveMessages = async (contact) => {
    if (!user || !contact) return;
    setLoadingMessages(true);
    try {
      const res = await fetch(
        `/api/messages?userEmail=${encodeURIComponent(user.email)}&partnerEmail=${encodeURIComponent(
          contact.email
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
    if (activeContact) {
      fetchActiveMessages(activeContact);
    }
  }, [activeContact]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!messageInput.trim() || !activeContact || sending) return;

    setSending(true);
    const content = messageInput.trim();
    setMessageInput('');

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_id: user.id,
          receiver_id: activeContact.email,
          sender_email: user.email,
          receiver_email: activeContact.email,
          sender_name: user.companyName || user.fullName,
          receiver_name: activeContact.name,
          sender_role: 'employer',
          receiver_role: activeContact.role,
          job_id: activeContact.jobId,
          job_title: activeContact.jobTitle,
          application_id: activeContact.applicationId,
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

  if (authLoading || !user || user.role !== 'employer') {
    return (
      <div className="flex flex-col justify-center items-center h-[70vh] gap-3">
        <div className="w-9 h-9 border-4 border-[#006745] border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 text-sm font-medium">Loading messages...</p>
      </div>
    );
  }

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen w-full bg-[#f8fbff] overflow-hidden">
      {/* ── Left Sidebar (Sticky/Fixed Viewport Height) ────────── */}
      <EmployerSidebar activeTab="messages" />

      {/* ── Main Area (Fixed Height with Independent Scroll Areas) ── */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <EmployerHeader />

        <main className="flex-1 min-h-0 min-w-0 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto flex flex-col overflow-hidden">
          {/* Top Breadcrumb & Header (Fixed shrink-0) */}
          <div className="shrink-0 mb-3 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
              <span>RecruitMe</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <span>Talent Intelligence</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <span className="text-slate-700 font-bold">Direct Messages</span>
            </div>

            <div className="flex items-center justify-between">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Candidate Communications
              </h1>

              <span className="bg-[#e0f2fe] text-[#0369a1] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                <span>Syncing Realtime</span>
              </span>
            </div>
          </div>

          {/* ──────────────────────────────────────────────────────────
              SPLIT MESSENGER CONTAINER
              Occupies 100% of the remaining height, zero overflow
          ────────────────────────────────────────────────────────── */}
          <div className="flex-1 min-h-0 min-w-0 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex overflow-hidden">
            {/* ── LEFT COLUMN: CONTACTS LIST (Independently Scrollable) ── */}
            <div
              className={`w-full md:w-80 lg:w-96 border-r border-slate-100 flex flex-col shrink-0 bg-white h-full min-h-0 ${
                showMobileChat ? 'hidden md:flex' : 'flex'
              }`}
            >
              {/* Search Bar (shrink-0) */}
              <div className="p-4 border-b border-slate-100 shrink-0">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search your applicants..."
                    className="w-full bg-[#f0f4fa] border-0 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-[#006745] outline-hidden transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Subheader (shrink-0) */}
              <div className="px-4 py-3 flex items-center justify-between border-b border-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-400 shrink-0">
                <span>ACTIVE DIALOGUES ({filteredContacts.length})</span>
                <button
                  type="button"
                  className="flex items-center gap-1 text-slate-500 hover:text-slate-800 font-bold cursor-pointer"
                >
                  <SlidersHorizontal className="w-3 h-3" />
                  <span>FILTER</span>
                </button>
              </div>

              {/* Scrollable Contacts List (Independent vertical scrollbar) */}
              <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-2 overscroll-contain">
                {filteredContacts.map((contact) => {
                  const isSelected = activeContact?.email === contact.email;
                  return (
                    <div
                      key={contact.email}
                      onClick={() => {
                        setActiveContact(contact);
                        setShowMobileChat(true);
                      }}
                      className={`p-3.5 rounded-2xl cursor-pointer transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'bg-[#dbeafe]/80 border border-blue-200/60 shadow-xs'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      {/* Avatar with status dot */}
                      <div className="relative shrink-0">
                        <div
                          className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-2xs ${contact.avatarBg}`}
                        >
                          {contact.avatar}
                        </div>
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#10b981] border-2 border-white" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <h4 className="text-xs font-black text-slate-900 truncate">
                            {contact.name}
                          </h4>
                          <span
                            className={`text-[8.5px] font-black uppercase px-2 py-0.5 rounded-md shrink-0 tracking-wider ${contact.badgeStyle}`}
                          >
                            {contact.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-semibold truncate leading-tight">
                          {contact.jobTitle}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                          {contact.email}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── RIGHT COLUMN: ACTIVE CHAT AREA (Independently Scrollable) ── */}
            <div
              className={`flex-1 min-w-0 min-h-0 flex flex-col bg-white h-full overflow-hidden ${
                !showMobileChat ? 'hidden md:flex' : 'flex'
              }`}
            >
              {activeContact ? (
                <>
                  {/* Top Chat Header (Fixed at top of chat area) */}
                  <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Back button on mobile */}
                      <button
                        type="button"
                        onClick={() => setShowMobileChat(false)}
                        className="md:hidden p-1.5 -ml-1 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 shrink-0 cursor-pointer"
                        title="Back to contacts"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>

                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-2xs shrink-0 ${activeContact.avatarBg}`}
                      >
                        {activeContact.avatar}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-black text-slate-900 truncate">
                            {activeContact.name}
                          </h3>
                          <span
                            className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md tracking-wider shrink-0 ${activeContact.badgeStyle}`}
                          >
                            {activeContact.badge}
                          </span>
                        </div>

                        <p className="text-xs text-slate-400 font-medium mt-0.5 truncate">
                          Applied: <strong className="text-slate-700">{activeContact.jobTitle}</strong>{' '}
                          • {activeContact.email}
                        </p>
                      </div>
                    </div>

                    {/* Right Action Icons */}
                    <div className="flex items-center gap-1 text-slate-400 shrink-0">
                      <button
                        type="button"
                        className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center hover:text-slate-700 transition-colors"
                      >
                        <Archive className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center hover:text-slate-700 transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Middle: Messages Scroll Area (Independently scrollable) */}
                  <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-4 bg-white flex flex-col overscroll-contain">
                    {/* Centered Conversation Tag */}
                    <div className="text-center my-2 shrink-0">
                      <span className="bg-[#eef4f8] text-slate-600 text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full inline-block">
                        CONVERSATION WITH {activeContact.name.toUpperCase()} ({activeContact.badge})
                      </span>
                    </div>

                    {/* Messages List or Empty State */}
                    {loadingMessages ? (
                      <div className="my-auto text-center text-xs text-slate-400 py-12">
                        Loading messages...
                      </div>
                    ) : messages.length > 0 ? (
                      messages.map((m) => {
                        const isMe =
                          String(m.sender_email).toLowerCase() ===
                          String(user.email).toLowerCase();

                        return (
                          <div
                            key={m.id}
                            className={`flex items-end gap-2.5 ${
                              isMe ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            {!isMe && (
                              <div
                                className={`w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-xs shrink-0 ${activeContact.avatarBg}`}
                              >
                                {activeContact.avatar}
                              </div>
                            )}

                            <div
                              className={`max-w-md rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                                isMe
                                  ? 'bg-[#006745] text-white rounded-br-none shadow-xs'
                                  : 'bg-[#f0f4fa] text-slate-800 rounded-bl-none'
                              }`}
                            >
                              <p className="whitespace-pre-line font-medium">{m.content}</p>
                              <div
                                className={`flex items-center justify-end gap-1 mt-1 text-[9.5px] ${
                                  isMe ? 'text-emerald-100' : 'text-slate-400'
                                }`}
                              >
                                <span>
                                  {new Date(m.created_at).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                                {isMe && <CheckCheck className="w-3 h-3" />}
                              </div>
                            </div>

                            {isMe && (
                              <div className="w-8 h-8 rounded-xl bg-slate-900 text-white font-black text-xs flex items-center justify-center shrink-0">
                                {(user.companyName || user.fullName || 'E').charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      /* Empty State matching design */
                      <div className="my-auto flex flex-col items-center justify-center py-12 text-center max-w-md mx-auto">
                        <div className="w-14 h-14 rounded-full bg-[#e0f2fe] flex items-center justify-center text-[#0284c7] mb-4">
                          <MessageSquare className="w-6 h-6 stroke-[2]" />
                        </div>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                          No messages yet with {activeContact.name}. Send a message below to begin the
                          interview conversation.
                        </p>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>

                  {/* Bottom: Chat Footer (Fixed at bottom of chat panel) */}
                  <div className="p-3 sm:p-4 border-t border-slate-100 bg-white space-y-2.5 shrink-0">
                    {/* Quick Replies - Constrained with max-w-full and min-w-0 */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none max-w-full min-w-0">
                      <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1 shrink-0">
                        <Zap className="w-3 h-3 text-emerald-600 fill-emerald-600" />
                        <span>QUICK REPLY:</span>
                      </span>

                      {[
                        'Your application has been received and is under review.',
                        'We would like to invite you for a virtual interview.',
                        'Could you please share your updated portfolio or code samples?',
                      ].map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setMessageInput(preset)}
                          className="bg-[#f0f4fa] hover:bg-slate-200 text-slate-700 rounded-full px-3.5 py-1 text-[11px] font-medium whitespace-nowrap transition-colors shrink-0 cursor-pointer"
                        >
                          {preset}
                        </button>
                      ))}
                    </div>

                    {/* Message Input Box */}
                    <form onSubmit={handleSendMessage} className="flex items-center gap-2.5">
                      <input
                        type="text"
                        placeholder={`Type a message to ${activeContact.name}...`}
                        className="flex-1 min-w-0 bg-[#f0f4fa] border-0 rounded-full px-5 py-3.5 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-[#006745] outline-hidden transition-all"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                      />

                      <button
                        type="submit"
                        disabled={!messageInput.trim() || sending}
                        className="w-11 h-11 rounded-full bg-[#006745] hover:bg-[#005438] active:scale-95 text-white flex items-center justify-center transition-all shadow-md shrink-0 cursor-pointer disabled:opacity-40"
                      >
                        <Send className="w-4 h-4 ml-0.5" />
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="my-auto flex flex-col items-center justify-center p-12 text-center text-slate-400">
                  <MessageSquare className="w-12 h-12 text-slate-300 mb-3" />
                  <p className="text-sm font-black">Select an applicant contact to view conversation</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
