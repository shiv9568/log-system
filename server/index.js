const express = require("express");
const jwt = require("jsonwebtoken");
const { default: mongoose, Model } = require("mongoose");
const app = express();
const port = 1230;
const cors = require("cors");
const bodyParser = require("body-parser");
app.use(bodyParser.json());

app.use(
  cors({
    origin: "https://log-system.vercel.app",
    credentials: true,
  })
);

app.options("*", cors());

const SECRET = "YOUR_HIDDEN_KEY";
mongoose.connect(
  "mongodb+srv://shivcollage9568:rqSQ34CEa70uXrWe@clusterbhatia.26ks8l4.mongodb.net/LOGINAPP"
);

const LoginSchema = new mongoose.Schema({
  username: String,
  password: String,
});
const SignupSchema = new mongoose.Schema({
  name: String,
  username: String,
  password: String,
});
const Login = mongoose.model("Login", LoginSchema);
const Signup = mongoose.model("Signup", SignupSchema);

// const authenticateJwt = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (authHeader) {
//     const token = authHeader.split(" ")[1];
//     jwt.verify(token, SECRET, (err, user) => {
//       if (err) {
//         return res.sendStatus(404);
//       }
//       req.user = user;
//       next();
//     });
//   } else {
//     res.sendStatus(401);
//   }
// };
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log("Receve Data is", username, password);
  const admin = await Signup.findOne({ username, password });
  if (admin) {
    res.status(200).json({ message: "welcome ji" });
  } else {
    res
      .status(404)
      .json({ message: "Admin Not Present Please First do Signup" });
  }
});
app.post("/signup", async (req, res) => {
  const { name, username, password } = req.body;
  console.log("Received data:", name, username, password);
  const existingUser = await Signup.findOne({ username });

  if (existingUser) {
    res
      .status(404)
      .json({ message: "Username Already Present Please choose Another Name" });
  } else {
    const newUser = new Signup({ name, username, password });
    await newUser.save();

    const token = jwt.sign({ username, role: "user" }, SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "User Created Successfully", token });
  }
});

function started() {
  console.log(`server started at ${port}`);
}
app.listen(port, started);
