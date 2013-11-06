// Called when the url of a tab changes.  Displays the icon in the url bar.

// will at some point need to query the sites table to get urls to work on
function checkForValidUrl(tabId, changeInfo, tab){
    if (tab.url.indexOf('docs.python.org/2/library') > -1){
        chrome.pageAction.show(tabId);
    }
}

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);