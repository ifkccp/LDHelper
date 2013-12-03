chrome.extension.onMessage.addListener(function (data, tab) {
	LDHunter.run()
})