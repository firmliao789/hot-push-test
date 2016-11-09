// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform, $ionicLoading, $timeout, $ionicPopup) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    var appUpdate = {
        // Application Constructor
        initialize: function() {
            this.bindEvents();
        },
        // Bind any events that are required.
        // Usually you should subscribe on 'deviceready' event to know, when you can start calling cordova modules
        bindEvents: function() {
            document.addEventListener('deviceready', this.onDeviceReady, false);
            document.addEventListener('chcp_updateLoadFailed', this.onUpdateLoadError, false);
        },
        // deviceready Event Handler
        onDeviceReady: function() {
        },
        onUpdateLoadError: function(eventData) {
            var error = eventData.detail.error;
            
            // 当检测出内核版本过小
            if (error && error.code == chcp.error.APPLICATION_BUILD_VERSION_TOO_LOW) {
                var dialogMessage = '有新的版本,请下载更新';
                
                // iOS端 直接弹窗提示升级，点击ok后自动跳转
                if(ionic.Platform.isIOS()){
                    chcp.requestApplicationUpdate(dialogMessage, this.userWentToStoreCallback, this.userDeclinedRedirectCallback);
                // Android端 提示升级下载最新APK文件
                }else if(ionic.Platform.isAndroid()){
                    var confirmPopup = $ionicPopup.confirm({
                        template: '有新的版本,请下载更新',
                        cssClass: 'popup',
                        cancelText:'取消',
                        okText:'升级'
                    });
                    confirmPopup.then(function (res) {
                        if (res) {
                            $ionicLoading.show({
                                template: "已经下载：0%"
                            });
                            window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function(fileEntry) {
                                fileEntry.getDirectory("***(app名称)", { create: true, exclusive: false }, function (fileEntry) {
                                    //下载代码
                                    var fileTransfer = new FileTransfer();
                                    fileTransfer.download("app下载地址", fileEntry.toInternalURL()+"***(app名称).apk", function(entry) {
                                        // 打开下载下来的APP
                                        cordova.plugins.fileOpener2.open(
                                            entry.toInternalURL(),//下载文件保存地址
                                            'application/vnd.android.package-archive', {//以APK文件方式打开
                                                error: function(err) {
                                                },
                                                success: function() {}
                                            });
                                    }, function(err) {
                                    },true);
                                    fileTransfer.onprogress = function(progressEvent) {
                                        $timeout(function () {
                                            var downloadProgress = (progressEvent.loaded / progressEvent.total) * 100;
                                            $ionicLoading.show({
                                                template: "已经下载：" + Math.floor(downloadProgress) + "%"
                                            });
                                            if (downloadProgress > 99) {
                                                $ionicLoading.hide();
                                            }
                                        });
                                    };
                                },function(err){alert("创建失败")});
                            });
                        }
                    });
                }
            }
        },
        userWentToStoreCallback: function() {
            // user went to the store from the dialog
        },
        userDeclinedRedirectCallback: function() {
            // User didn't want to leave the app.
            // Maybe he will update later.
        }
    };
    appUpdate.initialize();
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

});
