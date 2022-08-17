const healthPath = '/health';
const loginPath = '/login';
const scoreUpPath = '/scoreup';
const scoreDownPath = '/scoredown';
const verifyPath = '/verify';
const registerPath = '/register';
const registerService = require('./service/register')
const loginService = require('./service/login')
const userService = require('./service/user')
const verifyService = require('./service/verify')
const util = require('./utils/util')


exports.handler = async (event) => {
    console.log("Request Event: ", event);
    let response;
    switch (true) {
        case event.httpMethod === 'GET' && event.path === healthPath:
            response = util.buildResponse(200);
            break;

        case event.httpMethod === 'POST' && event.path === loginPath:
            const loginBody = JSON.parse(event.body);
            response = await loginService.login(loginBody);
            break;

        case event.httpMethod === 'POST' && event.path === scoreUpPath:
            const scoreUpBody = JSON.parse(event.body);
            const auth = verifyService.verify(scoreUpBody);
            if (auth.statusCode == 200) {
                response = await userService.scoreUp(scoreUpBody);
            }
            else {
                response = auth;
            }
            break;

        case event.httpMethod === 'POST' && event.path === scoreDownPath:
            const scoreDownBody = JSON.parse(event.body);
            const authDown = verifyService.verify(scoreDownBody);
            if (authDown.statusCode == 200) {
                response = await userService.scoreDown(scoreDownBody);
            }
            else {
                response = auth;
            }
            break;

        case event.httpMethod === 'POST' && event.path === registerPath:
            const registerBody = JSON.parse(event.body);
            response = await registerService.register(registerBody);
            break;

        case event.httpMethod === 'POST' && event.path === verifyPath:
            const verifyBody = JSON.parse(event.body);
            response = await verifyService.verify(verifyBody);
            break;

        default:
            response = util.buildResponse(404, "404 Not Found");
    }
    return response;
};

