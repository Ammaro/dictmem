


/*
 * Print stuff to popup.
 *
 * @param status - something to print
 */
function log(status) {
  document.getElementById('console').textContent += "\n" + JSON.stringify(status);
}
/*
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */

function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {

    var tab = tabs[0];
    var url = tab.url;
    callback(url);
  });
}

/**
 * @param {string} searchTerm - Search term for Google Image search.
 * @param {function(string,number,number)} callback - Called when an image has
 *   been found. The callback gets the URL, width and height of the image.
 * @param {function(string)} errorCallback - Called when the image is not found.
 *   The callback gets a string that describes the failure reason.
 */
function getXMLData(searchTerm, callback, errorCallback) {

  var myKey = "secret key";

  var dictUrl = 'http://www.dictionaryapi.com/api/v1/references/thesaurus';
  var dataFormat = "xml";
  var searchUrl = dictUrl + "/" + dataFormat  + "/" + encodeURIComponent(searchTerm) + "?key=" + myKey;

  var x = new XMLHttpRequest();
  x.open('GET', searchUrl);
  x.responseType = 'xml';
  // on success
  x.onload = function() {
    // Parse and process the response from Google Image Search.
    var response = x.response;
    if (!response) {
      errorCallback('No response from Dictionary search!');
      return;
    }
    callback(response);
  };
  // on errror
  x.onerror = function() {
    errorCallback('Network error.');
  };
  x.send();
}

function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

// TBD parse the xml
// turn it into json or whatever
function xmlToJson(xml) {
  return xml2json(xml, " ");
}

document.addEventListener('DOMContentLoaded', function() {

  document.getElementById("string-text").addEventListener('keydown', function(e){
      if(e.keyCode != 13) return;

      getXMLData("variety", function(result) {
            var xmlResult = document.getElementById('xml-result');
            result = xmlToJson(result);
            xmlResult.textContent = result;
            xmlResult.hidden = false;
          },
          function(errorMessage) {
            renderStatus('Cannot display result. ' + errorMessage);
      });
  });

  document.getElementById("click-me").addEventListener('click', function(){
      getXMLData("variety", function(result) {
          var xmlResult = document.getElementById('xml-result');
          xmlResult.textContent = result;
          xmlResult.hidden = false;

        }, function(errorMessage) {
          renderStatus('Cannot display result. ' + errorMessage);
      });
  });

});
