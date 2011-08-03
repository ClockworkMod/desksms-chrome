var setupPush = function() {
  desksms.push(function(err, data) {
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
        badgeCount += data.badge;
        $.cookie('badge', badgeCount);
        chrome.browserAction.setBadgeText({ text: String(badgeCount) } );
      }
    });
  });
}

$(document).ready(function() {
  chrome.browserAction.setBadgeBackgroundColor({color:[255,0,0,255]});
  
  var whoamiLooper = function() {
    desksms.whoami(function(err, data) {
      if (err || !data.email) {
        setTimeout(whoamiLooper, 5000);
        return;
      }
      
      setupPush();
    });
  }

  whoamiLooper();
});