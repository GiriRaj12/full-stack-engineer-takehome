import {Server as SocketServer, Socket} from 'socket.io';
import { Server as HttpServer } from 'http';
import { Server as HttpsServer } from 'https';
import { randomUUID } from 'crypto';
import { SOCKET_EVENTS } from './utils/socket_enums';


const editorNotes = {}

interface CLIENT_EVENT_MESSAGE {
    id: string, 
    body: any,
}

const startSocketServer = (httpServer: HttpServer | HttpsServer) => {
  const io: SocketServer = new SocketServer(httpServer, { cors: {} });

  const editorSpace = io.of('/editor')

  const onConnection = async (socket: Socket) => {
    console.log('Connection started with socket id: ' + socket.id);

    editorSpace.emit(SOCKET_EVENTS.EMITI_CLIENT_UPDATE, editorNotes)
  };

  // const onCreateNote = async (data: any) => {
  //   const newNote = { id: randomUUID(), value: data};
  //   EditorValue[newNote.id] = newNote.value;

  //   const emitMessage: CLIENT_EVENT_MESSAGE = {
  //     id: newNote.id,
  //     body: newNote.value,
  //   }

  //   editorSpace.emit(SOCKET_EVENTS.EMIT_CLIENT_CREATE, emitMessage)
  // }

  // const onUpdateNode = async (data: any) => {
  //   EditorValue[data["id"]] = data["value"]

  //   const emitMessage: CLIENT_EVENT_MESSAGE = {
  //     id: data["id"],
  //     body: data["value"],
  //   }

  //   editorSpace.emit(SOCKET_EVENTS.EMITI_CLIENT_UPDATE, emitMessage)
  // }


  editorSpace.on(SOCKET_EVENTS.CONNECTION, onConnection);
  // editorSpace.on(SOCKET_EVENTS.CREATE_NOTES, onCreateNote);
  // editorSpace.on(SOCKET_EVENTS.UPDATE_NOTES, onUpdateNode);

  io.on(SOCKET_EVENTS.DISCONNECT, () => {
    console.log("Disconnected")
  })
};

export default startSocketServer;
