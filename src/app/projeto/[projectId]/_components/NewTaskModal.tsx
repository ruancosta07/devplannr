"use client";
import { Input, InputContainer, InputLabel } from "@/components/Input";
import Modal from "@/components/Modal";
import Show from "@/components/Show";
import { DatePickerDemo } from "@/components/ui/datePicker";
import { Members, PlannrInterface } from "@/types/Project";
import clsx from "clsx";
import { Check, ChevronDown, PlusCircle, X } from "lucide-react";
import Image from "next/image";
import React, { Dispatch, FormEvent, RefObject, SetStateAction, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Popup from "@/components/Popup";
import { Socket } from "socket.io-client";
import useUserStore from "@/store/User";
import Cookies from "js-cookie";
interface NewTask {
  name: string;
  description: string;
  status: string;
  priority: string;
  users: Members[];
  tags: string[];
  endsAt: Date;
}

type Priority = "Muito alta" | "Alta" | "Média" | "Baixa" | "";

const NewTaskModal = ({
  createNewTask,
  setCreateNewTask,
  project,
  socket,
  projectId,
}: {
  socket: RefObject<Socket | null>;
  createNewTask: boolean;
  setCreateNewTask: Dispatch<SetStateAction<boolean>>;
  project: PlannrInterface | null;
  projectId: string;
}) => {
  const { user } = useUserStore();
  const [newTag, setNewTag] = useState("");
  const [createNewTag, setCreateNewTag] = useState(false);
  const newTagInput = useRef<HTMLInputElement>(null);
  const [addResponsible, setAddResponsible] = useState(false);
  const [addPriority, setAddPriority] = useState(false);
  const formRef = useRef<HTMLFormElement>(null)
  const [newTask, setNewTask] = useState<NewTask>({
    name: "",
    description: "",
    status: "",
    priority: "",
    users: [],
    tags: [],
    endsAt: new Date()
  });
  useEffect(() => {
    if (createNewTag) {
      newTagInput.current?.focus();
    }
  }, [createNewTag]);
  const priorityOptions = ["Muito alta", "Alta", "Média", "Baixa"];

  async function createTask(e: FormEvent) {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/create-task`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("authTokenDevPlannr")}`,
        },
        body: JSON.stringify({
          userId: user?.id,
          name: newTask.name,
          description: newTask.description,
          priority: newTask.priority,
          id: projectId,
          users: newTask.users,
          tags:newTask.tags,
          status: "Em andamento",
          expiresAt: newTask.endsAt
        }),
      });
      if (!response.ok) {
        return;
      }
      socket.current?.emit("createTask", projectId);
      setCreateNewTask(false);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Modal
      setModal={setCreateNewTask}
      modal={createNewTask}
      onClose={() => setCreateNewTask(false)}
      className="h-fit p-[1.8rem] max-w-[30%]"
    >
      <form onSubmit={(e) => createTask(e)} ref={formRef}>
        <h1 className="text-[2.4rem] font-semibold">Criar nova tarefa</h1>
        <InputContainer className="mt-[2rem]">
          <InputLabel id="titulo" label="Título" />
          <Input
            id="titulo"
            type="text"
            value={newTask.name as string}
            onChange={({ target }) => setNewTask({ ...newTask, name: target.value })}
          />
        </InputContainer>
        <InputContainer className="mt-[2rem]">
          <InputLabel id="descricao" label="Descrição" />
          <Input
            id="descricao"
            type="textarea"
            value={newTask.description as string}
            onChange={({ target }) => setNewTask({ ...newTask, description: target.value })}
          />
        </InputContainer>
        <InputContainer className="mt-[2rem]">
          <InputLabel label="Prioridade" />
          <div
            onClick={() => setAddPriority((v) => !v)}
            className="w-full p-[.8rem] rounded-[.6rem] border outline-none bg-zinc-100 border-zinc-300  mt-[.4rem] text-[1.4rem] duration-300 ease-in-out dark:bg-zinc-900 dark:border-zinc-800 flex flex-wrap items-center gap-[1rem] cursor-pointer relative"
          >
            <Popup when={addPriority} className="absolute left-0 top-[110%] flex-col flex z-[1] w-[60%]">
              {priorityOptions.map((p, i) => (
                <button
                  type="button"
                  onClick={() => setNewTask({...newTask, priority:p})}
                  className="text-start p-[.8rem] hover:bg-zinc-800 rounded-2 duration-200 flex items-center gap-[.6rem]"
                  key={i}
                >
                  <Check
                    className={clsx("size-[1.6rem] font-semibold", {
                      "opacity-0": newTask.priority !== p,
                      "opacity-100": newTask.priority === p,
                    })}
                  />
                  {p}
                </button>
              ))}
            </Popup>
            <span className="text-[1.4rem] block p-[.6rem]">{!newTask.priority ? "Selecionar prioridade" : newTask.priority}</span>
            <ChevronDown className="size-[1.6rem] ml-auto" />
          </div>
        </InputContainer>
        <div className="mt-[2rem] flex flex-col ">
          <label className="text-[2rem] font-semibold text-zinc-900 dark:text-zinc-100 block mb-[.4rem]">
            Data de término
          </label>
          <DatePickerDemo object={newTask} date={newTask.endsAt} setDate={setNewTask} />
        </div>
        <InputContainer className="mt-[2rem]">
          <InputLabel label="Responsáveis" />
          <div
            onClick={() => setAddResponsible((v) => !v)}
            className="w-full p-[.8rem] rounded-[.6rem] border outline-none bg-zinc-100 border-zinc-300  mt-[.4rem] text-[1.4rem] duration-300 ease-in-out dark:bg-zinc-900 dark:border-zinc-800 flex flex-wrap items-center gap-[1rem] cursor-pointer relative"
          >
            {newTask.users?.map((r, i) => (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setNewTask({...newTask, users: newTask.users.filter((res) => res !== r)});
                }}
                className="dark:bg-zinc-800/70 dark:text-zinc-100 p-[.4rem] px-[.8rem] rounded-full font-semibold flex items-center gap-[.6rem]"
                key={i}
              >
                <Image src={r.avatar} width={32} height={32} alt="" className="rounded-full" />
                <span>{r.name}</span>
                <X className="size-[1.6rem]" />
              </button>
            ))}
            <AnimatePresence>
              <Show when={addResponsible}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col p-[.8rem] bg-zinc-900 border border-zinc-800 rounded-2 absolute w-[60%] left-0 top-[110%] selection:bg-transparent"
                >
                  {project?.members.map((r) => (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!newTask.users.some((res) => res.id === r.id)) {
                          setNewTask({...newTask, users:[...newTask.users, r ]});
                        } else {
                          setNewTask({...newTask, users:newTask.users.filter((res) => res.id !== r.id)});
                        }
                        setAddResponsible(false);
                      }}
                      key={r.id}
                      className="flex text-start gap-[1rem] p-[.8rem] hover:bg-zinc-800 rounded-2"
                    >
                      <Image src={r.avatar} width={32} height={32} alt="" className="rounded-full object-cover" />
                      <div>
                        <span className="text-[1.5rem] font-semibold">{r.name}</span>
                        <p className="mt-[.4rem] text-zinc-400 text-[1.2rem]">{r.email}</p>
                      </div>
                      <Check
                        className={clsx("self-center size-[1.8rem] ml-auto", {
                          "opacity-0 ": !newTask.users.some((res) => res.id === r.id),
                          "opacity-100 ": newTask.users.some((res) => res.id === r.id),
                        })}
                      />
                    </button>
                  ))}
                </motion.div>
              </Show>
            </AnimatePresence>
            {newTask.users.length === 0 && <span className="text-[1.4rem] block p-[.6rem]">Selecionar responsáveis</span>}
            <ChevronDown className="size-[1.6rem] ml-auto" />
          </div>
        </InputContainer>
        <InputContainer className="mt-[2rem]">
          <InputLabel label="Tags" />
          <div className="w-full p-[.6rem] rounded-[.6rem] border outline-none bg-zinc-100 border-zinc-300  mt-[.4rem] text-[1.4rem] duration-300 ease-in-out dark:bg-zinc-900 dark:border-zinc-800 flex flex-wrap gap-[1rem]">
            {newTask.tags?.map((t, i) => (
              <button
                type="button"
                onClick={() => setNewTask({...newTask, tags:newTask.tags.filter((tag) => tag !== t)})}
                className="dark:bg-zinc-100 dark:text-zinc-900 p-[.8rem] px-[1rem] rounded-full font-semibold flex items-center gap-[.6rem]"
                key={i}
              >
                {t}
                <X className="size-[1.6rem]" />
              </button>
            ))}
            <Show when={createNewTag}>
              <div className="max-w-[25%]">
                <input
                  type="text"
                  value={newTag}
                  ref={newTagInput}
                  onKeyDown={(e) => {
                    const {key} = e
                    if (key === "Enter") {
                      e.preventDefault()
                      setCreateNewTag(false);
                      setNewTask({...newTask, tags:[...newTask.tags, newTag]})
                      setNewTag("");
                    }
                    if (key === "Escape") {
                      setCreateNewTag(false);
                      setNewTag("");
                    }
                  }}
                  onChange={({ target }) => setNewTag(target.value)}
                  className="dark:bg-zinc-100 w-full dark:text-zinc-900 p-[.7rem] px-[1rem] rounded-full font-semibold items-center gap-[.6rem]  "
                />
              </div>
            </Show>
            <button
              type="button"
              onClick={() => setCreateNewTag(true)}
              className="p-[.8rem] px-[1rem] rounded-full flex items-center gap-[.6rem]"
            >
              <PlusCircle className="size-[1.6rem]" />
              Adicionar
            </button>
          </div>
          {/* <Input
          id="descricao"
          type="text"
          value={newTask.description as string}
          onChange={({ target }) => setNewTask({ ...newTask, description: target.value })}
        /> */}
        </InputContainer>
        <button
          type="submit"
          className="mt-[1.2rem] dark:bg-zinc-100 dark:text-zinc-900 text-[1.4rem] font-semibold p-[1rem] rounded-2"
        >
          Criar tarefa
        </button>
      </form>
    </Modal>
  );
};

export default NewTaskModal;
