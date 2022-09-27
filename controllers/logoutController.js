// const userDB = {
//     users: require('../model/users.json'),
//     setUsers: function (data) { this.users = data }
// }
// const fsPromises = require('fs').promises;
// const path = require('path');

const User = require('../model/User');

const handleLogout = async (req, res) => {
    // On client (front-end side) also delete the accessToken

    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.sendStatus(204);//No content to send back
    }
    const refreshToken = cookies.jwt;
    
    //Is refreshToken in DB?
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser){ 
        res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 *1000})
        return res.sendStatus(204);//no content
    }
    
    // We found the same refreshToken in DB, so we need to delete it from the DB

    // const otherUsers = userDB.users.filter(person => person.refreshToken !== foundUser.refreshToken);
    // const currentUser = {...foundUser, refreshToken: ''};
    // userDB.setUsers([...otherUsers, currentUser]);
    // await fsPromises.writeFile(
    //     path.join(__dirname, '..', 'model', 'users.json'),
    //     JSON.stringify(userDB.users)
    // )


    foundUser.refreshToken = '';
    const result = await foundUser.save();//we are updating the document with save
    console.log(result);

    res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 *1000}); // In production ehen we send and delete cookie we also wanna add flag {secure: true} - only serves on https (dev is using http)
    res.sendStatus(204);
}



module.exports = { handleLogout }