const jwt = require('jsonwebtoken');

function generateToken(user) {
    if (!user)
        return;
    //TogggleSecret must be inside a env file.
    return jwt.sign(user, "TogggleSecret", {
        expiresIn: '4h'
    });
}

function verifyToken(email, token) {
    return jwt.verify(token, "TogggleSecret", (error, response) => {
        if (error) {
            return {
                verified: false,
                message: "invalid token"
            }
        }
        if (response.email !== email) {
            return {
                verified: false,
                message: "invalid user"
            }
        }
        return {
            verified: true,
            message: "verified"
        }
    })
}
module.exports.generateToken = generateToken;
module.exports.verifyToken = verifyToken;