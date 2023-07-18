const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });
const userController = require("./controllers/user");
const bookController = require("./controllers/books");
const auth = require("./middleware/auth");
const { upload, optimizedImg } = require("./middleware/multer-config");
const path = require("path");

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
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD"
  );
  next();
});

app.use(express.json());

// Routes
app.post("/api/auth/signup", userController.createUser);
app.post("/api/auth/login", userController.loginUser);
app.post("/api/books", auth, upload, optimizedImg, bookController.createBook);
app.get("/api/books", bookController.getAllBook);
app.get("/api/books/bestrating", bookController.getBestBooks);
app.get("/api/books/:id", bookController.getOneBook);
app.put( "/api/books/:id", auth, upload, optimizedImg, bookController.updateOneBook);
app.delete("/api/books/:id", bookController.deleteOneBook);
app.post("/api/books/:id/rating", bookController.addRatingBook);

app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
