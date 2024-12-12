import UserSigned from '@/components/UserSigned'
import React from 'react'
import { cookies } from 'next/headers';
import { Metadata } from 'next';
import Plannrs from './_components/Plannrs';
import Sidebar from '@/components/Sidebar';
type Params = Promise<{userId:string;}>
export const metadata:Metadata = {
  title: "Devplannr"
}

interface PlannrsInterface {
  id:string;
  name:string;
}

const page = async({params}:{params:Params}) => {
  const Cookies = await cookies()
  const {userId} = await params
  const token = Cookies.get("authTokenDevPlannr")?.value
  const plannrs = await (await fetch(`http://localhost:3000/${userId}/plannrs`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  })).json()
  return (
    <>
    <UserSigned/>
    <Sidebar plannrs={plannrs as Plannrs[]}/>
    <Plannrs plannrs={plannrs}/>
    </>
  )
}

export default page