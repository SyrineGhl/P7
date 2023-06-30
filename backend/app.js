const express = require("express");
const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config({path: '.env.local'})
const User = require("./models/User");

// Connexion à MongoDB
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/Mon_vieux_Grimoire_p7?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((error) => console.error("Connexion à MongoDB échouée !" + error));

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD')
  next();
})
app.use(express.json());
// Routes
app.post("/api/auth/signup", (req, res) => {
  const user = new User({
    email: req.body.email,
    password: req.body.password
  })
  user.save()
  .then(()=>res.status(200).json({message:'success'}))
  .catch((error)=>res.status(400).json({message:'error with post sign up : '+error}))
});

module.exports = app;
