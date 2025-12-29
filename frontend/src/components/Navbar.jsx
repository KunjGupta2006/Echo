import { useAuthStore } from '../store/useAuthStore.js';
import { MessagesSquare, Settings, User, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';


const Navbar = () => {

  const {authUser,logout} =useAuthStore();

return (
    <nav className="navbar bg-base-100 shadow-md border-b-2 border-base-200 sticky top-0 z-50 p-4 h-25">
      <Link to="/">
      <div className="navbar-start flex items-center gap-2 md:gap-4">
        
        {/* Logo/Brand: Text and icon*/}
        <button className="btn btn-ghost text-xl font-bold transition duration-200 flex items-center gap-2 text-base-content" >
          {/* Note: MessagesSquare icon color is inherited from button text color */}
          <MessagesSquare className="w-10 h-10" />
          <span className="hidden text-3xl sm:inline">Echo</span>
        </button>
      </div>
      </Link>
        
      <div className="navbar-end ms-auto flex">
            
            {authUser && (<Link to="/profile" className="mr-4">
              {/* Profile Link */}
                <button
                    className="btn btn-ghost btn-sm md:btn-md transition-colors duration-150 flex items-center gap-1"
                    aria-label="Profile"
                >
                    <User className="w-5 h-5" />
                    <span className="hidden sm:inline">Profile</span>
                </button>
              </Link>)}
        

              {/* Settings Link */}
              <Link to="/settings" className="mr-4">
                <button
                    className="btn btn-ghost btn-sm md:btn-md transition-colors duration-150 flex items-center gap-1"
                    aria-label="Settings"
                >
                    <Settings className="w-5 h-5" />
                    <span className="hidden sm:inline">Settings</span>
                </button>
              </Link>

              {/* Logout Link */}
              {authUser && (<button
                  onClick={logout}
                  className="btn btn-ghost hover:bg-red-600  btn-sm md:btn-md mr-4 transition-colors duration-150 flex items-center gap-1"
                  aria-label="Logout"
              >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden sm:inline">Logout</span>
              </button>
              )}
      </div>
    </nav>
  );
}

export default Navbar