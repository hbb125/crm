$(function () {
	//实现显示职务列表
	getJobList();
	async function getJobList() {
		let result = await axios.get('/job/list');
		if (result.code !== 0) return alert('网络不给力,请稍后再试~')
		result = result.data;
		// console.log(result);
		let str = ``;
		result.forEach(item => {
			let {
				id,
				name,
				desc,
				power,
			} = item;
			//员工操作权|部门操作权|职务操作权|部门全部客户|公司全部客户|重置密码
			// let arr = power.split('|')
			let u = power.replace('userhandle', '员工操作权')
			let arr1 = u.split('|');
			let Arr = []
			if (arr1.includes('员工操作权')) {
				let u1 = '员工操作权'
				Arr.push(u1);
			}
			let d = power.replace('departhandle', '部门操作权')
			let arr2 = d.split('|');
			if (arr2.includes('部门操作权')) {
				let d1 = '部门操作权'
				Arr.push(d1);
			}
			let j = power.replace('jobhandle', '职务操作权')
			let arr3 = j.split('|');
			if (arr3.includes('职务操作权')) {
				let d1 = '职务操作权'
				Arr.push(d1);
			}
			let ca = power.replace('customermy', '部门全部客户')
			let arr4 = ca.split('|');
			if (arr4.includes('部门全部客户')) {
				let d1 = '部门全部客户'
				Arr.push(d1);
			}
			let cm = power.replace('customerall', '公司全部客户')
			let arr5 = cm.split('|');
			if (arr5.includes('公司全部客户')) {
				let d1 = '公司全部客户'
				Arr.push(d1);
			}
			str += `
			<tr>
			<td class="w8">${id}</td>
			<td class="w10">${name}</td>
			<td class="w20">${desc}</td>
			<td class="w50">${Arr.join('|')}</td>
			<td class="w12" jobId='${id}'>
				<a href="javascript:;">编辑</a>
				<a href="javascript:;">删除</a>
			</td>
		</tr>
			`
		});
		$('tbody').html(str)

	}
	//实现编辑 删除
	$('tbody').on('click', 'a', function (e) {
		let target = e.target,
			tag = target.tagName,
			text = target.innerHTML;
		// console.log(target, tag, text);
		if (tag == "A") {
			if (text == "编辑") {
				let id = $(this).parent().attr('jobId')
				window.location.href = 'jobadd.html?id=' + id;
				return;
			}
			if (text === "删除") {
				let flag = confirm('你确定要删除?')
				if (!flag) return;
				let jobId = $(this).parent().attr('jobId')
				let result = axios.get('/job/delete', { params: { jobId } })
				alert('删除用户成功~')
				$(this).parent().parent().remove()

				// console.log('删除');
			}
		}
	})
})