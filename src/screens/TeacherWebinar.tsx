import React, { useState, useEffect } from 'react';
import {
  LiveKitRoom,
  useRoomContext,
  useLocalParticipant,
  RoomAudioRenderer,
} from '@livekit/components-react';
import { supabase } from '../lib/supabase';
import { Mic, MicOff, MonitorUp, Hand, CheckCircle, ArrowLeft, BookOpen } from 'lucide-react';
import { ORGANISMS } from '../data';
import '@livekit/components-styles';

interface RaisedHand {
  id: string;
  student_id: string;
  student_name: string;
  status: 'pending' | 'approved' | 'lowered';
}

interface TeacherWebinarProps {
  user: any;
  onBack: () => void;
}

const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL || '';

export const TeacherWebinar: React.FC<TeacherWebinarProps> = ({ user, onBack }) => {
  const roomId = 'biology-class-101';
  const [token, setToken] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const username = user?.user_metadata?.full_name || user?.email || 'Teacher';
        const res = await fetch(`http://localhost:3001/api/token?room=${roomId}&username=${encodeURIComponent(username)}&isTeacher=true`);
        if (!res.ok) throw new Error('Failed to fetch token');
        const data = await res.json();
        setToken(data.token);
      } catch (err) {
        console.error(err);
        setError('Failed to connect to LiveKit token server. Make sure node token-server.js is running!');
      }
    };
    fetchToken();
  }, [user]);

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-surface-container-low text-on-surface flex-col gap-4">
        <h2 className="text-2xl font-bold text-red-500">LiveKit Connection Error</h2>
        <p>{error}</p>
        <button onClick={onBack} className="bg-primary text-on-primary px-6 py-3 rounded-xl font-bold">Go Back</button>
      </div>
    );
  }

  if (!LIVEKIT_URL || !token) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-surface-container-low text-on-surface flex-col gap-4">
        <h2 className="text-2xl font-bold text-blue-500">Connecting...</h2>
        <p>Fetching token for live class.</p>
        <button onClick={onBack} className="bg-primary text-on-primary px-6 py-3 rounded-xl font-bold">Go Back</button>
      </div>
    );
  }

  return (
    <LiveKitRoom
      video={false} 
      audio={true}
      token={token}
      serverUrl={LIVEKIT_URL}
      connect={true}
      className="flex h-screen w-full bg-surface-container-lowest font-sans"
    >
      <TeacherDashboard roomId={roomId} onBack={onBack} />
      <RoomAudioRenderer />
    </LiveKitRoom>
  );
};

