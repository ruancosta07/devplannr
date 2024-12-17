import Sidebar from '@/components/Sidebar';
import UserSigned from '@/components/UserSigned';
import React from 'react'
import ProjectComp from './_components/Project';
import { Metadata } from 'next';
import {cookies} from "next/headers"
type Params  = Promise<{projectId:string}>

export async function generateMetadata({params}: {params:Params}):Promise<Metadata>{
  const cookiesStore = await cookies()
  const {projectId} = await params
  
  const response = await fetch("http://localhost:3000/" + projectId + "/unico-plannr", {
    headers: {
      "Authorization": `Bearer ${cookiesStore.get("authTokenDevPlannr")?.value}`
    },
    cache: "no-store"
  })
  const data = await response.json()
  return {
    title: data.name
  }
}

const Project = async({params}:{params:Params}) => {
  const { projectId } = await params;
  return (
    <>
    <Sidebar/>
    <UserSigned/>
    <ProjectComp projectId={projectId}/>
    </>
  )
}

export default Project