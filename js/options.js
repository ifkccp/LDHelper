var menus = {
	'frds': {
		'title': "好友设置",
		"tips": "请输入10个好友的数字id，一行一个"
	},
	"cmt": {
		"title": "回帖设置",
		"tips": "每行一条，回帖时将从中随机选择"
	},
	"twit": {
		"title": "记录设置",
		"tips": "每行一条，发表记录时将从中随机选择"
	},
	"blog": {
		"title": "日志设置",
		"tips": "每行一条，发表博客时将从中随机选择，标题和内容之间以###分隔"
	},
	"reply": {
		"title": "评论设置",
		"tips": "每行一条，发表评论时将从中随机选择"
	}
}

// 渲染表单
function render(item) {
	var ol = document.getElementsByClassName(item)[0].children[0]

	var val = Settings.get(item)
	var vals = val.split("\n")

	var s = ''
	for(j in vals) {
		s += '<li>'+vals[j]+'</li>';
	}
	ol.innerHTML = s
}

// 编辑
var box = document.getElementById('mask')
var box_title = document.getElementsByTagName('h4')[0]
var box_ta = document.getElementsByTagName('textarea')[0]
var box_tip = document.getElementsByTagName('i')[0]
var box_current_item = ''

function edit(item) {
	box_current_item = item
	box_title.innerHTML = menus[item]['title']
	box_tip.innerHTML = menus[item]['tips']
	box_ta.value = Settings.get(item)

	box.style.display = '-webkit-box'
	box_ta.focus()
}

for(i in menus) {
	render(i)
	var btn = document.getElementsByClassName('be_' + i)[0]
	btn.onclick = (function(i){
		return function(){ edit(i) }
	})(i)
}

// 关闭按钮
document.getElementsByClassName('close')[0].onclick = function() {
	box.style.display = 'none'
}

// 菜单事件
var menu_btns = document.getElementById("menu").getElementsByTagName('li')
for(i in menu_btns) {
	menu_btns[i].onclick = function(){
		if('active' == this.className) return
		document.getElementsByClassName('active')[0].className = ''
		this.className = 'active'
	}
}

// 保存
document.getElementsByClassName('submit')[0].onclick = function(){
	var val = box_ta.value
	val = val.replace(/\n+/g, "\n")
	if("\n" == val.substr(0, 1))
		val = val.substr(1)
	if("\n" == val.substr(-1))
		val = val.substr(0, val.length - 1)

	Settings.set(box_current_item, val)

	box.style.display = 'none'
	render(box_current_item)
}
