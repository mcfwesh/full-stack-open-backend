const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

// Model
const Person = require("./models/person");

// Middlewares
app.use(express.static("build"));
app.use(express.json());
app.use(cors());
morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(morgan(":method :url :status - :response-time ms :body"));

// Routes
app.get("/api/persons", (req, res) => {
  Person.find()
    .then((persons) => {
      res.json(persons);
    })
    .catch((error) => next(error));
});

app.get("/info", (req, res) => {
  Person.find()
    .then((persons) => {
      const html = `<div>Phonebook has info for ${
        persons.length
      } people</div> <div>${new Date().toLocaleString()}</div>`;
      res.send(html);
    })
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById({ _id: req.params.id })
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).send({ error: "Nothing" });
      }
    })
    .catch((error) => {
      next(error);
    });
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (req, res, next) => {
  const newPerson = req.body;
  Person.findOne({ name: newPerson.name })
    .then((person) => {
      let isNameExisting =
        person && person.name.toLowerCase() === newPerson.name.toLowerCase();
      if (isNameExisting) {
        res.status(404).send({ error: "name must be unique" }).end();
      } else {
        const person = new Person({
          name: newPerson.name,
          number: newPerson.number,
        });
        person.save().then((result) => {
          res.json(result);
        });
      }
    })
    .catch((error) => {
      next(error);
    });
});

app.put("/api/persons/:id", (req, res, next) => {
  const { name, number } = req.body;
  {
    Person.findByIdAndUpdate(
      req.params.id,
      { name, number },
      { new: true, runValidators: true, context: "query" }
    )
      .then((result) => {
        res.json(result);
      })
      .catch((error) => next(error));
  }
});

// Error and unknown endpoints middlewares
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
  console.log(error, "null");
  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    console.log("errorrrrrrr");
    return res.status(400).json({ error: error.message });
  }
  next(error);
};
app.use(errorHandler);

// Server port config
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
