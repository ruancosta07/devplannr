"use client";

import useUserStore from "@/store/User";
import { FileIcon, HistoryIcon } from "lucide-react";
import { PlannrInterface } from "@/types/Project";
import dayjsUtils from "@/lib/dayjs";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import Modal from "@/components/Modal";
import { Input, InputContainer, InputLabel } from "@/components/Input";
import Show from "@/components/Show";

const Plannrs = ({ plannrs }: { plannrs: PlannrInterface[] }) => {
  const { user } = useUserStore();
  const [createPlannr, setCreatePlannr] = useState(false)
  const [newPlannr, setNewPlannr] = useState("")
  const regex = /https?:\/\/(www\.)?[\w\-]+(\.[\w\-]+)+([\/\w\-._~:?#[\]@!$&'()*+,;=]*)?/;
  // async function createNewPlannr(){
  //   try {
  //     const response = await fetch("http://localhost:3000/criar-plannr", {
  //       body: JSON.stringify({
  //         name:newPlannr
  //       })
  //     })
  //   } catch (err) {
  //     console.log(err)
  //   }
  // }

  return (
    <>
      <main>
        <div className="max-w-[60%] mx-auto mt-[10vh]">
          <h1 className="text-[3rem] font-medium">Olá, {user?.name}</h1>
          <section className="mt-[2rem]">
            <div className="flex items-center gap-[.6rem] dark:text-zinc-400">
              <HistoryIcon />
              <span className="text-[1.4rem] font-semibold">Acessados recentemente</span>
            </div>
            <div className="flex gap-[1rem] mt-[1.2rem]">
              <button
              onClick={()=> setCreatePlannr(true)}
                className="flex items-start w-[180px] rounded-[.5rem] bg-zinc-900 flex-col justify-start relative z-[1]"
              >
                <div className={`h-[50px] w-full rounded-[.5rem_.5rem_0_0] bg-gradient-to-tr from-zinc-800 to-zinc-900`}></div>
                <div className="flex flex-col items-start p-[1.2rem] py-[1.6rem] rounded-[0_0_.5rem_.5rem] bg-zinc-900">
                  <div className="text-zinc-100 shadow-xl mb-[.8rem]">
                    <FileIcon />
                  </div>
                  <span className="text-zinc-100 text-[1.8rem] font-semibold break-words break-all leading-[1.3]">
                    Criar plannr
                  </span>
                </div>
              </button>
              {plannrs
                ?.sort((a, b) => dayjsUtils(b.accessedIn).diff(a.accessedIn))
                .map((p, i) => (
                  <Link
                    href={`/projeto/${p.id}`}
                    key={i}
                    className="flex items-start w-[180px] rounded-[.5rem] bg-zinc-900 flex-col justify-start relative z-[1]"
                  >
                    <Show when={!regex.test(p.banner)}>
                    <div className={`h-[50px] w-full rounded-[.5rem_.5rem_0_0] ${p.banner}`}></div>
                    </Show>
                    <Show when={regex.test(p.banner)}>
                    <div className={`h-[50px] w-full rounded-[.5rem_.5rem_0_0]`}>
                      <Image src={p.banner as string} width={180} height={50} alt=""/>
                    </div>
                    </Show>
                    <div className="flex flex-col items-start p-[1.2rem] py-[1.6rem] rounded-[0_0_.5rem_.5rem] bg-zinc-900 w-full">
                      <div className="text-zinc-100 shadow-xl mb-[.8rem]">
                        {p.logo ? <Image src={p.logo} width={30} height={30} className="w-[3rem] h-[3rem]" alt="" /> : <FileIcon />}
                      </div>
                      <span className="text-zinc-100 text-[1.8rem] font-semibold break-words break-all leading-[1.3]">
                        {p.name.length >= 12 ? p.name.slice(0, 12) + "..." : p.name}
                      </span>
                    </div>
                  </Link>
                ))}
            </div>
          </section>
          <section>
          </section>
        </div>
      </main>
      <Modal className="p-[2rem] h-fit" modal={createPlannr} setModal={setCreatePlannr}>
        <h1 className="text-[2.4rem] font-semibold">Criar novo plannr</h1>
        <InputContainer className="mt-[2rem]">
        <InputLabel id="nome" label="Nome"/>
        <Input type="text" id="nome" value={newPlannr} onChange={({target})=> setNewPlannr(target.value)}/>
        </InputContainer>
        <button className="bg-zinc-100 text-zinc-900 p-[1rem] text-[1.4rem] font-semibold mt-[1.2rem] rounded-2">Criar plannr</button>
      </Modal>
    </>
  );
};

export default Plannrs;
