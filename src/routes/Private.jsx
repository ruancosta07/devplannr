import useUserStore from '@/store/User'
import CriarConta from '@/views/CriarConta'
import Login from '@/views/Login'
import Projeto from '@/views/Projeto'
import Projetos from '@/views/Projetos'
import axios from 'axios'
import Cookies from 'js-cookie'
import React, { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'

const Private = () => {
  const { user, theme, loadingData, signed } = useUserStore()
  if (loadingData) return null
  if (!signed && !loadingData) return <Navigate to={"/login"}/>
  if (signed && !loadingData)
    return (
      <Routes>
        <Route path="/:id/plannrs" element={<Projetos />} />
        <Route path="/:projectId" id="projeto" element={<Projeto />} />
        <Route path="*" element={<Navigate to={`/${user.id}/plannrs`} />} />
      </Routes>
    )
}

export default Private
