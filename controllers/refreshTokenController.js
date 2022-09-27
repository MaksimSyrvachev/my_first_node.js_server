// const userDB = {
//     users: require('../model/users.json'),
//     setUsers: function (data) { this.users = data }
// }

const User = require('../model/User');

//JWT start
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.sendStatus(401);
    }
    console.log(cookies.jwt);
    const refreshToken = cookies.jwt;
    
    const foundUser = await User.findOne({ refreshToken }).exec();//we can not to use refreshToken: refreshToken, because nemes of variables are simular
    if (!foundUser) return res.sendStatus(403);//Forbidden
    
    // evaluete jwt
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.username != decoded.username) return res.sendStatus(403);//we have username encoded in the token
            const roles = Object.values(foundUser.roles);
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": decoded.username,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET, 
                { expiresIn: '30s' }
            );
            res.json({ accessToken })
        }
    );
}



module.exports = { handleRefreshToken }