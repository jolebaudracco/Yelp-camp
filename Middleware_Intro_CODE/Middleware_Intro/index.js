const express = require('express');
const app = express();
const morgan = require('morgan');

//Aquí, Morgan se utiliza como un middleware para registrar las solicitudes HTTP en un formato "tiny" que es para generar logs en la consola cada vez que se recibe una solicitud
//el app.use permite inyectar otro tipo de código
app.use(morgan('tiny'));

//Este es un middlewhere personalizado que agrega un valor requestTime al objeto req con la fecha y la hora actual. Además imprime en la consola el 
//método HTTP (req.method) y la ruta (req.path) de cada solicitud.
app.use((req, res, next) => {
    req.requestTime = Date.now();
    console.log(req.method, req.path);
    next();
})
//Luego el next() pasa la ejecución al siguiente middleware en la pila

//Este es un middleware específico para la ruta /dogs. Siempre que se escriba una solicitud en esa ruta, el servidor registrará "I LOVE DOGS"
//lo registrará en la consola y luego pasará al siguiente middleware o manejador de la solicitud.
app.use('/dogs', (req, res, next) => {
    console.log("I LOVE DOGS!!")
    next();
})

//En este middelware que verifica si la consulta (query) contiene una contraseña válida. Si la contraseña es correcta (chickennugget), la ejecución pasa al siguiente middleware con next(). 
//Si no, se responde con el mensaje "YOU NEED A PASSWORD!"
const verifyPassword = (req, res, next) => {
    const { password } = req.query;
    if (password === 'chickennugget') {
        next();
    }
    res.send("YOU NEED A PASSWORD!")
}


// app.use((req, res, next) => {
//     console.log("THIS IS MY FIRST MIDDLEWARE!!!")
//     return next();
//     console.log("THIS IS MY FIRST MIDDLEWARE - AFTER CALLING NEXT()")
// })
// app.use((req, res, next) => {
//     console.log("THIS IS MY SECOND MIDDLEWARE!!!")
//     return next();
// })
// app.use((req, res, next) => {
//     console.log("THIS IS MY THIRD MIDDLEWARE!!!")
//     return next();
// })

//Aquí tienes una ruta GET para la página principal (/). Muestra la solicitud (req.requestTime) y responde con "HOME PAGE!"
app.get('/', (req, res) => {
    console.log(`REQUEST DATE: ${req.requestTime}`)
    res.send('HOME PAGE!')
})

//Esta es otra ruta GET para la ruta /dogs. Muestra la hora de la solicitud y responde con "WOOF WOOF!"
app.get('/dogs', (req, res) => {
    console.log(`REQUEST DATE: ${req.requestTime}`)
    res.send('WOOF WOOF!')
})

//Esta ruta se maneja de forma especial: primero pasa por el middleware verifyPassword. Si la contraseña es correcta, se muestra el "secreto".
//Si no es correcta, se bloquea la solicitud antes de que llegue a esta ruta y se responde con "YOU NEED A PASSWORD!"
app.get('/secret', verifyPassword, (req, res) => {
    res.send('MY SECRET IS: Sometimes I wear headphones in public so I dont have to talk to anyone')
})

//Este es un middleware de "404" que maneja todas las solicitudes que no coinciden con las rutas anteriores. 
//Si el servidor no encuentra ninguna ruta para solicitud, devuelve un mensaje "NOT FOUND!"
app.use((req, res) => {
    res.status(404).send('NOT FOUND!')
})


app.listen(3000, () => {
    console.log('App is running on localhost:3000')
})