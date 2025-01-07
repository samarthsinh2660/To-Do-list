import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "Samarth@99082",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
];

app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM items ORDER BY id ASC");
    items = result.rows;

    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
    });
  } catch (error) {
    console.log(error);
  }
});

app.post("/add", (req, res) => {
  const item = req.body.newItem;
 try {
  db.query("INSERT INTO ITEMS (title) VALUES ($1)", [item]);
  res.redirect("/");
 } catch (error) {
  console.log(error);
 }

});

app.post("/edit", (req, res) => {
 const updatedItem = req.body.updatedItemTitle;
 const updatedItemId = req.body.updatedItemId;
 try {
  db.query("UPDATE items SET title = $1 WHERE id = $2", [updatedItem, updatedItemId]);
  res.redirect("/");
 } catch (error) {
  console.log(error);
 }
});

app.post("/delete", (req, res) => {
 const deletedItemId = req.body.deleteItemId;
 try {
  db.query("DELETE FROM items WHERE id = $1", [deletedItemId]);
  res.redirect("/");
 } catch (error) {
  console.log(error);
 }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
