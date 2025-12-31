import { useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import { Routes, Route, Navigate, useNavigate } from "react-router-dom"; // Added useNavigate
import HomePage from './pages/HomePage.jsx';
import LogInPage from './pages/LogInPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import SettingPage from './pages/SettingPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import VideoCallPage from "./components/VideoCallPage.jsx";
import { useAuthStore } from './store/useAuthStore.js';
import { useChatStore } from './store/useChatStore.js'; // Added ChatStore
import { Loader } from 'lucide-react';
import { Toaster } from "react-hot-toast";
import { useThemeStore } from './store/useThemeStore.js';

function App() {
  const { theme } = useThemeStore();
  const navigate = useNavigate();
  const { authUser, checkAuth, isCheckingAuth, socket } = useAuthStore();
  const { setSelectedUser } = useChatStore();

  useEffect(() => {
    const currentTheme = theme;
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [theme]);

  useEffect(() => { checkAuth() }, [checkAuth]);
useEffect(() => {
  if (!socket) return;

  const handleIncomingCall = ({ from }) => {
      const roomId = [authUser?._id, from?._id].sort().join("-");
    if (window.isCallActive) return;
    const accept = window.confirm(`${from.username} is calling. Accept?`);
    if (accept) {
      window.isCallActive = true; 
      setSelectedUser(from);
      navigate("/vcall", { state: { type: "receiver" } });
    }else {socket.emit("reject-call", roomId);}
  };
  socket.on("incoming-video-call", handleIncomingCall);
  return () => {
    socket.off("incoming-video-call", handleIncomingCall);
    window.isCallActive = false;
  };
}, [socket, navigate, setSelectedUser]);

useEffect(() => {
  const handleTabClose = () => {

     if (socket) socket.emit("end-call", "current-active-room-id");
  };

  window.addEventListener("beforeunload", handleTabClose);
  return () => window.removeEventListener("beforeunload", handleTabClose);
}, [socket]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/signup" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LogInPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={<SettingPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="/vcall" element={authUser ? <VideoCallPage /> : <Navigate to="/login" />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;