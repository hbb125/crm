$(function () {
	//渲染客户列表
	initCustomerList();
	async function initCustomerList() {
		let result = await axios.get('/customer/list')
		result = result.code == 0 ? result = result.data : null;
		// console.log(result);
		let str = '';
		result.forEach(item => {
			item.sex = item.sex == 0 ? '女' : '男';
			str += `
			 <tr>
			 <td class="w8">${item.name}</td>
			 <td class="w5">${item.sex}</td>
			 <td class="w10">${item.email}</td>
			 <td class="w10">${item.phone}</td>
			 <td class="w10">${item.weixin}</td>
			 <td class="w10">${item.QQ}</td>
			 <td class="w5">${item.type}</td>
			 <td class="w8">${item.userName}</td>
			 <td class="w20">${item.address}</td>
			 <td class="w14">
						<a href="javascript:;" id= 'edit'>编辑</a>
						<a href="javascript:;" id = 'delete' deleteId = ${item.id}>删除</a>
						<a href="javascript:;">回访记录</a>
			 </td>
			 </tr>
			`
		});
		$('tbody').html(str)
	}
	// 编辑客户
	$('tbody').on('click', '#edit', function () {
		// axios.post('/customer/update',{})
		alert(11)
	})
	// 删除客户
	$('tbody').on('click', '#delete', async function () {
		alert(22)
		// console.log($(this).attr('deleteId'));
		// let customerId = parseInt($(this).attr('deleteId'));
		// console.log(customerId);
		// let res = await axios.get('/customer/delete?customerId=' + customerId)
		// let res = await axios.get('/customer/delete?',{params:{customerId}})
		// console.log(res);
		// if (res.code !== 0) return alert('删除失败')
		// if (confirm('你确定要删除')) {
		// 	alert('删除成功')
		// 	initCustomerList();
		// }
	})
})