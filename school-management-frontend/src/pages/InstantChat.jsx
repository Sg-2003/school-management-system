import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, User, Search, Paperclip, MoreVertical, Phone, Video, Smile, Hash, 
  Circle, CheckCheck, X, FileText, Ban, Trash2, ShieldAlert, Image, Mic, 
  MessageSquare, Plus, Play, Pause, Download, Mail, Volume2, FileDown 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Contact Avatar Helper Component ─────────────────────────────────────────
const ContactAvatar = ({ name, size = 40, borderRadius = '12px', border = '2px solid var(--border-color)', fallbackText = '' }) => {
  const [imgError, setImgError] = useState(false);
  
  const avatars = {
    'Principal Office': 'https://api.dicebear.com/7.x/initials/svg?seed=Principal%20Office',
    'Prof. Amit Sharma': 'https://api.dicebear.com/7.x/initials/svg?seed=Amit%20Sharma',
    'Admin Support': 'https://api.dicebear.com/7.x/initials/svg?seed=Admin%20Support',
    'Aditi Nair': 'https://api.dicebear.com/7.x/initials/svg?seed=Aditi%20Nair',
    'Prof. Priya Sharma': 'https://api.dicebear.com/7.x/initials/svg?seed=Priya%20Sharma',
    'Accounts Office': 'https://api.dicebear.com/7.x/initials/svg?seed=Accounts%20Office',
    'Coach Rajesh Malhotra': 'https://api.dicebear.com/7.x/initials/svg?seed=Rajesh%20Malhotra',
    'Security Gate 1': 'https://api.dicebear.com/7.x/initials/svg?seed=Security%20Gate%201',
    'Dr. Sanjay Gupta': 'https://api.dicebear.com/7.x/initials/svg?seed=Sanjay%20Gupta',
    'Parent Association': 'https://api.dicebear.com/7.x/initials/svg?seed=Parent%20Association',
    'Dean Anand Verma': 'https://api.dicebear.com/7.x/initials/svg?seed=Anand%20Verma',
    'Nurse Neha Patel': 'https://api.dicebear.com/7.x/initials/svg?seed=Neha%20Patel',
    'Librarian Divya Joshi': 'https://api.dicebear.com/7.x/initials/svg?seed=Divya%20Joshi',
    'Registrar Sunita Sharma': 'https://api.dicebear.com/7.x/initials/svg?seed=Sunita%20Sharma',
  };

  const url = avatars[name] || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;

  if (imgError) {
    return (
      <div style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius,
        background: 'var(--primary-light)',
        color: 'var(--primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 900,
        fontSize: size > 60 ? '2rem' : size > 45 ? '1.2rem' : '0.95rem',
        flexShrink: 0,
        border,
        userSelect: 'none'
      }}>
        {fallbackText || name.split(' ').map(n => n[0]).join('')}
      </div>
    );
  }

  return (
    <div style={{ width: `${size}px`, height: `${size}px`, borderRadius, overflow: 'hidden', flexShrink: 0, border, transition: 'transform 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <img
        src={url}
        alt={name}
        onError={() => setImgError(true)}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </div>
  );
};

const InstantChat = () => {
  const initialChats = [
    { 
      id: 0, 
      name: 'Principal Office', 
      role: 'Administration', 
      status: 'online', 
      avatar: 'PO', 
      unread: 2,
      blocked: false,
      email: 'principal@school.edu',
      phone: '+91 98765 43210',
      location: 'Admin Block, Room 101',
      messages: [
        { id: 1, sender: 'them', text: "Hello, I've reviewed the documents you sent over. Everything looks correct for the upcoming audit.", time: '09:15 AM' },
        { id: 2, sender: 'me', text: "That's great to hear! Should I proceed with the scheduling of the faculty review as well?", time: '09:20 AM' },
        { id: 3, sender: 'them', text: "Yes, please proceed. Let's aim to have it finalized by this Friday so we can notify the departments.", time: '10:30 AM' },
        { id: 4, sender: 'them', isFile: true, isImage: false, fileName: 'audit_framework_2026.pdf', fileSize: '2.4 MB', text: 'Shared audit guidelines', time: '10:45 AM' }
      ]
    },
    {
      id: 1,
      name: 'Prof. Amit Sharma',
      role: 'Science Faculty',
      status: 'online',
      avatar: 'AS',
      unread: 0,
      blocked: false,
      email: 'amit.sharma@school.edu',
      phone: '+91 98765 43211',
      location: 'Science Center, Lab 3',
      messages: [
        { id: 1, sender: 'them', text: "Hi, did the new science lab equipment arrive yet? The students are eager to begin their practicals.", time: 'Yesterday, 02:00 PM' },
        { id: 2, sender: 'me', text: "Yes, the shipment is in the main logistics bay. I will have the maintenance team move it to Lab 3 tomorrow morning.", time: 'Yesterday, 03:30 PM' },
        { id: 3, sender: 'them', text: "Perfect, thank you! Please check the class 10 marks spreadsheet when you get a chance.", time: 'Yesterday, 04:15 PM' },
        { id: 4, sender: 'me', isFile: true, isImage: true, fileName: 'microscope_setup_bay3.jpg', fileSize: '1.2 MB', text: 'Sent microscope photo', time: 'Yesterday, 04:30 PM' }
      ]
    },
    {
      id: 2,
      name: 'Admin Support',
      role: 'IT Department',
      status: 'offline',
      avatar: 'AS',
      unread: 0,
      blocked: false,
      email: 'support@school.edu',
      phone: '+91 98765 43212',
      location: 'Main Server Room, Block C',
      messages: [
        { id: 1, sender: 'me', text: "Hi Support, I am unable to log in to the new portal. Could you reset my credentials?", time: 'Monday, 10:00 AM' },
        { id: 2, sender: 'them', text: "No problem! I've initiated a reset. Your temporary password is: School@2026", time: 'Monday, 10:15 AM' },
        { id: 3, sender: 'me', text: "Got it, I'm logged in now. Thanks!", time: 'Monday, 10:20 AM' },
        { id: 4, sender: 'them', text: "Awesome, glad to help. Your password reset was successful.", time: 'Monday, 10:25 AM' }
      ]
    },
    {
      id: 3,
      name: 'Aditi Nair',
      role: 'Parent (Grade 8)',
      status: 'online',
      avatar: 'AN',
      unread: 1,
      blocked: false,
      email: 'aditi.nair@mail.com',
      phone: '+91 98765 43213',
      location: 'Off-campus Parent Affiliate',
      messages: [
        { id: 1, sender: 'me', text: "Dear Mrs. Nair, just a reminder that the report card distribution is scheduled for this Friday.", time: 'Yesterday, 09:30 AM' },
        { id: 2, sender: 'them', text: "Thank you for the update. I will make sure to attend between 10 AM and noon.", time: 'Yesterday, 09:45 AM' }
      ]
    },
    {
      id: 4,
      name: 'Prof. Priya Sharma',
      role: 'English Faculty',
      status: 'online',
      avatar: 'PS',
      unread: 0,
      blocked: false,
      email: 'priya.sharma@school.edu',
      phone: '+91 98765 43214',
      location: 'Humanities Wing, Room 302',
      messages: [
        { id: 1, sender: 'me', text: "Hi Prof. Davis, did you finalize the syllabus for the Grade 11 literature block?", time: '08:00 AM' },
        { id: 2, sender: 'them', text: "Yes, I did! I just emailed the PDF compilation to the registrar office.", time: '08:10 AM' },
        { id: 3, sender: 'me', text: "Perfect. I'll make sure it gets uploaded to the student portal today.", time: '08:12 AM' },
        { id: 4, sender: 'them', text: "Excellent, thank you. The essay guidelines are published as well.", time: '08:15 AM' }
      ]
    },
    {
      id: 5,
      name: 'Accounts Office',
      role: 'Finance Dept',
      status: 'offline',
      avatar: 'AO',
      unread: 0,
      blocked: false,
      email: 'finance@school.edu',
      phone: '+91 98765 43215',
      location: 'Finance Wing, Office 4B',
      messages: [
        { id: 1, sender: 'them', text: "Hi Admin, the Q1 ledger reconciliation has been completed.", time: 'Friday, 02:00 PM' },
        { id: 2, sender: 'me', text: "Great work! Any major discrepancies?", time: 'Friday, 02:30 PM' },
        { id: 3, sender: 'them', text: "None at all. Everything reconciles down to the penny. Please approve the library invoice when you have a moment so we can release the funds.", time: 'Friday, 03:00 PM' }
      ]
    },
    {
      id: 6,
      name: 'Coach Rajesh Malhotra',
      role: 'Sports Academy',
      status: 'online',
      avatar: 'RM',
      unread: 0,
      blocked: false,
      email: 'rajesh.malhotra@school.edu',
      phone: '+91 98765 43216',
      location: 'Athletics Office, Fieldhouse',
      messages: [
        { id: 1, sender: 'them', text: "Hey Admin, Block B peripheral fences look solid after the CCTV upgrades!", time: 'Yesterday, 05:00 PM' },
        { id: 2, sender: 'me', text: "Glad to hear. Let's make sure the football pitch is prepped for the tournament on June 5th.", time: 'Yesterday, 05:15 PM' },
        { id: 3, sender: 'them', text: "We are on it. Maintenance is mowing and lining the field this week. Squad lists are verified for the Greenfield opening match.", time: 'Yesterday, 05:30 PM' }
      ]
    },
    {
      id: 7,
      name: 'Security Gate 1',
      role: 'Campus Safety',
      status: 'online',
      avatar: 'SG',
      unread: 0,
      blocked: false,
      email: 'gate1.security@school.edu',
      phone: '+91 98765 43217',
      location: 'Main Entry Gate House',
      messages: [
        { id: 1, sender: 'them', text: "System Check: Shift transition complete. All peripheral sensors active.", time: '07:00 AM' },
        { id: 2, sender: 'me', text: "Excellent. Keep a close eye on Gate 2 deliveries today, smartboard interactive displays are arriving.", time: '07:15 AM' },
        { id: 3, sender: 'them', text: "Understood. Will escort the logistics carrier immediately to the warehouse. Visitor log for May 25 is logged.", time: '07:30 AM' }
      ]
    },
    {
      id: 8,
      name: 'Dr. Sanjay Gupta',
      role: 'Computer Lab',
      status: 'online',
      avatar: 'SG',
      unread: 1,
      blocked: false,
      email: 'sanjay.gupta@school.edu',
      phone: '+91 98765 43218',
      location: 'IT Wing, Coding Lab 4',
      messages: [
        { id: 1, sender: 'me', text: "Hi Robert, did the new workstation setups for Grade 12 coding lab get completed?", time: '08:45 AM' },
        { id: 2, sender: 'them', text: "Yes, all 30 PCs are fully imaged with Node, Git, and VS Code.", time: '08:55 AM' },
        { id: 3, sender: 'me', text: "Awesome! What about the intranet server speed upgrades?", time: '09:00 AM' },
        { id: 4, sender: 'them', text: "Vite server migration is complete. Intranet pages now compile in under 1.5 seconds!", time: '09:02 AM' }
      ]
    },
    {
      id: 9,
      name: 'Parent Association',
      role: 'PTA Board',
      status: 'offline',
      avatar: 'PA',
      unread: 0,
      blocked: false,
      email: 'pta@school.edu',
      phone: '+91 98765 43219',
      location: 'Parent Center, Wing B',
      messages: [
        { id: 1, sender: 'them', text: "Hi Admin, we have drafted the volunteer slots for the Annual Charity Gala.", time: 'May 12, 11:00 AM' },
        { id: 2, sender: 'me', text: "Wonderful! We can post a notice to get student and faculty volunteers signed up.", time: 'May 12, 11:30 AM' },
        { id: 3, sender: 'them', text: "Perfect. The PTA Gala agenda is finalized. Let's touch base on Thursday to coordinate logistics.", time: 'May 12, 02:00 PM' }
      ]
    }
  ];

  const availableNewContacts = [
    { id: 10, name: 'Dean Anand Verma', role: 'Academic Dean', avatar: 'AV', status: 'online', email: 'dean.verma@school.edu', phone: '+91 98765 43220', location: 'Administration Block, Office 103', initialMsg: 'Hi Admin, did you review the curriculum proposal?' },
    { id: 11, name: 'Nurse Neha Patel', role: 'Campus Health', avatar: 'NP', status: 'offline', email: 'nurse.neha@school.edu', phone: '+91 98765 43221', location: 'Health Clinic, Building D', initialMsg: 'Medical reports for the athletic camp are fully processed.' },
    { id: 12, name: 'Librarian Divya Joshi', role: 'E-Library', avatar: 'DJ', status: 'online', email: 'divya.library@school.edu', phone: '+91 98765 43222', location: 'Central Library, Main Desk', initialMsg: 'The library received the Q2 batch of research journals.' },
    { id: 13, name: 'Registrar Sunita Sharma', role: 'Registrar Office', avatar: 'SS', status: 'online', email: 'sunita.registrar@school.edu', phone: '+91 98765 43223', location: 'Admissions & Records, Window 1', initialMsg: 'Student enrollment logs are fully synced to database.' }
  ];

  // States
  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem('school_messenger_chats_v2');
    if (saved) {
      const parsed = JSON.parse(saved);
      const savedIds = parsed.map(c => c.id);
      const missingChats = initialChats.filter(ic => !savedIds.includes(ic.id));
      
      const updated = parsed.map(savedChat => {
        const matchingDefault = initialChats.find(ic => ic.id === savedChat.id);
        if (matchingDefault && (!savedChat.messages || savedChat.messages.length < matchingDefault.messages?.length)) {
          return { ...savedChat, messages: matchingDefault.messages };
        }
        return savedChat;
      });

      if (missingChats.length > 0) {
        return [...updated, ...missingChats];
      }
      return updated;
    }
    return initialChats;
  });

  const [activeChatId, setActiveChatId] = useState(0);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);
  
  // Call simulation states
  const [callState, setCallState] = useState(null); 
  const [callDuration, setCallDuration] = useState(0);
  const callTimerRef = useRef(null);

  // Dropdowns and utility popups
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // New interactive states
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [downloadingFile, setDownloadingFile] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState(0);

  // Audio recorder states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const recordingTimerRef = useRef(null);

  // Audio player states
  const [playingVoiceId, setPlayingVoiceId] = useState(null);
  const [voicePlaybackProgress, setVoicePlaybackProgress] = useState({});
  const voicePlayIntervalRef = useRef(null);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('school_messenger_chats_v2', JSON.stringify(chats));
  }, [chats]);

  const activeChat = chats.find(c => c.id === activeChatId) || chats[0] || initialChats[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages]);

  useEffect(() => {
    if (activeChat && activeChat.unread > 0) {
      setChats(prevChats => prevChats.map(c => c.id === activeChat.id ? { ...c, unread: 0 } : c));
    }
  }, [activeChatId]);

  // Call simulation duration tracker
  useEffect(() => {
    if (callState) {
      setCallDuration(0);
      callTimerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
    }
    return () => {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    };
  }, [callState]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (!message.trim()) return;
    if (activeChat.blocked) {
      showToast('Cannot send message. Contact is blocked.', 'error');
      return;
    }

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMessage = {
      id: Date.now(),
      sender: 'me',
      text: message,
      time: timeString
    };

    const updatedChats = chats.map(c => {
      if (c.id === activeChat.id) {
        return {
          ...c,
          messages: [...(c.messages || []), newMessage],
          lastMsg: message,
          time: timeString
        };
      }
      return c;
    });

    setChats(updatedChats);
    setMessage('');
    setShowEmojiPicker(false);
  };

  const handleAttachFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const isImage = file.type.startsWith('image/');
            const fileMessage = {
              id: Date.now(),
              sender: 'me',
              isFile: true,
              isImage: isImage,
              fileName: file.name,
              fileSize: (file.size / 1024).toFixed(1) + ' KB',
              text: isImage ? 'Sent an image' : 'Shared a file attachment',
              time: timeString
            };

            setChats(prevChats => prevChats.map(c => {
              if (c.id === activeChat.id) {
                return {
                  ...c,
                  messages: [...(c.messages || []), fileMessage],
                  lastMsg: isImage ? `📷 Photo: ${file.name}` : `📁 File: ${file.name}`,
                  time: timeString
                };
              }
              return c;
            }));

            setIsUploading(false);
            setShowAttachmentModal(false);
            showToast('File attached successfully!', 'success');
          }, 400);
          return 100;
        }
        return prev + 25;
      });
    }, 150);
  };

  const handleClearHistory = () => {
    setChats(prevChats => prevChats.map(c => {
      if (c.id === activeChat.id) {
        return {
          ...c,
          messages: [],
          lastMsg: 'Chat history cleared',
          time: 'Cleared'
        };
      }
      return c;
    }));
    setShowMoreMenu(false);
    setShowProfileDrawer(false);
    showToast('Chat history cleared.', 'success');
  };

  const handleToggleBlock = () => {
    const newState = !activeChat.blocked;
    setChats(prevChats => prevChats.map(c => {
      if (c.id === activeChat.id) {
        return { ...c, blocked: newState };
      }
      return c;
    }));
    setShowMoreMenu(false);
    showToast(newState ? 'Contact blocked successfully' : 'Contact unblocked', newState ? 'error' : 'success');
  };

  const formatCallTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const getLastMessageText = (chat) => {
    if (!chat.messages || chat.messages.length === 0) return 'No messages yet';
    const lastMsg = chat.messages[chat.messages.length - 1];
    if (lastMsg.isFile) {
      return lastMsg.isImage ? `📷 Photo: ${lastMsg.fileName}` : `📁 File: ${lastMsg.fileName}`;
    }
    if (lastMsg.isVoice) {
      return `🎙️ Voice message (${lastMsg.duration})`;
    }
    return lastMsg.text;
  };

  const getLastMessageTime = (chat) => {
    if (!chat.messages || chat.messages.length === 0) return '';
    const lastMsg = chat.messages[chat.messages.length - 1];
    return lastMsg.time;
  };

  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    chat.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const emojis = ['😊', '👍', '❤️', '🔥', '🎉', '👏', '💡', '📅', '📝', '🙌', '👀', '🚀'];

  const appendEmoji = (emoji) => {
    setMessage(prev => prev + emoji);
  };

  // Simulated Voice Recorder logic
  const startVoiceRecording = () => {
    if (activeChat.blocked) return;
    setIsRecording(true);
    setRecordingSeconds(0);
    recordingTimerRef.current = setInterval(() => {
      setRecordingSeconds(prev => prev + 1);
    }, 1000);
  };

  const cancelVoiceRecording = () => {
    setIsRecording(false);
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
    }
  };

  const sendVoiceRecording = () => {
    setIsRecording(false);
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
    }
    const durationStr = formatCallTime(recordingSeconds);
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const voiceMessage = {
      id: Date.now(),
      sender: 'me',
      isVoice: true,
      duration: durationStr,
      time: timeString
    };

    setChats(prevChats => prevChats.map(c => {
      if (c.id === activeChat.id) {
        return {
          ...c,
          messages: [...(c.messages || []), voiceMessage],
          lastMsg: `🎙️ Voice message (${durationStr})`,
          time: timeString
        };
      }
      return c;
    }));
    
    showToast('Voice message dispatched successfully!', 'success');
  };

  // Play voice message logic
  const togglePlayVoice = (msgId, durationStr) => {
    if (playingVoiceId === msgId) {
      setPlayingVoiceId(null);
      if (voicePlayIntervalRef.current) clearInterval(voicePlayIntervalRef.current);
    } else {
      if (voicePlayIntervalRef.current) clearInterval(voicePlayIntervalRef.current);
      setPlayingVoiceId(msgId);
      
      const parts = durationStr.split(':');
      const seconds = (parseInt(parts[0]) * 60) + parseInt(parts[1]) || 5;
      const step = 100 / (seconds * 10);
      
      setVoicePlaybackProgress(prev => ({ 
        ...prev, 
        [msgId]: prev[msgId] >= 100 ? 0 : (prev[msgId] || 0) 
      }));
      
      voicePlayIntervalRef.current = setInterval(() => {
        setVoicePlaybackProgress(prev => {
          const cur = prev[msgId] || 0;
          if (cur >= 100) {
            clearInterval(voicePlayIntervalRef.current);
            setPlayingVoiceId(null);
            return { ...prev, [msgId]: 100 };
          }
          return { ...prev, [msgId]: Math.min(cur + step, 100) };
        });
      }, 100);
    }
  };

  // Start new conversation from list
  const startNewConversation = (contact) => {
    const exists = chats.find(c => c.id === contact.id);
    if (exists) {
      setActiveChatId(contact.id);
      setShowNewChatModal(false);
      showToast(`Switched to active chat with ${contact.name}`, 'success');
      return;
    }

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newChat = {
      id: contact.id,
      name: contact.name,
      role: contact.role,
      status: contact.status,
      avatar: contact.avatar,
      unread: 0,
      blocked: false,
      email: contact.email,
      phone: contact.phone,
      location: contact.location,
      messages: [
        { id: Date.now(), sender: 'them', text: contact.initialMsg, time: timeString }
      ]
    };

    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    setShowNewChatModal(false);
    showToast(`Conversation started with ${contact.name}`, 'success');
  };

  // Secure File Download Simulation
  const handleStartDownload = (fileName, fileSize) => {
    if (downloadingFile) return;
    setDownloadingFile({ name: fileName, size: fileSize });
    setDownloadProgress(0);
    showToast(`Initializing secure download of ${fileName}...`, 'success');
    
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setDownloadingFile(null);
            showToast(`${fileName} downloaded successfully!`, 'success');
          }, 400);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  // Simulated Email Dispatch
  const simulateEmailDispatch = (contactName, email) => {
    showToast(`Initializing secure dispatch to ${email}...`, 'success');
    setTimeout(() => {
      showToast(`Mail Client Loaded! Draft sent statefully to ${contactName}.`, 'success');
    }, 1200);
  };

  // Simulated Transcript Compilation
  const compileChatTranscript = (chat) => {
    showToast(`Compiling historical chat record logs for ${chat.name}...`, 'success');
    setTimeout(() => {
      showToast(`Transcript CSV build successfully exported! [${chat.messages.length} messages]`, 'success');
    }, 1800);
  };

  return (
    <div style={{ padding: '20px', height: 'calc(100vh - 120px)' }}>
      <div className="card" style={{ height: '100%', padding: '0', overflow: 'hidden', display: 'flex', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-lg)', position: 'relative' }}>
         
         {/* Sidebar: Conversations */}
         <div style={{ width: '380px', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-card)' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 950, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    Messenger
                    <button 
                      onClick={() => setShowNewChatModal(true)}
                      className="icon-btn" 
                      title="Start New Conversation"
                      style={{ padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                    >
                      <Plus size={18} />
                    </button>
                  </h2>
                  <div 
                    title="All systems operational"
                    style={{ 
                      padding: '6px 12px', 
                      backgroundColor: 'rgba(16, 185, 129, 0.08)', 
                      borderRadius: '20px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '6px',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      color: '#10b981'
                    }}
                  >
                     <Circle size={8} fill="#10b981" /> Gateway Online
                  </div>
               </div>
               <div style={{ position: 'relative' }}>
                  <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                  <input 
                    type="text" 
                    placeholder="Search conversations..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ width: '100%', padding: '14px 14px 14px 48px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 600 }}
                  />
                  {searchQuery && (
                    <X 
                      size={16} 
                      onClick={() => setSearchQuery('')}
                      style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', cursor: 'pointer' }}
                    />
                  )}
               </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
               {filteredChats.length === 0 ? (
                 <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                   <Search size={32} style={{ opacity: 0.2, marginBottom: '12px' }} />
                   <p style={{ margin: 0, fontWeight: 700 }}>No conversations found</p>
                 </div>
               ) : (
                 filteredChats.map((chat) => (
                    <div 
                      key={chat.id}
                      onClick={() => setActiveChatId(chat.id)}
                      style={{
                        padding: '20px 24px',
                        cursor: 'pointer',
                        backgroundColor: activeChat.id === chat.id ? 'var(--primary-light)' : 'transparent',
                        borderLeft: activeChat.id === chat.id ? '4px solid var(--primary)' : '4px solid transparent',
                        display: 'flex',
                        gap: '16px',
                        transition: '0.2s'
                      }}
                    >
                       <div style={{ position: 'relative' }}>
                          <ContactAvatar name={chat.name} size={54} borderRadius="16px" fallbackText={chat.avatar} border={activeChat.id === chat.id ? '2px solid var(--primary)' : '2px solid var(--border-color)'} />
                          <div style={{ 
                             position: 'absolute', bottom: '-2px', right: '-2px', 
                             width: '14px', height: '14px', borderRadius: '50%', border: '2px solid var(--bg-card)',
                             backgroundColor: chat.status === 'online' ? '#10b981' : '#94a3b8'
                          }}></div>
                       </div>
                       <div style={{ flex: 1, overflow: 'hidden' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                             <h4 style={{ margin: 0, fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                               {chat.name}
                               {chat.blocked && <span style={{ fontSize: '0.6rem', color: 'var(--danger)', border: '1px solid var(--danger)', padding: '1px 4px', borderRadius: '4px', textTransform: 'uppercase' }}>Blocked</span>}
                             </h4>
                             <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{getLastMessageTime(chat)}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                             <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: chat.unread > 0 ? 800 : 500 }}>
                                {getLastMessageText(chat)}
                             </p>
                             {chat.unread > 0 && (
                                <span style={{ backgroundColor: 'var(--primary)', color: 'white', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '20px', fontWeight: 900 }}>{chat.unread}</span>
                             )}
                          </div>
                       </div>
                    </div>
                  ))
               )}
            </div>
         </div>

         {/* Chat Area */}
         <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-body)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ padding: '20px 32px', backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 10 }}>
               <div 
                 onClick={() => setShowProfileDrawer(true)}
                 style={{ display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}
                 title="View profile info"
               >
                  <ContactAvatar name={activeChat.name} size={48} borderRadius="14px" fallbackText={activeChat.avatar} border="2px solid var(--border-color)" />
                  <div>
                     <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 950, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>{activeChat.name}</h3>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: activeChat.status === 'online' ? '#10b981' : 'var(--text-muted)', fontWeight: 800 }}>
                        <Circle size={8} fill={activeChat.status === 'online' ? '#10b981' : '#94a3b8'} /> {activeChat.role}
                     </div>
                  </div>
               </div>
               <div style={{ display: 'flex', gap: '12px', position: 'relative' }}>
                  <button 
                    onClick={() => setCallState({ type: 'Voice', contactName: activeChat.name })}
                    className="icon-btn" 
                    title="Initiate Voice Call"
                    style={{ backgroundColor: 'var(--bg-body)' }}
                  >
                    <Phone size={20} />
                  </button>
                  <button 
                    onClick={() => setCallState({ type: 'Video', contactName: activeChat.name })}
                    className="icon-btn" 
                    title="Initiate Video Call"
                    style={{ backgroundColor: 'var(--bg-body)' }}
                  >
                    <Video size={20} />
                  </button>
                  <button 
                    onClick={() => setShowMoreMenu(!showMoreMenu)}
                    className="icon-btn" 
                    title="More Options"
                    style={{ backgroundColor: 'var(--bg-body)' }}
                  >
                    <MoreVertical size={20} />
                  </button>

                  {/* More Menu Dropdown */}
                  <AnimatePresence>
                    {showMoreMenu && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        style={{ 
                          position: 'absolute', right: 0, top: '56px', zIndex: 100,
                          width: '180px', backgroundColor: 'var(--bg-card)', borderRadius: '12px',
                          border: '1px solid var(--border-color)', padding: '8px', boxShadow: 'var(--shadow-lg)'
                        }}
                      >
                         <button 
                           onClick={handleToggleBlock}
                           style={{ 
                             width: '100%', padding: '10px 12px', background: 'none', border: 'none',
                             borderRadius: '8px', textAlign: 'left', fontSize: '0.85rem', fontWeight: 700,
                             color: 'var(--danger)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
                           }}
                           onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.06)'}
                           onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                         >
                            <Ban size={14} /> {activeChat.blocked ? 'Unblock Contact' : 'Block Contact'}
                         </button>
                         <button 
                           onClick={handleClearHistory}
                           style={{ 
                             width: '100%', padding: '10px 12px', background: 'none', border: 'none',
                             borderRadius: '8px', textAlign: 'left', fontSize: '0.85rem', fontWeight: 700,
                             color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
                           }}
                           onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--primary-light)'}
                           onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                         >
                            <Trash2 size={14} /> Clear History
                         </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
               </div>
            </div>

            {/* Message Feed */}
            <div style={{ flex: 1, padding: '32px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
               <div style={{ alignSelf: 'center', padding: '6px 16px', borderRadius: '30px', backgroundColor: 'var(--border-color)', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Conversation Log
               </div>
               
               {(!activeChat.messages || activeChat.messages.length === 0) ? (
                 <div style={{ alignSelf: 'center', margin: 'auto', textAlign: 'center', color: 'var(--text-muted)', maxWidth: '300px' }}>
                    <MessageSquare size={48} style={{ opacity: 0.15, marginBottom: '16px' }} />
                    <p style={{ fontWeight: 800, margin: 0 }}>No messages yet</p>
                    <p style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '4px' }}>Type a message below to begin the secure end-to-end conversation.</p>
                 </div>
               ) : (
                 activeChat.messages.map((msg) => {
                    const isMe = msg.sender === 'me';
                    return (
                       <motion.div 
                         key={msg.id} 
                         initial={{ opacity: 0, y: 10 }} 
                         animate={{ opacity: 1, y: 0 }} 
                         style={{ 
                           alignSelf: isMe ? 'flex-end' : 'flex-start', 
                           maxWidth: '60%' 
                         }}
                       >
                          <div style={{ 
                            padding: '16px 20px', 
                            backgroundColor: isMe ? 'var(--primary)' : 'var(--bg-card)', 
                            color: isMe ? 'white' : 'var(--text-main)', 
                            borderRadius: isMe ? '20px 20px 0 20px' : '0 20px 20px 20px', 
                            boxShadow: isMe ? '0 10px 20px -5px rgba(99, 102, 241, 0.4)' : 'var(--shadow-sm)', 
                            border: isMe ? 'none' : '1px solid var(--border-color)' 
                          }}>
                             {msg.isFile ? (
                               <div 
                                 onClick={() => {
                                   if (msg.isImage) {
                                     setPreviewImage({
                                       src: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop',
                                       name: msg.fileName
                                     });
                                   } else {
                                     handleStartDownload(msg.fileName, msg.fileSize);
                                   }
                                 }}
                                 style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '4px 0', cursor: 'pointer' }}
                                 title={msg.isImage ? "Click to view image preview" : "Click to download file"}
                               >
                                 <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: isMe ? 'rgba(255,255,255,0.2)' : 'var(--primary-light)', color: isMe ? 'white' : 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                   {msg.isImage ? <Image size={20} /> : <FileText size={20} />}
                                 </div>
                                 <div style={{ overflow: 'hidden', flex: 1 }}>
                                   <div style={{ fontSize: '0.9rem', fontWeight: 800, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '200px' }}>{msg.fileName}</div>
                                   <div style={{ fontSize: '0.7rem', opacity: 0.8, fontWeight: 600 }}>{msg.fileSize}</div>
                                 </div>
                                 <Download size={16} style={{ opacity: 0.6, marginLeft: '8px' }} />
                               </div>
                             ) : msg.isVoice ? (
                               <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '4px 0', minWidth: '180px' }}>
                                 <button 
                                   onClick={() => togglePlayVoice(msg.id, msg.duration)}
                                   style={{ 
                                     width: '32px', height: '32px', borderRadius: '50%', 
                                     backgroundColor: isMe ? 'white' : 'var(--primary)', 
                                     color: isMe ? 'var(--primary)' : 'white', 
                                     border: 'none', display: 'flex', alignItems: 'center', 
                                     justifyContent: 'center', cursor: 'pointer'
                                   }}
                                 >
                                   {playingVoiceId === msg.id ? <Pause size={14} /> : <Play size={14} style={{ marginLeft: '2px' }} />}
                                 </button>
                                 <div style={{ flex: 1 }}>
                                   <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginBottom: '4px' }}>
                                     <Volume2 size={12} />
                                     <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Voice Note</span>
                                   </div>
                                   <div style={{ width: '100%', height: '4px', backgroundColor: isMe ? 'rgba(255,255,255,0.3)' : 'var(--border-color)', borderRadius: '2px', overflow: 'hidden' }}>
                                     <div style={{ width: `${voicePlaybackProgress[msg.id] || 0}%`, height: '100%', backgroundColor: isMe ? 'white' : 'var(--primary)' }}></div>
                                   </div>
                                 </div>
                                 <span style={{ fontSize: '0.75rem', fontWeight: 800, fontFamily: 'monospace' }}>{msg.duration}</span>
                               </div>
                             ) : (
                               <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.6', whiteSpace: 'pre-line' }}>{msg.text}</p>
                             )}
                             <div style={{ 
                               display: 'flex', 
                               alignItems: 'center', 
                               justifyContent: 'flex-end', 
                               gap: '4px', 
                               marginTop: '6px', 
                               fontSize: '0.7rem', 
                               opacity: 0.8, 
                               fontWeight: 600 
                             }}>
                                {msg.time} {isMe && <CheckCheck size={14} />}
                             </div>
                          </div>
                       </motion.div>
                     );
                  })
               )}
               <div ref={messagesEndRef} />
            </div>

            {/* Blocked Contact Panel */}
            {activeChat.blocked && (
               <div style={{ padding: '16px', backgroundColor: 'rgba(239, 68, 68, 0.04)', borderTop: '1px solid rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: 'var(--danger)', position: 'relative', zIndex: 10 }}>
                  <ShieldAlert size={18} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>This contact is blocked. Unblock in options menu to message.</span>
               </div>
            )}

            {/* Input Composer Panel */}
            <div style={{ padding: '24px 32px', backgroundColor: 'var(--bg-card)', borderTop: '1px solid var(--border-color)', position: 'relative', zIndex: 10 }}>
               
               {/* Emoji Picker Popover */}
               <AnimatePresence>
                 {showEmojiPicker && (
                   <motion.div 
                     initial={{ opacity: 0, y: 15 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: 15 }}
                     style={{ 
                       position: 'absolute', bottom: '90px', right: '100px', zIndex: 100,
                       backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)',
                       padding: '12px', borderRadius: '16px', boxShadow: 'var(--shadow-xl)',
                       width: '220px'
                     }}
                   >
                     <h5 style={{ margin: '0 0 10px 0', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Quick Emojis</h5>
                     <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                        {emojis.map(e => (
                           <button 
                             key={e}
                             type="button"
                             onClick={() => appendEmoji(e)}
                             style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', padding: '4px', borderRadius: '8px', transition: '0.1s' }}
                             onMouseEnter={(el) => el.target.style.backgroundColor = 'var(--bg-body)'}
                             onMouseLeave={(el) => el.target.style.backgroundColor = 'transparent'}
                           >
                             {e}
                           </button>
                        ))}
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>

               {isRecording ? (
                 /* Voice Recording Simulation Bar */
                 <div style={{ display: 'flex', gap: '16px', alignItems: 'center', backgroundColor: 'rgba(239, 68, 68, 0.04)', padding: '12px 24px', borderRadius: '16px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                     <motion.div 
                       animate={{ scale: [1, 1.3, 1] }}
                       transition={{ repeat: Infinity, duration: 1.2 }}
                       style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ef4444' }} 
                     />
                     <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--danger)' }}>Recording Audio:</span>
                     <span style={{ fontSize: '1rem', fontWeight: 900, fontFamily: 'monospace', color: 'var(--text-main)' }}>{formatCallTime(recordingSeconds)}</span>
                     
                     {/* Simulated Graphic Waveform */}
                     <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginLeft: '24px' }}>
                       {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(bar => (
                         <motion.div 
                           key={bar}
                           animate={{ height: [8, Math.random() * 24 + 8, 8] }}
                           transition={{ repeat: Infinity, duration: 0.5 + Math.random() * 0.5, delay: bar * 0.04 }}
                           style={{ width: '3px', height: '12px', backgroundColor: '#ef4444', borderRadius: '2px' }}
                         />
                       ))}
                     </div>
                   </div>
                   
                   <div style={{ display: 'flex', gap: '12px' }}>
                     <button 
                       type="button" 
                       onClick={cancelVoiceRecording}
                       className="icon-btn" 
                       title="Cancel Recording"
                       style={{ backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}
                     >
                       <X size={18} />
                     </button>
                     <button 
                       type="button" 
                       onClick={sendVoiceRecording}
                       className="btn btn-primary"
                       style={{ padding: '8px 16px', borderRadius: '10px', fontWeight: 800, border: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
                     >
                       <Send size={16} /> Send Voice
                     </button>
                   </div>
                 </div>
               ) : (
                 <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <button 
                      type="button"
                      onClick={() => setShowAttachmentModal(true)}
                      disabled={activeChat.blocked}
                      className="icon-btn" 
                      title="Attach File"
                      style={{ backgroundColor: 'var(--bg-body)', cursor: activeChat.blocked ? 'not-allowed' : 'pointer' }}
                    >
                      <Paperclip size={20} />
                    </button>
                    <button 
                      type="button"
                      onClick={startVoiceRecording}
                      disabled={activeChat.blocked}
                      className="icon-btn" 
                      title="Record Voice Note"
                      style={{ backgroundColor: 'var(--bg-body)', cursor: activeChat.blocked ? 'not-allowed' : 'pointer', color: 'var(--primary)' }}
                    >
                      <Mic size={20} />
                    </button>
                    <div style={{ flex: 1, position: 'relative' }}>
                       <input 
                         required
                         type="text" 
                         disabled={activeChat.blocked}
                         placeholder={activeChat.blocked ? "Unblock contact to message..." : "Type your message here..."} 
                         value={message}
                         onChange={(e) => setMessage(e.target.value)}
                         style={{ 
                           width: '100%', 
                           padding: '16px 50px 16px 20px', 
                           borderRadius: '16px', 
                           border: '1px solid var(--border-color)', 
                           backgroundColor: activeChat.blocked ? 'var(--border-color)' : 'var(--bg-body)', 
                           color: 'var(--text-main)',
                           outline: 'none', 
                           fontWeight: 600, 
                           fontSize: '0.95rem',
                           cursor: activeChat.blocked ? 'not-allowed' : 'text'
                         }}
                       />
                       <Smile 
                         size={22} 
                         onClick={() => !activeChat.blocked && setShowEmojiPicker(!showEmojiPicker)}
                         style={{ 
                           position: 'absolute', 
                           right: '16px', 
                           top: '50%', 
                           transform: 'translateY(-50%)', 
                           color: 'var(--text-muted)', 
                           cursor: activeChat.blocked ? 'not-allowed' : 'pointer' 
                         }} 
                       />
                    </div>
                    <button 
                      type="submit"
                      disabled={!message.trim() || activeChat.blocked}
                      className="btn btn-primary" 
                      style={{ 
                        height: '54px', 
                        width: '54px', 
                        borderRadius: '16px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        padding: 0,
                        border: 'none',
                        cursor: (!message.trim() || activeChat.blocked) ? 'not-allowed' : 'pointer',
                        opacity: (!message.trim() || activeChat.blocked) ? 0.6 : 1
                      }}
                    >
                       <Send size={22} />
                    </button>
                 </form>
               )}
            </div>

            {/* Profile Drawer Component Overlay */}
            <AnimatePresence>
              {showProfileDrawer && (
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  style={{
                    position: 'absolute', right: 0, top: 0, bottom: 0, width: '360px',
                    backgroundColor: 'var(--bg-card)', borderLeft: '1px solid var(--border-color)',
                    zIndex: 50, display: 'flex', flexDirection: 'column', boxShadow: '-10px 0 30px rgba(0,0,0,0.15)'
                  }}
                >
                  <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontWeight: 900, fontSize: '1.2rem', color: 'var(--text-main)' }}>Contact Profile</h3>
                    <button 
                      onClick={() => setShowProfileDrawer(false)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div style={{ flex: 1, overflowY: 'auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
                    <div style={{ position: 'relative' }}>
                      <ContactAvatar name={activeChat.name} size={100} borderRadius="32px" fallbackText={activeChat.avatar} border="2px solid var(--border-color)" />
                      <div style={{ 
                        position: 'absolute', bottom: '-4px', right: '-4px', 
                        width: '20px', height: '20px', borderRadius: '50%', border: '3px solid var(--bg-card)',
                        backgroundColor: activeChat.status === 'online' ? '#10b981' : '#94a3b8'
                      }}></div>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '1.25rem', fontWeight: 950, color: 'var(--text-main)' }}>{activeChat.name}</h4>
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)', backgroundColor: 'var(--primary-light)', padding: '4px 12px', borderRadius: '12px' }}>
                        {activeChat.role}
                      </span>
                    </div>

                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '24px 0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Mail size={16} style={{ color: 'var(--text-muted)' }} />
                        <div style={{ overflow: 'hidden' }}>
                          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Email Address</div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', textOverflow: 'ellipsis', overflow: 'hidden' }}>{activeChat.email || 'N/A'}</div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Phone size={16} style={{ color: 'var(--text-muted)' }} />
                        <div>
                          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Campus Phone</div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>{activeChat.phone || 'N/A'}</div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Hash size={16} style={{ color: 'var(--text-muted)' }} />
                        <div>
                          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Office Location</div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>{activeChat.location || 'N/A'}</div>
                        </div>
                      </div>
                    </div>

                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <button 
                        onClick={() => simulateEmailDispatch(activeChat.name, activeChat.email)}
                        className="btn" 
                        style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '12px', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                      >
                        <Mail size={16} /> Send Direct Email
                      </button>

                      <button 
                        onClick={() => compileChatTranscript(activeChat)}
                        className="btn" 
                        style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '12px', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                      >
                        <FileDown size={16} /> Export Chat Transcript
                      </button>

                      <button 
                        onClick={handleToggleBlock}
                        className="btn" 
                        style={{ width: '100%', padding: '12px', border: '1px solid var(--danger)', borderRadius: '12px', backgroundColor: 'transparent', color: 'var(--danger)', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.04)'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                      >
                        <Ban size={16} /> {activeChat.blocked ? 'Unblock Contact' : 'Block Contact'}
                      </button>

                      <button 
                        onClick={handleClearHistory}
                        className="btn" 
                        style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '12px', backgroundColor: 'transparent', color: 'var(--text-muted)', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                      >
                        <Trash2 size={16} /> Clear Chat Log
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
         </div>
      </div>

      {/* Hidden File Input for Attachments */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleAttachFile} 
        style={{ display: 'none' }} 
      />

      {/* File Upload Attachment Dialog */}
      <AnimatePresence>
        {showAttachmentModal && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ width: '100%', maxWidth: '400px', backgroundColor: 'var(--bg-card)', borderRadius: '24px', padding: '32px', boxShadow: 'var(--shadow-2xl)', border: '1px solid var(--border-color)', textAlign: 'center' }}
            >
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
                 <button onClick={() => !isUploading && setShowAttachmentModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: isUploading ? 'not-allowed' : 'pointer', padding: '4px' }}>
                    <X size={20} />
                 </button>
              </div>
              <Paperclip size={40} className="text-muted" style={{ marginBottom: '16px', color: 'var(--primary)' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-main)', margin: '0 0 8px 0' }}>Share File Attachment</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 24px 0', lineHeight: '1.5' }}>Upload and dispatch documents, reports, or images securely within the chat.</p>

              {isUploading ? (
                <div style={{ padding: '10px 0' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px' }}>
                     <span>Uploading...</span>
                     <span>{uploadProgress}%</span>
                   </div>
                   <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-body)', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                      <div style={{ width: `${uploadProgress}%`, height: '100%', backgroundColor: 'var(--primary)', transition: 'width 0.2s ease-out' }}></div>
                   </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button 
                    onClick={() => fileInputRef.current.click()}
                    className="btn btn-primary"
                    style={{ padding: '14px', borderRadius: '12px', fontWeight: 800, border: 'none', width: '100%' }}
                  >
                     Choose Document or Image
                  </button>
                  <button 
                    onClick={() => setShowAttachmentModal(false)}
                    className="btn"
                    style={{ padding: '14px', borderRadius: '12px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', color: 'var(--text-muted)', fontWeight: 800, width: '100%' }}
                  >
                     Cancel
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Start New Conversation Modal */}
      <AnimatePresence>
        {showNewChatModal && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ width: '100%', maxWidth: '480px', backgroundColor: 'var(--bg-card)', borderRadius: '24px', padding: '32px', boxShadow: 'var(--shadow-2xl)', border: '1px solid var(--border-color)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                 <h3 style={{ fontSize: '1.25rem', fontWeight: 950, color: 'var(--text-main)', margin: 0 }}>Start New Conversation</h3>
                 <button onClick={() => setShowNewChatModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}>
                    <X size={20} />
                 </button>
              </div>
              
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 20px 0', lineHeight: '1.5' }}>Select a school official, administrator, or educator to start a secure direct thread.</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '280px', overflowY: 'auto', paddingRight: '4px' }}>
                {availableNewContacts.map(contact => (
                  <div 
                    key={contact.id}
                    onClick={() => startNewConversation(contact)}
                    style={{ 
                      display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 16px', 
                      borderRadius: '12px', border: '1px solid var(--border-color)', 
                      backgroundColor: 'var(--bg-body)', cursor: 'pointer', transition: '0.2s' 
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                  >
                    <ContactAvatar name={contact.name} size={40} borderRadius="12px" fallbackText={contact.avatar} border="2px solid var(--border-color)" />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)' }}>{contact.name}</h4>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>{contact.role}</span>
                    </div>
                    <Plus size={16} style={{ color: 'var(--primary)' }} />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Call Simulator Overlay Dialog */}
      <AnimatePresence>
        {callState && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(16px)', zIndex: 3000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
             <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}
             >
                <div style={{ position: 'relative' }}>
                   <ContactAvatar name={callState.contactName} size={120} borderRadius="40px" fallbackText={activeChat.avatar} border="2px solid var(--border-color)" />
                   <div style={{ 
                     position: 'absolute', inset: '-10px', borderRadius: '50px',
                     border: '2px solid rgba(99,102,241,0.3)',
                     animation: 'pulse 2s infinite'
                   }}></div>
                </div>

                <div style={{ textAlign: 'center' }}>
                   <h2 style={{ margin: '0 0 6px 0', fontSize: '1.75rem', fontWeight: 950 }}>{callState.contactName}</h2>
                   <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8, fontWeight: 700, color: 'var(--primary-light)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      Simulating Secure {callState.type} Call...
                   </p>
                   <p style={{ fontSize: '1.25rem', fontWeight: 900, marginTop: '12px', fontFamily: 'monospace' }}>
                      {formatCallTime(callDuration)}
                   </p>
                </div>

                <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                   <button 
                     onClick={() => {
                       setCallState(null);
                       showToast(`${callState.type} Call successfully completed. Duration: ${formatCallTime(callDuration)}`, 'success');
                     }}
                     className="btn" 
                     style={{ 
                       padding: '16px 36px', borderRadius: '30px', 
                       backgroundColor: '#ef4444', color: 'white', 
                       border: 'none', fontWeight: 800, fontSize: '0.95rem',
                       cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                       boxShadow: '0 10px 20px rgba(239,68,68,0.3)'
                     }}
                     onMouseEnter={(e) => e.target.style.backgroundColor = '#dc2626'}
                     onMouseLeave={(e) => e.target.style.backgroundColor = '#ef4444'}
                   >
                      <X size={16} /> End Connection
                   </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Image Preview Lightbox Overlay */}
      <AnimatePresence>
        {previewImage && (
          <div 
            onClick={() => setPreviewImage(null)}
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(16px)', zIndex: 4000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              style={{ position: 'relative', width: '100%', maxWidth: '720px', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
            >
              <img 
                src={previewImage.src} 
                alt={previewImage.name} 
                style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '500px', objectFit: 'cover' }} 
              />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 24px', backgroundColor: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>{previewImage.name}</h4>
                  <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Campus Asset Vault</span>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    onClick={() => handleStartDownload(previewImage.name, '1.2 MB')}
                    className="btn btn-primary"
                    style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800 }}
                  >
                    <Download size={16} /> Download
                  </button>
                  <button 
                    onClick={() => setPreviewImage(null)}
                    style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontWeight: 800 }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* File Downloading Progress Overlay */}
      <AnimatePresence>
        {downloadingFile && (
          <div style={{ position: 'fixed', bottom: '100px', right: '32px', zIndex: 2500, width: '320px', backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '16px', color: 'white', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <FileDown size={18} style={{ color: 'var(--primary)' }} />
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{downloadingFile.name}</div>
                <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>{downloadingFile.size} • Downloading...</div>
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 900, fontFamily: 'monospace' }}>{downloadProgress}%</span>
            </div>
            <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${downloadProgress}%`, height: '100%', backgroundColor: 'var(--primary)', transition: 'width 0.15s ease-out' }}></div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification Container */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            style={{ 
              position: 'fixed', bottom: '32px', right: '32px', zIndex: 2000, 
              display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 24px', 
              backgroundColor: '#0f172a', color: 'white', borderRadius: '20px', 
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)', maxWidth: '450px', border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div style={{ 
              width: '28px', height: '28px', borderRadius: '8px', 
              backgroundColor: toast.type === 'success' ? '#10b98120' : '#ef444420', 
              color: toast.type === 'success' ? '#10b981' : '#ef4444', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              {toast.type === 'success' ? <CheckCheck size={16} /> : <ShieldAlert size={16} />}
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, lineHeight: '1.4', flex: 1 }}>{toast.message}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InstantChat;
