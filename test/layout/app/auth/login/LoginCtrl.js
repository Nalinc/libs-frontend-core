define(['auth/module' , 'auth/models/User'], function (module) {

    "use strict";
    module.registerController('LoginCtrl', function ($scope, $rootScope, $state , Users) {
    	$scope.user = {};
    	$scope.login = function(user){
            if(user.username != undefined && user.password !=undefined){
                var isUserExist = false;
                for(var i  = 0 ; i < Users.users.length ; i++){
                    if(Users.users[i].username  == user.username){
                        if(Users.users[i].password == user.password){
                            $rootScope.user = Users.users[i];
                            $state.go("app.dashboard");
                            isUserExist = true;
                        }
                    }
                };
                if(!isUserExist){
                    $scope.invalideCredential = true;
                }
    	   }
        }
    })
});
