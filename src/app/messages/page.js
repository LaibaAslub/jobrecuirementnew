'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Building2, 
  Send, 
  Search, 
  Briefcase, 
  CheckCheck, 
  Clock, 
  MessageSquare,
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';

export default function CandidateMessagesPage() {
  const { user, loading: authLoading } = useAuth();
  const { applications, jobs } = useData();
  const router = useRouter();

  const [companyContacts, setCompanyContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Derive ONLY authorized company contacts:
  // Candidate can ONLY message companies whose jobs they have applied to!
  useEffect(() => {
    if (!user || user.role === 'admin' || user.role === 'employer') return;

    const userEmail = String(user.email).toLowerCase().trim();
    const myApps = applications.filter(a => String(a.user_email || '').toLowerCase().trim() === userEmail);

    const contactMap = new Map();

    myApps.forEach(app => {
      const job = jobs.find(j => j.id === app.job_id) || {};
      const companyName = job.employer_name || 'Hiring Company';
      
      // Determine employer email
      let employerEmail = 'employer@jobbridge.com';
      if (companyName.toLowerCase().includes('linear')) employerEmail = 'linear@company.com';
      if (companyName.toLowerCase().includes('stripe')) employerEmail = 'stripe@company.com';
      if (companyName.toLowerCase().includes('canva')) employerEmail = 'canva@company.com';
      if (companyName.toLowerCase().includes('techcorp')) employerEmail = 'employer@jobbridge.com';

      const key = `${companyName}_${app.job_id}`;

      if (!contactMap.has(key)) {
        contactMap.set(key, {
          id: key,
          companyName,
          email: employerEmail,
          appliedRole: app.job_title || job.title,
          status: app.status || 'Pending',
          applicationId: app.id,
          jobId: app.job_id,
          avatar: companyName.charAt(0).toUpperCase()
        });
      }
    });

    const list = Array.from(contactMap.values());
    setCompanyContacts(list);

    if (list.length > 0 && !activeContact) {
      setActiveContact(list[0]);
    }
  }, [user, applications, jobs]);

  // Fetch messages with active company contact
  const fetchMessages = async (contact) => {
    if (!user || !contact) return;
    setLoadingMessages(true);
    try {
      const res = await fetch(`/api/messages?userEmail=${encodeURIComponent(user.email)}&partnerEmail=${encodeURIComponent(contact.email)}`);
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
      fetchMessages(activeContact);
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
          sender_name: user.fullName,
          receiver_name: activeContact.companyName,
          sender_role: 'user',
          receiver_role: 'employer',
          job_id: activeContact.jobId,
          job_title: activeContact.appliedRole,
          application_id: activeContact.applicationId,
          content
        })
      });

      const data = await res.json();
      if (data.success && data.message) {
        setMessages(prev => [...prev, data.message]);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  if (authLoading || !user) {
    return <div className="flex justify-center items-center h-[60vh]">Loading...</div>;
  }

  const filteredContacts = companyContacts.filter(c =>
    c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.appliedRole.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
            <Link href="/dashboard" className="hover:text-indigo-600 flex items-center">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Hiring Messages</h1>
          <p className="text-slate-500 text-sm">
            Communicate directly with recruiters regarding your submitted job applications
          </p>
        </div>

        <div className="bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-2xl flex items-center space-x-2 text-indigo-700 text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-indigo-600" />
          <span>Verified Application Conversations</span>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex overflow-hidden min-h-[600px] h-[75vh]">
        {/* Company Contacts List */}
        <div className="w-80 md:w-96 border-r border-slate-100 flex flex-col shrink-0">
          <div className="p-5 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search applied companies..."
                className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium focus:ring-2 focus:ring-indigo-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-50 p-2">
            {filteredContacts.length > 0 ? (
              filteredContacts.map(c => {
                const isActive = activeContact?.id === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => setActiveContact(c)}
                    className={`p-4 rounded-2xl cursor-pointer transition-all flex items-start space-x-3.5 ${
                      isActive 
                        ? 'bg-indigo-50/80 border border-indigo-100 shadow-sm' 
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-md">
                      {c.avatar}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h4 className={`text-xs font-black truncate ${isActive ? 'text-indigo-900' : 'text-slate-800'}`}>
                          {c.companyName}
                        </h4>
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                          c.status === 'Shortlisted' ? 'bg-green-50 text-green-600' :
                          c.status === 'Rejected' ? 'bg-red-50 text-red-600' :
                          'bg-amber-50 text-amber-600'
                        }`}>
                          {c.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate font-medium">
                        Applied: {c.appliedRole}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs">
                <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="font-bold text-slate-600 mb-1">No Company Conversations</p>
                <p>You can message companies after applying to their job postings.</p>
                <Link href="/jobs" className="mt-4 inline-block px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-md">
                  Explore Jobs
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Chat Thread */}
        <div className="flex-1 flex flex-col bg-white">
          {activeContact ? (
            <>
              {/* Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white font-black text-base flex items-center justify-center shadow-md">
                    {activeContact.avatar}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 flex items-center space-x-2">
                      <span>{activeContact.companyName}</span>
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full uppercase">
                        Hiring Partner
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                      Position: <strong className="text-slate-700">{activeContact.appliedRole}</strong> • Status: {activeContact.status}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/apply/${activeContact.jobId}`}
                  className="px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-600 border border-slate-100"
                >
                  View Job Details
                </Link>
              </div>

              {/* Messages Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/40">
                <div className="text-center my-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                    Application channel for {activeContact.appliedRole} at {activeContact.companyName}
                  </span>
                </div>

                {loadingMessages ? (
                  <div className="text-center text-xs text-slate-400 py-10">Loading conversation...</div>
                ) : messages.length > 0 ? (
                  messages.map(m => {
                    const isMe = String(m.sender_email).toLowerCase() === String(user.email).toLowerCase();
                    return (
                      <div
                        key={m.id}
                        className={`flex items-end space-x-2 ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        {!isMe && (
                          <div className="w-8 h-8 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                            {activeContact.avatar}
                          </div>
                        )}

                        <div className={`max-w-md rounded-2xl px-5 py-3.5 shadow-sm text-xs leading-relaxed ${
                          isMe
                            ? 'bg-indigo-600 text-white rounded-br-none'
                            : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none'
                        }`}>
                          <p className="whitespace-pre-line font-medium">{m.content}</p>
                          <div className={`flex items-center justify-end space-x-1 mt-1 text-[10px] ${
                            isMe ? 'text-indigo-200' : 'text-slate-400'
                          }`}>
                            <span>{new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            {isMe && <CheckCheck className="w-3.5 h-3.5" />}
                          </div>
                        </div>

                        {isMe && (
                          <div className="w-8 h-8 rounded-xl gradient-bg text-white font-black text-xs flex items-center justify-center shrink-0">
                            {user.fullName?.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-16 text-slate-400 text-xs">
                    No messages yet with {activeContact.companyName}. You can ask questions regarding your application schedule or role details.
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Composer */}
              <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-100 flex items-center space-x-3">
                <input
                  type="text"
                  placeholder={`Write a message to ${activeContact.companyName}...`}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-xs font-medium focus:ring-2 focus:ring-indigo-500 transition-all focus:bg-white"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={!messageInput.trim() || sending}
                  className={`p-3.5 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 active:scale-95 transition-all ${
                    !messageInput.trim() || sending ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-400">
              <MessageSquare className="w-12 h-12 text-slate-300 mb-3" />
              <p className="text-sm font-black">Select an applied company to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
