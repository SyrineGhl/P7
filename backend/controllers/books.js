const Book = require('../models/Book');

// Création d'un nouveau livre
exports.createBook = (req, res) => {
  const bookObject = JSON.parse(req.body.book);

  const book = new Book({
    ...bookObject,
    imageUrl: `${req.protocol}://${req.get("host")}/${req.file.path}`, // Construction de l'URL de l'image en utilisant le protocole et l'hôte de la requête
});

// Sauvegarde du livre dans la base de données
book.save()
.then((createdBook) => {
  const { _id } = createdBook; // Récupération de l'ID réel du livre
  res.status(201).json({ message: 'Livre créé avec succès.', bookId: _id }); // Envoi de l'ID dans la réponse
})
.catch(error => res.status(400).json({ message: 'Une erreur est survenue lors de la création du livre.', error }));
};
// Récupération de tous les livres
exports.getAllBook = (req, res) => {
  Book.find()
  .then (books => res.status(200).json(books))
  .catch(error => res.status(400).json({ message: 'Une erreur est survenue lors de la récupération des livres.', error }));
}
exports.getOneBook = (req, res) => {
  // Je récupère un livre avec l'id passé dans l'url
  Book.findOne({ _id: req.params.id })
  .then(book => res.status(200).json(book))
  .catch(error => res.status(500).json({ error }));
};
exports.getBestBooks = (req, res) => {
  Book.find()
      .sort({ averageRating: -1 })
      .limit(3) 
         .then(books => res.status(200).json(books))
      .catch(error => 
        res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des meilleurs livres.', error })
      );   
};

exports.updateOneBook = (req,res) => {
  console.log('update');
}

exports.deleteOneBook = (req,res) => {
  console.log('delete');
}

exports.addRatingBook = (req,res) => {
  console.log("Route : /api/books/:id/rating ajout d'une evalution");
}
