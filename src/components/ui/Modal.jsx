import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { X } from "lucide-react";
const Modal = ({ modal, setModal, className, children, onExit, onClose }) => {
  useEffect(() => {
    function closeModalEsc(e) {
      if (e.key === "Escape") {
        setModal(false);
      }
    }
    window.addEventListener("keyup", closeModalEsc);
    if(onExit){
      onExit()
    }
    return () => {
      window.removeEventListener("keyup", closeModalEsc);
    };
  }, []);

  return (
    <div
      onClick={() => {
        onClose && onClose()
        setModal(false)
      }}
      className="bg-zinc-950/60 w-screen h-screen fixed left-0 top-0 z-[1900] flex items-center justify-center"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={twMerge(
          "bg-zinc-200 dark:bg-zinc-900 min-w-[30%] rounded-[.5rem] shadow-lg min-h-[10%] p-[1rem] relative",
          className
        )}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default Modal;
