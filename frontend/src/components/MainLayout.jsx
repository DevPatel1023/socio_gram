import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from "./sidebar.jsx"

const MainLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      {/* Main content area with proper spacing for both desktop sidebar and mobile bottom nav */}
      <main className="md:ml-16 lg:ml-64 pb-16 md:pb-0">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default MainLayout