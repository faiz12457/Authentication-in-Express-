import dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import mongoose from "mongoose";
import { User } from "./models/user.js";
import md5 from "md5";
import bcrypt from "bcrypt";
import encrypt from "mongoose-encryption";
import session from "express-session";
import passport from "passport";
import passportLocalMongoose from "passport-local-mongoose";

const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "this is a secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

const port = 3000;
const saltRounds = 10;

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

await mongoose.connect("mongodb://localhost:27017/userDB");

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/secrets", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("secrets");
  } else {
    res.redirect("/login");
  }
});

app.post("/register", (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Email and Password are requried" });
    }

    User.register({ username }, password, (err, user) => {
      if (err) {
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, () => {
          res.redirect("/secrets");
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Email and Password are requried" });
  }

  const user = new User({
    username,
    password,
  });

  req.login(user, (err) => {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, () => {
        res.redirect("/secrets");
      });
    }
  });
});


app.get("/logout",(req,res)=>{

  req.logout((err)=>{
    res.send(err)
  });
  res.redirect("/")
})

// app.post("/register", async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     if (!username || !password) {
//       return res
//         .status(400)
//         .json({ message: "Email and Password are requried" });
//     }

//     const hashedPassword = await bcrypt.hash(password, saltRounds);

//     const newUser = new User({
//       email: username,
//       password: hashedPassword,
//     });

//     await newUser.save();

//     res.render("secrets");
//   } catch (err) {
//     console.log("Registration Error", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// app.post("/login", async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     if (!username || !password) {
//       return res
//         .status(400)
//         .json({ message: "Email and Password are requried" });
//     }

//     const foundUser = await User.findOne({ email: username });

//     const isMatch = await bcrypt.compare(password, foundUser.password);

//     if (!foundUser) {
//       return res.status(401).json({ message: "Invalid email or password" });
//     } else {
//       if (isMatch) {
//         res.render("secrets");
//       } else {
//         return res.status(401).json({ message: "Invalid  password" });
//       }
//     }
//   } catch (err) {
//     console.log(err);
//   }
// });

app.listen(port, () => {
  console.log("Server on running on port 3000");
});
