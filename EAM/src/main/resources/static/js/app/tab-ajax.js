// 新增外层标签
// function addTab(el) {
// 	// 获取客户内码
// 	var key = $(el).attr('data-id');
// 	// 限制打开5个客户
// 	var tabItemsLength = $('#out-tabs-items>li').length;
// 	if(tabItemsLength >= 6){
// 		alert('最多打开5个客户视图，请关闭个别已打开的客户视图后重试');
// 	}
// 	else {
// 		if($('a[href="#no'+key+'"]').get().length === 0){ // 假如标签不存在
// 			// 这里写 ajax 请求数据
// 			var initData;	// ajax 返回的数据
// 			var tpl,tempTab;
// 			if (key.substr(0,2) == "81"){  //对私部分代码
// 				$.ajax({
// 					type:"GET",
// 					url:contextPath+"/custview/private/overview.json",
// 					async:false,
// 					data:{"custIsn": key},
// 					datatype:"json",
// 					success:function (data) {
// 						initData = data;
// 						initData.uniqueCode = key;
// 					}
// 				})
// 				// 字符串拼接的 tab 标签模板
// 				tempTab = '<li role="presentation"><a href="#no'+key+'" role="tab" data-toggle="tab">\
// 					<span class="tab-name" title="'+initData.custInfoTinyVo.custName+'">'+initData.custInfoTinyVo.custName+'</span>\
// 					<span onclick="removeTab(this)">x</span>\
// 				</a></li>';
// 				tpl = jQuery('#client-view-temp').html();
// 			}
// 			else {
// 				// 调用juicer模板引擎渲染方法 （需要判断是对公客户还是对私客户，调用不同的模板）
// 			}
//
// 			// 字符串拼接的 tab 内容容器模板
// 			var tempContent = '<div role="tabpanel" class="uniqueCode tab-pane" id="no'+key+'">'+key+'</div>';
//
// 			// 添加tab标签
// 			$(tempTab).appendTo($('#out-tabs-items'));
// 			// 添加tab内容容器
// 			$(tempContent).appendTo($('#tab-content'));
//
// 			var html = juicer(tpl,initData);
// 			$('#no'+key).html(html);
// 			// 调整内层tabs样式
// 			changeInsideTabWidth('no'+key);
// 			// 模拟点击标签(激活当前打开)
// 			$('a[href=#no'+key+']').click();
// 		}
// 		else {// 假如标签已存在
// 		    // 模拟点击标签(激活当前打开)
// 			$('a[href=#no'+key+']').click();
// 		}
// 	}
// }

// 增加外层标签（请求页面方法）
function addTab(el) {
	// 获取客户内码
	var key = $(el).attr('data-id');
	// 获取客户姓名
	var name = $(el).attr('cust-name');
	var id = $(el).attr('cust-id');
	// 限制打开5个客户
	var tabItemsLength = $('#out-tabs-items>li').length;
	if(tabItemsLength >= 6){
		alert('最多打开5个客户视图，请关闭个别已打开的客户视图后重试');
	}
	else {
		// 可以添加标签并判断是否需要新增标签
		if($('a[href="#no'+key+'"]').get().length === 0){ // 假如标签不存在
			var dataTemp;
			if (key.substr(0,2) == "81"){  //对私部分代码
				$.ajax({
					type:"GET",
					url:contextPath+"/custview/private/overview",
					async:false,
					data:{"custIsn": key},
					datatype:"json",
					success:function (data) {
						dataTemp = data;
					}
				})
			}
			else {
				$.ajax({
					type:"GET",
					url:contextPath+"/custview/public/info",
					async:false,
					data:{"custIsn": key,"custId": id,"custName": name,},
					success:function (data) {
						dataTemp = data;
					}
				})
			}
			// 字符串拼接的 tab 标签模板
			var tempTab = '<li role="presentation"><a href="#no'+key+'" role="tab" data-toggle="tab">\
					<span class="tab-name" title="'+name+'">'+name+'</span>\
					<span onclick="removeTab(this)">x</span>\
				</a></li>';
			// 字符串拼接的 tab 内容容器模板
			var tempContent = '<div role="tabpanel" class="uniqueCode tab-pane" id="no'+key+'">'+key+'</div>';

			// 添加tab标签
			$(tempTab).appendTo($('#out-tabs-items'));
			// 添加tab内容容器
			$(tempContent).appendTo($('#tab-content'));

			// 将返回的页面渲染进容器
			// console.log(dataTemp)
			$('#no'+key).html(dataTemp);
			// 调整内层tabs样式
			changeInsideTabWidth('no'+key);
			// 模拟点击标签(激活当前打开)
			$('a[href=#no'+key+']').click();
		}
		else {		// 假如标签已存在
			$('a[href=#no'+key+']').click(); 			// 模拟点击标签(激活当前打开)
		}
	}

}

