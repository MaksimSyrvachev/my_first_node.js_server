jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);//Unauthorised
    //console.log(authHeader); // Bearer token 
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        //callback
        (err, decodedInfo) => {
            if (err) return res.sendStatus(403);//invalid token
            req.user = decodedInfo.UserInfo.username;
            req.roles = decodedInfo.UserInfo.roles;
            next();
        }
    );
}

module.exports = verifyJWT

//now we want to add this middleware to routes that we wanna protect