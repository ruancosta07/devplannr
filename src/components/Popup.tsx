import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import Show from "./Show";
import { twMerge } from "tailwind-merge";
const Popup = ({when, className, children, ...props}: {when:boolean | string | number, className?: string; children: React.ReactNode}) => {
  return (
    <AnimatePresence>
      <Show when={Boolean(when)}>
        <motion.div initial={{opacity:0, scale:.7}} animate={{opacity:1, scale:1}} {...props} className={twMerge("dark:bg-zinc-900 border dark:border-zinc-800 p-[.8rem] rounded-2", className)}>
            {children}
        </motion.div>
      </Show>
    </AnimatePresence>
  );
};

export default Popup;
