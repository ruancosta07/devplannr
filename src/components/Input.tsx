import React, { ChangeEvent, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

const InputContainer = ({ className, children }: { className?: string; children: ReactNode }) => {
  return <div className={twMerge(className)}>{children}</div>;
};

const InputLabel = ({ id, label, className }: { id: string; label: string; className?: string }) => {
  return (
    <label htmlFor={id} className={twMerge("text-[2rem] font-semibold text-zinc-900 dark:text-zinc-100", className)}>
      {label}
    </label>
  );
};

type InputType = "text" | "password" | "email" | "textarea";

const Input = ({
  type,
  value,
  onChange,
  id,
  className,
}: {
  type: InputType;
  value: string;
  onChange?: (value: ChangeEvent<HTMLInputElement>) => void;
  id: string;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) => {
  if (type !== "textarea") {
    return (
      <input
        id={id}
        className={twMerge(
          "w-full p-[1rem] rounded-[.6rem] border outline-none bg-zinc-100 border-zinc-300 hover:bg-zinc-200 focus:bg-zinc-200 mt-[.4rem] text-[1.4rem] duration-300 ease-in-out dark:bg-zinc-900 dark:border-zinc-800 hover:dark:bg-zinc-800/70 focus:dark:bg-zinc-800/70",
          className
        )}
        onChange={(el:ChangeEvent<HTMLInputElement>) => {
          if (onChange) {
            onChange(el);
          }
        }}
        type={type}
        value={value}
      />
    );
  }
  
};

export { InputContainer, InputLabel, Input };
