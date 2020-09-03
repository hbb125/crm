$(function () {
	let jobId = null;
	let params = window.location.href.queryURLParams();
	// console.log(params);
	if (params.hasOwnProperty('id')) {
		jobId = params.id;
		//根据id实现数据的回显
		getBaseInfo(jobId);
	}
	async function getBaseInfo(jobId) {
		// console.log(jobId);
		let result = await axios.get('/job/info', { params: { jobId } })
		// console.log(result);
		if (result.code == 0) {
			result = result.data;
			$('.jobName').val(result.name);
			$('.desc').val(result.desc);
			return;
		}
		alert('网络不给力')
		jobId = null;
		return;	
	}
	//校验职务名
	function checkname() {
		let val = $('.jobName').val().trim()
		if (val.length == 0) {
			$('.jobName').parent().siblings().html('此项为必填项~').css('color', 'red');
			return false;
		}
		//用户名必须为(2-10)哥汉字
		if (!/^[\u4e00-\u9fa5]{2,10}$/.test(val)) {
			$('.jobName').parent().siblings().html('名字必须为2~10个汉字~').css('color', 'red')
			return false;
		}
		$('.jobName').parent().siblings().html('用户名正确~').css('color', 'blue')
		return true;
	}
	// 校验职务描述
	function checkesc() {
		let val = $('.desc').val().trim();
		if (val.length == 0) {
			// alert('此项为必填项~')
			$('.desc').parent().siblings().html('此项为必填项~').css('color', 'red')

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
	$('.jobName').blur(checkname)
	$('.desc').blur(checkesc)
	//实现添加职务
	$('.submit').click(async function () {
		if (!checkname() || !checkesc()) return alert('你输入的数据不合法~')

		let arr = $('input[name="job"]');
		let str = '';
		arr = Array.from(arr)
		arr.forEach(item => {
			// console.log($(item).prop('checked'));
			if ($(item).prop('checked').toString() === 'true') {
				str += '|' + $(item).val()
			}
		});
		// console.log(str);
		str = str.substr(1)
		let params = {
			name: $('.jobName').val().trim(),
			desc: $('.desc').val().trim(),
			power: str
		}
		//实现编辑
		if (jobId) {
			params.jobId = jobId;
			let result = await axios.post('/job/update', params)
			// console.log(result);
			if (result.code == 0) {
				alert('修改职务信息成功~')
				window.location.href = 'joblist.html'
				return;
			}
			alert('网络不给力');
			return;	
		}
		// console.log(params);
		let result = await axios.post('/job/add', params)
		// console.log(result);
		if (result.code == 0) {
			alert('添加职务成功~')
			window.location.href = 'joblist.html';
			return;
		}
	})
})