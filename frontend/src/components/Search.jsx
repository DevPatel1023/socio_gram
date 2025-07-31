import React from 'react'
import { Input } from './ui/input'

const Search = () => {
  return (
    <div>
    <div className='flex flex-col space-y-7'>
      <h1 className='font-bold text-3xl'>Search</h1>
      <Input type='text' placeholder='Search' />
    </div>

    {/* searched users  */}
    
    </div>
  )
}

export default Search
