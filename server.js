require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOption'); 
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConnection')

const PORT = process.env.PORT || 3500;

// Connect to MongoDB
connectDB();

//custom middleware logger
app.use(logger);

//use CORS
app.use(cors(corsOptions));


// built-in middleware to handle urlencoded data
// in other words, form data:  
// ‘content-type: application/x-www-form-urlencoded’
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//serve static files // Middleware that gives us access only to static files from public folder
app.use(express.static(path.join(__dirname, '/public')));//default is '/' before everything
//app.use('/subdir', express.static(path.join(__dirname, '/public')));//we sshould tell subdir to use css and other static files from public

//routes
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

//using JWT for this route
app.use(verifyJWT);
app.use('/employees', require('./routes/api/employees'));//this will deliver our json file from our API


// Route handlers
// app.get('/hello(.html)?', (req, res, next)=>{
//     console.log('attempted to load hello.html');
//     next()
// }, (req, res)=>{
//     res.send('Hello word!');
// });

//Other variant of route handlers
const one = (req, res, next) => {
    console.log('one');
    next();
}

const two = (req, res, next) => {
    console.log('two');
    next();
}

const three = (req, res) => {
    console.log('three');
    res.send('Finished!');
}

app.get('/chain(.html)?', [one, two, three]);

//all searches after /
// app.get('/*', (req, res)=>{
//     res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
// });
app.all('*', (req, res)=>{
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ error: '404 not found' });
    } else {
        res.type('txt').send('404 not found')
    } 
});

app.use(errorHandler);

//if we are not connected to the DB, then we dont need to listen for requests
mongoose.connection.once('open', () =>{//we are listening for this event one time only
    console.log('Conneted to mongoDB');
    app.listen(PORT, ()=>console.log(`Server running on port ${PORT}`));//now we can listen for requests after secessfull connection
})


//Middleware is anything betweeb the request and response

//JWT JSOM Web Tokens. It takes place after user's authenication (logIn)

//Access Token process involves issuing an access token during user authorization, user's app can access our protected routes with the access token until it expires 
//our api will verify the access token with middleware every time the access token is used to make a request

//When access token expire the user's application will need to send their refresh token to our api's refresh endpoint to get a new access token
//Refresh token is also issued during user auth. Our rest api's refresh endpoint will verify the token and cross-ref. the refresh token in our database too (storing a reference to the refresh token in database will allow refresh token to be terminated early if the user decides log out)