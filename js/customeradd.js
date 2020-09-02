$(function () {
	let customerId = null;
	let params = window.location.href.queryURLParams();
	// console.log(params);
	if (params.hasOwnProperty('id')) {
		customerId = params.id;
		//根据id实现数据的回显
		getBaseInfo(customerId);
	}
	async function getBaseInfo(customerId) {
		let result = await axios.get('/customer/info', { params: { customerId } })
		// console.log(result);
		if (result.code == 0) {
			result = result.data;
			$('.username').val(result.name)
			result.sex == 0 ? $('#man').prop('checked', true) : $('#woman').prop('checked', true);
			$('.useremail').val(result.email);
			$('.userphone').val(result.phone);
			$('.userqq').val(result.QQ);
			$('.userweixin').val(result.weixin);
			$('.type').val(result.type);
			$('.address').val(result.address);
			return;
		}
		alert('编辑失败,网络不给力...')
		userId = null;
	}

	//检验用户名 
	function checkusername() {
		//失去焦点，对数据进行校验 
		let val = $('.username').val().trim()
		if (val.length == 0) {
			$(this).parent().siblings().html('此项为必填项~').css('color', 'red')
			return false;
		}
		//用户名必须为(2-10)哥汉字
		if (!/^[\u4e00-\u9fa5]{2,10}$/.test(val)) {
			$(this).parent().siblings().html('名字必须为2~10个汉字~').css('color', 'red')
			return false;
		}
		$(this).parent().siblings().html('用户名正确~').css('color', 'blue')
		return true;
	}
	//检验邮箱
	function checkuseremail() {
		//失去焦点，对数据进行校验 
		let val = $('.useremail').val().trim();
		if (val.length == 0) {
			$(this).parent().siblings().html('此项为必填项~').css('color', 'red')
			return false;
		}
		if (!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(val)) {
			$(this).parent().siblings().html('请输入正确的邮箱格式~').css('color', 'red')
			return false;
		}
		$(this).parent().siblings().html('邮箱格式正确~').css('color', 'blue')
		return true;
	}
	//检验电话
	function checkuserphone() {
		//失去焦点，对数据进行校验 
		let val = $('.userphone').val().trim();
		if (val.length == 0) {
			$(this).parent().siblings().html('此项为必填项~').css('color', 'red')
			return false;
		}
		if (!(/^1[3456789]\d{9}$/.test(val))) {
			$(this).parent().siblings().html('请输入正确的电话格式~').css('color', 'red')
			return false;
		}
		$(this).parent().siblings().html('电话格式正确~').css('color', 'blue')
		return true;
	}
	//检验QQ
	function checkuserqq() {
		//失去焦点，对数据进行校验 
		let val = $('.userqq').val().trim();
		if (val.length == 0) {
			$(this).parent().siblings().html('此项为必填项~').css('color', 'red')
			return false;
		}
		//5~12位0不能开头的纯数字
		if (!/^\d{5,10}$/.test(val)) {
			$(this).parent().siblings().html('请输入正确的qq格式~').css('color', 'red')
			return false;
		}
		$(this).parent().siblings().html('qq格式正确~').css('color', 'blue')
		return true;
	}
	//检验微信
	function checkuserweixin() {
		//失去焦点，对数据进行校验 
		let val = $('.userweixin').val().trim();
		if (val.length == 0) {
			$(this).parent().siblings().html('此项为必填项~').css('color', 'red')
			return false;
		}
		//5~10位0不能开头的纯数字
		if (!/^\d{5,10}$/.test(val)) {
			$(this).parent().siblings().html('请输入正确的微信格式~').css('color', 'red')
			return false;
		}
		$(this).parent().siblings().html('微信格式正确~').css('color', 'blue')
		return true;
	}
	$('.username').blur(checkusername)
	$('.useremail').blur(checkuseremail)
	$('.userphone').blur(checkuserphone)
	$('.userqq').blur(checkuserqq)
	$('.userweixin').blur(checkuserweixin)

	//实现添加客户
	$('.submit').click(async function () {
		if (!checkusername() || !checkuseremail() || !checkuserphone() || !checkuserqq || !checkuserweixin) {
			alert('你填写的数据不合法!!!')
			return;
		}
		let params = {
			name: $('.username').val().trim(),
			sex: $('#man').prop('checked') ? 0 : 1,
			email: $('.useremail').val().trim(),
			phone: $('.userphone').val().trim(),
			QQ: $('.userqq').val().trim(),
			weixin: $('.userweixin').val().trim(),
			type: $('.type').val(),
			address: $('.address').val().trim(),
		}
		if (customerId) {
			params.customerId = customerId;
			let result = await axios.post('/customer/update', params)
			// console.log(result);
			if (result.code == 0) {
				alert('修改用户信息成功~')
				window.location.href = 'customerlist.html'
				return;
			}
			alert('网络不给力');
			return;
		}
		// console.log(params);
		let result = await axios.post('/customer/add', params)
		if (result.code == 0) {
			alert('添加客户成功~');
			window.location.href = 'customerlist.html'
			return;
		}
	})

})