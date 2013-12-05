chrome.extension.onMessage.addListener(function (settings, tab) {
	LDHunter.run(settings)
})