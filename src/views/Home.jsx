import { useState } from "react";
import Header from "../components/Header";
import { motion } from "framer-motion";
import clsx from "clsx";
import Dashboard from "../assets/public/dashboard.png";
import TrabalhoEquipe from "../assets/public/trabalhoEquipe.png";
import Projetos from "../assets/public/projects.png";
import Tarefas from "../assets/public/tasks.png";
import { CircleX, Frown, LayoutDashboard, Users, Zap } from "lucide-react";
import HeroVideoDialog from "@/components/ui/hero-video-dialog";
import { Link } from "react-router-dom";
const Home = () => {
  const [sessaoAtivaVantagens, setSessaoAtivaVantagens] = useState(0);

  function mudaSessaoAtivaVantagens(value) {
    setSessaoAtivaVantagens(value);
  }

  const images = [Projetos, Dashboard,TrabalhoEquipe, Tarefas];

  return (
    <main className="bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-400 via-zinc-100 to-white min-h-[100vh] dark:bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] dark:from-zinc-800 dark:via-zinc-900 dark:to-black">
      <Header />
      <section>
        <div className="container-width mt-[15vh]">
          <motion.h1
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .7, ease: "easeInOut", type: "tween" }}
            className="text-[6rem] font-bold dark:text-zinc-50 text-center max-w-[20ch] mx-auto"
          >
            Gerencie suas tarefas com apenas alguns cliques
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .7, ease: "easeInOut", type: "tween", delay: .15 }} className="max-w-[40ch] leading-[1.2] text-center mx-auto mt-[1.2rem] text-[2rem] text-zinc-300">
            Gerenciar suas tarefas nunca foi tão fácil, não importa o tipo.
          </motion.p>
          <Link to={"/login"} className="flex gap-[1rem] justify-center mt-[1.2rem]">
            <motion.button initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .7, ease: "easeInOut", type: "tween", delay: .3 }} className="bg-zinc-100 flex items-center gap-[.6rem] text-[1.4rem] p-[.8rem] rounded-[.5rem] font-medium">
              <LayoutDashboard className="w-[1.8rem] h-[1.8rem]" />
              Comece agora de graça
            </motion.button>
          </Link>
          <motion.div initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .7, ease: "easeInOut", type: "tween",  delay:.45 }}>
          
          <HeroVideoDialog
            className={"mt-[10rem] dark:stroke-zinc-800 w-[70%] mx-auto"}
            animationStyle="from-center"
            videoSrc="/presentation.mp4"
            thumbnailSrc={
              "/banner-devplannr.webp"
            }
          />
          </motion.div>
        </div>
      </section>
      <section className="bg-gradient-to-b from-transparent via-transparent  to-zinc-700 mt-[20vh]">
        <div className="container-width py-[6rem]">
          <h1 className="text-[4rem] font-semibold text-center dark:text-zinc-100">
            Tudo que você precisa para gerenciar suas tarefas.
          </h1>
          <p className="dark:text-zinc-300 text-[1.6rem] mx-auto text-center mt-[1.2rem]">
            Cansado(a) de usar vários apps para gerenciar suas tarefas? Temos
            tudo que você precisa aqui
          </p>
          <div className="grid grid-cols-[.5fr_1fr] mt-[2rem]">
            <div className="flex flex-col gap-[2rem]">
              <div
                onClick={() => mudaSessaoAtivaVantagens(0)}
                className={clsx(
                  "border duration-300 ease-in-out border-transparent p-[2rem] rounded-[1rem]",
                  {
                    " dark:border-zinc-800 bg-zinc-800/30  dark:border-opacity-30":
                      sessaoAtivaVantagens === 0,
                  }
                )}
              >
                <span className="dark:text-zinc-300 text-[2rem] font-semibold mb-[.8rem] block">
                  Gerenciamento de tarefas
                </span>
                <p className="dark:text-zinc-500 text-[1.4rem] leading-[1.2]">
                  Gerencie suas tarefas de uma forma fácil e intuitiva, além de
                  poder acessar de qualquer lugar.
                </p>
              </div>
              <div
                onClick={() => mudaSessaoAtivaVantagens(1)}
                className={clsx(
                  "border duration-300 ease-in-out border-transparent p-[2rem] rounded-[1rem]",
                  {
                    " dark:border-zinc-800 bg-zinc-800/30  dark:border-opacity-30":
                      sessaoAtivaVantagens === 1,
                  }
                )}
              >
                <span className="dark:text-zinc-300 text-[2rem] font-semibold mb-[.8rem] block">
                  Dashboard preciso
                </span>
                <p className="dark:text-zinc-500 text-[1.4rem] leading-[1.2]">
                  Acompanhe o andamento do plannr e as estatísticas com um
                  dashboard que mostra o andamento das tarefas.
                </p>
              </div>
              <div
                onClick={() => mudaSessaoAtivaVantagens(2)}
                className={clsx(
                  "border duration-300 ease-in-out border-transparent p-[2rem] rounded-[1rem]",
                  {
                    " dark:border-zinc-800 bg-zinc-800/30  dark:border-opacity-30":
                      sessaoAtivaVantagens === 2,
                  }
                )}
              >
                <span className="dark:text-zinc-300 text-[2rem] font-semibold mb-[.8rem] block">
                  Trabalho em equipe
                </span>
                <p className="dark:text-zinc-500 text-[1.4rem] leading-[1.2]">
                  Crie plannrs e convide outras pessoas para trabalhar junto,
                  criando tarefas para cada um.
                </p>
              </div>
              <div
                onClick={() => mudaSessaoAtivaVantagens(3)}
                className={clsx(
                  "border duration-300 ease-in-out border-transparent p-[2rem] rounded-[1rem]",
                  {
                    " dark:border-zinc-800 bg-zinc-800/50  dark:border-opacity-30":
                      sessaoAtivaVantagens === 3,
                  }
                )}
              >
                <span className="dark:text-zinc-300 text-[2rem] font-semibold mb-[.8rem] block">
                  Trabalho em tempo real
                </span>
                <p className="dark:text-zinc-500 text-[1.4rem] leading-[1.2]">
                  Interaja e controle o andamento das tarefas em tempo real com
                  os membros do seu plannr.
                </p>
              </div>
            </div>
            <img
              src={images[sessaoAtivaVantagens]}
              className="rounded-[1rem] shadow-lg"
            />
          </div>
        </div>
      </section>
      <section className="py-[6rem]">
        <div>
          <span className="text-center block text-zinc-400 font-medium font-mono text-[1.6rem]">
            Problemas
          </span>
          <h1 className="text-center text-zinc-50 text-[3rem] font-semibold mt-[1.2rem] max-w-[30%] mx-auto leading-[1.3]">
            Gerenciar tarefas em papeis ou outras aplicações pode ser cansativo
            e tedioso.
          </h1>
          <div className="grid grid-cols-3 mx-auto max-w-[70%] mt-[3rem]">
                <div className="text-zinc-50">
                  <div className="p-[1rem] rounded-full bg-zinc-800 text-zinc-100 w-fit">
                  <Frown/>
                  </div>
                  <span className="text-[2rem] font-semibold mt-[1.2rem] block mb-[.8rem]">Falta de recursos</span>
                  <p className="max-w-[70%] text-[1.6rem] leading-[1.3] text-zinc-300">Alguns outros aplicativos fornecem funcionalidades limitadas com relação ao gerenciamento de tarefas.</p>
                </div>
                <div className="text-zinc-50">
                  <div className="p-[1rem] rounded-full bg-zinc-800 text-zinc-100 w-fit">
                  <Zap/>
                  </div>
                  <span className="text-[2rem] font-semibold mt-[1.2rem] block mb-[.8rem]">Demora na conclusão</span>
                  <p className="max-w-[70%] text-[1.6rem] leading-[1.3] text-zinc-300">Devido a falta de recursos, gerenciar suas tarefas em outras aplicações pode ser demorado e nada produtivo.</p>
                </div>
                <div className="text-zinc-50">
                  <div className="p-[1rem] rounded-full bg-zinc-800 text-zinc-100 w-fit">
                  <Users/>
                  </div>
                  <span className="text-[2rem] font-semibold mt-[1.2rem] block mb-[.8rem]">Limitação de tarefas</span>
                  <p className="max-w-[70%] text-[1.6rem] leading-[1.3] text-zinc-300">Maioria das aplicações fornece apenas o gerenciamento de tarefas individuais, mas com o devplannr, trabalhar em grupo fica ainda mais fácil.</p>
                </div>
          </div>
        </div>
      </section>
      <section className="py-[12rem] bg-zinc-200">
        <div className="">
          <span className="font-mono block text-center font-medium text-[1.6rem] text-zinc-800">Pronto(a) para começar?</span>
          <h1 className="text-[4rem] font-semibold text-center">Comece a usar gratuitamente hoje mesmo.</h1>
          <button className="text-center block mx-auto bg-zinc-900 mt-[1.2rem] p-[1rem] text-zinc-100 text-[1.4rem] font-semibold rounded-[.5rem]">Comece gratuitamente</button>
        </div>
      </section>
    </main>
  );
};

export default Home;
