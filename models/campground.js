const mongoose = require('mongoose');
//Schema --> Define la estructura de los datos en MongoDB
const Schema = mongoose.Schema;

//CampgroundSchema --> Indica que un campamento tiene:
//title: Nombre del campamento
//price: Precio(pero debería ser Number, nno String)
//description: Descripción del lugar
//location: ubicación
//module.exports: Exprta el modelo Campground, permitiendo que app.js lo use
const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String
});

module.exports = mongoose.model('Campground', CampgroundSchema);