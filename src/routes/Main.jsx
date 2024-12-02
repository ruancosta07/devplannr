import CriarConta from '@/views/CriarConta'
import Login from '@/views/Login'
import React, { useEffect } from 'react'
import { Route, Routes, } from 'react-router-dom'
import Private from './Private'
import useUserStore from '@/store/User'
import Cookies from 'js-cookie'
import axios from 'axios'
import Home from '@/views/Home'
const Main = () => {
  const { theme, setTheme, setLoadingData, setUser, setSigned,signed , user,} = useUserStore()
  useEffect(() => {
    async function verifyToken() {
      const token = Cookies.get('authTokenDevPlannr')
      if (token) {
        try {
          const response = (
            await axios.post(
              "https://devplannrapi-production.up.railway.app/validar-token",
              {},
              {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }
            )
          ).data
          setSigned(true)
          setUser(response.user)
        } catch (err) {
          setSigned(false)
          setUser(null)
        } finally {
          setLoadingData(false)
        }
      } else {
        setLoadingData(false)
        setSigned(false)
        setUser(null)
      }
    }
    verifyToken()
  }, [])
  useEffect(() => {
    function loadTheme() {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
    loadTheme()
    localStorage.setItem('theme', theme)
  }, [theme])
  // useEffect(()=> {
  //   const pressedKeys = new Set()
  //   function removeConsole(e){
  //     pressedKeys.add(e.key.toLowerCase())
  //     if(e.key === "F12"){
  //       e.preventDefault()
  //     }
  //     if(pressedKeys.has("control") && pressedKeys.has("shift") && pressedKeys.has("i")){
  //       e.preventDefault()
  //     }
  //   }
  //   const handleKeyUp = (e)=> {
  //     pressedKeys.delete(e.key.toLowerCase())
  //   }
  //   window.addEventListener("keydown", removeConsole)
  //   window.addEventListener("keyup", handleKeyUp)
  //   return()=> {
  //     window.removeEventListener("keydown", removeConsole)
  //     window.removeEventListener("keyup", handleKeyUp)
  //   }
  // },[])
  return (
    <>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/criar-conta" element={<CriarConta />} />
      <Route path='/*' element={<Private/>} />
    </Routes>
    </>
  )
}

export default Main
