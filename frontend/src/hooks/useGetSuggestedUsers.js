import { setSuggestedUsers } from "@/redux/authSlide";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useSuggestedUsers = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchSuggestedUsers = async () => {
            try {
                const res = await axios.get('http://localhost:8000/api/v1/user/suggesteduser',{
                    withCredentials : true
                });
                if(res.data.success){
                    dispatch(setSuggestedUsers(res.data.users));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchSuggestedUsers();
    },[]);
}

export default useSuggestedUsers;