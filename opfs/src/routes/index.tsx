import { component$, 
  useBrowserVisibleTask$, 
  useSignal, 
  useStore, 
  useTask$, 
  noSerialize,
} from '@builder.io/qwik';
import sqlite3InitModule from "sqlite-wasm-esm";

/*
// from: https://github.com/overtone-app/sqlite-wasm-esm
// your-worker.js
import sqlite3InitModule from "sqlite-wasm-esm";

sqlite3InitModule().then((sqlite3) => {
  const opfsDb = new sqlite3.opfs.OpfsDb("my-db", "c");
  // or in-memory ...
  const db = new sqlite3.DB();
});

*/

export default component$(() => {
  const lines = useSignal("")
  const store = useStore({
    db: null as any|null,
  });

  // const db = new sqlite3.oo1.OpfsDb('/path/to/my.db','c');
  useBrowserVisibleTask$(async () => {
    const sqliteDB = await sqlite3InitModule().then((sqlite3) => {
      let db :any;
      if(sqlite3.capi.sqlite3_vfs_find("opfs")){
        console.log("opfs is available!")
        db = new sqlite3.opfs!.OpfsDb("my-db", "c");
      } else {
        // or in-memory ...
        console.log("using in-memory")
        // the below does not create a file; still in-memory AFAIK
        db = new sqlite3.oo1.DB({filename:'my-db'});
      }
      store.db = noSerialize(db);
      console.log("sqlite3 instance created:",sqlite3);
      console.log("DB instance created is:", db)  
      return db;
    });
    console.log("sqliteDB:", sqliteDB);
  });

  useTask$(({ track }) => {
    // rerun this function  when `value` property changes.
    track(() => store.db);
    const log = (msg:string) => {
      lines.value = lines.value + msg
    }
    if ( store.db !== null ) {
      const db = store.db
      try {
        log("Create a table...\n");
        db.exec("CREATE TABLE IF NOT EXISTS t(a,b)");
        //Equivalent:
        db.exec({
          sql:"CREATE TABLE IF NOT EXISTS t(a,b)"
          // ... numerous other options ... 
        });
        // SQL can be either a string or a byte array
        // or an array of strings which get concatenated
        // together as-is (so be sure to end each statement
        // with a semicolon).
  
        log("Insert some data using exec()...\n");
        let i;
        for( i = 20; i <= 25; ++i ){
          db.exec({
            sql: "insert into t(a,b) values (?,?)",
            // bind by parameter index...
            bind: [i, i*2]
          });
          db.exec({
            sql: "insert into t(a,b) values ($a,$b)",
            // bind by parameter name...
            bind: {$a: i * 10, $b: i * 20}
          });
        }    
        log("Query data with exec() without a callback...\n");
        // eslint-disable-next-line prefer-const
        let rows :any[] = [];
        db.exec({
          sql: "select a, b from t order by a limit 3",
          rowMode: 'object',
          resultRows: rows,
        });
        log("Result rows:\n"+JSON.stringify(rows,null,2));
      }catch(e){
        // if(e instanceof sqlite3.SQLite3Error){
        //   log("Got expected exception from db.transaction():",e.message);
        //   log("count(*) from t =",db.selectValue("select count(*) from t"));
        // }else{
        //   throw e;
        // }
        console.log("error is:", e)
        throw e
      }
    }
  });
  return (
    <div>
      <h1>Start of the Sqlite Experiment</h1>
      <pre>{lines.value}</pre>
    </div>
  );
});

/* code graveyard

export default component$(() => {

  useBrowserVisibleTask$(() => {
    const sqliteWorker = new Worker(new URL('./worker.js', import.meta.url));
    console.log("sqliteWorker:", sqliteWorker);
  });

  return (
    <div>
      <h1>Start of the Sqlite Experiment</h1>
    </div>
  );
});


*/