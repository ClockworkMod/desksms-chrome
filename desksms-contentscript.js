console.log('desksms content script started.');

(function() {
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
})();
