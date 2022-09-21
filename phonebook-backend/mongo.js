const mongoose = require("mongoose");
require("dotenv").config();

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];
const url = `mongodb+srv://mcfwesh:${password}@cluster0.glqig1z.mongodb.net/phonebook-database?retryWrites=true&w=majority`;

mongoose.connect(url).then((result) => console.log("connected"));

const personSchema = mongoose.Schema({
  name: {
    type: "string",
    minLength: 3,
  },
  number: {
    type: "string",
  },
});

const Person = mongoose.model("Person", personSchema);

const person = new Person({
  name,
  number,
});
person.save().then((result) => {
  console.log(`added ${result.name} number ${result.number} to phonebook`);
  mongoose.connection.close();
});

Person.find().then((res) => {
  res.forEach((person) => {
    console.log(`phonebook: \n ${person.name} ${person.number} \n`);
  });

  mongoose.connection.close();
});