const TeacherDashboard: React.FC<{ roomId: string, onBack: () => void }> = ({ roomId, onBack }) => {
  const room = useRoomContext();
  const { localParticipant } = useLocalParticipant();
  
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [raisedHands, setRaisedHands] = useState<RaisedHand[]>([]);
  const [selectedOrganismId, setSelectedOrganismId] = useState<string>('animal-cell');
  const [notes, setNotes] = useState<string>('');

  const selectedOrganism = ORGANISMS.find(o => o.id === selectedOrganismId);

  useEffect(() => {
    // Initial Mic state
    localParticipant.setMicrophoneEnabled(true);
    setIsMicOn(true);

    const channel = supabase
      .channel('raised_hands')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'raised_hands', filter: `room_id=eq.${roomId}` },
        () => {
          fetchRaisedHands();
        }
      )
      .subscribe();

    fetchRaisedHands();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, localParticipant]);

  const fetchRaisedHands = async () => {
    const { data, error } = await supabase
      .from('raised_hands')
      .select('*')
      .eq('room_id', roomId)
      .in('status', ['pending', 'approved']);
    
    if (data && !error) {
      setRaisedHands(data as RaisedHand[]);
    }
  };

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      await localParticipant.setScreenShareEnabled(false);
      setIsScreenSharing(false);
    } else {
      await localParticipant.setScreenShareEnabled(true, {
        audio: false,
        resolution: { width: 1920, height: 1080, frameRate: 15 }
      });
      setIsScreenSharing(true);
    }
  };

  const toggleMic = async () => {
    const nextState = !isMicOn;
    await localParticipant.setMicrophoneEnabled(nextState);
    setIsMicOn(nextState);
  };

  const approveHand = async (handId: string) => {
    await supabase.from('raised_hands').update({ status: 'approved' }).eq('id', handId);
  };

  const lowerHand = async (handId: string) => {
    await supabase.from('raised_hands').update({ status: 'lowered' }).eq('id', handId);
  };

  return (
    <div className="flex w-full h-full text-on-surface">
      {/* Left Sidebar - Controls & Hands */}
      <div className="w-80 bg-surface border-r border-surface-container-high flex flex-col h-full z-10 shadow-sm">
        <div className="p-4 border-b border-surface-container-high">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-xl transition-colors mb-6 text-sm font-semibold"
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
          
          <h1 className="font-serif text-2xl font-bold text-primary mb-1">Live Class</h1>
          <p className="text-xs text-on-surface-variant mb-6">Room: {roomId}</p>

          <div className="space-y-3">
            <button 
              onClick={toggleMic}
              className={`w-full flex justify-center items-center gap-2 px-4 py-3 rounded-xl font-bold transition-colors ${
                isMicOn ? 'bg-primary/10 text-primary hover:bg-primary/20' : 'bg-red-100 text-red-600 hover:bg-red-200'
              }`}
            >
              {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
              {isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
            </button>
            
            <button 
              onClick={toggleScreenShare}
              className={`w-full flex justify-center items-center gap-2 px-4 py-3 rounded-xl font-bold transition-colors text-white ${
                isScreenSharing ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700 shadow-md'
              }`}
            >
              <MonitorUp size={20} />
              {isScreenSharing ? 'Stop Broadcasting' : 'Broadcast 3D Model'}
            </button>
          </div>
        </div>

        <div className="p-4 flex-1 flex flex-col overflow-hidden">
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2 text-on-surface">
            <Hand size={18} className="text-amber-500" /> Raised Hands
          </h2>
          
          <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {raisedHands.map(hand => (
              <div key={hand.id} className="bg-surface-container-low border border-surface-container-high p-3 rounded-xl flex justify-between items-center">
                <span className="font-medium text-sm">{hand.student_name}</span>
                
                {hand.status === 'pending' ? (
                  <button 
                    onClick={() => approveHand(hand.id)}
                    className="p-1.5 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg transition-colors"
                    title="Allow Student to Speak"
                  >
                    <CheckCircle size={18} />
                  </button>
                ) : (
                  <button 
                    onClick={() => lowerHand(hand.id)}
                    className="px-2 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-xs font-bold transition-colors"
                  >
                    Mute
                  </button>
                )}
              </div>
            ))}
            {raisedHands.length === 0 && (
              <div className="text-center py-8 text-on-surface-variant flex flex-col items-center">
                <Hand size={32} className="opacity-20 mb-2" />
                <p className="text-sm">No hands raised.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area - 3D Model & Notes */}
      <div className="flex-1 flex flex-col bg-surface-container-lowest">
        
        {/* Model Selection Header */}
        <div className="bg-surface p-4 border-b border-surface-container-high flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-bold text-on-surface">Topic to Teach:</span>
            <select 
              className="bg-surface-container border border-surface-container-high text-on-surface rounded-xl px-4 py-2 font-medium focus:ring-2 focus:ring-primary outline-none"
              value={selectedOrganismId}
              onChange={(e) => setSelectedOrganismId(e.target.value)}
            >
              {ORGANISMS.filter(o => o.sketchfabId).map(org => (
                <option key={org.id} value={org.id}>{org.name}</option>
              ))}
            </select>
          </div>
          
          {isScreenSharing && (
            <div className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full animate-pulse text-sm font-bold">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              Live Broadcasting
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-row p-4 gap-4 overflow-hidden">
          {/* Sketchfab Canvas (The area to screen share) */}
          <div className="flex-[2] bg-black rounded-2xl overflow-hidden shadow-lg border border-surface-container-high relative flex flex-col">
            {selectedOrganism?.sketchfabId ? (
              <iframe
                title={selectedOrganism.name}
                className="w-full h-full"
                src={`https://sketchfab.com/models/${selectedOrganism.sketchfabId}/embed?autostart=1&ui_theme=dark`}
                allow="autoplay; fullscreen; xr-spatial-tracking; accelerometer; gyroscope; picture-in-picture"

                allowFullScreen
              />
            ) : (
              <div className="flex-1 flex items-center justify-center text-white/50">
                Select a model with 3D support
              </div>
            )}
            
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl text-white pointer-events-none">
              <h3 className="font-bold">{selectedOrganism?.name}</h3>
              <p className="text-xs opacity-80">Click 'Broadcast 3D Model' to share this view.</p>
            </div>
          </div>

          {/* Teacher Notes Panel */}
          <div className="flex-[1] bg-surface rounded-2xl border border-surface-container-high shadow-sm flex flex-col overflow-hidden min-w-[300px]">
            <div className="p-4 border-b border-surface-container-high flex items-center gap-2 bg-surface-container-low">
              <BookOpen size={18} className="text-primary" />
              <h3 className="font-bold text-on-surface">Teacher Notes</h3>
            </div>
            
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Jot down your lesson plan, key talking points, or reminders here. Students will not see this..."
              className="flex-1 w-full p-4 bg-transparent outline-none resize-none text-on-surface"
            />
            
            {/* Quick Facts Helper */}
            {selectedOrganism && (
              <div className="p-4 border-t border-surface-container-high bg-surface-container-lowest max-h-48 overflow-y-auto">
                <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Quick Reference</h4>
                <p className="text-sm text-on-surface mb-3 line-clamp-3">{selectedOrganism.description}</p>
                <div className="flex flex-wrap gap-2">
                  {selectedOrganism.stats.slice(0, 3).map((stat, i) => (
                    <span key={i} className="text-[10px] px-2 py-1 bg-surface-container rounded-md font-medium text-on-surface-variant">
                      {stat.label}: {stat.value}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
