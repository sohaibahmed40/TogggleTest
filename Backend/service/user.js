const AWS = require('aws-sdk');
AWS.config.update({
    region: 'ap-south-1'
});
const bcrypt = require('bcryptjs')
const util = require('../utils/util');
const auth = require('../utils/auth')

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const userTable = 'togggle-users';

async function scoreUp(requestBody) {
    const email = requestBody.user.email;
    if (!email) {
        return util.buildResponse(401, { message: "Email is required" })
    }
    const dynamoUser = await getUser(email);

    if (!dynamoUser || !dynamoUser.email) {
        return util.buildResponse(403, { message: "User does not exist" })
    }

    const userInfo = {
        ...dynamoUser, score: dynamoUser.score + 1
    }
    const savedUser = await saveUser(userInfo)
    delete userInfo.password
    const response = {
        user: userInfo
    }

    return util.buildResponse(200, response)
}

async function scoreDown(requestBody) {
    const email = requestBody.user.email;
    if (!email) {
        return util.buildResponse(401, { message: "Email is required" })
    }
    const dynamoUser = await getUser(email);
    if (!dynamoUser || !dynamoUser.email) {
        return util.buildResponse(403, { message: "User does not exist" })
    }
    const userInfo = {
        ...dynamoUser, score: dynamoUser.score - 1
    }

    const savedUser = await saveUser(userInfo);
    delete userInfo.password;
    const response = {
        user: userInfo
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

async function saveUser(user) {
    const params = {
        TableName: userTable,
        Item: user
    }
    return dynamoDb.put(params).promise().then((response) => {
        return true;
    }, error => { console.error('There is an Error saving user: ', error) })
}

module.exports.scoreUp = scoreUp;
module.exports.scoreDown = scoreDown;