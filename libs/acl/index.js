/**
 * Created by M-Rayees on 11/9/2016.
 */
var acl = require('acl');
// var redis = require('redis');

console.log(mongoose.connection.db);

// var client = redis.createClient();

acl = new acl(new acl.mongodbBackend(mongoose.connection.db, 'acl_'));
// acl = new acl(new acl.redisBackend(client));

function Aclaadira() {

}
Aclaadira.prototype = {
    setRole: function (userId, role) {
        // acl.userRoles(userId, function (error, roles) {
        //     console.log(error);
        //     console.log(roles);
        // });
        // return new Promise(function (resolve, reject) {
        acl.addUserRoles(userId, role, function (a, b) {
            console.log("aaa==>", a);
            console.log("bbb==>", b);
        });

        // })
    },
    changeRole: function (userId, role) {
        return new Promise(function (resolve, reject) {
            acl.removeUserRoles(userId, role)
                .then(function (result) {
                    return acl.addUserRoles(userId, role);
                })
                .then(function (result) {
                    resolve(result);
                })
                .catch(function (error) {
                    reject(error);
                })
        });


    }
};

module.exports = Aclaadira;