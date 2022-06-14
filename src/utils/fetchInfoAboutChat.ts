import { firestore } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export const fetchInfoAboutChat = async (uid: string) => {
  const docRef = doc(firestore, "chats", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  }
};
