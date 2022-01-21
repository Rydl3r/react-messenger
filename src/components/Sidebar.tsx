import { Avatar, Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField } from "@mui/material"
import AddCircleIcon from '@mui/icons-material/AddCircle';
import LogoutIcon from '@mui/icons-material/Logout';

import { collection, addDoc, updateDoc, getDocs, doc, query, arrayUnion } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { firestore, auth } from '../firebase'
import { fetchInfoAboutUser } from '../utils/fetchInfoAboutUser'

import { useNavigate } from 'react-router-dom';

import { useState, useEffect } from 'react'
import ChatPreview from './ChatPreview';
import { fetchInfoAboutChat } from "../utils/fetchInfoAboutChat";
import IUser from "../models/IUser";
import IChat from "../models/IChat";


function Sidebar(props: { user: any, setOpenedChat: (value: IChat) => void; }) {
    const [emailQuery, setEmailQuery] = useState<string>("")
    const [modalOpen, setModalOpen] = useState<boolean>(false)
    const [allUsersInfo, setAllUsersInfo] = useState<IUser[]>()
    const [currentUserInfo, setCurrentUserInfo] = useState<IUser>()

    const navigate = useNavigate()

    const createChat = async () => {
        const neededIndex: number = allUsersInfo?.findIndex((elem: any) => elem["email"] === emailQuery) as number;
        if (currentUserInfo && currentUserInfo.friends && currentUserInfo.friends.includes(emailQuery)) {
            alert('Already started chat with this user')
        }
        else if (neededIndex === -1) {
            alert('User with this email is not found. Try again!')
        }
        else {
            const docRef = await addDoc(collection(firestore, "chats"), {
                participants: [allUsersInfo![neededIndex].uid!, props.user.uid],
                content: [
                    { from: "both", message: "The chat has started" }
                ]
            });
            let newCurrentUserInfo: any = currentUserInfo
            newCurrentUserInfo.startedChats!.push(docRef.id)
            newCurrentUserInfo.friends!.push(emailQuery)
            setCurrentUserInfo(newCurrentUserInfo)
            await updateDoc(doc(firestore, "users", props.user.uid), newCurrentUserInfo)
            await updateDoc(doc(firestore, "users", allUsersInfo![neededIndex].uid), {
                friends: arrayUnion(props.user.uid),
                startedChats: arrayUnion(docRef.id)
            })
            setEmailQuery("")
            setModalOpen(false)
        }

    }

    const fetchChat = async (cid: string) => {
        let data: IChat = await fetchInfoAboutChat(cid) as IChat
        data.cid = cid
        props.setOpenedChat(data)

    }

    useEffect(() => {
        const getAllUsersInfo = async () => {
            let newArr: IUser[] = []
            const q = query(collection(firestore, "users"))
            const collectionSnap = await getDocs(q);
            collectionSnap.forEach((post) => {
                const data: IUser = post.data() as IUser
                data.id = post.id
                newArr.push(data)
            });
            setAllUsersInfo(newArr)
        }
        const getCurrentUserInfo = async () => {
            let data: IUser = await fetchInfoAboutUser(props.user.uid!) as IUser
            setCurrentUserInfo(data)
        }
        getCurrentUserInfo()
        getAllUsersInfo()
    }, [props.user.uid])


    return (
        <Box sx={{ backgroundColor: "white", color: "black", height: "100vh", p: 2, overflow: "auto", width: "20%" }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Avatar src={props.user.photoURL} alt={props.user.displayName!} />
                <Typography className="small_screen" variant="h6" component="h6" sx={{ px: 2 }}>
                    {props.user.displayName!}
                </Typography>
                <Button onClick={() => {
                    signOut(auth)
                    navigate('/auth')
                }}><LogoutIcon></LogoutIcon></Button>
            </Box>
            <Button sx={{ my: 2, display: "flex", mx: "auto" }} variant="contained" onClick={() => setModalOpen(true)}><AddCircleIcon /><Typography sx={{ pl: 1 }} className="small_screen">Start new chat</Typography></Button>
            <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
                <DialogTitle>Add chat</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter email of user you wish to start chatting with
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Email Address"
                        type="email"
                        fullWidth
                        value={emailQuery}
                        onChange={(e) => setEmailQuery(e.target.value)}
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setModalOpen(false)}>Cancel</Button>
                    <Button onClick={() => createChat()}>Add</Button>
                </DialogActions>
            </Dialog>
            {currentUserInfo && currentUserInfo.startedChats && currentUserInfo.startedChats.length > 0
                ? currentUserInfo.startedChats.map((chat: string) => <ChatPreview key={chat} currentUser={props.user.uid} chat={chat} fetchChat={fetchChat} />)
                : ""}
        </Box >
    )
}

export default Sidebar