import { ChevronDown } from "lucide-react";
import React, { useState } from "react";
import {motion} from "framer-motion"
const Select = ({
  selectStatus,
  setSelectStatus,
  label,
  className,
  options,
  activeStatus,
  setActiveStatus
}) => {
  return (
    <div
      onClick={() => setSelectStatus((v)=> !v)}
      className="cursor-pointer flex p-[1.2rem] dark:bg-zinc-800/50 rounded-[.5rem] dark:text-zinc-100 relative"
    >
      <span className="text-[1.5rem] font-medium">{typeof activeStatus !== "string" ? activeStatus.map((s,i)=> s): (activeStatus || label)}</span>
      <ChevronDown className="w-[1.6rem] h-[1.6rem] ml-auto" />
        {selectStatus &&
      <motion.div initial={{opacity: 0, scale:.9}} animate={selectStatus ? {opacity: 1, scale: 1}: {opacity:0, scale: .9}} className="absolute z-[10] flex flex-col w-full left-0 top-full bg-zinc-900 p-[.8rem] border dark:border-zinc-800 rounded-[.5rem]">
        {options.map((o, i) => (
            <button
            type="button"
            onClick={(e)=> {
                e.stopPropagation()
                setSelectStatus(false)
                setActiveStatus(o)
            }}
              className="text-start text-[1.4rem] p-[.8rem] hover:dark:bg-zinc-800/70 rounded-[.5rem] duration-200"
              key={i}
            >
              {o}
            </button>
          ))}
      </motion.div>
          }
    </div>
  );
};

export default Select;
