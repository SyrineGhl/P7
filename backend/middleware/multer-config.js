const multer = require('multer');

const storage = multer.diskStorage({
    // destination de stockage des fichiers
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    // nom du fichier afin qu'il soit unique
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = file.originalname.split('.').pop();
        callback(null, name.split('.')[0] + Date.now() + '.' + extension);
    }
});

module.exports = multer({ storage }).single('image');