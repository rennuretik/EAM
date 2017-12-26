/*
 * Zjrcu.com Inc.
 * Copyright (c) 2016-2016 All Rights Reserved.
 */
var centerTab;
define ( function ( require ) {
	require ( "jquery" );
	require ( "back" );
	require ( "juicer" );
	require ( "widgets/fapui-gridlayout" );
	require ( "widgets/fapui-iframepanel" );
	require ( "widgets/fapui-borderlayout" );
	require ( "widgets/fapui-fitlayout" );
	require ( "widgets/fapui-combobox" );
	require ( "widgets/fapui-form" );
	require ( "widgets/fapui-tabs" );
	require ( "widgets/fapui-menu" );
	require ( "widgets/fapui-window" );
	require ( "widgets/fapui-mask" );
	require ( "widgets/fapui-viewport" );
	require ( "widgets/fapui-navgationmenu" );
	require ( "widgets/fapui-messager");
	require ( "widgets/fapui-panel");
	var isFirstLogin=false;
	$ ( function () {
		require.async ( FAPUI.CONTEXT_PATH + "/styles/main/main.css" );
		require.async ( FAPUI.CONTEXT_PATH + "/styles/common/icon.css" );
		var name = userName?userName:code;
		//头部部分
		var northHtml = ["<div class=\"header\">","<div class=\"menuicon head_icon\"></div>", "<div class=\"logo\">",
			"<img src=\"", FAPUI.CONTEXT_PATH,
			"/images/login/logo.png\" />",
			"</div>",
			"<div class=\"fast\">",
			"<div class=\"hsize first_page\"><span class=\"head_icon home home_check\"></span></div>",
			"<div class=\"hsize\"><span class=\"head_icon freshicon\"></span></div>",
			"<div class=\"hsize noborder list_search\"><span class=\"head_icon searchicon\"></span></div>",
			"<div class=\"search_box hide\">&nbsp;&nbsp;条件:<input type='text' placeholder='请输入查询条件'/><div class=\"button_bar\"><button class=\"ok\">确定</button><button class=\"cancel\">取消</button></div></div>",
			"</div>",
			"<div class=\"user\">",
			"<div class=\"hbsize \"><div class=\"info \"><i class=\"head_icon personicon \"></i><span class=\"husername username1\">"+name+"</span><i class=\"head_icon downicon\"></i></div><div class=\"menua\"><div class=\"up\"></div><ul>",
							"<li> <a href=\"javascript:loginUserInfo();\">详细信息</a></li>",
							"<li> <a href=\"javascript:modifyInfo();\">修改密码</a></li>",
							"</ul></div></div>",
			"<div class=\"hbsize\" id=\"backstage\"><i class=\"head_icon seticon\"></i><span class=\"husername\">后台管理</span></div>",
			"<div onclick=\"logout()\" class=\"hbsize noborder\"><i class=\"head_icon logouticon\"></i><span  class=\"husername\">退出系统</span></div>",
			"</div>",
			"</div>" ];

		//东南西北四个方位
		var north = new FAPUI.Panel ( {
			height:54,
			split: false,
			border : false,
			html : northHtml.join ( "" )
		} );
		//首页功能
		var middleCenterIframe = new FAPUI.IframePanel ( {
			itemId : 'centerIframe',
			name : 'centerIframe',
			title:"首页",
			url : FAPUI.CONTEXT_PATH + "/mcs-index"
		} );
        //tab页
		 centerTab = new FAPUI.Layout.TabLayout ( {
			border : false,
			fit : true,
			tabCls : "R",
			items : [middleCenterIframe]
		} );


		//布局
		var border = new FAPUI.Layout.BorderLayout ( {
			northregion : north,
			centerregion : centerTab
		} );

		var viewport = new FAPUI.View.ViewPort ( {
			renderTo : document.body,
			layout : border
		} );
		$(".info" ).on("click",function(){
			$(this).siblings(".menua").show();
		});
		$(".menua" ).on("mouseleave",function(){
			$(this ).hide();
		});
        //弹出搜索框定位
		var pleft=$(window ).width()-500;
		$(".search_box" ).css("left",pleft/2+"px")
		//后台管理
		$("#backstage" ).click(function(){
			window.location.href = FAPUI.CONTEXT_PATH + "/engine/backstage";
		});
		//首页加载
		$(".first_page" ).click(function(){
			$(".home" ).addClass("home_check");
			if ( centerTab.exists ( 'centerIframe' ) ) {
				centerTab.selectTab ( 'centerIframe' );
			}
		});
		//报表导航
		$(".menuicon" ).click(function(){
			focusOnReportNav();
		});
		//报表搜索
		function rmcheck(fn){
			$(".search_box" ).hide();
			$(".list_search" ).children(".searchicon" ).removeClass("searchicon_check")
		}
		$(".list_search" ).click(function(){
			$(this ).children(".searchicon" ).addClass("searchicon_check");
			$(".search_box" ).show()
		});
		$(".search_box .cancel" ).click(function(){
			rmcheck();
		})
		$(".search_box .ok" ).click(search);
		//报表搜索方法
	    function search(){
			$.post(FAPUI.CONTEXT_PATH +"/report/searchreport",{reportName:$(".search_box input" ).val()},function(data){
				rmcheck();
				var searchTpl=[ "<ul class=\'search_result \'>",
					"{@each result as it}",
					"<li  onclick=\"appendTab(this.id,$(this).attr('url'),this.title)\" id=\"${it.reportId}\" url=\"/report/queryreport?reportId=\${it.reportId}&type=mcs\" title=\"${it.reportName}\" class=\'search_detail \'>",
					"<img src=\'${it.iconUrl}\'/>",
					"<div class=\'result_size\'>${it.reportName}</div>",
					"</li>",
					"{@/each}",
					"</ul>" ].join("");
				var searchHtml=juicer(searchTpl,data);
				if(data.result.length==0){
					Messager.alert ( "信息", "搜索结果为空", "warning", function () {

					} );
					return
				}
				if ( centerTab.exists ( 'searchPanel') ) {
					$("#search_r" ).html(searchHtml);
					centerTab.selectTab ('searchPanel' );
				} else  {
					var searchPanel = new FAPUI.Panel ( {
						itemId : 'searchPanel',
						name : 'searchPanel',
						title:"搜索结果",
						closeable : true,
						html:"<div id = 'search_r'>"+searchHtml+"</div>"
					} );
					if ( ! searchPanel ) {
						return;
					}
					centerTab.addTab ( searchPanel );
				}

				$(".first_page" ).children(".home" ).removeClass("home_check");
			})


	}

		//报表导航菜单栏
		var focusOnReportNav = function(){
			$(".menuicon").addClass("menuicon_check");
			appendTab("listIframe","/list-nav","报表导航")
		}
		var page = getUrlParam("page");
		if(page == "ht"){
			focusOnReportNav();
		}
		if(page == "lt"){
			focusOnReportNav();
			$(".search_box" ).show()
		}

	} );
	/** 用户信息Form*/
	var userInfoForm = new FAPUI.form.FormPanel ({
		border : false,
		columns : 2,
		defaultSet : {
			labelWidth : 80,
			labelSplit : ":&nbsp;&nbsp;"
		},
		items : [ new FAPUI.form.TextField ({
			inputType : "hidden",
			itemId : "userId",
			name : "userId"
		})  , new FAPUI.form.TextField({
			inputType : "text",
			itemId : "code",
			name : "code",
			width : 120,
			fieldLabel : "柜员号",
			disabled : true
		}) , new FAPUI.form.TextField({
			inputType : "text",
			itemId : "name",
			name : "name",
			width : 120,
			fieldLabel : "姓名",
			disabled : true
		}), new FAPUI.form.TextField({
			inputType : "text",
			itemId : "telephone",
			name : "telephone",
			width : 120,
			fieldLabel : "电话",
			disabled : true
		}), new FAPUI.form.TextField({
			inputType : "text",
			itemId : "mobile",
			name : "mobile",
			width : 120,
			fieldLabel : "手机",
			disabled : true
		}), new FAPUI.form.TextField({
			inputType : "text",
			itemId : "sex",
			name : "sex",
			width : 120,
			fieldLabel : "性别",
			disabled : true
		}), new FAPUI.form.TextField({
			inputType : "text",
			itemId : "email",
			name : "email",
			width : 120,
			fieldLabel : "E-mail",
			disabled : true
		})]
	});
	/** 用户信息window */
	var userInfoWindow = new FAPUI.Window ({
		title : "我的信息",
		titleIconCls : 'icon-save',
		width : 500,
		height : 170,
		border : true,
		closeable : true,
		closed : true,
		modal : true,
		layout : new FAPUI.Layout.FitLayout ({
			item : userInfoForm
		}),
		bbar : {
			align : "center",
			items : [
				{ type : 'normalButton', text : '确定', handler : function (btn, event) {
					userInfoForm.reset();
					userInfoWindow.close();
				} }
			]
		}
	});

	/** 修改用户密码 */
	var modifyPasswordForm = new FAPUI.form.FormPanel({
		columns : 1,
		border : false,
		actionUrl : FAPUI.CONTEXT_PATH + "/user/modify/passwd.json",
		defaultSet : {
			labelWidth : 80,
			labelSplit : ":&nbsp;&nbsp;"
		},
		onSuccess:function(ret){

			Messager.show({
				title:"提示信息", msg:"修改密码成功", timeout:2000, showTyoe:"show"
			});
			modifyPasswordForm.reset();
			modifyPasswordWindow.close();
		},
		onFailure:function(ret){
			Messager.alert("提示信息", undefined === ret.resultModifyPassword.messages ? "系统错误，修改密码失败!" : ret.messages,
						   "error", function(){}, 330, 120);
		},
		items : [
			new FAPUI.form.TextField({
				inputType : "password",
				itemId : "oldPassword",
				name : "oldPassword",
				anchor:95,
				fieldLabel : "原密码",
				allowBlank : false,
				errorMsg : "请输入原密码",
				listeners : {
					blur : function (comp, event) {
						$.ajax({
							url: FAPUI.CONTEXT_PATH + "/user/validate/password.json",
							data : {
								passwd : comp.getValue()
							},
							dataType : "json",
							type : "post",
							success : function(result){
								if (result.resultValidatePassword.success  == false  ) {
									if (!$("#errMsg" ).text()) {
										$("#errMsg" ).text("原密码不正确!");
									}
								} else if ($("#errMsg" ).text() === "原密码不正确!") {
									$("#errMsg" ).text("");
								}
							},
							error : function(result){
							}
						})
					}
				}
			}),
			new FAPUI.form.TextField({
				inputType : "password",
				itemId : "newPassword",
				name : "newPassword",
				anchor:95,
				fieldLabel : "新密码",
				allowBlank : false,
				maskReg : /^[0-9a-zA-Z\u4e00-\u9fa5_]+$/,//中文，英文，下划线，数字，不区分大小写，6个或多个
				minLength : 6,
				maxLength : 64,
				errorMsg : "必须为中文、英文、数字、下划线组成，最少6位，不区分大小写",
				listeners : {
					blur : function ( comp, event ) {
						if ( comp.isError) {
							if (!$("#errMsg").text()) {
								$("#errMsg" ).text(comp.errorMsg);
							}
						} else if ($("#errMsg" ).text() === comp.errorMsg){
							$("#errMsg" ).text("");
						}
					}
				}
			}),
			new FAPUI.form.TextField({
				inputType : "password",
				itemId : "newPasswd2",
				name : "newPasswd2",
				anchor:95,
				fieldLabel : "确认密码",
				allowBlank : false,
				maskReg : /^[0-9a-zA-Z\u4e00-\u9fa5_]+$/,//中文，英文，下划线，数字，不区分大小写，6个或多个
				minLength : 6,
				maxLength : 64,
				errorMsg : "密码为中文、英文、数字、下划线组成，最少6位，不区分大小写"
			})
		]
	});
	var submitBtn = {
		type : 'normalButton',
		text : '确定',
		handler : function (btn, event) {
			var oldPassword=modifyPasswordForm.getComponent("oldPassword" );
			var passwd = modifyPasswordForm.getComponent("newPassword" );
			var passwd2 = modifyPasswordForm.getComponent("newPasswd2" );

			if(oldPassword.getValue()==passwd.getValue()||oldPassword.getValue()==passwd2.getValue){
				if (!$("#errMsg" ).text()) {
					$("#errMsg" ).text("新密码与原密码一致，请重新设置新密码！");
				}
				return;
			}else if($("#errMsg" ).text()==="新密码与原密码一致，请重新设置新密码！"){
				$("#errMsg" ).text("");
			}

			if (passwd.getValue() != passwd2.getValue()){
				if (!$("#errMsg" ).text()) {
					$("#errMsg" ).text("两次密码输入不一致");
				}
				return;
			}else if ($("#errMsg" ).text() === "两次密码输入不一致") {
				$("#errMsg" ).text("")
			}
			if ($("#errMsg" ).text()){
				return;
			}
			modifyPasswordForm.submit();
		}
	};
	var cancelBtn = {
		type : 'normalButton',
		text : '取消',
		handler : function (btn, event) {
			modifyPasswordForm.reset();
			modifyPasswordWindow.close();
		}
	};

	/** 修改用户密码window */
	var modifyPasswordWindow = new FAPUI.Window ({
		title : "修改密码",
		titleIconCls : 'icon-save',
		width : 400,
		height : 200,
		border : true,
		closeable : true,
		closed : true,
		modal : true,
		layout : new FAPUI.Layout.FitLayout ({
			item : modifyPasswordForm
		}),
		bbar : {
			align : "center",
			items : [submitBtn,cancelBtn]
		}
	});

	modifyInfo = function(){

		if (isFirstLogin==true){
			modifyPasswordWindow.closeable = false;
			modifyPasswordWindow.collapsable=false;
			modifyPasswordWindow.maximizable=false;
			modifyPasswordWindow.bbar.items = [submitBtn];
		}
		modifyPasswordWindow.open();

		var comp = modifyPasswordForm.getComponent("newPasswd2");
		$("#"+comp.id).append("<div id = \"errMsg\" style=\"color:red; margin-top : 15px; text-align: center\"></div>");

		/*$.ajax({
		 url: FAPUI.CONTEXT_PATH + "/plugin/user/login/info",
		 dataType : "json",
		 type : "post",
		 success : function(result){
		 modifyPasswordWindow.open();
		 modifyPasswordForm.initData(result.result);
		 var emailComp = modifyInfoForm.getComponent("email");
		 $("#"+emailComp.id).append("<div id = \"errMsg\" style=\"color:red; margin-top : 15px; text-align: center\"></div>");
		 },
		 error : function(result){
		 }
		 });*/
	};
	/** 显示我的信息 */
	loginUserInfo = function(){
		$.ajax({
			url: FAPUI.CONTEXT_PATH + "/user/login/info.json",
			dataType : "json",
			type : "post",
			success : function(result){
				userInfoWindow.open();
				userInfoForm.initData(result.resultLoginInfo.result);
				if (userInfoForm.getComponent("sex").getValue()==="true") {
					userInfoForm.getComponent("sex").setValue("男");
				}else if(userInfoForm.getComponent("sex").getValue()==="fasle") {
					userInfoForm.getComponent("sex").setValue("女");
				}
			},
			error : function(result){
			}
		})
	};

} );

//centerTab添加tab页
function appendTab( id, url, title ) {

	if ( centerTab.exists ( id ) ) {
		centerTab.selectTab ( id );
	} else if ( id ) {
		var panel = new FAPUI.IframePanel ( {
			itemId : id,
			title : title,
			closeable : true,
			url : FAPUI.CONTEXT_PATH + url
		} );

		if ( ! panel ) {
			return;
		}
		centerTab.addTab ( panel );
	}
	return false;
}

function getUrlParam(name) {
	var reg = new RegExp("(^|&)"+name+"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null){
		return unescape(r[2]);
	}
	return null;
}

//退出系统
function logout () {
	Messager.confirm ( "确认信息", "确定要退出吗?", function ( r ) {
		if ( r ) {
			window.location.href = FAPUI.CONTEXT_PATH + "/logout";
		}
	} );
}
