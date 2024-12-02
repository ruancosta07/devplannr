import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Modal from "../ui/Modal";
import { Input, InputContainer, InputLabel, Textarea } from "../ui/Input";
import Select from "../ui/Select";
import {
  ChartNoAxesGantt,
  ChevronDown,
  File,
  Image,
  ImageIcon,
  Plus,
  Send,
  X,
  XCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import dayjs from "@/utils/dayjs";
import clsx from "clsx";
import data from "@emoji-mart/data";
import { useMutation } from "react-query";
import axios from "axios";
import { useParams } from "react-router-dom";
import useUserStore from "@/store/User";
import { Users } from "lucide-react";
import { Activity } from "lucide-react";
import { MoreHorizontal } from "lucide-react";
import { Check } from "lucide-react";
import { UserPlus } from "lucide-react";
import { Trash2 } from "lucide-react";
import Cookies from "js-cookie";
import { Calendar } from "../ui/calendar";
import { MessageCircle } from "lucide-react";
import { Smile } from "lucide-react";
import { PenBox } from "lucide-react";
import Picker from "@emoji-mart/react";
import Message from "../ui/Message";
const Tasks = ({
  socket,
  project,
  tasks,
  setTasks,
  reloadTasks,
  reloadProject,
  modal,
  setModal,
}) => {
  const { projectId } = useParams();
  const { user } = useUserStore();
  const [selecionarStatusNovaTarefa, setSelecionarStatusNovaTarefa] =
    useState(false);
  const [statusAtivo, setStatusAtivo] = useState("");
  const [responsaveis, setResponsaveis] = useState([]);
  const [selectResponsaveis, setSelectResponsaveis] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalImage, setModalImage] = useState(false);
  const [moreOptions, setMoreOptions] = useState(false);
  const [activeSectionTask, setActiveSectionTask] = useState(0);
  const [message, setMessage] = useState("");
  const [changeStatus, setChangeStatus] = useState(false);
  const [adicionarMembro, setAdicionarMembro] = useState(false);
  const [maisOpcoesTarefa, setMaisOpcoesTarefa] = useState(false);
  const [name, setName] = useState("");
  const [status, setStatus] = useState(null);
  const [messageAlert, setMessageAlert] = useState(null);
  const messageRef = useRef([]);
  const messageInput = useRef();
  const handleImageClick = (imgSrc) => {
    setSelectedImage(imgSrc);
    setModalImage(true);
  };

  const [activeTask, setActiveTask] = useState(null);
  function returnStatus(status) {
    if (status === "Concluída") {
      return (
        <span className="p-[.8rem] text-green-50 block w-fit mb-[1.2rem] rounded-[.5rem] text-[1.4rem] font-semibold bg-green-900">
          {status}
        </span>
      );
    } else if (status === "Pausada") {
      return (
        <span className="p-[.8rem] text-red-50 block w-fit mb-[1.2rem] rounded-[.5rem] text-[1.4rem] font-semibold bg-red-900">
          {status}
        </span>
      );
    } else if (status === "Em andamento") {
      return (
        <span className="p-[.8rem] text-blue-50 block w-fit mb-[1.2rem] rounded-[.5rem] text-[1.4rem] font-semibold bg-blue-900">
          {status}
        </span>
      );
    } else if (status === "Não iniciada") {
      return (
        <span className="p-[.8rem] text-zinc-50 block w-fit mb-[1.2rem] rounded-[.5rem] text-[1.4rem] font-semibold bg-zinc-700">
          {status}
        </span>
      );
    }
  }

  const [messages, setMessages] = useState([]);

  async function loadMessages() {
    if (activeTask) {
      try {
        const response = (
          await axios.get(
            `http://localhost:3000/${activeTask.id}/carregar-mensagens`,
            {
              headers: {
                Authorization: `Bearer ${Cookies.get("authTokenDevPlannr")}`,
              },
            }
          )
        ).data;
        setMessages(response);
      } catch (err) {}
    }
  }

  useEffect(() => {
    loadMessages();
  }, [activeTask]);

  useEffect(() => {
    messageRef.current = messageRef.current.slice(0, messages.length);
    messageRef.current.forEach((ref, i) => {
      const images = ref?.querySelectorAll("img" || []);
      images?.forEach((i) => {
        i.addEventListener("click", () => handleImageClick(i.src));
      });
    });
    return () => {
      messageRef.current.forEach((ref, i) => {
        const images = ref?.querySelectorAll("img" || []);
        images?.forEach((i) => {
          i.removeEventListener("click", () => handleImageClick(i.src));
        });
      });
    };
  }, [messages]);

  useEffect(() => {
    socket.current.on("sendMessage", (msg, tasks) => {
      setMessages(msg);
      setTasks(tasks);
    });
    socket.current.on("deleteMessage", (msg) => {
      setMessages(msg);
    });
    socket.current.on("addReaction", (msg) => {
      setMessages(msg);
    });
  }, []);

  useEffect(() => {
    if (activeTask) {
      socket.current.emit("joinTaskRoom", activeTask.id);
    }
  }, [activeTask]);

  const [images, setImages] = useState(null);
  const [filesMessages, setFilesMessages] = useState(null);
  function loadImagesFromComputer(e) {
    const files = e.target.files;
    const imagesArray = [];
    const filesArray = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      filesArray.push(file);
      const imageUrl = URL.createObjectURL(file);
      imagesArray.push({ url: imageUrl, name: file.name });
    }
    setImages(imagesArray);
    setFilesMessages(filesArray);
    setMoreOptions(false);
  }
  const { mutate: createNewTask } = useMutation(
    "createNewTask",
    async (e) => {
      e.preventDefault();
      if (titulo && descricao && statusAtivo && responsaveis.length > 0) {
        try {
          const response = await axios.post(
            "http://localhost:3000/create-task",
            {
              id: projectId,
              name: titulo,
              description: descricao,
              status: statusAtivo,
              users: responsaveis,
              userId: user.id,
            },
            {
              headers: {
                Authorization: `Bearer ${Cookies.get("authTokenDevPlannr")}`,
              },
            }
          );
          socket.current.emit("createTask", project.id);
          setModal(false);
          setTitulo("");
          setDescricao("");
          setStatus("");
          setResponsaveis([]);
          setActiveTask(null);
        } catch (err) {
          console.log(err);
        }
      } else if (!titulo) {
        setMessageAlert({
          title: "A tarefa deve conter um título",
          text: "Ao criar uma tarefa, ela deve conter um título.",
          type: "error",
        });
      } else if (!statusAtivo) {
        setMessageAlert({
          title: "A tarefa deve conter um status",
          text: "Ao criar uma tarefa, você deve informar o status para acompanhar o andamento da tarefa",
          type: "error",
        });
      } else {
        setMessageAlert({
          title: "A tarefa deve conter pelo menos um responsável",
          text: "Ao criar uma tarefa, você deve designar pelo menos um responsável para a tarefa",
          type: "error",
        });
      }
    },
    {
      onSuccess: () => {
        reloadTasks();
        reloadProject();
        setModal(false);
      },
    }
  );

  const sectionsTask = [
    "Atividade",
    // "Comentários"
  ];

  async function sendMessages({ message, userId, taskId, plannrId, files }) {
    try {
      const formData = new FormData();
      formData.append("message", message);
      formData.append("userId", userId);
      formData.append("taskId", taskId);
      if (files && files.length > 0) {
        files.forEach((file) => {
          formData.append("files", file); // O nome "files" deve coincidir com o backend
        });
      }
      const response = (
        await axios.post(
          `http://localhost:3000/${plannrId}/enviar-mensagem`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${Cookies.get("authTokenDevPlannr")}`,
            },
          }
        )
      ).data;
      setMessage("");
      messageInput.current.focus();
      setImages(null);
      setFilesMessages(null);
      socket.current.emit("sendMessage", taskId, projectId);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (messages && messagesContainer.current) {
      messagesContainer.current.scrollTo({
        top: messagesContainer.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  useEffect(() => {
    if (activeTask) {
      messageInput.current.focus();
      async function loadMessages() {
        try {
          const response = (
            await axios.get(
              `http://localhost:3000/${activeTask.id}/carregar-mensagens`,
              {
                headers: {
                  Authorization: `Bearer ${Cookies.get("authTokenDevPlannr")}`,
                },
              }
            )
          ).data;
          setMessages(response);
        } catch (err) {
          console.log(err);
        }
      }
      loadMessages();
    } else {
      setMessages([]);
    }
  }, [activeTask]);

  const messagesContainer = useRef();
  const statusOptions = [
    "Não iniciada",
    "Em andamento",
    "Concluída",
    "Pausada",
  ];

  useEffect(() => {
    if (activeTask) {
      setName(activeTask.name);
      setSelecionarStatusNovaTarefa(activeTask.status);
      setDescricao(activeTask.description);
      setResponsaveis(activeTask.users);
    }
  }, [activeTask]);

  const foundUser = useMemo(() => {
    if (activeTask) {
      return activeTask.users.find((m) => m.id === user.id);
    }
  }, [activeTask]);

  const changeTask = useCallback(
    async ({ id, status, responsaveis }) => {
      if (foundUser.role) {
        try {
          const response = await axios.patch(
            `http://localhost:3000/${projectId}/${id}/editar-tarefa`,
            {
              name,
              status,
              descricao,
              users: responsaveis,
            },
            {
              headers: {
                Authorization: `Bearer ${Cookies.get("authTokenDevPlannr")}`,
              },
            }
          );
          socket.current.emit("changeTask", projectId);
        } catch (err) {
          console.log(err);
        }
      }
    },
    [responsaveis, status, name, descricao, foundUser, socket]
  );

  async function deleteTask(id) {
    try {
      const response = await axios.delete(
        `http://localhost:3000/${projectId}/${id}/excluir-tarefa`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("authTokenDevPlannr")}`,
          },
        }
      );
      socket.current.emit("deleteTask", projectId);
      setTitulo("");
      setDescricao("");
      setStatus("");
      setResponsaveis("");
      setSelecionarStatusNovaTarefa(false);
      setMaisOpcoesTarefa(false);
    } catch (err) {
      console.log(err);
    }
  }

  const adjustTextareaHeight = () => {
    if (messageInput.current) {
      messageInput.current.style.height = "auto"; // Reseta a altura
      messageInput.current.style.height = `${messageInput.current.scrollHeight}px`; // Ajusta para o conteúdo
    }
  };

  async function deleteMessages(id, activeTaskId) {
    try {
      const response = await axios.delete(
        `http://localhost:3000/${id}/excluir-mensagem`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("authTokenDevPlannr")}`,
          },
        }
      );
      socket.current.emit("deleteMessage", activeTaskId);
    } catch (err) {
      console.log(err);
    }
  }

  const [activeMessageTooltip, setActiveMessageTooltip] = useState(false);
  const [activeMessage, setActiveMessage] = useState(null);
  const [addReaction, setAddReaction] = useState(false);

  async function addReactionToMessage(id, userId, reaction) {
    try {
      const response = await axios.post(
        `http://localhost:3000/${id}/adicionar-reacao`,
        { userId, reaction },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("authTokenDevPlannr")}`,
          },
        }
      );
      socket.current.emit("addReaction", activeTask.id);
      setAddReaction(false)
      setActiveMessageOptions(false)
    } catch (err) {
      console.log(err);
    }
  }

  const [activeMessageOptions, setActiveMessageOptions] = useState(false);

  return (
    <>
      <section className="grid md:grid-cols-2 2xl:grid-cols-3 gap-[1rem] mt-[2rem]">
        {tasks
          ?.sort((a, b) => dayjs(b.createdAt).diff(a.createdAt))
          .map((t, i) => (
            <div
              onClick={() => setActiveTask(t)}
              className="cursor-pointer p-[1.4rem] relative border border-zinc-800 rounded-[.5rem]"
            >
              {returnStatus(t.status)}
              <span className="text-zinc-100 text-[2rem] font-semibold mb-[.4rem] block">
                {t.name}
              </span>
              <p className="text-zinc-300 text-[1.4rem] leading-[1.3] border-b border-zinc-800 pb-[.8rem] break-words text-wrap ">
                {t.description.length > 40
                  ? t.description.slice(0, 40) + "..."
                  : t.description}
              </p>
              <div className="flex items-center mt-[.7rem]">
                {t.users?.slice(0, 3).map((u, i) => (
                  <>
                    {u.avatar ? (
                      <img
                        key={i}
                        title={u.name}
                        src={u.avatar}
                        style={{ left: -(i * 10) }}
                        className="w-[4rem] h-[4rem] relative shadow-md border rounded-full border-zinc-900 object-cover"
                      />
                    ) : (
                      <div className="w-[4rem] h-[4rem] bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center text-zinc-100 text-[1.4rem] font-medium">
                        {u.name[0].toUpperCase()}
                        {u.name.split(" ")[1][0].toUpperCase()}
                      </div>
                    )}
                    {i == 2 && (
                      <div
                        style={{ left: -(i + 1) * 10 }}
                        className="w-[4rem] h-[4rem] relative shadow-md border rounded-full border-zinc-900 object-cover bg-zinc-950 flex items-center justify-center text-zinc-50 text-[1.3rem] font-semibold"
                      >
                        +{t.users.length - 3}
                      </div>
                    )}
                  </>
                ))}
              </div>
            </div>
          ))}
      </section>
      {modal && (
        <Modal
          className={`w-[60%] md:w-[50%] xl:w-[40%] 2xl:w-[30%] p-[2rem]`}
          modal={modal}
          setModal={setModal}
          onExit={() => {
            setTitulo("");
            setDescricao("");
            setResponsaveis("");
            setSelecionarStatusNovaTarefa(false);
            setStatusAtivo("");
          }}
        >
          <form onSubmit={createNewTask}>
            <h1 className="text-zinc-50 text-[2.6rem] font-semibold mb-[.4rem]">
              Criar tarefa
            </h1>
            <p className="text-zinc-300 text-[1.4rem] mb-[2.6rem]">
              Preencha os dados da nova tarefa abaixo
            </p>
            <InputContainer>
              <InputLabel label={"Título"} id={"titulo"} />
              <Input
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                id={"titulo"}
              />
            </InputContainer>

            <InputContainer className={"mt-[1.2rem]"}>
              <InputLabel label={"Descrição"} id={"descricao"} />
              <Textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                id={"descricao"}
              />
            </InputContainer>

            <div className="mt-[1.2rem]">
              <span className="text-[2rem] font-semibold text-zinc-100 block mb-[.4rem]">
                Status
              </span>
              <Select
                activeStatus={statusAtivo}
                setActiveStatus={setStatusAtivo}
                selectStatus={selecionarStatusNovaTarefa}
                setSelectStatus={setSelecionarStatusNovaTarefa}
                label={"Selecionar"}
                options={[
                  "Não iniciada",
                  "Em andamento",
                  "Pausada",
                  "Concluída",
                ]}
              />
            </div>
            <div className="mt-[1.2rem]">
              <span className="text-[2rem]  font-semibold text-zinc-100 block mb-[.4rem]">
                Responsáveis
              </span>
              <div
                onClick={() => setSelectResponsaveis((v) => !v)}
                className="cursor-pointer flex flex-wrap p-[.9rem] dark:bg-zinc-800/50 rounded-[.5rem] dark:text-zinc-100 relative"
              >
                {responsaveis.length > 0
                  ? responsaveis.map((r, i) => (
                      <div className="flex gap-[1rem] bg-zinc-700/30 p-[.5rem] rounded-[.5rem] mr-[1rem]">
                        <img
                          src={r.avatar}
                          className="w-[2.6rem] h-[2.6rem] object-cover rounded-full"
                          alt=""
                        />
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            setResponsaveis(
                              responsaveis.filter((re) => re.name !== r.name)
                            );
                          }}
                          key={i}
                          className="flex items-center gap-[.6rem]  text-[1.5rem] font-medium  mr-[.6rem]"
                        >
                          {r.name}
                          <XCircle className="w-[1.6rem] h-[1.6rem]" />
                        </span>
                      </div>
                    ))
                  : ""}
                <ChevronDown className="w-[1.6rem] h-[1.6rem] ml-auto" />
                {selectResponsaveis && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute z-[10] flex flex-col w-full left-0 top-full bg-zinc-900 p-[.8rem] border dark:border-zinc-800 rounded-[.5rem]"
                  >
                    {project.members?.map((p, i) => (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectResponsaveis(false);
                          if (
                            responsaveis.length > 0 &&
                            responsaveis.some((r) => r.id === p.id)
                          ) {
                            setResponsaveis(
                              responsaveis.filter((r) => r.id !== p.id)
                            );
                          } else {
                            setResponsaveis([...responsaveis, p]);
                          }
                        }}
                        className="text-start flex items-center gap-[1rem] text-[1.4rem] p-[.8rem] hover:dark:bg-zinc-800/70 rounded-[.5rem] duration-200"
                        key={i}
                      >
                        <img
                          src={p.avatar}
                          className="w-[2.2rem] h-[2.2rem] rounded-full"
                          alt=""
                        />
                        {p.name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>
            <button
              type="submit"
              className="p-[1rem] bg-zinc-100 text-zinc-800 rounded-[.5rem] text-[1.4rem] font-medium mt-[1.2rem]"
            >
              Salvar tarefa
            </button>
          </form>
        </Modal>
      )}
      {activeTask && (
        <Modal
          className={`min-w-[40vw] border dark:border-zinc-800 shadow-2xl min-h-[50vh] max-w-[40vw] max-h-[90vh] overflow-y-scroll modal-task p-[2rem] px-[2rem] pb-[0] overflow-x-clip  relative`}
          modal={activeTask}
          setModal={setActiveTask}
          onExit={() => {
            setTitulo("");
            setDescricao("");
            setStatus("");
            setResponsaveis("");
            setSelecionarStatusNovaTarefa(false);
            setMaisOpcoesTarefa(false);
          }}
        >
          <div className="absolute right-4 top-4">
            <button
              onClick={() => setMaisOpcoesTarefa((v) => !v)}
              className=" p-[.5rem] rounded-[.5rem] text-zinc-300 hover:bg-zinc-800"
            >
              <MoreHorizontal />
            </button>
            {maisOpcoesTarefa && (
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-zinc-900 absolute right-0 w-max rounded-[.6rem] p-[.8rem] border border-zinc-800"
              >
                <button
                  onClick={() => {
                    deleteTask(activeTask.id);
                    setActiveTask(null);
                  }}
                  className="p-[.8rem] text-[1.3rem] font-medium flex items-center gap-[.6rem] text-zinc-300  rounded-[.5rem] hover:bg-zinc-800 hover:text-red-500 duration-200"
                >
                  <Trash2 className="w-[1.8rem] h-[1.8rem]" /> Excluir tarefa
                </button>
              </motion.div>
            )}
          </div>
          <h1 className="text-zinc-100 text-[3rem] font-semibold mb-[.4rem]">
            {activeTask.name}
          </h1>
          <p className="text-[1.6rem] text-zinc-100 mb-[2rem] leading-[1.3]">
            {activeTask.description}
          </p>
          <div className="mt-[1.2rem] grid grid-cols-[auto_1fr] gap-[1rem]">
            <div className="flex row-span-full items-center text-[1.4rem] gap-[.6rem] text-zinc-400 font-medium">
              <Users className="w-[1.8rem] h-[1.8rem]" />
              <span>Responsáveis</span>
            </div>
            <div className="flex flex-wrap gap-[1rem]">
              {activeTask.users.map((u) => (
                <div
                  className="flex items-center w-fit text-[1.4rem] font-medium gap-[.6rem] text-zinc-100"
                  key={u.id}
                >
                  <img
                    src={u.avatar}
                    className="w-[3rem] h-[3rem] rounded-full"
                    alt=""
                  />
                  <p>{u.name}</p>
                </div>
              ))}
              <div className="relative">
                {project.members.length !== activeTask.users.length && (
                  <button
                    onClick={() => setAdicionarMembro((v) => !v)}
                    className="border border-zinc-800 text-[1.4rem] gap-[.6rem] w-fit flex items-center text-zinc-300 p-[.8rem] rounded-[.5rem]"
                  >
                    <UserPlus className="w-[1.6rem] h-[1.6rem]" />
                    Adicionar
                  </button>
                )}
                {adicionarMembro && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-[.8rem] border absolute left-0 w-max border-zinc-800 bg-zinc-900 rounded-[.6rem]"
                  >
                    {project?.members
                      ?.filter(
                        (member) =>
                          !activeTask.users.some(
                            (user) => user.id === member.id
                          )
                      )
                      .map((u) => (
                        <button
                          onClick={() => {
                            setAdicionarMembro(false);
                            const alreadyAssigned = responsaveis.some(
                              (responsavel) => responsavel.id === u.id
                            );

                            if (!alreadyAssigned) {
                              const updatedResponsaveis = [...responsaveis, u];
                              setResponsaveis(updatedResponsaveis);
                              changeTask({
                                id: activeTask.id,
                                status,
                                responsaveis: updatedResponsaveis,
                              });
                            }
                          }}
                          className="flex p-[.3rem] rounded-[.5rem] hover:bg-zinc-800 items-center text-[1.4rem] font-medium gap-[.6rem] text-zinc-100"
                          key={u.id}
                        >
                          <img
                            src={u.avatar}
                            className="w-[3rem] rounded-full object-cover"
                            alt=""
                          />
                          <p>{u.name}</p>
                        </button>
                      ))}
                  </motion.div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center mt-[1.6rem] gap-[1rem]">
            <div className="flex items-center gap-[.6rem] text-[1.4rem] font-medium text-zinc-400">
              <Activity className="w-[1.8rem] h-[1.8rem]" />
              <span>Status</span>
            </div>
            <div className="relative">
              <button
                onClick={() => foundUser && setChangeStatus((v) => !v)}
                className="bg-zinc-800 text-zinc-100 font-medium p-[.6rem] px-[1rem] rounded-[.5rem] text-[1.4rem] "
              >
                {activeTask.status}
              </button>
              {changeStatus && foundUser && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute w-max z-[3] flex flex-col p-[1rem] rounded-[.6rem] border border-zinc-800 bg-zinc-900"
                >
                  {statusOptions.map((o, i) => (
                    <button
                      onClick={() => {
                        setStatus(o);
                        setActiveTask({ ...activeTask, status: o });
                        setChangeStatus(false);
                        changeTask({ id: activeTask.id, status: o });
                      }}
                      key={i}
                      className="hover:bg-zinc-800 flex items-center gap-[.6rem] text-zinc-100 font-medium p-[.8rem] px-[1rem] rounded-[.5rem] text-[1.4rem] "
                    >
                      {o === activeTask.status ? (
                        <Check className="w-[1.6rem] h-[1.6rem]" />
                      ) : (
                        <Check className="opacity-0 w-[1.6rem] h-[1.6rem]" />
                      )}
                      {o}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
          <div className="mt-[2rem] border-b-2 border-zinc-800">
            {sectionsTask.map((s, i) => (
              <button
                onClick={() => {
                  setActiveSectionTask(i);
                }}
                key={i}
                className={clsx(
                  "text-zinc-100 text-[1.4rem] font-semibold p-[1rem] duration-200 ease-in-out border-b-2",
                  {
                    "border-zinc-100": activeSectionTask === i,
                    "border-transparent": activeSectionTask !== i,
                  }
                )}
              >
                {s}
              </button>
            ))}
          </div>

          <motion.div
            ref={messagesContainer}
            className="max-h-[50vh] min-h-[50vh] modal-task overflow-y-auto overflow-x-clip flex flex-col gap-[2rem] mt-[1.2rem] relative"
          >
            {messages.map((m, i) => (
              <div
                onMouseOver={() => {
                  setActiveMessage(m);
                  setActiveMessageOptions(true);
                }}
                onMouseLeave={() => {
                  if (!activeMessageOptions) {
                    setActiveMessage(null);
                    setAddReaction(false);
                  }
                  if (activeMessageOptions) {
                    setActiveMessageOptions(false);
                  }
                }}
                key={i}
                className={clsx(
                  "flex gap-[.6rem] hover:bg-zinc-800/30 relative",
                  {
                    "mt-[2rem]":
                      i > 0 &&
                      messages[i - 1].reactions &&
                      messages[i - 1].reactions.length > 0,
                  }
                )}
              >
                {addReaction && activeMessage.id === m.id && (
                  <div className="absolute right-24 z-[2]">
                    <Picker
                      set="apple"
                      onEmojiSelect={(d) => {
                        addReactionToMessage(m.id, user.id, d.native);
                      }}
                      locale="pt"
                      previewPosition="none"
                      theme="dark"
                    />
                  </div>
                )}
                {activeMessageOptions &&
                  activeMessage &&
                  activeMessage.id === m.id && (
                    <motion.div
                      onMouseLeave={() => {
                        setActiveMessageOptions(false);
                      }}
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-zinc-900 z-[3] w-fit absolute flex-col p-[.5rem] rounded-[.6rem] border top-[80%] right-0 dark:border-zinc-800 flex gap-[.3rem] dark:text-zinc-400 text-[1.4rem] font-medium"
                    >
                      <button
                        onClick={() => setAddReaction((v) => !v)}
                        className="p-[.5rem] hover:bg-zinc-800 rounded-[.5rem] flex items-center gap-[.6rem]"
                      >
                        <Smile className="w-[2rem] h-[2rem]" />
                        Adicionar reação
                      </button>
                      {activeMessage.userId === user.id && (
                        <>
                          <button className="p-[.5rem] hover:bg-zinc-800 rounded-[.5rem] flex items-center gap-[.6rem]">
                            <PenBox className="w-[2rem] h-[2rem]" />
                            Editar
                          </button>
                          <button
                            onClick={() => deleteMessages(m.id, activeTask.id)}
                            className="p-[.5rem] hover:bg-zinc-800 rounded-[.5rem] text-red-400 flex items-center gap-[.6rem]"
                          >
                            <Trash2 className="w-[2rem] h-[2rem]" />
                            Excluir
                          </button>
                        </>
                      )}
                      {/* <button className="p-[.3rem] hover:bg-zinc-700 rounded-[.5rem]">
                      <MoreHorizontal className="w-[2rem] h-[2rem]" />
                    </button> */}
                    </motion.div>
                  )}
                <img
                  src={m.avatar}
                  className="w-[4rem] h-[4rem] rounded-full"
                  alt=""
                />
                <div>
                  <div className="flex items-center gap-[.6rem]">
                    <span className="text-[1.6rem] font-semibold text-zinc-100">
                      {m.name}
                    </span>
                    <p className="text-zinc-400 text-[1.2rem]">
                      {dayjs(m.sendAt).fromNow()}
                    </p>
                  </div>
                  <div
                    className="bg-zinc-800 p-[.6rem] rounded-[.5rem] mt-[.4rem] relative"
                    ref={(el) => (messageRef.current[i] = el)}
                  >
                    {m.files.length > 0 && (
                      <div className="flex">
                        {m.files.map((f, i) => {
                          if (f.type.includes("image")) {
                            return (
                              <img
                                className="w-[30%] h-[10rem] object-cover cursor-pointer"
                                key={i}
                                src={f.url}
                              />
                            );
                          }
                        })}
                      </div>
                    )}
                    <div
                      dangerouslySetInnerHTML={{ __html: m.content }}
                      className="message break-words break-all leading-[1.3] text-zinc-300 text-[1.6rem] "
                    ></div>
                    <div className="flex gap-[.3rem] absolute left-0 top-[90%]">
                      {m.reactions &&
                        m.reactions.map((r) => (
                          <div>
                            <button className="text-[1.4rem] p-[.5rem] rounded-[100rem] border dark:border-zinc-700 bg-zinc-900">
                              {r.reaction}
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
          <div className="flex items-center gap-[1rem] mt-[2rem] text-zinc-300 sticky bottom-[-1px] z-[3] bg-zinc-900 p-[1rem] max-h-[600px]">
            <label className="duration-200 cursor-pointer absolute left-8 top-2/4 -translate-y-2/4 bg-zinc-900/30 rounded-full p-[.8rem]">
              <input
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={loadImagesFromComputer}
              />
              <ImageIcon className="w-[2rem] h-[2rem]" />
            </label>
            <div
              className={clsx(
                "p-[1.5rem] flex flex-col modal-task leading-[1.3] pl-[5rem] w-full rounded-[.5rem] bg-zinc-800 text-[1.5rem] border-none outline-none resize-none appearance-none",
                {
                  "h-[50px]":
                    (!images || images.length == 0) && message.length <= 85,
                }
              )}
            >
              {images && images.length > 0 && (
                <div className="flex gap-[1rem] images-message overflow-x-auto pb-[1rem] mb-[1rem]">
                  {images.map((image, index) => (
                    <div
                      className="p-[1.5rem] relative dark:bg-zinc-900 rounded-[.5rem] flex-shrink-0"
                      key={index}
                    >
                      <button
                        className="absolute right-0 top-0 p-[.5rem]"
                        onClick={() => {
                          setImages((v) =>
                            v.filter((i) => i.url !== image.url)
                          );
                        }}
                      >
                        <X />
                      </button>
                      <img
                        className="h-[8rem] w-full object-cover mb-[.4rem]"
                        src={image.url}
                      />
                      <p>{image.name}</p>
                    </div>
                  ))}
                </div>
              )}
              <textarea
                ref={messageInput}
                type="text"
                value={message}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessages({
                      userId: user.id,
                      message,
                      plannrId: project.id,
                      taskId: activeTask.id,
                      files: filesMessages,
                    });
                  }
                }}
                onChange={(e) => {
                  setMessage(e.target.value);
                  adjustTextareaHeight();
                }}
                placeholder="Escreva uma mensagem..."
                className="bg-transparent w-full outline-none resize-none appearance-none modal-task"
              />
            </div>
          </div>
        </Modal>
      )}
      {modalImage && (
        <Modal
          modal={modalImage}
          setModal={setModalImage}
          onExit={() => setSelectedImage(null)}
          className={"max-w-[50%] min-w-[20%]"}
        >
          <img src={selectedImage} className="mx-auto" alt="" />
        </Modal>
      )}
      <Message
        className={"z-[2000]"}
        message={messageAlert}
        setMessage={setMessageAlert}
        {...messageAlert}
      />
    </>
  );
};

export default Tasks;
