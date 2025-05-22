import { Client, QueryResult } from "pg";

require("dotenv").config();

export interface DB_Response {
  status: number;
  response: Object | any;
  error: String | null | Object;
}

export interface CREATE_NOTE_STRUCTURE {
  name: string;
  created_by: string;
  body: string;
  session_id: string;
  session_name: string;
}

export interface UPDATE_NOTE_STRUCTURE {
  id: string;
  body: string;
  updated_by: string;
}

export interface QUERY_STRUCTURE {
  queryText: string;
  values: Array<any>;
}

export async function DB() {
  const client = new Client({
    user: process.env.POSTGRESS_DB_USER_NAME,
    password: process.env.POSTGRESS_DB_PASSWORD,
    host: process.env.POSTGRESS_DB_HOST,
    port: Number(process.env.POSTGRESS_DB_HOST_PORT),
    database: process.env.POSTGRESS_DB_DATABASE,
  });

  await client.connect();

  const query = async (sql: string | QUERY_STRUCTURE): Promise<DB_Response> => {
    const db_response: DB_Response = {
      status: 200,
      response: {},
      error: null,
    };

    try {
      let res: QueryResult;

      if (typeof sql === "string") res = await client.query(sql);
      else res = await client.query(sql.queryText, sql.values);

      if (res.rowCount == 1) db_response.response = res.rows[0];
      else db_response.response = res.rows;
    } catch (error) {
      console.log(error);
      db_response.status = 500;
    }

    return db_response;
  };

  const close = async () => {
    await client.end();
  };

  return { query, close };
}
