function l(arg) {
	if(console && console.log)
		console.log(arg)
}

function load_pa (tabId, changeInfo, tab) {
    if("complete" == changeInfo.status) {
        var url = tab.url
        if(url && 
        	(url.indexOf('bbs.lvye.cn') != -1
        	|| url.indexOf('sns.lvye.cn') != -1 ))
    		chrome.pageAction.show(tabId)	
	}
}

chrome.tabs.onUpdated.addListener(load_pa)

function send_msg (tab) {
	chrome.tabs.sendMessage(tab.id, Settings.get_all(), function(r){
		// l(r)
	})
}

chrome.pageAction.onClicked.addListener(send_msg)

chrome.extension.onRequest.addListener( function(request, sender, sendResponse) {
	if('save_time' == request.action) {
		Settings.set('last_' + request.type, Date.parse(new Date())/1000)
	} else if('redirect' == request.action) {
		var opt_url = chrome.extension.getURL('/options.html')
		var tabId = sender.tab.id
		chrome.tabs.update(tabId, {url: opt_url})
	}
})

// function openOptions(firstTime) {
//     var url = "options.html";
//     if (firstTime)
//         url += "?firstTime=true";

//     var fullUrl = chrome.extension.getURL(url);
//     chrome.tabs.getAllInWindow(null, function (tabs) {
//         for (var i in tabs) { // check if Options page is open already
//             if (tabs.hasOwnProperty(i)) {
//                 var tab = tabs[i];
//                 if (tab.url == fullUrl) {
//                     chrome.tabs.update(tab.id, { selected:true }); // select the tab
//                     return;
//                 }
//             }
//         }
//         chrome.tabs.getSelected(null, function (tab) { // open a new tab next to currently selected tab
//             chrome.tabs.create({
//                 url:url,
//                 index:tab.index + 1
//             });
//         });
//     });
// }

// openOptions(true)