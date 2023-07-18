exports.userValidation = (req, res,next) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    const { email, password } = req.body;

    
    // Validation de l'email
    if (!emailRegex.test(email)) {
        res.status(400).json({ message: "Email invalide" });
        return;
    }
    
    // Validation du mot de passe
  if (!passwordRegex.test(password)) {
    res.status(400).json({ message: "Mot de passe invalide" });
    return;
  }
  next();
}
