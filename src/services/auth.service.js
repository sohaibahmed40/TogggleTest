module.exports = {
    getUser: function () {
        const user = localStorage.getItem('user');
        if (typeof (user) == 'undefined') {
            return null
        } else {
            return JSON.parse(user);
        }
    },
    getToken: function () {
        return localStorage.getItem('token');
    },

    setUser: function (user) {
        localStorage.setItem('user', JSON.stringify(user))
    },

    setUserSession: function (user, token) {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
    },

    resetUserSession: function (user, token) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    },

}