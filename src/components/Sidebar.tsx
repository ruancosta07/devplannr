"use client";
import useUserStore from "@/store/User";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { ChevronDown, HomeIcon, LogOut, Settings, Trash2 } from "lucide-react";
import Show from "./Show";
import Image from "next/image";
import Link from "next/link";
const Sidebar = ({ plannrs }: { plannrs: { id: string; name: string }[] }) => {
  const [sidebarActive, setSidebarActive] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const { user } = useUserStore();

  useEffect(() => {
    function activeSidebbarOnMouseMove(e: MouseEvent) {
      if (e.pageX <= (window.innerWidth / 4) / 2) {
        setSidebarActive(true);
      } else {
        setSidebarActive(false);
      }
    }
    window.addEventListener("mousemove", activeSidebbarOnMouseMove);
    return () => window.removeEventListener("mousemove", activeSidebbarOnMouseMove);
  }, []);
  return (
    <>
      <AnimatePresence>
        {sidebarActive && (
          <motion.aside
            initial={{ left: "-300px" }}
            animate={{ left: "0" }}
            exit={{ left: "-300px" }}
            className={clsx(
              "h-fit min-w-[15vw] top-[15%]  fixed p-[1rem] bg-zinc-900 rounded-2 border dark:border-zinc-800"
            )}
          >
            <Link href={"/"} className="flex items-center gap-[1rem] text-[1.4rem] p-[.8rem] hover:dark:bg-zinc-800 rounded-2 duration-200">
              <HomeIcon strokeWidth={1.5} className="size-[1.8rem]" />
              Início
            </Link>
            <div className="border-y py-[1rem] my-[1rem] dark:border-zinc-800  text-[1.2rem] font-medium">
              <button
                onClick={() => setShowProjects(!showProjects)}
                className="p-[.8rem] flex items-center gap-[1rem] hover:bg-zinc-800 w-full rounded-2"
              >
                <ChevronDown
                  className={clsx("size-[1.4rem] duration-200", {
                    "-rotate-90": !showProjects,
                  })}
                />
                Projetos
              </button>
              <Show when={showProjects}>
              <div className="plannrs-sidebar relative">
                {plannrs.map((p) => (
                  <Link className="p-[.8rem] block project-sidebar relative hover:bg-zinc-800 ml-[2rem] rounded-2 duration-200" key={p.id} href={p.id}>
                    {p.name}
                  </Link>
                ))}
              </div>
              </Show>
            </div>
            <button className="flex w-full items-center gap-[1rem] text-[1.4rem] p-[.8rem] hover:dark:bg-zinc-800 rounded-2 duration-200">
              <Settings strokeWidth={1.5} className="size-[1.8rem]" />
              Configurações
            </button>
            <button className="flex w-full items-center gap-[1rem] text-[1.4rem] p-[.8rem] hover:dark:bg-zinc-800 rounded-2 duration-200">
              <Trash2 strokeWidth={1.5} className="size-[1.8rem]" />
              Lixeira
            </button>
            <button className="flex w-full items-center gap-[1rem] text-[1.4rem] p-[.8rem] hover:dark:bg-zinc-800 rounded-2 duration-200">
              <LogOut strokeWidth={1.5} className="size-[1.8rem]" />
              Sair
            </button>
            <div className="border-t flex cursor-pointer gap-[1rem] py-[1rem] mt-[1rem] dark:border-zinc-800  text-[1.2rem] font-medium">
                <Show when={user?.avatar as string}>
                  <Image width={200} height={200} src={user?.avatar as string} alt="Avatar" className="size-[4rem] rounded-full"/>
                </Show>
                <Show when={!user?.avatar}>
                  <div className="size-[4rem] flex items-center justify-center bloc rounded-full border dark:border-zinc-800">
                    <span className="text-[1.8rem] font-semibold">
                      {user?.name[0].toUpperCase()}
                    </span>
                  </div>
                </Show>
                <div className="mt-[.4rem] flex flex-col gap-[.4rem]">
                <span className=" text-[1.4rem]">{user?.name}</span>
                <p className="dark:text-zinc-400">{user?.email}</p>
                </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
      {/* <UserSigned /> */}
    </>
  );
};

export default Sidebar;
