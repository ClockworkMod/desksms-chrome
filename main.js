var setSound = function(sound) {
  if (sound == null || sound == '')
    return;
  localStorage['play-sound'] = sound;
  $("#notification").remove();
  var audio = $("<audio id='notification'><source src='http://desksms.appspot.com/notifications/" + sound.replace("-", ".") + "'></source></audio>");
  $("#body").append(audio);
}

var setupPush = function() {
  desksms.push(function(err, data) {
    if (data.envelope) {
      var incomingMessages = 0;
      $.each(data.envelope.data, function(index, message) {
        if (message.type != 'incoming')
          return;
        var icon = 'http://desksms.appspot.com/images/desksms-small.png';
        var name = message.name;
        if (!name)
          name = message.number;
        if (!name)
          return;
        if (!message.message)
          return;
        var title = "SMS Received: " + name;
        var notification = webkitNotifications.createNotification(icon, title, message.message);
        notification.show();
        setTimeout(function() {
          notification.cancel();
        }, 10000);

        incomingMessages++;
      });
      
      // don't update the badge if nothing is incoming
      if (incomingMessages == 0)
        return;

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
      badgeCount += incomingMessages;
      localStorage['badge'] = badgeCount;
      chrome.browserAction.setBadgeText({ text: String(badgeCount) } );
    }
  });
}

var showToast = false;

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
    else if (e == "toast") {
      showToast = request.toast;
    }
  });
});