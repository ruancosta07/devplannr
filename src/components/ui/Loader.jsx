import React from 'react';
import { motion } from 'framer-motion';
const Loader = () => {
  return (
    <div className="bg-zinc-950/70 w-screen h-screen fixed left-0 top-0 flex flex-col justify-center items-center z-[1000]">
      <svg
        className="text-zinc-50 w-[12rem] h-[12rem]"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <motion.rect
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{
            repeat: Infinity,
            repeatType: 'reverse',
            duration: 0.3,
            delay: 0.15,
          }}
          width="7"
          height="5"
          x="14"
          y="3"
          rx="1"
        />
        <motion.rect
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{
            repeat: Infinity,
            repeatType: 'reverse',
            duration: 0.3,
          }}
          width="7"
          height="9"
          x="3"
          y="3"
          rx="1"
        />
        <motion.rect
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{
            repeat: Infinity,
            repeatType: 'reverse',
            duration: 0.3,
            delay: 0.3,
          }}
          width="7"
          height="9"
          x="14"
          y="12"
          rx="1"
        />
        <motion.rect
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{
            repeat: Infinity,
            repeatType: 'reverse',
            duration: 0.3,
            delay: 0.45,
          }}
          width="7"
          height="5"
          x="3"
          y="16"
          rx="1"
        />
      </svg>
      {/* <span className='text-zinc-50 text-[2rem] font-semibold'>Carregando...</span> */}
    </div>
  );
};

export default Loader;
