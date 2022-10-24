let wikiUrl;
chrome.storage.sync.get({ wikiUrl: '' }, function(items) {
  wikiUrl = items.wikiUrl;
});

let quickSearchApi  = "wiki/rest/quicknav/1/search?query=";
let fullSearchApi  = "dosearchsite.action?queryString=";

let controller = new AbortController();
let requestInProgress = false;

chrome.omnibox.onInputChanged.addListener(
  function(text, suggest) {
    if (requestInProgress) {
      controller.abort();
      controller = new AbortController();
      requestInProgress = false;
    }

    requestInProgress = true;
    fetch(wikiUrl + "/" + quickSearchApi + text, {
      signal: controller.signal
    })
      .then((response) => response.json())
      .then((data) => {
        let results = [];
        let entries = data.contentNameMatches;

        if (typeof entries[0] == "undefined") {
          return;
        }

        if (entries[0][0].className === "search-for") {
          return;
        }

        for (var i = 0, entry; i < 5 && (entry = entries[0][i]); i++) {
          let content = entry.name.replace(/\&lsquo\;|\&rsquo\;/g, '&quot;');
          results.push({
            content:  entry.href,
            description: content
          });
        }

        suggest(results);
      })
      .catch(() => {})
      .finally(() => {
        requestInProgress = false;
      });
  }
);

// This event is fired with the user accepts the input in the omnibox.
chrome.omnibox.onInputEntered.addListener(
  function(text) {
    if (text.startsWith('/')) {
      navigate(wikiUrl + text);
    } else {
      navigate(wikiUrl + '/' + fullSearchApi + text);
    }
  }
);

function navigate(url) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.update(tabs[0].id, {url: url});
  });
}
