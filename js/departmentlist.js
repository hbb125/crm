$(function () {
	//实现获取列表
	getDepartmentList();
	async function getDepartmentList() {
		let result = await axios.get('/department/list')
		//   console.log(result);
		if (result.code !== 0) return alert('网络不给力,请稍后再试~')
		result = result.data;
		// console.log(result);
		let str = ``;
		result.forEach(item => {
			let {
				id,
				name,
				desc,
			} = item;
			str += `
		<tr>
		<td class="w10">${id}</td>
		<td class="w20">${name}</td>
		<td class="w40">${desc}</td>
		<td class="w20" departmentId='${id}'>
			<a href="javascript:;">编辑</a>
			<a href="javascript:;">删除</a>
		</td>
	</tr>
		`
		});
		$('tbody').html(str)
	}
	//实现编辑 删除
	$('tbody').on('click', 'a',async function (e) {
		let target = e.target,
			tag = target.tagName,
			text = target.innerHTML;
		// console.log(target,tag,text);
		if (tag === 'A') {
			if (text == '编辑') {
				let id = $(this).parent().attr('departmentId')
				window.location.href = 'departmentadd.html?id=' + id;
				return;
			}
			if (text == '删除') {
				let departmentId = $(this).parent().attr('departmentId')
				// console.log(departmentId);
				let flag = confirm('你确定要删除?')
				if (!flag) return;
				let result = await axios.get('/department/delete', { params: { departmentId } })
			     if (result.code === 0) {
					 alert('删除成功~')
					 $(this).parent().parent().remove();
					 return;
				 }
			}
		}
	})
})