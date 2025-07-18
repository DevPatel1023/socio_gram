import React from 'react'
import Posts from './Posts'
import Story from './Story'

const Feed = () => {
  return (
    <div className='flex-1 my-8 flex flex-col items-center w-full'>
      <Story />
      <Posts />
    </div>
  )
}

export default Feed