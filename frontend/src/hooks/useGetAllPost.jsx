const { useEffect } = require("react")

const useGetAllPost = () => {
    useEffect(() => {
        const fetchAllPost = async () => {
            try {
                const res = await axios.get('http://localhost:8000/api/v1/post',{
                    withCredentials : true
                });
                if(res.data.success){
                    
                }
            } catch (error) {
                
            }
        }
    })
}