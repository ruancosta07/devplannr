"use client"
import React, { useEffect, useRef } from "react";
import { AnimatePresence, HTMLMotionProps, motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";

interface MessageObject {
  title: string;
  text: string;
  type: string;
}

interface MessageInterface extends HTMLMotionProps<"div"> {
  type: "error" | "success";
  title: string;
  text: string;
  message: MessageObject | null;
  setMessage: (value:null ) => void;
}

function Message({ type, title, text, message, setMessage }: Partial<MessageInterface>) {
  const timeOut = useRef<NodeJS.Timeout | null>(null);
    
  useEffect(() => {
    if(timeOut.current){
        clearTimeout(timeOut.current)
    }
    timeOut.current = setTimeout(() => {
      setMessage(null);
    }, 3000);
  }, [setMessage, message]);

  return (
   <AnimatePresence>
    {message && <motion.div initial={{ opacity: 0, scale: 0.7, y: 32 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{opacity:0, scale: .7, y:32}} transition={{duration:.3}} className="fixed bottom-12 right-12 p-[1.4rem] w-fit flex gap-[1rem] border bg-zinc-100 border-t-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 rounded-2">
      {type === "error" ? <XCircle /> : <CheckCircle2 />}
      <div>
        <span className="text-[1.6rem] font-semibold block mb-[.6rem]">{title}</span>
        <p className="text-[1.4rem] font-normal text-zinc-300 max-w-[40ch] leading-[1.3]">{text}</p>
      </div>
    </motion.div>}
   </AnimatePresence>
  );
}

export default Message;
