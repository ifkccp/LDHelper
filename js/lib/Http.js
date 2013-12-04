var Http = (function(){
	var _H = function(){
		this.headers = {}
	}

	_H.prototype = {
		"get": function(url){
			return this._request("GET", url)
		},
		"post": function(url, data){
			this.set_header("Content-type", "application/x-www-form-urlencoded")
			return this._request("POST", url, data)
		},
		"set_header": function(k, v){
			this.headers[k] = v
		},
		"sleep": function(sec) {
			this.get("http://42.121.193.15/sleep.php?s=" + sec)
		},
		"_request": function(type, url, data){
			var resp = ''
			var xhr = nwe XMLHttpRequest()
			xhr.open(type, url, false)

			xhr.onreadystatechange = function() {
				if(4 == xhr.readyState && 200 == xhr.status) {
					resp = xhr.responseText
				}
			}

			for(i in this.headers) {
				xhr.setRequestHeader(i, this.headers[i])
			}
			this.headers = {}

			if("GET" == type) {
				xhr.send()
			}
			}else{
				var post_data = ''
				for(i in data) {
					post_data += i + '=' + data[i] + '&'
				}
				if(post_data) {
					post_data = post_data.substr(-1)
				}
				xhr.send(post_data)
			}

			return resp
		},
	}

	return new _H
})()