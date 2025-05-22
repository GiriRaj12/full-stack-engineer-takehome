import React, {useState, useEffect} from 'react'
import {Editor, EditorState, RichUtils, ContentState} from 'draft-js';
import 'draft-js/dist/Draft.css';
import { Button, CircularProgress, Container, Typography } from '@material-ui/core';
import { io, Socket } from 'socket.io-client';

function EditorComponent(props){
    
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [isConnected, setIsConnected] = useState(false);
    const [connectionMessage, setConnectionMessage] = useState("")
    const [socket, setSocketConnection] = useState<any>(null);
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);

    const removeConnectionMessage = () => {
        setTimeout(() => {
            setConnectionMessage("")
        }, 5000)
    }

    useEffect(() => {
        if(!(props.note && props.note.note_id))
            return;
        
        const SOCKET_URL = `${props.backendURL}/${props.note.note_id}`;

        console.log("Connecting ! ", SOCKET_URL)
        
        const socketCon: Socket = io(SOCKET_URL);

        socketCon.on("connect", () => {
            setSocketConnection(socketCon)
            console.log("Connected to server")

            setIsConnected(true)
            setConnectionMessage(`Connected to note with connection id : ${socketCon.id}`)
            
            removeConnectionMessage()
        })
            
        socketCon.on("client::update", (data: any) => {
            console.log("received", data, data.status, data.response)
            if(!(data && data.status && data.response)){
                setConnectionMessage("Error while updateing, please refresh")
                removeConnectionMessage()
                return;
            }


            console.log("update_event - triggered", data);
            setIsLoadingUpdate(true)
            setConnectionMessage("Received an update ! Please wait !")
            props.setUpdatedNote(data.response)
            props.pullNotes()


            setEditorState(EditorState.createWithContent(ContentState.createFromText(data.response.body)))
            setIsLoadingUpdate(false)
            setConnectionMessage("Done updating note !")
            
            removeConnectionMessage()
        })

        socketCon.on("connect_error", () => {
            setIsConnected(false)
            setConnectionMessage("Error occrued while conntecting ! Please try later")
            
            removeConnectionMessage()
        })


        return () => {
            socketCon.disconnect();
        };

    }, [])


    useEffect(() => {
        const currentNote = props.note
        setEditorState(EditorState.createWithContent(ContentState.createFromText(currentNote.body)))
    }, [])


    const returnBackToTableView = () => {
        props.returnBackToTableView()
    }

    const updateNote = () => {

        console.log("updating note !")

        const updateBody = {
            "note_id": props.note.note_id,
            "body": editorState.getCurrentContent().getPlainText('\u0001'),
            "username": props.userName
        }

        console.log("emitting", updateBody)

        if(!isConnected)
            return;

        setIsLoadingUpdate(true)
        socket.emit("update_note", updateBody, (response:any) => {
            console.log(response);
            if(response.response){
                setIsLoadingUpdate(false)
            } else {
                setIsLoadingUpdate(false);
                setConnectionMessage("Cannot update right now, Please try later !")
                removeConnectionMessage()
            }
        })
    }
    
    return (
        <Container>
                <Button onClick={returnBackToTableView}>BACK</Button>
                <Typography>Note Name : {props.note['name']}</Typography>
                <Typography>{connectionMessage}</Typography>
                <div style={{border: '1px solid gray', minHeight: '6em'}}>
                    <Editor editorState={editorState} onChange={setEditorState} />;
                </div>
                <Button disabled={!isConnected || isLoadingUpdate} onClick={updateNote}>{isLoadingUpdate ? <CircularProgress/> : `Submit`}</Button>
        </Container>)
}

export default EditorComponent;