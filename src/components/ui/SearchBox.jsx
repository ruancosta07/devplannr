import React from 'react'
import Modal from './Modal'
import { Search } from 'lucide-react'

const SearchBox = ({modal, setModal}) => {
  return (
    <Modal modal={modal} setModal={setModal} className={"min-h-fit"}>
        <div className='bg-zinc-800/30 p-[1rem] text-[1.6rem] rounded-[.5rem] text-zinc-400 flex items-center gap-[1rem]'>
        <Search/>
        <input type="text" placeholder='Buscar plannr...' className='placeholder:text-zinc-500 bg-transparent outline-none border-none w-full' />
        </div>  
        <hr className='mt-[.8rem] block border-zinc-800'/>
    </Modal>
  )
}

export default SearchBox
