import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, Brain, Globe, ChevronDown, Cpu, Sparkles, Mic, Volume2, VolumeX, Paperclip, File } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { resolveAIIntent } from '../utils/aiIntentRouter';

// ─── Hook: reads dark-mode from localStorage + syncs with Topbar toggle ──────
const useDarkMode = () => {
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem('theme') === 'dark' || document.documentElement.getAttribute('data-theme') === 'dark'
  );
  useEffect(() => {
    const sync = () => setIsDark(localStorage.getItem('theme') === 'dark' || document.documentElement.getAttribute('data-theme') === 'dark');
    window.addEventListener('storage', sync);
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => {
      window.removeEventListener('storage', sync);
      observer.disconnect();
    };
  }, []);
  return isDark;
};

// Helper to resolve high-fidelity simulation logs for search & thinking
const getAILogs = (textQuery) => {
  const queryLower = textQuery.trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
  
  let category = 'default';
  if (queryLower.match(/fee|payment|money|finance|cost|revenue|budget/)) {
    category = 'finance';
  } else if (queryLower.match(/attendance|absent|late|leave/)) {
    category = 'attendance';
  } else if (queryLower.match(/exam|grade|score|performance|result|test|gpa/)) {
    category = 'academic';
  } else if (queryLower.match(/teacher|faculty|staff|employee|payroll/)) {
    category = 'staff';
  } else if (queryLower.match(/hostel|dorm|mess|dining|food|canteen/)) {
    category = 'logistics';
  } else if (queryLower.match(/security|access|log|permission/)) {
    category = 'security';
  } else if (queryLower === 'hi' || queryLower === 'hello' || queryLower === 'hey' || queryLower === 'greetings' || queryLower === 'howdy' || queryLower === 'hi there' || queryLower === 'hello there') {
    category = 'greeting';
  }

  const logs = {
    greeting: {
      search: ['🌐 Parsing greeting...', '📄 Loaded welcome templates'],
      thinking: ['Friendly intent detected.', 'Initializing support.']
    },
    finance: {
      search: ['🌐 Accessing fees DB...', '📄 Scanned unpaid logs'],
      thinking: ['Calculating deficit.', 'Modeling payment velocity.']
    },
    attendance: {
      search: ['🌐 Reading attendance...', '📄 Correlating transit schedules'],
      thinking: ['Detected Route 4 variance.', 'Drafting notification triggers.']
    },
    academic: {
      search: ['🌐 Opening marks ledgers...', '📄 Scanning Mathematics stats'],
      thinking: ['Spotted mathematical dip.', 'Formulating tutoring intervention.']
    },
    staff: {
      search: ['🌐 Auditing faculty hours...', '📄 Ingesting prep schedules'],
      thinking: ['Redundant entry workload identified.', 'Modeling LMS automation.']
    },
    logistics: {
      search: ['🌐 Scanning mess occupancy...', '📄 Ingesting dining sensor data'],
      thinking: ['Peak flow bottleneck found.', 'Designing 20m offset windows.']
    },
    security: {
      search: ['🌐 Connecting to firewall logs...', '📄 Verifying portal 2FA keys'],
      thinking: ['Firewall blocked 1 attempt.', 'Confirming 2FA compliance.']
    },
    default: {
      search: ['🌐 Scanning system tables...', '📄 Retrieving indices'],
      thinking: ['Decoupling query terms.', 'Synthesizing recommendations.']
    }
  };

  return logs[category];
};

