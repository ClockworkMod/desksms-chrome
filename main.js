var setupPush = function() {
  var badger = function() {
    desksms.badge(function(err, data) {
      if(data && data.badge) {
        var badgeCount = $.cookie('badge');
        try {
          badgeCount = parseInt(badgeCount);
          if (isNaN(badgeCount))
            badgeCount = 0;
        }
        catch (e) {
          badgeCount = 0;
        }
        if (badgeCount) {
          $('#notification-sound')[0].play();
        }
        badgeCount += data.badge;
        $.cookie('badge', badgeCount);
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
  
  var whoamiLooper = function() {
    desksms.whoami(function(err, data) {
      if (err || !data.email) {
        setTimeout(whoamiLooper, 30000);
        return;
      }
      
      setupPush();
    });
  }

  whoamiLooper();
});