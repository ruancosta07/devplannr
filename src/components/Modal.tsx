import React, { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
const Modal = ({ children, modal, setModal, className }: { children: ReactNode; modal: boolean; className?: string, setModal: (value:boolean)=> void }) => {
  return (
    <AnimatePresence>
      {modal && (
        <div className="bg-zinc-950 bg-opacity-30 fixed left-0 top-0 z-[10] w-screen h-screen flex items-center justify-center">
          <motion.div
            className={twMerge("bg-zinc-900 w-[30vw] h-[30vh] p-[1.4rem] rounded-2 shadow-lg shadow-zinc-950", className)}
            initial={{ opacity: 0, scale: 0.7, y: 32 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
