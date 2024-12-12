import { Metadata } from "next";
import CriarContaComp from "./_components/CriarConta";
export const metadata:Metadata = {
  title: "Devplannr | Criar conta",
  description: "Crie sua conta no devplannr"
}
export default function CriarConta (){
  return (
    <CriarContaComp/>
  )
}