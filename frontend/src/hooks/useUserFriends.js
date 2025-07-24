// hooks/useUserFriends.js
import { useEffect, useState } from 'react';
import axios from 'axios';

const useUserFriends = () => {
    const [inboxUsers, setInboxUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get('http://localhost:8000/api/v1/user/inbox', {
                    withCredentials: true
                });
                setLoading(false);
                setInboxUsers(res.data.inboxUsers);
            } catch (error) {
                console.error(error);
            }
            finally {
                setLoading(false);
            }
        }
        fetchUsers(); 
    }, []);
    return { inboxUsers, loading, error };
}

export default useUserFriends;