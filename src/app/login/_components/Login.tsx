"use client";
import React, { FormEvent, useState } from "react";
import Header from "../../_components/Header";
import { LayoutDashboard, Loader2 } from "lucide-react";
import { Input, InputContainer, InputLabel } from "@/components/Input";
import { Message as MessageInterface } from "@/types/Message";
import Message from "@/components/Message";
import Show from "@/components/Show";
import Cookies from "js-cookie";
import useUserStore from "@/store/User";
import {useRouter} from "next/navigation"
const LoginComp = () => {
  const { setUser, setSigned } = useUserStore();
  const router= useRouter()
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<MessageInterface | null>(null);
  const [emailVerified, setEmailVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [userHaveTwoStepsAuth, setUserHaveTwoStepsAuth] = useState(false);
  async function loginUser(e: FormEvent) {
    e.preventDefault();
    if (email && !password) {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:3000/confirmar-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        });
        setEmailVerified(true);
        if (!response.ok) {
          setMessage({
            title: "Email incorreto",
            text: "Seu email está incorreto, verifique ele antes de tentar novamente.",
            type: "error",
          });
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    } else if (email && password) {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:3000/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });

        const data: {
          user: {
            id: string;
            name: string;
            email: string;
            avatar: string;
            twoStepsAuth: string;
          };
          token: string;
        } = await response.json();
        if (!data.user.twoStepsAuth) {
          setUser(data.user);
          setSigned(true);
          Cookies.set("authTokenDevPlannr", data.token, {
            expires: 7,
          });
        } else {
          setUserHaveTwoStepsAuth(true);
        }
        if (!response.ok) {
          setMessage({
            title: "Email incorreto",
            text: "Seu email está incorreto, verifique ele antes de tentar novamente.",
            type: "error",
          });
        }
        setMessage({
          title: "Login realizado com sucesso",
          text: "Você será redirecionado em instantes para o seu plannr...",
          type: "success",
        });
        setTimeout(()=> {
            router.push(`/${data.user.id}/projetos`)
        }, 4000)
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }
  }
  return (
    <>
      <Header />
      <main>
        <div className=" max-w-[25%] mx-auto mt-[20vh]">
          <div className="">
            <LayoutDashboard className="size-[6rem] mx-auto " />
            <h1 className="text-[3rem] font-semibold text-center">Entre na sua conta</h1>
          </div>
          <form onSubmit={(e) => loginUser(e)}>
            <InputContainer className="mt-[2rem] flex flex-col">
              <InputLabel id="login" label="Email" />
              <Input value={email} id="login" type="email" onChange={({ target }) => setEmail(target.value)} />
            </InputContainer>
            <Show when={emailVerified}>
              <InputContainer className="mt-[2rem] flex flex-col">
                <InputLabel id="senha" label="Senha" />
                <Input value={password} id="senha" type="password" onChange={({ target }) => setPassword(target.value)} />
              </InputContainer>
            </Show>
            <button
              disabled={isLoading}
              className="mt-[1.2rem] w-full text-[1.6rem] font-semibold bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 p-[1.2rem] rounded-2 disabled:opacity-70"
            >
              {isLoading ? <Loader2 className="animate-spin mx-auto size-[1.8rem]" /> : "Fazer login"}
            </button>
          </form>
        </div>
      </main>
      <Message message={message} setMessage={setMessage} {...message} />
    </>
  );
};

export default LoginComp;
