import { Label } from "@radix-ui/react-label";
import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlide";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const {user} = useSelector((store)=>store.auth);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const changeInputHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const LoginHandler = async (e) => {
    // prevent the refreshing page when user submits data on onSubmit event
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8000/api/v1/user/login",
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        dispatch(setAuthUser(response.data.user));
        // Redirect the user
        navigate("/");
        toast.success(response.data.message);
        // after submitting data successful to backend clear states
        setInput({
          email: "",
          password: "",
        });  
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.msg || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    if(user){
      navigate('/')
    }
  },[]);

  return (
    <div className="flex items-center w-screen h-screen justify-center">
      <form
        onSubmit={LoginHandler}
        className="shadow-lg flex flex-col gap-5 p-8"
      >
        <div className="my-4">
          <h1 className="text-center font-bold text-xl">logo</h1>
          <p className="text-sm text-center">
            Login to see photos & videos from your friend
          </p>
        </div>
        <div>
          <Label className="font-medium">Email</Label>
          <Input
            type="text"
            name="email"
            value={input.email}
            onChange={changeInputHandler}
            className="focus-visible:ring-transparent my-2"
            placeholder="jhondoe@gmail.com"
            required
          />
        </div>
        <div>
          <Label className="font-medium">Password</Label>
          <Input
            type="text"
            name="password"
            value={input.password}
            onChange={changeInputHandler}
            className="focus-visible:ring-transparent my-2"
            placeholder="********"
            required
          />
        </div>
        {/* {loading ? (
          <Button><Loader2 className="mr-2 h-4 w-4 animate-spin"/>please wait</Button>
        ) : (
           <Button type="submit" disabled={loading}>{loading ? "logging in..." : "Login"}</Button>
        )} */}
        <Button type="submit" disabled={loading}>{loading ? "logging in..." : "Login"}</Button>
        <span className="text-center">
          Don't have an account {" "}
          <Link className="text-blue-500 hover:underline" to="/signup">
            signup
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Login;