//关闭外层标签
function removeTab(el) {
	var tabEl = $(el).parent().parent();
	var origKey = $(el).parent().attr('href');
	var key = origKey.slice(1,origKey.length); // no111111111
	
	// 删除tab标签
	tabEl.remove();
	// 删除tab内容容器
	$('div#'+key).remove();
	// 关闭标签后激活搜索页面
	$('#out-tabs-items>li>a')[0].click();
}

//新增内层标签
$("#tab-content").on('click', '.nine-container>div', addChildTab)
function addChildTab() {
	// 当前外层tab容器的id
	var uniqueCode = $(this).parents('.uniqueCode').attr('id');
	console.log(uniqueCode);
	var custIsn = uniqueCode.slice(2);	// 客户内码
	console.log(custIsn);
	// 获取九宫格唯一标识
	var key = $(this).attr('data-id');
	if($('a[href="#no'+key+uniqueCode+'"]').get().length === 0){ // 假如标签不存在
		var initData = $(this).find('p').text(); 	// ajax 返回的数据
		var tempTab = '<li role="presentation"><a href="#no'+key+uniqueCode+'" role="tab" data-toggle="tab"><span class="tabs-flag" title="'+$(this).find('p').text()+'">'+$(this).find('p').text()+'</span><span class="close-icon" onclick="removeChildTab(this)">x</span></a></li>';
		var tempContent = '<div role="tabpanel" class="tab-pane" id="no'+key+uniqueCode+'"></div>';
		// 增加内层tab标签
		$(tempTab).appendTo($('#'+uniqueCode).find('#inside-tabs-container'));
		changeInsideTabWidth(uniqueCode);
		// 增加内层tab内容容器
		$(tempContent).appendTo($('#'+uniqueCode).find('#inside-tab-content'));

		// 根据参数请求模板
		if(key == "no1-khjbxx"){ // 对私客户基本信息
			$.ajax({
				type:"GET",
				url:contextPath+"/custview/private/custbasinfo",
				async:false,
				data:{"custIsn": custIsn,},
				datatype:"json",
				success:function (data) {
					initData = data;
				}
			});
		}else if (key == "no2-khgljdbxx"){ // 对私客户关联及担保信息
			$.ajax({
				type:"GET",
				url:contextPath+"/cust/relation/info",
				async:false,
				data:{"custIsn": custIsn,},
				datatype:"json",
				success:function (data) {
					initData = data;
				}
			});
		}else if (key == "no3-khpjjjzxx"){ // 对私客户评价及价值信息
			$.ajax({
				type:"GET",
				url:contextPath+"/custvalueinfo/query/clientestimate",
				async:false,
				data:{"custIsn": custIsn,},
				datatype:"json",
				success:function (data) {
					initData = data;
				}
			});
		}else if (key == "no4-cycpxx"){ // 对私持有产品信息
			$.ajax({
				type:"GET",
				url:contextPath+"/cust/product/info",
				async:false,
				data:{"custIsn": custIsn,},
				datatype:"json",
				success:function (data) {
					initData = data;
				}
			});
		}else if (key == "no5-yxhdxx"){ // 对私营销活动信息

		}else if (key == "no6-ffjsjxx"){ // 对私服务及事件信息
			$.ajax({
				type:"GET",
				url:contextPath+"/serveventinfo/pri/query",
				async:false,
				data:{"custIsn": custIsn,},
				datatype:"json",
				success:function (data) {
					initData = data;
				}
			});
		}else if (key == "no7-khxyjfxpjxx"){ // 对私客户信用及风险评价信息
			$.ajax({
				type:"GET",
				url:contextPath+"/custcreditinfo/pri/creditrisk",
				async:false,
				data:{"custIsn": custIsn,},
				datatype:"json",
				success:function (data) {
					initData = data;
				}
			});
		}else if (key == "no1-khjcxx-com"){ // 对公客户基础信息
			$.ajax({
				type:"GET",
				url:contextPath+"/custview/public/basicinfo",
				async:false,
				data:{"custIsn": custIsn},
				success:function (data) {
					initData = data;
				}
			});

		}else if (key == "no2-khcwxx-com"){ // 对公客户财务信息

		}else if (key == "no3-khgljdbxx-com"){ // 对公客户关联及担保信息
			$.ajax({
				type:"GET",
				url:contextPath+"/cust/public/relainfo",
				async:false,
				data:{"custIsn": custIsn},
				success:function (data) {
					initData = data;
				}
			});

		}else if (key == "no4-khpjjjzxx-com"){ // 对公客户评价及价值信息
			$.ajax({
				type:"GET",
				url:contextPath+"/custgradeinfoandvalueinfo/custgradeinfo",
				async:false,
				data:{"custIsn": custIsn},
				success:function (data) {
					initData = data;
				}
			});

		}else if (key == "no5-cycpxx-com"){ // 对公持有产品信息
			$.ajax({
				type:"GET",
				url:contextPath+"/holdproductinf/product/info",
				async:false,
				data:{"custIsn": custIsn},
				success:function (data) {
					initData = data;
				}
			});

		}else if (key == "no6-yxhdxx-com"){ // 对公营销活动信息

		}else if (key == "no7-ffjsjxx-com"){ // 对公服务及事件信息
			$.ajax({
				type:"GET",
				url:contextPath+"/serveventinfo/pri/query",
				async:false,
				data:{"custIsn": custIsn},
				success:function (data) {
					initData = data;
				}
			});

		}else if (key == "no8-khxyjfxpjxx-com"){ // 对公客户信用及风险评价信息
			$.ajax({
				type:"GET",
				url:contextPath+"/custcreditinfo/pub/creditrisk",
				async:false,
				data:{"custIsn": custIsn},
				success:function (data) {
					initData = data;
				}
			});

		}else if (key == "no9-khywxx-com"){ // 对公客户业务信息

		}

		// console.log(initData)
		$('#no'+key+uniqueCode).html(initData);
		// 激活当前标签
		$('a[href=#no'+key+uniqueCode+']').click();
	}else {
		// 激活当前标签
		$('a[href=#no'+key+uniqueCode+']').click();
	}
}


