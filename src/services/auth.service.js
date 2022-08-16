module.exports = {
    getUser: function () {
        const user = sessionStorage.getItem('user');
        if (typeof (user) == 'undefined') {
            return null
        } else {
            return JSON.parse(user);
        }
    },
    getToken: function () {
        return sessionStorage.getItem('token');
    },

    setUser:function(user){
        sessionStorage.setItem('user',JSON.stringify(user))
    },

    setUserSession:function(user,token){
        sessionStorage.setItem('user',JSON.stringify(user));
        sessionStorage.setItem('token',token);
    },

    resetUserSession:function(user,token){
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
    },

}