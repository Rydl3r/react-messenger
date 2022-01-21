import { Avatar, Box, Typography, } from "@mui/material"
import { fetchInfoAboutChat } from './../utils/fetchInfoAboutChat';
import { fetchInfoAboutUser } from './../utils/fetchInfoAboutUser';
import { useEffect, useState } from 'react'
import IChat from "../models/IChat";
import IUser from "../models/IUser";

function ChatPreview(props: { chat: string; currentUser: string; fetchChat: (arg0: string) => void; }) {
    const [data, setData] = useState<IUser>()

    useEffect(() => {
        const fetchPreview = async (): Promise<void> => {
            let chatRes: IChat = await fetchInfoAboutChat(props.chat) as IChat
            if (chatRes) {
                chatRes.participants = chatRes.participants.filter((id: string) => id !== props.currentUser)
                let user: IUser = await fetchInfoAboutUser(chatRes.participants[0]) as IUser
                if (user) {
                    setData(user)
                }
            }
        }
        fetchPreview()
    }, [props.chat, props.currentUser])

    return (
        <Box onClick={() => props.fetchChat(props.chat)} sx={{ display: "flex", alignItems: "center", borderBottom: "1px solid", p: 2, borderLeft: "none", borderRight: "none", cursor: "pointer", justifyContent: "center" }}>
            <Avatar src={data?.photoURL} alt={data?.name} />
            <Typography className="small_screen" variant="h6" component="h6" sx={{ px: 2 }}>
                {data?.name}
            </Typography>
        </Box>
    )
}

export default ChatPreview