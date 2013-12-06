chrome.extension.onMessage.addListener(function (settings, tab) {
	LDHelper.run(settings)
})