chrome.extension.onRequest.addListener(function (data, tab) {
	LDHunter.run()
})