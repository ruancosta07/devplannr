"use client";
import HeroVideoDialog from "@/components/ui/hero-video-dialog";
import gsap from "gsap";
import { LayoutDashboard } from "lucide-react";
import React, { useEffect } from "react";

const Main = () => {
  useEffect(() => {
    gsap.fromTo(
      "[data-animate='main']",
      { opacity: 0, y: 32 },
      { opacity: 1, y: 0, stagger: 0.2, duration: 0.7 }
    );
  }, []);
  return (
    <main className="mt-[15vh]">
      <div className="container-width">
        <h1
          data-animate="main"
          className="text-[6rem] text-center font-bold max-w-[60%] mx-auto leading-[1.15]"
        >
          Gerenciar seus projetos pessoais nunca foi tão fácil
        </h1>
        <p
          data-animate="main"
          className="text-[1.8rem] mx-auto max-w-[40%] text-center leading-[1.3]"
        >
          Deixe o gerenciamento dos seus projetos mais fácil e foque no que
          realmente importa:{" "}
          <span className="text-green-500">{"{o código}"}</span>
        </p>
        <button
          data-animate="main"
          className="mx-auto flex items-center gap-[.6rem] text-[1.4rem] mt-[1.2rem] bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 p-[.8rem] rounded-[.6rem] font-semibold"
        >
          <LayoutDashboard className="w-[2rem] h-[2rem]" />
          Comece agora mesmo
        </button>
        <HeroVideoDialog
          data-animate="main"
          thumbnailSrc="/banner-devplannr.webp"
          videoSrc="/presentation.mp4"
          className="max-w-[60%] mx-auto mt-[6rem]"
        />
      </div>
    </main>
  );
};

export default Main;
