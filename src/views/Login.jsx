import Header from '@/components/Header'
import { Input, InputContainer, InputLabel } from '@/components/ui/Input'
import Message from '@/components/ui/Message'
import Show from '@/components/utils/ShowComponent'
import useUserStore from '@/store/User'
import axios from 'axios'
import Cookies from 'js-cookie'
import { Loader2 } from 'lucide-react'
import { Eye, EyeOff, LayoutDashboard } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
const Login = () => {
  const { setUser, setSigned, user, signed, loadingData } = useUserStore()
  const [email, setEmail] = useState('')
  const [emailExists, setEmailExists] = useState(false)
  const [password, setPassword] = useState('')
  const [seePassword, setSeePassword] = useState(false)
  const [message, setMessage] = useState()
  const [logged, setLogged] = useState(false)
  const timeOut = useRef()
  const navigateTo = useNavigate()
  const [loading, setLoading] = useState(false)
  const [userHaveTwoStepsAuth, setUserHaveTwoStepsAuth] = useState(undefined)
  const [userMatch, setUserMatch] = useState(false)
  const [code, setCode] = useState("")
  const [codeSent, setCodeSent] = useState(false)
  async function login(e) {
    e.preventDefault()
    if (email && password) {
      setLoading(true)
      try {
        const response = (
          await axios.post('http://localhost:3000/login', {
            email,
            password,
          })
        ).data
       if(!response.twoStepsAuth){
        setMessage({
          type: 'success',
          title: 'Login bem sucedido',
          text: 'Você será redirecionado(a) em instantes para seu plannr...',
        })
        clearTimeout(timeOut.current)
        timeOut.current = setTimeout(() => {
          Cookies.set('authTokenDevPlannr', response.token)
          setUser(response.user)
          setSigned(true)
          setLogged(true)
          navigateTo(`/${response.user.id}/plannrs`)
        }, 5000)
       }
       else{
        setCodeSent(true)
        setMessage({
          type: "success",
          title: "Email com código enviado com sucesso",
          text: "Enviamos para você um email com um código para acessar a sua conta"
        })
       }
        
      } catch (err) {
        console.log(err)
        setMessage({
          type: 'error',
          title: 'Erro ao fazer login',
          text: 'Seu email ou senha estão incorretos, tente novamente.',
        })
      } finally {
        setLoading(false)
      }
    }
  }

  async function confirmCodeLogin (value){
    setLoading(true)
    try {
      const response = (await axios.post(`http://localhost:3000/confirmar-codigo-login`, {
        email,
        password,
        code: value || code
      })).data
      setMessage({
        type: 'success',
        title: 'Login bem sucedido',
        text: 'Você será redirecionado(a) em instantes para seu plannr...',
      })
      clearTimeout(timeOut.current)
      timeOut.current = setTimeout(() => {
        Cookies.set('authTokenDevPlannr', response.token)
        setUser(response.user)
        setSigned(true)
        setLogged(true)
        navigateTo(`/${response.user.id}/plannrs`)
      }, 5000)
    } catch (err) {
      console.log(err)
    }finally{
      setLoading(false)
    }
  }

  async function confirmEmailExists(e){
    e.preventDefault()
    setLoading(true)
    try {
      const response = await axios.post(`http://localhost:3000/confirmar-email`,{
        email
      })
      setEmailExists(true)
    } catch (err) {
      setEmailExists(false)
    }finally{
      setLoading(false)
    }
  }

  if (!loadingData && signed) return <Navigate to={`/${user.id}/plannrs`} />
  if (!loadingData && !signed)
    return (
      <main>
        <Header />
        <div className="min-h-[70vh] flex flex-col items-center justify-center">
          <LayoutDashboard className="text-zinc-900 dark:text-zinc-50 w-[4rem] h-[4rem] mb-[2rem]" />
          <h1 className="text-zinc-900 dark:text-zinc-50 text-[3rem] font-semibold mb-[2rem]">Entre na sua conta</h1>
          <Show when={!codeSent}>
          <form onSubmit={ emailExists ? login: confirmEmailExists} className=" p-[1rem] rounded-[.5rem] w-[23%]">
            <InputContainer>
              <InputLabel label={'Email'} id={'email'} className={'text-[1.8rem]'} />
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id={'email'}
                className={'text-[1.4rem]'}
              />
            </InputContainer>
            <Show when={emailExists}>
            <InputContainer className="mt-[2rem] relative">
              <InputLabel label={'Senha'} id={'password'} className={'text-[1.8rem]'} />
              <div className="relative">
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={seePassword ? 'text' : 'password'}
                  id={'password'}
                  className={'text-[1.4rem] w-full'}
                />
                <button
                  type="button"
                  onClick={() => setSeePassword((v) => !v)}
                  className="text-zinc-600 dark:text-zinc-500 absolute right-4 top-2/4 -translate-y-2/4"
                >
                  {seePassword ? <EyeOff className="w-[2rem] h-[2rem]" /> : <Eye className="w-[2rem] h-[2rem]" />}
                </button>
              </div>
            </InputContainer>
            </Show>
            <button
              type="submit"
              className="bg-zinc-900 text-zinc-100 dark:bg-zinc-100 w-full text-[1.4rem] p-[1rem] rounded-[.5rem] font-semibold dark:text-zinc-800 mt-[2rem] text-center disabled:opacity-50 disabled:cursor-auto"
              disabled={loading}
            >
              {loading ? <Loader2 className="mx-auto animate-spin w-[2rem] h-[2rem]" /> : 'Fazer login'}
            </button>
          </form>
          </Show>
            <Show when={codeSent}>
          <form onSubmit={(e)=> {
            e.preventDefault()
            confirmCodeLogin()
          }} className=" p-[1rem] rounded-[.5rem] w-[23%]">
            <InputContainer className="mt-[2rem] relative">
              <InputLabel label={'Digite o código enviado abaixo'} id={'password'} className={'text-[2rem] mb-[.4rem]'} />
              <div className="relative">
                <Input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onPaste={(e)=> {
                    setTimeout(()=> {
                      confirmCodeLogin(e.target.value)
                    },0)
                  }}
                  type='text'
                  id={'password'}
                  className={'text-[1.4rem] w-full'}
                />
              </div>
            </InputContainer>
            <button
              type="submit"
              className="bg-zinc-900 text-zinc-100 dark:bg-zinc-100 w-full text-[1.4rem] p-[1rem] rounded-[.5rem] font-semibold dark:text-zinc-800 mt-[2rem] text-center disabled:opacity-50 disabled:cursor-auto"
              disabled={loading}
              >
              {loading ? <Loader2 className="mx-auto animate-spin w-[2rem] h-[2rem]" /> : 'Fazer login'}
            </button>
          </form>
              </Show>
        </div>
        <Message setMessage={setMessage} message={message} {...message} />
      </main>
    )
}

export default Login
