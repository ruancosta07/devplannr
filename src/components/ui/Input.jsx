import { useState } from "react";
import { twMerge } from "tailwind-merge";

export const InputContainer = ({ className= "", children }) => (
  <div className={twMerge("flex flex-col gap-[.4rem]", className)}>
    {children}
  </div>
);

export const InputLabel = ({ className= "", label, id }) => (
  <label
    htmlFor={id}
    className={twMerge(
      " text-zinc-800 dark:text-zinc-100 text-[2rem] font-semibold",
      className
    )}
  >
    {label}
  </label>
);

export const Input = ({ type = "", className= "", id, value, onChange, ...props }) => {
  return <input
    type={type}
    className={twMerge(
      "p-[1rem] rounded-[.5rem] text-[1.5rem] bg-zinc-400/50 hover:bg-zinc-400 focus:bg-zinc-400 dark:bg-zinc-800/50 hover:dark:bg-zinc-800/70 focus:dark:bg-zinc-800/70 duration-300 dark:text-zinc-300 outline-none",
      className
    )}
    value={value}
    {...props}
    spellCheck={false}
    onChange={(e) => {
        if(onChange){
            onChange(e)
        }
    }}
    id={id}
  />
}
export const Textarea = ({ type = "", className= "", id= "", value, onChange }) => (
  <textarea
    type={type}
    className={twMerge(
      "p-[1rem] rounded-[.5rem] text-[1.5rem] dark:bg-zinc-800/50 hover:dark:bg-zinc-800/70 focus:dark:bg-zinc-800/70 duration-300 leading-[1.3] dark:text-zinc-300 outline-none",
      className
    )}
    rows={10}
    value={value}
    onChange={(e) => onChange(e)}
    id={id}
  >

  </textarea>
);

