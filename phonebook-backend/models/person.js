const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;
const regexTest = /^\d{2,3}[-]?\d{5,}$/im;

mongoose
  .connect(url)
  .then((result) => console.log("connected"))
  .catch((err) => console.log(err));

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
  },
  number: {
    type: String,
    required: true,
    validate: {
      validator: (value) =>
        value.split("-").join("").length >= 8 && regexTest.test(value),
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
