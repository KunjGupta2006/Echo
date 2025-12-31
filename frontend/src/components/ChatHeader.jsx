import { X, Video  } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore.js";
import { useNavigate } from 'react-router-dom';

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  if (!selectedUser) return null;
  const { onLineUsers,authUser,socket } = useAuthStore();
  const navigate = useNavigate();
  const videocallBtn = () => {
      // Notify user"
      if (socket) {
        socket.emit("request-video-call", {
          to: selectedUser._id,
          from: {
              _id: authUser._id,
              username: authUser.username,
              profilePic: authUser.profilePic
          }
         });
        }
        navigate("/vcall", { state: { type: "caller" } });
      };

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={selectedUser.profilePic || "/Gemini_Generated_Image_6b6bql6b6bql6b6b.png"} alt={selectedUser.username} />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser.username}</h3>
            <p className="text-m text-base-content/60">
              {onLineUsers?.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close button */}
        <div className="flex items-center justify-between mr-4 p-2">
          <button to="/vcall" className="mr-4" onClick={videocallBtn} >
            <Video />
          </button>
          <button onClick={() => setSelectedUser(null)}>
            <X />
          </button>
        </div>
      </div>
    </div>
  );
};
export default ChatHeader;