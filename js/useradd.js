$(function () {
	let userId = null;
	let params = window.location.href.queryURLParams();
	// console.log(params);
	if (params.hasOwnProperty('id')) {
		userId = params.id;
		//根据id实现数据的回显
		getBaseInfo(userId);
	}
	async function getBaseInfo(userId) {
		let result = await axios.get('/user/info', { params: { userId } })
		// console.log(result);
		if (result.code === 0) {
			result = result.data;
			$('.username').val(result.name);
			result.sex == 0 ? $('#man').prop('checked', true) : $('#woman').prop('checked', true);
			$('.useremail').val(result.email);
			$('.userphone').val(result.phone);
			$('.userdepartment').val(result.departmentId)
			$('.userjob').val(result.jobId);
			$('.userdesc').val(result.desc);
			return;
		}
		alert('编辑失败,网络不给力...')
		userId = null;
	}
	initDeptAndJob();
	//完成部门 职务的渲染
	async function initDeptAndJob() {
		let departmentData = await queryDepart();
		let jobData = await queryJob();
		// console.log(departmentData);
		// console.log(jobData);
		if (departmentData.code === 0) {
			departmentData = departmentData.data;
			let str = ``;
			departmentData.forEach(item => {
				str += `<option value="${item.id}">${item.name}</option>`;
				$('.userdepartment').html(str);
			});
		}
		if (jobData.code === 0) {
			jobData = jobData.data;
			let str = ``;
			jobData.forEach(item => {
				str += `<option value="${item.id}">${item.name}</option>`;
				$('.userjob').html(str);
			});
		}
	}
	//对用户名 进行校验
	function checkname() {
		//失去焦点，对数据进行校验 
		let val = $('.username').val().trim()
		if (val.length == 0) {
			$('.spanusername').html('此项为必填项~')
			return false;
		}
		//用户名必须为(2-10)哥汉字
		if (!/^[\u4e00-\u9fa5]{2,10}$/.test(val)) {
			$('.spanusername').html('名字必须为2~10个汉字~')
			return false;
		}
		$('.spanusername').html('用户名正确~').css('color', 'blue')
		return true;

	}

	//对邮箱校验
	function checkemail() {
		let val = $('.useremail').val().trim();
		if (val.length == 0) {
			$('.spanuseremail').html('此项为必填项~');
			return false;
		}
		if (!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(val)) {
			$('.spanuseremail').html('请输入正确的邮箱格式~')
			return false;
		}
		$('.spanuseremail').html('邮箱格式正确~').css('color', 'blue')
		return true;
	}

	//对电话校验
	function checkphone() {
		let val = $('.userphone').val().trim();
		if (val.length == 0) {
			$('.spanuserphone').html('此项为必填项~')
			return false;
		}
		if (!(/^1[3456789]\d{9}$/.test(val))) {
			$('.spanuserphone').html('请输入正确的手机号格式~')
			return false;
		}
		$('.spanuserphone').html('手机号格式正确~').css('color', 'blue')
		return true;
	}
	$('.username').blur(checkname)
	$('.useremail').blur(checkemail)
	$('.userphone').blur(checkphone)
	//实现添加用户
	$('.submit').click(async function () {
		if (!checkname() || !checkemail() || !checkphone()) {
			alert('你填写的数据不合法!!!')
			return;
		}
		//获取用户输入的信息
		let params = {
			name: $('.username').val().trim(),
			sex: $('#man').prop('checked') ? 0 : 1,
			email: $('.useremail').val().trim(),
			phone: $('.userphone').val().trim(),
			departmentId: $('.userdepartment').val(),
			jobId: $('.userjob').val(),
			desc: $('.userdesc').val().trim()
		}
		//判断是编辑还是新增
		if (userId) {
			//编辑
			params.userId = userId;
			let result = await axios.post('/user/update', params);
			// console.log(result);
			if (result.code == 0) {
				alert('修改用户信息成功!')
				window.location.href = 'userlist.html';
				return;
			}
			alert('网络不给力');
			return;
		}
		//发送请求添加用户
		let result = await axios.post('/user/add', params)
		// console.log(result);
		if (result.code == 0) {
			alert('添加用户成功')
			window.location.href = './userlist.html'
			return;
		}

	})

})