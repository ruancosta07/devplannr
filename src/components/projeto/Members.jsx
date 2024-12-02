import { Check, ChevronDown, MoreHorizontal } from 'lucide-react'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { UserX } from 'lucide-react'
import axios from 'axios'
import useUserStore from '@/store/User'
import Cookies from 'js-cookie'
import Show from '../utils/ShowComponent'
const Members = ({ socket, project, reloadProject, members, projectId }) => {
  const { user } = useUserStore()
  const [activeUserRoleOptions, setActiveUserRoleOptions] = useState(false)
  const [activeUserOptions, setActiveUserOptions] = useState(null)
  function returnRole(role) {
    if (role === 'admin') {
      return 'Administrador'
    } else if (role === 'member') {
      return 'Membro'
    }
  }

  async function removeUser(id) {
    try {
      const response = (
        await axios.post(`http://localhost:3000/${projectId}/${id}/remover-usuario`, {
          headers: {
            Authorization: `Bearer ${Cookies.get('authTokenDevPlannr')}`,
          },
        })
      ).data
      socket.current.emit('removeUser', id)
      reloadProject()
    } catch (err) {
      console.log(err)
    }
  }

  async function changeUserRole({id, role}){
    try {
      const response = (await axios.patch(`http://localhost:3000/${projectId}/alterar-cargo`, {
        userId:id,
        role
      }, {
        headers: {
          Authorization: `Bearer ${Cookies.get('authTokenDevPlannr')}`
        }
      })).data
     reloadProject()
    } catch (err) {
      console.log(err)
    }
  }
  

  return (
    <>
      <section className="flex flex-col gap-[1rem] mt-[2rem]">
        {members.map((m) => (
          <div className="flex items-center gap-[1.2rem] border-b border-zinc-800 py-[1rem]">
            <img src={m.avatar} className="w-[5rem] h-[5rem] object-cover rounded-full" alt="" />
            <div>
              <span className="text-zinc-100 text-[1.8rem] font-semibold mb-[.15rem] block">{m.name}</span>
              <p className="text-zinc-300 text-[1.3rem]">{m.email}</p>
            </div>
            <Show when={m.id !== user.id && members.find((u) => u.id === user.id).role === 'admin'}>
            <div className="ml-auto flex items-center gap-[1rem] relative">
                <button
                  onClick={() => project.userId!== m.id && setActiveUserRoleOptions((v) => (v ? null : m))}
                  className="text-zinc-400 text-[1.4rem] ml-auto flex items-center gap-[.6rem]"
                >
                  {returnRole(m.role)}
                 {project.userId!== m.id && <ChevronDown className="w-[1.4rem] h-[1.4rem]" />}
                </button>
                <Show when={activeUserRoleOptions === m}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute top-full left-0 z-[3] bg-zinc-900 border border-zinc-800 rounded-[.5rem] p-[.8rem]"
                  >
                    <button onClick={()=> changeUserRole({id:m.id, role: "admin"})} className="text-start duration-200 flex gap-[.6rem] p-[.8rem] hover:bg-zinc-800/70 rounded-[.5rem] text-[1.3rem] text-zinc-300 w-max  leading-[1.2]">
                      <div>
                        <span className="font-semibold text-zinc-50 text-[1.6rem] block mb-[.4rem]">Administrador</span>
                        <p className="max-w-[30ch]">
                          Esse usuário possui permissões para criar, editar e excluir tarefas, além de poder excluir o
                          plannr.
                        </p>
                      </div>
                      {activeUserRoleOptions?.role === 'admin' && <Check className="w-[2rem] h-[2rem]" />}
                    </button>
                    <button onClick={()=> changeUserRole({id:m.id, role: "member"})} className="text-start flex gap-[.6rem] w-full p-[.8rem] hover:bg-zinc-800/70 rounded-[.5rem] text-[1.3rem] text-zinc-300 leading-[1.2] duration-200">
                      <div>
                        <span className="font-semibold text-zinc-50 text-[1.6rem] block mb-[.4rem]">Membro</span>
                        <p className="max-w-[30ch]">
                          Esse usuário não possui permissão de criar, editar e nem excluir tarefas, pode apenas
                          acompanhar o andamento delas.
                        </p>
                      </div>
                      {activeUserRoleOptions?.role === 'member' && <Check className="w-[2rem] h-[2rem]" />}
                    </button>
                  </motion.div>
                </Show>
                <Show when={project.userId !== m.id}>
                <div className="relative">
                  <button
                    onClick={() => setActiveUserOptions((value) => (!value ? m.id : null))}
                    className="text-zinc-300 rounded-[.5rem] p-[.5rem] hover:bg-zinc-800"
                  >
                    <MoreHorizontal className="w-[2rem] h-[2rem]" />
                  </button>
                  <Show when={activeUserOptions === m.id}>
                  <motion.div
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-[.8rem] rounded-[.6rem] border border-zinc-800 bg-zinc-900 absolute w-max"
                    >
                      <button
                        onClick={() => {
                          removeUser(m.id)
                        }}
                        className="text-zinc-100 flex text-[1.4rem] items-center gap-[.6rem] p-[.8rem] duration-200 hover:bg-zinc-800 hover:text-red-500 rounded-[.6rem]"
                      >
                        <UserX className="w-[1.8rem] h-[1.8rem]" />
                        Remover usuário
                      </button>
                    </motion.div>
                  </Show>
                </div>
                </Show>
              </div>
            </Show>
          </div>
        ))}
      </section>
    </>
  )
}

export default Members
