"use client";
import { PlannrInterface, TasksInterface } from "@/types/Project";
import React, { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import Loader from "@/components/Loader";
import Show from "@/components/Show";
import { CalendarDays, FileIcon, FilePlus2Icon, Filter, LayoutGrid, PenSquare, Table, Users } from "lucide-react";
import Image from "next/image";
import clsx from "clsx";
import { motion } from "framer-motion";
import Task from "./Task";
import { io, Socket } from "socket.io-client";
import useUserStore from "@/store/User";
import NewTaskModal from "./NewTaskModal";
import Popup from "@/components/Popup";
import dayjsUtils from "@/lib/dayjs";

interface NewTask {
  name: string;
  description: string;
  status: string;
  priority: string;
  users: string[];
  tags: string[];
  endsAt: Date;
}

const ProjectComp = ({ projectId }: { projectId: string }) => {
  const { user } = useUserStore();
  const [project, setProject] = useState<PlannrInterface | null>(null);
  const [imageOptions, setImageOptions] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const regex = /https?:\/\/(www\.)?[\w\-]+(\.[\w\-]+)+([\/\w\-._~:?#[\]@!$&'()*+,;=]*)?/;
  const sections = [
    { label: "Quadro", icon: <LayoutGrid className="size-[1.8rem]" /> },
    { label: "Tabela", icon: <Table className="size-[1.8rem]" /> },
    { label: "Usuários", icon: <Users className="size-[1.8rem]" /> },
  ];
  const [activeSection, setActiveSection] = useState("Quadro");
  const [tasks, setTasks] = useState<TasksInterface[] | null>(null);
  const [activeTask, setActiveTask] = useState<TasksInterface | null>(null);
  const [createNewTask, setCreateNewTask] = useState(false);
  const socket = useRef<Socket>(null);
  const [filterOptions, setFilterOptions] = useState({
    showFilter: false,
    filterBy: "",
  });

  useEffect(() => {
    if (user) {
      socket.current = io("http://localhost:3000", {
        query: {
          userId: user?.id,
        },
      });
      socket.current.on("connect", () => {
        socket.current?.emit("joinPlannr", projectId);
      });
      socket.current.on("createTask", (task) => {
        setTasks(task);
      });
    }
  }, [user, projectId]);

  useEffect(() => {
    async function loadProject() {
      try {
        const response = await fetch(`http://localhost:3000/${projectId}/unico-plannr`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${Cookies.get("authTokenDevPlannr")}`,
          },
          cache: "no-store",
        });
        const data = await response.json();
        setProject(data);
      } catch (err) {
        console.log(err);
      }
    }
    loadProject();
  }, [setProject, projectId]);

  useEffect(() => {
    async function loadTasks() {
      try {
        const response = await fetch(`http://localhost:3000/${projectId}/tasks`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("authTokenDevPlannr")}`,
          },
        });
        const data = await response.json();
        setTasks(data);
      } catch (err) {
        console.log(err);
      }
    }
    loadTasks();
  }, [projectId]);

  const priotities = ["Muito alta", "Alta", "Média", "Baixa", "Nenhum"];

  function priorityReturn(value: "Muito alta" | "Alta" | "Média" | "Baixa") {
    if (value === "Muito alta") {
      return (
        <span className="block p-[.6rem] rounded-full px-[1rem] text-[1.2rem] bg-violet-800 text-zinc-100 font-semibold">
          {value}
        </span>
      );
    } else if (value === "Alta") {
      return (
        <span className="block p-[.6rem] rounded-full px-[1rem] text-[1.2rem] bg-red-800 text-zinc-100 font-semibold">
          {value}
        </span>
      );
    } else if (value === "Média") {
      return (
        <span className="block p-[.6rem] rounded-full px-[1rem] text-[1.2rem] bg-yellow-200 text-yellow-900 font-semibold">
          {value}
        </span>
      );
    } else {
      return (
        <span className="block p-[.6rem] rounded-full px-[1rem] text-[1.2rem] bg-zinc-700 text-zinc-100 font-semibold">
          {value}
        </span>
      );
    }
  }

  return (
    <>
      <main>
        <div className="max-w-[60%] mx-auto py-[3rem]">
          <Show when={!regex.test(project?.banner as string)}>
            <motion.div whileHover={"changeBanner"} className={`h-[30vh] w-full rounded-2 relative ${project?.banner}`}>
              <div className=" bg-gradient-to-b from-transparent via-zinc-900/30 to-zinc-900/70 p-[2rem] absolute bottom-0 flex items-center gap-[1rem] w-full">
                <Show when={!project?.logo}>
                  <FileIcon className="size-[3.6rem]" />
                </Show>
                <Show when={project?.logo as string}>
                  <Image
                    src={project?.logo as string}
                    alt="Logo do projeto"
                    width={36}
                    height={36}
                    className="size-[3.6rem]"
                  />
                </Show>
                <h1 className="text-[3rem] font-semibold">{project?.name}</h1>
              </div>
            </motion.div>
          </Show>
          <Show when={regex.test(project?.banner as string)}>
            <motion.div
              whileHover={"changeBanner"}
              onContextMenu={() => setImageOptions(true)}
              className={`h-[30vh] w-full rounded-4 relative overflow-y-clip`}
            >
              <Show when={imageOptions}>
                <div className="absolute z-[2] right-[6rem] top-2/4">
                  <button onClick={() => setIsDragging(true)} className="bg-zinc-900 p-[.8rem] rounded-2 text-[1.2rem]">
                    Alterar posição
                  </button>
                </div>
              </Show>
              <Image
                src={project?.banner as string}
                width={600}
                height={600}
                alt=""
                className="w-full object-center top-2/4 -translate-y-2/4 relative rounded-2"
              />
              <div className=" bg-gradient-to-b from-transparent via-zinc-900/30 to-zinc-900/70 p-[2rem] absolute bottom-0 flex items-center gap-[1rem] w-full rdd4">
                <Show when={!project?.logo}>
                  <FileIcon className="size-[3.6rem]" />
                </Show>
                <Show when={project?.logo as string}>
                  <Image
                    src={project?.logo as string}
                    alt="Logo do projeto"
                    width={36}
                    height={36}
                    className="size-[3.6rem]"
                  />
                </Show>
                <h1 className="text-[3rem] font-semibold">{project?.name}</h1>
                <motion.button
                  initial={{ opacity: 0, scale: 0.7, y: 8 }}
                  variants={{ changeBanner: { opacity: 1, scale: 1, y: 0 } }}
                  className="ml-auto"
                >
                  <PenSquare />
                </motion.button>
              </div>
            </motion.div>
          </Show>
          <div className="mt-[1.2rem] flex gap-[1rem]">
            {sections.map((s, i) => (
              <button
                onClick={() => setActiveSection(s.label)}
                className={clsx(
                  "text-[1.4rem] font-semibold p-[.8rem] rounded-2 duration-200 flex items-center gap-[.6rem]",
                  {
                    "bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900": activeSection === s.label,
                    "bg-zinc-700 text-zinc-300 dark:bg-zinc-400 dark:text-zinc-900": activeSection !== s.label,
                  }
                )}
                key={i}
              >
                {s.icon}
                {s.label}
              </button>
            ))}
          </div>
          <Show when={activeSection === "Quadro"}>
            <section className="grid grid-cols-3 gap-[2rem] mt-[2rem]">
              <div className="col-span-full flex items-center ml-auto">
                <div className="relative">
                  <button
                    onClick={() => setFilterOptions((v) => ({ ...v, showFilter: !v.showFilter }))}
                    className="flex items-center gap-[.6rem] text-[1.4rem] mr-[1rem] bg-zinc-800/70 p-[.8rem] rounded-2 font-semibold"
                  >
                    <Filter className="size-[1.8rem] dark:text-zinc-300" />
                    Filtrar por
                  </button>
                  <Popup
                    when={filterOptions.showFilter}
                    className="absolute left-0 top-[110%] min-w-[200%] text-[1.4rem] flex flex-col z-[2] p-[1rem]"
                  >
                    <span className="mb-[.4rem] font-semibold text-[1.2rem] text-zinc-400">Prioridade</span>
                    {priotities.map((p, i) => (
                      <button key={i} className="p-[.8rem] hover:bg-zinc-800 rounded-2">
                        <label className="flex gap-[.6rem] cursor-pointer">
                          <input
                            type="radio"
                            checked={p === filterOptions.filterBy}
                            value={p}
                            onChange={() => {
                              setFilterOptions({ filterBy: p, showFilter: false });
                            }}
                            name="prioridade"
                            className="accent-zinc-100"
                          />
                          {p}
                        </label>
                      </button>
                    ))}
                  </Popup>
                </div>
                <button
                  onClick={() => setCreateNewTask(true)}
                  className=" w-fit dark:bg-zinc-100 dark:text-zinc-900 p-[.8rem] text-[1.4rem] font-semibold rounded-2 flex items-center gap-[.6rem]"
                >
                  <FilePlus2Icon className="size-[1.6rem]" />
                  Criar tarefa
                </button>
              </div>
              {tasks
                ?.filter((t) => {
                  if (filterOptions.filterBy && filterOptions.filterBy !== "Nenhum") {
                    return t.priority === filterOptions.filterBy;
                  } else if (!filterOptions.filterBy || filterOptions.filterBy === "Nenhum") {
                    return t;
                  }
                })
                .map((t) => (
                  <div
                    onClick={() => setActiveTask(t)}
                    key={t.id}
                    className="p-[1.4rem] cursor-pointer border dark:bg-zinc-900 dark:border-zinc-800 rounded-1"
                  >
                    <div className="flex gap-[1rem] mb-[.8rem]">
                      {priorityReturn(t.priority as "Muito alta" | "Alta" | "Média" | "Baixa")}
                      {t.tags?.slice(0,2).map((t, i) => (
                        <span
                          key={i}
                          className="block p-[.6rem] rounded-full px-[1rem] text-[1.2rem] bg-zinc-100 text-zinc-900 font-semibold"
                        >
                          {t}
                        </span>
                      ))}
                      {t.tags?.length && t.tags.length > 2 &&  <span
                          className="block p-[.6rem] rounded-full px-[1rem] text-[1.2rem] bg-zinc-100 text-zinc-900 font-semibold"
                        >
                          Mais {t.tags.length - 2} tag
                        </span>}
                    </div>
                    <h1 className="font-semibold text-[2rem] mb-[.4rem]">{t.name}</h1>
                    <p className="text-[1.4rem] leading-[1.3] text-zinc-300 border-b-2 pb-[.4rem] dark:border-zinc-800">
                      {t.description.length >= 40 ? t.description.slice(0, 40) + "..." : t.description}
                    </p>
                    <div className="flex mt-[1.2rem]">
                      {t.users.map((u, i) => (
                        <Image
                          style={{ right: i > 0 ? 12 : 0 }}
                          key={u.id}
                          src={u.avatar}
                          width={36}
                          height={36}
                          alt=""
                          className={`rounded-full relative border dark:border-zinc-800`}
                        />
                      ))}
                    </div>
                    <div className="flex gap-[.6rem] mt-[1.2rem] items-center">
                      <CalendarDays className="size-[1.8rem]"/>
                      <span className="text-zinc-400  block text-[1.2rem]">
                        {dayjsUtils(t.expiresAt).format("dddd, DD [de] MMMM [de] YYYY ")}
                      </span>
                    </div>
                  </div>
                ))}
            </section>
          </Show>
        </div>
      </main>
      <Show when={activeTask != null}>
        <Task activeTask={activeTask} setActiveTask={setActiveTask} socket={socket} />
      </Show>
      <Show when={!project}>
        <Loader />
      </Show>
      <Show when={createNewTask}>
        <NewTaskModal
          socket={socket}
          projectId={projectId}
          project={project}
          createNewTask={createNewTask}
          setCreateNewTask={setCreateNewTask}
        />
      </Show>
    </>
  );
};

export default ProjectComp;
