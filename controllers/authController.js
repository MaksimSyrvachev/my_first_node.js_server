// const userDB = {
//     users: require('../model/users.json'),
//     setUsers: function (data) { this.users = data }
// }

const User = require('../model/User');

const bcrypt = require('bcrypt');

//JWT start
const jwt = require('jsonwebtoken');
// const fsPromises = require('fs').promises;
// const path = require('path');

const handleLogin = async (req, res) => {
    const {user, pwd} = req.body;
    if (!user || !pwd) {
        return res.status(400).json({'message': 'Username and password are required'})//400 is bad request http status
    }
    const foundUser = await User.findOne({ username: user }).exec();
    if (!foundUser) return res.sendStatus(401);//Unauthorized
    // evaluete password
    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
        const roles = Object.values(foundUser.roles);
        //create JWTs (tokens)
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": foundUser.username,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET, 
            { expiresIn: '30s' }
        );//token is avaliable to all so u dont need to pass password, but just username
        const refreshToken = jwt.sign(
            {"username": foundUser.username},
            process.env.REFRESH_TOKEN_SECRET, 
            { expiresIn: '1d' }
        );
        //we always want to save our refresh token in the database
        //saving refresh token with current user

        foundUser.refreshToken = refreshToken;
        result = await foundUser.sava();
        console.log(result);
        // const otherUsers = userDB.users.filter(person => person.username !== foundUser.username);//array of other users witch are not logged in
        // const currentUser = {...foundUser, refreshToken};
        // userDB.setUsers([...otherUsers, currentUser]);
        // await fsPromises.writeFile(
        //     path.join(__dirname, '..', 'model', 'users.json'),
        //     JSON.stringify(userDB.users)
        // )

        //we also should send access token to current loggedin user
        //then as front-end we wanna send access token to memory (store it) but not in localhost or cookies because it is unsecure (everything that can be accessed with JS)
        //but if we set the cookie as http cookie only, it's not available to javascript 
        //cookie (params): cookie('name_of_cookie', token to send, options)
        res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 *1000});//max age opf the cookie is one day
        res.json({ accessToken });//front-end developper can grab the access token
    } else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin };