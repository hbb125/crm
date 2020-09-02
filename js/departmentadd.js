$(function () {
	let departmentId = null;
	let params = window.location.href.queryURLParams();
	if (params.hasOwnProperty('id')) {
		departmentId = params.id;
		//根据id实现数据的回显
		// console.log(departmentId);
		getBaseInfo(departmentId);
	}
	async function getBaseInfo(departmentId) {
		let result = await axios.get('/department/info', { params: { departmentId } })
		// console.log(result);
		if (result.code == 0) {
			result = result.data;
			$('.departmentName').val(result.name)
			$('.desc').val(result.desc)
			return;
		}
		alert('网络不给力,请稍后再试~')
		departmentId = null;
		return;
	}


	//校验部门名称
	function checkDepartmentName() {
		let val = $('.departmentName').val().trim();
		if (val.length == 0) {
			alert('此项为必填项~')
			return false;
		}
		//用户名必须为(2-10)哥汉字
		if (!/^[\u4e00-\u9fa5]{2,10}$/.test(val)) {
			$('.departmentName').parent().siblings().html('名字必须为2~10个汉字~').css('color', 'red')
			return false;
		}
		$('.departmentName').parent().siblings().html('用户名正确~').css('color', 'blue')
		return true;

	}
	//校验描述
	function checkDesc() {
		let val = $('.desc').val().trim();
		if (val.length == 0) {
			alert('此项为必填项~')
			return false;
		}
		//描述必须为(2-100)哥汉字
		if (!/^[\u4e00-\u9fa5]{2,100}$/.test(val)) {
			$('.desc').parent().siblings().html('名字必须为2~100个汉字~').css('color', 'red')
			return false;
		}
		$('.desc').parent().siblings().html('描述格式正确~').css('color', 'blue')
		return true;
	}
	$('.departmentName').blur(checkDepartmentName)
	$('.desc').blur(checkDesc)
	//实现添加部门
	$('.submit').click(async function () {
		if (!checkDepartmentName() || !checkDesc()) {
		   alert('你输入的信息不合法~')
		   return;
		}
		//实现编辑部门
		if (departmentId) {
			let result = await axios.post('/department/update', {
				departmentId,
				name: $('.departmentName').val().trim(),
				desc: $('.desc').val().trim(),

			})
			if (result.code == 0) {
				alert('修改部门信息成功~')
				window.location.href = 'departmentlist.html';
				return;
			}
			alert('网络不给力,请稍后重试~')
			return;
		}
		//实现添加部门
		let result = await axios.post('/department/add', {
			name: $('.departmentName').val().trim(),
			desc: $('.desc').val().trim(),
		})
		if (result.code == 0) {
			alert('添加部门成功');
			window.location.href = 'departmentlist.html';
			return;
		}
		alert('网络不给力,请稍后重试~')
		return;
	})
})