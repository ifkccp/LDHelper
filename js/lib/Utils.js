var Utils = {}

Utils.get_version = function() {
	return chrome.app.getDetails().version
}

Utils.get_by_id = function (id) {
	return document.getElementById(id)
}

Utils.get_by_class = function (className) {
	return document.getElementsByClassName(className)[0]
}

Utils.get_by_tag = function(obj, tagName) {
	return obj.getElementsByTagName(tagName)
}