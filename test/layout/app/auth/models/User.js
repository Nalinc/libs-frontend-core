define(['auth/module'], function (module) {

    'use strict';

   return module.registerFactory('Users', function ($http, $q) {
        var dfd = $q.defer();

        var Users = {
            initialized: dfd.promise,
            users : undefined
        };
         $http.get('../server/api/users.json').then(function(response){
             Users.users = response.data;
        	 dfd.resolve(Users);
         });

        return Users;
    });

});
