import { Label } from "@radix-ui/react-label";
import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const signup = () => {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });
  const {user} = useSelector((store)=>store.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const changeInputHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const signUpHandler = async (e) => {
    // prevent the refreshing page when user submits data on onSubmit event
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8000/api/v1/user/register",
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        // redirect to login
        navigate("/login");
        toast.success(response.data.message);
        setInput({
          username: "",
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
        onSubmit={signUpHandler}
        className="shadow-lg flex flex-col gap-5 p-8"
      >
        <div className="my-4">
          <h1 className="text-center font-bold text-xl">logo</h1>
          <p className="text-sm text-center">
            Signup to see photos & videos from your friend
          </p>
        </div>
        <div>
          <Label className="font-medium">Username</Label>
          <Input
            type="text"
            name="username"
            value={input.username}
            onChange={changeInputHandler}
            className="focus-visible:ring-transparent my-2"
            placeholder="jhon doe"
            required
          />
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
        <Button type="submit" disabled={loading}>
          {loading ? "signing in..." : "Signup"}
        </Button>
        <span className="text-center">
          Already have an account ?{" "}
          <Link className="text-blue-500 hover:underline" to="/login">
            Login
          </Link>
        </span>
      </form>
    </div>
  );
};

export default signup;
