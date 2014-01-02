var Settings = (function(){
	var localStorage = chrome.extension.getBackgroundPage().localStorage

	var _S = function(){
		this.cache = {}
	}

	var DefaultVals = {
		"frds": "1\n2\n3",
		"cmt": "不错不错，精彩的帖子～～\n小手一抖，绿点到手～～\n弱弱地支持一下～～\n这帖子是要逆天啊！！！！",
		"twit": "今天吃了十个包子\n今天喝了十碗蛇羹\n今天捏了十个娃娃\n今天拉了十个小臭\n今天见了十个偶像",
		"blog": "标题1###内容1\n标题2###内容2\n标题3###内容3",
		"reply": "很漂亮的照片啊\n不错不错\n赞个～～",
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