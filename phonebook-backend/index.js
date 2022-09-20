const { response } = require("express");
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");

let persons = require("./data.json");

app.use(express.json());
app.use(cors());
morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(morgan(":method :url :status - :response-time ms :body"));

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/info", (req, res) => {
  const html = `<div>Phonebook has info for ${
    persons.length
  } people</div> <div>${new Date().toLocaleString()}</div>`;
  res.send(html);
});

app.get("/api/persons/:id", (req, res) => {
  const person = persons.find((p) => p.id === Number(req.params.id));
  if (person) {
    res.json(person);
  } else {
    res.status(404).json({ error: "Nothing" });
  }
});

app.delete("/api/persons/:id", (req, res) => {
  persons = persons.filter((p) => p.id !== Number(req.params.id));
  console.log(persons);
  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const randomId = Math.floor(Math.random() * 100);
  const newPerson = req.body;
  const isNameExisting = persons.find((p) => p.name === newPerson.name);
  if (!newPerson.name) {
    res.status(404).json({ error: "name must be included" }).end();
  } else if (!newPerson.number) {
    res.status(404).json({ error: "number must be included" }).end();
  } else if (isNameExisting) {
    res.status(404).json({ error: "name must be unique" }).end();
  } else {
    newPerson.id = randomId;
    persons = persons.concat(newPerson);
    res.json(persons);
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
