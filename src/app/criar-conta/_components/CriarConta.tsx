"use client";
import React, { FormEvent, useState } from "react";
import Header from "../../_components/Header";
import { CheckCircle2, Eye, EyeOff, LayoutDashboard, Loader2, XCircle } from "lucide-react";
import { Input, InputContainer, InputLabel } from "@/components/Input";
import { Message as MessageInterface } from "@/types/Message";
import Message from "@/components/Message";
import Show from "@/components/Show";
import useUserStore from "@/store/User";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie"
interface ErrorMessage {
  length?: boolean;
  specialChar?: boolean;
  upperCase?: boolean;
}

interface Response {
  id:string;
  name:string;
  email:string;
}



const CriarContaComp = () => {
  const {setUser, setSigned} = useUserStore()
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [seePassword, setSeePassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<MessageInterface | null>(null);
  const router = useRouter()
  const [errorPassword, setErrorPassword] = useState<ErrorMessage>({
    length: true,
    specialChar: true,
    upperCase: true,
  });


  async function loginUser(e: FormEvent) {
    e.preventDefault();
    if (email && name && Object.values(errorPassword).every((v)=> !v)) {
      setIsLoading(true);
      try {
       const response = await fetch("http://localhost:3000/criar-conta", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            name,
            password
          }),
        });
        const data:{
            user:Response,
            token:string;
        } = await response.json()
        setUser(data.user)
        setSigned(true)
        setMessage({
          title: "Conta criada com sucesso",
          text: "Você será redirecionado em instantes para seu plannr...",
          type: "success",
        });
        Cookies.set("authTokenDevPlannr", data.token, {
            expires: 7
        })
        setTimeout(()=> {
            router.push(`/${data.user.id}/projetos`)
        }, 4000)
      } catch (err) {
        console.log(err);
        setMessage({
          title: "Erro ao criar conta",
          text: "Seu email ou senha estão incorretos, verifique novamente antes de tentar entrar.",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    }
  }

  function changeSeePassword(value: boolean) {
    if (value) {
      setSeePassword(true);
    } else {
      setSeePassword(false);
    }
  }

  function verifyPassword(value: string) {
    const regexSpecialChar = /[^\w\s]/;
    const regexUppercase = /[A-Z]/;
    if (value.length >= 8) {
      setErrorPassword((v) => ({ ...v, length: false }));
    } else {
      setErrorPassword((v) => ({ ...v, length: true }));
    }
    if (regexUppercase.test(value)) {
      setErrorPassword((v) => ({ ...v, upperCase: false }));
    } else {
      setErrorPassword((v) => ({ ...v, upperCase: true }));
    }
    if (regexSpecialChar.test(value)) {
      setErrorPassword((v) => ({ ...v, specialChar: false }));
    } else {
      setErrorPassword((v) => ({ ...v, specialChar: true }));
    }
  }

  return (
    <>
      <Header />
      <main>
        <div className=" max-w-[25%] mx-auto mt-[15vh]">
          <div className="">
            <LayoutDashboard className="size-[6rem] mx-auto " />
            <h1 className="text-[3rem] font-semibold text-center">Crie na sua conta</h1>
          </div>
          <form onSubmit={(e) => loginUser(e)}>
            <InputContainer className="mt-[2rem] flex flex-col">
              <InputLabel id="nome" label="Nome" />
              <Input value={name} id="nome" type="text" onChange={({ target }) => setName(target.value)} />
            </InputContainer>
            <InputContainer className="mt-[2rem] flex flex-col">
              <InputLabel id="login" label="Email" />
              <Input value={email} id="login" type="email" onChange={({ target }) => setEmail(target.value)} />
            </InputContainer>
            <InputContainer className="mt-[2rem] flex flex-col">
              <InputLabel id="senha" label="Senha" />
              <div className="relative">
                <Input
                  value={password}
                  id="senha"
                  type={seePassword ? "text" : "password"}
                  onChange={({ target }) => {
                    setPassword(target.value);
                    verifyPassword(target.value);
                  }}
                />

                <Show when={seePassword}>
                  <button
                    onClick={() => changeSeePassword(!seePassword)}
                    type="button"
                    className="absolute right-4 top-2/4 -translate-y-2/4 text-zinc-800 dark:text-zinc-400"
                  >
                    <EyeOff />
                  </button>
                </Show>
                <Show when={!seePassword}>
                  <button
                    onClick={() => changeSeePassword(!seePassword)}
                    type="button"
                    className="absolute right-4 top-2/4 -translate-y-2/4 text-zinc-800 dark:text-zinc-400"
                  >
                    <Eye />
                  </button>
                </Show>
              </div>
              <div className="mt-[1.2rem] grid grid-cols-2 gap-y-[1rem]">
                <p className="flex items-center gap-[.6rem] text-[1.4rem] font-medium">
                  <Show when={!errorPassword.length}>
                    <CheckCircle2 className="size-[1.8rem] text-green-500" />
                  </Show>
                  <Show when={errorPassword.length === true}>
                    <XCircle className="size-[1.8rem] text-red-500" />
                  </Show>
                  Mínimo 8 caracteres
                </p>
                <p className="flex items-center gap-[.6rem] text-[1.4rem] font-medium">
                  <Show when={!errorPassword.upperCase}>
                    <CheckCircle2 className="size-[1.8rem] text-green-500" />
                  </Show>
                  <Show when={errorPassword.upperCase === true}>
                    <XCircle className="size-[1.8rem] text-red-500" />
                  </Show>
                  Uma letra maiuscula
                </p>
                <p className="flex items-center gap-[.6rem] text-[1.4rem] font-medium">
                  <Show when={!errorPassword.specialChar}>
                    <CheckCircle2 className="size-[1.8rem] text-green-500" />
                  </Show>
                  <Show when={errorPassword.specialChar === true}>
                    <XCircle className="size-[1.8rem] text-red-500" />
                  </Show>
                  Um caractere especial
                </p>
              </div>
            </InputContainer>
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

export default CriarContaComp;
