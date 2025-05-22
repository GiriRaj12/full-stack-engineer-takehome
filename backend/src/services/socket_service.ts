import { Server as SocketServer, Socket, Namespace } from "socket.io";
import { Server as HttpServer } from "http";
import { Server as HttpsServer } from "https";
import { SOCKET_EVENTS } from "../utils/socket_enums";
import { EDITOR_NOTES_SERVICE } from "./editor_service";

const startSocketServer = (httpServer: HttpServer | HttpsServer) => {
  const io: SocketServer = new SocketServer(httpServer, {
    cors: {
      origin: "http://localhost:8080",
      methods: ["GET", "POST"],
    },
  });

  const namepSpaceRegex = /^\/[^\/]+$/;
  const currentEditorNameSpace: Namespace = io.of(namepSpaceRegex);

  //MIDDLEWARE FOR NOTE ID CHECKS
  currentEditorNameSpace.use(nameSpaceMiddleWare);

  const onConnection = (socket: Socket) => {
    const noteId = socket.nsp.name.split("/")[1];
    console.log("Connection established ! ", socket.id, noteId);

    socket.on(SOCKET_EVENTS.UPDATE_NOTES, (data, callback) => updateNote(data, callback, currentEditorNameSpace));
    socket.on("disconnect", () => {console.log("Disconnected", socket.id);});
  };

  currentEditorNameSpace.on(SOCKET_EVENTS.CONNECTION, onConnection);

  io.on(SOCKET_EVENTS.DISCONNECT, () => {console.log("Disconnected");});
};

function updateNote(data: any, callback: any, namespace: Namespace) {
  console.log("received update", data);
  const callbackResponse = { response: true };
  try {
    EDITOR_NOTES_SERVICE.UPDATE_NOTE_BY_SOCKET(data).then((res) => {
      console.log("UPDATED NOTE", res);
      namespace.emit(SOCKET_EVENTS.EMITI_CLIENT_UPDATE, res);
    });
  } catch (e) {
    callbackResponse.response = false;
  }

  callback(callbackResponse);
}

async function nameSpaceMiddleWare(socket: Socket | Namespace | any, next:void | any){
    const id = socket.nsp.name.split("/")[1];
    const note = await EDITOR_NOTES_SERVICE.GET_NOTE_BY_ID(id);

    if (
      note.response && note.status == 200 && Array.isArray(note.response)
        ? note.response.length > 0
        : Object.keys(note.response).length > 0
    ) {
      next();
    } else {
      next(new Error(`Invalid Note ID ${id}`));
    }
  }

export default startSocketServer;
