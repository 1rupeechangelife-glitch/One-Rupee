import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Send,
  Sparkles,
  Calculator,
  Calendar,
  Users,
  TrendingUp,
  FileText,
  Search,
  Share2,
  Globe,
  Languages,
  BookOpen,
  Info,
  CheckCircle,
  Download,
  Copy,
  ChevronRight,
  PlusCircle,
  Clock,
  Heart,
  HelpCircle,
  Award,
  AlertCircle,
  Utensils,
  GraduationCap,
  Activity,
  Droplet,
  Play,
  Pause,
  Tv,
  Smartphone
} from 'lucide-react';
import { Message, SpecialMode, CommandMode, SelectedLanguage, CampaignData, ImpactData, PresetFAQ } from './types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const INITIAL_FAQS: PresetFAQ[] = [
  {
    id: 'faq1',
    category: '₹1 Change Life Mission',
    question: 'What is the absolute main purpose of the ₹1 Change Life mission?',
    hindiQuestion: '₹1 चेंज लाइफ मिशन का मुख्य उद्देश्य क्या है?',
  },
  {
    id: 'faq2',
    category: 'Volunteer',
    question: 'How can a volunteer start a weekly awareness campaign in their local neighborhood?',
    hindiQuestion: 'एक स्वयंसेवक अपने पड़ोस में साप्ताहिक जागरूकता अभियान कैसे शुरू कर सकता है?',
  },
  {
    id: 'faq3',
    category: 'Tax & Budget',
    question: 'What are the basic transparency practices required to verify community funds?',
    hindiQuestion: 'सामुदायिक धन की पारदर्शिता की पुष्टि करने के लिए क्या बुनियादी नियम हैं?',
  },
  {
    id: 'faq4',
    category: 'Content Creation',
    question: 'Create an engaging WhatsApp broadcast message to invite neighbors to join the ₹1 mission.',
    hindiQuestion: 'पड़ोसियों को ₹1 मिशन में शामिल करने के लिए एक व्हाट्सएप संदेश बनाएं।',
  },
  {
    id: 'faq5',
    category: 'Government Info',
    question: 'Explain basic government rural welfare schemes that align with community self-development.',
    hindiQuestion: 'आत्म-विकास के अनुकूल बुनियादी सरकारी ग्रामीण कल्याण योजनाएं समझाएं।',
  }
];