//关闭内层标签
function removeChildTab(el) {
	var uniqueCode = $(el).parents('.uniqueCode').attr('id');

	var tabEl = $(el).parent().parent();
	var origKey = $(el).parent().attr('href');

	var key = origKey.slice(1,origKey.length); // no客户基本信息
	
	// 删除tab标签
	tabEl.remove();
	// 删除tab内容容器
	$('div#'+key).remove();
	// 关闭标签后激活搜索页面
	$('#'+uniqueCode).find('#inside-tabs-container>li>a')[1].click();
	
	changeInsideTabWidth(uniqueCode)
}

// 内层tab标签宽度调整(兼容IE8)
function changeInsideTabWidth(uniqueCode) {
	var containerWidth = $('body').width() - 20;
	var targetEl = $('#'+uniqueCode).find('.tabs-flag');

	var width = containerWidth / targetEl.length - 30 - 11;

	targetEl.each(function () {
		$(this).css('width',width + 'px')
	})

}
$(window).on('resize', function () {
	$('.uniqueCode').each(function () {
		var uniCode = $(this).attr('id');
		changeInsideTabWidth(uniCode);
	})
});

// 客户视图内手风琴切换图标方法
$('#tab-content').on('hidden.bs.collapse',".panel-collapse.collapse" , function () {
	$(this).prev().find('img').prop('src', '/crm/images/switch01.png');
})
$('#tab-content').on('show.bs.collapse',".panel-collapse.collapse" , function () {
	$(this).prev().find('img').prop('src', '/crm/images/switch02.png');
})

