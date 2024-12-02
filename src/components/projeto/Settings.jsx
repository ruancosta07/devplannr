import React from 'react'
import { Input, InputContainer, InputLabel, Textarea } from '../ui/Input'
import { twMerge } from 'tailwind-merge'

const Settings = ({ project }) => {
  return (
    <section className="mt-[1.2rem]">
      <h1 className="text-zinc-50 text-[3rem] font-semibold">Configurações do plannr</h1>
      <InputContainer className={'mt-[2rem]'}>
        <InputLabel label={'Banner'} />
        <div className={twMerge(`h-[200px] w-full rounded-[.5rem]`, project.banner)}></div>
        {/* <Input/> */}
      </InputContainer>
      <InputContainer className={'mt-[1.2rem]'}>
        <InputLabel label={'Título'} />
        <Input />
      </InputContainer>
      <InputContainer className={'mt-[1.2rem]'}>
        <InputLabel label={'Descrição'} />
        <Textarea />
      </InputContainer>
      <InputContainer className={'mt-[1.2rem]'}>
        <InputLabel label={'Icone'} />
        <Input />
      </InputContainer>
    </section>
  )
}

export default Settings
