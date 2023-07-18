const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });


// Création d'un nouvel utilisateur
exports.createUser = (req, res) => {
  const { email, password } = req.body;
  const bcryptSalt = 10;

  // Hachage du mot de passe fourni
  bcrypt.hash(password, bcryptSalt, (err, hashedPassword) => {
    if (err) {
      res
        .status(500)
        .json({ message: "Erreur lors du hachage du mot de passe" });
      return;
    }

    // Création d'une instance de User avec l'email et le mot de passe haché
    const user = new User({
      email: email,
      password: hashedPassword,
    });

    // Sauvegarde de l'utilisateur dans la base de données
    user
      .save()
      .then(() => res.status(200).json({ message: "success" }))
      .catch((error) =>
        res.status(400).json({ message: "error with post sign up: " + error })
      );
  });
};

// Connexion de l'utilisateur
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Recherche de l'utilisateur dans la base de données par email
    const user = await User.findOne({ email });

    // Vérification de l'existence de l'utilisateur et de la correspondance du mot de passe haché
    if (!user || !bcrypt.compareSync(password, user.password)) {
      res.status(401).json({ message: "Mot de passe ou identifiant invalide" });
      return;
    }

    // Génération du token JWT contenant l'ID de l'utilisateur
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    // Envoi du token et de l'ID de l'utilisateur en réponse
    res.status(200).json({ token, userId: user._id });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la lecture des utilisateurs" });
  }
};
