import React, { useEffect, useRef, useState } from 'react'
import Modal from './Modal'
import { UserCircle } from 'lucide-react'
import useUserStore from '@/store/User'
import clsx from 'clsx'
import { Input, InputContainer, InputLabel } from './Input'
import Message from './Message'
import axios from 'axios'
import Cookies from 'js-cookie'
import { Loader2 } from 'lucide-react'
import { CheckCircle2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Show from '../utils/ShowComponent'
import { Settings2 } from 'lucide-react'
import { ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
const Configuracoes = ({ modal, setModal, reloadProjects, reloadProject }) => {
  const { user, setUser, setSigned, theme, setTheme } = useUserStore()
  const [sessaoAtiva, setSessaoAtiva] = useState('conta')
  const [imagemUrl, setImagemUrl] = useState(null)
  const [arquivo, setArquivo] = useState(null)
  const [message, setMessage] = useState(null)
  const [modalAlterarSenha, setModalAlterarSenha] = useState(false)
  const [senhaConfirmada, setSenhaConfirmada] = useState(false)
  const [modalAlterarEmail, setModalAlterarEmail] = useState(false)
  const [senha, setSenha] = useState('')
  const [novoEmail, setNovoEmail] = useState('')
  const [novoNome, setNovoNome] = useState('')
  const [imagemArquivo, setImagemArquivo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const [code, setCode] = useState('')
  const [emailChanged, setEmailChanged] = useState(false)
  const [passwordToConfirm, setPasswordToConfirm] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [passwordChanged, setPasswordChanged] = useState(false)
  const [selectTheme, setSelectTheme] = useState(false)
  const navigateTo = useNavigate()
  const timeOut = useRef()
  /**
   * Carrega uma imagem do computador a partir de um evento de input.
   *
   * @param {Event} event - O evento disparado pelo input.
   */
  function carregarImagemDoComputador(event) {
    const inputElement = /** @type {HTMLInputElement} */ (event.target)
    const file = inputElement.files[0]
    setImagemArquivo(file)
    if (!file || !file.type.startsWith('image/')) {
      return setMessage({
        type: 'error',
        title: 'Formato de arquivo inválido',
        text: 'Apenas arquivos no formato de imagem podem ser selecionados para alterar sua foto.',
      })
    }

    const img = new Blob([file], { type: file.type })
    setImagemUrl(URL.createObjectURL(img))
    setUser({ ...user, avatar: URL.createObjectURL(img) })
    changeUser({ id: user.id, avatar: file, email: user.email })
  }

  function ativarModal(value) {
    return setModalAlterarEmail(true)
  }

  async function confirmarSenha(id) {
    setLoading(true)
    try {
      const response = (
        await axios.post(
          `http://localhost:3000/${id}/confirmar-senha`,
          {
            password: passwordToConfirm,
          },
          {
            headers: {
              Authorization: `Bearer ${Cookies.get('authTokenDevPlannr')}`,
            },
          }
        )
      ).data
      setSenhaConfirmada(true)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }
  async function alterarSenha(id) {
    setLoading(true)
    try {
      const response = (
        await axios.patch(
          `http://localhost:3000/${id}/alterar-senha`,
          {
            password: newPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${Cookies.get('authTokenDevPlannr')}`,
            },
          }
        )
      ).data
      setPasswordChanged(true)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }
  async function changeUser({ id, email, avatar, name }) {
    try {
      const formData = new FormData()
      if (name) {
        formData.append('name', name)
      }
      if (email) {
        formData.append('email', email)
      }
      if (avatar) {
        formData.append('avatar', avatar)
      }
      const response = (
        await axios.patch(`http://localhost:3000/${id}/editar-usuario`, formData, {
          headers: {
            Authorization: `Bearer ${Cookies.get('authTokenDevPlannr')}`,
          },
        })
      ).data
      reloadProjects && reloadProjects()
      reloadProject && reloadProject()
    } catch (err) {
      console.log(err)
    }
  }
  async function enviarCodigoEmail(id) {
    setLoading(true)
    try {
      const response = (
        await axios.post(`http://localhost:3000/${id}/enviar-codigo-email`, {
          email: novoEmail,
        })
      ).data
      setCodeSent(true)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }
  async function confirmarCodigoEmail(id) {
    setLoading(true)
    try {
      const response = (
        await axios.post(`http://localhost:3000/${id}/confirmar-codigo-email`, {
          code,
          email: novoEmail,
        })
      ).data
      setEmailChanged(true)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  async function switchTwoStepsAuth(value) {
    try {
      const response = await axios.patch(
        `http://localhost:3000/${user.id}/alterar-autenticacao-dois-fatores`,
        {
          value,
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('authTokenDevPlannr')}`,
          },
        }
      )
      console.log(response.data)
      setUser({ ...user, twoStepsAuth: response.data })
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (emailChanged || passwordChanged) {
      timeOut.current = setTimeout(() => {
        navigateTo('/')
        setSigned(false)
        setUser(null)
        localStorage.removeItem('authTokenDevPlannr')
      }, 5000)
      return () => clearTimeout(timeOut.current)
    }
  }, [emailChanged, passwordChanged])

  useEffect(() => {
    if (novoNome !== '' && novoNome !== user.name) {
      setUser({ ...user, name: novoNome })
    }
  }, [novoNome])
  return (
    <>
      <Modal setModal={setModal} modal={modal} className={'grid grid-cols-[.4fr_1fr] p-0 min-w-[50%]'}>
        <aside className="bg-zinc-300/30 dark:bg-zinc-800/30 p-[1.4rem]">
          {/* <span className="text-zinc-300/50 bgz800 text-[1.4rem] font-semibold">Conta</span> */}
          <div className="user-info grid grid-cols-[auto_1fr] gap-x-[1rem] mt-[1.2rem]">
            <img src={user.avatar} className="w-[4rem] h-[4rem] object-cover row-span-2 rounded-full" alt="" />
            <span className="text-zinc-900 dark:text-zinc-100 text-[1.8rem] font-semibold">{user.name}</span>
            <p className="text-zinc-700 dark:text-zinc-400 text-[1.2rem]">{user.email}</p>
          </div>
          <ul className="mt-[1.2rem] flex flex-col gap-[.5rem]">
            <li>
              <button
                onClick={() => setSessaoAtiva('conta')}
                className={clsx(
                  'flex items-center gap-[1rem] p-[.8rem] text-zinc-900 dark:text-zinc-300 text-[1.4rem] w-full duration-200 hover:bg-zinc-700/30 rounded-[.5rem]',
                  {
                    'bg-zinc-500/30 dark:bg-zinc-700/30': sessaoAtiva === 'conta',
                    'bg-transparent': sessaoAtiva !== 'conta',
                  }
                )}
              >
                <UserCircle className="w-[2rem] h-[2rem]" />
                Minha conta
              </button>
            </li>
            <li>
              <button
                onClick={() => setSessaoAtiva('configuracoes')}
                className={clsx(
                  'flex items-center gap-[1rem] p-[.8rem] text-zinc-900 dark:text-zinc-300 text-[1.4rem] w-full duration-200 hover:bg-zinc-700/30 rounded-[.5rem]',
                  {
                    'bg-zinc-500/30 dark:bg-zinc-700/30': sessaoAtiva === 'configuracoes',
                    'bg-transparent': sessaoAtiva !== 'configuracoes',
                  }
                )}
              >
                <Settings2 className="w-[2rem] h-[2rem]" />
                Minhas configurações
              </button>
            </li>
          </ul>
        </aside>
        <div className="p-[1.4rem]">
          {sessaoAtiva === 'conta' && (
            <>
              <span className="text-zinc-800 dark:text-zinc-300 text-[1.6rem] border-b block pb-[1rem] border-zinc-400 dark:border-zinc-800">
                Meu perfil
              </span>
              <div className="my-[2rem] w-fit grid grid-cols-[auto_1fr] gap-[1rem]">
                {user.avatar && (
                  <img className="w-[8rem] h-[8rem] object-cover rounded-full" src={imagemUrl || user.avatar} />
                )}
                <InputContainer>
                  <InputLabel label={'Nome'} className="text-[1.6rem]" />
                  <Input
                    defaultValue={user.name}
                    onBlur={({ target }) => {
                      changeUser({ id: user.id, name: target.value, email: user.email })
                    }}
                    onChange={({ target }) => {
                      setNovoNome(target.value)
                    }}
                    className="p-[.8rem]"
                  />
                </InputContainer>
                <label className="text-zinc-900 dark:text-zinc-100 col-span-2 text-[1.4rem] font-medium cursor-pointer">
                  Alterar foto
                  <input type="file" accept="image/*" onChange={carregarImagemDoComputador} className="opacity-0" />
                </label>
              </div>
              <span className="text-zinc-800 dark:text-zinc-300 text-[1.6rem] border-b block pb-[1rem] border-zinc-400 dark:border-zinc-800">
                Segurança
              </span>
              <div className="mt-[2rem]">
                <InputContainer className="grid grid-cols-[auto_1fr]">
                  <InputLabel label={'Email'} className="text-[1.6rem] col-start-1" />
                  <Input
                    defaultValue={user.email}
                    onChange={(e) => setSenha(e.target.value)}
                    disabled={true}
                    className="p-0 bg-transparent text-zinc-800 hover:bg-transparent focus:bg-transparent col-start-1 dark:text-zinc-400 dark:bg-transparent dark:hover:bg-transparent dark:focus:bg-transparent"
                  />
                  <button
                    onClick={() => ativarModal(senhaConfirmada)}
                    className="ml-auto bg-zinc-300 border-zinc-400 text-zinc-800 dark:bg-zinc-900 border dark:border-zinc-800 p-[.6rem] dark:text-zinc-300 rounded-[.5rem] text-[1.4rem] w-fit"
                  >
                    Alterar email
                  </button>
                </InputContainer>
              </div>
              <div className="mt-[2rem]">
                <div className="grid grid-cols-[auto_1fr]">
                  <span className="text-[1.6rem] text-zinc-900 dark:text-zinc-100 col-start-1 font-semibold">
                    Senha
                  </span>
                  <p className="p-0 col-start-1 text-zinc-700 dark:text-zinc-400 dark:bg-transparent dark:hover:bg-transparent dark:focus:bg-transparent text-[1.4rem] mt-[1rem]">
                    Altere a sua senha de acesso a sua conta
                  </p>
                  <button
                    onClick={() => setModalAlterarSenha(true)}
                    className="ml-auto bg-zinc-300 border-zinc-400 text-zinc-800 dark:bg-zinc-900 border dark:border-zinc-800 p-[.6rem] dark:text-zinc-300 rounded-[.5rem] text-[1.4rem] w-fit"
                  >
                    Alterar senha
                  </button>
                </div>
              </div>
              <div className="mt-[2rem]">
                <div className="grid grid-cols-[auto_1fr]">
                  <span className="text-[1.6rem] text-zinc-900 dark:text-zinc-100 col-start-1 font-semibold">
                    Verificação em duas etapas
                  </span>
                  <p className="p-0 col-start-1 text-zinc-700 dark:text-zinc-400 dark:bg-transparent dark:hover:bg-transparent dark:focus:bg-transparent text-[1.4rem] mt-[1rem]">
                    Adicione mais uma camada de segurança na sua conta
                  </p>
                  <button
                    onClick={() => switchTwoStepsAuth(user.twoStepsAuth)}
                    className="ml-auto p-[.3rem] w-[5.6rem] h-[3rem] border border-zinc-800 rounded-full"
                  >
                    <div
                      className={clsx('h-[2rem] duration-200 ease-in-out w-[2rem] bg-zinc-50 rounded-full', {
                        'translate-x-[2.6rem]': user.twoStepsAuth === true,
                      })}
                    ></div>
                  </button>
                  {/* <button className="ml-auto bg-zinc-300 border-zinc-400 text-zinc-800 dark:bg-zinc-900 border dark:border-zinc-800 p-[.6rem] dark:text-zinc-300 rounded-[.5rem] text-[1.4rem] w-fit">
                    Adicionar método
                  </button> */}
                </div>
              </div>
              {modalAlterarEmail && (
                <Modal
                  modal={modalAlterarEmail}
                  setModal={setModalAlterarEmail}
                  onExit={() => {
                    setSenhaConfirmada(false)
                    setCodeSent(false)
                    setCode('')
                    setNovoEmail('')
                    setSenha('')
                  }}
                  className={'z-[11] p-[2.4rem] min-h-fit min-w-[25%]'}
                >
                  <InputContainer>
                    <InputLabel
                      label={'Confirme sua senha'}
                      className="text-[1.6rem] font-medium text-zinc-100 mb-[.4rem]"
                    />
                    <Input
                      value={senha}
                      onKeyUp={(e) => e.key === 'Enter' && confirmarSenha(user.id)}
                      onChange={(e) => setSenha(e.target.value)}
                      type="password"
                      placeholder="Senha"
                    />
                    {!senhaConfirmada && (
                      <button
                        onClick={() => confirmarSenha(user.id)}
                        disabled={loading}
                        className="text-[1.4rem] disabled:opacity-70 bg-zinc-100 p-[1rem] text-center rounded-[.5rem] font-medium mt-[1.2rem]"
                      >
                        {loading ? <Loader2 className="w-[1.6rem] h-[1.6rem] animate-spin mx-auto" /> : 'Confirmar'}
                      </button>
                    )}
                  </InputContainer>
                  {senhaConfirmada && (
                    <InputContainer className="mt-[2rem]">
                      <InputLabel
                        label={'Insira seu novo email, enviaremos um código para você'}
                        className="text-[1.6rem] font-medium text-zinc-100 mb-[.4rem]"
                      />
                      <Input
                        value={novoEmail}
                        onKeyUp={(e) => e.key === 'Enter' && enviarCodigoEmail(user.id)}
                        onChange={(e) => setNovoEmail(e.target.value)}
                        type="email"
                        placeholder="Email"
                      />
                    </InputContainer>
                  )}
                  {codeSent && (
                    <InputContainer className="mt-[2rem]">
                      <InputLabel
                        label={'Insira o código enviado abaixo'}
                        className="text-[1.6rem] font-medium text-zinc-100 mb-[.4rem]"
                      />
                      <Input
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        onKeyUp={(e) => e.key === 'Enter' && confirmarCodigoEmail(user.id)}
                        type="text"
                        placeholder="Código"
                      />
                    </InputContainer>
                  )}
                  {senhaConfirmada && !codeSent && (
                    <button
                      onClick={() => enviarCodigoEmail(user.id)}
                      disabled={loading}
                      className="text-[1.4rem] disabled:opacity-70 w-full bg-zinc-100 p-[1rem] text-center rounded-[.5rem] font-medium mt-[1.2rem]"
                    >
                      {loading ? <Loader2 className="w-[1.6rem] h-[1.6rem] animate-spin mx-auto" /> : 'Enviar código'}
                    </button>
                  )}
                  {senhaConfirmada && codeSent && (
                    <button
                      onClick={() => confirmarCodigoEmail(user.id)}
                      disabled={loading}
                      className="text-[1.4rem] disabled:opacity-70 w-full bg-zinc-100 p-[1rem] text-center rounded-[.5rem] font-medium mt-[1.2rem]"
                    >
                      {loading ? <Loader2 className="w-[1.6rem] h-[1.6rem] animate-spin mx-auto" /> : 'Alterar email'}
                    </button>
                  )}
                </Modal>
              )}
              {modalAlterarSenha && (
                <Modal className={'p-[2.4rem]'} modal={modalAlterarSenha} setModal={setModalAlterarSenha}>
                  <Show when={!senhaConfirmada}>
                    <InputContainer>
                      {/* <img src={user.avatar} className='w-[6rem] h-[6rem] rounded-full' alt="" /> */}
                      <InputLabel
                        className="max-w-[30ch] leading-[1.2]"
                        label={'Para alterar sua senha, primeiro digite sua senha atual abaixo'}
                        id={'alterarSenha'}
                      />
                      <Input
                        id={'alterarSenha'}
                        placeholder="Sua senha atual"
                        value={passwordToConfirm}
                        onKeyUp={(e) => e.key === 'Enter' && confirmarSenha(user.id)}
                        onChange={(e) => setPasswordToConfirm(e.target.value)}
                        type="password"
                      />
                      <button
                        onClick={() => confirmarSenha(user.id)}
                        disabled={loading}
                        className="text-[1.4rem] disabled:opacity-70 bg-zinc-100 p-[1rem] text-center rounded-[.5rem] font-medium mt-[1.2rem]"
                      >
                        {loading ? <Loader2 className="w-[1.6rem] h-[1.6rem] animate-spin mx-auto" /> : 'Confirmar'}
                      </button>
                    </InputContainer>
                  </Show>
                  <Show when={senhaConfirmada}>
                    <InputContainer>
                      <InputLabel
                        className="max-w-[30ch] leading-[1.2]"
                        label={'Digite a sua nova senha abaixo'}
                        id={'alterarSenha'}
                      />
                      <Input
                        id={'alterarSenha'}
                        placeholder="Sua nova senha"
                        value={newPassword}
                        onKeyUp={(e) => e.key === 'Enter' && alterarSenha(user.id)}
                        type="password"
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <button
                        onClick={() => alterarSenha(user.id)}
                        disabled={loading}
                        className="text-[1.4rem] disabled:opacity-70 bg-zinc-100 p-[1rem] text-center rounded-[.5rem] font-medium mt-[1.2rem]"
                      >
                        {loading ? <Loader2 className="w-[1.6rem] h-[1.6rem] animate-spin mx-auto" /> : 'Alterar senha'}
                      </button>
                    </InputContainer>
                  </Show>
                </Modal>
              )}
              {emailChanged && (
                <Modal
                  modal={emailChanged}
                  setModal={setEmailChanged}
                  onExit={() => {
                    setSigned(false)
                    setUser(null)
                    navigateTo('/login')
                  }}
                  className={'p-[2rem] min-w-[25%] max-w-[25%]'}
                >
                  <CheckCircle2 className="text-zinc-100 w-[3.6rem] h-[3.6rem] mb-[1rem]" />
                  <span className="text-zinc-100 text-[2rem] font-semibold mb-[.4rem] block">
                    Email alterado com sucesso
                  </span>
                  <p className="text-zinc-300 text-[1.4rem] leading-[1.3]">
                    Você será desconectado da sua conta para poder entrar com o seu novo email.
                  </p>
                  <Link
                    to={'/'}
                    className="p-[1rem] bg-zinc-100 text-zinc-800 w-full text-center mt-[1.2rem] text-[1.4rem] font-semibold rounded-[.5rem] block"
                  >
                    Entrar novamente
                  </Link>
                </Modal>
              )}
              {passwordChanged && (
                <Modal
                  modal={passwordChanged}
                  setModal={setPasswordChanged}
                  onExit={() => {
                    setSigned(false)
                    setUser(null)
                    navigateTo('/login')
                  }}
                  className={'p-[2rem] min-w-[25%] max-w-[25%]'}
                >
                  <CheckCircle2 className="text-zinc-100 w-[3.6rem] h-[3.6rem] mb-[1rem]" />
                  <span className="text-zinc-100 text-[2rem] font-semibold mb-[.4rem] block">
                    Senha alterada com sucesso
                  </span>
                  <p className="text-zinc-300 text-[1.4rem] leading-[1.3]">
                    Você será desconectado da sua conta para poder entrar com o sua nova senha.
                  </p>
                  <Link
                    to={'/'}
                    className="p-[1rem] bg-zinc-100 text-zinc-800 w-full text-center mt-[1.2rem] text-[1.4rem] font-semibold rounded-[.5rem] block"
                  >
                    Entrar novamente
                  </Link>
                </Modal>
              )}
            </>
          )}
          {sessaoAtiva === 'configuracoes' && (
            <>
              <span className="text-zinc-800 dark:text-zinc-300 text-[1.6rem] border-b block pb-[1rem] border-zinc-400 dark:border-zinc-800">
                Minhas configurações
              </span>
              <div className="mt-[2rem]">
                <div className="grid grid-cols-[auto_1fr] relative">
                  <span className="text-[1.6rem] text-zinc-900 dark:text-zinc-100 col-start-1 font-semibold">
                    Aparência
                  </span>
                  <p className="p-0 col-start-1 text-zinc-700 dark:text-zinc-400 dark:bg-transparent dark:hover:bg-transparent dark:focus:bg-transparent text-[1.4rem] mt-[1rem]">
                    Personalize o devplannr no seu dispositivo
                  </p>
                  <button
                    onClick={() => setSelectTheme((v) => !v)}
                    className="ml-auto bg-zinc-300 border-zinc-400 text-zinc-800 dark:bg-zinc-800/30 p-[.6rem] px-[1rem] dark:text-zinc-300 flex items-center gap-[.6rem] rounded-[.5rem] text-[1.4rem] w-fit"
                  >
                    {theme === 'dark' ? 'Escuro' : 'Claro'}
                    <ChevronDown className="w-[1.8rem] h-[1.8rem]" />
                  </button>
                  {selectTheme && (
                    <motion.div
                      className="dark:bg-zinc-900 text-zinc-900 border bg-zinc-300 border-zinc-300 dark:border-zinc-800 dark:text-zinc-100 text-[1.4rem] font-medium w-[20%] p-[.7rem] rounded-[.5rem] absolute right-0 top-[110%] z-[3]"
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <button onClick={()=> {setSelectTheme(false); setTheme("light")}} className="p-[.7rem] rounded-[.5rem] hover:bg-zinc-400/50 hover:dark:bg-zinc-800/50 w-full flex items-center gap-[.6rem]">
                        <Check
                          className={clsx('w-[1.6rem] h-[1.6rem]', {
                            'opacity-0': theme !== 'light',
                          })}
                        />
                        Claro
                      </button>
                      <button onClick={()=> {setSelectTheme(false);setTheme("dark")}} className="p-[.7rem] rounded-[.5rem] hover:bg-zinc-400/50 hover:dark:bg-zinc-800/50 w-full flex items-center gap-[.6rem]">
                        <Check
                          className={clsx('w-[1.6rem] h-[1.6rem]', {
                            'opacity-0': theme !== 'dark',
                          })}
                        />
                        Escuro
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        <Message className="z-[20]" setMessage={setMessage} message={message} {...message} />
      </Modal>
    </>
  )
}

export default Configuracoes
