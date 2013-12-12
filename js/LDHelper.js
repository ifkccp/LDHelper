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
			"space": "http://sns.lvye.cn/home.php?mod=space",
			
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

		this.reg_pool = {
			"ld": /pacecp&ac=credit">(\d+)<\/a><li>绿币/,
			"hash": /formhash"\svalue="(.*?)"/,
			"thread_id": /normalthread_(\d+)/g,
		}

		this.kw_pool = {
			"gift_succ": "恭喜您，任务已成功完成",
		}

		this.user = {}
		this.hash = ''

		// 迭代
		this.it_name = ''
		this.it_box = []
		this.it_index = -1
	}

	_L.prototype = {
		"next_action": null,
		"init": function(settings){
			if(this.has_init) { return }
			this.has_init = true

			var host = window.location.host
			host = host.substr(0, host.indexOf('.')) // sns & bbs
			this.host = host

			var _box = document.createElement('div')
			var words = ''

			var s = '<div id="LDH_mask"></div>'
			s += '<div id="LDH_log"><h3>LDHelper 1.0.0<span id="LDH_close"></span></h3><div>'+words+'<br /><span id="LDH_start"> start </span></div></div>'
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
				}
			}
		},
		"log": function(words, className){
			var _l = document.createElement('li')
			_l.className = className
			_l.innerHTML = words
			this.log_wrapper.appendChild(_l)
		},
		"run": function(){
			this.log("正在获取当前绿点状态...", "ing")
			var self = this
			if('sns' == this.host) {
				_L.next_action = this.visit
			} else {
				_L.next_action = this.cmt
			}
			Http.get(this.url_pool['space'], function(r){
				if(r.indexOf('请先登录后才能继续浏览') !== -1)
				{
					alert('木有登录你刷个P啊~~')
					window.location = "http://bbs.lvye.cn/member.php?mod=logging&action=login"
				}
				else
				{
					var ms = r.match(/discuz_uid\s=\s'(\d+)'/)
					self.user['uid'] = ms[1]
					ms = r.match(/pacecp&ac=credit">(\d+)<\/a><li>绿币/)
					self.ld_start = ms[1]
					self.log("当前拥有"+self.ld_start+"个绿点，土豪，我们做朋友吧~~", "succ")

					_L.next_action()
				}
			})
		},
		"visit": function() {
			console.log(this)
			if(!this.it_name)
			{
				console.log(this)
				console.log(this.log)
				this.log("正在访问好友页面...", "ing")
				var ids = this.settings.frds
				ids += "\n1163670"
				ids = ids.replace(/\n+/, "\n")
				ids = ids.split("\n")
				ids = ids.slice(0, 10)

				this.it_name = 'frds'
				this.it_box = ids
				this.it_index = 0
				_L.next_action = this.visit
			}

			var id = this.it_box[this.it_index]
			var self = this
			_L.next_action = this.twit
			if(this.it_index == this.it_box.length) {
				_L.next_action = this.twit
			}

			Http.get(this.url_pool['visit'].replace('[UID]', id), function(r){
				self.it_index++
				if(self.it_index == self.it_box.length) {
					self.log("成功访问10个好友", "succ")
				}
				_L.next_action()
			})
		},
		"twit": function() { alert('twit') },
		"cmt": function() { alert('cmt') },
	}

	return new _L
})()