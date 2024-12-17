import React from "react";
import {motion} from "framer-motion"
const Loader = () => {
  return (
    <div className="bg-zinc-900 bg-opacity-30 w-screen h-screen fixed left-0 top-0 flex items-center justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-[16rem] animate-pulse"
      >
        <motion.rect width="7" height="9" x="3" y="3" rx="1" />
        <motion.rect width="7" height="5" x="14" y="3" rx="1" />
        <motion.rect width="7" height="9" x="14" y="12" rx="1" />
        <motion.rect width="7" height="5" x="3" y="16" rx="1" />
      </svg>
    </div>
  );
};

export default Loader;
