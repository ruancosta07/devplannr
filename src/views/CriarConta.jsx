import Header from '@/components/Header';
import {
  Input,
  InputContainer,
  InputLabel,
} from '@/components/ui/Input';
import Message from '@/components/ui/Message';
import useUserStore from '@/store/User';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Eye, EyeOff, LayoutDashboard } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const CriarConta = () => {
  const {setUser, setSigned, user, signed, loadingData} = useUserStore()
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [seePassword, setSeePassword] = useState(false);
  const [message, setMessage] = useState(null);
  const timeOut = useRef()
  const navigateTo = useNavigate()
  async function login(e) {
    e.preventDefault();
    if (email && password && name) {
      try {
        const response = (
          await axios.post('http://localhost:3000/criar-conta', {
            email,
            password,
            name
          })
        ).data;
        setMessage({
          type: 'success',
          title: 'Conta criada com sucesso',
          text: 'Você será redirecionado(a) em instantes para seu plannr...',
        });
        Cookies.set("authTokenDevPlannr", response.token, {
          expires: 7
        })
        setUser(response.user)
        setSigned(true)
        clearTimeout(timeOut.current)
        timeOut.current = setTimeout(()=> {
          navigateTo(`/${response.user.id}/plannrs`)
        }, 4000)
      } catch (err) {
        console.log(err);
        setMessage({
          type: 'error',
          title: 'Erro ao criar conta',
          text: 'Tente criar sua conta novamente, se o erro persistir, contate o suporte.',
        });
      }
    }
  }
  if(!loadingData && signed) return <Navigate to={`/${user.id}/plannrs`} />
  if(!loadingData && !signed)
  return (
    <main>
      <Header />
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <LayoutDashboard className="text-zinc-50 w-[4rem] h-[4rem] mb-[2rem]" />
        <h1 className="text-zinc-50 text-[3rem] font-semibold mb-[2rem]">
          Crie sua conta
        </h1>
        <form
          onSubmit={login}
          className=" p-[1rem] rounded-[.5rem] w-[23%]"
        >
          <InputContainer>
            <InputLabel
              label={'Nome'}
              id={'nome'}
              className={'text-[1.8rem]'}
            />
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              id={'nome'}
              className={'text-[1.4rem]'}
            />
          </InputContainer>
          <InputContainer className='mt-[2rem]'>
            <InputLabel
              label={'Email'}
              id={'email'}
              className={'text-[1.8rem]'}
            />
            <Input
              value={email}
              onChange={e => setEmail(e.target.value)}
              id={'email'}
              className={'text-[1.4rem]'}
            />
          </InputContainer>
          <InputContainer className="mt-[2rem] relative">
            <InputLabel
              label={'Senha'}
              id={'password'}
              className={'text-[1.8rem]'}
            />
            <div className="relative">
              <Input
                value={password}
                onChange={e => setPassword(e.target.value)}
                type={seePassword ? 'text' : 'password'}
                id={'password'}
                className={'text-[1.4rem] w-full'}
              />
              <button
              type='button'
                onClick={() => setSeePassword(v => !v)}
                className="text-zinc-500 absolute right-4 top-2/4 -translate-y-2/4"
              >
                {seePassword ? (
                  <EyeOff className="w-[2rem] h-[2rem]" />
                ) : (
                  <Eye className="w-[2rem] h-[2rem]" />
                )}
              </button>
            </div>
          </InputContainer>
          <button type='submit' className="bg-zinc-100 w-full text-[1.4rem] p-[1rem] rounded-[.5rem] font-semibold text-zinc-800 mt-[2rem] text-center">
           Criar conta
          </button>
        </form>
      </div>
      <Message
        setMessage={setMessage}
        message={message}
        {...message}
      />
    </main>
  );
};

export default CriarConta;
