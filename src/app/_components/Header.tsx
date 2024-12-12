"use client";
import Show from "@/components/Show";
import UserSigned from "@/components/UserSigned";
import useUserStore from "@/store/User";
import { LayoutDashboard, MoonStar, SunDim } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import React from "react";

const Header = () => {
  const { theme, setTheme, } = useTheme();
  const {signed, user} = useUserStore()
  return (
    <header>
      <div className="container-width flex items-center py-[3rem]">
        <Link
          href={"/"}
          className="flex text-zinc-900 dark:text-zinc-100 items-center gap-[.6rem] text-[2.4rem] font-semibold"
        >
          <LayoutDashboard className="w-[2.8rem] h-[2.8rem]"/>
          DevPlannr
        </Link>
        <nav className="ml-auto flex gap-[1rem] items-center">
         <Show when={!signed}>
         <Link
            href={"/login"}
            className="bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100 text-[1.4rem] border dark:border-zinc-800 p-[.8rem] px-[1rem] rounded-[.5rem] font-semibold"
          >
            Login
          </Link>
          <Link
            href={"/criar-conta"}
            className="bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 text-[1.4rem] border border-transparent p-[.8rem] px-[1rem] rounded-[.5rem] font-semibold"
          >
            Criar conta
          </Link>
         </Show>
         <Show when={signed}>
         <Link
            href={`/${user?.id as string}/projetos`}
            className="bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 text-[1.4rem] border border-transparent p-[.8rem] px-[1rem] rounded-[.5rem] font-semibold"
          >
            Meu plannr
          </Link>
         </Show>
          <div>
            <Show when={theme === "dark"}>
              <button
                onClick={() => setTheme("light")}
                className="hover:dark:bg-zinc-700/30 p-[.8rem] rounded-[.6rem]"
              >
                <MoonStar className="w-[2rem] h-[2rem]" />
              </button>
            </Show>
            <Show when={theme === "light"}>
              <button
                onClick={() => setTheme("dark")}
                className="hover:bg-zinc-300/30 p-[.8rem] rounded-[.6rem]"
              >
                <SunDim className="w-[2rem] h-[2rem]" />
              </button>
            </Show>
          </div>
        </nav>
      </div>
      <UserSigned/>
    </header>
  );
};

export default Header;
