import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-3 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            
            {/* Sidebar Logic */}
            <div 
              className={`h-full ${selectedUser ? "hidden lg:block" : "w-full"} lg:w-72 border-r border-base-300`}>
              <Sidebar />
            </div>

            {/* Chat Logic */}
            <div 
              className={`flex-1 flex flex-col ${!selectedUser ? "hidden lg:flex" : "flex"}`}>
              {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;