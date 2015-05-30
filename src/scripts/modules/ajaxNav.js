(function(window, document) {

  var judasChrist = window.judasChrist;
  var history = window.history;
  var location = window.location;
  var currentHost = location.protocol + '//' + location.host;
  var statePopped = false;

  function jumpToHash() {
    if(location.hash) {
      var el = document.getElementById(location.hash.substring(1));
      if(el) el.scrollIntoView();
    }
  }

  function clickHandler(e) {
    var target = e.target||e.srcElement;

    //make sure it's a local link
    if(target.nodeName !== 'A' || (target.href.indexOf(currentHost) < 0 && target.href.indexOf('/') !== 0)) return;

    e.preventDefault();

    //check if we're already on the page the link points to
    if(target.pathname === location.pathname) {
      //check if we should jump to a hash
      jumpToHash();
      return;
    }

    //get new page
    loadPage(target.href);
  }

  function loadPage(url, noPushState) {
    fetch(url)
      .then(function(res) {
        return res.text();
      })
      .then(function(html) {
        var wrap = document.createElement('div');
        wrap.innerHTML = html;
        var newContent = wrap.querySelector('main');
        var oldContent = document.querySelector('main');
        //need to find scripts in newContent and replace them so that the scripts are executed
        /* if scripts should be handled, uncomment this part
        Array.prototype.forEach.call(newContent.querySelectorAll('script'), function(oldScriptNode) {
          var newScriptNode = document.createElement('script');
          if(oldScriptNode.src) {
            newScriptNode.src = oldScriptNode.src;
          } else {
            newScriptNode.appendChild(document.createTextNode(oldScriptNode.innerHTML));
          }
          oldScriptNode.parentNode.replaceChild(newScriptNode, oldScriptNode);
        });
        */

        oldContent.parentNode.replaceChild(newContent, oldContent);

        if(!noPushState) {
          history.pushState(1, null, url);
        }
        statePopped = true;

        //check if we should jump to a hash
        jumpToHash();
      });
  }

  function popstateHandler(e) {
    if(statePopped || e.state) {
      loadPage(location.href, true);
    }
    statePopped = true;
  }

  function setup() {
    document.addEventListener('click', clickHandler, false);
    window.addEventListener('popstate', popstateHandler, false);
  }

  setup.unload = function() {
    document.removeEventListener('click', clickHandler, false);
    window.removeEventListener('popstate', popstateHandler, false);
  }

  judasChrist.ajaxNav = setup;

})(this, document);
