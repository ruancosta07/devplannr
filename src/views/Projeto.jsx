import Dashboard from "@/components/projeto/Dashboard"
import Sidebar from "@/components/ui/Sidebar"
import clsx from "clsx"
import {
  ChartNoAxesColumnIcon,
  Check,
  File,
  FilePlus2,
  ListTodo,
  PenSquare,
  Settings2,
  Users
} from "lucide-react"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import { twMerge } from "tailwind-merge"
import Tasks from "@/components/projeto/Tasks"
import { AnimatePresence, motion } from "framer-motion"
import Settings from "@/components/projeto/Settings"
import Members from "@/components/projeto/Members"
import Loader from "@/components/ui/Loader"
import useUserStore from "@/store/User"
import { useMutation, useQuery } from "react-query"
import axios from "axios"
import Modal from "@/components/ui/Modal"
import { Input, InputContainer, InputLabel } from "@/components/ui/Input"
import { ChevronDown } from "lucide-react"
import LoggedHeader from "@/components/HeaderProject"
import dayjs from "@/utils/dayjs"
import { io } from "socket.io-client"
import { Frown } from "lucide-react"
import { Link } from "react-router-dom"
import { Image } from "lucide-react"
import { Images } from "lucide-react"
import { Upload } from "lucide-react"
import { Helmet } from "react-helmet"
import useAppStore from "@/store/App"
import Cookies from "js-cookie"
const Projeto = () => {
  const { projectId } = useParams()
  const socket = useRef(null)
  const { user } = useUserStore()
  const { plannrs } = useAppStore()
  const [modal, setModal] = useState(false)
  const [filterOptions, setFilterOptions] = useState(false)
  const [changeBanner, setChangeBanner] = useState(false)
  const [changeTitle, setChangeTitle] = useState(false)
  const [invites, setInvites] = useState([])
  const navigateTo = useNavigate()
  const inputTitle = useRef()
  const [isLoadingProject, setIsLoadingProject] = useState(true)
  const [project, setProject] = useState(null)
  const [changeLogo, setChangeLogo] = useState(false)
  useEffect(() => {
    socket.current = new io("https://devplannrapi-production.up.railway.app", {
      query: {
        userId: user.id
      }
    })
    socket.current.on("connect", () => {
      socket.current.emit("usersOnline", user, projectId)
      socket.current.emit("joinPlannr", projectId)
    })

    socket.current.on("changeProject", (msg) => {
      // console.log(msg)
      setProject(msg)
      setBanner(msg.banner)
      setName(msg.name)
    })

    socket.current.on("usersOnline", (msg) => {
      setUsersOnline(msg)
    })

    socket.current.on("userRemoved", () => {
      setUserRemoved(true)
    })

    socket.current.on("createTask", (msg) => {
      setTasks2(msg)
    })

    socket.current.on("invites", (msg) => {
      setInvites(msg)
    })
    socket.current.on("changeTask", (msg, recents) => {
      setTasks2(msg)
      console.log(project)
      // setProject({...project, recents:recents})
      // console.log(object)
    })
    socket.current.on("deleteTask", (msg) => {
      setTasks2(msg)
    })

    return () => {
      socket.current.disconnect()
    }
  }, [])
  async function loadProject() {
    try {
      const response = (
        await axios.get(`https://devplannrapi-production.up.railway.app/${projectId}/unico-plannr`, {
          headers: {
            Authorization: `Bearer ${Cookies.get('authTokenDevPlannr')}`
          }
        })
      ).data
      setProject(response)
      setName(response.name)
      setBanner(response.banner)
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoadingProject(false)
    }
  }

  useEffect(() => {
    loadProject()
    socket.current.emit("usersOnline", user, projectId)
  }, [projectId])
  const {
    data: tasks,
    refetch: reloadTasks,
    isFetching: isLoadingTasks
  } = useQuery(
    ["tasks", projectId],
    async () =>
      (
        await axios.get(`https://devplannrapi-production.up.railway.app/${projectId}/tasks`, {
          headers: {
            Authorization: `Bearer ${Cookies.get('authTokenDevPlannr')}`
          }
        })
      ).data
  )
  const [name, setName] = useState("")
  const [banner, setBanner] = useState("")
  const [icon, setIcon] = useState(null)
  const [file, setFile] = useState(null)
  const [tasks2, setTasks2] = useState([])
  const [logoUrl, setLogoUrl] = useState("")
  const [userRemoved, setUserRemoved] = useState(false)
  const [usersOnline, setUsersOnline] = useState([])
  const [bannerFile, setBannerFile] = useState(null)
  const [bannerUrl, setBannerUrl] = useState(null)

  useEffect(() => {
    if (!isLoadingTasks) {
      setTasks2(tasks)
    }
  }, [isLoadingTasks])

  const { mutate: editPlannr, isLoading: isChangingProject } = useMutation(
    "editPlannr",
    async () => {
      if (logoUrl) {
        setProject({ ...project, logo: logoUrl })
      } else if (icon) {
        setProject({ ...project, logo: icon })
      }
      try {
        const formData = new FormData()
        file && formData.append("logo", file)
        bannerFile && formData.append("bannerFile", bannerFile)
        formData.append("userId", user.id)
        formData.append("name", name)
        if(bannerLink && bannerLink !== project.logo){
          formData.append("banner", bannerLink)
        }
        else if(banner && banner !== project.logo){
          formData.append("banner", banner)
        }
        formData.append("logo", logoUrl)
        const response = await axios.patch(
          `https://devplannrapi-production.up.railway.app/${projectId}/editar-plannr`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${Cookies.get('authTokenDevPlannr')}`
            }
          }
        )
        socket.current.emit("changeProject", project.id)
        setIcon(null)
        setLogoUrl("")
        setBannerLink("")
      } catch (err) {
        console.log(err)
      }
    },
    {
      onSuccess: () => {
        loadProject()
        setLogoUrl("")
      }
    }
  )

  const [activeSection, setActiveSection] = useState(0)
  const sections = [
    {
      section: "Dashboard",
      icon: <ChartNoAxesColumnIcon className="w-[2rem] h-[2rem]" />
    },
    {
      section: "Tarefas",
      icon: <ListTodo className="w-[2rem] h-[2rem]" />
    },
    {
      section: "Membros",
      icon: <Users className="w-[2rem] h-[2rem]" />
    }
  ]

  const colorsAndGradients = [
    "bg-gradient-to-tr from-zinc-700 to-zinc-900",
    "bg-gradient-to-r from-gray-300 via-gray-500 to-gray-700",
    "bg-gradient-to-r from-yellow-200 via-lime-400 to-green-600",
    "bg-gradient-to-l from-rose-400 via-fuchsia-500 to-indigo-500",
    "bg-gradient-to-bl from-rose-100 to-teal-100",
    "bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-700",
    "bg-gradient-to-l from-fuchsia-500 via-pink-600 to-red-700",
    "bg-gradient-to-r from-green-400 via-teal-500 to-cyan-600",
    "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-500 via-zinc-300 to-zinc-100",
    "bg-gradient-to-t from-yellow-500 via-amber-600 to-orange-700",
    "bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-zinc-700 via-zinc-500 to-zinc-300",
    "bg-gradient-to-l from-sky-400 via-rose-400 to-lime-400"
  ]

  useEffect(() => {
    if (changeTitle) {
      inputTitle.current.focus()
    }
  }, [changeTitle])

  const [filterTasks, setFilterTasks] = useState("Mais recentes")
  function filterTasksByOption(option) {
    if (option === "Mais recentes") {
      setFilterTasks("Mais recentes")
      setTasks2(tasks.sort((a, b) => dayjs(a.createdAt).diff(b.createdAt)))
    } else if (option === "Em andamento") {
      setFilterTasks("Em andamento")
      setTasks2(tasks.filter((ta) => ta.status === "Em andamento"))
    } else if (option === "Concluídas") {
      setFilterTasks("Concluídas")
      setTasks2(tasks.filter((ta) => ta.status === "Concluída"))
    } else if (option === "Pausadas") {
      setFilterTasks("Pausadas")
      setTasks2(tasks.filter((ta) => ta.status === "Pausada"))
    } else if (option === "Não iniciadas") {
      setFilterTasks("Não iniciadas")
      setTasks2(tasks.filter((ta) => ta.status === "Não iniciada"))
    }
  }
  const tasksFilterOptions = [
    "Mais recentes",
    "Não iniciadas",
    "Em andamento",
    "Concluídas",
    "Pausadas"
  ]

  const onLogoChange = (e) => {
    const newFile = e.target.files[0]
    setFile(newFile)
    const blob = new Blob([newFile], { type: newFile.type })
    setIcon(URL.createObjectURL(blob))
  }

  const onBannerChange = (e) => {
    const newFile = e.target.files[0]
    setBannerFile(newFile)
    const blob = new Blob([newFile], {
      type: newFile.type
    })
    setBannerUrl(URL.createObjectURL(blob))
  }

  async function fetchImage({ type, link }) {
    try {
      if (type === "logo") {
        setIcon(link)
        setLogoUrl(link)
      } else {
        setBanner(i)
      }
    } catch (err) {
      console.log(err)
    }
  }
  const foundUser = useMemo(() => {
    if (project && user) {
      return project.members.find((u) => u.id === user.id)
    }
  }, [project, user])


  const sectionsChangeBanner = ["Galeria", "Carregar", "Link"]
  const [activeSectionChangeBanner, setActiveSectionChangeBanner] = useState(0)
  const regexBanner = /^https:\/\/[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+(:\d+)?(\/[^\s]*)?$/
  const [bannerLink, setBannerLink] = useState("")
  if (!isLoadingProject && !project?.members?.find((m) => m.id === user.id))
    return <Navigate to={`/${user.id}/plannrs`} />
  else
    return (
      <>
        <LoggedHeader
          setInvites2={setInvites}
          invites2={invites}
          socket={socket}
          project={project}
          reloadProjects={loadProject}
          usersOnline={usersOnline}
        />
        <Sidebar reloadProject={loadProject} />
        <main>
          <div className=" md:max-w-[80%] xl:max-w-[70%] 2xl:max-w-[60%] py-[3rem] mx-auto">
            <motion.div
              whileHover={"bannerHover"}
              id="banner"
              className={twMerge(
                "h-[300px] object-cover rounded-[.5rem] relative",
                !regexBanner.test(banner) && banner
              )}
            >
              {regexBanner.test(banner) && (
                <img
                  src={banner}
                  className="absolute left-0 top-0 h-[300px] w-full object-cover rounded-[.8rem]"
                  alt=""
                />
              )}
              <div className="absolute bg-gradient-to-b from-transparent via-black/30 rounded-[0_0_.6rem_.6rem] to-zinc-900 w-full bottom-0 left-0 p-[2rem] flex items-center gap-[1rem] text-zinc-50">
                <div className=" flex items-center gap-[1rem] relative">
                  {project?.logo ? (
                    <img
                      onClick={() => setChangeLogo((v) => !v)}
                      className="w-[5rem] h-[5rem] rounded-[.8rem] object-cover"
                      src={project?.logo}
                      alt=""
                    />
                  ) : (
                    <File onClick={() => setChangeLogo((v) => !v)} className="w-[4rem] h-[4rem]" />
                  )}
                  {changeTitle ? (
                    <input
                      ref={inputTitle}
                      onBlur={() => {
                        if (name !== project.name) {
                          editPlannr()
                        }
                        setChangeTitle(false)
                      }}
                      className="text-[2.6rem] outline-none font-semibold text-zinc-50 bg-transparent"
                      value={name}
                      onChange={({ target }) => {
                        setName(target.value)
                      }}
                    />
                  ) : (
                    <h1
                      onClick={() => {
                        if (foundUser.role === "admin") {
                          setChangeTitle(true)
                        }
                      }}
                      className="text-[2.6rem] font-semibold"
                    >
                      {name}
                    </h1>
                  )}
                  {changeLogo && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-[1rem] border border-zinc-800 rounded-[.8rem] bg-zinc-900 left-0 absolute top-full w-[30rem] z-[2]"
                    >
                      <label className="w-full h-[160px] flex items-center justify-center flex-col border border-dashed border-zinc-800 rounded-[.6rem] p-[.5rem] cursor-pointer relative">
                        {icon ? (
                          <img
                            className="w-[8rem] h-[8rem] rounded-[.8rem] object-cover"
                            src={icon}
                            alt=""
                          />
                        ) : (
                          <>
                            <Upload className="w-[3rem] h-[3rem] mb-[.8rem]" />
                            <span className="text-[1.4rem] mb-[.8rem] text-center leading-[1.2]">
                              Arraste e solte uma imagem aqui, ou selecione do computador
                            </span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={onLogoChange}
                          className="opacity-0 absolute w-full h-full left-0 top-0"
                        />
                      </label>
                      <p className="text-[1.4rem] text-center my-[1rem]">ou</p>
                      <InputContainer>
                        <Input
                          value={logoUrl}
                          onChange={(e) => setLogoUrl(e.target.value)}
                          onKeyUp={(e) => {
                            if (e.ctrlKey && e.key === "v") {
                              const { value } = e.target
                              fetchImage({ type: "logo", link: value })
                            }
                          }}
                          placeholder="Cole o link da imagem"
                          className="p-[.8rem] text-[1.3rem]"
                        />
                      </InputContainer>
                      <button
                        onClick={() => {
                          editPlannr()
                          setChangeLogo(false)
                        }}
                        className="bg-zinc-100 p-[.8rem] text-[1.4rem] font-semibold text-zinc-800 w-full text-center rounded-[.5rem] mt-[1.2rem]"
                      >
                        Alterar ícone
                      </button>
                    </motion.div>
                  )}
                </div>
                {foundUser?.role === "admin" && (
                  <motion.button
                    onClick={() => setChangeBanner((v) => !v)}
                    initial={{ opacity: 0, y: 12, scale: 0.9 }}
                    variants={{
                      bannerHover: {
                        opacity: 1,
                        y: 0,
                        scale: 1
                      }
                    }}
                    exit={{ opacity: 0, y: 12, scale: 0.7 }}
                    className="ml-auto text-zinc-100"
                  >
                    <PenSquare />
                  </motion.button>
                )}

                {changeBanner && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute z-[10] w-[45rem] p-[.8rem] right-12 top-full border border-zinc-800 bg-zinc-900 rounded-[.5rem]"
                  >
                    <div className="mb-[1.2rem] border-b border-zinc-800">
                      {sectionsChangeBanner.map((s, i) => (
                        <button
                          onClick={() => setActiveSectionChangeBanner(i)}
                          key={i}
                          className={clsx(
                            "text-[1.4rem] p-[.8rem] duration-200 border-b-2 border-transparent ease-in-out ",
                            {
                              " border-zinc-300": activeSectionChangeBanner === i
                            }
                          )}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                    {activeSectionChangeBanner === 0 && (
                      <div className="grid grid-cols-4 gap-[1rem]">
                        <span className="text-[1.2rem] text-zinc-300 col-span-full">
                          Cores e gradientes
                        </span>
                        {colorsAndGradients.map((c, i) => (
                          <button
                            onClick={() => {
                              setBanner(c)
                            }}
                            key={i}
                            className={twMerge("w-[100px] h-[60px] rounded-[.3rem]", c)}
                          ></button>
                        ))}
                      </div>
                    )}
                    {activeSectionChangeBanner === 1 && (
                      <div>
                        <label className="h-[180px] cursor-pointer flex flex-col items-center justify-center w-full border-dashed border rounded-[.6rem] border-zinc-800 relative p-[1rem]">
                          {bannerUrl && <img src={bannerUrl} className="w-full h-full object-cover rounded-[.5rem]" alt="" />}
                          {!bannerUrl && <>
                            <Upload className="w-[3rem] h-[3rem] mb-[.8rem]" />
                          <span className="block text-center mx-auto text-[1.6rem] font-medium max-w-[30ch] leading-[1.3]">
                            Arraste e solte uma imagem aqui, ou selecione do seu computador
                          </span>
                          </>}
                          <input
                            type="file"
                            name=""
                            id=""
                            accept="image/*"
                            onChange={onBannerChange}
                            className="opacity-0 absolute bg-red-600 w-full h-full"
                          />
                        </label>
                      </div>
                    )}
                    {activeSectionChangeBanner === 2 && (
                      <InputContainer>
                        <InputLabel
                          label={"Insira o link abaixo"}
                          className="text-[1.4rem] font-medium"
                        />
                        <Input
                          className="text-[1.4rem]"
                          placeholder="Escreva ou cole o link aqui"
                          value={bannerLink}
                          onChange={(e) => {
                            setBannerLink(e.target.value)
                          }}
                        />
                      </InputContainer>
                    )}
                    <button
                      onClick={() => {
                        editPlannr()
                        setChangeBanner(false)
                      }}
                      className="col-span-full mt-[1.2rem] w-fit p-[.8rem] bg-zinc-100 rounded-[.5rem] text-zinc-800 text-[1.3rem] alteração"
                    >
                      Salvar
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
            <div className="flex p-[.8rem] rounded-[.5rem] gap-[.5rem] bg-zinc-900/50 mt-[2rem] w-fit">
              {sections.map((s, i) => (
                <motion.button
                  onClick={() => setActiveSection(i)}
                  className={clsx(
                    "p-[.8rem] flex items-center gap-[.6rem] font-medium rounded-[.5rem] px-[1rem] duration-200 ease-in-out text-[1.4rem]",
                    {
                      "bg-zinc-100 text-zinc-800": activeSection === i,
                      "bg-zinc-900/70 text-zinc-700": activeSection !== i
                    }
                  )}
                  key={i}
                >
                  {s.icon}
                  {s.section}
                </motion.button>
              ))}
            </div>
            {/* {activeSection === 0 && <Dashboard tasks={tasks} project={project} />} */}
            {activeSection === 1 && (
              <div className="flex gap-[1rem] mt-[.8rem] relative w-fit">
                {foundUser?.role === "admin" && (
                  <button
                    onClick={() => setModal(true)}
                    className="bg-zinc-100 text-zinc-900 p-[.8rem] px-[1rem] text-[1.4rem] rounded-[.5rem] font-medium flex items-center gap-[.6rem]"
                  >
                    <FilePlus2 className="w-[1.6rem] h-[1.6rem]" />
                    Criar tarefa
                  </button>
                )}
                <button
                  onClick={() => setFilterOptions((v) => !v)}
                  className="bg-zinc-900 text-zinc-100 p-[.8rem] px-[1rem] text-[1.4rem] rounded-[.5rem] font-medium flex items-center gap-[.6rem] relative"
                >
                  <Settings2 className="w-[1.6rem] h-[1.6rem]" />
                  {filterTasks || "Mais recentes"}
                </button>
                {filterOptions && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute z-[1] right-0 w-max bg-zinc-900 rounded-[.5rem] border border-zinc-800 text-zinc-100 flex flex-col text-[1.4rem] font-medium p-[.8rem] top-[105%]"
                  >
                    {tasksFilterOptions.map((o, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          filterTasksByOption(o)
                          setFilterOptions(false)
                        }}
                        className="flex w-full items-center gap-[.6rem] rounded-[.5rem] p-[.8rem] hover:bg-zinc-800 duration-200"
                      >
                        <Check
                          className={`w-[1.6rem] h-[1.6rem] ${filterTasks === o ? "opacity-100" : "opacity-0"}`}
                        />
                        {o}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            )}
            {activeSection === 0 && <Dashboard project={project} tasks={tasks2} />}
            {activeSection === 1 && (
              <Tasks
                socket={socket}
                reloadTasks={reloadTasks}
                foundUser={foundUser}
                project={project}
                tasks={tasks2}
                setTasks={setTasks2}
                modal={modal}
                setModal={setModal}
                loadProject={loadProject}
              />
            )}
            {activeSection === 2 && (
              <Members
                socket={socket}
                reloadProject={loadProject}
                projectId={projectId}
                members={project?.members}
                project={project}
              />
            )}
            {activeSection === 3 && <Settings project={project} />}
          </div>
        </main>
        {isLoadingProject && <Loader />}
        {userRemoved && (
          <Modal
            modal={userRemoved}
            setModal={setUserRemoved}
            onClose={() => {
              navigateTo(`/${user.id}/plannrs`)
            }}
            className={
              "flex md:w-[50%] xl:w-[35%] 2xl:w-[25%] flex-col justify-center z-[100] items-center p-[4rem]"
            }
          >
            <Frown className="text-zinc-50 w-[6rem] h-[6rem]" />
            <h1 className="text-zinc-50 font-semibold text-[2.4rem] mt-[2rem] max-w-[30ch] text-center">
              Oops, parece que você foi removido desse plannr
            </h1>
            <p className="text-zinc-300 mt-[1.2rem] text-center text-[1.4rem] leading-[1.3]">
              Isso está aparecendo pois o administrador do plannr removeu você, se você acha que foi
              sem querer contate o administrador.
            </p>
            <Link
              to={`/${user.id}/plannrs`}
              className="mt-[2rem] bg-zinc-100 text-zinc-800 text-[1.6rem] font-medium p-[1rem] px-[2rem] rounded-[.5rem]"
            >
              Voltar para tela inicial
            </Link>
          </Modal>
        )}
      </>
    )
}

export default Projeto
