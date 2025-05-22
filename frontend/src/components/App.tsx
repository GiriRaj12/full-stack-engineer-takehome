import React, { useEffect, useState } from "react";
import Container from "@material-ui/core/Container";
import { Typography } from "@material-ui/core";

import UserNameInputComponent from "./UserNameComponent";
import AvailableNotesComponent from "./AvailableNotesComponent";

const USER_SESSION_NAME_KEY = "Draft-Editor-Session-User-Name-Key";

export default function App() {
  const [sessionUserName, setSessionUserName] = useState("");
  const [backendURL, setBakendURL] = useState("http://localhost:3005");

  useEffect(() => {
    console.log("localstorage", localStorage.getItem(USER_SESSION_NAME_KEY));
    setSessionUserName(localStorage.getItem(USER_SESSION_NAME_KEY) || "");

    const backenURL: string | undefined = process.env.BACKEND_URL;

    if (backenURL) setBakendURL(backenURL);
    else console.log("NO BACKEND URL DECLARED !");
  }, []);

  const continueSessionAfterUserName = value => {
    console.log("Continue session", value);
    localStorage.setItem(USER_SESSION_NAME_KEY, value);
    setSessionUserName(value);
  };

  return (
    <Container maxWidth="md" style={{ marginTop: "5%" }}>
      <Typography style={{ width: "100%", textAlign: "center", margin: 5 }}>
        Joy Collaborative Editor !
      </Typography>
      {sessionUserName ? (
        <AvailableNotesComponent
          userName={sessionUserName}
          backendURL={backendURL}
        />
      ) : (
        <UserNameInputComponent
          continueSession={continueSessionAfterUserName}
        />
      )}
    </Container>
  );
}
