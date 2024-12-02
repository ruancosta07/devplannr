import React, { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import Sidebar from '@/components/ui/Sidebar'
import LoggedHeader from '@/components/HeaderProject'
import useUserStore from '@/store/User'
import dayjs from '@/utils/dayjs'
import { File, History } from 'lucide-react'
import { useQuery } from 'react-query'
import axios from 'axios'
import Modal from '@/components/ui/Modal'
import { Input, InputContainer, InputLabel } from '@/components/ui/Input'
import HeaderProject from '../components/HeaderProject'
import { io } from 'socket.io-client'
import Loader from '@/components/ui/Loader'
import useAppStore from '@/store/App'
import Cookies from 'js-cookie'
import clsx from 'clsx'
import Show from '@/components/utils/ShowComponent'
const Projetos = () => {
  const { id } = useParams()
  const { user } = useUserStore()
  const { setPlannrs, plannrs } = useAppStore()
  const [createPlannr, setCreatePlannr] = useState(false)
  const [newPlannrName, setNewPlannrName] = useState('')
  const [invites, setInvites] = useState([])
  const socket = useRef()

  useEffect(() => {
    socket.current = new io('https://devplannrapi-production.up.railway.app', {
      query: {
        userId: user.id,
      },
    })
    socket.current.on('connect', () => {
      socket.current.emit('usersOnline', user)
    })

    socket.current.on("acceptInvite", ()=> {
      reloadProjects()
    })

    // socket.current.on('usersOnline', (msg) => {
    //   // console.log(msg)
    // })

    socket.current.on('createTask', (msg) => {
      setTasks2(msg)
    })

    socket.current.on('invites', (msg) => {
      setInvites(msg)
    })

    return () => {
      socket.current.disconnect()
    }
  }, [])
  const {
    data: projects,
    refetch: reloadProjects,
    isFetching,
  } = useQuery(['projects', user.id], async () => {
    return (
      await axios.get(`https://devplannrapi-production.up.railway.app/${user.id}/plannrs`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('authTokenDevPlannr')}`,
        },
      })
    ).data
  })
  async function createNewPlannr(e) {
    e.preventDefault()
    try {
      const response = await axios.post(
        'https://devplannrapi-production.up.railway.app/criar-plannr',
        {
          userId: user.id,
          name: newPlannrName,
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('authTokenDevPlannr')}`,
          },
        }
      )
      reloadProjects()
      setCreatePlannr(false)
      setNewPlannrName('')
    } catch (err) {
      console.log(err)
    }
  }

  const regexBanner = /^https:\/\/[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+(:\d+)?(\/[^\s]*)?$/

  if (id !== user.id) return <Navigate to={`/${user.id}/plannrs`} />
  if (id === user.id)
    return (
      <>
        {isFetching && <Loader />}
        <HeaderProject setInvites2={setInvites} invites2={invites} socket={socket} reloadProjects={reloadProjects} />
        <div className="flex min-h-[100vh]">
          <Sidebar reloadProjects={reloadProjects} />
          <main className="max-w-[60%] py-[3rem] mx-auto w-full">
            <h1 className="text-zinc-50 text-[3rem] font-semibold">Olá, {user?.name}</h1>
            <div className="flex mt-[2rem] gap-[1rem] flex-wrap">
              {projects?.length != 0 && (
                <div className="flex items-center gap-[.6rem] w-full text-zinc-300">
                  <History className="w-[2rem] h-[2rem]" />
                  <span className="text-[1.4rem] font-medium">Acessados recentemente</span>
                </div>
              )}
              <button
                onClick={() => setCreatePlannr(true)}
                className="flex items-start w-[180px] rounded-[.5rem] bg-zinc-900 flex-col justify-start"
              >
                <div className="bg-gradient-to-tr from-zinc-800 to-zinc-900 h-[50px] w-full rounded-tr-[.5rem] rounded-tl-[.5rem]"></div>
                <div className="flex flex-col items-start p-[1.2rem]">
                  <div className="text-zinc-100 shadow-xl mb-[.8rem]">
                    <File className='w-[3rem] h-[3rem]'/>
                  </div>
                  <span className="text-zinc-100 text-[1.8rem] font-semibold">Criar plannr</span>
                </div>
              </button>
              {projects?.sort((a,b)=> dayjs(b.accessedIn).diff(a.accessedIn)).map((p, i) => (
                <Link
                  to={`/${p.id}`}
                  key={i}
                  className="flex items-start w-[180px] rounded-[.5rem] bg-zinc-900 flex-col justify-start relative z-[1]"
                >
                  <Show when={!p.banner && !regexBanner.test(p.banner)}>
                    <div className="bg-gradient-to-tr h-[50px] from-zinc-800 to-zinc-900 w-full rounded-[.5rem_.5rem_0_0]"></div>
                  </Show>
                  <Show when={p.banner && !regexBanner.test(p.banner)}>
                    <div className={`h-[50px] w-full rounded-[.5rem_.5rem_0_0] ${p.banner}`}></div>
                  </Show>
                  {regexBanner.test(p.banner) && (
                    <img
                      className="h-[50px] w-full object-cover object-center rounded-[.5rem_.5rem_0_0]"
                      src={p.banner}
                      alt=""
                    />
                  )}
                  <div className="flex flex-col items-start p-[1.2rem] py-[1.6rem] rounded-[0_0_.5rem_.5rem] bg-zinc-900">
                    <div className="text-zinc-100 shadow-xl mb-[.8rem]">{p.logo ? <img src={p.logo} className='w-[3rem] h-[3rem]' /> : <File />}</div>
                    <span className="text-zinc-100 text-[1.8rem] font-semibold break-words break-all leading-[1.3]">
                      {p.name.length >= 12 ? p.name.slice(0, 12) + '...' : p.name}
                    </span>

                    {/* <p className="text-zinc-300 mt-[1.2rem] text-[1.15rem]">
                      {dayjs(p.accessedIn).fromNow()}
                    </p> */}
                  </div>
                </Link>
              ))}
            </div>
          </main>
        </div>
        {createPlannr && (
          <Modal modal={setCreatePlannr} setModal={setCreatePlannr} className={'p-[2rem]'}>
            <form onSubmit={createNewPlannr}>
              <h1 className="text-zinc-100 text-[2.6rem] font-semibold mb-[.4rem]">Crie seu plannr</h1>
              <p className="text-zinc-300 text-[1.4rem]">Insira o nome do seu plannr</p>
              <InputContainer className="mt-[2rem]">
                <InputLabel label={'Nome'} id={'nome'} />
                <Input value={newPlannrName} onChange={(e) => setNewPlannrName(e.target.value)} />
              </InputContainer>
              <button
                type="submit"
                className="mt-[1.2rem] rounded-[.5rem] bg-zinc-100 p-[1rem] text-zinc-800 text-[1.4rem] font-semibold"
              >
                Criar plannr
              </button>
            </form>
          </Modal>
        )}
      </>
    )
}

export default Projetos
