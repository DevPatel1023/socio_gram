import "./App.css";
import Signup from "./components/signup.jsx";
import Login from "./components/Login.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import Home from "./components/Home";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";
import MessagePage from "./components/MessagePage";
import ChatInterface from "./components/ChatInterface";
import io from "socket.io-client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSocket } from "./redux/socketSlice";
import { setOnlineUsers } from "./redux/chatSlice";

const browserRouter = createBrowserRouter([
  {
    // Routing for application's structure and all pass down the components in children to render
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/profile/:id",
        element: <Profile />,
      },
      {
        path: "/profile/edit",
        element: <EditProfile />,
      },
      {
        path: "/inbox",
        element: <MessagePage />,
        children: [
          {
            path: ":id",
            element: <ChatInterface />,
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
]);

function App() {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  useEffect(() => {
  let socketio; 

  if (user) {
    socketio = io("http://localhost:8000", {
      query: {
        userId: user._id,
      },
      transports: ["websocket"],
    });

    dispatch(setSocket(socketio));

    socketio.on("getOnlineUsers", (onlineUsers) => {
      dispatch(setOnlineUsers(onlineUsers));
    });
  }

  return () => {
    if (socketio) {
      socketio.close();
      dispatch(setSocket(null));
    }
  };
}, [user, dispatch]);


  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  );
}

export default App;
