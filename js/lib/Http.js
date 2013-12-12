var Http = (function(){
	var _H = function(){
		this.headers = {}
	}

	_H.prototype = {
		"get": function(url, func){
			return this._request(func, "GET", url)
		},
		"post": function(url, data, func){
			console.log('post : ' + url)
			this.set_header("Content-type", "application/x-www-form-urlencoded")
			return this._request(func, "POST", url, data)
		},
		"set_header": function(k, v){
			this.headers[k] = v
		},
		"sleep": function(sec) {
			this.get("http://42.121.193.15/sleep.php?s=" + sec + "&" + Math.random())
		},
		"_request": function(func, type, url, data){
			var resp = ''
			var xhr = new XMLHttpRequest()
			xhr.open(type, url)

			xhr.onreadystatechange = function() {
				if(4 == xhr.readyState && 200 == xhr.status) {
					resp = xhr.responseText
					func(xhr.responseText)
				}
			}

			for(i in this.headers) {
				xhr.setRequestHeader(i, this.headers[i])
			}
			this.headers = {}

			if("GET" == type) {
				xhr.send()
			}else{
				var post_data = ''
				for(i in data) {
					post_data += i + '=' + encodeURIComponent(data[i]) + '&'
				}
				if(post_data) {
					post_data = post_data.substr(0, post_data.length - 1)
				}
				xhr.send(post_data)
			}

			return resp
		},
		"payload": function(url, data) {
			var resp = ''
			var xhr = new XMLHttpRequest()
			xhr.open("POST", url, false)

			xhr.onreadystatechange = function() {
				if(4 == xhr.readyState && 200 == xhr.status) {
					resp = xhr.responseText
				}
			}

			for(i in this.headers) {
				xhr.setRequestHeader(i, this.headers[i])
			}
			this.headers = {}
			xhr.send(JSON.stringify(data))

			return resp
		}
	}

	return new _H
})()