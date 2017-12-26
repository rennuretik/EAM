$(function () {

	var dropSwitch = false;
	$('#nav-drop-btn').on('click', function () {
		if(dropSwitch){	// 收缩
			$('.first-level-menu').slideUp('fast', function () {
				$('#navdrop-menu').hide();
				dropSwitch = false;
			});
		}else { // 展开
			$('#navdrop-menu').show();
			$('.first-level-menu').slideDown('fast', function () {
				dropSwitch = true;
			})
		}
	});


    //
	//$('.navdrop-mask').on('click', function () {
	//	$('.first-level-menu').slideUp('fast', function () {
	//		$('#navdrop-menu').hide();
	//		dropSwitch = false;
	//	});
	//})
    //
	//$(window).on('scroll', function () {
	//	$('.first-level-menu').slideUp('fast', function () {
	//		$('#navdrop-menu').hide();
	//		dropSwitch = false;
	//	});
	//})
    //
	//menuStart();
	///*请求菜单数据*/
	//function menuStart() {
	//	var menus;
	//	$.ajax({
	//		url: contextPath+"/menu/getchilds.json",
	//		dataType: "json",
	//		async: false,
	//		data: {"menuCode": "crm.menu"},
	//		type: "POST",
	//		success: function (data) {
	//			if (data.success) {
	//				menushtml(data);
	//			} else {
	//				alert("后台错误无法加载菜单项！");
	//			}
	//		},
	//		error: function (xhr,textStatue,errorThrown) {
	//			alert("网络问题无法加载菜单项！");
	//		}
	//	});
    //
	//};

	///*生成并填充菜单html片段*/
	//function menushtml(menus){
	//	var tpl = [
	//		"{@each result as it}",
	//		"{@if it.isEnable }",
	//		"<li class='list-group-item'>",
	//		"{@if !it.isParent}",
	//		"<a href='","{@if !it.menuAction}","#","{@else}",contextPath,"\${it.menuAction}","{@/if}","'>\${it.menuName}</a>",
	//		"{@else}",
	//		"\${it.menuName}",
	//		"{@/if}",
	//		"<div class=\"second-level-menu\">",
	//			"<ul class='list-group menu-second'>",
	//			"{@each it.childMenuVos as item}",
	//				"{@if item.isEnable}",
	//				"<li class='list-group-item'>",
	//					"<a href='","{@if !item.menuAction}","#","{@else}",contextPath,"\${item.menuAction}","{@/if}","'>\${item.menuName}</a>",
	//				"</li>",
	//				"{@/if}",
	//			"{@/each}",
	//			"</ul>",
	//		"</div>",
	//		"</li>",
	//		"{@/if}",
	//		"{@/each}"].join("");
	//	var menushtml = juicer(tpl, menus);
	//	$("#navdrop-menu").children(".first-level-menu").children(".list-group").html(menushtml);
	//};

});



