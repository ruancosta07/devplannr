import useUserStore from '@/store/User'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ChevronDown,
  Home,
  LinkIcon,
  ListTodoIcon,
  PenSquare,
  PlusIcon,
  Search,
  Settings,
  Star,
  Trash2,
  UserPlus,
} from 'lucide-react'
import useAppStore from '@/store/App'
import clsx from 'clsx'
import SearchBox from './SearchBox'
import { useMutation, useQuery } from 'react-query'
import axios from 'axios'
import Modal from './Modal'
import { Input, InputContainer, InputLabel } from './Input'
import { Check } from 'lucide-react'
import { LogOut } from 'lucide-react'
import Cookies from 'js-cookie'
import { UserCircle } from 'lucide-react'
import Configuracoes from './Configuracoes'

const Sidebar = ({ socket, reloadProjects, reloadProject }) => {
  const { user, setUser, setSigned } = useUserStore()
  const { sidebarActive, setSidebarActive, sidebarHover, setSidebarHover, fixSidebar, setFixSidebar } = useAppStore()
  const [activeProject, setActiveProject] = useState(null)
  const [addProject, setAddProject] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [userInfo, setUserInfo] = useState(false)
  const newProject = useRef()
  const [activeSearchbar, setActiveSearchbar] = useState(false)
  const [configuracoesAtiva, setConfiguracoesAtiva] = useState(false)
  const { data: projects, refetch } = useQuery(
    ['projetos', user.id],
    async () =>
      (
        await axios.get(`https://devplannrapi-production.up.railway.app/${user.id}/plannrs`, {
          headers: {
            Authorization: `Bearer ${Cookies.get('authTokenDevPlannr')}`,
          },
        })
      ).data
  )
  const [particularesAtivo, setParticularesAtivo] = useState(true)
  const [workflowsAtivos, setWorkflowsAtivos] = useState(true)

  useEffect(() => {
    refetch()
  }, [reloadProjects])

  useEffect(() => {
    function changeSidebarState(e) {
      if (e.pageX <= 150) {
        setSidebarActive(true)
      } else if (e.pageX >= 150 && sidebarHover === false) {
        setSidebarActive(false)
        setActiveProject(null)
      }
    }
    window.addEventListener('mousemove', changeSidebarState)
    return () => {
      window.removeEventListener('mousemove', changeSidebarState)
    }
  }, [sidebarHover, setSidebarActive])

  useEffect(() => {
    if (addProject) {
      newProject.current.focus()
    }
  }, [addProject])

  useEffect(() => {
    function activeSearchbarCtrlK(e) {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault()
        setActiveSearchbar(true)
      }
    }
    window.addEventListener('keydown', activeSearchbarCtrlK)
    return () => window.removeEventListener('keydown', activeSearchbarCtrlK)
  }, [])

  function logout() {
    setUser(null)
    setSigned(false)
    localStorage.removeItem('authTokenDevPlannr')
  }

  const { mutate: deletePlannr } = useMutation(
    'deletePlannr',
    async (id) => {
      try {
        const response = await axios.delete(`https://devplannrapi-production.up.railway.app/${id}/excluir-plannr`, {
          headers: {
            Authorization: `Bearer ${Cookies.get('authTokenDevPlannr')}`,
          },
        })
      } catch (err) {
        console.log(err)
      }
    },
    {
      onSuccess: () => {
        reloadProjects()
      },
    }
  )

  return (
    <>
      <motion.aside
        onMouseOver={() => setSidebarHover(true)}
        onMouseLeave={() => setSidebarHover(false)}
        initial={{ opacity: 0, left: '-200px' }}
        animate={sidebarActive ? { opacity: 1, left: 0 } : {}}
        className={clsx(
          'fixed top-[10vh] z-[100] bg-zinc-200 border-zinc-300 dark:bg-zinc-900 p-[1rem] min-w-[13vw] rounded-[.5rem] border dark:border-zinc-800'
        )}
      >
        <ul className="border-b border-zinc-300 dark:border-zinc-800 pb-[.6rem]">
          <li>
            <Link
              to={`/${user.id}/plannrs`}
              className="p-[.7rem] rounded-[.5rem] text-zinc-900 dark:text-zinc-100 text-[1.4rem] flex items-center gap-[1rem] hover:bg-zinc-300 hover:dark:bg-zinc-800 duration-200"
            >
              <Home className="w-[1.8rem] h-[1.8rem]" strokeWidth={1.5} />
              Início
            </Link>
          </li>
          {/* <li>
            <button
              onClick={() => setActiveSearchbar(true)}
              className="p-[.7rem] hover:bg-zinc-300 text-zinc-900 rounded-[.5rem] dark:text-zinc-100 text-[1.4rem] w-full flex items-center gap-[1rem] hover:dark:bg-zinc-800 duration-200"
            >
              <Search className="w-[1.8rem] h-[1.8rem]" strokeWidth={1.5} />
              Pesquisar
              <span className="bg-zinc-300 dark:bg-zinc-900 p-[.5rem] rounded-[.5rem] text-[1rem] ml-auto font-semibold">
                ctrl + k
              </span>
            </button>
          </li> */}
          {/* <li>
            <Link className="p-[.7rem] rounded-[.5rem] dark:text-zinc-100 text-[1.4rem] flex items-center gap-[1rem] hover:bg-zinc-800 duration-200">
              <UserPlus className="w-[1.8rem] h-[1.8rem]" strokeWidth={1.5} />
              Convidar membro
            </Link>
          </li>
          <li>
            <Link className="p-[.7rem] rounded-[.5rem] dark:text-zinc-100 text-[1.4rem] flex items-center gap-[1rem] hover:bg-zinc-800 duration-200">
              <ListTodoIcon className="w-[1.8rem] h-[1.8rem]" strokeWidth={1.5} />
              Minhas tarefas
            </Link>
          </li> */}
        </ul>
        <div
          onClick={() => setParticularesAtivo((v) => !v)}
          className="p-[.8rem] text-zinc-900 hover:bg-zinc-300 px-[.7rem] rounded-[.5rem] dark:text-zinc-100 text-[1.2rem] flex items-center gap-[.6rem] hover:dark:bg-zinc-800 duration-200 mt-[1.2rem] font-medium"
        >
          <ChevronDown
            className={clsx('duration-200 w-[1.4rem] h-[1.4rem]', {
              '-rotate-0': particularesAtivo,
              '-rotate-90 ': !particularesAtivo,
            })}
          />
          Particular
          <div className="flex ml-auto">
            {/* <button
              onClick={(e) => {
                e.stopPropagation()
                setParticularesAtivo(true)
                setAddProject(true)
              }}
              className="p-[.35rem] hover:bg-zinc-700 rounded-[.5rem] duration-200"
            >
              <PlusIcon className="w-[1.8rem] h-[1.8rem]" strokeWidth={1.5} />
            </button> */}
          </div>
        </div>
        {particularesAtivo && (
          <ul className="border-b pl-[1.8rem] dark:border-zinc-800 relative  pb-[1rem]">
            <div className="w-[.1rem] absolute left-[1.3rem] h-[90%] bg-zinc-700/30"></div>
            <div>
              {projects?.map((p, i) => (
                <li
                  onContextMenu={(e) => {
                    e.preventDefault()
                    setActiveProject(p.id)
                  }}
                  key={i}
                >
                  <Link
                    to={`/${p.id}`}
                    className={clsx(
                      'px-[.7rem] rounded-[.5rem] text-zinc-900 dark:text-zinc-100 text-[1.35rem] flex items-center  duration-200 p-[.9rem] hover:bg-zinc-300 relative hover:dark:bg-zinc-800'
                    )}
                  >
                    {activeProject === p.id && p.name.length > 16 ? p.name.slice(0, 16) + '...' : p.name}
                    <div className="flex ml-auto"></div>
                    <AnimatePresence>
                      {activeProject === p.id && (
                        <motion.div
                          initial={{
                            opacity: 0,
                            scale: 0.9,
                          }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-zinc-200 border-zinc-300 dark:bg-zinc-900 p-[.8rem] rounded-[.5rem] absolute left-full w-max top-0 border dark:border-zinc-800 z-[1000]"
                        >
                          <button className="flex items-center text-[1.4rem] gap-[.6rem] hover:bg-zinc-300 dark:text-zinc-300 p-[.8rem] hover:dark:bg-zinc-800 rounded-[.5rem] z-[10] w-full">
                            <Star className="w-[1.8rem] h-[1.8rem]" />
                            Adicionar aos favoritos
                          </button>
                          <button className="flex items-center text-[1.4rem] gap-[.6rem] hover:bg-zinc-300 dark:text-zinc-300 p-[.8rem] hover:dark:bg-zinc-800 rounded-[.5rem] z-[10] w-full">
                            <LinkIcon className="w-[1.8rem] h-[1.8rem]" />
                            Copiar link
                          </button>
                          {p.members.find((m) => m.id === user.id).role === 'admin' && (
                            <>
                              <button className="flex items-center text-[1.4rem] gap-[.6rem] hover:bg-zinc-300 dark:text-zinc-300 p-[.8rem] hover:dark:bg-zinc-800 rounded-[.5rem] z-[10] w-full">
                                <PenSquare className="w-[1.8rem] h-[1.8rem]" />
                                Renomear
                              </button>
                              <button className="flex items-center text-[1.4rem] gap-[.6rem] hover:bg-zinc-300 dark:text-zinc-300 p-[.8rem] hover:dark:bg-zinc-800 rounded-[.5rem] z-[10] w-full">
                                <UserPlus className="w-[1.8rem] h-[1.8rem]" />
                                Convidar
                              </button>
                              <button
                                onClick={(e) => {
                                  e.preventDefault()
                                  deletePlannr(activeProject)
                                }}
                                className="flex items-center text-[1.4rem] gap-[.6rem] hover:bg-zinc-300 dark:text-zinc-300 p-[.8rem] hover:dark:bg-zinc-800 rounded-[.5rem] z-[10] w-full"
                              >
                                <Trash2 className="w-[1.8rem] h-[1.8rem]" />
                                Excluir
                              </button>
                            </>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Link>
                </li>
              ))}
              {addProject && (
                <li>
                  <Link
                    className={clsx(
                      'px-[.7rem] rounded-[.5rem] dark:text-zinc-100 text-[1.35rem] flex items-center  duration-200 p-[.9rem] relative hover:bg-zinc-800'
                    )}
                  >
                    <input
                      // onBlur={addNewProject}
                      // onKeyUp={(e) => {
                      //   if (e.key === "Enter") {
                      //     addNewProject();
                      //   }
                      // }}
                      ref={newProject}
                      className="appearance-none bg-transparent outline-none border-none"
                      type="text"
                      value={newProjectName}
                      onChange={({ target }) => setNewProjectName(target.value)}
                    />
                  </Link>
                </li>
              )}
            </div>
          </ul>
        )}
        <ul className="border-b dark:border-zinc-800 pb-[.6rem] mt-[1.2rem]">
          <li>
            <button
              onClick={() => setConfiguracoesAtiva((v) => !v)}
              className="p-[.7rem] rounded-[.5rem] dark:text-zinc-100 text-[1.4rem] w-full flex items-center gap-[1rem] hover:bg-zinc-300 hover:dark:bg-zinc-800 duration-200"
            >
              <Settings className="w-[1.8rem] h-[1.8rem]" strokeWidth={1.5} />
              Configurações
            </button>
          </li>
          <li>
            <Link className="p-[.7rem] rounded-[.5rem] dark:text-zinc-100 text-[1.4rem] flex items-center gap-[1rem] hover:bg-zinc-300 hover:dark:bg-zinc-800 duration-200">
              <Trash2 className="w-[1.8rem] h-[1.8rem]" strokeWidth={1.5} />
              Lixeira
            </Link>
          </li>
          <li>
            <Link
              onClick={logout}
              className="p-[.7rem] rounded-[.5rem] dark:text-zinc-100 text-[1.4rem] flex items-center gap-[1rem] hover:bg-zinc-300 hover:dark:bg-zinc-800 duration-200"
            >
              <LogOut className="w-[1.8rem] h-[1.8rem]" strokeWidth={1.5} />
              Sair
            </Link>
          </li>
        </ul>
        <div className="relative">
          {/* {userInfo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-[1.4rem] rounded-[.5rem] bg-zinc-900 border border-zinc-800 bottom-full left-0 absolute min-w-full"
            >
              <div className="flex gap-[1rem]">
                <img src={user.avatar} className="w-[3rem] h-[3rem] rounded-full" alt="" />
                <div>
                  <span className="text-zinc-300 text-[1.4rem] mb-[.4rem] block">
                    Plannr de {user.name} - 
                  </span>
                  <p className="text-zinc-400 text-[1.2rem]">Plano grátis</p>
                </div>
              </div>
              <div className="mt-[1.2rem]">
                <button className="flex gap-[.6rem] items-center border rounded-[.5rem] border-zinc-800 p-[.5rem] text-zinc-300 text-[1.2rem]">
                  <Settings className="w-[1.6rem] h-[1.6rem]"/>
                  Configurações
                </button>
              </div>
            </motion.div>
          )} */}
          <button
            onClick={() => setUserInfo((v) => !v)}
            className="p-[.7rem]  w-full mt-[1.2rem] dark:text-zinc-50 text-[1.4rem]  mb-[1rem] rounded-[.5rem] flex items-center gap-[1rem]"
          >
            {user.avatar ? (
              <img src={user.avatar} className="w-[3.2rem] h-[3.2rem] rounded-full object-cover" alt="" />
            ) : (
              <div className="w-[3.2rem] h-[3.2rem] rounded-full border dark:border-zinc-800 flex items-center gap-[.3rem] justify-center">
                {user?.name && user?.name[0]}
                {user?.name && user?.name.split(' ')[1][0]}
              </div>
            )}
            <div className="flex flex-col justify-start">
              <span className="text-start w-fit font-medium mb-[.15rem]">{user?.name}</span>
              <span className="text-start w-fit text-[1.2rem]">{user?.email}</span>
            </div>
            <ChevronDown className="w-[1.6rem] h-[1.6rem] ml-auto" />
          </button>
        </div>
      </motion.aside>
      {activeSearchbar && <SearchBox modal={activeSearchbar} setModal={setActiveSearchbar} />}
      {configuracoesAtiva && (
        <Configuracoes
          socket={socket}
          reloadProjects={reloadProjects}
          reloadProject={reloadProject}
          modal={configuracoesAtiva}
          setModal={setConfiguracoesAtiva}
        />
      )}
    </>
  )
}

export default Sidebar
