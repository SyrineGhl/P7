<h1 align="center">Mon Vieux Grimoire</h1>

<div align="center">
    <a href="https://www.mongodb.com/docs/">
      <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    </a>
    <a href="https://expressjs.com/">
      <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="ExpressJs" />
    </a>
    <a href="https://nodejs.org/en/">
      <img src="https://img.shields.io/badge/node.js%20-%23339933.svg?&style=for-the-badge&logo=node.js&logoColor=white" alt="NodeJs" />
    </a>
</div>

<h2 align="center"> Projet 7: Développez le back-end d'un site de notation de livres</h2>
 Informations globales :

- Statut : 🟢 Terminé
- Projet réalisé seule
- Lien vers le [GitHub](https://github.com/SyrineGhl/P7.git)

<h2 align="center"> Mise en situation </h2>

<p align="justify">Vous êtes développeur back-end en freelance depuis maintenant un an dans la région de Lille. Vous avez l’habitude de travailler avec Kévin, un développeur front-end plus expérimenté que vous, et qui a déjà un bon réseau de contacts dans le milieu.  

Kévin vous contacte pour vous proposer de travailler avec lui en mutualisant vos compétences front / back sur un tout nouveau projet qui lui a été proposé. Il s’agit d’une petite chaîne de librairies qui souhaite ouvrir un site de référencement et de notation de livres.</p>

<h2 align="center"> Objectif </h2>

- Mise en place de l'application ✅
- Créez un serveur Express simple ✅
- Créer une API RESTful ✅
- Mettez en place un système d'authentification sur votre application ✅
- Ajoutez une gestion des fichiers utilisateur sur l'application ✅
- Ajouter la gestion de l'ajout d'une notation d'un livre ✅
- Ajouter la gestion du calcul de la note moyenne d'un livre ✅


<h2 align="center"> Instruction de lancement </h2>

- Récupérer le lien du repo SSH.
- Dans le terminal cloner le repo git :`git clone (mettre lien ssh)`.
- Entrer dans le dossier backend depuis le terminal :`cd backend`.
- Faire la commande `npm i` pour installer les dépendances du backend.
- Lancer le serveur backend via la commande: `npm start`.
- Apres avoir lancé le serveur backend, ouvrir un autre terminal.
- Entrer dans le dossier frontend depuis le terminal :`cd frontend`.
- Faire la commande `npm i` pour installer les dépendances du frontend.
- Lancer le serveur frontend via la commande: `npm start`.

<h2 align="center"> Initialisation de la base de donnée NoSQL </h2>

- Ouvrir [MongoDB Atlas](https://www.mongodb.com/atlas/database)
- Se connecter.
- Creation d'un projet.
- Dans Database cliquer sur 'Create'.
- Choisir 'shared' => AWS => choisir la region => create cluster.
- Ensuite cliquer sur 'Connect'=> connect to application => drivers => Add your connection string into your application code.
- Faire la commande `npm i mongoDB`.
- Recuperer ce code afin d'interagir avec la base de donnée puis le coller dans l'app.js `mongodb+srv://<userDB>:<passwordDB>@<cluster>.mongodb.net/?retryWrites=true&w=majority`.

<h3 align="center"> Creation du backend </h3>

- Creer un fichier backend
- Faire un npm init -y
- Creer un fichier server.js dans le back
- Installer express en écrivant `npm Install express —save`
- Je peux lancer mon serveur apres l’avoir écrit en faisant la cmd ==> node index (Toujours lancer le back avant le front )

<h2 align="center"> Exigence de l’API </h2>

Ce document détaille les besoins de l’API requis pour le bon fonctionnement du front-end.

|  | Point d'accès | Authentification | Corps de la requête (cas échéant) | Type de réponse attendu | Fonction |
| :---: | :---: | :---: | :---: | :---: | :---: |
| POST | /api/auth/signup | Non requis | { email: string, password: string } | { message: string } | Hachage du mot de passe de l'utilisateur, ajout de l'utilisateur à la base de données. |
| POST | /api/auth/login | Non requis | { email: string, password: string } | { userId: string, token: string } | Vérification des informations d'identification de l'utilisateur ; renvoie l’_id de l'utilisateur depuis la base de données et un token web JSON signé (contenant également l'_id de l'utilisateur). |
| GET | /api/books | Non requis | - | Array of books | Renvoie un tableau de tous les livres de la base de données. |
| GET | /api/books/:id | Non requis | - | Single book | Renvoie le livre avec l’_id fourni. |
| GET | /api/books/bestrating | Non requis | - | Array of books | Renvoie un tableau des 3 livres de la base de données ayant la meilleure note moyenne. |
| POST | /api/books | Requis | { book: string, image: file } | { message: string } **Verb** | Capture et enregistre l'image, analyse le livre transformé en chaîne de caractères, et l'enregistre dans la base de données en définissant correctement son ImageUrl. Initialise la note moyenne du livre à 0 et le rating avec un tableau vide. Remarquez que le corps de la demande initiale est vide; lorsque Multer est ajouté, il renvoie une chaîne pour le corps de la demandeen fonction des données soumises avec le fichier. |
| PUT | /api/books/:id | Requis | EITHER Book as JSON OR { book: string, image: file } | { message: string } | Met à jour le livre avec l'_id fourni. Si une image est téléchargée, elle est capturée, et l’ImageUrl du livre est mise à jour. Si aucun fichier n'est fourni, les informations sur le livre se trouvent directement dans le corps de la requête (req.body.title, req.body.author, etc.). Si un fichier est fourni, le livre transformé en chaîne de caractères se trouve dans req.body.book. Notez que le corps de la demande initiale est vide ; lorsque Multer est ajouté, il renvoie une chaîne du corps de la demande basée sur les données soumises avec le fichier. |
| DELETE | /api/books/:id | Requis | - | { message: string } | Supprime le livre avec l'_id fourni ainsi que l’image associée. |
| POST | /api/books/:id/rating | Requis | { userId: string, rating: number } | Single book | Définit la note pour le user ID fourni. La note doit être comprise entre 0 et 5. L'ID de l'utilisateur et la note doivent être ajoutés au tableau "rating" afin de ne pas laisser un utilisateur noter deux fois le même livre. Il n’est pas possible de modifier une note. La note moyenne "averageRating" doit être tenue à jour, et le livre renvoyé en réponse de la requête. |

⛔ API Errors
Les erreurs éventuelles doivent être renvoyées telles qu'elles sont produites, sans modification ni ajout. Si
nécessaire, utilisez une nouvelle Error().

⛔ API Routes
<p align="justify">Toutes les routes pour les livres doivent disposer d’une autorisation (le token est envoyé par le front-end avec l'en-tête d’autorisation « Bearer »). Avant qu’un utilisateur puisse apporter des modifications à la route livre (book), le code doit vérifier si le user ID actuel correspond au user ID du livre. Si le user ID ne correspond pas, renvoyer
« 403: unauthorized request ». Cela permet de s'assurer que seul le propriétaire d’un livre puisse apporter des modifications à celui-ci.</p>

⛔ Sécurité

- Le mot de passe de l'utilisateur doit être haché.
- L'authentification doit être renforcée sur toutes les routes livre (book) requises.
- Les adresses électroniques dans la base de données sont uniques, et un plugin Mongoose approprié est utilisé pour garantir leur unicité et signaler les erreurs.
- La sécurité de la base de données MongoDB (à partir d'un service tel que MongoDB Atlas) ne doit pas empêcher l'application de se lancer sur la machine d'un utilisateur.
- Les erreurs issues de la base de données doivent être remontées.

<h1 align="center"> Resultat final </h1>

![site mon vieux grimoire](https://cdn.discordapp.com/attachments/1081227920770596865/1130509153807384686/Capture_decran_2023-07-17_a_16.38.09.png)

![site mon vieux grimoire](https://cdn.discordapp.com/attachments/1081227920770596865/1130509169607331911/Capture_decran_2023-07-17_a_16.38.27.png)

![site mon vieux grimoire](https://cdn.discordapp.com/attachments/1081227920770596865/1130509191237345280/Capture_decran_2023-07-17_a_16.39.03.png)

![site mon vieux grimoire](https://cdn.discordapp.com/attachments/1081227920770596865/1130509211969785876/Capture_decran_2023-07-17_a_16.39.07.png)

![site mon vieux grimoire](https://cdn.discordapp.com/attachments/1081227920770596865/1130509242848260179/Capture_decran_2023-07-17_a_16.39.03.png)

 <h2 align="center"> Droits d’auteurs et informations sur la licence.</h2>

Réalisé par Syrine Ghoul.

©2000 [Openclassroom](https://openclassrooms.com/fr/), Inc. Tout droit réservés.

![Openclassroom](https://camo.githubusercontent.com/e47c349811ac404b8147bd362c598e61c7d20225df17499c6373b44f6ee08a3d/68747470733a2f2f31746f3170726f67726573732e66722f77702d636f6e74656e742f75706c6f6164732f323031392f30352f6f70656e636c617373726f6f6d732d65313535373736313233363135382e706e67)

