import { Box } from "@mui/material";
import Messages from "./Messages";
import Sidebar from "./Sidebar";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { v4 as uuidv4 } from "uuid";
import IChat from "../models/IChat";

function Chat() {
  const [user, loading, error] = useAuthState(auth);
  const [openedChat, setOpenedChat] = useState<IChat>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, []);

  return (
    <div>
      {user ? (
        <Box sx={{ display: "flex" }}>
          <Sidebar user={user} setOpenedChat={setOpenedChat}></Sidebar>
          <Messages
            user={user}
            key={uuidv4()}
            chat={openedChat!}
            setOpenedChat={setOpenedChat}
          ></Messages>
        </Box>
      ) : (
        "Please, login"
      )}
    </div>
  );
}

export default Chat;
