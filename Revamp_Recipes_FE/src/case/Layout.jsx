import React from 'react'
import { useProfileUser } from './useProfileUser'
import { Profile } from "./Profile"

const Layout = () => {

  const user = useProfileUser();


  return (
    <div>
      <h1>Halaman Profile User</h1>
      <Profile user={user}/>
        <button className='bg-red-500 rounded p-1 text-white uppercase'>click</button>
    </div>
  )
}


export default Layout