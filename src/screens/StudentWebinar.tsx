import React, { useState, useEffect, useRef } from 'react';
import {
  LiveKitRoom,
  VideoConference,
  useLocalParticipant,
} from '@livekit/components-react';
import { supabase } from '../lib/supabase';
import { Hand, Mic, Send, ArrowLeft } from 'lucide-react';
import '@livekit/components-styles';

interface StudentWebinarProps {
  user: any;
  onBack: () => void;
}

const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL || '';

export const StudentWebinar: React.FC<StudentWebinarProps> = ({ user, onBack }) => {
  const roomId = 'biology-class-101'; // MVP fixed room
  const [token, setToken] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const username = user.user_metadata?.full_name || user.email || 'Student';
        const res = await fetch(`http://localhost:3001/api/token?room=${roomId}&username=${encodeURIComponent(username)}&isTeacher=false`);
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
      <div className="flex h-screen w-full items-center justify-center bg-gray-900 text-white flex-col gap-4">
        <h2 className="text-xl font-bold text-red-400">LiveKit Connection Error</h2>
        <p>{error}</p>
        <button onClick={onBack} className="bg-blue-600 px-4 py-2 rounded">Go Back</button>
      </div>
    );
  }


  if (!LIVEKIT_URL || !token) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-900 text-white flex-col gap-4">
        <h2 className="text-xl font-bold text-red-400">Connecting to LiveKit...</h2>
        <p>Fetching secure access token...</p>
      </div>
    );
  }


  return (
    <LiveKitRoom
      video={false} // Students never publish video
      audio={false} // Start muted
      token={token}
      serverUrl={LIVEKIT_URL}
      connect={true}
      className="flex h-screen w-full bg-gray-900"
    >
      <StudentContent 
        roomId={roomId} 
        studentId={user.id} 
        studentName={user.user_metadata?.full_name || user.email} 
        onBack={onBack}
      />
    </LiveKitRoom>
  );
};

const StudentContent: React.FC<{ roomId: string, studentId: string, studentName: string, onBack: () => void }> = ({ roomId, studentId, studentName, onBack }) => {
  const { localParticipant } = useLocalParticipant();
  const [handStatus, setHandStatus] = useState<'none' | 'pending' | 'approved'>('none');
  const [handRecordId, setHandRecordId] = useState<string | null>(null);
  
  const [messages, setMessages] = useState<{ id: string, name: string, text: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Hand Raise Channel
    const handChannel = supabase
      .channel(`hand_status_${studentId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'raised_hands', filter: `student_id=eq.${studentId}` },
        async (payload) => {
          const status = payload.new.status;
          if (status === 'approved') {
            setHandStatus('approved');
            await localParticipant.setMicrophoneEnabled(true);
          } else if (status === 'lowered') {
            setHandStatus('none');
            await localParticipant.setMicrophoneEnabled(false);
          }
        }
      )
      .subscribe();

    // 2. Chat Channel
    const chatChannel = supabase
      .channel(`chat_${roomId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `room_id=eq.${roomId}` },
        (payload) => {
          setMessages(prev => [...prev, payload.new as any]);
          chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
      )
      .subscribe();

    const fetchChat = async () => {
      const { data } = await supabase.from('chat_messages').select('*').eq('room_id', roomId).order('created_at', { ascending: true });
      if (data) {
        setMessages(data);
        chatEndRef.current?.scrollIntoView({ behavior: 'auto' });
      }
    };
    fetchChat();

    return () => {
      supabase.removeChannel(handChannel);
      supabase.removeChannel(chatChannel);
    };
  }, [roomId, studentId, localParticipant]);

  const toggleRaiseHand = async () => {
    if (handStatus === 'none') {
      const { data, error } = await supabase.from('raised_hands').insert({
        room_id: roomId,
        student_id: studentId,
        student_name: studentName,
        status: 'pending'
      }).select().single();
      
      if (!error && data) {
        setHandStatus('pending');
        setHandRecordId(data.id);
      }
    } else if (handStatus === 'pending') {
      if (handRecordId) {
        await supabase.from('raised_hands').update({ status: 'lowered' }).eq('id', handRecordId);
        setHandStatus('none');
      }
    }
  };

  const sendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    await supabase.from('chat_messages').insert({
      room_id: roomId,
      student_id: studentId,
      name: studentName,
      text: chatInput.trim()
    });
    setChatInput('');
  };

  return (
    <div className="flex w-full h-full">
      {/* Main Video Area */}
      <div className="flex-1 flex flex-col p-4 relative">
        <button 
          onClick={onBack}
          className="absolute top-8 left-8 z-10 flex items-center gap-2 px-3 py-1.5 bg-gray-900/80 hover:bg-gray-800 text-white rounded-md transition-colors border border-gray-700 backdrop-blur-sm"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="flex-1 bg-black rounded-lg overflow-hidden relative shadow-lg border border-gray-800">
           <VideoConference />

           <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-gray-900/80 backdrop-blur px-6 py-3 rounded-full border border-gray-700">
              <button 
                onClick={toggleRaiseHand}
                disabled={handStatus === 'approved'}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors ${
                  handStatus === 'pending' ? 'bg-yellow-500 text-black' : 
                  handStatus === 'approved' ? 'bg-green-500 text-white opacity-50 cursor-not-allowed' :
                  'bg-gray-700 hover:bg-gray-600 text-white'
                }`}
              >
                <Hand size={18} />
                {handStatus === 'pending' ? 'Hand Raised (Click to Cancel)' : 
                 handStatus === 'approved' ? 'Approved to Speak' : 
                 'Raise Hand'}
              </button>

              {handStatus === 'approved' && (
                <div className="flex items-center gap-2 text-green-400 font-semibold ml-2">
                  <Mic size={18} />
                  Mic Active
                </div>
              )}
           </div>
        </div>
      </div>

      {/* Sidebar Chat */}
      <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col h-full">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-white font-semibold">Live Chat</h2>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className="flex flex-col">
              <span className="text-xs text-gray-400 font-medium mb-1">{msg.name}</span>
              <div className="bg-gray-700 text-sm text-gray-100 rounded-lg rounded-tl-none p-3 w-fit max-w-[90%] break-words">
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <form onSubmit={sendChatMessage} className="p-4 border-t border-gray-700 flex gap-2">
          <input 
            type="text" 
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 bg-gray-900 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 border border-gray-700"
          />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 p-2 rounded-md text-white transition-colors">
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};
