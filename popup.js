
var secret_key = "";

/*
 * Print stuff to popup.
 *
 * @param status - something to print
 */
function log(status) {
  var console = $("#console");
  console.text(console.text() + "\n" + JSON.stringify(status));

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

  var myKey = secret_key;
  var dictUrl = 'http://www.dictionaryapi.com/api/v1/references/thesaurus';
  var dataFormat = "xml";
  var searchUrl = dictUrl + "/" + dataFormat  + "/" +
                  encodeURIComponent(searchTerm) + "?key=" + myKey;
  // on success
  var aj = $.ajax({
    url: searchUrl,
    dataType: "text"
  }).done(callback).fail(errorCallback);

}

function renderStatus(statusText) {
  $("#status").val(statusText);
}

// TBD parse the xml
// turn it into json or whatever
function xmlToJson(xml, term) {
  var xmlDoc = $.parseXML( xml );
  var $xml = $(xmlDoc);
  var base = "#"+term;

  var $term = $xml.find(base+" term hw").text();
  var $mean = $xml.find(base+" mc").text();
  var $synon = $xml.find(base+" syn").text();
  var $rel = $xml.find(base + " rel").text();
  return {"term" : $term,
          "mean" : $mean,
          "synon" : $synon,
          "rel": $rel
        };
}


function renderResult(result) {
  return "<h2>"+result["term"]+"</h2>" + "<hr>" +
         "<p>"+result["mean"] + "</p>" +  "<hr>" +
         "<p>"+result["synon"] + "</p>" + "<hr>";
}

document.addEventListener('DOMContentLoaded', function() {

  log("document loaded");

  var translateHandler = function(e){
      var term = $("#string-text").val();
      // handle keycodes for input widget
      if(e && e.keyCode && e.keyCode != 13) return;
      getXMLData(term, function(result) {
            var xmlResult = $('#xml-result');
            result = xmlToJson(result, term);
            xmlResult.html(renderResult(result));
            xmlResult.show();
            renderStatus('Everything was fine. mam. ');
          },
          function(errorMessage) {
            renderStatus('Cannot display result. ' + errorMessage);
      });
  }

  $.getJSON("config.json", function(json){
      log("json loaded");
      secret_key = json["secret key"];
      $("#click-me").on("click", translateHandler);
      $("#string-text").on("keydown", translateHandler);
  });

});
