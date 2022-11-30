const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedhelpers')

main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://localhost:27017/yelp-camp');
    console.log("connect to mongo")
    // use `await mongoose.connect('mongodb://user:password@localhost:27017/test');` if your database has auth enabled
}

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 40) + 10;
        const c = new Campground({
            author: '63870d3a103228e6fcbaa7a9',
            location: `${cities[random1000].city} , ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            price: price,
            description: "Chill camping place",
            image: {
                path: 'https://res.cloudinary.com/dajwrsd05/image/upload/v1669796980/YalpCamp/osmzfscafgnzt6bhqobo.jpg',
                filename: 'YalpCamp/osmzfscafgnzt6bhqobo'
            }

        });
        await c.save();
    }
}
seedDB()
    .then(() => {
        mongoose.connection.close();
    })

