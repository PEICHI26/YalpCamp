const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');
const flash = require('connect-flash');

//connect to mongodb
main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://localhost:27017/yelp-camp');
    console.log("connect to mongo")
    // use `await mongoose.connect('mongodb://user:password@localhost:27017/test');` if your database has auth enabled
}

//config session
const sess = {
    secret: 'mysecrete',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

//read ejs file
app.engine('ejs', ejsMate)

//read files from views dir
app.set('views', path.join(__dirname, 'views'));
//read ejs file
app.set('view engine', 'ejs');

//express middleware

//use session
app.use(session(sess))

//use flash
app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error =req.flash('error')
    next();
})

//reqest from url
app.use(express.urlencoded({ extended: true }))

//override method post to what you need (ex:delete)
app.use(methodOverride('_method'))

//add /campgrounds before every campgrounds route
app.use('/campgrounds', campgrounds);

//add /campgrounds/:id/reviews before every campgrounds route
app.use('/campgrounds/:id/reviews', reviews)

//read files from public dir
app.use(express.static(path.join(__dirname, 'public')))

//every error will end up passing to this code
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) {
        err.message = 'Somethig went wrong'
    }
    res.status(statusCode).render('error', { err });
})

//render home page
app.get('/', (req, res) => {
    res.render('home')
})

//if any route does not exit, will run this code
app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
})

app.listen(3000, () => {
    console.log('listen on port 3000')
})
