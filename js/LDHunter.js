function l(arg) {
	if(console && console.log)
		console.log(arg)
}

var LDHunter = (function(){
	var Http = {
		"get": function() {
			return 50
		},
		"post": function() {
			return 100
		},
		"parse": function() {
			return 'parsed'
		}
	}

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
			s += '<div id="LDH_log"><h3>LDHunter 1.0.0<span id="LDH_close"></span></h3><ul></ul></div>'
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
			this.log_wrapper.scrollTop = 99999
		},
		"get_current_ld": function () {
			this.log("正在获取当前绿点状态...", "ing")
			var count = Http.get("LD")
			this.log("当前拥有"+count+"个绿点，土豪，我们做朋友吧~~", "succ")
			return 100
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
			this.log("领取成功，正在出售红包...", "ing")
			this.log("出售成功，售价5个绿点", "succ")
		},
		"visit": function() {
			this.log("正在访问好友页面...", "ing")
			this.log("成功访问20个好友", "succ")
			this.ld_inc(20 * this.price.visit)
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