const AIChatbot = () => {
  const navigate = useNavigate();
  const isDark = useDarkMode();
  const [isOpen, setIsOpen] = useState(false);
  const [smartMode, setSmartMode] = useState(true);
  const [searchActive, setSearchActive] = useState(true);
  const [expandedThoughts, setExpandedThoughts] = useState({});
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hello! I am your EduPro AI Assistant. How can I help you manage the school today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesContainerRef = useRef(null);

  // Voice dictation & audio states/refs
  const [isListening, setIsListening] = useState(false);
  const [speakingMsgIndex, setSpeakingMsgIndex] = useState(null);
  const recognitionRef = useRef(null);

  // Media / File states & refs
  const [attachedFiles, setAttachedFiles] = useState([]);
  const fileInputRef = useRef(null);

  // File selection change handler
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newFiles = files.map(file => ({
      file,
      name: file.name,
      size: (file.size / 1024).toFixed(1) + ' KB',
      type: file.type,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    }));

    setAttachedFiles(prev => [...prev, ...newFiles]);
    e.target.value = ''; // Reset file input
  };

  const removeAttachedFile = (idxToRemove) => {
    setAttachedFiles(prev => {
      const item = prev[idxToRemove];
      if (item && item.preview) {
        URL.revokeObjectURL(item.preview);
      }
      return prev.filter((_, idx) => idx !== idxToRemove);
    });
  };

  // Auto-cancel active speaking/listening and purge files on chatbot window close
  useEffect(() => {
    if (!isOpen) {
      window.speechSynthesis.cancel();
      setSpeakingMsgIndex(null);
      if (isListening) {
        recognitionRef.current?.stop();
        setIsListening(false);
      }
      // Revoke file previews to prevent memory leaks
      attachedFiles.forEach(f => {
        if (f.preview) URL.revokeObjectURL(f.preview);
      });
      setAttachedFiles([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping, isOpen]);

  const executeQuery = (queryText) => {
    if (isTyping) return;
    processMessage(queryText, []);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if ((!input.trim() && attachedFiles.length === 0) || isTyping) return;
    
    processMessage(input.trim(), attachedFiles);
    setInput('');
    setAttachedFiles([]);
  };

  // Voice Speech Synthesis (Read Aloud)
  const handleSpeakText = (text, index) => {
    if (speakingMsgIndex === index) {
      window.speechSynthesis.cancel();
      setSpeakingMsgIndex(null);
      return;
    }
    window.speechSynthesis.cancel();
    // Strip styling characters for clean pronunciation
    const cleanText = text.replace(/[\*`#]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.onend = () => setSpeakingMsgIndex(null);
    utterance.onerror = () => setSpeakingMsgIndex(null);
    setSpeakingMsgIndex(index);
    window.speechSynthesis.speak(utterance);
  };

  // Voice Dictation (Speech to Text)
  const toggleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert('Speech recognition is not supported in this browser.');
        return;
      }
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';
      rec.onstart = () => {
        setIsListening(true);
      };
      rec.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setInput(prev => prev ? prev + ' ' + text : text);
      };
      rec.onerror = () => {
        setIsListening(false);
      };
      rec.onend = () => setIsListening(false);
      recognitionRef.current = rec;
      rec.start();
    }
  };

  const processMessage = (textMsg, files = []) => {
    const userMsg = { role: 'user', text: textMsg, files: files };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    const activeLogs = getAILogs(textMsg);
    
    // Asynchronous Multi-Stage Simulation
    setTimeout(() => {
      // 1. Insert placeholder for bot message with search/thinking states
      const placeholder = {
        role: 'bot',
        text: '',
        isSearching: searchActive,
        searchSteps: [],
        isThinking: smartMode,
        thinkingSteps: [],
        thinkingTime: 0
      };
      
      setMessages(prev => [...prev, placeholder]);
      setIsTyping(false);

      runSearchStage(textMsg, activeLogs);
    }, 600);
  };

  const runSearchStage = (textQuery, activeLogs) => {
    if (!searchActive) {
      runThinkingStage(textQuery, activeLogs);
      return;
    }

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < activeLogs.search.length) {
        const nextStep = activeLogs.search[currentIndex];
        setMessages(prev => {
          const updated = [...prev];
          const last = { ...updated[updated.length - 1] };
          last.searchSteps = [...(last.searchSteps || []), nextStep];
          updated[updated.length - 1] = last;
          return updated;
        });
        currentIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setMessages(prev => {
            const updated = [...prev];
            const last = { ...updated[updated.length - 1] };
            last.isSearching = false;
            updated[updated.length - 1] = last;
            return updated;
          });
          runThinkingStage(textQuery, activeLogs);
        }, 400);
      }
    }, 350);
  };

  const runThinkingStage = (textQuery, activeLogs) => {
    if (!smartMode) {
      runStreamingStage(textQuery);
      return;
    }

    let currentIndex = 0;
    let startTime = Date.now();

    const timerInterval = setInterval(() => {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      setMessages(prev => {
        const updated = [...prev];
        const last = { ...updated[updated.length - 1] };
        last.thinkingTime = elapsed;
        updated[updated.length - 1] = last;
        return updated;
      });
    }, 100);

    const stepInterval = setInterval(() => {
      if (currentIndex < activeLogs.thinking.length) {
        const nextThought = activeLogs.thinking[currentIndex];
        setMessages(prev => {
          const updated = [...prev];
          const last = { ...updated[updated.length - 1] };
          last.thinkingSteps = [...(last.thinkingSteps || []), nextThought];
          updated[updated.length - 1] = last;
          return updated;
        });
        currentIndex++;
      } else {
        clearInterval(stepInterval);
        clearInterval(timerInterval);
        
        setTimeout(() => {
          setMessages(prev => {
            const updated = [...prev];
            const last = { ...updated[updated.length - 1] };
            last.isThinking = false;
            updated[updated.length - 1] = last;
            return updated;
          });
          runStreamingStage(textQuery);
        }, 400);
      }
    }, 400);
  };

  const runStreamingStage = (textQuery) => {
    const intent = resolveAIIntent(textQuery);
    let routeAction = intent.route;
    let textResponse = intent.text;

    if (!textResponse) {
      const responses = [
        `I've analyzed your request: "${textQuery}". My predictive models suggest checking the Academic settings.`,
        `Regarding "${textQuery}", there is a strong correlation between early attendance patterns and final term results. Proactive notification is recommended.`,
        `Based on "${textQuery}", the institutional resource audit is complete. We can optimize current operational costs by 8%.`,
        `Neural Engine analysis for "${textQuery}" is ready. I suggest an archival cycle for older records to improve system speed.`
      ];
      textResponse = responses[Math.floor(Math.random() * responses.length)];
    }

    let searchPrepend = "";
    if (searchActive) {
      searchPrepend = `[Online Search Connected] `;
    }

    const fullResponse = searchPrepend + textResponse;

    let currentText = "";
    let wordIndex = 0;
    const words = fullResponse.split(" ");

    const typingInterval = setInterval(() => {
      if (wordIndex < words.length) {
        currentText += (wordIndex === 0 ? "" : " ") + words[wordIndex];
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            text: currentText,
            isStreaming: true
          };
          return updated;
        });
        wordIndex++;
      } else {
        clearInterval(typingInterval);
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            text: fullResponse,
            isStreaming: false
          };
          return updated;
        });

        if (routeAction) {
          setTimeout(() => {
            navigate(routeAction);
            setIsOpen(false);
          }, 1500);
        }
      }
    }, 80);
  };

  return (
    <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 1000 }}>
      {/* Chat Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          width: '60px', height: '60px', borderRadius: '50%', backgroundColor: isDark ? '#6366f1' : 'var(--primary)', 
          color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', 
          boxShadow: 'var(--shadow-lg)', border: 'none', cursor: 'pointer', transition: 'all 0.3s'
        }}
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div 
          style={{ 
            position: 'absolute', bottom: '80px', right: '0', width: '350px', height: '470px', 
            backgroundColor: 'var(--bg-card)', borderRadius: '20px', boxShadow: 'var(--shadow-xl)',
            display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid var(--border-color)',
            transition: 'background-color 0.3s ease'
          }}
        >
          {/* Header */}
          <div style={{ backgroundColor: isDark ? '#6366f1' : 'var(--primary)', padding: '16px 20px', color: 'white', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Bot size={24} />
            <div>
              <h4 style={{ marginBottom: 0, fontSize: '0.95rem', fontWeight: 900 }}>EduPro AI</h4>
              <p style={{ fontSize: '0.7rem', opacity: 0.8, marginBottom: 0, fontWeight: 700 }}>Online & Smart Assistant</p>
            </div>
          </div>

          {/* Mode Selector Row under header */}
          <div style={{ 
            display: 'flex', 
            gap: '8px', 
            padding: '8px 16px', 
            backgroundColor: 'var(--bg-body)', 
            borderBottom: '1px solid var(--border-color)', 
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <button
              onClick={() => {
                setSmartMode(!smartMode);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 10px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: smartMode ? (isDark ? '#6366f120' : 'rgba(99,102,241,0.1)') : 'transparent',
                color: smartMode ? '#6366f1' : 'var(--text-muted)',
                fontSize: '0.7rem',
                fontWeight: 800,
                cursor: 'pointer',
                transition: '0.2s'
              }}
            >
              <Brain size={12} /> Smart {smartMode && '✓'}
            </button>

            <button
              onClick={() => {
                setSearchActive(!searchActive);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 10px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: searchActive ? (isDark ? '#10b98120' : 'rgba(16,185,129,0.1)') : 'transparent',
                color: searchActive ? '#10b981' : 'var(--text-muted)',
                fontSize: '0.7rem',
                fontWeight: 800,
                cursor: 'pointer',
                transition: '0.2s'
              }}
            >
              <Globe size={12} /> Online {searchActive && '✓'}
            </button>
          </div>

          {/* Messages */}
          <div 
            ref={messagesContainerRef}
            style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px', backgroundColor: 'var(--bg-card)' }}
          >
            {messages.map((msg, i) => {
              const isBot = msg.role === 'bot';
              const showThoughts = expandedThoughts[i] || msg.isThinking;

              return (
                <div 
                  key={i} 
                  style={{ 
                    alignSelf: isBot ? 'flex-start' : 'flex-end',
                    maxWidth: '85%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <div
                    style={{
                      padding: '10px 14px',
                      borderRadius: '16px',
                      borderTopRightRadius: isBot ? '16px' : '4px',
                      borderTopLeftRadius: isBot ? '4px' : '16px',
                      backgroundColor: isBot ? 'var(--bg-body)' : (isDark ? '#6366f1' : 'var(--primary)'),
                      color: isBot ? 'var(--text-main)' : 'white',
                      fontSize: '0.82rem',
                      lineHeight: '1.4',
                      border: isBot ? '1px solid var(--border-color)' : 'none',
                      boxShadow: isBot ? 'none' : '0 4px 10px rgba(99, 102, 241, 0.15)'
                    }}
                  >
                    {/* Search progress logs */}
                    {isBot && (msg.searchSteps && msg.searchSteps.length > 0 || msg.isSearching) && (
                      <div style={{
                        marginBottom: '8px',
                        padding: '8px 12px',
                        borderRadius: '12px',
                        backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                        border: '1px solid #10b98115',
                        fontSize: '0.72rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontWeight: 800, marginBottom: '4px' }}>
                          <motion.div animate={{ rotate: msg.isSearching ? 360 : 0 }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }} style={{ display: 'flex' }}>
                            <Globe size={12} />
                          </motion.div>
                          <span>SEARCH INDEX ACTIVE</span>
                        </div>
                        {msg.searchSteps && msg.searchSteps.map((step, sIdx) => (
                          <div key={sIdx} style={{ color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                            <div style={{ width: '3px', height: '3px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                            {step}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Thinking steps */}
                    {isBot && (msg.thinkingSteps && msg.thinkingSteps.length > 0 || msg.isThinking) && (
                      <div style={{
                        marginBottom: '8px',
                        borderRadius: '12px',
                        border: '1px solid #6366f115',
                        backgroundColor: '#6366f104',
                        overflow: 'hidden',
                        fontSize: '0.72rem'
                      }}>
                        <div 
                          onClick={() => setExpandedThoughts(prev => ({ ...prev, [i]: !prev[i] }))}
                          style={{
                            padding: '6px 10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                            userSelect: 'none',
                            color: '#6366f1',
                            fontWeight: 800
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Brain size={12} />
                            <span>DEEP REASONING {msg.thinkingTime > 0 && `(${msg.thinkingTime}s)`}</span>
                          </div>
                          <ChevronDown size={12} style={{ transform: showThoughts ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                        </div>
                        <AnimatePresence>
                          {showThoughts && (
                            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden' }}>
                              <div style={{ padding: '0 10px 8px', display: 'flex', flexDirection: 'column', gap: '4px', borderTop: '1px solid #6366f110', paddingTop: '4px' }}>
                                {msg.thinkingSteps && msg.thinkingSteps.map((step, tIdx) => (
                                  <div key={tIdx} style={{ color: 'var(--text-muted)', fontWeight: 600, display: 'flex', gap: '4px', lineHeight: 1.3 }}>
                                    <span>•</span>
                                    <span>{step}</span>
                                  </div>
                                ))}
                                {msg.isThinking && (
                                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center', marginTop: '2px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1 }} style={{ width: '3px', height: '3px', borderRadius: '50%', backgroundColor: '#6366f1' }}></motion.div>
                                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} style={{ width: '3px', height: '3px', borderRadius: '50%', backgroundColor: '#6366f1' }}></motion.div>
                                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} style={{ width: '3px', height: '3px', borderRadius: '50%', backgroundColor: '#6366f1' }}></motion.div>
                                    <span>thinking...</span>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    {/* Render attached files if any */}
                    {!isBot && msg.files && msg.files.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '8px' }}>
                        {msg.files.map((fileObj, fIdx) => {
                          const isImg = fileObj.type.startsWith('image/');
                          return (
                            <div key={fIdx} style={{ borderRadius: '10px', overflow: 'hidden', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)', backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.25)', padding: isImg ? 0 : '8px 12px' }}>
                              {isImg ? (
                                <img src={fileObj.preview} alt={fileObj.name} style={{ display: 'block', maxWidth: '100%', maxHeight: '120px', objectFit: 'cover' }} />
                              ) : (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <File size={16} color={isDark ? '#a5b4fc' : 'var(--primary)'} />
                                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 800, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: '180px' }}>{fileObj.name}</span>
                                    <span style={{ fontSize: '0.65rem', opacity: 0.8 }}>{fileObj.size}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Main response text */}
                    <div>{msg.text}</div>
                  </div>

                  {/* Read Out Voice option for Bot messages */}
                  {isBot && msg.text && (
                    <div style={{ display: 'flex', gap: '8px', paddingLeft: '4px', marginTop: '2px', alignItems: 'center' }}>
                      <button
                        onClick={() => handleSpeakText(msg.text, i)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: speakingMsgIndex === i ? '#6366f1' : 'var(--text-muted)',
                          cursor: 'pointer',
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '2px 4px',
                          borderRadius: '6px',
                          transition: '0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = '#6366f1'}
                        onMouseLeave={e => {
                          if (speakingMsgIndex !== i) {
                            e.currentTarget.style.color = 'var(--text-muted)';
                          }
                        }}
                      >
                        {speakingMsgIndex === i ? (
                          <>
                            <VolumeX size={11} />
                            <span>Stop Voice</span>
                            <div style={{ display: 'flex', gap: '1.5px', alignItems: 'center', height: '8px' }}>
                              <motion.div animate={{ height: [2, 6, 2] }} transition={{ repeat: Infinity, duration: 0.6 }} style={{ width: '1.5px', backgroundColor: '#6366f1' }} />
                              <motion.div animate={{ height: [2, 7, 2] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.15 }} style={{ width: '1.5px', backgroundColor: '#6366f1' }} />
                              <motion.div animate={{ height: [2, 5, 2] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.3 }} style={{ width: '1.5px', backgroundColor: '#6366f1' }} />
                            </div>
                          </>
                        ) : (
                          <>
                            <Volume2 size={11} />
                            <span>Read Out</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
            {isTyping && (
              <div style={{ alignSelf: 'flex-start', padding: '10px 14px', borderRadius: '16px', backgroundColor: 'var(--bg-body)', display: 'flex', gap: '4px', border: '1px solid var(--border-color)' }}>
                 <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'var(--text-muted)' }}></motion.div>
                 <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'var(--text-muted)' }}></motion.div>
                 <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'var(--text-muted)' }}></motion.div>
              </div>
            )}
           </div>

          {/* Quick Actions */}
          {messages.length < 3 && !isTyping && (
            <div style={{ padding: '10px 15px', display: 'flex', gap: '8px', overflowX: 'auto', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)' }} className="hide-scrollbar">
               {['Show Attendance', 'Fee Setup', 'Hostel Menu'].map(action => (
                 <button 
                   key={action}
                   onClick={() => executeQuery(action)}
                   style={{ 
                     whiteSpace: 'nowrap', 
                     padding: '6px 12px', 
                     borderRadius: '20px', 
                     border: isDark ? '1px solid #6366f140' : '1px solid var(--primary)', 
                     backgroundColor: isDark ? '#6366f115' : 'var(--primary-light)', 
                     color: isDark ? '#818cf8' : 'var(--primary)', 
                     fontSize: '0.75rem', 
                     fontWeight: 800, 
                     cursor: 'pointer',
                     transition: '0.2s'
                   }}
                   onMouseEnter={e => {
                     e.currentTarget.style.backgroundColor = isDark ? '#6366f125' : 'rgba(99, 102, 241, 0.15)';
                   }}
                   onMouseLeave={e => {
                     e.currentTarget.style.backgroundColor = isDark ? '#6366f115' : 'var(--primary-light)';
                   }}
                 >
                   {action}
                 </button>
               ))}
            </div>
          )}

          {/* Input Area */}
          <form 
            onSubmit={handleSend} 
            style={{ 
              padding: '15px', 
              borderTop: isDark ? '1px solid #4a5568' : '1px solid var(--border-color)', 
              display: 'flex', 
              flexDirection: 'column',
              gap: '10px', 
              backgroundColor: isDark ? '#2d3748' : '#ffffff',
              borderBottomLeftRadius: '20px',
              borderBottomRightRadius: '20px',
              overflow: 'hidden'
            }}
          >
            {/* Attached files preview shelf */}
            {attachedFiles.length > 0 && (
              <div 
                style={{ 
                  display: 'flex', 
                  gap: '8px', 
                  overflowX: 'auto', 
                  paddingBottom: '8px',
                  borderBottom: isDark ? '1px solid #4a5568' : '1px solid var(--border-color)',
                  marginBottom: '4px'
                }}
                className="hide-scrollbar"
              >
                {attachedFiles.map((fileObj, idx) => {
                  const isImg = fileObj.type.startsWith('image/');
                  return (
                    <div 
                      key={idx} 
                      style={{ 
                        position: 'relative', 
                        width: '50px', 
                        height: '50px', 
                        borderRadius: '8px', 
                        border: isDark ? '1px solid #4a5568' : '1px solid var(--border-color)', 
                        backgroundColor: isDark ? '#1a202c' : 'var(--bg-body)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      {isImg ? (
                        <img src={fileObj.preview} alt={fileObj.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '7px' }} />
                      ) : (
                        <File size={20} color="var(--text-muted)" />
                      )}
                      
                      {/* Close delete button */}
                      <button
                        type="button"
                        onClick={() => removeAttachedFile(idx)}
                        style={{
                          position: 'absolute',
                          top: '-4px',
                          right: '-4px',
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          backgroundColor: '#ef4444',
                          color: 'white',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '9px',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        }}
                      >
                        <X size={10} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <div style={{ display: 'flex', gap: '8px', width: '100%', alignItems: 'center' }}>
              {/* Paperclip attachment button */}
              <button
                type="button"
                disabled={isTyping || isListening}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  width: '40px',
                  height: '40px',
                  padding: 0,
                  borderRadius: '12px',
                  backgroundColor: isDark ? '#1a202c' : 'var(--bg-body)',
                  color: 'var(--text-muted)',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                  flexShrink: 0
                }}
                onMouseEnter={e => e.currentTarget.style.color = isDark ? '#6366f1' : 'var(--primary)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                <Paperclip size={16} />
              </button>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                style={{ display: 'none' }} 
                multiple 
              />

              <input 
                type="text" 
                placeholder={isListening ? "Listening to your voice..." : (smartMode ? "Message AI Assistant [Smart Reasoning]..." : "Ask anything...")} 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isTyping || isListening}
                style={{ 
                  flex: 1, 
                  height: '40px',
                  marginBottom: 0, 
                  padding: '0 14px', 
                  borderRadius: '12px', 
                  backgroundColor: isDark ? '#1a202c' : 'var(--bg-body)', 
                  color: 'var(--text-main)', 
                  border: isDark ? '1px solid #4a5568' : '1px solid var(--border-color)',
                  outline: 'none',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={e => e.currentTarget.style.borderColor = isDark ? '#6366f1' : 'var(--primary)'}
                onBlur={e => e.currentTarget.style.borderColor = isDark ? '#4a5568' : 'var(--border-color)'}
              />

              {/* Microphone dictation button */}
              <button
                type="button"
                disabled={isTyping}
                onClick={toggleVoiceInput}
                style={{
                  width: '40px',
                  height: '40px',
                  padding: 0,
                  borderRadius: '12px',
                  backgroundColor: isListening ? '#ef444415' : (isDark ? '#1a202c' : 'var(--bg-body)'),
                  color: isListening ? '#ef4444' : 'var(--text-muted)',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                  flexShrink: 0
                }}
              >
                {isListening ? (
                  <motion.div animate={{ scale: [1, 1.25, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
                    <Mic size={16} />
                  </motion.div>
                ) : (
                  <Mic size={16} />
                )}
              </button>
              
              <button 
                disabled={isTyping || (!input.trim() && attachedFiles.length === 0) || isListening} 
                style={{ 
                  width: '40px',
                  height: '40px',
                  padding: 0,
                  borderRadius: '12px',
                  backgroundColor: (input.trim() || attachedFiles.length > 0) && !isListening ? (isDark ? '#6366f1' : 'var(--primary)') : (isDark ? '#1a202c' : 'var(--bg-body)'), 
                  color: (input.trim() || attachedFiles.length > 0) && !isListening ? 'white' : 'var(--text-muted)',
                  border: 'none',
                  cursor: (input.trim() || attachedFiles.length > 0) && !isListening ? 'pointer' : 'default',
                  opacity: isTyping ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                  flexShrink: 0
                }}
              >
                <Send size={16} />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AIChatbot;
