const { json } = require("body-parser");
const Book = require("../models/Book");
const fs = require("fs");
// Création d'un nouveau livre
exports.createBook = (req, res) => {
  const bookObject = JSON.parse(req.body.book);

  const book = new Book({
    ...bookObject,
    imageUrl: `${req.protocol}://${req.get("host")}/${req.file.path}`, // Construction de l'URL de l'image en utilisant le protocole et l'hôte de la requête
  });

  // Sauvegarde du livre dans la base de données
  book
    .save()
    .then((createdBook) => {
      const { _id } = createdBook; // Récupération de l'ID réel du livre
      res.status(201).json({ message: "Livre créé avec succès.", bookId: _id }); // Envoi de l'ID dans la réponse
    })
    .catch((error) =>
      res.status(400).json({
        message: "Une erreur est survenue lors de la création du livre.",
        error,
      })
    );
};
// Récupération de tous les livres
exports.getAllBook = (req, res) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) =>
      res.status(400).json({
        message: "Une erreur est survenue lors de la récupération des livres.",
        error,
      })
    );
};
exports.getOneBook = (req, res) => {
  // Je récupère un livre avec l'id passé dans l'url
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(500).json({ error }));
};
exports.getBestBooks = (req, res) => {
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then((books) => res.status(200).json(books))
    .catch((error) =>
      res.status(500).json({
        message:
          "Une erreur est survenue lors de la récupération des meilleurs livres.",
        error,
      })
    );
};

exports.updateOneBook = (req, res) => {
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/${req.file.path}`,
      }
    : {
        ...req.body,
      };
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      console.log(book);
      if (book.userId != req.auth.userId) {
        return res.status(404).json({ message: "Livre non trouvé." });
      } 
      const imagePath = book.imageUrl.split('/images/')[1];
      fs.unlink(`images/${imagePath}`, () => {
        Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
        .then(res.status(200).json({ message: 'Livre modifié! ' }))
        .catch(error => res.status(400).json({ error }));
      })
    })
    .catch((error) =>
      res.status(500).json({
        message: "Une erreur est survenue lors de la mise à jour du livre.",
        error,
      })
    );
};

exports.deleteOneBook = (req, res) => {
  const bookId = req.params.id;

  Book.findOne({ _id: bookId })
      .then(book => {
          if (!book) {
              return res.status(404).json({ message: 'Aucun livre trouvé avec cet ID.' });
          }

          const imagePath = book.imageUrl.split('/images/')[1];
          fs.unlink(`images/${imagePath}`, () => {
              Book.deleteOne({ _id: bookId })
              .then(() => {
                  res.status(200).json({ message: 'Livre supprimé avec succès.' });
              })
              .catch(err => {
                  res.status(500).json({ message: 'Une erreur est survenue lors de la suppression du livre.', err });
              });
          });
      })
      .catch(error => {
          res.status(500).json({ message: 'Une erreur est survenue lors de la suppression du livre.', error });
      });
}

exports.addRatingBook = (req, res) => {};
