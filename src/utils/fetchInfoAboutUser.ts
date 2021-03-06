import { firestore } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export const fetchInfoAboutUser = async (uid: string) => {
  const docRef = doc(firestore, "users", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  }
};
