import { Box, Paper, IconButton, Divider, InputBase } from "@mui/material"
import SendIcon from '@mui/icons-material/Send';
import CancelIcon from '@mui/icons-material/Cancel';
import { useState } from 'react';
import { updateDoc, doc, arrayUnion } from "firebase/firestore";
import { firestore } from "../firebase";
import IChat from "../models/IChat";
import IMessage from "../models/IMessage";


function Messages(props: { chat: IChat; user: { uid: string; }; setOpenedChat: (value: IChat) => void }) {
    const [messageQuery, setMessageQuery] = useState<string>("")

    const sendMessage = async (): Promise<void> => {
        if (messageQuery !== "") {
            await updateDoc(doc(firestore, "chats", props.chat.cid!), {
                content: arrayUnion({
                    from: props.user.uid,
                    message: messageQuery
                })
            })
            let newMessages: IChat = props.chat
            newMessages.content.push({
                from: props.user.uid,
                message: messageQuery
            })
            setMessageQuery("")
        } else {
            alert('Please, input a message')
        }



    }

    return (
        <Box sx={{ position: "relative" }}>
            <Box sx={{ display: "flex", justifyContent: "center", flexDirection: "column", position: "fixed", bottom: "120px", width: "65%", ml: 4, padding: "10px 10px", height: "calc(100% - 220px)" }}>
                <Box className="messages" sx={{ padding: "0px 15px", overflow: "auto", width: "100%", height: "100%" }}>
                    {props && props.chat && props.chat.content
                        ? props.chat.content.map((item: IMessage) => (
                            <Box sx={{ marginTop: "15px", p: 2, color: "black", backgroundColor: "white", borderRadius: "10px", width: "25%", marginLeft: item.from === props.user.uid || item.from === "both" ? "auto" : "0", marginRight: item.from !== props.user.uid || item.from === "both" ? "auto" : "0", }} key={item.message + item.from}>{item.message}</Box>
                        ))
                        : ""}
                </Box>
            </Box>
            <Paper
                component="form"
                className="messageInput"
                sx={{ p: '10px 20px', display: 'flex', alignItems: 'center', position: "fixed", bottom: "20px", width: "65%", ml: 4 }}
            >
                <InputBase
                    multiline={true}
                    maxRows={3}
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Type a message"
                    inputProps={{ 'aria-label': 'type a message' }}
                    value={messageQuery}
                    onChange={(e) => setMessageQuery(e.target.value)}
                />
                <IconButton sx={{ p: '10px' }} aria-label="search" onClick={() => setMessageQuery("")}>
                    <CancelIcon />
                </IconButton>
                <Divider sx={{ height: 40, mx: 0.5 }} orientation="vertical" />
                <IconButton color="primary" sx={{ p: '10px' }} aria-label="directions" onClick={() => sendMessage()}>
                    <SendIcon />
                </IconButton>
            </Paper>
        </Box>
    )
}

export default Messages