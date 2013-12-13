var Settings = (function(){
	var localStorage = chrome.extension.getBackgroundPage().localStorage

	var _S = function(){
		this.cache = {}
	}

	var DefaultVals = {
		"frds": "1\n2\n3",
		"cmt": "def1\ndef2\ndef3",
		"twit": "def1\ndef2\ndef3",
		"blog": "def1\ndef2\ndef3",
		"reply": "def1\ndef2\ndef3",
		"last_sns": '',
		"last_bbs": '',
	}

	_S.prototype = {
		"get": function(key) {
			if(this.cache[key])
				return this.cache[key]

			var defaultVal = ''
			if(DefaultVals[key])
				defaultVal = DefaultVals[key]

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
		},
		"get_all": function() {
			var ret = {}
			for(i in DefaultVals) {
				ret[i] = this.get(i)
			}
			return ret
		}
	}

	return new _S
})()

// Settings.set('a', 'b')
// console.log(Settings.get('a'))
// console.log(Settings.get('e', 'f'))