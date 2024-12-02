import React, { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, CheckCircle2, XCircle } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
const Message = ({title, text, message, setMessage, className, type = '' }) => {
  const timeOut = useRef();
  useEffect(() => {
    clearTimeout(timeOut.current);
    timeOut.current = setTimeout(() => {
      setMessage(null);
    }, 3000);
  }, [message]);
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.3 }}
          exit={{ opacity: 0, y: 32, scale: 0.9 }}
          className={twMerge("fixed right-16 bottom-16 flex gap-[1rem] min-w-[10%] bg-zinc-200 border-zinc-300 dark:bg-zinc-900 border dark:border-zinc-800 rounded-[.5rem] p-[1.4rem]", className)}
        >
          {type === "error" && <XCircle className="text-zinc-900 dark:text-zinc-100 w-[2rem] h-[2rem]" />}
          {type === "success" && <CheckCircle2 className="text-zinc-900 dark:text-zinc-100 w-[2rem] h-[2rem]" />}
          <div>
            <span className="text-zinc-900 dark:text-zinc-100 text-[1.5rem] max-w-[30ch] leading-[1.1] font-semibold block mb-[.4rem]">
             {title}
            </span>
            <p className="text-zinc-700 dark:text-zinc-300 text-[1.35rem] max-w-[35ch] leading-[1.2]">
              {text}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Message;
