const jsonWebToken = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

module.exports = (req, res, next) => {
  try {
    // Je récupère le token qui est la 2eme string après le bearer séparé par un espace
    const token = req.headers.authorization.split(" ")[1];
    // décodage du token avec la methode verify
    const decodedToken = jsonWebToken.verify(token, process.env.JWT_SECRET);
    // Je récupère le userId et je le rajoute à l'objet request qui sera transmis aux routes
    const userId = decodedToken.userId;
    req.auth = {
      userId: userId,
    };
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};
