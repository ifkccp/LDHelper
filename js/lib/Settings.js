var Settings = (function(){
	var localStorage = chrome.extension.getBackgroundPage().localStorage

	var _S = function(){
		this.cache = {}
	}

	_S.prototype = {
		"get": function(key, defaultVal) {
			if(this.cache[key])
				return this.cache[key]

			if(!localStorage.config)
				return defaultVal

			var config = JSON.parse(localStorage.config)
			if(config[key])
				return config[key]
			else
				return defaultVal

		},
		"set": function(key, value) {
			this.cache[key] = value

			var config = {}
			if(localStorage.config)
				config = JSON.parse(localStorage.config)

			config[key] = value
			localStorage.config = JSON.stringify(config)
		}
	}

	return new _S
})()

// Settings.set('a', 'b')
// console.log(Settings.get('a'))
// console.log(Settings.get('e', 'f'))