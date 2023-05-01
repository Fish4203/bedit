const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
var bcrypt = require("bcrypt");

const User = require("./models/user");

const users = [];


main().catch((err) => console.log(err));
async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect('mongodb://testa:testa@192.168.20.69:27017');
  console.log("Debug: Should be connected?");
  // await createUsers();
  await testUser();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function userCreate(username, password) {
  detail = {
    username: username,
    password: bcrypt.hashSync(password, 8),
  };

  const user = new User(detail);
  await user.save();
  users.push(user);
  console.log(`Added User: ${username}`);
}


async function createUsers() {
  console.log("Adding blogs");
  await Promise.all([
    userCreate(
      "tree",
      "tree123456",
    ),
    userCreate(
      "foo",
      "foo123456",
    ),
    userCreate(
      "bar",
      "bar123456",
    ),
    userCreate(
      "fish",
      "fish123456",
    ),
  ]);
}

async function testUser() {
  const user = await User.findOne({username: 'trwwwee'}).exec();

  console.log(user);
}
