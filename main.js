var setSound = function(sound) {
  if (sound == null || sound == '')
    return;
  localStorage['play-sound'] = sound;
  $("#notification").remove();
  var audio = $("<audio id='notification'><source src='http://desksms.appspot.com/notifications/" + sound.replace("-", ".") + "'></source></audio>");
  $("#body").append(audio);
}

var setupPush = function() {
  var badger = function() {
    desksms.badge(function(err, data) {
      if(data && data.badge) {
        var badgeCount = localStorage['badge'];
        try {
          badgeCount = parseInt(badgeCount);
          if (isNaN(badgeCount))
            badgeCount = 0;
        }
        catch (e) {
          badgeCount = 0;
        }
        var sound = localStorage['play-sound'];
        if (sound && sound != '') {
          var notification = $('#notification');
          if (notification.length > 0) {
            notification = notification[0];
            notification.play();
          }
        }
        badgeCount += data.badge;
        localStorage['badge'] = badgeCount;
        chrome.browserAction.setBadgeText({ text: String(badgeCount) } );
      }
    });
  }
  
  desksms.push(function(err, data) {
    console.log('badger');
    badger();
  });
  
  // kick it off right away to get a timestamp
  badger();
}

$(document).ready(function() {
  chrome.browserAction.setBadgeBackgroundColor({color:[255,0,0,255]});
  
  setSound(localStorage['play-sound']);
  
  var whoamiChecker = function() {
    desksms.whoami(function(err, data) {
      if (err || !data.email) {
        console.log('login fail.');
        return;
      }

      console.log('successfully logged in.');

      // prevent further whoamis from being called once logged in
      whoamiChecker = null;
      setupPush();
    });
  }

  whoamiChecker();

  chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    var e = request['event'];
    if (e == "login" && whoamiChecker) {
      whoamiChecker();
    }
    else if (e == "sound") {
      setSound(request.sound);
    }
  });
});