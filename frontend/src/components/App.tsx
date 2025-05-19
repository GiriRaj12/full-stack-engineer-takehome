import React, { useEffect, useState } from "react";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import { CircularProgress, TextField, Typography } from "@material-ui/core";
import { io, Socket } from 'socket.io-client';

import EditorComponent from './EditorComponent'
import UserNameInputComponent from "./UserNameComponent";


const SOCKET_URL = "http://localhost:3005/editor"

const USER_SESSION_NAME_KEY = "Draft-Editor-Session-User-Name-Key"

export default function App() {
  
  const [connectionMessage, setConnectionMessage] = useState("")
  const [socketConnection, setSocketConnection] = useState()
  const [isConnected, setIsConnected] = useState(false)


  const [sessionUserName, setSessionUserName] = useState("")
  const [notes, setNotes] = useState({})


  useEffect(() => {
    console.log("Connecting ! ")
    const connection = io(SOCKET_URL)
    setSocketConnection(connection);


    connection.on("connect", () => {
      console.log("Connected to server")
      setIsConnected(true)
      setConnectionMessage(`Connected as ${connection.id}`)
    })

    
    connection.on("client::update", (data: any) => {

        console.log("Recieved this", data)
        setNotes(data);
    })


    connection.on("connect_error", () => {
      setIsConnected(false)
      setConnectionMessage("Error occrued while conntecting ! Please try later")
    })

    console.log("localstorage", localStorage.getItem(USER_SESSION_NAME_KEY))
    setSessionUserName(localStorage.getItem(USER_SESSION_NAME_KEY) || "")


    return () => {
      connection.disconnect();
    };
  }, [])




  const continueSessionAfterUserName = (value) => {
      console.log("Continue session", value)
      localStorage.setItem(USER_SESSION_NAME_KEY, value)
      setSessionUserName(value);
  }

  const getUserOrEditorComponent = () => {
    console.log("session user name", sessionUserName)

    if(sessionUserName){
      console.log("Into session user name component")
      return <EditorComponent notes={notes} socket={socketConnection} username={sessionUserName}/>
    }

    return <UserNameInputComponent continueSession={continueSessionAfterUserName} />
  }


  return (
    <Container maxWidth="md">
      <Typography>Joy Collaborative Editor !</Typography>
      {
        connectionMessage ? 
        <Typography>{connectionMessage} {sessionUserName ? `, Editing note as ${sessionUserName}` : ""}</Typography> :
        <CircularProgress/>
      }
      { isConnected ? getUserOrEditorComponent() : "" }
    </Container>
  );
}
