chrome.extension.onMessage.addListener(function (settings, tab) {
	LDHelper.init(settings)
})