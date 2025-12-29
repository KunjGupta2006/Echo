import { motion } from "framer-motion";
import { useThemeStore } from "../store/useThemeStore.js";
import { daisyThemes } from "../constants";
import {Link} from "react-router-dom";
import {X} from "lucide-react";
const preview_messages = [
  { id: 1, message: "hey! jon let's catch up at lunch", isSent: false },
  { id: 2, message: "Working on some new features. It won't be possible", isSent: true },
]


const SettingPage = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <>
    {/* Close button */}
    <div className="absolute right-24 mx-auto text-red-500" ><Link to="/">  <X /> </Link></div>
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* TOP = THEME PREVIEW */}
      <div data-theme={theme} className="p-6 rounded-2xl bg-base-200 space-y-3 shadow">
        <h2 className="text-xl font-semibold">Theme Preview</h2>
        <div className="space-y-2">
          {preview_messages.map(msg => (
            <div
              key={msg.id}
              className={`p-3 rounded-xl max-w-xs ${
                msg.isSent
                  ? "ml-auto bg-primary text-primary-content"
                  : "bg-base-300"
              }`}
            >
              {msg.message}
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM = THEME OPTIONS */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Choose Theme</h2>

        <div className="grid md:grid-cols-3 gap-3">
          {daisyThemes.map((t) => (
            <motion.div
              key={t}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {setTheme(t);}}
              className={`cursor-pointer p-4 rounded-xl border font-medium capitalize text-center ${
                theme === t ? "ring-2 ring-primary bg-base-200" : "hover:ring-2 ring-primary"
              }`}
            >
              <button>{t}</button>
            </motion.div>

          ))}
        </div>
      </div>
    </div>
    </>
  )
}

export default SettingPage;
