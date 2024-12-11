import { Metadata } from "next";
import Header from "./_components/Header";
import Main from "./_components/Main";

export const metadata:Metadata = {
  title: "Devplannr"
}

export default function Home() {
  return (
    <>
    <Header/>
    <Main/>
    </>
  )
}
