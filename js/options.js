var menus = {
	'frds': {
		'title': "好友设置",
		"tips": "请输入10个好友的数字id，一行一个",
		"default": "default value1\ndefault value2"
	},
	"cmt": {
		"title": "回帖设置",
		"tips": "每行一条，回帖时将从中随机选择",
		"default": "default value1\ndefault value2"
	},
	"twit": {
		"title": "记录设置",
		"tips": "每行一条，发表记录时将从中随机选择",
		"default": "default value1\ndefault value2"
	},
	"blog": {
		"title": "日志设置",
		"tips": "每行一条，发表博客时将从中随机选择",
		"default": "default value1\ndefault value2"
	},
	"reply": {
		"title": "评论设置",
		"tips": "每行一条，发表评论时将从中随机选择",
		"default": "default value1\ndefault value2"
	}
}

function render(item) {
	var ol = document.getElementsByClassName(item)[0].children[0]

	var val = Settings.get(i, menus[item]['default'])
	menus[item]['default'] = val
	var vals = val.split("\n")

	var s = ''
	for(j in vals) {
		s += '<li>'+vals[j]+'</li>';
	}
	ol.innerHTML = s
}

var box = document.getElementById('mask')
var box_title = document.getElementsByTagName('h4')[0]
var box_ta = document.getElementsByTagName('textarea')[0]
var box_tip = document.getElementsByTagName('i')[0]
var box_current_item = ''

function edit(item) {
	box_current_item = item
	box_title.innerHTML = menus[item]['title']
	box_tip.innerHTML = menus[item]['tip']

	box.style.display = '-webkit-box'
}

for(i in menus) {
	render(i)
	var btn = document.getElementsByClassName('be_' + i)[0]
	btn.onclick = (function(i){
		return function(){ edit(i) }
	})(i)
}

document.getElementsByClassName('close')[0].onclick = function() {
	box.style.display = 'none'
}
