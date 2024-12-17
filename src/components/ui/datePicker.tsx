"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ptBR } from "date-fns/locale";
import dayjsUtils from "@/lib/dayjs";
import { twMerge } from "tailwind-merge";
import { Members } from "@/types/Project";

interface NewTask {
  name: string;
  description: string;
  status: string;
  priority: string;
  users: Members[];
  tags: string[];
  endsAt: Date;
}

export function DatePickerDemo({
  date,
  object,
  setDate,
}: {
  object: NewTask;
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<NewTask>>;
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant={"outline"}
          className={twMerge(
            "w-full flex justify-start h-fit p-[1rem] rounded-[.6rem] border outline-none bg-zinc-100 border-zinc-300 hover:bg-zinc-200 focus:bg-zinc-200 mt-[.4rem] text-[1.4rem] duration-300 ease-in-out dark:bg-zinc-900 dark:border-zinc-800 hover:dark:bg-zinc-800/70 focus:dark:bg-zinc-800/70 btn-date"
          )}
        >
          {date ? dayjsUtils(date).utc().format("dddd, DD  [de] MMMM [de] YYYY") : <span>Selecionar data</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full -translate-x-[34%]">
        <Calendar
          locale={ptBR}
          mode="single"
          selected={date}
          onSelect={(v) => {
            const selectedDate = v as Date;
            setDate({ ...object, endsAt: selectedDate });
            setIsOpen(false);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
