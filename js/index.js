$(function () {
	//用来实现发布订阅
	let $plan = $.Callbacks();
	let $navBoxList = $('.navBox>a');
	let $itemBoxList = null;
	
	$plan.add((power) => {
		// console.log(power);
		// userhandle|departhandle|jobhandle|customerall
		let str = ``;
		if (power.includes('userhandle')) {
			str += `
		   <div class="itemBox" text='员工管理'>
			  <h3>
				  <i class="iconfont icon-yuangong"></i>
				  员工管理
		      </h3>
			  <nav class="item">
				  <a href="page/userlist.html" target="iframeBox">员工列表</a>
				  <a href="page/useradd.html" target="iframeBox">新增员工</a>
			  </nav>
		   </div>
		`
		}
		if (power.includes('departhandle')) {
			str += `
		   <div class="itemBox" text='部门管理'>
			  <h3>
				  <i class="iconfont icon-yuangong"></i>
				  部门管理
		      </h3>
			  <nav class="item">
				  <a href="page/departmentlist.html" target="iframeBox">部门列表</a>
				  <a href="page/departmentadd.html" target="iframeBox">新增部门</a>
			  </nav>
		   </div>
		`
		}
		if (power.includes('jobhandle')) {
			str += `
		   <div class="itemBox" text='职务管理'>
			  <h3>
				  <i class="iconfont icon-zhiwuguanli"></i>
				  职务管理
		      </h3>
			  <nav class="item">
				  <a href="page/joblist.html" target="iframeBox">职务列表</a>
				  <a href="page/jobadd.html" target="iframeBox">新增职务</a>
			  </nav>
		   </div>
		`
		}
		if (power.includes('customerall')) {
			str += `
		   <div class="itemBox" text='客户管理'>
			  <h3>
				  <i class="iconfont icon-kehuguanli"></i>
				  客户管理
		      </h3>
			  <nav class="item">
				  <a href="page/customerlist.html" target="iframeBox">客户列表</a>
				  <a href="page/customerlist.html" target="iframeBox">全部客户</a>
				  <a href="page/customeradd.html" target="iframeBox">新增客户</a>
			  </nav>
		   </div>
		`
		}
		$('.menuBox').html(str)
		$itemBoxList = $('.menuBox').find('.itemBox');
	});
	//控制组织结构和客户管理点击切换
	function handGroup(index) {
		//分两组 $group1 $group2
		// console.log($itemBoxList);
		let $group1 = $itemBoxList.filter((_, item) => {
			// console.log(item);
			let text = $(item).attr('text')
			// console.log(text);
			return text === '客户管理';
		});
		let $group2 = $itemBoxList.filter((_,item) => {
			let text = $(item).attr('text')
            return /^(员工管理|部门管理|职务管理)/.test(text);
		})
		//控制哪一组显示
        if (index == 0) {
			$group1.css('display','block')
			$group2.css('display','none')
		} else if (index == 1) {
			$group1.css('display','none')
			$group2.css('display','block')

		}		
	}
	//实现tab选项卡
	$plan.add(power => {
		let initIndex = power.includes('customer') ? 0 : 1;
		$navBoxList.eq(initIndex).addClass('active').siblings().removeClass('active');
		handGroup(initIndex)
		$navBoxList.click(function () {
			let index = $(this).index();
            let text = $(this).html().trim();
			if (text === '客户管理' && !/customerall/.test(power) || (text === '组织结构') && !/userhandle|departhandle|jobhandle/.test(power)) {
				alert('你没有权限访问~~')
				return;
			}
			if(index == initIndex) return;
			$(this).addClass('active').siblings().removeClass('active');
			handGroup(index)
			initIndex = index;
		})
	})
	//控制默认的iframe的src
	$plan.add(power => {
		let url = 'page/customerlist.html';
		if (power.includes('customerall')) {
			$('.iframeBox').attr('src',url);
		}
	})
	//实现用户信息
	$plan.add((_, baseInfo) => {
		//   console.log(baseInfo);
		$('.baseBox>span').html(`你好, ${baseInfo.name || ''}`);
	})
	//渲染用户信息和实现登录
	init()
	async function init() {
		//判断用户是否登录
		let result = await axios.get('/user/login')
		// console.log(result);
		if (result.code != 0) {
			alert('你还没有登陆，请先登陆...')
			window.location.href = 'login.html';
			return;
		}
		//登陆成功后
		let [power, baseInfo] = await axios.all([
			axios.get('/user/power'),
			axios.get('/user/info')
		])
		power.code === 0 ? power = power.power : null;
		baseInfo.code === 0 ? baseInfo = baseInfo.data : null;
		// console.log(power);//userhandle|departhandle|jobhandle|customerall
		//发布订阅
		$plan.fire(power, baseInfo)

	}
	//实现退出
	$('.baseBox>a').click(async function () {
		let result = await axios.get('/user/signout')
		if (result.code == 0) {
			if (confirm('您确定要退出?')) {
				window.location.href = 'login.html';
				return;
			}
			return;
		}
		alert('网路不给力,请稍后重试...')
	})
})