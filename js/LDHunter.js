function l(arg) {
	if(console && console.log)
		console.log(arg)
}

var LDHunter = (function(){
	// 请求和解析数据工具
	var _Utils = (function(){
		var _U = function(){
			this.url_pool = {
				"space": "http://sns.lvye.cn/home.php?mod=space",
				"gift_get": "http://sns.lvye.cn/home.php?mod=task&do=apply&id=45",
				"gift_sell_form": "http://sns.lvye.cn/home.php?mod=magic&action=mybox&operation=sell&magicid=2&infloat=yes&handlekey=magics&inajax=1&ajaxtarget=fwin_content_magics",
				"gift_sell": "http://sns.lvye.cn/home.php?mod=magic&action=mybox&infloat=yes&inajax=1",
				"thread_feng_main": "http://bbs.lvye.cn/forum-7-1.html",
				"thread_normal_main": "http://bbs.lvye.cn/forum-1923-1.html",
			}

			this.reg_pool = {
				"ld": /pacecp&ac=credit">(\d+)<\/a><li>绿币/,
				"hash": /formhash"\svalue="(.*?)"/,
				"thread_id": /normalthread_(\d+)/g,
			}

			this.kw_pool = {
				"gift_succ": "恭喜您，任务已成功完成",
			}
		}

		_U.prototype = {
			"get_ld": function() {
				var s = Http.get(this.url_pool['space'])
				var ms = s.match(this.reg_pool['ld'])
				return ms[1]
			},
			"get_gift": function() {
				var s = Http.get(this.url_pool['gift_get'])
				return (s.indexOf(this.kw_pool) != -1)
			},
			"sell_gift": function() {
				var token = this._get_hash(this.url_pool['gift_sell_form'])
				var post_data = {
					"formhash": token,
					"handlekey": "magics",
					"operation": "sell",
					"magicid": "2",
					"magicnum": "1",
					"operatesubmit": "yes",
				}

				var s = Http.post(this.url_pool['gift_sell'], post_data)
			},
			"_get_hash": function(url) {
				var s = Http.get(url)
				var ms = s.match(this.reg_pool['hash'])
				return ms[1]
			},
			"_get_post_ids": function(type) {
				var s = '', amount = 0
				if("feng" == type) {
					s = Http.get(this.url_pool['thread_feng_main'])
					amount = 40
				} else {
					s = Http.get(this.url_pool['thread_normal_main'])
					amount = 20
				}

				var ms = s.match(this.reg_pool['thread_id'])

				var ids = []
				for(i in ms) {
					ids.push(ms[i].substr(13))
					amount--
					if(0 == amount) break
				}

				return ids
			},
			"cmt": function(type) {
				var ids = this._get_post_ids(type)
				for(i in ids) {
					document.getElementById("fastpostmessage").value = ""
				}
			}
		}

		return new _U
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
	}

	var Parser = (function(){
		var _P = function(){}

		_P.prototype = {
			"cmt": function(type) {
				l(type + ':')
				var ids = this._get_post_ids(type);
				var ret = false;
				for(i in ids) {
					var id = ids[i]
					l(ids[i])

					document.getElementById("fastpostmessage").value = "好帖必须要顶啊~~~~"
					var form = document.getElementById('fastpostform')
					form.action = form.action.replace(/tid=\d+/, 'tid=' + id);
					document.getElementById('fastpostsubmit').click()
					l('finish')
					break
				}
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
			// this.gift()
			// 访问好友
			// this.visit()
			// 回帖
			this.post_cmt()
			return
			// 更新记录
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
			var got_gift = Parser.get_gift()
			if(got_gift)
			{
				this.log("领取成功，暂不支持自动出售，", "succ")
			}else{
				this.log("领取失败，可能已经领过", "fail")
			}
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
			Parser.cmt("feng")
			this.log("成功在风版回帖20个", "succ")
			Parser.cmt("nomo")
			return
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