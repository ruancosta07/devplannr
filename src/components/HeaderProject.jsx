import useAppStore from '@/store/App'
import useUserStore from '@/store/User'
import { UserPlus } from 'lucide-react'
import { Bell } from 'lucide-react'
import { ArrowLeftRightIcon, Menu } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Modal from './ui/Modal'
import { Input, InputContainer } from './ui/Input'
import { ChevronDown } from 'lucide-react'
import { Check } from 'lucide-react'
import axios from 'axios'
import dayjs from '@/utils/dayjs'
import { useQuery } from 'react-query'
import { ChevronsRight } from 'lucide-react'
import Cookies from 'js-cookie'
import { UserRoundPlus } from 'lucide-react'
import Show from './utils/ShowComponent'
const HeaderProject = ({ usersOnline, setInvites2, invites2, socket, project, reloadProjects }) => {
  const { sidebarActive, fixSidebar, setFixSidebar } = useAppStore()
  const { user } = useUserStore()
  const [showNotifications, setShowNotifications] = useState(false)
  const [query, setQuery] = useState('')
  const [loadingUsers, setLoadingUsers] = useState(null)
  const [selectRole, setSelectRole] = useState(false)
  const [inviteUser, setInviteUser] = useState(false)
  const [foundUsers, setFoundUsers] = useState([])
  const [loading, setLoading] = useState(null)
  async function searchUsers() {
    if (query) {
      setLoadingUsers(true)
      try {
        const response = (
          await axios.post(
            'https://devplannrapi-production.up.railway.app/procurar-usuarios',
            {
              query,
            },
            {
              headers: {
                Authorization: `Bearer ${Cookies.get('authTokenDevPlannr')}`,
              },
            }
          )
        ).data
        setFoundUsers(response)
      } catch (err) {
        console.log(err)
      } finally {
        setLoadingUsers(false)
      }
    } else {
      setFoundUsers([])
      setLoadingUsers(false)
    }
  }

  const {
    data: invites,
    isFetching: loadingInvites,
    refetch: reloadInvites,
  } = useQuery(
    ['invites', user.id],
    async () =>
      (
        await axios.get(`https://devplannrapi-production.up.railway.app/${user.id}/convites`, {
          headers: {
            Authorization: `Bearer ${Cookies.get('authTokenDevPlannr')}`,
          },
        })
      ).data
  )

  useEffect(() => {
    if (!loadingInvites) {
      setInvites2(invites)
    }
  }, [loadingInvites])

  useEffect(() => {
    searchUsers()
  }, [query])

  async function inviteUserToPlannr(id) {
    setLoading(true)
    try {
      const response = (
        await axios.post(`https://devplannrapi-production.up.railway.app/convidar-usuario`, {
          invitedUserId: id,
          invitingUserId: user.id,
          plannrId: project.id,
        })
      ).data
      socket.current.emit('invites', id)
      searchUsers()
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  async function acceptInvite(id, action) {
    setLoading(true)
    try {
      const response = await axios.post(`https://devplannrapi-production.up.railway.app/${id}/aceitar-convite`, {
        userId: user.id,
        action,
      })
      reloadInvites()
      reloadProjects()
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  // useEffect(() => {
  //   if (foundUsers) {
  //     foundUsers.map((f)=> {
  //      console.log(f.invites?.filter((i)=> i.plannrId !== project.id))
  //     })
  //   }
  // },[foundUsers])

  return (
    <>
      <header className="py-[1rem] flex px-[1rem] items-center relative">
        <button
          onClick={() => setFixSidebar((v) => !v)}
          className="dark:text-zinc-100 p-[.5rem] rounded-[.5rem] hover:bg-zinc-800"
        >
          {!sidebarActive ? <Menu /> : <ChevronsRight />}
        </button>
        <div className="ml-auto flex">
          <div className="flex">
            {usersOnline?.map((u, i) => (
              <div key={u.id}>
                <img
                  src={u.avatar}
                  alt=""
                  className={`w-[4rem] h-[4rem] rounded-full relative border dark:border-zinc-800 ${i > 0 ? 'right-4' : ''}`}
                />
              </div>
            ))}
            {project?.members?.find((m) => m.id === user.id).role === 'admin' && (
              <button
                onClick={() => setInviteUser(true)}
                style={{ right: project.members.length * 10 + 'px' }}
                className={`h-[4rem] w-[4rem] rounded-full border dark:border-zinc-800 relative bg-zinc-950 flex items-center justify-center`}
              >
                <UserRoundPlus className="text-zinc-50 w-[1.8rem] h-[1.8rem]" />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowNotifications((v) => !v)}
            className="dark:text-zinc-100 p-[.8rem] px-[.8rem] w-[4rem] flex items-center justify-center h-[4rem] rounded-full border border-zinc-800 hover:bg-zinc-800 relative"
          >
            <Bell className="w-[1.8rem] h-[1.8rem]" />
            {invites2?.filter((i) => i.accepted === null).length > 0 && (
              <div className="bg-red-500 w-3 h-3 rounded-full absolute top-3 right-[7px]"></div>
            )}
          </button>
        </div>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="min-w-[20%] z-[2] top-full min-h-[10%] bg-zinc-950 absolute right-[1rem] p-[2rem] border border-zinc-800 rounded-[.5rem]"
          >
            <button className="text-zinc-100 text-[1.4rem] font-semibold flex items-center justify-between">
              Notificações {invites2?.filter((i) => i.accepted === null).length}
            </button>
            <div className="flex flex-col gap-[2rem] mt-[2rem]">
              {invites2
                .filter((i) => i.accepted === null)
                .sort((a, b) => dayjs(b.invitedAt).diff(a.invitedAt))
                .map((i) => (
                  <div key={i.id} className="flex gap-[1rem]">
                    <UserPlus className="text-zinc-100" />
                    <div>
                      <p className="text-zinc-300 text-[1.4rem] max-w-[30ch] leading-[1.3]">
                        {i.name} convidou você para o plannr {i.plannr}
                      </p>
                      {i.accepted === null && (
                        <div className="mt-[.8rem] flex gap-[1rem]">
                          <button
                            onClick={() => acceptInvite(i.id, true)}
                            className="p-[.8rem] px-[1.2rem] bg-zinc-100 text-[1.4rem] rounded-[.5rem] font-medium"
                          >
                            Aceitar
                          </button>
                          <button
                            onClick={() => acceptInvite(i.id, false)}
                            className="p-[.8rem] px-[1.2rem] bg-zinc-900 text-zinc-100 text-[1.4rem] rounded-[.5rem] font-medium"
                          >
                            Recusar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </motion.div>
        )}
      </header>
      {inviteUser && (
        <Modal modal={inviteUser} setModal={setInviteUser} className={'p-[2rem] max-w-[40%]'}>
          <h1 className="text-[2.4rem] font-semibold text-zinc-100 mb-[.4rem]">Convidar usuário</h1>
          <p className="text-zinc-300 text-[1.4rem]">Insira o email ou nome de usuário do devplannr</p>
          <InputContainer className="mt-[2rem] flex-row gap-[1rem]">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Email ou nome de usuário"
              className="w-full"
            />
            <div className="flex gap-[1rem] relative">
              <button
                onClick={() => setSelectRole((v) => !v)}
                className="bg-zinc-800 text-zinc-100 p-[1rem] text-[1.4rem] font-medium rounded-[.5rem] flex items-center gap-[.6rem]"
              >
                Membro
                <ChevronDown className="w-[1.6rem] h-[1.6rem]" />
              </button>
              {selectRole && (
                <motion.div
                  className="p-[.8rem] w-[300%] absolute -right-full top-[110%] bg-zinc-900 border border-zinc-800 rounded-[.5rem]"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <button className="p-[.8rem] text-zinc-400 text-[1.3rem]  hover:bg-zinc-800 duration-200 rounded-[.5rem] grid grid-cols-[auto_1fr] leading-[1.5]">
                    <Check className="w-[1.8rem] h-[1.8rem] mr-[1rem] text-zinc-300" />
                    <div className="flex flex-col">
                      <span className="font-semibold text-zinc-300 text-[1.6rem] mb-[.2rem]">Membro</span>
                      <p className="leading-[1.15]">
                        Esse usuário não possui permissões para criar e nem excluir tarefas do plannr, apenas ver e
                        interagir com elas.
                      </p>
                    </div>
                  </button>
                  <button className="p-[.8rem] text-zinc-400 text-[1.3rem]  hover:bg-zinc-800 duration-200 rounded-[.5rem] grid grid-cols-[auto_1fr] leading-[1.5]">
                    <Check className="w-[1.8rem] h-[1.8rem] mr-[1rem] text-zinc-300" />
                    <div className="flex flex-col">
                      <span className="font-semibold text-zinc-300 text-[1.6rem] mb-[.2rem]">Administrador</span>
                      <p className="leading-[1.15]">
                        Esse usuário possui todas as outras permissões para criar e excluir tarefas do plannr.
                      </p>
                    </div>
                  </button>
                </motion.div>
              )}
            </div>
          </InputContainer>
          <div className="flex flex-col gap-[1rem] mt-[2rem]">
            {!loadingUsers &&
              foundUsers
                .filter((f) => !project.members.some((member) => member.id === f.id))
                .filter((f) => f.id !== user.id)
                .map((f) => {
                  return (
                    <div key={f.id} className="flex items-center gap-[1rem]">
                      <Show when={f.avatar}>
                      <img className="w-[4rem] h-[4rem] object-contain rounded-full" src={f.avatar} alt="" />
                      </Show>
                      <Show when={!f.avatar}>
                      <div className="w-[4rem] h-[4rem] border dark:border-zinc-800 flex items-center justify-center rounded-full">
                        <span className='text-[1.4rem] uppercase dark:text-zinc-100 font-semibold'>
                          {f.name[0]}
                          {f.name.split(" ")[f.name.split(" ").length - 1][0]}
                        </span>
                      </div>
                      </Show>
                      <div>
                        <span className="text-[1.6rem] font-semibold text-zinc-100 block mb-[.4rem]">{f.name}</span>
                        <p className="text-[1.2rem] text-zinc-400">{f.email}</p>
                      </div>
                      {!f.invites.some((i) => i.plannrId === project.id && i.accepted !== true) ? (
                        <button
                          onClick={() => inviteUserToPlannr(f.id)}
                          className="bg-zinc-100 ml-auto p-[1rem] text-[1.4rem] h-fit font-medium text-zinc-800 rounded-[.5rem]"
                        >
                          Convidar
                        </button>
                      ) : (
                        <button className="bg-zinc-900 border border-zinc-800 ml-auto p-[1rem] text-[1.4rem] h-fit font-medium text-zinc-100 rounded-[.5rem]">
                          Convidado
                        </button>
                      )}
                    </div>
                  )
                })}
            {(loadingUsers || loading) && (
              <svg
                className="text-zinc-50 w-[8rem] h-[8rem] mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <motion.rect
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{
                    repeat: Infinity,
                    repeatType: 'reverse',
                    duration: 0.3,
                    delay: 0.15,
                  }}
                  width="7"
                  height="5"
                  x="14"
                  y="3"
                  rx="1"
                />
                <motion.rect
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{
                    repeat: Infinity,
                    repeatType: 'reverse',
                    duration: 0.3,
                  }}
                  width="7"
                  height="9"
                  x="3"
                  y="3"
                  rx="1"
                />
                <motion.rect
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{
                    repeat: Infinity,
                    repeatType: 'reverse',
                    duration: 0.3,
                    delay: 0.3,
                  }}
                  width="7"
                  height="9"
                  x="14"
                  y="12"
                  rx="1"
                />
                <motion.rect
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{
                    repeat: Infinity,
                    repeatType: 'reverse',
                    duration: 0.3,
                    delay: 0.45,
                  }}
                  width="7"
                  height="5"
                  x="3"
                  y="16"
                  rx="1"
                />
              </svg>
            )}
            <div className="mt-[2rem]">
              <div className=" mb-[1.2rem] flex items-center gap-[1rem]">
                <span className="text-zinc-50 text-[1.6rem] font-medium block">Membros do plannr</span>
                <p className="bg-zinc-100 text-zinc-800 tabular-nums p-[.3rem] px-[.45rem] rounded-full text-[1.15rem] font-medium">
                  {project.members.length}
                </p>
              </div>
              <div className="flex flex-col gap-[1rem]">
                {project.members.map((m) => (
                  <div key={m.id} className="flex items-center gap-[1rem]">
                    <img className="w-[4rem] h-[4rem] object-contain rounded-full" src={m.avatar} alt="" />
                    <div>
                      <span className="text-[1.6rem] font-semibold text-zinc-100 block mb-[.4rem]">{m.name}</span>
                      <p className="text-[1.2rem] text-zinc-400">{m.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}

export default HeaderProject
