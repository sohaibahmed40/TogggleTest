const AWS = require('aws-sdk');
AWS.config.update({
    region: 'ap-south-1'
});
const bcrypt = require('bcryptjs')
const util = require('../utils/util');
const auth = require('../utils/auth')

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const userTable = 'togggle-users';

async function login(user) {
    const email = user.email;
    const password = user.password;
    if (!user || !email || !password) {
        return util.buildResponse(401, { message: "Email and Password are required" })
    }
    const dynamoUser = await getUser(email);
    if (!dynamoUser || !dynamoUser.email) {
        return util.buildResponse(403, { message: "User does not exist" })
    }
    if (!bcrypt.compareSync(password, dynamoUser.password)) {

        return util.buildResponse(403, { message: "Password is incorrect" })
    }
    const userInfo = {
        email: dynamoUser.email,
        score: dynamoUser.score
    }
    const token = auth.generateToken(userInfo)

    const response = {
        user: userInfo,
        token: token
    }

    return util.buildResponse(200, response)
}

async function getUser(email) {
    const params = {
        TableName: userTable,
        Key: {
            username: email
        }
    }
    return dynamoDb.get(params).promise().then(response => {
        return response.Item;
    }, error => { console.error('There is an Error: ', error) })
}
module.exports.login = login;