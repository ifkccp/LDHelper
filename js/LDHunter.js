function l(arg) {
	if(console && console.log)
		console.log(arg)
}

var LDHunter = (function(){
	var Http = (function(){
		var _H = function(){}

		_H.prototype = {
			"request": function(type, url){
				var resp = ''
				var xhr = new XMLHttpRequest()
				xhr.open(type, url, false)
				
				xhr.onreadystatechange = function() {
					l(xhr.readyState + ' - ' + xhr.status)
					if(4 == xhr.readyState && 200 == xhr.status)
					{
						resp = xhr.responseText
					}
				}
				xhr.send()

				return resp
			},
			"get": function (url) {
				return this.request("GET", url)
			},
			"post": function(url, data) {
				return ''
			}
		}

		return new _H;
	})()

	var L = function() {
		this.success = false
		this.ld_start = 0
		this.ld_end = 0
		this.ld_delta = 0

		this.price = {
			"visit": 5,
			"feng_cmt": 5,
			"nomo_cmt": 5,
			"twit": 5,
			"blog": 5
		}

		this.cfg = this.load_cfg()
	}

	var Parser = (function(){
		var _P = function(){}

		_P.prototype = {
			"get_ld": function(){
				var s = Http.get("http://sns.lvye.cn/home.php?mod=space")
				var ms = s.match(/pacecp&ac=credit">(\d+)<\/a><li>绿币/)
				return ms[1]
			}
		}

		return new _P
	})()

	L.prototype = {
		"load_cfg": function () {
			return {}
		},
		"run": function () {
			if(this.success) return;
			
			this.init_box()
			// 初始绿点
			this.ld_start = this.get_current_ld()
			// 每日红包
			this.gift()
			// 访问好友
			this.visit()
			// 回帖
			this.post_cmt()
			// 发表说说
			this.twit()
			// 发表日志
			this.blog()


			// 最终绿点
			this.ld_end = this.get_current_ld()
			this.result()
			this.success = true
		},
		"init_box": function () {
			var _box = document.createElement('div')

			var s = '<div id="LDH_mask"></div>'
			s += '<div id="LDH_log"><h3>LDHelper 1.0.0<span id="LDH_close"></span></h3><ul></ul></div>'
			_box.innerHTML = s
			this.log_wrapper = _box.getElementsByTagName('ul')[0]
			document.body.appendChild(_box)
			self = this
			document.getElementById('LDH_close').onclick = function(){
				if(self.success || confirm('确定要停止嘛？')) {
					window.location.reload()
				}
			}
		},
		"log": function(words, className) {
			var _l = document.createElement('li')
			_l.className = className
			_l.innerHTML = words
			this.log_wrapper.appendChild(_l)
			// this.log_wrapper.scrollTop = 99999
		},
		"get_current_ld": function () {
			this.log("正在获取当前绿点状态...", "ing")
			var count = Parser.get_ld()
			this.log("当前拥有"+count+"个绿点，土豪，我们做朋友吧~~", "succ")
			return count
		},
		"result": function() {
			this.log("本次运行，理论上应获得绿点"+this.ld_delta+"个，实际获得"+(this.ld_end - this.ld_start)+"个，超过了全球80%的驴友", "succ")
		},
		"ld_inc": function(n) {
			this.log("获得绿点"+n+"个", "red")
			this.ld_delta += n
		},
		"gift": function() {
			this.log("正在领取红包...", "ing")
			Http.get("http://sns.lvye.cn/home.php?mod=task&do=apply&id=45")
			this.log("领取成功，正在出售红包...", "ing")

			// Parser.get_formhash("")
// 			Http.post("http://sns.lvye.cn/home.php?mod=magic&action=mybox&infloat=yes&inajax=1", "formhash:0ef6b9b8
// handlekey:magics
// operation:sell
// magicid:2
// magicnum:1
// operatesubmit:yes")
			this.log("出售成功，售价45个绿点", "succ")
		},
		"visit": function() {
			this.log("正在访问好友页面...", "ing")

			var frds = [1163670], id = frds[0]
			for(var i = 0; i < 10; i++) {
				Http.get("http://sns.lvye.cn/space-uid-"+id+".html")
				id++
			}

			this.log("成功访问10个好友", "succ")
			this.ld_inc(10 * this.price.visit)
		},
		"post_cmt": function() {
			this.log("正在风版回帖：", "ing")
			this.log("成功在风版回帖20个", "succ")
			this.ld_inc(20 * this.price.feng_cmt)
			this.log("正在普通版回帖：", "ing")
			this.log("成功在普通版回帖20个", "succ")
			this.ld_inc(20 * this.price.nomo_cmt)
		},
		"twit": function() {
			this.log("正在发表说说...", "ing")
			this.log("成功发表5条说说", "succ")
			this.ld_inc(5 * this.price.twit)
		},
		"blog": function() {
			this.log("正在发表日志...", "ing")
			this.log("成功发表5篇博客", "succ")
			this.ld_inc(5 * this.price.blog)
		}
	}


	return new L;
})()

// LDHunter.run()