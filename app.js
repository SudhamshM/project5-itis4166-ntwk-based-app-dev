// App for Project 5
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');

const eventRoutes = require('./routes/eventRoutes');
const mainRoutes = require('./routes/mainRoutes');
const userRoutes = require('./routes/userRoutes');

require('dotenv').config();
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');


// create application
const app = express();

// configure app
let port = process.env.PORT || 3000;
// acquiring db auth credentials from environment variable
const auth = process.env.AUTH || undefined

let url = 'mongodb+srv://' + auth + '@cluster0.grause1.mongodb.net/nbad-project5?retryWrites=true&w=majority'
app.set('view engine', 'ejs');

// connect to mongodb
mongoose.connect(url)
.then(
        // start the server
        app.listen(port, () =>
        {
            console.log('Server is running on port', port);
        })
        
    )
.catch(err => console.log(err.message))

//mount middleware
app.use(
    session({
        secret: "lH34ugoigzAwg4",
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({mongoUrl: 'mongodb+srv://' + auth + '@cluster0.grause1.mongodb.net/nbad-project5?retryWrites=true&w=majority'}),
        cookie: {maxAge: 60 * 60 * 1000}
        })
);
app.use(flash());

// using sessions and flash messaging
app.use((req, res, next) => 
{
    res.locals.user = req.session.user || null;
    res.locals.errorMessages = req.flash('error');
    res.locals.successMessages = req.flash('success');
    next();
});


// mount middleware
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('tiny'));
app.use(methodOverride('_method'))


// defining routes
app.use('/', mainRoutes);
app.use('/events', eventRoutes)
app.use('/users', userRoutes);


// handling 404 errors
app.use((req, res, next) =>
{
    let error = new Error("The server cannot locate " + req.url);
    error.status = 404;
    next(error);
});

// handling all other errors
app.use((err, req, res, next) =>
{
    if (!err.status)
    {
        err.status = 500;
        err.message = ("Internal Server Error.");
    }
    console.log(err.stack);
    res.status(err.status);
    res.render('./main/error', {error: err});
});
