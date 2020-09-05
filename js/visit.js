$(function () {
	//校验描述
	function checkDesc() {
	  let val = $('.visitText').val().trim();
		if (!/^[\u4e00-\u9fa5]{2,100}$/.test(val)) {
			$('.visitText').parent().siblings().html('必须为2~100个汉字~').css('color', 'red')
			return false;
		}
		$('.visitText').parent().siblings().html('格式正确~').css('color', 'blue')
	}
	$('.visitText').blur(checkDesc);

	let params = window.location.href.queryURLParams();
	let customerId = params.id;
	getVisitList()
	async function getVisitList() {
		let result = await axios.get('/visit/list', { params: { customerId } })
		// console.log(result);
		if (result.code == 0) {
			let str = ``;
			result = result.data;
			result.forEach((item, index) => {
				str += `
				 <tr>
				 <td class="w5">${index + 1}</td>
				 <td class="w15">${item.visitTime}</td>
				 <td class="w70 wrap" style="text-align:center;">${item.visitText}</td>
				 <td class="w10" delId='${item.id}'>
					 <a href="javascript:;">删除</a>
				 </td>
			 </tr>
				 `
			});
			$('tbody').html(str)
		}

	}
	//实现添加访问信息
	$('.submit').click(async function () {
		if ($('.visitTime').val() == '' || $('.visitText').val() == '') {
			alert('内容不能为空~')
			return;
		}
		let params = {
			customerId,
			visitTime: $('.visitTime').val(),
			visitText: $('.visitText').val().trim()
		}
		// console.log(parasm);
		let result = await axios.post('/visit/add', params);
		// console.log(result);
		if (result.code == 0) {
			alert('添加回访信息成功~')
			$('.visitTime').val('')
			$('.visitText').val('')
			getVisitList()
			return;
		}
	})
	//实现删除
	$('tbody').on('click', 'a',async function () {
		let flag = confirm('你确定要删除?')
		if (!flag) return;
		let visitId = $(this).parent().attr('delId')
		let result = await axios.get('/visit/delete', { params: { visitId } })
		if (result.code == 0) {
			$(this).parent().parent().remove()
			return;
		}
	})

})