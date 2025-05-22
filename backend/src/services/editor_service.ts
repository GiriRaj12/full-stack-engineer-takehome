import {
  CREATE_NOTE_STRUCTURE,
  DB_Response,
  QUERY_STRUCTURE,
} from "../utils/db";
import { DB } from "../utils/db";

const BASE_TABLE_NAME = "editor_notes";

async function getNotes() {
  return await dbQueryWrapper(
    `SELECT * FROM ${BASE_TABLE_NAME} WHERE is_active=true`
  );
}

async function getNoteById(id: string) {
  console.log(id);
  const query: QUERY_STRUCTURE = {
    queryText: `SELECT * FROM ${BASE_TABLE_NAME} WHERE note_id=$1 AND is_active=true`,
    values: [id],
  };
  return await dbQueryWrapper(query);
}

async function createNote(note: any): Promise<DB_Response> {
  const dbResponse: DB_Response = {
    status: 200,
    response: {},
    error: null,
  };

  const missing_fields = check_required_fields(
    ["name", "created_by", "body"],
    note
  );

  if (missing_fields && missing_fields.length > 0) {
    dbResponse.status = 400;
    dbResponse.error = {
      message: `Missing some required fields ${missing_fields.join(", ")}`,
    };
    return dbResponse;
  }

  const createNoteStructure: CREATE_NOTE_STRUCTURE = {
    name: note["name"],
    created_by: note["created_by"],
    body: note["body"],
    session_id: note["session_id"],
    session_name: note["session_name"],
  };

  const query: QUERY_STRUCTURE = {
    queryText: ` INSERT INTO ${BASE_TABLE_NAME} (id, name, created_by, created_at, body, note_id, is_active, version) 
                     VALUES($1, $2, $3, $4, $5, $6, true, 1) RETURNING *`,
    values: [
      crypto.randomUUID().toString(),
      createNoteStructure.name,
      createNoteStructure.created_by,
      new Date().toISOString(),
      createNoteStructure.body,
      crypto.randomUUID().toString(),
    ],
  };

  dbResponse.response = await dbQueryWrapper(query);
  return dbResponse;
}


/**
 * TODO: If update came through API
 * 1. Update in DB 
 * 2. Emit message in the namespace only if there is active users within the namespace  
 ***/
  
// async function updateNote(note:UPDATE_NOTE_STRUCTURE){
//     const dbResponse : DB_Response = {
//         status: 200,
//         response: {},
//         error: null
//     }

//     const missing_fields = check_required_fields(["id", "updated_by", "body"], note)

//     if(missing_fields && missing_fields.length > 0){
//         dbResponse.status = 400
//         dbResponse.error = {
//             "message": `Missing some required fields ${missing_fields.join(", ")}`
//         }
//         return dbResponse;
//     }

//     const currentEditorNote = await getNoteById(note.id);

//     if(!currentEditorNote){
//         dbResponse.status = 400;
//         dbResponse.error = {
//             "message": `Note doesnot exists for ID : ${note.id}`
//         }
//     }

//     const updateStructure: UPDATE_NOTE_STRUCTURE = {
//         id: note.id,
//         body: note.body,
//         updated_by: note.updated_by
//     }

//     const query: QUERY_STRUCTURE = {
//         queryText: `UPDATE ${BASE_TABLE_NAME}
//                     SET body=$1, updated_by=$2
//                     WHERE id=$3
//         `,
//         values: [updateStructure.body, updateStructure.updated_by, updateStructure.id]
//     }

//     dbResponse.response = await dbQueryWrapper(query)

//     return dbResponse

// }


/**
 * 
 * @param data 
 * @returns 
 * 
 * TODO: Make function generic as to both useful for API and Socket to update notes
 * 
 */


export async function updateNoteEventBySocket(data: {
  note_id: string;
  body: string;
  username: string;
}) {
  const note = (await getNoteById(data["note_id"])).response;

  const version = Number(note["version"]) + 1;

  console.log("Deleting");
  const deletQuery: QUERY_STRUCTURE = {
    queryText: `UPDATE ${BASE_TABLE_NAME} SET is_active=$1 WHERE note_id=$2`,
    values: [false, note["note_id"]],
  };

  await dbQueryWrapper(deletQuery);

  console.log("Creating");

  const createQuery: QUERY_STRUCTURE = {
    queryText: `INSERT INTO ${BASE_TABLE_NAME} (id, name, created_by, created_at, body, note_id, version, is_active) 
                     VALUES($1, $2, $3, $4, $5, $6, $7, true) RETURNING *`,
    values: [
      crypto.randomUUID().toString(),
      note["name"],
      data.username,
      new Date().toISOString().toString(),
      data["body"],
      note.note_id,
      version,
    ],
  };

  return await dbQueryWrapper(createQuery);
}

async function dbQueryWrapper(
  query: string | QUERY_STRUCTURE
): Promise<DB_Response> {
  const db = await DB();
  const response = await db.query(query);
  await db.close();
  return response;
}

function check_required_fields(fields: Array<any> | [], body: Object | any) {
  return fields.filter((key) => !body[key]);
}

export const EDITOR_NOTES_SERVICE = {
  GET_NOTES: getNotes,
  GET_NOTE_BY_ID: getNoteById,
  CREATE_NOTE: createNote,
  UPDATE_NOTE_BY_SOCKET: updateNoteEventBySocket,
  // UPDATE_NOTE: updateNote
};
