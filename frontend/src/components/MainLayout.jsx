import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import  Sidebar from "./sidebar.jsx"

const MainLayout = () => {
  const [isOpen,setIsOpen] = useState(false);
  return (
    <div>
      <Sidebar />
      <div>
        <Outlet />
      </div>
    </div>
  )
}

export default MainLayout
