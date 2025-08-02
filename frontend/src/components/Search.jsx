import React, { useEffect, useState } from 'react';
import { Input } from './ui/input';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from './ui/avatar';
import axios from 'axios';

const Search = () => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
  const delayDebounce = setTimeout(() => {
    if (query.trim()) {
      axios
        .get(`http://localhost:8000/api/v1/user/users/search?q=${query}`, {
          withCredentials: true,
        })
        .then((res) => {
          console.log('API response:', res.data);
          if (Array.isArray(res.data)) {
            setUsers(res.data);
          } else {
            setUsers([]);
            console.warn('Unexpected API response structure.');
          }
        })
        .catch((err) => {
          console.error('Search error:', err);
          setUsers([]);
        });
    } else {
      setUsers([]);
    }
  }, 300);

  return () => clearTimeout(delayDebounce);
}, [query]);


  return (
    <div className='p-6'>
      <div className='flex flex-col space-y-7 mb-6'>
        <h1 className='font-bold text-3xl'>Search</h1>
        <Input
          type='text'
          placeholder='Search users...'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Searched users */}
      <div className='space-y-4'>
        {users.map((user) => (
          <div
            key={user._id}
            className='flex items-center space-x-4 p-2 rounded-md hover:bg-gray-100 transition-colors'
          >
            <Avatar>
              <AvatarImage
                src={user.profilePicture || '/defaultimg.jpg'}
                alt={user.username}
              />
              <AvatarFallback>
                {user.username?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div>
              <p className='font-medium'>{user.username}</p>
              <p className='text-sm text-gray-500'>{user.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;
