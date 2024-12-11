"use client";
import React, { FormEvent, useState } from "react";
import Header from "../_components/Header";
import { LayoutDashboard, Loader2 } from "lucide-react";
import { Input, InputContainer, InputLabel } from "@/components/Input";
import { Message as MessageInterface } from "@/types/Message";
import Message from "@/components/Message";

const Login = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<MessageInterface | null>(null);

  async function loginUser(e: FormEvent) {
    e.preventDefault();
    if (email) {
      setIsLoading(true);
      try {
        await fetch("https://localhost:3000/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        });
        setMessage({
          title: "Login realizado com sucesso",
          text: "Você será redirecionado em instantes para seu plannr...",
          type: "success",
        });
      } catch (err) {
        console.log(err);
        setMessage({
          title: "Erro ao realizar login",
          text: "Seu email ou senha estão incorretos, verifique novamente antes de tentar entrar.",
          type: "error",
        });
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

export default Login;
