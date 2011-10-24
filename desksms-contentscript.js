(function() {
  console.log('desksms content script started.');
  
  var sound;
  var toast;
  function settingsLooper() {
    var newSound = localStorage['play-sound'];
    if (newSound != sound) {
      sound = newSound;
      chrome.extension.sendRequest({"event": "sound", "sound": sound });
    }
    
    var newToast = localStorage['chrome-notifications'];
    if (newToast != toast) {
      toast = newToast;
      chrome.extension.sendRequest({"event": "toast", "toast": toast });
    }
  }
  
  settingsLooper();

  var t;
  function looper() {
    var email = document.getElementById("chrome-extension-data").innerText;
    
    if (email && email != '') {
      console.log('notifying extension of login');
      chrome.extension.sendRequest({"event": "login", "email": email });
      return;
    }
    
    t = setTimeout(looper, 10000);
  }
  
  looper();
  
  var exists = document.createElement('div');
  exists.id = "has-chrome-extension";
  exists.setAttribute("class","hidden");
  exists.setAttribute("className","hidden");
  document.getElementById('browser-extension-data').appendChild(exists);
})();
