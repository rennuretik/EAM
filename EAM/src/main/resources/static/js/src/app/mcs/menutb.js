define (function (require) {

	require ( "jquery" );
	require ( "back" );
	require ( "widgets/fapui-borderlayout" );
	require ( "widgets/fapui-fitlayout" );
	require ( "widgets/fapui-form" );
	require ( "widgets/fapui-menu" );
	require ( "widgets/fapui-window" );
	require ( "widgets/fapui-mask" );
	require ( "widgets/fapui-viewport" );
	require ( "widgets/fapui-grid" );
	require ( "widgets/fapui-button" );
	require ( "widgets/fapui-toolbar" );
	require ( "widgets/fapui-composite" );
	require ( "widgets/fapui-textfield" );
	require ( "widgets/fapui-numberfield" );
	require ( "widgets/fapui-datefield" );
	require ( "widgets/fapui-messager" );
	require ( "widgets/fapui-datefield" );
	require ( "widgets/fapui-radiogroup" );
	require ( "widgets/fapui-combobox" );

	$(function (){
		var hoverFlag = FAPUI.isIE6 ();
		var selectObj = {};

		deleteRow = function (index) {
			selectObj = dataGrid.store.data[index];
			alert(selectObj);
			alert(selectObj.id);
			Messager.confirm ("确认删除", "确定删除此条记录?", function (result){
				if (result) {
					$.ajax({
						url : FAPUI.CONTEXT_PATH + "/menutb/delete",
						type : "POST",
						data : {
							menuTbId : selectObj.id
						},
						success : function(deleted) {
							if(deleted) {
								dataGrid.load();
								Messager.alert( "删除结果", "删除成功", "info",function(){});
							} else {
								Messager.alert( "删除结果", undefined===deleted.errorMessage?"删除失败":deleted.errorMessage, "error");
							}
						}
					});
				};
			},300,200) ;
		};

		modify = function (index) {
			alert(111);
			selectObj = dataGrid.store.data[index];
			modifyWindow.open();
			modifyForm.initData(selectObj);
																																						
		};

		var modifyForm = new FAPUI.form.FormPanel ({
			border : false,
			actionUrl : FAPUI.CONTEXT_PATH + "/menutb/modify",
			columns : 3,
			defaultSet : { labelWidth : 80, labelSplit : ":" },
			onSuccess : function (result) {
				dataGrid.load();
				Messager.show (
					{ title : "提示信息", msg : "修改成功", timeout : 2000, showType : "show" }
				);
				modifyForm.reset();
				modifyWindow.close();
			},
			onFailure : function (result) {
				Messager.alert ("错误信息", undefined===result.errorMessage?"修改失败":result.errorMessage,"error",function(){},250,150);
			},
			items : [
											{
					ctype : 'textfield',
					inputType : 'hidden',
					itemId : "id",
					name : "id",
				},
															{
					ctype : "textfield",
					itemId : "menuName",
					name : "menuName",
					fieldLabel : "菜单名",
				},
																													{
					ctype : "textfield",
					itemId : "url",
					name : "url",
					fieldLabel : "连接地址",
				},
										]
		});

		var modifyWindow = new FAPUI.Window ({
			title : "更新",
			titleIconCls : "icon-save",
			width : 600,
			height : 300,
			border : true,
			closeable : true,
			closed : true,
			modal : true,
			layout : new FAPUI.Layout.FitLayout ({
				item : modifyForm
			}),
			bbar : {
				align : "right",
				items : [
					{ type : "normalButton", text : "确定", handler : function (btn, event) {
						modifyForm.submit();
					} },
					{ type : "normalButton", text : "重置", handler : function (btn, evnet) {
						modifyForm.reset();
					} },
					{ type : "normalButton", text : "关闭", handler : function (btn, event) {
						modifyWindow.close();
					} }
				]
			}
		});

		var toolBar = new FAPUI.ToolBar ({
			align : "left",
			items : [
				{ type : "linkButton", iconCls : "icon-add", itemId : "add", handler : function() {
					addWindow.open();
				} }
			]
		});

		var addForm = new FAPUI.form.FormPanel({
			border : false,
			columns : 3,
			defaultSet: {
				labelWidth : 100,
				labelSplit : ":"
			},
			actionUrl : FAPUI.CONTEXT_PATH + "/menutb/add",
			onSuccess : function (ret) {
				dataGrid.load();
				Messager.alert( "添加结果", "添加成功", "info",function(){});
				addForm.reset();
				addWindow.close();
			},
			onFailure : function (result) {
				Messager.alert ("错误信息", undefined===result.errorMessage?"添加失败":result.errorMessage,"error",function(){},250,150);
			},
			items : [
					{
					ctype : "textfield",
					itemId : "menuName",
					name : "menuName",
					fieldLabel : "菜单名",
				},
																											{
				ctype : "numberfield",
				itemId : "parentId",
				name : "parentId",
				fieldLabel : "父节点",
				},
																					{
				ctype : "numberfield",
				itemId : "orderId",
				name : "orderId",
				fieldLabel : "顺序号",
				},
														{
					ctype : "textfield",
					itemId : "url",
					name : "url",
					fieldLabel : "连接地址",
				},
																]
		});

		var addWindow = new FAPUI.Window({
			title : "添加信息",
			titleIconCls : "icon-save",
			width : 600,
			height : 300,
			border : false,
			closeable : true,
			closed : true,
			model : true,
			layout : new FAPUI.Layout.FitLayout({ item : addForm }),
			bbar : {
				align : "right",
				items : [
					{ type : "normalButton", text : "确定", handler : function (btn, event) {
						addForm.submit();
					} },
					{ type : "normalButton", text : "重置", handler : function (btn, evnet) {
						addForm.reset();
					} },
					{ type : "normalButton", text : "关闭", handler : function (btn, event) {
						addForm.reset();
						addWindow.close();
					} }
				]
			}
		});

		var query = new FAPUI.form.FormPanel ({
			split : true,height : 50, columns : 5,submitType : "ajax",
			actionUrl : FAPUI.CONTEXT_PATH + "/menutb/list",
			items : [
				{ ctype : "textfield", name : "keyword", fieldLabel : "查询", allowBlank : true },
				new FAPUI.form.Composite({
					itemStyle : "margin-top:0px;",
					items : [
						new FAPUI.Button({
							itemStyle : "margin-top:5px;",
							type : "normalButton",
							text : "查询",
							height : 20,
							handler : function ( Button, btn, event ) {
								dataGrid.store.baseParams=query.getJson();
								dataGrid.load(query.actionUrl);
							}
						}),
						new FAPUI.Button({
							itemStyle : "margin-top:5px;",
							type : "normalButton",
							text : "重置",
							height : 20,
							handler : function ( Button, btn, event ) {
								query.reset();
								dataGrid.load();
							}
						})
					]
				})
			]
		});

		var dataGrid = new FAPUI.Grid ({
			title : "信息列表", border : false, hoverFlag : hoverFlag, tbar : toolBar,
			dragChange : false, dragSort : false, onselectstart : false,
			pagingbar :{ pageSizeCombo : [ 1, 5, 10, 20, 50, 100 ]},
			store : new FAPUI.Store ({
				url : FAPUI.CONTEXT_PATH + "/menutb/list",
				limit : 20
			}),
			columns : [
				{ type : "rowIndex" },
																										{
					type : "common",
					header : "菜单名",
					dataField : "menuName",
					align :"center"
				},
																														{
				type : "common",
				header : "父节点",
				dataField : "parentId",
				align :"center"
				},
																							{
				type : "common",
				header : "顺序号",
				dataField : "orderId",
				align :"center"
				},
															{
					type : "common",
					header : "连接地址",
					dataField : "url",
					align :"center"
				},
																	{ type : "common", header : "操作", align : "center",
				render : function (rowData, rowIndex, colIndex, value ) {
					alert(rowIndex);
					return "<a href=\"javascript:deleteRow('"+rowIndex+"');\">删除</a>"+
						"&nbsp;&nbsp;&nbsp;&nbsp;"+"<a href=\"javascript:modify('"+rowIndex+"');\">修改</a>";
				} }
			]
		});

		var border = new FAPUI.Layout.BorderLayout ({
			northregion : query ,
			centerregion : dataGrid
		});
		new FAPUI.View.ViewPort({
			renderTo : document.body,
			layout : border
		});
		dataGrid.load();
	});
}) ;



