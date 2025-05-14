const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10
        const camp = new Campground({
            author: '6817d3bff9aabd636a1111b6',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum illo soluta velit facilis. Qui veritatis placeat dolore delectus voluptatum. Aliquam culpa quam quaerat vel corporis fugiat provident error deserunt minima.',
            price,
            images: [
                {
                    url: 'https://res.cloudinary.com/dmhwdi0rx/image/upload/v1747057936/YelpCamp/rxykvljtqahknaew08qa.jpg',
                    filename: 'YelpCamp/rxykvljtqahknaew08qa',
                },
                {
                    url: 'https://res.cloudinary.com/dmhwdi0rx/image/upload/v1747057935/YelpCamp/tybz3wgap4wjuoesgjuo.jpg',
                    filename: 'YelpCamp/tybz3wgap4wjuoesgjuo',
                },
                {
                    url: 'https://res.cloudinary.com/dmhwdi0rx/image/upload/v1747057936/YelpCamp/yhocrjcaqdtnodppbzew.jpg',
                    filename: 'YelpCamp/yhocrjcaqdtnodppbzew',
                }
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})