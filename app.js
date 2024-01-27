const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json())

const dbPath = path.join(__dirname, "claimzippyProject.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(5000, () => {
      console.log("Server Running at http://localhost:5000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

app.get("/", async (request, response) => {
  const query = `
    SELECT * from task;
    `;
  const taskArray = await db.all(query);
  response.send(taskArray);
});

app.post("/task/", async (request, response) => {
  const bodycontent = request.body;
        const {
          title,
          description,
        } = bodycontent;
    console.log(bodycontent)
  const postQuery = `INSERT INTO task (
    title,description)
    VALUES(
       '${title}','${description}'
        );`;
    const dbResponse = await db.run(postQuery);
    response.send("Task Successfully Added");
    console.log("THis is post")
});

app.put("/task/:id/", async (request , response) => {
  const {id} = request.params;
  const taskdetails = request.body;
  const {title,description} = taskdetails;
  const updateQuery = `
    UPDATE
    task
    SET
    title = '${title}',description= '${description}'
    WHERE
    id = ${id};
  `;
  await db.run(updateQuery);
  console.log("book updated successfully");
  response.send("PUt method done");
});

app.delete("/task/:id/", async (request,response) => {
  const {id} = request.params;
  const deleteQuery = `
    DELETE FROM task 
    WHERE id = ${id};
  `;
  await db.run(deleteQuery);
  console.log("delete query done console logged");
  response.send("Delete method done response send");
});

module.exports = app;