import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, MessageCircle, FileText, MessageSquare } from "lucide-react";

export function FloatingContact() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  // Buttons to show when expanded (from top to bottom)
  const buttons = [
    {
      id: 3,
      icon: <FileText size={24} />,
      bgColor: "bg-white",
      color: "text-[#1A3636]",
      label: "Form",
    },
    {
      id: 4,
      icon: <MessageSquare size={24} />,
      bgColor: "bg-white",
      color: "text-[#1A3636]",
      label: "Chat",
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 z-[100] flex flex-col items-center">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center space-y-4 mb-4"
          >
            {buttons.map((btn, index) => (
              <motion.button
                key={btn.id}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                transition={{ duration: 0.2, delay: (buttons.length - 1 - index) * 0.05 }}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200 ${btn.bgColor} ${btn.color}`}
                title={btn.label}
              >
                {btn.icon}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={toggleOpen}
        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
          isOpen ? "bg-gray-300 text-white" : "bg-black text-white hover:bg-gray-800 border-2 border-yellow-600/50"
        }`}
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? <X size={32} /> : <MessageCircle size={32} />}
        </motion.div>
      </button>
    </div>
  );
}
