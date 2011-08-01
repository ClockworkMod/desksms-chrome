$(document).ready(function() {
  chrome.browserAction.setBadgeBackgroundColor({color:[255,0,0,255]});
  var badger = function() {
    desksms.badge(function(err, data) {
      if(data && data.badge) {
        var badgeCount = $.cookie('badge');
        try {
          badgeCount = parseInt(badgeCount);
        }
        catch (e) {
          badgeCount = 0;
        }
        badgeCount += data.badge;
        chrome.browserAction.setBadgeText({ text: String(badgeCount) } );
      }
    });
  };
  setInterval(badger, 10000);
  badger();
});