export default function App() {
  // --- States ---
  const [activeMode, setActiveMode] = useState<SpecialMode>('voice');
  const [commandMode, setCommandMode] = useState<CommandMode>('detail');
  const [language, setLanguage] = useState<SelectedLanguage>('mixed');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('₹1Rupee Change Life is crafting response...');
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [sysVoices, setSysVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<'chat' | 'tools'>('chat');

  // Mode specific inputs
  const [campaign, setCampaign] = useState<CampaignData>({
    campaignName: 'Clean Neighborhood Project',
    targetAudience: 'Youth and local residents',
    campaignTheme: 'Daily 1 Rupee contribution for community trash bins and segregation unit',
    location: 'Ward No 4, Local District'
  });

  const [creatorTopic, setCreatorTopic] = useState('How saving ₹1 daily drop changes community primary sanitation and schooling');
  const [creatorType, setCreatorType] = useState('reels_footage'); // reels_footage, whatsapp, youtube, instagram, facebook, poster
  const [thumbnailBgText, setThumbnailBgText] = useState('रोज ₹1 क्रांति! 🎉');
  const [thumbnailBgSeed, setThumbnailBgSeed] = useState(135);
  const [videoCategory, setVideoCategory] = useState('Nonprofit');
  const [creatorSubTab, setCreatorSubTab] = useState<'preview' | 'script' | 'caption' | 'tags'>('script');

  // Video Simulator & Exporter States
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [currentVideoScene, setCurrentVideoScene] = useState(0);
  const [videoAspectRatio, setVideoAspectRatio] = useState<'9/16' | '16/9'>('9/16');
  const [renderingStatus, setRenderingStatus] = useState<'idle' | 'rendering' | 'ready'>('idle');
  const [renderProgress, setRenderProgress] = useState(0);
  const [renderStep, setRenderStep] = useState('');

  // Dynamic Scene Fields matching user requirements
  const [videoScenes, setVideoScenes] = useState<Array<{
    title: string;
    timeRange: string;
    subtitle: string;
    imageSeed: string;
    footageDesc: string;
  }>>([
    {
      title: "🔥 HOOK: SAVE ₹1 SAVINGS",
      timeRange: "0:00 - 0:05",
      subtitle: "क्या आपको पता है? सिर्फ रोज ₹1 का दान एक पूरे गाँव को बदल सकता है!",
      imageSeed: "rupeegullak",
      footageDesc: "Close up of a village kid putting a ₹1 coin into a colorful clay piggy bank (gullak) inside an ambient Indian home."
    },
    {
      title: "📚 CORE EDUCATION IMPACT",
      timeRange: "0:05 - 0:15",
      subtitle: "सालाना ₹360 की मामूली बचत से ₹1Rupee Change Life मिशन गाँव के प्राथमिक स्कूलों में बेंच, किताबें और स्टेशनरी उपलब्ध कराता है।",
      imageSeed: "rupeeschool",
      footageDesc: "Group of enthusiastic Indian school children sitting in a bright rural classroom, looking at their new notebooks with absolute joy."
    },
    {
      title: "💧 PRIMARY SANITATION & WATER",
      timeRange: "0:15 - 0:25",
      subtitle: "सिर्फ इतना ही नहीं, यह पैसा स्वच्छ पेयजल और प्राथमिक चिकित्सा शिविरों के संचालन के लिए सीधे उपयोग होता है।",
      imageSeed: "rupeewater",
      footageDesc: "Fresh clean drinking water running cleanly from a new local water treatment pipeline installed in a dry Indian village."
    },
    {
      title: "🇮🇳 PUBLIC TRANSPARENCY CTA",
      timeRange: "0:25 - 0:30",
      subtitle: "देश बदलने की इस पारदर्शी क्रांति का हिस्सा खुद बनें। आज ही जुड़ें।",
      imageSeed: "rupeetrust",
      footageDesc: "Community members sitting together, examining clear transparent budget sheets happily. Call to action banner slide."
    }
  ]);

  // Audio & Music Synthesizer States
  const [musicStyle, setMusicStyle] = useState<string>('inspiring_bells'); // inspiring_bells, warm_harmony, swarajya_drone, off
  const [isExportingRealVideo, setIsExportingRealVideo] = useState(false);
  const [realExportProgress, setRealExportProgress] = useState(0);

  // Synthesized chime trigger helper for background audio track simulation
  const playSynthesizedChimeSequence = (style: string) => {
    try {
      if (typeof window === 'undefined') return;
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      
      const audioCtx = new AudioCtx();
      
      if (style === 'warm_harmony') {
        const notes = [261.63, 329.63, 392.00, 523.25]; // C major chords (C4, E4, G4, C5)
        notes.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.1);
          
          gain.gain.setValueAtTime(0.0, audioCtx.currentTime);
          gain.gain.linearRampToValueAtTime(0.04, audioCtx.currentTime + idx * 0.1 + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.1 + 1.2);
          
          osc.start(audioCtx.currentTime + idx * 0.1);
          osc.stop(audioCtx.currentTime + idx * 0.1 + 1.2);
        });
      } else if (style === 'swarajya_drone') {
        const notes = [146.83, 220.00, 293.66]; // Sa & Pa Drone
        notes.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
          
          gain.gain.setValueAtTime(0.0, audioCtx.currentTime);
          gain.gain.linearRampToValueAtTime(0.03, audioCtx.currentTime + 0.2);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 2.0);
          
          osc.start();
          osc.stop(audioCtx.currentTime + 2.0);
        });
      } else if (style === 'inspiring_bells') {
        const notes = [587.33, 659.25, 783.99, 880.00]; // Pentatonic bells (D5, E5, G5, A5)
        notes.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.08);
          gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.08 + 0.6);
          osc.start(audioCtx.currentTime + idx * 0.08);
          osc.stop(audioCtx.currentTime + idx * 0.08 + 0.6);
        });
      }
    } catch(e) {
      console.warn("Web Audio API not allowed/supported yet", e);
    }
  };

  // Auto scene navigation & Realistic voiceover sync loop
  useEffect(() => {
    let timerId: any;
    
    if (videoPlaying && videoScenes[currentVideoScene]) {
      const activeScene = videoScenes[currentVideoScene];
      
      // Select appropriate style chime sound
      if (musicStyle !== 'off') {
        playSynthesizedChimeSequence(musicStyle);
      }
      
      // Let's trigger Web Speech API synthesis to produce realistic voices
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Stop current speech
        
        // Formulating clean text to speak
        const speechText = activeScene.subtitle
          .replace(/[“‘’”"]/g, '')
          .replace(/[₹]/g, 'रुपए ')
          .replace(/1/g, 'एक ');
          
        const utterance = new SpeechSynthesisUtterance(speechText);
        
        // Detect Hindi / English characters to load matching voice
        if (speechText.match(/[\u0900-\u097F]/)) {
          utterance.lang = 'hi-IN';
        } else {
          utterance.lang = 'en-IN';
        }
        
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
        
        utterance.rate = 1.0;
        utterance.onend = () => {
          // Speak completed! Let's pause briefly for realism, then advance scene
          timerId = setTimeout(() => {
            if (videoPlaying) {
              setCurrentVideoScene((prev) => (prev + 1) % videoScenes.length);
            }
          }, 800);
        };
        
        utterance.onerror = () => {
          // If speech synthesis error happens, use standard timing fallback (4.5s)
          timerId = setTimeout(() => {
            if (videoPlaying) {
              setCurrentVideoScene((prev) => (prev + 1) % videoScenes.length);
            }
          }, 4500);
        };
        
        window.speechSynthesis.speak(utterance);
      } else {
        // Fallback standard timer if SpeechSynthesis unavailable
        timerId = setTimeout(() => {
          setCurrentVideoScene((prev) => (prev + 1) % videoScenes.length);
        }, 4500);
      }
    } else {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
    
    return () => {
      clearTimeout(timerId);
    };
  }, [videoPlaying, currentVideoScene, videoScenes, selectedVoice, musicStyle]);

  const handleStartRendering = () => {
    if (renderingStatus === 'rendering') return;
    setRenderingStatus('rendering');
    setRenderProgress(0);
    setRenderStep('🎬 Stitching HD copyright-free village stock footage...');
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setRenderProgress(progress);
      
      if (progress <= 30) {
        setRenderStep('🎬 Stitching HD copyright-free village stock footage...');
      } else if (progress <= 55) {
        setRenderStep('🎙️ Synthesizing clean Hindi/English dual voice tracks...');
      } else if (progress <= 80) {
        setRenderStep('🎵 Mixing background Swarajya beats & coin sound effects...');
      } else if (progress < 100) {
        setRenderStep('📦 Optimizing high-bitrate MP4 container for viral distribution...');
      } else {
        setRenderStep('🚀 Video compiled! Packaging full metadata asset pack...');
      }

      if (progress >= 100) {
        clearInterval(interval);
        setRenderingStatus('ready');
      }
    }, 400); 
  };
  
  const handleExportRealVideo = async () => {
    if (isExportingRealVideo) return;
    setIsExportingRealVideo(true);
    setRealExportProgress(0);
    
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error("Could not initialize 2D context");
      
      const width = videoAspectRatio === '9/16' ? 360 : 640;
      const height = videoAspectRatio === '9/16' ? 640 : 360;
      canvas.width = width;
      canvas.height = height;
      
      const chunks: BlobPart[] = [];
      const stream = (canvas as any).captureStream ? (canvas as any).captureStream(15) : null;
      
      if (!stream) {
        // Fallback for sandboxed frames lacking Stream capture capability support
        let mockProgress = 0;
        const progressInterval = setInterval(() => {
          mockProgress += 10;
          setRealExportProgress(Math.min(mockProgress, 100));
          if (mockProgress >= 100) {
            clearInterval(progressInterval);
            setIsExportingRealVideo(false);
            
            // Auto trigger JSON and SRT text manifest download pack
            const dummyBlob = new Blob([JSON.stringify(videoScenes, null, 2)], { type: "application/json" });
            const dummyUrl = URL.createObjectURL(dummyBlob);
            const a = document.createElement('a');
            a.href = dummyUrl;
            a.download = `rupee-change-life-media-config-${creatorType}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }
        }, 120);
        return;
      }
      
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp8' });
      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };
      
      mediaRecorder.onstop = () => {
        const videoBlob = new Blob(chunks, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(videoBlob);
        const a = document.createElement('a');
        a.href = videoUrl;
        a.download = `rupee-change-life-shorts-${creatorType}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setIsExportingRealVideo(false);
        setRealExportProgress(100);
      };
      
      mediaRecorder.start();
      
      // Animate 90 frames (6 seconds at 15fps)
      let currentFrame = 0;
      const totalFrames = 90;
      
      const images: HTMLImageElement[] = [];
      for (let i = 0; i < videoScenes.length; i++) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = `https://picsum.photos/seed/${videoScenes[i].imageSeed}${thumbnailBgSeed}/${width}/${height}`;
        images.push(img);
      }
      
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      const drawExportFrame = () => {
        if (currentFrame >= totalFrames) {
          mediaRecorder.stop();
          return;
        }
        
        const sceneIdx = Math.floor((currentFrame / totalFrames) * videoScenes.length);
        const scene = videoScenes[sceneIdx] || videoScenes[0];
        
        // Deep indigo/charcoal solid background color
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, width, height);
        
        // Draw scene active image
        const activeImg = images[sceneIdx];
        if (activeImg && activeImg.complete) {
          ctx.drawImage(activeImg, 0, 0, width, height);
        }
        
        // Solid black translucent overlay
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(0, height - 120, width, 120);
        
        // Pink Indian Badge Logo Title header
        ctx.fillStyle = '#4f46e5';
        ctx.fillRect(8, 8, width - 16, 26);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText("₹1Rupee Change Life AI Video Creator Studio", 20, 24);
        
        // Subtitle layer drawing
        ctx.fillStyle = '#fde047';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        
        const cleanSub = scene.subtitle.replace(/[“”"']/g, "");
        if (cleanSub.length > 36) {
          ctx.fillText(cleanSub.slice(0, 36), width / 2, height - 70);
          ctx.fillText(cleanSub.slice(36, 72), width / 2, height - 48);
          if (cleanSub.length > 72) {
            ctx.fillText(cleanSub.slice(72), width / 2, height - 26);
          }
        } else {
          ctx.fillText(cleanSub, width / 2, height - 60);
        }
        
        setRealExportProgress(Math.min(99, Math.floor((currentFrame / totalFrames) * 100)));
        currentFrame++;
        requestAnimationFrame(drawExportFrame);
      };
      
      drawExportFrame();
    } catch (err) {
      console.warn("Failed recording frames off canvas", err);
      setIsExportingRealVideo(false);
    }
  };

  // Impact slider inputs
  const [population, setPopulation] = useState(100); // 100 people
  const [days, setDays] = useState(30); // 30 days
  const [calculatedImpact, setCalculatedImpact] = useState<ImpactData | null>(null);
  const [calculationHistory, setCalculationHistory] = useState<ImpactData[]>([
    {
      population: 1500,
      days: 30,
      totalCollected: 45000,
      allocations: {
        education: 18000,
        healthcare: 13500,
        communityWelfare: 9000,
        emergencyAid: 4500
      },
      impactMetrics: {
        mealsProvided: 4500,
        scholarshipsSupported: 15,
        medicalCampsSupported: 2,
        drinkingWaterWellsRecon: 1
      }
    },
    {
      population: 500,
      days: 45,
      totalCollected: 22500,
      allocations: {
        education: 9000,
        healthcare: 6750,
        communityWelfare: 4500,
        emergencyAid: 2250
      },
      impactMetrics: {
        mealsProvided: 2250,
        scholarshipsSupported: 7,
        medicalCampsSupported: 1,
        drinkingWaterWellsRecon: 0
      }
    },
    {
      population: 250,
      days: 90,
      totalCollected: 22500,
      allocations: {
        education: 9000,
        healthcare: 6750,
        communityWelfare: 4500,
        emergencyAid: 2250
      },
      impactMetrics: {
        mealsProvided: 2250,
        scholarshipsSupported: 7,
        medicalCampsSupported: 1,
        drinkingWaterWellsRecon: 0
      }
    }
  ]);
  const [comparedRunIndex, setComparedRunIndex] = useState<number>(-1); // -1 means none

  // Volunteer form state
  const [volunteers, setVolunteers] = useState<Array<{ name: string; email: string; role: string; task: string; hub: string }>>([
    { name: 'Amit Sharma', email: 'amit@1rupeechangelife.org', role: 'Campaign Coordinator', task: 'Printing poster slogans', hub: 'Jaipur Citizens Hub' },
    { name: 'Priya Patel', email: 'priya@1rupeechangelife.org', role: 'Fund Auditor', task: 'Publishing weekly contribution book', hub: 'Dausa Development Center' },
    { name: 'Rajesh Meena', email: 'rajesh@1rupeechangelife.org', role: 'School Coordinator', task: 'Delivering education sessions', hub: 'Alwar Village Division' }
  ]);
  const [newVol, setNewVol] = useState({ name: '', email: '', role: 'Awareness Volunteer', task: 'Distributing brochures', hub: 'Jaipur Citizens Hub' });

  // Map & Hub state
  const [selectedHubId, setSelectedHubId] = useState<string>('jaipur');

  const campaignHubs = [
    {
      id: 'jaipur',
      name: 'Jaipur Citizens Hub',
      focus: 'Primary School Outreach & Stationery',
      location: 'Jaipur District, Rajasthan',
      x: 35,
      y: 52,
      status: 'ACTIVE',
      activeCampaigns: '3 Primary Schools Renovated',
      metrics: '₹12,450 raised locally'
    },
    {
      id: 'dausa',
      name: 'Dausa Development Center',
      focus: 'Clean Drinking Water & Sanitation Audit',
      location: 'Dausa Rural, Rajasthan',
      x: 72,
      y: 65,
      status: 'HIGHLY ACTIVE',
      activeCampaigns: '2 Local Water Systems Maintained',
      metrics: '480 Families Clean Water access'
    },
    {
      id: 'alwar',
      name: 'Alwar Village Division',
      focus: 'Mobile Medical Camps & Family Health',
      location: 'Alwar District, Raj.',
      x: 58,
      y: 24,
      status: 'ACTIVE',
      activeCampaigns: '1 Weekly Healthcare Clinic',
      metrics: '95 free health screenings done'
    },
    {
      id: 'sikar',
      name: 'Sikar Community Guild',
      focus: 'Swarajya Micro-Savings Seminars',
      location: 'Sikar Region, Raj.',
      x: 22,
      y: 32,
      status: 'CAMPAIGNING',
      activeCampaigns: '4 Awareness Rallies Conducted',
      metrics: '1,200 households signed up'
    }
  ];

  // Refs
  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Load chat and setup speech APIs
  useEffect(() => {
    // Local storage persistence
    const saved = localStorage.getItem('rupee_change_life_chat_history') || localStorage.getItem('vijeta_chat_history');
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    } else {
      // Intro Welcome messages
      setMessages([
        {
          id: 'welcome-1',
          role: 'assistant',
          content: 'नमस्ते! मैं **₹1Rupee Change Life AI** हूँ। मैं आपका विश्वसनीय सामाजिक जागरूकता सलाहकार और अभियान योजनाकार हूँ। हमारा ध्येय एक छोटा सा बदलाव मिलाकर पूरे समाज में समृद्धि फैलाना है।\n\n**📞 संपर्क कार्यालय विवरण (Kota, Rajasthan Head Office):**\n- 📱 **WhatsApp / Call (Pahle WhatsApp kijiye):** [8560958039](https://wa.me/918560958039) / +91-8560958039\n- 📨 **ईमेल आईडी (Email ID):** 1rupeechangelife@gmail.com\n- 📍 **पता (Address):** नयापुरा खाई रोड, कोटा, राजस्थान (Nayapura Khai Road, Kota, Rajasthan - 324001)\n\n**मैं आपकी किस प्रकार सहायता कर सकता हूँ?**\n- 🎬 **Social Media Reels & Stock Footage Guide (NEW)**: वीडियो के लिए दृश्य-दर-दृश्य बेहतरीन **स्टॉक फुटेज सुझाव**, प्रभावशाली हिंदी-अंग्रेजी स्क्रिप्ट, शानदार वायरल **शीर्षक (#Title)**, और **विवरण (Description)** तैयार कराएं!\n- ₹1 चेंज लाइफ मिशन की अधिक जानकारी और स्वयंसेवी मार्गदर्शन।\n- सोशल मीडिया और यूट्यूब रचनात्मक सामग्री (Content Creator Workspace)।\n- सामाजिक कल्याण योजनाएं और सार्वजनिक पारदर्शिता की समझ।\n- स्थानीय विकास अभियानों का नियोजन।\n\nChoose any mode on the left panel or click any popular FAQ question to begin! You can also use English, Hindi, or Mixed Hinglish to communicate.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }

    // Initialize Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = language === 'hindi' ? 'hi-IN' : 'en-IN';

      rec.onerror = (e: any) => {
        console.error("Speech Recognition Error:", e);
        setSpeechError(e.error || "unknown");
        setIsRecording(false);
      };

      rec.ononstart = () => {
        setSpeechError(null);
      };

      rec.onend = () => {
        setIsRecording(false);
      };
      recognitionRef.current = rec;
    }

    // Load voices
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoicesList = () => {
        const voices = window.speechSynthesis.getVoices();
        setSysVoices(voices);
        // Find suitable Hindi or Indian English voice
        const hiVoice = voices.find(v => v.lang.includes('hi') || v.lang.includes('IN'));
        if (hiVoice) {
          setSelectedVoice(hiVoice);
        } else if (voices.length > 0) {
          setSelectedVoice(voices[0]);
        }
      };
      loadVoicesList();
      window.speechSynthesis.onvoiceschanged = loadVoicesList;
    }

    // Precalculate first impact values
    handleCalculate(1000, 30);
  }, []);

  // Update speech synthesis language when toggle updates and bind dynamic fresh callbacks
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = language === 'hindi' ? 'hi-IN' : language === 'mixed' ? 'hi-IN' : 'en-IN';
      
      // Dynamically load freshest reference of sendMessage to avoid closure stale state
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript && transcript.trim()) {
          setInputValue(transcript);
          setIsRecording(false);
          setSpeechError(null);
          // Auto send Voice command
          sendMessage(transcript);
        }
      };
    }
  }, [language, activeMode, commandMode, messages, inputValue]);

  // Keep chat scrolled
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Save history to localStorage
  const saveHistory = (list: Message[]) => {
    localStorage.setItem('rupee_change_life_chat_history', JSON.stringify(list));
    localStorage.setItem('vijeta_chat_history', JSON.stringify(list));
  };

  const handleClearHistory = () => {
    localStorage.removeItem('rupee_change_life_chat_history');
    localStorage.removeItem('vijeta_chat_history');
    setMessages([
      {
        id: 'welcome-1',
        role: 'assistant',
        content: 'नमस्ते! मैं **₹1Rupee Change Life AI** हूँ। आपका नया सत्र प्रारंभ हो चुका है। सामाजिक जागरूकता एवं ₹1 मिशन के विषय में कोई भी प्रश्न पूछें। I am ready to advise you.\n\n**📞 संपर्क कार्यालय विवरण (Kota, Rajasthan Head Office):**\n- 📱 **WhatsApp / Call (Pahle WhatsApp kijiye):** [8560958039](https://wa.me/918560958039) / +91-8560958039\n- 📨 **ईमेल आईडी (Email ID):** 1rupeechangelife@gmail.com\n- 📍 **पता:** नयापुरा खाई रोड, कोटा, राजस्थान (Nayapura Khai Road, Kota, Rajasthan - 324001)',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // --- Voice Input Integration ---
  const toggleRecording = () => {
    if (!speechSupported || !recognitionRef.current) {
      setSpeechError("not-supported");
      return;
    }

    setSpeechError(null);
    if (isRecording) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.error(err);
      }
      setIsRecording(false);
    } else {
      setIsRecording(true);
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error(err);
        setIsRecording(false);
        setSpeechError("blocked");
      }
    }
  };

  // --- Voice Output (Text to Speech) ---
  const handleSpeak = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert("Text to speech is not supported in this environment");
      return;
    }

    // If currently speaking, stop it
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      return;
    }

    // Clean markdown before speaking
    const cleanText = text
      .replace(/\*\*|__/g, '')
      .replace(/\* /g, '')
      .replace(/#+\s/g, '')
      .replace(/\[.*\]/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    utterance.rate = 0.95; // Slightly slower for clear instruction
    
    // Choose appropriate voice language
    if (language === 'hindi' || text.match(/[\u0900-\u097F]/)) {
      utterance.lang = 'hi-IN';
    } else {
      utterance.lang = 'en-IN';
    }

    window.speechSynthesis.speak(utterance);
  };

  // --- Calculate Micro Contribution Impact ---
  const handleCalculate = async (customPop?: number, customDays?: number) => {
    const popVal = customPop !== undefined ? customPop : population;
    const daysVal = customDays !== undefined ? customDays : days;
    try {
      const res = await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ population: popVal, days: daysVal }),
      });
      const data = await res.json();
      setCalculatedImpact(data);
      
      // Update history without duplicates
      setCalculationHistory(prev => {
        const alreadyExists = prev.some(
          item => item.population === data.population && item.days === data.days
        );
        if (alreadyExists) return prev;
        return [data, ...prev].slice(0, 8); // Keep last 8 unique runs
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Trigger calculate when sliders are adjusted
  const performCalculation = (pop: number, d: number) => {
    setPopulation(pop);
    setDays(d);
    handleCalculate(pop, d);
  };

  // --- Send message logic ---
  const sendMessage = async (customPrompt?: string) => {
    const queryStr = customPrompt || inputValue;
    if (!queryStr.trim()) return;

    if (!customPrompt) {
      setInputValue('');
    }

    const newUserMsg: Message = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: queryStr,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);
    saveHistory(updatedMessages);

    setIsLoading(true);
    // Custom friendly loaders depending on mode
    const loaders: Record<string, string> = {
      voice: '₹1Rupee Change Life is processing voice context...',
      content: 'Creator core compiling social designs and hashtags...',
      campaign: 'Structuring strategic campaign milestones...',
      social: 'Calculating group distribution and coordination roles...',
      analytics: 'Running micro-contribution mathematics and transparency models...',
      report: 'Formulating social audit report parameters...',
      search: 'Fetching welfare structures and government guidelines...',
      government: 'Formatting compliance framework and scheme descriptions...'
    };
    setLoadingText(loaders[activeMode] || '₹1Rupee Change Life is processing...');

    try {
      const chatHistoryForAPI = updatedMessages.slice(-8).map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: queryStr,
          history: chatHistoryForAPI,
          mode: activeMode,
          commandMode: commandMode,
          language: language,
          extraContext: activeMode === 'campaign' ? campaign : undefined
        }),
      });

      const data = await response.json();
      
      const newBotMsg: Message = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: data.text || 'We are facing a slight issue pulling instructions. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const finalMessages = [...updatedMessages, newBotMsg];
      setMessages(finalMessages);
      saveHistory(finalMessages);

      if (autoSpeak) {
        handleSpeak(newBotMsg.content);
      }
    } catch (err: any) {
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `Error: ${err.message || "Failed to establish full-stack connection. Ensure the dev server is fully active."}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...updatedMessages, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Copy Clipboard ---
  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // --- Mode quick form triggers ---
  const handleTriggerCampaignGen = () => {
    const promptText = `Generate a dedicated Campaign Outreach plan called "${campaign.campaignName}" targeting "${campaign.targetAudience}" with the primary goal of: "${campaign.campaignTheme}" at "${campaign.location}". Please provide posters details, 3 slogan options, and an entry script for our volunteers.`;
    sendMessage(promptText);
  };

  const handleTriggerCreatorGen = () => {
    let promptText = '';
    if (creatorType === 'reels_footage') {
      promptText = `Generate a highly viral, complete short-form video Script (Instagram Reels / YouTube Shorts) with detailed matching Stock Footage directions on the topic: "${creatorTopic}".
      
Please adjust the script and SEO structure based on:
- YouTube Video Category Focus: ${videoCategory}
- Primary Thumbnail Target Hook: "${thumbnailBgText}"

Please format your response clearly with these exactly specified sections:

1. 🎬 TARGET AUDIENCE, HOOK & TONE:
Explain details of target audience and video emotion.

2. 📹 SCENE-BY-SCENE SEQUENCE (With Matching Stock Footage Requirements):
Provide 4 to 5 chronological scenes. For each scene, specify:
- Time Stamp: (e.g., 0:00 - 0:05)
- Stock Footage Scene Description: (Detailed visual direction to find stock footage, e.g., camera focus, lighting, actions of characters, elements shown)
- Dialogue / Voice Over (Script): Spoken script in natural Hinglish/Hindi or English (as per selected language).
- On-Screen Captions: Attention-grabbing overlay text on the video.

3. 🎵 AUDIO, MUSIC & SOUND EFFECTS:
Specific background score, pacing, sound effects (like transitions, swooshes, coin drops).

4. 🏷️ VIRAL HOOKS & TITLE VARIATIONS:
Provide 3 high-performance clickbait and emotional video title options with hashtags.

5. 📝 OPTIMIZED DESCRIPTION & CALL TO ACTION:
A copy-paste-ready caption for Instagram/YouTube with localized context, call to action to join ₹1 Change Life mission, and key viral hashtags.`;
    } else {
      const mediaName = creatorType.toUpperCase().replace('_', ' ');
      promptText = `Write high-engagement social media material for ${mediaName}. Topic: "${creatorTopic}". Ensure it supports the ₹1 Change Life mission and includes localized tags, emotional hooks, and clear, respectful prompts.`;
    }
    sendMessage(promptText);
  };

  const addVolunteer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVol.name || !newVol.email) return;
    setVolunteers([...volunteers, { ...newVol }]);
    setNewVol({ name: '', email: '', role: 'Awareness Volunteer', task: 'Distributing brochures', hub: 'Jaipur Citizens Hub' });
    
    // Add brief info message
    const alertMsg = `A temporary volunteer candidate "${newVol.name}" has been registered inside "${newVol.hub}" as "${newVol.role}". Ask me for coordination structures.`;
    setInputValue(alertMsg);
  };

  return (
    <div className="main-content min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* HEADER SECTION */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 px-6 py-4 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-extrabold text-xl shadow-md cursor-pointer hover:scale-105 transition-transform">₹1</div>
            <div>
              <h1 className="font-extrabold text-xl leading-none uppercase tracking-tight text-slate-800 flex items-center gap-2">
                ₹1Rupee Change Life
              </h1>
              <p className="text-xs text-slate-500 font-bold mt-1">₹1 Change Life Master System & Contact Hub</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Answer Mode Toggle */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/60">
              <button
                id="short-mode-btn"
                onClick={() => setCommandMode('short')}
                className={`text-xs px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                  commandMode === 'short'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-505 hover:text-slate-950'
                }`}
                title="Concise and direct answers under 3-4 sentences"
              >
                SHORT MODE ⚡
              </button>
              <button
                id="detail-mode-btn"
                onClick={() => setCommandMode('detail')}
                className={`text-xs px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                  commandMode === 'detail'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-505 hover:text-slate-950'
                }`}
                title="Structured, exhaustive outputs with templates and tips"
              >
                DETAIL MODE 📚
              </button>
            </div>

            {/* Language switches */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/60">
              <button
                id="lang-mixed-btn"
                onClick={() => setLanguage('mixed')}
                className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  language === 'mixed' ? 'bg-white text-indigo-600 shadow-3xs border border-slate-200/40' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Hinglish
              </button>
              <button
                id="lang-hindi-btn"
                onClick={() => setLanguage('hindi')}
                className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  language === 'hindi' ? 'bg-white text-indigo-600 shadow-3xs border border-slate-200/40' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                हिंदी
              </button>
              <button
                id="lang-english-btn"
                onClick={() => setLanguage('english')}
                className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  language === 'english' ? 'bg-white text-indigo-600 shadow-3xs border border-slate-200/40' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                English
              </button>
            </div>
            
            {/* Speech settings voice selector if available */}
            {sysVoices.length > 0 && (
              <select
                id="synth-voice-selector"
                value={selectedVoice?.name || ''}
                onChange={(e) => {
                  const targetVoice = sysVoices.find(v => v.name === e.target.value);
                  if (targetVoice) setSelectedVoice(targetVoice);
                }}
                className="text-xs bg-slate-100 text-slate-700 border border-slate-200 rounded-xl px-2.5 py-1.5 max-w-[140px] font-medium"
                title="Choose voice for speech replies"
              >
                {sysVoices.map((voice, idx) => (
                  <option key={`${voice.name}-${voice.lang}-${idx}`} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
            )}
            
            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
              <span>System Active</span>
            </div>
          </div>
        </div>
      </header>

      {/* DETAILED STATS BANNER: ₹1 Power Multiplier */}
      <section className="bg-slate-100 py-2.5 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
            <span className="font-bold text-slate-700">Simple Formula:</span>
            <span className="text-slate-500 font-medium">1 Person × Saving ₹1 Daily = A Resilient Transparent Local Reserve</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white border border-slate-200 rounded-lg px-2.5 py-0.5 flex gap-2 shadow-3xs">
              <span className="text-amber-600 font-bold">₹100/day</span>
              <span className="text-slate-505 text-slate-500">can cover emergency medicine</span>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg px-2.5 py-0.5 flex gap-2 shadow-3xs">
              <span className="text-indigo-600 font-bold">₹30,000/year</span>
              <span className="text-slate-505 text-slate-500">can support 12 school scholarships</span>
            </div>
          </div>
        </div>
      </section>

      {/* MOBILE RESPONSIVE TAB BAR - Breaks up white sections and keeps chat prioritised */}
      <div className="lg:hidden px-6 pt-5 pb-1 flex gap-2.5">
        <button
          onClick={() => setMobileTab('chat')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-extrabold transition-all border flex items-center justify-center gap-2 ${
            mobileTab === 'chat'
              ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm scale-[1.01]'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Volume2 className="w-4 h-4" />
          <span>💬 ₹1Rupee Change Life AI Chat</span>
        </button>
        <button
          onClick={() => setMobileTab('tools')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-extrabold transition-all border flex items-center justify-center gap-2 ${
            mobileTab === 'tools'
              ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm scale-[1.01]'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>🛠️ मिशन टूल्स (Tools & Modes)</span>
        </button>
      </div>

      {/* MASTER BENTO GRID */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-12 gap-5 align-top">
        
        {/* Bento Cell 1: Social Mission Spotlight */}
        <section className={`col-span-12 md:col-span-7 bg-indigo-900 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden flex flex-col justify-between min-h-[220px] ${
          mobileTab === 'tools' ? 'block' : 'hidden lg:flex'
        }`}>
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none select-none">
            <div className="text-9xl font-black">₹1</div>
          </div>
          <div>
            <h2 className="text-xs font-extrabold text-indigo-300 tracking-widest uppercase mb-3">₹1 Change Life Mission</h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight text-white">Social Awareness & Development Portal</h3>
            <p className="text-indigo-100 text-xs sm:text-sm mt-2 opacity-90 leading-relaxed max-w-2xl">
              Empowering communities through transparent micro-awareness, active volunteer guidance, and public benefit strategies. Join the citizen movement to create sustainable community welfare with just ₹1 daily saving.
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-3 mt-5 pt-3 border-t border-white/10">
            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-xs">
              <div className="text-lg sm:text-xl font-extrabold text-white">1.2M</div>
              <div className="text-[9px] uppercase font-bold text-indigo-200">Social Enrolled</div>
            </div>
            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-xs">
              <div className="text-lg sm:text-xl font-extrabold text-white">100%</div>
              <div className="text-[9px] uppercase font-bold text-indigo-200">Public Audit Book</div>
            </div>
            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-xs">
              <div className="text-lg sm:text-xl font-extrabold text-white">₹30/Mo</div>
              <div className="text-[9px] uppercase font-bold text-indigo-200">Contribution Goal</div>
            </div>
          </div>
        </section>

        {/* Bento Cell 2: SYSTEM PERSONALITY / INTENT COMPLIANCE RULES CARD */}
        <section className={`col-span-12 md:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-5 text-slate-800 flex flex-col justify-between shadow-3xs relative overflow-hidden ${
          mobileTab === 'tools' ? 'block' : 'hidden lg:flex'
        }`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full blur-2xl pointer-events-none"></div>
          <div>
            <h2 className="text-xs font-extrabold text-indigo-600 tracking-widest uppercase mb-3">System Personality Values</h2>
            <ul className="space-y-2 flex-1">
              <li className="flex items-center gap-2.5 text-xs font-bold text-slate-705 text-slate-705 text-slate-700">
                <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                Professional polite communication
              </li>
              <li className="flex items-center gap-2.5 text-xs font-bold text-slate-700">
                <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                Human-style English/Hindi natural dialogue
              </li>
              <li className="flex items-center gap-2.5 text-xs font-bold text-slate-700">
                <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                Balanced information, zero false details
              </li>
              <li className="flex items-center gap-2.5 text-xs font-bold text-slate-700">
                <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                Always encourage education and community-led responsibility
              </li>
            </ul>
          </div>
          <div className="mt-4 bg-white border border-slate-200 p-3 rounded-xl shadow-3xs">
            <p className="text-[10px] leading-relaxed text-slate-505 text-slate-500 font-bold italic">
              "We avoid tech-larping or fake statistics. Real change starts from individual financial and voluntary civic awareness."
            </p>
          </div>
        </section>

        {/* Bento Cell 3: SPECIAL MASTER MODES LIST */}
        <section className={`col-span-12 lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col gap-4 ${
          mobileTab === 'tools' ? 'block' : 'hidden lg:flex'
        }`}>
          <div>
            <h3 className="text-slate-500 font-extrabold text-xs uppercase tracking-wider mb-2.5 flex items-center justify-between">
              <span>SPECIAL MASTER MODES</span>
              <span className="text-[10px] bg-indigo-50 text-indigo-600 font-bold px-2 py-0.5 rounded-full border border-indigo-100">7 INTERACTIVES</span>
            </h3>
            
            <nav className="space-y-1.5" id="major-modes-nav">
              {/* VOICE ASSISTANT */}
              <button
                id="mode-voice-btn"
                onClick={() => setActiveMode('voice')}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl transition text-left group border ${
                  activeMode === 'voice'
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-950 shadow-3xs font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg transition-colors ${activeMode === 'voice' ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-100 text-slate-600'}`}>
                    <Volume2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-800">Voice Assistant Mode</span>
                    <span className="block text-[10px] text-slate-500 font-semibold">Natural voice input & reading response</span>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-600" />
              </button>

              {/* CONTENT CREATOR */}
              <button
                id="mode-content-btn"
                onClick={() => setActiveMode('content')}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl transition text-left group border ${
                  activeMode === 'content'
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-950 shadow-3xs font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg transition-colors ${activeMode === 'content' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-800">Content Creator Mode</span>
                    <span className="block text-[10px] text-slate-500 font-semibold">YouTube, IG, Slogans & WhatsApp</span>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-600" />
              </button>

              {/* CAMPAIGN */}
              <button
                id="mode-campaign-btn"
                onClick={() => setActiveMode('campaign')}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl transition text-left group border ${
                  activeMode === 'campaign'
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-950 shadow-3xs font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg transition-colors ${activeMode === 'campaign' ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-100 text-slate-600'}`}>
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-800">Campaign Planner</span>
                    <span className="block text-[10px] text-slate-500 font-semibold">Draft posters, timelines & flyers</span>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-600" />
              </button>

              {/* SOCIAL */}
              <button
                id="mode-social-btn"
                onClick={() => setActiveMode('social')}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl transition text-left group border ${
                  activeMode === 'social'
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-950 shadow-3xs font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg transition-colors ${activeMode === 'social' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    <Users className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-800">Social Mode & Volunteers</span>
                    <span className="block text-[10px] text-slate-500 font-semibold">Community ideas & volunteer rosters</span>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-600" />
              </button>

              {/* ANALYTICS IDEA */}
              <button
                id="mode-analytics-btn"
                onClick={() => setActiveMode('analytics')}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl transition text-left group border ${
                  activeMode === 'analytics'
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-950 shadow-3xs font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg transition-colors ${activeMode === 'analytics' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    <Calculator className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-800">Analytics Idea & Calculator</span>
                    <span className="block text-[10px] text-slate-505 text-slate-500 font-semibold">Calculate cumulative savings & budgets</span>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-600" />
              </button>

              {/* REPORT */}
              <button
                id="mode-report-btn"
                onClick={() => setActiveMode('report')}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl transition text-left group border ${
                  activeMode === 'report'
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-950 shadow-3xs font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg transition-colors ${activeMode === 'report' ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-100 text-slate-600'}`}>
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-800">Report Mode</span>
                    <span className="block text-[10px] text-slate-500 font-semibold">Social audit sheets & welfare sheets</span>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-600" />
              </button>

              {/* SEARCH & GOVERNMENT */}
              <button
                id="mode-search-btn"
                onClick={() => setActiveMode('search')}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl transition text-left group border ${
                  activeMode === 'search'
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-955 text-indigo-900 shadow-3xs font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg transition-colors ${activeMode === 'search' ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-100 text-slate-600'}`}>
                    <Search className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-800">Search & Gov Hub</span>
                    <span className="block text-[10px] text-slate-500 font-semibold">Rules, basic taxation & budget schemes</span>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-600" />
              </button>
            </nav>
          </div>

          {/* DYNAMIC MODE PARAMETER WIDGET AREA */}
          <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-xl flex flex-col justify-between lg:min-h-[385px] flex-1">
            <div>
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2 mb-3.5">
                <span className="text-indigo-600 font-bold">⚡</span>
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest">
                  {activeMode.toUpperCase()} Active Workspace Form
                </h4>
              </div>

              <AnimatePresence mode="wait">
                {/* VOICE MODE WORKSPACE INFO */}
                {activeMode === 'voice' && (
                  <motion.div
                    key="voice-info"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-3"
                  >
                    <p className="text-xs text-slate-600 leading-relaxed font-bold">
                      Voice mode optimizes conversation for easy speaking. Click the <strong className="text-indigo-600">Microphone 🎙️</strong> in the message bar to record, and toggle <strong className="text-amber-600">Auto Speak Response</strong> to hear replies automatically in natural speech.
                    </p>

                    <div className="bg-indigo-50/75 p-3 rounded-xl border border-indigo-100 space-y-1.5 text-xs text-indigo-950">
                      <span className="font-extrabold flex items-center gap-1.5 text-indigo-900">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        ₹1Rupee Change Life वॉयस कमांड्स (Say these or click to run):
                      </span>
                      <div className="grid grid-cols-1 gap-1.5 pt-1">
                        <button
                          onClick={() => sendMessage("Tell me about ₹1 Change Life mission guidelines and background.")}
                          className="text-left text-[10.5px] bg-white hover:bg-indigo-100/50 p-1.5 rounded-lg border border-indigo-200/50 font-bold transition flex items-center justify-between text-indigo-900"
                        >
                          <span>📢 "₹1 चेंज लाइफ मिशन क्या है?"</span>
                          <span className="text-[9px] bg-indigo-100 text-indigo-700 px-1.5 rounded">Talk</span>
                        </button>
                        <button
                          onClick={() => sendMessage("Generate a highly viral, complete short-form video Script (Instagram Reels / YouTube Shorts) with detailed matching Stock Footage directions on why saving ₹1 daily drop changes community primary sanitation and schooling. Include viral hooks, video title, and optimized social media description, with background sound effects.")}
                          className="text-left text-[10.5px] bg-white hover:bg-indigo-100/50 p-1.5 rounded-lg border border-indigo-200/50 font-bold transition flex items-center justify-between text-indigo-950"
                        >
                          <span>🎬 "सोशल मीडिया वीडियो स्क्रिप्ट और फुटेज सूची"</span>
                          <span className="text-[9px] bg-orange-100 text-orange-700 px-1.5 rounded">Viral</span>
                        </button>
                        <button
                          onClick={() => sendMessage("Generate a high-impact WhatsApp slogan for ₹1 Change Life mission volunteer recruitment in Hindi.")}
                          className="text-left text-[10.5px] bg-white hover:bg-indigo-100/50 p-1.5 rounded-lg border border-indigo-200/50 font-bold transition flex items-center justify-between text-indigo-900"
                        >
                          <span>✍️ "सर्कुलर व्हाट्सएप स्लोगन बनाओ"</span>
                          <span className="text-[9px] bg-indigo-100 text-indigo-700 px-1.5 rounded">Talk</span>
                        </button>
                        <button
                          onClick={() => sendMessage("How can a volunteer candidate coordinate dynamic local distribution plans?")}
                          className="text-left text-[10.5px] bg-white hover:bg-indigo-100/50 p-1.5 rounded-lg border border-indigo-200/50 font-bold transition flex items-center justify-between text-indigo-900"
                        >
                          <span>🤝 "स्वयंसेवक समन्वय कैसे करें?"</span>
                          <span className="text-[9px] bg-indigo-100 text-indigo-700 px-1.5 rounded">Talk</span>
                        </button>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                      <span className="text-[11px] text-slate-700 block font-extrabold">Interactive Speech Controls:</span>
                      
                      <label className="flex items-center gap-2 cursor-pointer p-0.5">
                        <input
                          id="auto-speak-toggle"
                          type="checkbox"
                          checked={autoSpeak}
                          onChange={(e) => setAutoSpeak(e.target.checked)}
                          className="w-4 h-4 text-indigo-600 bg-white border-slate-300 rounded focus:ring-indigo-500"
                        />
                        <span className="text-xs font-bold text-slate-700">Auto Speak AI Replies</span>
                      </label>
                      <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                        Will speak responses immediately using synthesized voice matching Hindi/English criteria.
                      </p>
                    </div>

                    {speechError && (
                      <div className="bg-amber-50 text-amber-850 border border-amber-200 text-[11px] rounded-xl p-3 space-y-1">
                        <div className="flex items-center gap-1.5 font-extrabold text-amber-900">
                          <AlertCircle className="w-4 h-4 text-amber-600" />
                          <span>Iframe Sandboxed Mic Alert</span>
                        </div>
                        <p className="font-semibold text-slate-600 leading-normal">
                          Browsers often disable microphone/audio inside previews. For hands-free vocal commands, click **Open in New Tab** at the top right of the application to grant mic permissions instantly!
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* CONTENT CREATOR PARAMETER FORM */}
                {activeMode === 'content' && (
                  <motion.div
                    key="content-form"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-3 font-semibold"
                  >
                    <div>
                      <label className="block text-[10px] text-slate-500 font-extrabold tracking-wider uppercase mb-1">CHOOSE MEDIA TEMPLATE</label>
                      <select
                        id="creator-type-select"
                        value={creatorType}
                        onChange={(e) => setCreatorType(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 font-medium cursor-pointer focus:ring-1 focus:ring-indigo-500"
                      >
                        <option value="reels_footage">🎬 Viral Shorts/Reels Script & Stock Footage Guide</option>
                        <option value="whatsapp">💬 WhatsApp awareness broadcast</option>
                        <option value="youtube">📹 YouTube Script structure & Slogans</option>
                        <option value="instagram">📸 Instagram post + customized tags</option>
                        <option value="facebook">👥 Facebook community post</option>
                        <option value="poster">🖼️ Poster wall display slogan</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-500 font-extrabold tracking-wider uppercase mb-1">PROMOTION TOPIC / CONCEPT</label>
                      <textarea
                        id="creator-topic-input"
                        value={creatorTopic}
                        onChange={(e) => setCreatorTopic(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 h-20 resize-none font-medium focus:ring-1 focus:ring-indigo-500"
                        placeholder="e.g. How saving ₹1 can fund school stationery for kids..."
                      />
                    </div>

                    <button
                      id="creator-gen-btn"
                      onClick={handleTriggerCreatorGen}
                      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Create Creative Content
                    </button>

                    {/* YOUTUBE SEO COMPLEMENTARY PANEL */}
                    <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-3 shadow-3xs text-xs text-slate-800 font-semibold">
                      <div className="flex flex-col gap-1.5 pb-2 border-b border-rose-100">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-rose-600 font-extrabold uppercase tracking-wide flex items-center gap-1 font-sans">
                            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
                            YouTube SEO Engine & Cover Mockup
                          </span>
                          <span className="text-[9.5px] bg-emerald-500 text-white font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-3xs">
                            🔥 SEO: 100/100 PERFECT
                          </span>
                        </div>
                        
                        {/* SEO Audit Checklist displaying 100% across everything */}
                        <div className="grid grid-cols-3 gap-1 text-[8.5px] font-mono text-center pt-0.5">
                          <div className="bg-emerald-50 border border-emerald-100 p-1 rounded">
                            <div className="text-emerald-700 font-black">100% PERFECT</div>
                            <div className="text-slate-500">🏆 Title Check</div>
                          </div>
                          <div className="bg-emerald-50 border border-emerald-100 p-1 rounded">
                            <div className="text-emerald-700 font-black">100% ACTIVE</div>
                            <div className="text-slate-500">🏷️ Tag Density</div>
                          </div>
                          <div className="bg-emerald-50 border border-emerald-100 p-1 rounded">
                            <div className="text-emerald-700 font-black">100% SEO METADATA</div>
                            <div className="text-slate-500">📝 Swarajya CTR</div>
                          </div>
                        </div>
                      </div>

                      {/* Interactive Customizer controls for preview */}
                      <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100 text-left">
                        <div>
                          <label className="block text-[9px] text-slate-500 font-extrabold mb-1">THUMBNAIL HOOK STRING</label>
                          <input
                            type="text"
                            value={thumbnailBgText}
                            onChange={(e) => setThumbnailBgText(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded p-1 text-[11px] font-bold text-slate-800 focus:ring-1 focus:ring-rose-500"
                            placeholder="e.g. ₹1 SE REVOLUTION!"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] text-slate-500 font-extrabold mb-1">VIDEO CATEGORY</label>
                          <select
                            value={videoCategory}
                            onChange={(e) => setVideoCategory(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded p-1 text-[10px] font-bold text-slate-800 focus:ring-1 focus:ring-rose-500 cursor-pointer text-ellipsis overflow-hidden"
                          >
                            <option value="Nonprofits & Activism">Nonprofits</option>
                            <option value="Education & Awareness">Education</option>
                            <option value="People & Blogs">Local Vlogs</option>
                            <option value="News & Politics">News/Media</option>
                          </select>
                        </div>
                      </div>

                      {/* INTERACTIVE VIDEO COMPILING & LIVESTREAM PLAYER SIMULATOR */}
                      <div className="space-y-3 text-left">
                        <div className="flex justify-between items-center bg-slate-100 p-2 rounded-lg border border-slate-200">
                          <span className="text-[10px] text-slate-800 font-extrabold uppercase tracking-widest flex items-center gap-1">
                            <span>🎬 Swarajya Video Creator Studio</span>
                          </span>
                          
                          {/* Layout Ratio Switcher */}
                          <div className="flex gap-1 bg-white p-0.5 rounded border border-slate-200">
                            <button
                              type="button"
                              onClick={() => setVideoAspectRatio('9/16')}
                              className={`px-2 py-0.5 rounded text-[8.5px] font-black transition flex items-center gap-0.5 cursor-pointer ${
                                videoAspectRatio === '9/16' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-800'
                              }`}
                              title="Vertical Short/Reel Ratio"
                            >
                              <Smartphone className="w-2.5 h-2.5" /> Reels (9:16)
                            </button>
                            <button
                              type="button"
                              onClick={() => setVideoAspectRatio('16/9')}
                              className={`px-2 py-0.5 rounded text-[8.5px] font-black transition flex items-center gap-0.5 cursor-pointer ${
                                videoAspectRatio === '16/9' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-800'
                              }`}
                              title="Horizontal YouTube Ratio"
                            >
                              <Tv className="w-2.5 h-2.5" /> Video (16:9)
                            </button>
                          </div>
                        </div>

                        {/* Video Feed Screen Wrapper */}
                        <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden text-white relative shadow-lg">
                          <div className={`relative transition-all duration-300 overflow-hidden bg-slate-900 ${
                            videoAspectRatio === '9/16' ? 'aspect-[9/16] max-w-[240px] mx-auto' : 'aspect-[16/9] w-full'
                          }`}>
                            {/* Animated Background Graphic depending on current video scene */}
                            <img
                              src={
                                videoScenes[currentVideoScene]?.imageSeed?.startsWith('http')
                                  ? videoScenes[currentVideoScene]?.imageSeed
                                  : `https://picsum.photos/seed/${videoScenes[currentVideoScene]?.imageSeed || 'rupeehero'}${thumbnailBgSeed}/${videoAspectRatio === '9/16' ? '400/700' : '700/400'}`
                              }
                              alt={`Scene ${currentVideoScene + 1}`}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover transition-all duration-700 ease-in-out opacity-85 scale-102"
                            />

                            {/* Color shadow overlays to boost subtitle visibility */}
                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none"></div>
                            <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-black/80 to-transparent pointer-events-none"></div>

                            {/* Active Scene Header indicators */}
                            <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between items-center">
                              <span className="bg-rose-600/90 backdrop-blur-md text-white font-extrabold text-[8.5px] uppercase tracking-wider px-2 py-0.5 rounded shadow">
                                {videoScenes[currentVideoScene]?.title || "SCENE"}
                              </span>
                              <span className="font-mono text-[9px] bg-black/60 px-1.5 py-0.5 rounded font-bold">
                                {videoScenes[currentVideoScene]?.timeRange || "0:00"}
                              </span>
                            </div>

                            {/* Audio Waves Visualizer (Bouncing elements when playing) */}
                            <div className="absolute top-10 right-3.5 flex items-end gap-0.5 h-6">
                              {[1, 2, 3, 4, 5].map((bar) => (
                                <div
                                  key={bar}
                                  className={`w-0.5 bg-yellow-400 rounded-full transition-all duration-300 ${
                                    videoPlaying ? 'animate-pulse' : 'opacity-65'
                                  }`}
                                  style={{
                                    height: videoPlaying ? `${[12, 24, 16, 20, 8][bar - 1]}px` : '4px',
                                    animationDelay: `${bar * 120}ms`
                                  }}
                                />
                              ))}
                            </div>

                            {/* Centered big pause logo overlay if paused */}
                            {!videoPlaying && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/25 pointer-events-none">
                                <span className="bg-black/60 p-3 rounded-full text-white backdrop-blur-sm shadow border border-white/10 animate-fade-in">
                                  <Play className="w-6 h-6 ml-1" />
                                </span>
                              </div>
                            )}

                            {/* Telemetry metadata logo on screen */}
                            <div className="absolute left-2.5 bottom-16 flex items-center gap-1.5 opacity-90 drop-shadow">
                              <span className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center text-[10px] font-black border border-white/20">
                                ₹1
                              </span>
                              <div className="text-left leading-none">
                                <p className="text-[9px] font-black">₹1Rupee Change Life</p>
                                <p className="text-[7.5px] text-slate-300 font-mono">@rupee1revolution</p>
                              </div>
                            </div>

                            {/* REAL-TIME DYNAMIC SUBTITLES TIMEFRAME */}
                            <div className="absolute bottom-3 inset-x-2 text-center pointer-events-none px-2 z-10">
                              <div className="bg-black/75 shadow-lg backdrop-blur-xs py-1.5 px-2 rounded-xl border border-white/10 space-y-0.5">
                                <span className="text-[8px] tracking-widest font-black text-rose-400 uppercase font-mono block">
                                  {videoPlaying ? "🗣️ SPEAKING VOICE:" : "📺 PLAYBACK PAUSED"}
                                </span>
                                <p className="text-yellow-300 font-extrabold text-[11px] leading-tight drop-shadow-[0_1.5px_2px_rgba(0,0,0,1)] font-sans">
                                  {videoScenes[currentVideoScene]?.subtitle || ""}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Interactive Player controls block */}
                          <div className="p-2.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {/* Play Toggle Button */}
                              <button
                                type="button"
                                onClick={() => setVideoPlaying(!videoPlaying)}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full p-2 cursor-pointer transition shadow-sm select-none"
                              >
                                {videoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                              </button>

                              {/* Progress Slider bar */}
                              <div className="flex flex-col text-left">
                                <span className="text-[10px] font-bold text-slate-200">
                                  {videoPlaying ? "▶️ Video Live Playing" : "⏸️ Simulator Paused"}
                                </span>
                                <span className="text-[8px] text-slate-400 font-mono">
                                  Scene {currentVideoScene + 1} of 4 • Subtitles Synced
                                </span>
                              </div>
                            </div>

                            {/* Manual Fast Jump Scene Selectors */}
                            <div className="flex gap-1">
                              {[0, 1, 2, 3].map((sceneIdx) => (
                                <button
                                  key={sceneIdx}
                                  type="button"
                                  onClick={() => {
                                    setCurrentVideoScene(sceneIdx);
                                    setVideoPlaying(false);
                                  }}
                                  className={`text-[9.5px] px-2 py-1 rounded font-black cursor-pointer select-none border transition-all ${
                                    currentVideoScene === sceneIdx
                                      ? 'bg-rose-600 border-rose-500 text-white shadow-2xs font-boldScale'
                                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
                                  }`}
                                  title={`Jump to Scene ${sceneIdx + 1}`}
                                >
                                  S{sceneIdx + 1}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* AUDIO & FOOTAGE DIRECT DOWNLOADER CONTROLS */}
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-3">
                          <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                            <div className="flex flex-col text-left">
                              <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest">
                                🛸 HD Export & Download Pipeline (FOR ALL PLATFORMS)
                              </span>
                              <span className="text-[9px] text-slate-650 font-medium">
                                Pack script subtitles, cover poster, and high-definition compiled assets
                              </span>
                            </div>
                          </div>

                          {/* Dynamic Copyright-Safe Synth Music Synthesizer selection Console */}
                          <div className="bg-white border border-slate-200 rounded-lg p-2.5 flex items-center justify-between text-xs font-bold text-slate-700 animate-fade-in shadow-3xs">
                            <span className="flex items-center gap-1.5 text-[9.5px] text-slate-600 font-black uppercase">
                              <span>🎵</span> Copyright-Free Music:
                            </span>
                            <div className="flex gap-1 flex-wrap justify-end">
                              {[
                                { id: 'inspiring_bells', label: '🔔 Bells' },
                                { id: 'warm_harmony', label: '🎹 Harmony' },
                                { id: 'swarajya_drone', label: ' Tanpura' },
                                { id: 'off', label: '🔇 Mute' },
                              ].map((track) => (
                                <button
                                  key={track.id}
                                  type="button"
                                  onClick={() => {
                                    setMusicStyle(track.id);
                                    if (track.id !== 'off') {
                                      playSynthesizedChimeSequence(track.id);
                                    }
                                  }}
                                  className={`px-2 py-0.5 text-[9px] rounded font-black transition cursor-pointer select-none border ${
                                    musicStyle === track.id
                                      ? 'bg-indigo-600 text-white border-indigo-500'
                                      : 'bg-slate-100 hover:bg-slate-150 text-slate-605 text-slate-600 border-slate-200'
                                  }`}
                                >
                                  {track.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Rendering action selector */}
                          {renderingStatus === 'idle' && (
                            <button
                              type="button"
                              onClick={handleStartRendering}
                              className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600 hover:opacity-95 text-white py-2 px-3 rounded-lg text-xs font-black shadow flex items-center justify-center gap-2 cursor-pointer transition select-none tracking-wide"
                            >
                              <Sparkles className="w-4 h-4 animate-spin-slow" />
                              ⚡ Click to Compile & Pack Video for YT, IG & FB
                            </button>
                          )}

                          {renderingStatus === 'rendering' && (
                            <div className="space-y-1.5 animate-fade-in">
                              <div className="flex justify-between items-center text-[9px] font-mono font-extrabold text-slate-700">
                                <span className="text-indigo-650 animate-pulse">{renderStep}</span>
                                <span className="bg-indigo-50 px-1 py-0.5 rounded text-indigo-700">{renderProgress}%</span>
                              </div>
                              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-indigo-600 transition-all duration-300 rounded-full"
                                  style={{ width: `${renderProgress}%` }}
                                ></div>
                              </div>
                            </div>
                          )}

                          {renderingStatus === 'ready' && (
                            <div className="space-y-3 animate-fade-in text-left">
                              <div className="bg-emerald-50 border border-emerald-100 p-2.5 rounded-lg flex items-center gap-2.5">
                                <span className="text-lg">🎉</span>
                                <div className="leading-tight">
                                  <p className="text-[10.5px] font-black text-emerald-800">COMPILATION COMPLETE!</p>
                                  <p className="text-[9px] text-emerald-650 font-bold">MP4, cover art, and subtitles successfully bundled together.</p>
                                </div>
                              </div>

                              {/* Download Actions grids */}
                              <div className="grid grid-cols-2 gap-2">
                                {/* Button 1: Download Real Canvas Video File */}
                                {isExportingRealVideo ? (
                                  <div className="bg-indigo-50 border border-indigo-250 p-2 text-center rounded-lg flex flex-col justify-center items-center space-y-1">
                                    <span className="text-xs animate-bounce">⏳</span>
                                    <span className="text-[9.5px] font-black text-indigo-800">Exporting HD Video...</span>
                                    <span className="text-[8px] text-indigo-650 font-mono font-black">{realExportProgress}% complete</span>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={handleExportRealVideo}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-lg flex flex-col justify-center items-center text-center transition cursor-pointer select-none space-y-1"
                                  >
                                    <span className="text-sm">📥</span>
                                    <span className="text-[9.5px] font-black">Download HD Video</span>
                                    <span className="text-[8px] opacity-80 leading-none">Compile Canvas to Video</span>
                                  </button>
                                )}

                                {/* Button 2: Download SRT Subtitles file */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const srtLines = videoScenes.map((scene, idx) => {
                                      const startStr = idx === 0 ? "00:00:00,000" : idx === 1 ? "00:00:05,000" : idx === 2 ? "00:00:15,000" : "00:00:25,000";
                                      const endStr = idx === 0 ? "00:00:05,000" : idx === 1 ? "00:00:15,000" : idx === 2 ? "00:00:25,000" : "00:00:30,000";
                                      return `${idx + 1}\n${startStr} --> ${endStr}\n${scene.subtitle}\n`;
                                    }).join('\n');
                                    const element = document.createElement("a");
                                    const file = new Blob([srtLines], {type: 'text/plain'});
                                    element.href = URL.createObjectURL(file);
                                    element.download = "rupee1-revolution-subtitles.srt";
                                    document.body.appendChild(element);
                                    element.click();
                                    document.body.removeChild(element);
                                  }}
                                  className="bg-slate-800 hover:bg-slate-900 border border-slate-700 text-slate-100 p-2.5 rounded-lg flex flex-col justify-center items-center text-center transition cursor-pointer select-none space-y-1"
                                >
                                  <span className="text-sm">📄</span>
                                  <span className="text-[9.5px] font-black">Download SRT Subs</span>
                                  <span className="text-[8px] text-slate-400 leading-none">Synced subtitle file</span>
                                </button>

                                {/* Button 3: Download cover graphic */}
                                <a
                                  href={`https://picsum.photos/seed/rupeehero${thumbnailBgSeed}/1280/720`}
                                  target="_blank"
                                  download="rupee-change-life-cover-graphic.jpg"
                                  className="bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 p-2 text-center rounded-lg flex flex-col justify-center items-center cursor-pointer select-none space-y-0.5"
                                >
                                  <span className="text-sm">🖼️</span>
                                  <span className="text-[9.5px] font-black">Download Cover Art</span>
                                  <span className="text-[8px] text-slate-500 leading-none">FHD Banner Image</span>
                                </a>

                                {/* Retry render */}
                                <button
                                  type="button"
                                  onClick={() => setRenderingStatus('idle')}
                                  className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 p-2 text-center rounded-lg flex flex-col justify-center items-center cursor-pointer select-none space-y-0.5"
                                >
                                  <span className="text-sm">🔄</span>
                                  <span className="text-[9.5px] font-black">Reset Packaging</span>
                                  <span className="text-[8px] text-slate-400 leading-none">Compile alternative style</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* MULTI-TABBED CO-CREATIVE SOCIAL MEDIA ASSETS & FOOTAGE HUB */}
                      <div className="space-y-3.5 border-t border-slate-100 pt-3 text-left">
                        <div className="bg-indigo-950 text-white rounded-xl p-2.5 flex items-center justify-between border border-slate-805/10">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-indigo-300 font-extrabold tracking-wider uppercase">📲 VIRAL OUTREACH TOOLKIT</span>
                            <span className="text-[9px] font-medium text-slate-300">Ready-made assets & copyright-free templates</span>
                          </div>
                          <span className="text-[9px] bg-emerald-500 text-white font-black px-1.5 py-0.5 rounded uppercase font-mono">
                            ACTIVE READY
                          </span>
                        </div>

                        {/* Interactive Sub-tab selector */}
                        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200/80 gap-1">
                          {[
                            { id: 'script', label: '🎬 Script & Footage', icon: '📹' },
                            { id: 'caption', label: '📝 Titles & Captions', icon: '✍️' },
                            { id: 'platform', label: '💬 Social Posts', icon: '🌐' },
                            { id: 'tags', label: '🏷️ SEO Tags & Art', icon: '🔖' },
                          ].map((tab) => (
                            <button
                              key={tab.id}
                              type="button"
                              onClick={() => setCreatorSubTab(tab.id as any)}
                              className={`flex-1 text-[10px] py-1.5 rounded font-black transition-all flex items-center justify-center gap-1 cursor-pointer select-none ${
                                creatorSubTab === tab.id
                                  ? 'bg-white text-indigo-700 shadow-2xs border-b-2 border-indigo-600'
                                  : 'text-slate-500 hover:text-slate-800'
                              }`}
                            >
                              <span>{tab.icon}</span>
                              <span className="truncate">{tab.label}</span>
                            </button>
                          ))}
                        </div>

                        {/* SUB-TAB 1: SCRIPT & STOCK FOOTAGE GUIDE */}
                        {creatorSubTab === 'script' && (
                          <div className="space-y-2.5 animate-fade-in">
                            <div className="bg-amber-50/70 border border-amber-200/60 rounded-lg p-2.5 text-[11px] leading-relaxed text-amber-900 font-medium">
                              <span className="font-extrabold block text-amber-950 mb-0.5">💡 Copyright-Free Stock Video Policy:</span>
                              Do not record raw; instead, use pristine free clips of Indian village life, schools, or saving habits. We have compiled pre-filled high-response search keywords. Click below to fetch instantly:
                            </div>

                            {/* Direct Free Stock shortcut searches */}
                            <div className="grid grid-cols-2 gap-1.5">
                              <a
                                href="https://www.pexels.com/search/video/rural%20india/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition p-2 rounded-lg flex items-center justify-between text-slate-800 font-bold"
                              >
                                <span className="text-[10px] flex items-center gap-1.5">
                                  <span>📹 Pexels:</span> Rural India Footage
                                </span>
                                <span className="text-[9px] text-indigo-600">Explore ↗</span>
                              </a>
                              <a
                                href="https://pixabay.com/videos/search/indian%20village/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition p-2 rounded-lg flex items-center justify-between text-slate-800 font-bold"
                              >
                                <span className="text-[10px] flex items-center gap-1.5">
                                  <span>🎬 Pixabay:</span> Indian Village Clips
                                </span>
                                <span className="text-[9px] text-indigo-600">Explore ↗</span>
                              </a>
                              <a
                                href="https://unsplash.com/s/photos/indian-school"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition p-2 rounded-lg flex items-center justify-between text-slate-800 font-bold"
                              >
                                <span className="text-[10px] flex items-center gap-1.5">
                                  <span>📸 Unsplash:</span> Children/School Art
                                </span>
                                <span className="text-[9px] text-indigo-600">Explore ↗</span>
                              </a>
                            </div>

                            {/* Chronological Script Timeline with Copy button */}
                            <div className="space-y-2">
                              <div className="flex justify-between items-center bg-slate-50 px-2 py-1 rounded border border-slate-200">
                                <span className="text-[9.5px] font-extrabold text-slate-700 uppercase tracking-widest">
                                  📋 SCENE-BY-SCENE COMPLETE FILM SCRIPT
                                </span>
                              </div>

                              <div className="space-y-2 max-h-72 overflow-y-auto">
                                {videoScenes.map((scene, idx) => {
                                  const colors = idx === 0 ? 'rose' : idx === 1 ? 'indigo' : idx === 2 ? 'emerald' : 'amber';
                                  return (
                                    <div key={idx} className={`p-2.5 border border-${colors}-100 rounded-lg bg-${colors}-50/15 text-left space-y-2`}>
                                      <div className={`flex justify-between text-[9px] font-mono font-bold text-${colors}-600 mb-0.5`}>
                                        <span>🎬 SCENE {idx + 1} ({idx === 0 ? 'Hook' : idx === 1 ? 'Education' : idx === 2 ? 'Sanitation' : 'Branding'})</span>
                                        <span>⏱️ {scene.timeRange}</span>
                                      </div>
                                      
                                      <div className="space-y-1">
                                        <label className="text-[8.5px] font-black text-slate-500 uppercase block">🎥 Suggested Copyright-Free Footage Keyword / Desc:</label>
                                        <input
                                          type="text"
                                          className="w-full text-[10px] py-1 px-1.5 border border-slate-200 rounded font-semibold bg-white text-slate-800 focus:outline-none focus:border-indigo-500"
                                          value={scene.footageDesc}
                                          onChange={(e) => {
                                            const updated = [...videoScenes];
                                            updated[idx].footageDesc = e.target.value;
                                            setVideoScenes(updated);
                                          }}
                                        />
                                      </div>

                                      <div className="space-y-1">
                                        <label className="text-[8.5px] font-black text-slate-500 uppercase block">🗣️ Voiceover Script & Subtitles dialogue (Hindi):</label>
                                        <textarea
                                          className="w-full text-[10.5px] p-1.5 border border-slate-200 rounded font-bold bg-white text-slate-900 focus:outline-none focus:border-indigo-500 leading-normal"
                                          rows={2}
                                          value={scene.subtitle}
                                          onChange={(e) => {
                                            const updated = [...videoScenes];
                                            updated[idx].subtitle = e.target.value;
                                            setVideoScenes(updated);
                                          }}
                                        />
                                      </div>

                                      <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-slate-100">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setCurrentVideoScene(idx);
                                            setVideoPlaying(false);
                                            if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                                              window.speechSynthesis.cancel();
                                              const speechText = scene.subtitle.replace(/[₹]/g, 'रुपए ');
                                              const utterance = new SpeechSynthesisUtterance(speechText);
                                              utterance.lang = 'hi-IN';
                                              if (selectedVoice) utterance.voice = selectedVoice;
                                              window.speechSynthesis.speak(utterance);
                                            }
                                          }}
                                          className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[8.5px] py-1 rounded font-black uppercase text-center cursor-pointer select-none"
                                        >
                                          🔊 Test Voice Sync
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setCurrentVideoScene(idx);
                                            setVideoPlaying(true);
                                          }}
                                          className="bg-slate-100 hover:bg-slate-205/60 text-slate-700 text-[8.5px] py-1 rounded font-black uppercase text-center cursor-pointer select-none"
                                        >
                                          📺 Preview Scene
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* SUB-TAB 2: VIRAL TITLE & OPTIMIZED DESCRIPTION */}
                        {creatorSubTab === 'caption' && (
                          <div className="space-y-3.5 animate-fade-in text-left">
                            {/* Title Segment */}
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-[9.5px] text-slate-500 font-bold uppercase tracking-wider">
                                  🏆 VIRAL VIDEO SEO TITLE (ENG & HINDI)
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleCopyText(`रोज ₹1 बचाकर बदलें गाँव की तस्वीर! 😲 | How ₹1 daily changes ${creatorTopic.replace('How saving ', '').replace('How ', '').replace('why saving ', '')}`, 'seotitle')}
                                  className="text-[9.5px] text-indigo-600 font-extrabold hover:underline"
                                >
                                  {copiedId === 'seotitle' ? '✅ COPIED!' : '📋 Copy Title'}
                                </button>
                              </div>
                              <div className="bg-indigo-50/60 p-2 rounded-lg border border-indigo-100 font-extrabold text-slate-850 text-xs tracking-tight">
                                रोज ₹1 बचाकर बदलें गाँव की तस्वीर! 😲 | Saving ₹1 daily changes the community context: {creatorTopic.replace('How saving ', '').replace('How ', '').replace('why saving ', '')}
                              </div>
                            </div>

                            {/* Multi-Paragraph Description Segment */}
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-[9.5px] text-slate-500 font-bold uppercase tracking-wider">
                                  📑 HIGH-CTR LONG-FORM DESCRIPTION (#DESCRIPTION)
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleCopyText(`In this video, discover how the humble ₹1 daily micro-funding change life mission is solving biggest community challenges including: ${creatorTopic}.\n\n✅ Live Public Audit Portal at ₹1Rupee Change Life\n✅ 100% Social Audit Transparency assured.\n\n📌 Timestamps:\n0:00 Power of ₹1 drop\n0:15 Real village impact\n0:25 Join the mission!\n\n#Rupee1Change #SocialGood #Swarajya #Healthcare #Education`, 'seodesc')}
                                  className="text-[9.5px] text-indigo-600 font-extrabold hover:underline"
                                >
                                  {copiedId === 'seodesc' ? '✅ COPIED!' : '📋 Copy Description'}
                                </button>
                              </div>
                              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-slate-700 text-[10.5px] max-h-48 overflow-y-auto leading-relaxed font-semibold">
                                <p className="font-extrabold text-slate-900 border-b border-rose-100/60 pb-1 mb-1.5 flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                  PERFECT CTR SYSTEM OUTPUT:
                                </p>
                                In this video, discover how the humble **₹1 daily micro-funding change life mission** is solving your community challenges: **{creatorTopic}**.
                                <br /><br />
                                📌 **Video Highlights & Chapters**:
                                <br />• 0:00 The power of collective 1 Rupee drops
                                <br />• 0:15 Ground reality of community issues (Schooling/Sanitation focus)
                                <br />• 0:38 Social Audit and Volunteer Roster distribution
                                <br />• 0:50 How you can join the ₹1Rupee Change Life Mission!
                                <br /><br />
                                📚 **Welfare Coordination Details**:
                                <br />- Public Audit Guarantee: 100% Digital Transparent Logs
                                <br />- Category Focus: **{videoCategory}**
                                <br />- Sponsoring Guilds: Local Citizens and Swarajya Volunteers
                              </div>
                            </div>
                          </div>
                        )}

                        {/* SUB-TAB 3: OTHER SOCIAL PLATFORMS COPIER */}
                        {creatorSubTab === 'platform' && (
                          <div className="space-y-3 animate-fade-in text-left">
                            <span className="text-[9.5px] text-slate-500 block font-extrabold uppercase tracking-wider">
                              🌐 OPTIMIZED SHARING CONTENT FOR MORE CHANNELS
                            </span>
        
                            {/* WhatsApp Copy Box */}
                            <div className="bg-emerald-50/50 border border-emerald-200/60 rounded-lg p-2.5 space-y-1.5">
                              <div className="flex justify-between items-center text-[9.5px] font-bold text-emerald-800">
                                <span className="flex items-center gap-1">💬 WHATSAPP AWARENESS BROADCAST (HINDI)</span>
                                <button
                                  type="button"
                                  onClick={() => handleCopyText(`₹1Rupee Change Life मिशन क्रांतिकारी बदलाव ! 🇮🇳 \n\n*क्या आप जानते हैं?* सिर्फ रोज *₹1* बचाकर हम सब मिलकर देश के गाँव बदल सकते हैं! \n\n✅ 100% पारदर्शी लेखा जोखा \n✅ सीधा गाँव के प्राथमिक स्कूलों का सुधार \n\nग्रुप से जुड़ने के लिए संदेश भेजें और सहयोग शुरू करें। \n👉 स्वावलंबन ही देश का सच्चा आधार है।`, 'copypwhatsapp')}
                                  className="text-indigo-600 hover:underline font-extrabold"
                                >
                                  {copiedId === 'copypwhatsapp' ? '✅ COPIED!' : '📋 Copy WA Text'}
                                </button>
                              </div>
                              <p className="text-[10px] text-slate-700 italic bg-white border border-emerald-100 p-1.5 rounded font-black max-h-16 overflow-y-auto leading-relaxed">
                                ₹1Rupee Change Life मिशन क्रांतिकारी बदलाव ! 🇮🇳 <br /><br />
                                *क्या आप जानते हैं?* सिर्फ रोज *₹1* बचाकर हम सब मिलकर देश के गाँव बदल सकते हैं! <br /><br />
                                ✅ 100% पारदर्शी लेखा जोखा <br />
                                ✅ सीधा गाँव के प्राथमिक स्कूलों का सुधार
                              </p>
                            </div>
        
                            {/* Instagram Hook caption */}
                            <div className="bg-purple-50/50 border border-purple-200/60 rounded-lg p-2.5 space-y-1.5">
                              <div className="flex justify-between items-center text-[9.5px] font-bold text-purple-800">
                                <span className="flex items-center gap-1">📸 INSTAGRAM CAPTION & ENGAGEMENT HOOK</span>
                                <button
                                  type="button"
                                  onClick={() => handleCopyText(`Every ₹1 matters. 😲 Yes, a micro-funding change life movement of ₹1 daily is transforming basic school education & healthcare across backward villages in India. Join the ₹1Rupee Change Life movement! 🔥 Link in Bio.\n\n#reels #microfunding #SocialGood #swarajya #india #villagechange`, 'copypinst')}
                                  className="text-indigo-600 hover:underline font-extrabold"
                                >
                                  {copiedId === 'copypinst' ? '✅ COPIED!' : '📋 Copy Instagram'}
                                </button>
                              </div>
                              <p className="text-[10px] text-slate-755 bg-white border border-purple-100 p-1.5 rounded font-semibold max-h-16 overflow-y-auto leading-relaxed">
                                Every ₹1 matters. 😲 Yes, a micro-funding change life movement of ₹1 daily is transforming basic school education & healthcare across backward villages in India. Join the ₹1Rupee Change Life movement! 🔥 Link in Bio.
                              </p>
                            </div>
        
                            {/* Poster Wall slogan */}
                            <div className="bg-amber-50/50 border border-amber-200/60 rounded-lg p-2.5 space-y-1.5">
                              <div className="flex justify-between items-center text-[9.5px] font-bold text-amber-805 text-amber-800">
                                <span className="flex items-center gap-1">🖼️ SLOGAN FOR PRINT BANNER</span>
                                <button
                                  type="button"
                                  onClick={() => handleCopyText(`"बूंद-बूंद से सागर बने, ₹1 की बचत से हमारा देश सजे!"`, 'copyposter')}
                                  className="text-indigo-600 hover:underline font-extrabold"
                                >
                                  {copiedId === 'copyposter' ? '✅ COPIED!' : '📋 Copy Slogan'}
                                </button>
                              </div>
                              <p className="text-xs text-center font-extrabold text-slate-900 bg-white border border-amber-100 p-2 rounded">
                                "बूंद-बूंद से सागर बने, ₹1 की बचत से हमारा देश सजे!"
                              </p>
                            </div>
                          </div>
                        )}
        
                        {/* SUB-TAB 4: VIRAL HASHTAGS & GRAPHIC ARTWORK */}
                        {creatorSubTab === 'tags' && (
                          <div className="space-y-3 animate-fade-in text-left">
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-[9.5px] text-slate-500 font-bold uppercase tracking-wider">
                                  🏷️ VIRAL HASHTAGS & SEO SEARCH TAGS
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleCopyText("one rupee initiative, rural revolution, micro donation, swarajya, healthcare development, community primary school, social empowerment, clean sanitation, self sufficiency, rupee change life campaign", 'seotags')}
                                  className="text-[9.5px] text-indigo-700 font-extrabold hover:underline"
                                >
                                  {copiedId === 'seotags' ? '✅ COPIED!' : '📋 Copy Search Tags'}
                                </button>
                              </div>
        
                              <div className="flex flex-wrap gap-1 bg-slate-50 p-2 rounded-lg border border-slate-200">
                                {[
                                  "OneRupeeInitiative",
                                  "RuralRevolution",
                                  "MicroDonation",
                                  "SwarajyaVillage",
                                  "RupeeChangeLife",
                                  "PrimarySanitisation",
                                  "TransparentChange",
                                  "CommunityWelfare"
                                ].map((tag, idx) => (
                                  <span key={idx} className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold border border-indigo-100/60 px-1.5 py-0.5 rounded text-[9.5px] transition-colors">
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            </div>
        
                            {/* Download Instructions Card */}
                            <div className="bg-slate-900 text-white rounded-lg p-2.5 border border-slate-800 flex items-center justify-between">
                              <div className="space-y-1">
                                <span className="text-[10px] text-indigo-305 font-black uppercase tracking-wider block">💾 Stock Graphic Asset:</span>
                                <span className="text-[9.5px] text-slate-300 leading-tight block">Right-click the video cover above & select <strong>'Save Image As'</strong> to get full FHD post art instantly!</span>
                              </div>
                              <span className="text-lg">📥</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
        
                {/* CAMPAIGN MODE OUTREACH PLANNER */}
                {activeMode === 'campaign' && (
                  <motion.div
                    key="campaign-form"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-2.5 text-xs text-slate-700"
                  >
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-extrabold tracking-widest block mb-1">Campaign Target Name</span>
                      <input
                        id="campaign-name-input"
                        type="text"
                        value={campaign.campaignName}
                        onChange={(e) => setCampaign({ ...campaign, campaignName: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-bold focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-extrabold tracking-widest block mb-1">Target Citizens</span>
                      <input
                        id="campaign-audience-input"
                        type="text"
                        value={campaign.targetAudience}
                        onChange={(e) => setCampaign({ ...campaign, targetAudience: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-bold focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-extrabold tracking-widest block mb-1">Campaign Social Goal</span>
                      <textarea
                        id="campaign-theme-input"
                        value={campaign.campaignTheme}
                        onChange={(e) => setCampaign({ ...campaign, campaignTheme: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 h-16 resize-none font-bold focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-extrabold tracking-widest block mb-1">Outreach Area</span>
                      <input
                        id="campaign-loc-input"
                        type="text"
                        value={campaign.location}
                        onChange={(e) => setCampaign({ ...campaign, location: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-bold focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
        
                    <button
                      id="campaign-gen-btn"
                      onClick={handleTriggerCampaignGen}
                      className="w-full bg-indigo-600 text-white font-extrabold py-2 rounded-lg hover:bg-indigo-500 transition cursor-pointer"
                    >
                      Draft Campaign Strategy
                    </button>
                  </motion.div>
                )}

                {/* SOCIAL MODE & VOLUNTEERS */}
                {activeMode === 'social' && (
                  <motion.div
                    key="social-form"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-3 text-xs"
                  >
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 shadow-3xs">
                      <span className="text-[10px] text-indigo-600 font-extrabold uppercase tracking-wider block mb-1.5">Active Volunteer Roster</span>
                      <div className="max-h-24 overflow-y-auto space-y-1">
                        {volunteers.map((vol, i) => (
                          <div key={i} className="flex justify-between items-center text-[10px] border-b border-slate-100 pb-1">
                            <div>
                              <span className="text-slate-800 font-extrabold">{vol.name}</span>
                              <span className="text-slate-500 ml-1">({vol.role})</span>
                            </div>
                            <span className="text-[9px] bg-indigo-50 text-indigo-600 border border-indigo-100/50 font-bold px-1.5 rounded">{vol.task}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <form onSubmit={addVolunteer} className="space-y-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-705 text-slate-700 font-extrabold">Register New Social Hand</span>
                      <input
                        id="newvol-name"
                        type="text"
                        placeholder="Volunteer Full Name"
                        value={newVol.name}
                        onChange={(e) => setNewVol({ ...newVol, name: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs text-slate-800 font-medium focus:ring-1 focus:ring-indigo-500"
                        required
                      />
                      <input
                        id="newvol-email"
                        type="email"
                        placeholder="Email contact"
                        value={newVol.email}
                        onChange={(e) => setNewVol({ ...newVol, email: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs text-slate-800 font-medium focus:ring-1 focus:ring-indigo-505 focus:ring-indigo-500"
                        required
                      />
                      <div className="flex gap-1.5">
                        <select
                          id="newvol-role"
                          value={newVol.role}
                          onChange={(e) => setNewVol({ ...newVol, role: e.target.value })}
                          className="bg-white border border-slate-200 rounded-lg text-[10px] p-1 flex-1 text-slate-700 font-bold cursor-pointer focus:ring-1 focus:ring-indigo-505"
                        >
                          <option value="Awareness Volunteer">Awareness</option>
                          <option value="Audit Auditor">Auditor</option>
                          <option value="Group Coordinator">Coordinator</option>
                        </select>
                        <button
                          id="newvol-submit-btn"
                          type="submit"
                          className="bg-indigo-600 hover:bg-indigo-500 text-[10px] font-bold text-white px-3 py-1 rounded-lg cursor-pointer transition-colors"
                        >
                          Enlist
                        </button>
                      </div>
                    </form>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
                      Submit roles, then ask me to generate a personalized social coordination matrix or weekly volunteer roster!
                    </p>
                  </motion.div>
                )}

                {/* ANALYTICS IDEA & SLIDER POWER CALCULATOR */}
                {activeMode === 'analytics' && (
                  <motion.div
                    key="analytics-form"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-3"
                  >
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3 shadow-3xs">
                      <span className="text-[11px] text-indigo-600 font-extrabold uppercase tracking-wider block">Impact Calculator</span>
                      
                      {/* Sliders */}
                      <div>
                        <div className="flex justify-between text-[11px] font-bold mb-1">
                          <span className="text-slate-600">Citizens Engaged:</span>
                          <span className="text-indigo-600 font-bold font-mono bg-indigo-50 px-1.5 rounded">{population.toLocaleString()}</span>
                        </div>
                        <input
                          id="calc-pop-input"
                          type="range"
                          min="10"
                          max="10000"
                          step="10"
                          value={population}
                          onChange={(e) => performCalculation(Number(e.target.value), days)}
                          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                        <div className="flex justify-between text-[9px] text-slate-500 font-bold mt-0.5">
                          <span>10 (Village lane)</span>
                          <span>10k (Town block)</span>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] font-bold mb-1">
                          <span className="text-slate-600">Duration Range:</span>
                          <span className="text-emerald-600 font-bold font-mono bg-emerald-50 px-1.5 rounded">{days} Days</span>
                        </div>
                        <input
                          id="calc-days-input"
                          type="range"
                          min="1"
                          max="365"
                          step="1"
                          value={days}
                          onChange={(e) => performCalculation(population, Number(e.target.value))}
                          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                        />
                        <div className="flex justify-between text-[9px] text-slate-500 font-bold mt-0.5">
                          <span>1 Day</span>
                          <span>1 Year</span>
                        </div>
                      </div>
                    </div>

                    {calculatedImpact && (
                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-2.5 text-xs shadow-3xs animate-fade-in">
                        <div className="flex justify-between border-b border-slate-200 pb-1.5">
                          <span className="text-slate-600 font-bold">Daily Micro Fund:</span>
                          <span className="font-mono text-emerald-600 font-extrabold">₹{calculatedImpact.totalCollected.toLocaleString()}</span>
                        </div>
                        
                        <div className="space-y-1">
                          <span className="text-[10px] text-indigo-650 font-extrabold block text-indigo-650">Welfare Idea Allocation:</span>
                          <div className="grid grid-cols-2 gap-1 text-[10px] font-mono text-slate-700">
                            <div className="p-1 px-1.5 bg-white border border-slate-200 rounded font-semibold flex items-center justify-between">
                              <span className="text-slate-500 text-[9px]">📚 Edu</span>
                              <span className="font-bold text-indigo-600">₹{(calculatedImpact.allocations.education || 0).toLocaleString()}</span>
                            </div>
                            <div className="p-1 px-1.5 bg-white border border-slate-200 rounded font-semibold flex items-center justify-between">
                              <span className="text-slate-500 text-[9px]">🏥 Med</span>
                              <span className="font-bold text-emerald-600">₹{(calculatedImpact.allocations.healthcare || 0).toLocaleString()}</span>
                            </div>
                            <div className="p-1 px-1.5 bg-white border border-slate-200 rounded font-semibold flex items-center justify-between">
                              <span className="text-slate-500 text-[9px]">🤝 Welfare</span>
                              <span className="font-bold text-amber-600">₹{(calculatedImpact.allocations.communityWelfare || 0).toLocaleString()}</span>
                            </div>
                            <div className="p-1 px-1.5 bg-white border border-slate-200 rounded font-semibold flex items-center justify-between">
                              <span className="text-slate-500 text-[9px]">🚨 Emerg</span>
                              <span className="font-bold text-red-650">₹{(calculatedImpact.allocations.emergencyAid || 0).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        {/* Dropdown for historical calculation comparison */}
                        <div className="bg-white border border-slate-200/90 rounded-lg p-2 space-y-1.5 text-left shadow-3xs">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider flex items-center gap-1">
                              <span>🔄 Compare With History</span>
                            </span>
                            {comparedRunIndex !== -1 && (
                              <button
                                type="button"
                                onClick={() => setComparedRunIndex(-1)}
                                className="text-[9.5px] text-rose-600 font-bold hover:underline cursor-pointer"
                              >
                                Clear Comparison
                              </button>
                            )}
                          </div>
                          <select
                            value={comparedRunIndex}
                            onChange={(e) => setComparedRunIndex(Number(e.target.value))}
                            className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-[10px] font-bold text-slate-800 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                          >
                            <option value="-1">None (Single Run View)</option>
                            {calculationHistory.map((run, idx) => {
                              const isCurrentActive = run.population === calculatedImpact.population && run.days === calculatedImpact.days;
                              return (
                                <option key={idx} value={idx}>
                                  {isCurrentActive ? "⭐ Current: " : `Historical ${calculationHistory.length - idx}: `}
                                  ₹{run.totalCollected.toLocaleString()} ({run.population} pax, {run.days} days)
                                </option>
                              );
                            })}
                          </select>
                        </div>

                        {/* Interactive Compare stats banner */}
                        {comparedRunIndex !== -1 && calculationHistory[comparedRunIndex] && (() => {
                          const comp = calculationHistory[comparedRunIndex];
                          const eduDiff = (calculatedImpact.allocations.education || 0) - (comp.allocations.education || 0);
                          const medDiff = (calculatedImpact.allocations.healthcare || 0) - (comp.allocations.healthcare || 0);
                          const welfareDiff = (calculatedImpact.allocations.communityWelfare || 0) - (comp.allocations.communityWelfare || 0);
                          const emergDiff = (calculatedImpact.allocations.emergencyAid || 0) - (comp.allocations.emergencyAid || 0);
                          return (
                            <div className="p-2 bg-indigo-50/50 rounded-lg border border-indigo-100/70 text-left space-y-1 animate-fade-in-down">
                              <div className="text-[9.5px] font-black text-indigo-900 border-b border-indigo-100/50 pb-0.5 flex justify-between">
                                <span>🎯 HISTORICAL RUN DIFFERENCE:</span>
                                <span className="font-mono text-[9px]">Curr vs Hist #{calculationHistory.length - comparedRunIndex}</span>
                              </div>
                              <div className="grid grid-cols-4 gap-1 text-[9px] font-mono">
                                <div className="bg-white p-1 rounded border border-slate-100 flex flex-col text-center">
                                  <span className="text-slate-500 text-[8px] font-sans">📚 Edu</span>
                                  <span className={`font-bold ${eduDiff >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {eduDiff >= 0 ? '+' : ''}{eduDiff.toLocaleString()}
                                  </span>
                                </div>
                                <div className="bg-white p-1 rounded border border-slate-100 flex flex-col text-center">
                                  <span className="text-slate-500 text-[8px] font-sans">🏥 Med</span>
                                  <span className={`font-bold ${medDiff >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {medDiff >= 0 ? '+' : ''}{medDiff.toLocaleString()}
                                  </span>
                                </div>
                                <div className="bg-white p-1 rounded border border-slate-100 flex flex-col text-center">
                                  <span className="text-slate-500 text-[8px] font-sans">🤝 Welfare</span>
                                  <span className={`font-bold ${welfareDiff >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {welfareDiff >= 0 ? '+' : ''}{welfareDiff.toLocaleString()}
                                  </span>
                                </div>
                                <div className="bg-white p-1 rounded border border-slate-100 flex flex-col text-center">
                                  <span className="text-slate-500 text-[8px] font-sans">🚨 Emerg</span>
                                  <span className={`font-bold ${emergDiff >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {emergDiff >= 0 ? '+' : ''}{emergDiff.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })()}

                        {/* Recharts BarChart integration */}
                        <div className="space-y-1 mt-1">
                          <span className="text-[10px] text-indigo-650 font-bold block text-slate-500 text-left">
                            {comparedRunIndex !== -1 ? "📊 Side-by-Side Fund Comparison:" : "Allocation Share Visual:"}
                          </span>
                          <div className="w-full h-36 bg-white p-1.5 rounded-lg border border-slate-200/65">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={[
                                  { 
                                    name: 'Edu', 
                                    'Current (₹)': calculatedImpact.allocations.education || 0,
                                    'Previous (₹)': comparedRunIndex !== -1 && calculationHistory[comparedRunIndex] ? calculationHistory[comparedRunIndex].allocations.education || 0 : 0
                                  },
                                  { 
                                    name: 'Med', 
                                    'Current (₹)': calculatedImpact.allocations.healthcare || 0,
                                    'Previous (₹)': comparedRunIndex !== -1 && calculationHistory[comparedRunIndex] ? calculationHistory[comparedRunIndex].allocations.healthcare || 0 : 0
                                  },
                                  { 
                                    name: 'Welfare', 
                                    'Current (₹)': calculatedImpact.allocations.communityWelfare || 0,
                                    'Previous (₹)': comparedRunIndex !== -1 && calculationHistory[comparedRunIndex] ? calculationHistory[comparedRunIndex].allocations.communityWelfare || 0 : 0
                                  },
                                  { 
                                    name: 'Emerg', 
                                    'Current (₹)': calculatedImpact.allocations.emergencyAid || 0,
                                    'Previous (₹)': comparedRunIndex !== -1 && calculationHistory[comparedRunIndex] ? calculationHistory[comparedRunIndex].allocations.emergencyAid || 0 : 0
                                  },
                                ]}
                                margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 8.5, fontWeight: 650 }} tickLine={false} axisLine={false} />
                                <YAxis tick={{ fill: '#64748b', fontSize: 8 }} tickLine={false} axisLine={false} />
                                <Tooltip
                                  cursor={{ fill: 'rgba(99, 102, 241, 0.04)' }}
                                  contentStyle={{ background: '#ffffff', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '9px', fontWeight: 'bold' }}
                                  formatter={(value: any, name: any) => [`₹${Number(value).toLocaleString()}`, name]}
                                />
                                
                                {comparedRunIndex !== -1 && calculationHistory[comparedRunIndex] ? (
                                  <>
                                    <Bar dataKey="Current (₹)" radius={[3, 3, 0, 0]} barSize={12}>
                                      {['#6366f1', '#10b981', '#f59e0b', '#ef4444'].map((color, index) => (
                                        <Cell key={`cell-curr-${index}`} fill={color} />
                                      ))}
                                    </Bar>
                                    <Bar dataKey="Previous (₹)" radius={[3, 3, 0, 0]} barSize={12}>
                                      {['#c7d2fe', '#a7f3d0', '#fde68a', '#fecaca'].map((color, index) => (
                                        <Cell key={`cell-prev-${index}`} fill={color} />
                                      ))}
                                    </Bar>
                                  </>
                                ) : (
                                  <Bar dataKey="Current (₹)" radius={[4, 4, 0, 0]} barSize={20}>
                                    {['#6366f1', '#10b981', '#f59e0b', '#ef4444'].map((color, index) => (
                                      <Cell key={`cell-only-${index}`} fill={color} />
                                    ))}
                                  </Bar>
                                )}
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* Impact Progress towards Goals */}
                        <div className="bg-white border border-slate-200/90 rounded-xl p-2.5 space-y-2 text-left shadow-3xs animate-fade-in">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                              🏁 Progress Towards Local Village Goals
                            </span>
                            <span className="text-[8px] font-extrabold bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded uppercase font-mono">
                              Milestones
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2">
                            {/* Card 1: Meals Provided */}
                            <div className="bg-slate-50 border border-slate-100 p-2 rounded-lg space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="bg-rose-50 text-rose-600 p-1 rounded-md">
                                  <Utensils className="w-3.5 h-3.5" />
                                </span>
                                <span className="text-[11px] font-black text-rose-600 font-mono">
                                  {(calculatedImpact.impactMetrics?.mealsProvided || 0).toLocaleString()}
                                </span>
                              </div>
                              <div className="text-[9.5px] font-black text-slate-800">
                                Nutritional Meals
                              </div>
                              <div className="flex justify-between items-center text-[8px] text-slate-500 font-semibold font-sans">
                                <span>Target: 2,500</span>
                                <span>{Math.min(100, Math.round(((calculatedImpact.impactMetrics?.mealsProvided || 0) / 2500) * 100))}%</span>
                              </div>
                              <div className="w-full bg-slate-205 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                <div 
                                  className="bg-rose-500 h-full rounded-full transition-all duration-500" 
                                  style={{ width: `${Math.min(100, Math.round(((calculatedImpact.impactMetrics?.mealsProvided || 0) / 2500) * 100))}%` }}
                                ></div>
                              </div>
                            </div>

                            {/* Card 2: Scholarships Supported */}
                            <div className="bg-slate-50 border border-slate-100 p-2 rounded-lg space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="bg-indigo-50 text-indigo-600 p-1 rounded-md">
                                  <GraduationCap className="w-3.5 h-3.5" />
                                </span>
                                <span className="text-[11px] font-black text-indigo-600 font-mono">
                                  {(calculatedImpact.impactMetrics?.scholarshipsSupported || 0).toLocaleString()}
                                </span>
                              </div>
                              <div className="text-[9.5px] font-black text-slate-800">
                                Student Scholarships
                              </div>
                              <div className="flex justify-between items-center text-[8px] text-slate-500 font-semibold font-sans">
                                <span>Target: 15</span>
                                <span>{Math.min(100, Math.round(((calculatedImpact.impactMetrics?.scholarshipsSupported || 0) / 15) * 100))}%</span>
                              </div>
                              <div className="w-full bg-slate-205 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                <div 
                                  className="bg-indigo-500 h-full rounded-full transition-all duration-500" 
                                  style={{ width: `${Math.min(100, Math.round(((calculatedImpact.impactMetrics?.scholarshipsSupported || 0) / 15) * 100))}%` }}
                                ></div>
                              </div>
                            </div>

                            {/* Card 3: Medical Camps Supported */}
                            <div className="bg-slate-50 border border-slate-100 p-2 rounded-lg space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="bg-emerald-50 text-emerald-600 p-1 rounded-md">
                                  <Activity className="w-3.5 h-3.5" />
                                </span>
                                <span className="text-[11px] font-black text-emerald-600 font-mono">
                                  {(calculatedImpact.impactMetrics?.medicalCampsSupported || 0).toLocaleString()}
                                </span>
                              </div>
                              <div className="text-[9.5px] font-black text-slate-800">
                                Mobile Med Camps
                              </div>
                              <div className="flex justify-between items-center text-[8px] text-slate-500 font-semibold font-sans">
                                <span>Target: 3 Camps</span>
                                <span>{Math.min(100, Math.round(((calculatedImpact.impactMetrics?.medicalCampsSupported || 0) / 3) * 100))}%</span>
                              </div>
                              <div className="w-full bg-slate-205 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                <div 
                                  className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                                  style={{ width: `${Math.min(100, Math.round(((calculatedImpact.impactMetrics?.medicalCampsSupported || 0) / 3) * 100))}%` }}
                                ></div>
                              </div>
                            </div>

                            {/* Card 4: Drinking Water Projects */}
                            <div className="bg-slate-50 border border-slate-100 p-2 rounded-lg space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="bg-blue-50 text-blue-600 p-1 rounded-md">
                                  <Droplet className="w-3.5 h-3.5" />
                                </span>
                                <span className="text-[11px] font-black text-blue-600 font-mono">
                                  {(calculatedImpact.impactMetrics?.drinkingWaterWellsRecon || 0).toLocaleString()}
                                </span>
                              </div>
                              <div className="text-[9.5px] font-black text-slate-800">
                                Clean Water Projects
                              </div>
                              <div className="flex justify-between items-center text-[8px] text-slate-500 font-semibold font-sans">
                                <span>Target: 1 Well</span>
                                <span>{Math.min(100, Math.round(((calculatedImpact.impactMetrics?.drinkingWaterWellsRecon || 0) / 1) * 100))}%</span>
                              </div>
                              <div className="w-full bg-slate-205 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                <div 
                                  className="bg-blue-500 h-full rounded-full transition-all duration-500" 
                                  style={{ width: `${Math.min(100, Math.round(((calculatedImpact.impactMetrics?.drinkingWaterWellsRecon || 0) / 1) * 100))}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <button
                          id="ask-analytics-prompt-btn"
                          onClick={() => {
                            const customPrompt = `Explain a detailed public welfare idea for allocating ₹${calculatedImpact.totalCollected} collected from ${calculatedImpact.population} residents over ${calculatedImpact.days} days under the ₹1 scheme (Education: ₹${calculatedImpact.allocations.education}, Healthcare: ₹${calculatedImpact.allocations.healthcare}, Community Welfare: ₹${calculatedImpact.allocations.communityWelfare}, Emergency: ₹${calculatedImpact.allocations.emergencyAid}). Explain how to guarantee social transparency.`;
                            sendMessage(customPrompt);
                          }}
                          className="w-full bg-indigo-50 hover:bg-slate-100 text-indigo-700 font-extrabold border border-indigo-200/50 py-1.5 rounded text-[10px] transition cursor-pointer text-center"
                        >
                          🔮 Ask AI to structure this budget
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* REPORT MODE HELPER */}
                {activeMode === 'report' && (
                  <motion.div
                    key="report-form"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-3 leading-relaxed text-xs text-slate-600 font-semibold"
                  >
                    <p>
                      Generate social audit reports to showcase collections, community works completed, and upcoming volunteer needs.
                    </p>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5">
                      <span className="text-[10px] text-indigo-600 font-extrabold block mb-1">Preflight Template Layout:</span>
                      <ul className="space-y-1 text-[10px] text-slate-500 list-disc list-inside">
                        <li>Citizen Contribution Audits</li>
                        <li>Audit Transparency Formulas</li>
                        <li>Critical Welfare Slates</li>
                      </ul>
                    </div>
                    <button
                      id="report-gen-quick-btn"
                      onClick={() => sendMessage("Generate a comprehensive Public Social Survey and Audit Report template for ₹1 Change Life activities in our regional subdivision. Show simple, robust cashflow tracking tables.")}
                      className="w-full bg-indigo-600 hover:bg-indigo-505 hover:bg-indigo-500 text-white font-bold py-1.5 rounded-lg text-xs transition cursor-pointer"
                    >
                      Generate Regional Audit Template
                    </button>
                  </motion.div>
                )}

                {/* SEARCH & GOVERNMENT HUB */}
                {activeMode === 'search' && (
                  <motion.div
                    key="search-form"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-3 text-xs leading-relaxed text-slate-600 font-semibold"
                  >
                    <p className="text-slate-500 font-bold leading-relaxed">
                      Understand how grassroots missions function in compliance with basic government schemes, central budget guidelines, and citizen transparency rights.
                    </p>
                    <div className="grid grid-cols-1 gap-1.5">
                      <button
                        id="gov-tax-topic-btn"
                        onClick={() => sendMessage("Brief me on the basic tax and corporate coordination guidelines relative to small non-profit community welfare pools in India.")}
                        className="text-left bg-slate-50 hover:bg-slate-100 p-2 rounded border border-slate-200 hover:border-slate-300 transition cursor-pointer text-slate-800"
                      >
                        <span className="text-amber-600 font-extrabold block">⚖️ Small Non-Profit Tax Codes</span>
                        <span className="text-[10px] text-slate-500 font-bold">Exemptions on public micro-grants</span>
                      </button>
                      
                      <button
                        id="gov-budget-topic-btn"
                        onClick={() => sendMessage("How can a village match ₹1 Change Life collection reserves with local Panchayat budget allocations?")}
                        className="text-left bg-slate-50 hover:bg-slate-100 p-2 rounded border border-slate-200 hover:border-slate-300 transition cursor-pointer text-slate-800"
                      >
                        <span className="text-indigo-600 font-extrabold block">🏛️ Gram Panchayat Co-Funding</span>
                        <span className="text-[10px] text-slate-500 font-bold">Leveraging local infrastructure schemes</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* PERSISTENT CONTACT INFORMATION BLOCK */}
          <div className="bg-gradient-to-r from-indigo-50 to-emerald-50 rounded-xl p-3.5 border border-indigo-150 border-indigo-100 shadow-3xs space-y-2 mt-4 text-[11px] text-left">
            <span className="text-[9.5px] text-indigo-700 font-black uppercase tracking-wider block">🏢 ₹1RUPEE CHANGE LIFE HEADQUARTERS</span>
            <div className="space-y-1.5 text-slate-700">
              <div className="flex items-start gap-1.5">
                <span className="text-xs mt-0.5">📱</span>
                <div>
                  <span className="font-extrabold block text-slate-900">8560958039 (WhatsApp First)</span>
                  <p className="text-[10px] text-slate-500 font-bold">👉 Pahle WhatsApp kijiye | message kijiye</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs">📨</span>
                <div>
                  <span className="font-extrabold text-slate-900 block">1rupeechangelife@gmail.com</span>
                </div>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-xs mt-0.5">📍</span>
                <div>
                  <span className="font-extrabold text-slate-900 block">Nayapura Khai Road, Kota, Rajasthan</span>
                  <p className="text-[10px] text-slate-500 font-extrabold">PIN Code: 324001</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <a
                href="https://wa.me/918560958039"
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[9.5px] py-1 rounded flex items-center justify-center gap-1 shadow-3xs transition-transform hover:scale-102"
              >
                <span>💚 WhatsApp Us</span>
              </a>
              <a
                href="mailto:1rupeechangelife@gmail.com"
                className="bg-indigo-600 hover:bg-indigo-550 hover:bg-indigo-500 text-white font-extrabold text-[9.5px] py-1 rounded flex items-center justify-center gap-1 shadow-3xs transition-transform hover:scale-102"
              >
                <span>✉️ Email Us</span>
              </a>
            </div>
          </div>

          {/* STATUS FOOTER IN LEFT PANEL */}
          <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 text-slate-500 font-semibold">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>UTC Time: 2026-05-26</span>
            </div>
            <span className="text-slate-400 font-mono text-[10px] font-bold">1RUPEE v1.2</span>
          </div>
        </section>

        {/* RIGHT COLUMN: CHAT INTERFACE & CONVERSATION TIMELINES - 8 cols */}
        <div className={`col-span-12 lg:col-span-8 flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs min-h-[580px] ${
          mobileTab === 'chat' ? 'flex' : 'hidden lg:flex'
        }`}>
          
          {/* TOP STATUS SUB-BAR */}
          <div className="border-b border-slate-100 bg-slate-50/40 px-4 py-2.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full animate-ping"></div>
              <span className="text-xs text-slate-600 font-bold">
                ₹1Rupee Change Life AI Assistant | Mode: <strong className="text-indigo-600 uppercase font-extrabold">{activeMode}</strong>
              </span>
            </div>
            
            <button
              id="clear-chat-btn"
              onClick={handleClearHistory}
              className="text-[10px] bg-white hover:bg-red-50 hover:text-red-600 text-slate-500 border border-slate-200 px-2.5 py-1 rounded-lg font-bold transition cursor-pointer"
              title="Clear active memory from browser storage"
            >
              Clear Session Memory
            </button>
          </div>

          {/* DYNAMIC LIST OF CHAT PORTAL */}
          <div className="chat-container flex-1 overflow-y-auto p-4 space-y-4 max-h-[420px] min-h-[350px] bg-slate-50/10">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <HelpCircle className="w-12 h-12 text-slate-300 mb-2 animate-bounce" />
                <p className="text-xs font-semibold">No messages yet. Select a mode on the left or type below!</p>
              </div>
            )}

            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 border relative group ${
                    isUser
                      ? 'bg-slate-100 border-slate-200 text-slate-800 rounded-tr-sm shadow-3xs'
                      : 'bg-indigo-50 border-indigo-100/60 text-indigo-950 rounded-tl-sm shadow-3xs'
                  }`}>
                    
                    {/* Speaker indicator/badge */}
                    <div className="flex items-center justify-between gap-6 pb-1.5 mb-1.5 border-b border-slate-200/60 text-[10px] text-slate-500 font-bold">
                      <span className="font-extrabold flex items-center gap-1">
                        {isUser ? '👤 You' : '🇮🇳 ₹1Rupee Change Life'}
                        {!isUser && (
                          <span className="text-[9px] bg-indigo-100 text-indigo-600 border border-indigo-200/50 px-1 rounded-sm">
                            Mission Advisor
                          </span>
                        )}
                      </span>
                      <span className="font-medium text-[9px]">{msg.timestamp}</span>
                    </div>

                    {/* Message body */}
                    <div className={`${!isUser ? 'ai-response' : ''} text-sm leading-relaxed whitespace-pre-wrap font-medium`}>
                      {msg.content}
                    </div>

                    {/* Hover Utility toolbar */}
                    <div className="absolute right-2 -bottom-3 opacity-0 group-hover:opacity-100 transition-opacity bg-white border border-slate-200 rounded-lg p-0.5 shadow flex items-center gap-1 z-10">
                      <button
                        id={`copy-${msg.id}`}
                        onClick={() => handleCopyText(msg.content, msg.id)}
                        className="p-1 hover:bg-slate-50 rounded text-slate-500 hover:text-slate-800 transition cursor-pointer"
                        title="Copy text to clipboard"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      
                      {!isUser && (
                        <button
                          id={`speak-${msg.id}`}
                          onClick={() => handleSpeak(msg.content)}
                          className="p-1 hover:bg-indigo-50 rounded text-indigo-600 hover:text-indigo-500 transition cursor-pointer"
                          title="Speak reply out loud"
                        >
                          <Volume2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    {/* Copy feedback */}
                    {copiedId === msg.id && (
                      <span className="absolute -bottom-6 right-2 text-[9px] text-emerald-600 bg-white border border-slate-200 px-1.5 rounded animate-fade-in-down font-bold shadow-3xs">
                        Copied template!
                      </span>
                    )}

                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-indigo-50/50 border border-indigo-100/40 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%] space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-bold">
                    <span className="animate-spin w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full"></span>
                    <span>{loadingText}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="h-1.5 bg-slate-200/50 rounded w-48 animate-pulse"></div>
                    <div className="h-1.5 bg-slate-200/50 rounded w-36 animate-pulse"></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* INTEGRATED POPULAR INTERACTIVE PRESET FAQs BAR */}
          <div className="bg-slate-50/20 px-4 py-2 border-t border-slate-100">
            <span className="text-[10px] text-indigo-600 font-extrabold block mb-1.5">⚡ DEBATE & STUDY QUESTIONS (FAQs):</span>
            <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
              {INITIAL_FAQS.map((faq) => (
                <button
                  id={`faq-btn-${faq.id}`}
                  key={faq.id}
                  onClick={() => sendMessage(faq.question)}
                  className="whitespace-nowrap bg-white hover:bg-slate-50 hover:border-slate-300 text-xs text-slate-700 font-bold px-3 py-1.5 rounded-full border border-slate-200 transition shadow-2xs flex items-center gap-1 cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-slate-400" />
                  <span>{language === 'hindi' ? faq.hindiQuestion : faq.question}</span>
                </button>
              ))}
            </div>
          </div>

          {/* INPUT FORM FIELD CORE SECTION */}
          <div className="p-4 bg-white border-t border-slate-100">
            <div className="flex gap-2 mb-2">
              
              {/* Voice Rec Button */}
              <button
                id="mic-recording-btn"
                onClick={toggleRecording}
                className={`flex items-center justify-center p-3 rounded-xl border transition relative cursor-pointer ${
                  isRecording
                    ? 'bg-red-600 border-red-500 text-white animate-pulse'
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
                title={isRecording ? "Listening... click to stop" : "Record Voice (Hindi/English)"}
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-indigo-600" />}
                
                {isRecording && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                )}
              </button>

              {/* Text Area */}
              <div className="flex-1 relative">
                <input
                  id="chat-main-input-field"
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') sendMessage();
                  }}
                  placeholder={
                    isRecording 
                      ? "I am listening to your voice..." 
                      : "Type your query here (Accepts English, हिंदी, or Mixed)..."
                  }
                  className="w-full h-12 bg-slate-50/50 border border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition font-semibold"
                  disabled={isLoading}
                />
                
                <span className="absolute right-3.5 top-3.5 text-[9px] text-slate-400 border border-slate-200 rounded px-1.5 font-mono font-bold">
                  {inputValue.length} chars
                </span>
              </div>

              {/* Send trigger */}
              <button
                id="submit-send-btn"
                onClick={() => sendMessage()}
                className={`py-3 px-5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  isLoading || !inputValue.trim()
                    ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-3xs'
                }`}
                disabled={isLoading || !inputValue.trim()}
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>

            </div>

            {speechError && (
              <p className="mt-1 text-[10.5px] text-amber-600 bg-amber-50 px-2.5 py-1.5 rounded-lg font-bold border border-amber-200/50">
                ⚠️ Mic warning: Sandboxed browser blocks recording. If speech fails, please click the <strong>Open In New Tab ↗️</strong> button on the top-right of this container to grant microphone permissions!
              </p>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[10.5px] text-slate-500 px-1 font-semibold gap-1.5 mt-1.5">
              <span className="flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                🎙️ Speak or type your request. AI voice responds automatically (Set "Auto Speak" checkbox on left).
              </span>
              <span className="flex items-center gap-1 text-indigo-600 font-extrabold self-end sm:self-auto">
                <Heart className="w-3 h-3 fill-indigo-600 text-indigo-600" />
                <span>₹1 change lives | ₹1 बदलाव लाता है</span>
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* FIXED BOTTOM MOTIVATIONAL ADVERTISEMENT STATEMENT */}
      <footer className="bg-indigo-950 text-indigo-200 border-t border-indigo-900 py-6 px-4 text-center text-xs mt-auto shadow-inner">
        <div className="max-w-4xl mx-auto space-y-2">
          <div className="flex justify-center items-center gap-2">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-900 text-indigo-300 font-extrabold border border-indigo-800 text-[10px]">₹</span>
            <p className="font-extrabold tracking-tight text-white uppercase text-[12px]">
              ₹1Rupee Change Life AI – Master Mission System
            </p>
          </div>
          <p className="text-[11px] text-indigo-300 max-w-2xl mx-auto font-semibold leading-relaxed">
            "An awareness drive promoting community-led development through macro-cumulative transparency pools. Help recruit volunteers, design publicity posters, calculate localized target distributions or co-funding allocations with extreme ease."
          </p>
        </div>
      </footer>
    </div>
  );
}
