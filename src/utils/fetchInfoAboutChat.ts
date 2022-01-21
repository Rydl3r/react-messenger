import { firestore } from '../firebase'
import { doc, DocumentData, getDoc } from "firebase/firestore";
import IChat from '../models/IChat';

export const fetchInfoAboutChat = async (uid: string) => {
    const docRef = doc(firestore, "chats", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data()
    }
}