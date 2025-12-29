import { useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import {Routes,Route,Navigate} from "react-router-dom";
import HomePage from './pages/HomePage.jsx';
import LogInPage from './pages/LogInPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import SettingPage from './pages/SettingPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import { useAuthStore } from './store/useAuthStore.js';
import { Loader } from 'lucide-react';
import {Toaster} from "react-hot-toast";
import { useThemeStore } from './store/useThemeStore.js';

function App() {
  const {theme}=useThemeStore();
  useEffect(() => {
        const currentTheme = theme; 
        document.documentElement.setAttribute('data-theme', currentTheme);
        console.log(`Applying theme: ${currentTheme}`); 
}, [theme]);

  const {authUser, checkAuth,isCheckingAuth,onLineUsers }=useAuthStore();
  useEffect(()=>{checkAuth()},[checkAuth]);
  // console.log(onLineUsers);
  // console.log(authUser);

  if(isCheckingAuth && !authUser){
    return (<div className="flex justify-center items-center h-screen"><Loader className="size=10 animate-spin" /></div>)
  }

  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path="/" element={authUser? <HomePage/> : <Navigate to="/login"/> } />
        <Route path="/signup" element={ !authUser ? <SignUpPage/>: <Navigate to="/"/> } />
        <Route path="/login" element={ !authUser ? <LogInPage/> : <Navigate to="/"/>} />
        <Route path="/settings" element={<SettingPage/>} />
        <Route path="/profile" element={authUser? <ProfilePage/> : <Navigate to="/login"/> } />
      </Routes>
       <Toaster />
    </div>
  )
}

export default App
