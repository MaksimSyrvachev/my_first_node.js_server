// const userDB = {
//     users: require('../model/users.json'),
//     setUsers: function (data) { this.users = data }
// }

const User = require('../model/User');

// const fsPromises = require('fs').promises; //this is fo writing to a file (JSON)
// const path = require('path');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const {user, pwd} = req.body;
    if (!user || !pwd) {
        return res.status(400).json({'message': 'Username and password are required'})//400 is bad request http status
    }
    //check for duplicate usernames in the database 
    const duplicate = await User.findOne({ username: user }).exec();//.exec() if we are not using callback
    if (duplicate) return res.sendStatus(409);//Conflict
    try {
        //encrypt the password 
        const hashedPwd = await bcrypt.hash(pwd, 10);//we are not only hashing, but also adding the individual salt to be more complicated (not all passwords will be hashed the same way)
        //create and store the new user
        const result = await User.create ({
            'username': user,
            // "roles": { "User": 2001},// added by default to our scheama in mongoDB
            'password': hashedPwd
        });//this happens once, so we dont need to save it then

        //another variant:
        // const newUser = new User;
        // newUser.usermane = 'whatever'
        // const result = await newUser.save();
        console.log(result);
        //creating new object with new user and previous also
        // userDB.setUsers([...userDB.users, newUser]);
        // //wrighting this to the json (our simulation if database)
        // await fsPromises.writeFile(
        //     path.join(__dirname, '..', 'model', 'users.json'),
        //     JSON.stringify(userDB.users)
        // );
        // console.log(userDB.users);
        res.status(201).json({'success':`New user ${user} created!`})
    } catch (err) {
        res.status(500).json({'message': err.message});//500 means server error
    }
}

module.exports = {handleNewUser};