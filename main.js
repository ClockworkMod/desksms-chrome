$(document).ready(function() {
  chrome.browserAction.setBadgeBackgroundColor({color:[255,0,0,255]});
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
        badgeCount += data.badge;
        $.cookie('badge', badgeCount);
        chrome.browserAction.setBadgeText({ text: String(badgeCount) } );
      }
    });
  };
  setInterval(badger, 10000);
  badger();
});