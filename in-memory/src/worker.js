// your-worker.js
import sqlite3InitModule from "sqlite-wasm-esm";

const sqliteDB = sqlite3InitModule().then((sqlite3) => {
  //const opfsDb = new sqlite3.opfs.OpfsDb("my-db", "c");
  // or in-memory ...
  const db = new sqlite3.DB();
  console.log("db created, db=",db);
  return db;
});

export default sqliteDB;