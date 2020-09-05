$(function () {
	let checkList = null;
	//实现显示部门
	ininDepartMent()
	async function ininDepartMent() {
		let result = await queryDepart()
		//   console.log(result);
		if (result.code == 0) {
			let str = ``;
			result.data.forEach(item => {
				str += `<option value="${item.id}">${item.name}</option>`;
			});
			$('.selectBox').append(str);
		}
	}
	//展示员工列表
	showUserList();
	async function showUserList() {
		let params = {
			departmentId: $('.selectBox').val(),
			search: $('.searchInp').val().trim()
		}
		// console.log(params);
		let result = await axios.get('/user/list', { params })
		// console.log(result);
		if (result.code !== 0) return alert('获取用户列表失败')
		let str = ``;
		result.data.forEach(item => {
			let {
				id,
				name,
				sex,
				email,
				phone,
				department,
				job,
				desc
			} = item;
			str += `
			 <tr>
			 <td class="w3"><input type="checkbox" userId='${id}'></td>
			 <td class="w10">${name}</td>
			 <td class="w5">${sex == 0 ? '男' : '女'}</td>
			 <td class="w10">${email}</td>
			 <td class="w10">${phone}</td>
			 <td class="w15">${department}</td>
			 <td class="w15">${job}</td>
			 <td class="w20">${desc}</td>
			 <td class="w12" userId='${id}'>
				 <a href="javascript:;" >编辑</a>
				 <a href="javascript:;" >删除</a>
				 <a href="javascript:;">重置密码</a>
			 </td>
		 </tr>
			 `
		})
		$('tbody').html(str)
		checkList = $('tbody').find('input[type="checkbox"]');
	}
	//条件查询
	queryUserList()
	function queryUserList() {
		$('.selectBox').change(showUserList)
		$('.searchInp').keydown(function (e) {
			if (e.keyCode == 13) {
				showUserList();
				$('.searchInp').val('')
			}
		})
	}
	//实现编辑 删除 重置密码
	$('tbody').on('click', 'a', async function (e) {
		let target = e.target,
		tag = target.tagName;
		text = target.innerHTML.trim();
		// console.log(target);
		//实现编辑
		if (tag == "A") {
			if (text == '编辑') {
				let id = $(this).parent().attr('userId');
				window.location.href = 'useradd.html?id=' + id;
				return;
			}
			//实现删除
			if (text == '删除') {
				let flag = confirm('确定要删除?')
				if (!flag) return;
				let userId = $(this).parent().attr('userId')
				// console.log(userId);
				let result = await axios.get('/user/delete', { params: { userId } })
				if (result.code == 0) {
					alert('删除用户信息成功')
					$(target).parent().parent().remove();
					checkList = $('tbody').find('input[type="checkbox"]')
					return;
				}
				return;

			}
			// 实现重置密码
			if (text == '重置密码') {
				let userId = $(this).parent().attr('userId')
				let flag = confirm('你确定要重置此用户的密码?')
				if (!flag) return;
				let result = await axios.post('/user/resetpassword', { userId })
				if (result.code == 0) {
					alert('重置密码成功，赶快告诉你的员工吧!')
					return;
				}
				return;
			}
		}
	})
	//全选处理
	selectHandle()
	function selectHandle() {
		$('#checkAll').click(function () {
			let checked = $('#checkAll').prop('checked')
			checkList.prop('checked', checked)
		})
		$('tbody').on('click', 'input', e => {
			let flag = true;
			//将checkList为数组转换成数组
			newCheckList = Array.from(checkList)
			newCheckList.forEach(item => {
				if (!$(item).prop('checked')) {
					//有小框框没有勾选
					flag = false;
				}
			})
			$("#checkAll").prop('checked', flag)
		})
	}
	//实现批量删除
	$('.deleteAll').click(e => {
		let arr = [];
		[].forEach.call(checkList, item => {
			if ($(item).prop('checked')) {
				// console.log($(item));
				arr.push($(item).attr('userid'))
			}
		})
		// console.log(arr);
		if (arr.length === 0) {
			alert('你需要先选中一些数据~')
			return;
		}
		let flag = confirm('你确定要删除这些用户?')
		if (!flag) return;
		//递归删除
		let index = -1;
		async function deleteUserList() {
			let userId = arr[++index]
			if (index >= arr.length) {
				alert('已成功删除员工~')
				showUserList();
				return;
			}
			let result = await axios.get('/user/delete', { params: { userId } })
			if (result.code != 0) {
				return;
			}
			deleteUserList()
		}
		deleteUserList()
	})
})