import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EmojiReaction = ({ trigger, emojis = ["🎉", "✨", "🎊", "🔥"] }) => {
  const [showReaction, setShowReaction] = useState(false);

  useEffect(() => {
    if (trigger) {
      setShowReaction(true);
      const timer = setTimeout(() => setShowReaction(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  return (
    <AnimatePresence>
      {showReaction && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {emojis.map((emoji, index) => (
            <motion.div
              key={index}
              initial={{
                opacity: 0,
                scale: 0,
                x: Math.random() * window.innerWidth,
                y: window.innerHeight
              }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: [0, 1.5, 1, 0.5],
                y: [window.innerHeight, -100],
                rotate: [0, 360]
              }}
              transition={{
                duration: 2,
                delay: index * 0.1,
                ease: "easeOut"
              }}
              className="absolute text-4xl"
            >
              {emoji}
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

export default EmojiReaction;