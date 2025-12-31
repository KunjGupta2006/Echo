import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore.js";
import { useAuthStore } from "../store/useAuthStore.js";
import SidebarSkeleton from "./skeletons/SidebarSkeleton.jsx";
import { Users, Search } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onLineUsers } = useAuthStore();
  
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // Logic to filter users based on Online status AND Search query using Regex
  const filteredUsers = (users || []).filter((user) => {
    const isOnline = (onLineUsers || []).includes(user._id);
    const safeQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const searchRegex = new RegExp(safeQuery, 'i');
    const matchesSearch = 
      searchRegex.test(user.fullName) || 
      (user.username && searchRegex.test(user.username));

    if (showOnlineOnly) return isOnline && matchesSearch;
    return matchesSearch;
  });

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-full lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200 bg-base-100">
      {/* --- HEADER SECTION --- */}
      <div className="border-b border-base-300 w-full p-5 bg-base-100/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 hidden md:block bg-primary/10 rounded-lg text-primary">
            <Users size={22} />
          </div>
          <span className="font-bold text-lg  tracking-tight text-base-content">
            Contacts
          </span>
        </div>

        {/* Search Bar */}
        <div className="mt-4 relative lg:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={16} />
          <input
            type="text"
            placeholder="Search contacts..."
            className="input input-sm input-bordered w-full pl-10 focus:input-primary bg-base-200/50 border-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Online Filter Toggle */}
        <div className="mt-4 flex items-center justify-between">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-primary checkbox-sm rounded-md transition-all"
            />
            <span className="text-sm font-medium text-base-content/70 group-hover:text-base-content transition-colors">
              Show online only
            </span>
          </label>
          <div className="badge badge-ghost badge-sm font-mono opacity-60">
            {Math.max(0, (onLineUsers?.length || 0) - 1)} online
          </div>
        </div>
      </div>

      {/* --- SCROLLABLE CONTACT LIST --- */}
      <div className="overflow-y-auto w-full py-2 custom-scrollbar">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-8 flex items-center gap-6 transition-all duration-200
              hover:bg-base-200 group relative btn btn-outline btn-primary
              ${selectedUser?._id === user._id ? "bg-base-200" : ""}
            `}
          >
            {/* Active Indicator Line */}
            {selectedUser?._id === user._id && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
            )}

            {/* Avatar Section */}
            <div className="relative mx-auto lg:mx-0">
              <div className="avatar">
                <div className="w-12 rounded-full ring-2 ring-base-300 group-hover:ring-primary/30 transition-all">
                  <img
                    src={user.profilePic || "/Gemini_Generated_Image_6b6bql6b6bql6b6b.png"}
                    alt={user.fullName}
                    className="object-cover"
                  />
                </div>
              </div>
              {/* Online status dot */}
              {onLineUsers?.includes(user._id) && (
                <span className="absolute bottom-0 right-0 size-3.5 bg-green-500 rounded-full ring-2 ring-base-100" />
              )}
            </div>

            {/* User Details - Only visible on Large Screens */}
            <div className="block text-left flex-1">
              <div className="font-semibold truncate text-base-content">
                {user.username}
              </div>
              
              <div className="text-md font-medium text-base-content/50 truncate">
                @{user.username || user.username.toLowerCase().replace(/\s/g, '_')}
              </div>
            </div>
          </button>
        ))}

        {/* Empty State when no users match filters */}
        {filteredUsers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center opacity-40">
            <Users size={40} className="mb-2" />
            <p className="text-sm italic">No contacts found</p>
          </div>
        )}
      </div>

    </aside>
  );
};

export default Sidebar;