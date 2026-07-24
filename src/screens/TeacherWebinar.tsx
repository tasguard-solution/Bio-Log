import React, { useState, useEffect } from 'react';
import {
  LiveKitRoom,
  VideoConference,
  useRoomContext,
  useLocalParticipant,
} from '@livekit/components-react';
import { supabase } from '../lib/supabase';
import { Mic, MicOff, MonitorUp, Hand, CheckCircle, ArrowLeft } from 'lucide-react';
import '@livekit/components-styles';

interface RaisedHand {
  id: string;
  student_id: string;
  student_name: string;
  status: 'pending' | 'approved' | 'lowered';
}

interface TeacherWebinarProps {
  onBack: () => void;
}

// In a real application, token and serverUrl should be fetched from your backend securely.
// For now, we are using placeholders that the user will replace.
const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL || '';
const LIVEKIT_TOKEN = import.meta.env.VITE_LIVEKIT_TOKEN || '';

export const TeacherWebinar: React.FC<TeacherWebinarProps> = ({ onBack }) => {
  // Use a fixed room ID for MVP
  const roomId = 'biology-class-101';

  if (!LIVEKIT_URL || !LIVEKIT_TOKEN) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-900 text-white flex-col gap-4">
        <h2 className="text-xl font-bold text-red-400">LiveKit Configuration Missing</h2>
        <p>Please add VITE_LIVEKIT_URL and VITE_LIVEKIT_TOKEN to your .env file.</p>
        <button onClick={onBack} className="bg-blue-600 px-4 py-2 rounded">Go Back</button>
      </div>
    );
  }

  return (
    <LiveKitRoom
      video={false} // Teacher manually publishes screen share
      audio={true}
      token={LIVEKIT_TOKEN}
      serverUrl={LIVEKIT_URL}
      connect={true}
      className="flex h-screen w-full bg-gray-900"
    >
      <TeacherControls roomId={roomId} onBack={onBack} />
    </LiveKitRoom>
  );
};

const TeacherControls: React.FC<{ roomId: string, onBack: () => void }> = ({ roomId, onBack }) => {
  const room = useRoomContext();
  const { localParticipant } = useLocalParticipant();
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [raisedHands, setRaisedHands] = useState<RaisedHand[]>([]);

  useEffect(() => {
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
  }, [roomId]);

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
        resolution: { width: 1920, height: 1080, frameRate: 15 } // Prioritize detail
      });
      setIsScreenSharing(true);
    }
  };

  const approveHand = async (handId: string) => {
    await supabase.from('raised_hands').update({ status: 'approved' }).eq('id', handId);
  };

  const lowerHand = async (handId: string) => {
    await supabase.from('raised_hands').update({ status: 'lowered' }).eq('id', handId);
  };

  return (
    <div className="flex w-full h-full">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col p-4 relative">
        <button 
          onClick={onBack}
          className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition-colors border border-gray-700"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="flex flex-col items-center justify-center flex-1">
          <h1 className="text-white text-2xl mb-4">Teacher Dashboard</h1>
          
          <div className="flex gap-4 mb-8">
            <button 
              onClick={toggleScreenShare}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isScreenSharing ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <MonitorUp size={20} />
              {isScreenSharing ? 'Stop Screen Share' : 'Share 3D Model'}
            </button>
          </div>

          <div className="w-full h-full max-h-[70vh] rounded-lg overflow-hidden border border-gray-700">
             <VideoConference />
          </div>
        </div>
      </div>

      {/* Sidebar for Hands */}
      <div className="w-80 bg-gray-800 border-l border-gray-700 p-4 flex flex-col h-full overflow-y-auto">
        <h2 className="text-white text-xl font-semibold mb-4 flex items-center gap-2">
          <Hand size={20} /> Raised Hands
        </h2>
        
        <div className="flex-1 space-y-3">
          {raisedHands.map(hand => (
            <div key={hand.id} className="bg-gray-700 p-3 rounded-lg flex justify-between items-center">
              <span className="text-white text-sm">{hand.student_name}</span>
              
              {hand.status === 'pending' ? (
                <button 
                  onClick={() => approveHand(hand.id)}
                  className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-md"
                  title="Approve to Speak"
                >
                  <CheckCircle size={16} />
                </button>
              ) : (
                <button 
                  onClick={() => lowerHand(hand.id)}
                  className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-md text-xs font-semibold"
                >
                  Mute
                </button>
              )}
            </div>
          ))}
          {raisedHands.length === 0 && (
            <p className="text-gray-400 text-sm italic">No raised hands right now.</p>
          )}
        </div>
      </div>
    </div>
  );
};
