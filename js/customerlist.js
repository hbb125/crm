$(function () {
	let lx = 'my';
	let limit = 10;
	let page = 1;
	let totalPage = 1;
	let total = 0;
	let params = window.location.href.queryURLParams();
	params.lx ? lx = params.lx : null;
	// console.log(lx);
	//获取客户列表
	showCustomerList()
	async function showCustomerList() {
		let result = await axios.get('/customer/list', {
			params: {
				lx,
				type: $('.selectBox').val(),
				search: $('.searchInp').val().trim(),
				limit,
				page,
			}
		})
		// console.log(result);
		if (result.code !== 0) return alert('网络不给力,请稍后再试~')
		totalPage = parseInt(result.totalPage);
		total = parseInt(result.total)
		// console.log(result);

		result = result.data;
		let str = ``;

		result.forEach(item => {
			let {
				id,
				name,
				sex,
				email,
				phone,
				QQ,
				weixin,
				type,
				address,
				userName
			} = item;
			str += `
			 <tr>
			 <td class="w8">${name}</td>
			 <td class="w5">${sex == 0 ? '男' : '女'}</td>
			 <td class="w10">${email}</td>
			 <td class="w10">${phone}</td>
			 <td class="w10">${weixin}</td>
			 <td class="w10">${QQ}</td>
			 <td class="w5">${type}</td>
			 <td class="w8">${userName}</td>
			 <td class="w20">${address}</td>
			 <td class="w14" customerId='${id}'>
						<a href="javascript:;" >编辑</a>
						<a href="javascript:;" >删除</a>
						<a href="visit.html">回访记录</a>
			 </td>
			 </tr>
			`

		});
		$('tbody').html(str);
		if (totalPage > 1) {
			str = ``;
			page > 1 ? str += `<a href="javascript:;">上一页</a>` : null;
			str += `<ul class="pageNum">`;
			for (let i = 1; i <= totalPage; i++) {
				str += `<li class="${i == page ? 'active' : ''}">${i}</li>`;
			}
			str += `</ul>`;
			page < totalPage ? str += `<a href="javascript:;">下一页</a>` : null;
			$(".pageBox").html(str);
		}
	}
	//其他功能
	handle();
	function handle() {
		$('.selectBox').change(showCustomerList);
		$('.searchInp').keydown(function (e) {
			if (e.keyCode == 13) {
				showCustomerList();
				$('.searchInp').val('')
			}
		})
	}
	//实现分页
	$('.pageBox').click(e => {
		let target = e.target,
			tag = target.tagName,
			text = target.innerHTML,
			temp = page;
		if (tag == "A") {
			//点击上一页和下一页
			if (text === '上一页') { temp--; }
			if (text === '下一页') { temp++; }
		}
		if (tag === 'LI') {
			// 点击了中间的数字
			temp = parseInt(text)
		}
		temp !== page ? (page = temp, showCustomerList()) : null;
	})

	//实现 编辑 删除 回访
	$('tbody').on('click', 'a',async function (e) {
		let target = e.target,
			tag = target.tagName,
			text = target.innerHTML.trim();
		// console.log(target, tag, text);
		if (tag === 'A') {
			if (text == '编辑') {
				let id = $(this).parent().attr('customerId');
				// console.log(id);
				window.location.href = 'customeradd.html?id=' + id;
				return;
			}
			if (text == '删除') {
				let flag = confirm('你确定要删除')
				if (!flag) return;
				let customerId = $(target).parent().attr('customerId');
				console.log(customerId);
				let result = await axios.get('/customer/delete', { params: { customerId } })
				if (result.code == 0) {
					alert('删除成功')
					$(target).parent().parent().remove()
					return;
				}
			}
			if (text == '回访记录') {
				console.log('回访');
			}
		}
	})
})