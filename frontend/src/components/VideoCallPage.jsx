import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useChatStore } from '../store/useChatStore.js';
import { useAuthStore } from '../store/useAuthStore.js';

const VideoCallPage = () => {
  const { authUser, socket } = useAuthStore();
  const { selectedUser } = useChatStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [localStream, setLocalStream] = useState(null);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const streamRef = useRef(null);

  const roomId = [authUser?._id, selectedUser?._id].sort().join("-");

  const killMedia = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    setLocalStream(null);
    return;
  };

  const initPeerConnection = () => {
    if (peerConnection.current) return;

    peerConnection.current = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" }]
    });

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice-candidate', event.candidate, roomId);
      }
    };

    peerConnection.current.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0] || new MediaStream([event.track]);
      }
    };
  };

  const startCall = async () => {
    initPeerConnection();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        peerConnection.current.addTrack(track, streamRef.current);
      });
    }

    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);
    socket.emit('offer', offer, roomId);
  };

  useEffect(() => {
    if (!selectedUser) { navigate("/"); return; }

    const enableStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user" // for the selfie camera
        }, 
        audio: true 
      });
        // const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        streamRef.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      } catch (error) {
        console.error(error);
      }
    };

    enableStream();
    return () => killMedia();
  }, [selectedUser]);

  useEffect(() => {
    if (!localStream || !socket || !roomId) return;

    socket.emit('join-room', roomId);
    socket.emit('ready', roomId);

    socket.on('ready', () => {
      if (location.state?.type === "caller") {
        startCall();
      }
    });

    socket.on('offer', async (offer) => {
      initPeerConnection();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => {
          peerConnection.current.addTrack(track, streamRef.current);
        });
      }
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);
      socket.emit('answer', answer, roomId);
    });

    socket.on('answer', async (answer) => {
      if (peerConnection.current) {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    socket.on('ice-candidate', async (candidate) => {
      if (candidate && peerConnection.current?.remoteDescription) {
        try {
          await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (e) { console.error(e); }
      }
    });

    socket.on('end-call', () => {
      killMedia();
      navigate("/");
    });
    socket.on('call-rejected', () => {
      alert("Call declined by user");
      killMedia();
      navigate("/");
    });

  return () => {
  socket.off('ready');
  socket.off('offer');
  socket.off('answer');
  socket.off('ice-candidate');
  socket.off('end-call');
  socket.off('call-rejected');
    };
  }, [localStream, socket, roomId]);

  // FIX: This useEffect ensures the video stream is re-attached 
  // to the video element whenever the camera is toggled back on.
  useEffect(() => {
    if (!isVideoOff && streamRef.current && localVideoRef.current) {
      localVideoRef.current.srcObject = streamRef.current;
    }
  }, [isVideoOff]);

  const toggleMute = () => {
    if (streamRef.current) {
      const newState = !isMuted;
      streamRef.current.getAudioTracks().forEach(track => track.enabled = !newState);
      setIsMuted(newState);
    }
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      const newState = !isVideoOff;
      streamRef.current.getVideoTracks().forEach(track => track.enabled = !newState);
      setIsVideoOff(newState);
    }
  };

  const endCall = () => {
    socket.emit('end-call', roomId);
    killMedia();
    navigate("/");
  };

  return (
    <div className="flex flex-col absolute top-24 h-3/4 w-full bg-base-100 overflow-hidden">
      <main className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 h-full overflow-hidden">
        <div className="relative bg-neutral rounded-2xl overflow-hidden h-full">
          <video ref={remoteVideoRef} className="w-full h-full object-cover bg-black" autoPlay playsInline />
          <div className="absolute bottom-4 left-4">
            <span className="badge badge-neutral bg-black/50 text-white px-3 py-3 font-medium">
              {selectedUser.username}
            </span>
          </div>
        </div>

        <div className="relative bg-neutral rounded-2xl overflow-hidden h-full">
          {isVideoOff ? (
            <div className="flex flex-col items-center justify-center h-full bg-base-200">
               <div className="avatar">
                 <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                   <img src={authUser.profilePic} alt="Me" />
                 </div>
               </div>
               <p className="mt-4 text-sm font-medium opacity-50">Camera Off</p>
            </div>
          ) : (
            <video 
              ref={localVideoRef} 
              className="w-full h-full object-cover scale-x-[-1] bg-black" 
              autoPlay 
              muted 
              playsInline 
            />
          )}
          <div className="absolute bottom-4 left-4">
            <span className="badge badge-primary px-3 py-3 font-medium shadow-lg">You</span>
          </div>
        </div>
      </main>

      <footer className="h-24 flex items-center justify-center gap-6 bg-base-100 border-t border-white/5">
        <button onClick={toggleMute} className={`btn btn-circle btn-md transition-all ${isMuted ? 'btn-error' : 'btn-neutral'}`}>
          {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
        </button>
        <button onClick={endCall} className="btn btn-circle btn-error btn-lg shadow-xl hover:scale-105 transition-transform">
          <PhoneOff size={28} />
        </button>
        <button onClick={toggleVideo} className={`btn btn-circle btn-md transition-all ${isVideoOff ? 'btn-error' : 'btn-neutral'}`}>
          {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
        </button>
      </footer>
    </div>
  );
};

export default VideoCallPage;