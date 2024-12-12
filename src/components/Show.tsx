import React from 'react'

const Show = ({when, children}: {when:boolean | string, children:React.ReactNode}) => {
  return (
    <>
    {when && children}
    </>
  )
}

export default Show