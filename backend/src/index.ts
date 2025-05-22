import express from "express";
import cors from "cors";
import { Server as HttpServer, createServer as createHttpServer } from "http";
import startSocketServer from "./services/socket_service";
import { DB_Response } from "./utils/db";
import { EDITOR_NOTES_SERVICE } from "./services/editor_service";

const app = express();

app.use(cors());
app.use(express.json());

let httpServer: HttpServer;
httpServer = createHttpServer(app);

startSocketServer(httpServer);

httpServer.listen(3005, () => {
  console.info(`Listening on 3005`);
});

app.get("/api/notes", async (req, res) => {
  try {
    const body = await EDITOR_NOTES_SERVICE.GET_NOTES();
    res.status(200).json(body);
  } catch (error) {
    res.status(500).json({ message: "SOMETHING WENT WRONG" });
  }
});

app.get("/api/notes/:noteId", async (req, res) => {
  try {
    const body = await EDITOR_NOTES_SERVICE.GET_NOTE_BY_ID(
      req.params["noteId"]
    );
    res.status(200).json(body);
  } catch (error) {
    res.status(500).json({ message: "SOMETHING WENT WRONG" });
  }
});

app.post("/api/notes", async (req, res) => {
  try {
    const body: DB_Response = await EDITOR_NOTES_SERVICE.CREATE_NOTE(req.body);
    res.status(body.status).json(body);
  } catch (error) {
    res.status(500).json({ message: "SOMETHING WENT WRONG" });
  }
});
