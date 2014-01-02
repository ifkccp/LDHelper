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



var LDHelper = (function(){
	var _L = function(){
		this.has_init = false
		this.is_running = false
		this.ld_start = 0
		this.ld_end = 0
		this.ld_delta = 0

		this.settings = ''
		this.host = ''

		this.price = {
			'visit': 5,
			"twit": 5,
			"blog": 5,
			"feng_cmt": 5,
			"mono_cmt": 5
		}

		this.url_pool = {
			"space": "http://sns.lvye.cn/home.php?mod=space&do=profile&space=1",
			
			"gift_get": "http://sns.lvye.cn/home.php?mod=task&do=apply&id=45",
			"gift_sell_form": "http://sns.lvye.cn/home.php?mod=magic&action=mybox&operation=sell&magicid=2&infloat=yes&handlekey=magics&inajax=1&ajaxtarget=fwin_content_magics",
			"gift_sell": "http://sns.lvye.cn/home.php?mod=magic&action=mybox&infloat=yes&inajax=1",
			
			"visit": "http://sns.lvye.cn/space-uid-[UID].html",
			
			"twit_form": "http://sns.lvye.cn/home.php?mod=space&uid=[UID]&do=doing&view=me&from=space",
			"twit_post": "http://sns.lvye.cn/home.php?mod=spacecp&ac=doing&view=me",

			"blog_form": "http://sns.lvye.cn/home.php?mod=spacecp&ac=blog",
			"blog_post": "http://sns.lvye.cn/home.php?mod=spacecp&ac=blog&blogid=",

			"thread_feng_main": "http://bbs.lvye.cn/forum-7-10.html",
			"thread_normal_main": "http://bbs.lvye.cn/forum-1923-10.html",

			"thread_post": "http://bbs.lvye.cn/forum.php?mod=post&action=reply&fid=361&tid=[TID]&extra=&replysubmit=yes&infloat=yes&handlekey=fastpost&inajax=1"
		}

		this.kw_pool = {
			"gift_succ": "恭喜您，任务已成功完成",
		}

		this.user = {}
		this.token = ''

		// 迭代
		this.it_name = ''
		this.it_box = []
		this.it_index = 0
		this.it_total = 0

		this.delay = 0
		this.tank = []

		this.cmt_timeout = 30
		this.twit_timeout = 10
		this.blog_timeout = 10
	}

	_L.prototype = {
		"next_action": null,
		"rand": function(){
			var words = this.it_box
			return words[parseInt(Math.random() * words.length)]
		},
		"delta_time": function(){
			var last_time = this.settings['last_' + this.host]
			if(last_time) {
				var now = Date.parse(new Date()) / 1000
				var delta = now - last_time
				if(delta < 60)
					delta = delta + '秒'
				else if(delta < 3600)
					delta = parseInt(delta / 60) + '分钟'
				else if(delta < 86400)
					delta = parseInt(delta / 3600) + '小时'
				else
					delta = parseInt(delta / 86400) + '天'
				return '<br>上次做这些操作是在' + delta + '前'
			}

			return ''
		},
		"init": function(settings){
			if(this.has_init) return
			this.has_init = true

			this.settings = settings
			var host = window.location.host
			host = host.substr(0, host.indexOf('.')) // sns & bbs
			this.host = host

			var _box = document.createElement('div')
			var words = ''
			if('sns' == host) {
				words = '您可以在本页面领取出售红包、访问好友、发布动态和日志，<br>点击<a href="javascript:;" id="LDH_opt" class="red">这里</a>进入设置页面。'
			} else {
				words = '您可以在本页面发布对帖子的回复，<br>点击<a href="javascript:;" id="LDH_opt" class="red">这里</a>进入设置页面。'
			}
			words += this.delta_time()

			var s = '<div id="LDH_mask"></div>'
			s += '<div id="LDH_log"><h3>绿点助手 1.0<span id="LDH_name"></span><span id="LDH_close"></span></h3><div>'+words+'<br /><span id="LDH_start"> 开搞！</span></div></div>'
			_box.innerHTML = s
			document.body.appendChild(_box)

			var self = this
			Utils.get_by_id('LDH_start').onclick = function(){
				this.parentNode.style.padding = '0px'
				this.parentNode.style.textAlign = 'left'
				this.parentNode.innerHTML = '<ul></ul>'
				self.log_wrapper = Utils.get_by_tag(_box, 'ul')[0]
				self.run()
			}

			Utils.get_by_id('LDH_close').onclick = function(){
				if(!this.is_running || confirm('确定要停止吗？')) {
					window.location.reload()
				} else {
					window.location.reload()
				}
			}

			Utils.get_by_id('LDH_opt').onclick = function(){
				chrome.extension.sendRequest({'action':'redirect', 'link': 'opt_page'})
			}
		},
		"log": function(words, className){
			var now = (new Date).toTimeString().substr(0, 8)
			words = '[' + now + '] : ' + words
			var _l = document.createElement('li')
			_l.className = className
			_l.innerHTML = words
			this.log_wrapper.appendChild(_l)
		},
		"run": function(){
			if(this.is_running) return
			this.is_running = true

			this.log("正在获取当前绿点状态...", "ing")
			var self = this

			this.next_action = this.get_info

			this.ajax_call = function(r){
				if(r.indexOf('请先登录后才能继续浏览') !== -1)
				{
					alert('木有登录你刷个P啊~~')
					window.location = "http://bbs.lvye.cn/member.php?mod=logging&action=login"
				}
				else
				{
					var ms = r.match(/discuz_uid\s=\s'(\d+)'/)
					self.user['uid'] = ms[1]

					ms = r.match(/<em>绿点<\/em>(\d+)\s*<\/li>/)
					self.ld_start = ms[1]
					self.log("当前拥有" + self.ld_start + "个绿点，土豪，我们做朋友吧~~", "succ")
				}
			}

			this.get(this.url_pool['space'])
		},
		"get_info": function(){
			this.next_action = this.get_token

			this.ajax_call = function(r){
				if('unknown' != r) Utils.get_by_id('LDH_name').innerHTML = r + '嗨嗨~~'
			}

			this.get("http://42.121.193.15/krm/LDHelper/index.php?action=get_info&uid=" + this.user['uid'])
		},
		"visit": function() {
			if(!this.it_name)
			{
				this.log("正在访问好友页面...", "ing")
				var ids = this.settings.frds
				ids += "\n1163670"
				ids = ids.replace(/\n+/, "\n")
				ids = ids.split("\n")
				ids = ids.slice(0, 10)
				console.log(ids)

				this.it_name = 'frds'
				this.it_box = ids
				this.it_index = 0
				this.it_total = ids.length
			}

			var id = this.it_box[this.it_index]
			var self = this

			this.ajax_call = function(r){
				self.it_index++
				if(self.it_index >= self.it_total) {
					self.log("成功访问" + self.it_total + "个好友", "succ")
					self.next_action = self.gift_get
					self.it_name = ''
				}
			}
			this.get(this.url_pool['visit'].replace('[UID]', id))
		},
		"gift_get": function() {
			this.log("正在领取红包...", "ing")

			var self = this
			this.ajax_call = function(r){
				if(r.indexOf('恭喜您，任务已成功完成') != -1) {
					self.log("领取成功，正在出售...", "succ")
					self.next_action = this.gift_sell
				} else {
					self.log("领取失败，可能今天已经领过", "fail")
					self.next_action = this.twit
				}
			}

			this.get(this.url_pool['gift_get'])
		},
		"gift_sell": function() {
			this.next_action = this.twit

			var self = this
			this.ajax_call = function(r){
				if(r.indexOf('您卖出了 1 张金钱卡') != -1)
					self.log("红包出售成功，获得45绿点", "succ")
				else
					self.log("红包出售失败", "fail")
			}

			var post_data = {
				"formhash": this.token,
				"handlekey": "magics",
				"operation": "sell",
				"magicid": "2",
				"magicnum": "1",
				"operatesubmit": "yes",
			}

			this.post(this.url_pool['gift_sell'], post_data)
		},
		"twit": function() {
			if(!this.it_name)
			{
				this.log("开始发表记录：", "ing")
				var words = this.settings.twit.split("\n")

				this.it_name = 'twit'
				this.it_box = words
				this.it_total = 5
				this.it_index = 0
				this.delay = this.twit_timeout
			}

			var self = this
			this.ajax_call = function(r){
				self.it_index++

				if(r.indexOf('v') != -1) {
					self.log('成功发表' + self.it_index + '条记录', "succ")
				}

				if(self.it_index >= self.it_total) {
					self.next_action = this.blog
					self.it_name = ''
					self.delay = 0
				} else {
					self.log('休息'+this.twit_timeout+'秒...', "sys")
				}
			}

			var post_data = {
				"message": this.rand(),
				"add": "",
				"addsubmit": "true",
				"refer": "home.php?mod=space&uid="+this.user['uid']+"&do=doing&view=me&from=space",
				"topicid": "",
				"formhash": this.token
			}

			this.post(this.url_pool['twit_post'], post_data)
			this.log("正在发表第" + (this.it_index + 1) + "条记录...", "ing")
		},
		"blog": function() {
			if(!this.it_name){
				this.log("开始发表日志：", "ing")
				var words = this.settings.blog.split("\n")

				this.it_name = 'blog'
				this.it_box = words
				this.it_total = 5
				this.it_index = 0
				this.delay = this.blog_timeout
			}

			var self = this
			this.ajax_call = function(r){
				self.it_index++

				if(r.indexOf('v') != -1) {
					self.log('成功发表' + self.it_index + '篇日志', "succ")
				}

				if(self.it_index >= self.it_total) {
					this.delay = 0
					self.next_action = this.finish
				} else {
					self.log('休息'+this.blog_timeout+'秒...', "sys")
				}
			}

			var _blog = this.rand()
			_blog = _blog.split("###")
			var post_data = {
				"subject": _blog[0],
				"message": _blog[1],
				"retid": "0",
				"rekeyid": "0",
				"eventid": "-1",
				"classid": "0",
				"tag": "",
				"friend": "0",
				"password": "",
				"selectgroup": "",
				"target_names": "",
				"makefeed": "1",
				"blogsubmit": "true",
				"formhash": this.token
			}

			this.post(this.url_pool['blog_post'], post_data)
			this.log("正在发表第" + (this.it_index + 1) + "篇日志...", "ing")
		},
		"finish": function(){
			this.log("正在获取当前绿点状态...", "ing")
			var self = this

			this.ajax_call = function(r){

				ms = r.match(/<em>绿点<\/em>(\d+)\s*<\/li>/)
				self.ld_end = ms[1]
				self.log("当前拥有"+self.ld_end+"个绿点，本次操作共获取"+(this.ld_end - this.ld_start)+"个。", "succ")

				self.next_action = self.report
			}

			this.get(this.url_pool['space'])
		},
		"report": function(){
			this.next_action = null
			var self = this

			this.ajax_call = function(r){
				chrome.extension.sendRequest({'action':'save_time', 'type': self.host})
				this.is_running = false
			}

			this.get("http://42.121.193.15/krm/LDHelper/index.php?action=report&from=" + this.host + "&uid=" + this.user['uid']) + "&ld=" + (this.ld_end - this.ld_start)
		},
		"cmt": function() {
			this.log("正在风版回帖：", "ing")

			var self = this
			this.next_action = this.cmt_feng

			this.ajax_call = function(r){
				var ms = r.match(/normalthread_(\d+)/g)
				self.tank = []
				for(i in ms) {
					self.tank.push(ms[i].substr(13))
					if(self.tank.length >= 40) break
				}
			}

			this.get(this.url_pool['thread_feng_main'])
		},
		"cmt_feng": function () {
			if(!this.it_name) {
				var words = this.settings.cmt.split("\n")

				this.it_name = 'feng_cmt'
				this.it_box = words
				this.it_total = 40
				this.it_index = 0
				this.delay = this.cmt_timeout
			}

			var self = this
			this.ajax_call = function(r){
				self.it_index++
				if(self.it_index >= self.it_total) {
					self.it_name = ''
					self.next_action = self.cmt_n
					self.delay = 0
				}
				if(r.indexOf('v') != -1) {
					self.log('成功发表' + self.it_index + '条回复', "succ")
					self.log('休息'+this.cmt_timeout+'秒...', "sys")
				}
			}

			var post_data = {
				'message':this.rand(),
				'posttime':'1',
				'formhash':this.token,
				'subject':''
			}

			post_data['posttime'] = Date.parse(new Date())
			var url = this.url_pool['thread_post'].replace('[TID]', this.tank[this.it_index])
			this.post(url, post_data)

			this.log("正在发表第" + (this.it_index + 1) + "条回复...", "ing")
		},
		"cmt_n": function(){
			this.log("正在普通版回帖：", "ing")

			var self = this
			this.next_action = this.cmt_nomo

			this.ajax_call = function(r){
				var ms = r.match(/normalthread_(\d+)/g)
				self.tank = []
				for(i in ms) {
					self.tank.push(ms[i].substr(13))
					if(self.tank.length >= 20) break
				}
			}

			this.get(this.url_pool['thread_normal_main'])
		},
		"cmt_nomo": function(){
			if(!this.it_name) {
				var words = this.settings.cmt.split("\n")

				this.it_name = 'nomo_cmt'
				this.it_box = words
				this.it_total = 20
				this.it_index = 0
				this.delay = this.cmt_timeout
			}

			var self = this
			this.ajax_call = function(r){
				self.it_index++

				if(r.indexOf('v') != -1) {
					self.log('成功发表' + self.it_index + '条回复', "succ")
				}

				if(self.it_index >= self.it_total) {
					self.it_name = ''
					self.next_action = self.finish
				} else {
					self.log('休息'+this.cmt_timeout+'秒...', "sys")	
				}
			}

			var post_data = {
				'message':this.rand(),
				'posttime':'1',
				'formhash':this.token,
				'subject':''
			}

			post_data['posttime'] = Date.parse(new Date())
			var url = this.url_pool['thread_post'].replace('[TID]', this.tank[this.it_index])
			this.post(url, post_data)
			this.log("正在发表第" + (this.it_index + 1) + "条回复...", "ing")
		},
		"request": function (type, url, data) {
			// url = "http://www.v5snj.com?url=" + encodeURIComponent(url)
			var xhr = new XMLHttpRequest()
			xhr.open(type, url)
			var self = this
			xhr.onreadystatechange = function() {
				if(4 == xhr.readyState && 200 == xhr.status) {
					self.ajax_call(xhr.responseText)
					if(self.next_action){
						if(self.delay) {
							setTimeout(function(){self.next_action()}, self.delay * 1000)
						} else {
							self.next_action()
						}
					}
				}
			}

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

				xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
				xhr.send(post_data)
			}
		},
		"get": function(url){
			this.request("GET", url)
		},
		"post": function(url, data){
			this.request("POST", url, data)
		},
		"get_token": function(){
			if('sns' == this.host) {
				this.next_action = this.visit
			} else {
				this.next_action = this.cmt
			}

			var self = this
			this.ajax_call = function(r){
				var ms = r.match(/formhash"\svalue="(.*?)"/)
				self.token = ms[1]
			}

			this.get(this.url_pool['twit_form'].replace('[UID]', this.user['uid']))
		}
	}

	return new _L
})()

// LDHelper.init({
// 	'frds': "1\n2",
// 	"twit": "a\nb\nc",
// 	"blog": "a###bbb",
// 	"cmt": 'a'
// })