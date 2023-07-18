const { json } = require("body-parser");
const Book = require("../models/Book");
const fs = require("fs");

exports.createBook = (req, res) => {
  const bookObject = JSON.parse(req.body.book);
  console.log(req.file);
  const book = new Book({
    ...bookObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.path}`,
  });

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
// Je récupère un livre avec l'id passé dans l'url
exports.getOneBook = (req, res) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(500).json({ error }));
};
// je recupere les trois best book les mieux notés
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
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.path
        }`,
      }
    : {
        ...req.body,
      };
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        return res.status(404).json({ message: "Livre non trouvé." });
      }
      const imagePath = book.imageUrl.split("/images/")[1];
      fs.unlink(`images/${imagePath}`, () => {
        Book.updateOne(
          { _id: req.params.id },
          { ...bookObject, _id: req.params.id }
        )
          .then(res.status(200).json({ message: "Livre modifié! " }))
          .catch((error) => res.status(400).json({ error }));
      });
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
    .then((book) => {
      if (!book) {
        return res
          .status(404)
          .json({ message: "Aucun livre trouvé avec cet ID." });
      }

      const imagePath = book.imageUrl.split("/images/")[1];
      fs.unlink(`images/${imagePath}`, () => {
        Book.deleteOne({ _id: bookId })
          .then(() => {
            res.status(200).json({ message: "Livre supprimé avec succès." });
          })
          .catch((err) => {
            res.status(500).json({
              message:
                "Une erreur est survenue lors de la suppression du livre.",
              err,
            });
          });
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Une erreur est survenue lors de la suppression du livre.",
        error,
      });
    });
};

exports.addRatingBook = (req, res) => {
  const ratingObject = req.body;
  ratingObject.grade = ratingObject.rating;
  delete ratingObject.rating;

  Book.findOneAndUpdate(
    { _id: req.params.id },
    { $push: { ratings: ratingObject } },
    { new: true }
  )
    .then((updatedBook) => {
      if (!updatedBook) {
        return res.status(404).json({ message: "Livre inconnu" });
      }

      // Calculer la nouvelle moyenne des notes
      const totalRatings = updatedBook.ratings.length;
      const totalGrade = updatedBook.ratings.reduce(
        (acc, rating) => acc + rating.grade,
        0
      );
      const averageRating = totalGrade / totalRatings;
      // Arrondir la moyenne à une décimale
      const roundedRating = Math.round(averageRating);

      // Mettre à jour la moyenne des notes dans le livre
      updatedBook.averageRating = roundedRating;

      // Sauvegarder les modifications du livre
      updatedBook
        .save()
        .then((savedBook) => {
          res.status(200).json(savedBook);
        })
        .catch((error) => {
          res
            .status(500)
            .json({ message: "Erreur lors de la sauvegarde du livre", error });
        });
    })
    .catch((error) => {
      res
        .status(500)
        .json({ message: "Erreur lors de la mise à jour du livre", error });
    });
};
