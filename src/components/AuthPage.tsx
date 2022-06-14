import { Box, Typography, Button } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import LoginIcon from "@mui/icons-material/Login";

import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, firestore } from "../firebase";
import { useNavigate } from "react-router-dom";
import { setDoc, doc } from "firebase/firestore";
import IUser from "../models/IUser";

function AuthPage() {
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();

  const authWithGoogle = (): void => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        const isNewUser: boolean =
          user.metadata.creationTime === user.metadata.lastSignInTime;

        if (isNewUser) {
          let createdUser: IUser = {
            uid: user.uid,
            name: user.displayName!,
            email: user.email!,
            photoURL: user.photoURL!,
            startedChats: [],
            friends: [],
          };
          setDoc(doc(firestore, "users", user.uid), createdUser);
        }
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        mt: 5,
        p: 2,
      }}
    >
      <GoogleIcon sx={{ fontSize: "128px" }} />
      <Typography variant="h3" component="h3">
        Please, login to use React Chat
      </Typography>
      <Button
        variant="contained"
        sx={{ mt: 2, display: "flex" }}
        onClick={() => authWithGoogle()}
      >
        <LoginIcon sx={{ pr: 1 }} />
        Login
      </Button>
    </Box>
  );
}

export default AuthPage;
