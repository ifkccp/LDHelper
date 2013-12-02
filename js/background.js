function l(arg) {
	if(console && console.log)
		console.log(arg)
}

function get_host (url) {
	
}

function load_pa (tabId, changeInfo, tab) {
	if("complete" == changeInfo.status) {
		chrome.pageAction.show(tabId)
		// chrome.tabs.sendMessage(tabId, {"a":"b"}, function(r){
		// 	l(r)
		// })
	}
}

chrome.tabs.onUpdated.addListener(load_pa)

function send_msg (tab) {
	chrome.tabs.sendMessage(tab.id, {"a":"b"}, function(r){
		l(r)
	})
}

chrome.pageAction.onClicked.addListener(send_msg)


function openOptions(firstTime) {
    var url = "options.html";
    if (firstTime)
        url += "?firstTime=true";

    var fullUrl = chrome.extension.getURL(url);
    chrome.tabs.getAllInWindow(null, function (tabs) {
        for (var i in tabs) { // check if Options page is open already
            if (tabs.hasOwnProperty(i)) {
                var tab = tabs[i];
                if (tab.url == fullUrl) {
                    chrome.tabs.update(tab.id, { selected:true }); // select the tab
                    return;
                }
            }
        }
        chrome.tabs.getSelected(null, function (tab) { // open a new tab next to currently selected tab
            chrome.tabs.create({
                url:url,
                index:tab.index + 1
            });
        });
    });
}

openOptions(true)