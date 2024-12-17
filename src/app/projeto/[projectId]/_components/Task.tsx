"use client";
import Modal from "@/components/Modal";
import Show from "@/components/Show";
import dayjsUtils from "@/lib/dayjs";
import { Messages, TasksInterface } from "@/types/Project";
import clsx from "clsx";
import {
  Bookmark,
  BookmarkPlus,
  CalendarDays,
  CircleDot,
  FileText,
  MessageCircle,
  Paperclip,
  PlusIcon,
  Route,
  Smile,
  TriangleAlert,
  UserPlus,
  Users,
} from "lucide-react";
import Image from "next/image";
import React, { Dispatch, RefObject, SetStateAction, useEffect, useState } from "react";
import Cookies from "js-cookie";
import useUserStore from "@/store/User";
import { Input, InputContainer } from "@/components/Input";
import { Socket } from "socket.io-client";
type SectionTask = "Atividades" | "Comentários";

const Task = ({
  activeTask,
  setActiveTask,
  socket,
}: {
  activeTask: TasksInterface | null;
  setActiveTask: Dispatch<SetStateAction<null | TasksInterface>>;
  socket?: RefObject<Socket | null>;
}) => {
  const { user } = useUserStore();
  const [activeSectionTask, setActiveSectionTask] = useState<SectionTask>("Atividades");
  const sections = ["Atividades", "Comentários"];
  const [messages, setMessages] = useState<Messages[] | null>(null);
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (activeTask) {
      async function loadMessages() {
        try {
          const response = await fetch(`http://localhost:3000/${activeTask.id}/carregar-mensagens`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${Cookies.get("authTokenDevPlannr")}`,
            },
          });
          const data = await response.json();
          setMessages(data);
        } catch (err) {
          console.log(err);
        }
      }
      loadMessages();
    }
  }, [activeTask]);

  function changeActiveSection(value: SectionTask) {
    setActiveSectionTask(value);
  }
  return (
    <Modal
      modal={Boolean(activeTask)}
      setModal={setActiveTask}
      onClose={() => {
        setActiveTask(null);
      }}
      className="w-[40%] min-h-fit p-[1.4rem] block dark:bg-zinc-900"
    >
      <h1 className="text-[3rem] font-semibold mb-[.6rem]">{activeTask?.name}</h1>
      <p className="text-[1.6rem] text-zinc-300 leading-[1.3]">{activeTask?.description}</p>
      <div className="mt-[1.2rem] flex items-center gap-[1rem] text-[1.4rem]">
        <p className="text-[1.4rem] flex items-center">
          <TriangleAlert className="size-[1.8rem] mr-[.6rem]" />
          Prioridade
        </p>
        <button className="p-[.6rem] px-[1rem] rounded-2 bg-zinc-800">{activeTask?.priority}</button>
      </div>
      <div className="mt-[1.2rem] flex items-center gap-[1rem] text-[1.4rem]">
        <p className="text-[1.4rem] flex items-center">
          <CircleDot className="size-[1.8rem] mr-[.6rem]" />
          Status
        </p>
        <button className="p-[.6rem] px-[1rem] rounded-2 bg-zinc-800">{activeTask?.status}</button>
      </div>
      <div className="mt-[1.2rem] flex items-center gap-[1rem] text-[1.4rem]">
        <p className="text-[1.4rem] flex items-center">
          <CalendarDays className="size-[1.8rem] mr-[.6rem]" />
          Data de término
        </p>
        <button className="">{dayjsUtils(activeTask?.createdAt).format("dddd, MM [de] MMMM [de] YYYY")}</button>
      </div>
      <div className="mt-[1.2rem] flex items-center gap-[1rem] text-[1.4rem]">
        <p className="text-[1.4rem] flex items-center">
          <Users className="size-[1.8rem] mr-[.6rem]" />
          Responsáveis
        </p>
        <div className="flex gap-[1rem]">
          {activeTask?.users.map((u) => (
            <div className="flex items-center gap-[1rem]" key={u.id}>
              <Image src={u.avatar} width={24} height={24} alt="" className="rounded-full" />
              <p>{u.name}</p>
            </div>
          ))}
          <button className="flex items-center gap-[1rem] ">
            <UserPlus className="size-[1.8rem]" />
            Adicionar
          </button>
        </div>
      </div>
      <div className="mt-[1.2rem] flex items-center gap-[1rem] text-[1.4rem]">
        <p className="text-[1.4rem] flex items-center">
          <Bookmark className="size-[1.8rem] mr-[.6rem]" />
          Tags
        </p>
        <div className="flex gap-[1rem]">
          {activeTask?.tags?.map((u) => (
            <div className="flex items-center gap-[1rem] bg-zinc-100 text-zinc-900 font-medium p-[.5rem] rounded-full px-[1rem]" key={u}>
              <p>{u}</p>
            </div>
          ))}
          <button className="flex items-center gap-[1rem] ">
            <BookmarkPlus className="size-[1.8rem]" />
            Adicionar
          </button>
        </div>
      </div>
      <div className="flex gap-[1rem] mt-[2rem] text-[1.4rem]">
        {sections.map((t, i) => (
          <button
            onClick={() => changeActiveSection(t as SectionTask)}
            className={clsx("p-[.8rem] rounded-2 font-semibold flex items-center gap-[.6rem]", {
              "bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900": activeSectionTask === t,
              "bg-zinc-700 text-zinc-300 dark:bg-zinc-400 dark:text-zinc-800": activeSectionTask !== t,
            })}
            key={i}
          >
            {i === 0 && <Route className="size-[1.8rem]" />}
            {i === 1 && <MessageCircle className="size-[1.8rem]" />}
            {t}
          </button>
        ))}
      </div>
      <Show when={activeSectionTask === "Atividades"}>
        <div className="flex flex-col gap-[1rem] relative mt-[1.2rem] min-h-[10vh] max-h-[30vh] overflow-y-auto custom-scrollbar pr-[1rem]">
          {messages?.map((m) => {
            return (
              <div
                key={m.id}
                className={clsx("grid gap-[.6rem] w-full", {
                  "grid-cols-[auto_1fr]": m.userId !== user?.id,
                  "grid-cols-[1fr_auto]": m.userId === user?.id,
                })}
              >
                <Show when={m.avatar}>
                  <Image
                    src={m.avatar}
                    width={40}
                    height={40}
                    alt=""
                    className={clsx("size-[4rem] rounded-full border dark:border-zinc-800 row-span-2", {
                      "col-start-2 row-start-1 size-[4rem]": m.userId === user?.id,
                    })}
                  />
                </Show>
                {/* <Show when={!m.avatar}>
            <div className="flex items-center justify-center size-[3.2rem] border rounded-full dark:border-zinc-800">
                {m.name[0].toUpperCase()}
            </div>
            </Show> */}
                <div
                  className={clsx("flex h-fit items-center gap-[1rem]", {
                    "row-start-1 col-start-1 justify-end": m.userId === user?.id,
                  })}
                >
                  <span className="text-[1.6rem] font-semibold">{m.userId === user?.id ? "Você" : m.name}</span>
                  <p className="text-[1.1rem] text-zinc-400">{dayjsUtils(m.sendAt).fromNow()}</p>
                </div>
                <div
                  className={clsx("text-[1.4rem] leading-[1.3] bg-zinc-800 p-[.8rem] rounded-2 max-w-[70%]", {
                    "ml-auto": m.userId === user?.id,
                  })}
                >
                  <p className="leading-[1.3]">{m.content}</p>
                </div>
              </div>
            );
          })}
          <InputContainer className="sticky top-full left-0 bg-zinc-900 flex items-center gap-[1rem]">
            <button>
              <PlusIcon />
            </button>
            <div className="w-full relative">
              <Input
                className="pl-[3.6rem] inline-block h-full"
                type="text"
                placeholder="Enviar mensagem..."
                value={message}
                onChange={({ target }) => setMessage(target.value)}
              />
              <button className="absolute left-2 top-[55%] -translate-y-2/4 p-[.5rem]">
                <Smile className="size-[2rem]" />
              </button>
            </div>
          </InputContainer>
        </div>
      </Show>
    </Modal>
  );
};

export default Task;
