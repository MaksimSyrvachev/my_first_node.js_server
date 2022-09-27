//Cross Origin Resource Sharing (allows other sourses to do requests to our server)
const whitelist = ['https://www.yoursite.com', 'http://127.0.0.1:5500', 'http://localhost:3500'];//we are setting what web sites can get an access to your nodejs source (back-end)
const corsOptions = {
    origin: (origin, callback) => {//origin in the paramthethies is origin that requests user
        if(whitelist.indexOf(origin) !== -1 || !origin) {//insexOf gives index of first fount element in the array, otherwise it is -1, !origin is equivalent of undefined
            //null means that there are no errors, true means that this origin is allowed to to futher
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
}

module.exports = corsOptions;