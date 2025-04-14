//app.js --> Es el archivo principal, contiene la configuración de Express, la conexión a la base de datos y las rutas

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const { campgroundSchema } = require('./schema.js');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const Campground = require('./models/campground');


//express --> Servidor Web
//Path --> Para manejar rutas de arhivos
//mongoose --> Para conectar a MongoDB
//Campground --> Importa el modelo del campamento desde models/campground.js

//De la línea 13 a la 16, me conecto a MongoDB en mi máquina local, en la base de datos llamada yelp-camp
mongoose.connect('mongodb://localhost:27017/yelp-camp') 
    // useNewUrlParser: true,
    // useUnifiedTopology: true


//Acá hacemos manejo de la conexión
//db.on("error", ...) --> si hay un error al conectar, se muestra en la consola
//db.once("open", ...) --> Si la conexión es exitosa, se imprime "Database connected"
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database connected");
});

//con la línea 28, 31 y 32, estamos configurando Express
//app.set('view engine', 'ejs') --> Indica que usaremos EJS como motor de plantillas para generar HTML dinámico.
//app.set('views', path.join(__dirname, 'views')) --> Define la carpeta donde están los archivos .ejs.
const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// console.log('Views directory:', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body)
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else{
        next()
    }
}

//Acá se define la ruta principal
//Cuando el usuario entra a http://localhost:3000/, Express responde con la vista home.js
app.get('/', (req, res) => {
    res.render('home')
});

app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds }); 
}));

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});

app.post('/campgrounds', validateCampground, catchAsync(async(req, res, next) => {
        // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);       
        const campground = new Campground(req.body.campground);
        await campground.save();
        res.redirect(`/campgrounds/${campground._id}`)
}))

app.get('/campgrounds/:id', catchAsync(async(req, res) => {
    console.log("🚀JB ~ app.get ~ res:", res)
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/show', { campground });
}));

app.get('/campgrounds/:id/edit', catchAsync(async(req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', { campground });
}));

app.put('/campgrounds/:id', validateCampground, catchAsync(async(req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    res.redirect(`/campgrounds/${campground._id}`)
}));

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));

app.all(/(.*)/, (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'Oh No, Something Wnet Wrong!'
    res.status(statusCode).render('error', { err });
})

//Servidor en escucha: Inicia el servidor en el puerto 3000 y muestra el mensaje en la consola
app.listen(3000, () => {
    console.log('Serving on port 3000')
})