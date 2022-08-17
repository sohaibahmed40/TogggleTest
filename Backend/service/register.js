const AWS = require('aws-sdk');
AWS.config.update({
    region: 'ap-south-1'
});
const bcrypt = require('bcryptjs')
const util = require('../utils/util')

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const userTable = 'togggle-users';

async function register(userInfo) {
    const email = userInfo.email;
    const password = userInfo.password;
    if (!email || !password)
        return util.buildResponse(401, { message: "All fields are required" });
    const dynamoUser = await getUser(email);
    if (dynamoUser && dynamoUser.email) {
        return util.buildResponse(401, { message: "Email already registered, Please use another email to register" });
    }

    const encryptPassword = bcrypt.hashSync(password.trim(), 10);
    const user = {
        username: email,
        email: email,
        password: encryptPassword,
        score: 0
    }

    const savedUser = await saveUser(user);
    if (!savedUser) {
        return util.buildResponse(503, { message: "Server Error" });
    }
    return util.buildResponse(200, { email: email });
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

async function saveUser(user) {
    const params = {
        TableName: userTable,
        Item: user
    }
    return dynamoDb.put(params).promise().then(() => {
        return true;
    }, error => { console.error('There is an Error saving user: ', error) })
}

module.exports.register = register;
