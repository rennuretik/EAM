/**
 * 以下是使用实例
 * seajs.use(["widgets/fapui-viewport", "widgets/fapui-propertygrid",
 * "widgets/fapui-textarea","widgets/fapui-filefield",
 * "widgets/fapui-combobox", "widgets/fapui-textfield",
 * "widgets/fapui-fitlayout", "widgets/fapui-numberfield"],
 * function() {
 * $(function(){
		//propertygrid中的可编辑框必须写在外层，供editorRender调用
		var editTextField = FAPUI.create({
			ctype: "textfield",
			width: 180
		});
		var editNumberField = FAPUI.create({
			ctype: "numberfield"
		});
		var editPwdField = FAPUI.create({
			ctype: "textfield",
			inputType: "password"
		});
		var editCombox = FAPUI.create({
			ctype: "combobox",
			isRender: false,
			name: "value",
			valueField: "value",
			textField: "text",
			editAble: false,
			listeners: {
				"select": function(value, text, store, index) {
					if (value == "DB2" || value == "ORACLE") {
						$.ajax({
							url: path + "instanceSlotController/driverName",
							data: "databaseType=" + value,
							type: "post",
							success: function(data) {
								driverName = data.driverName;
							}
						});
					}
				}
			}
		});
		var editComboxDataDriver = FAPUI.create({
			ctype: "combobox",
			isRender: false,
			name: "value",
			valueField: "value",
			textField: "text",
			editAble: false
		});
		var editCombox1 = FAPUI.create({
			ctype: "combobox",
			isRender: true,
			name: "value",
			valueField: "value",
			textField: "value",
			editAble: false
		});
		
		var a =	new FAPUI.PropertyGrid({
			pagingbar:{
				pageSizeCombo:[10,20,30,50,100,500,1000,10000]
			},
			store:new FAPUI.Store({
				url:path+"/store/storeTest",
				limit:100
			}),
			smartRender : false,
			nameCfg : {
				align: "left",
				type : "common",
				width : 100,
				dataField:"name",
				renderField:"name",
				header:"属性名"
			},
			valueCfg : {
				align: "right",
				type : "common",
				width : 100,
				dataField:"value",
				renderField:"value",
				header:"属性值",
				editorRender : function(grid, rowdata, rowindex, cellindex, dataField, renderField, value){
					//根据自己的业务判断返回具体的组件类型
					if (rowdata["formType"] == "1") { //文本输入框
						return editTextField;
					} else if (rowdata["formType"] == "2") { //数字输入框
						return editNumberField;
					} else if (rowdata["formType"] == "4") { //密码输入框
						return editPwdField;
					} else if (rowdata["acquireType"] == "1") { //下拉，直接配置
						if (rowdata.name == "DATASOURCE_DRIVERCLASSNAME" && driverName != "") {
							var jsonObj = eval(driverName);
							if (!editComboxDataDriver.isRender) {
								editComboxDataDriver.data=jsonObj;
								editComboxDataDriver.isRender = true;
							} else {
								editComboxDataDriver.loadLocalData(jsonObj);
							}
							return editComboxDataDriver;
						} else {
							var jsonObj = eval(rowdata["formData"]);
							if (!editCombox.isRender) {
								editCombox.data=jsonObj;
								editCombox.isRender = true;
							} else {
								editCombox.loadLocalData(jsonObj);
							}
							return editCombox;
						}
					} else if (rowdata["acquireType"] == "2") { //下拉框，后台获取
						var store = editCombox1.store;
						store.url = rowdata["formData"];
						if (!editCombox1.isRender) {
							editCombox1.isRender = true;
						} else {
							store.load();
						}
						return editCombox1;
					} else {
						return editTextField;
					}
				}
			}
		});
		var fitlayout = new FAPUI.Layout.FitLayout({
			border :false,
			item : a
		});
		new FAPUI.View.ViewPort({
			border:false,
			renderTo: document.body,
			layout: fitlayout
		});
		a.load();
	});
});
 */
/**
 *@class FAPUI.PropertyGrid
 *@extends FAPUI.Grid
 */
define ( function ( require, exports, module ) {
	require ( "./fapui-editgrid" );
	FAPUI.define ( "FAPUI.PropertyGrid", {
		extend : "FAPUI.EditGrid", props : {
			/**
			 *列name的单元格数据配置(和单项的grid中的column配置相同)
			 *数据包含两部分:实际值和显示内容,实际值指向dataField属性所指的数据,
			 * 显示值可以由renderField字段或render函数指定
			 *配置如下：
			 * type:String type具体值如下:common普通类型(默认),
			 * rowIndex 行数,collapse 收缩图标,detail明细类型,custactioncolumn动作列
			 * header:String 该列的抬头文本
			 * dataField:String 该列指向的实际数据域
			 * renderField:String 该列指向的显示数据域
			 * width:int 列宽
			 * sortable:boolean 该列是否可排序,默认为true
			 * hide:boolean 该列是否隐藏
			 * render:function 自定义回调函数，参数明细：rowdata(行数据),
			 * rowindex(行索引),colindex(列索引),value(单元格内容)
			 * headMenu:boolean 该列是否有下拉菜单,默认为true
			 * align:String 该列的对其方式,值为"left","center","right"
			 * actionRe:String 如果该列的返回值是通过render函数返回的,
			 * 那么需要在render中的第一个标签内加入一个为actionRe属性值的class。才能执行cellClick事件
			 * handler:function 如果配置了actionRe,render。
			 * 如果配置了该属性那cellClick事件的执行函数为handler所配置的函数。参数与cellClick事件的参数一致
			 * editor: Object 该配置项配置在columns属性项内部，分别对应各个表单控件如：文本框,数字框下拉框等
			 * editorRender:function
			 *@property nameCfg
			 *@type {}
			 */
			nameCfg : {}, /**
			 *
			 *列value的单元格数据配置(和单项的grid中的column配置相同)
			 *数据包含两部分:实际值和显示内容,实际值指向dataField属性所指的数据,显示值可以由renderField字段或render函数指定
			 *配置如下：
			 * type:String type具体值如下:common普通类型(默认),rowIndex 行数,collapse 收缩图标,detail明细类型,custactioncolumn动作列
			 * header:String 该列的抬头文本
			 * dataField:String 该列指向的实际数据域
			 * renderField:String 该列指向的显示数据域
			 * width:int 列宽
			 * sortable:boolean 该列是否可排序,默认为true
			 * hide:boolean 该列是否隐藏
			 * render:function 自定义回调函数，参数明细：rowdata(行数据),rowindex(行索引),colindex(列索引),value(单元格内容)
			 * headMenu:boolean 该列是否有下拉菜单,默认为true
			 * align:String 该列的对其方式,值为"left","center","right"
			 * actionRe:String 如果该列的返回值是通过render函数返回的,那么需要在render中的第一个标签内加入一个为actionRe属性值的class。才能执行cellClick事件
			 * handler:function 如果配置了actionRe,render。如果配置了该属性那cellClick事件的执行函数为handler所配置的函数。参数与cellClick事件的参数一致
			 * editor: Object 该配置项配置在columns属性项内部，分别对应各个表单控件如：文本框,数字框下拉框等
			 * editorRender:function
			 *@property valueCfg
			 *@type {}
			 */
			valueCfg : {},

			/**
			 * 把单元格转化为可编辑框的鼠标按键次数
			 * @property clicksToEdit
			 * @type int
			 */
			clicksToEdit : 2, _originalData : {}, _dirtyData : {}
		}, override : {
			/**
			 * initConfig
			 */
			initConfig : function () {
				var me = this;

				this.columns = [];
				this.columns.push ( this.nameCfg );
				this.columns.push ( this.valueCfg );
				$ ( this.columns ).each ( function ( index ) {
					var that = this;

					if ( that.editor ) {
						that.editor = FAPUI.create ( that.editor );
					}
				} );

				me.callParent ();
				me.addEvents ( /**
					 * @event beforeedit
					 * @param input: 输入框
					 * @param grid：表格对象
					 * @param rowIndex：行索引
					 * @param colIndex：列索引
					 * @param dataField：数据字段
					 * @param renderField：显示字段
					 * @param dataValue   ：数据
					 * @param renderValue ：显示数据
					 */
					"beforeedit",

					/**
					 * @event afteredit
					 * @param input: 输入框
					 * @param grid：表格对象
					 * @param rowIndex：行索引
					 * @param colIndex：列索引
					 * @param dataField：数据字段
					 * @param renderField：显示字段
					 * @param dataValue   ：数据
					 * @param renderValue ：显示数据
					 */
					"afteredit",

					/**
					 * @event beforecommit
					 * @param grid: 表格对象
					 * @param data: 要提交的数据
					 *
					 */
					"beforecommit",

					/**
					 * @event aftercommit
					 * @param grid: 表格对象
					 * @param data: 要提交的数据
					 *
					 */
					"aftercommit" );
			},
			/**
			 * @access private
			 * 绑定表体事件
			 */
			_bindBodyEvent : function () {
				var me = this;

				me.gridBody.bind ( {
					/**
					 *
					 * @param {Object} event
					 */
					"click" : function ( event ) {
						var target = $ ( event.target );//事件源

						if ( target.is ( "tr" ) || target.is ( "td" ) ||
							target.parent ().is ( "td" ) ) {
							//如果事件源是tr,td或者事件源的父节点为td则触发事件
							$ ( ".rowselected", me.gridBody ).removeClass ( "rowselected" );
							var rowclick = true;

							if ( target.parent ().is ( "td" ) ) {
								target = target.parent ();
							}
							target.parent ().addClass ( "rowselected" );
							var rowindex = target.parent ().attr ( "rowindex" );

							me._selected = me._getSelectRow ( rowindex );
							me._selected._rowindex = rowindex;
							rowclick = me._cellClick ( target, event );
							if ( rowclick !== false ) {
								me.fireEvent ( "rowclick", me, target.attr ( "rowindex" ),
									me._getSelectRow ( rowindex ) );
							}
						}
						event.stopPropagation ();
					},
					/**
					 *
					 * @param {Object} event
					 */
					"dblclick" : function ( event ) {
						var target = $ ( event.target );//事件源
						var tdtarget = me._findTDFun ( target );

						if ( tdtarget ) {//如果事件源是tr,td或者事件源的父节点为td则触发事件
							var trtarget = tdtarget.parent ();

							$ ( ".rowselected", me.gridBody ).removeClass ( "rowselected" );
							trtarget.addClass ( "rowselected" );
							var rowindex = trtarget.attr ( "rowindex" );

							me._selected = me._getSelectRow ( rowindex );
							var cellindex = tdtarget.attr ( "collindex" );
							var columnCfg = me.columns[ cellindex ];

							if ( me.clicksToEdit == 2 && ( columnCfg.editor != null ||
								columnCfg.editorRender != null ) ) {
								me._editorFun ( columnCfg, rowindex, cellindex, tdtarget );
							} else {
								me.fireEvent ( "dbrowclick", me, rowindex, me._selected );
							}
							event.stopPropagation ();
						}
					}
				} );
			},
			/**
			 *
			 * @param {Object} target
			 * @returns {*}
			 * @private
			 */
			_findTDFun : function ( target ) {
				var result;
				var me = this;

				if ( target.is ( "input" ) || target.is ( "textarea" ) ) {
					return null;
				}
				if ( target.is ( "div" ) && target.hasClass ( "grid-body" ) ) {
					result = null;
				} else if ( target.is ( "tr" ) ) {
					result = null;
				} else if ( target.is ( "td" ) ) {
					result = target;
				} else {
					result = me._findTDFun ( target.parent () );
				}
				return result;
			},

			/**
			 * @access private
			 * 可编辑表格的处理函数
			 * @param {Object} columnCfg
			 * @param {Object} rowindex
			 * @param {Object} cellindex
			 * @param {Object} tdtarget
			 */
			_editorFun : function ( columnCfg, rowindex, cellindex, tdtarget ) {
				var isIe = $.browser.msie;
				var me = this;
				var dataField = columnCfg.dataField;
				var renderField = columnCfg.renderField;
				var value = me._selected[ dataField ];
				//如果对应的columns配置项不为空则
				var comp = columnCfg.editor || columnCfg.editorRender ( me, me._selected, rowindex, cellindex,
						dataField, renderField, value );

				comp.labelWidth = 0;
				if ( me.fireEvent ( "beforeedit", comp, me, rowindex, cellindex, dataField, renderField, value,
						me._selected[ renderField ] ) === false ) {
					return;
				}
				var el = comp.el;

				tdtarget = tdtarget.find ( "div.bodycell" );
				var textAreaTr = tdtarget.parent ().parent ();

				comp._tdtarget = tdtarget;
				comp._rowindex = rowindex;
				comp._cellindex = cellindex;
				if ( el == null ) {
					tdtarget.html ( "" );
					comp.render ( tdtarget );
					comp._isShow = true;
					$ ( document ).bind ( "mousedown", function ( event ) {
						var target = $ ( event.target );
						//判断鼠标点击的区域不在comp.el内;comp是已经显示的;点击的区域是不在下拉框的下拉内容框中时
						if ( ! target.is ( comp.el.find ( "*" ) ) && comp._isShow && !
								target.is ( "div.trigger-content,div.trigger-content *" ) ) {
							if ( me.fireEvent ( "afteredit", comp, me, comp._rowindex, comp._cellindex, dataField,
									renderField, comp.getValue (), comp.getRawValue () ) === false ) {
								return;
							}
							comp.hide ();
							comp._isShow = false;
							$ ( document ).append ( comp.el );
							if ( ! me._originalData[ comp._rowindex ] ) {//如果源数据中已经存在值就跳过
								var o = {};

								$.extend ( true, o, me._selected );
								me._originalData[ comp._rowindex ] = o;
							}
							me._dirtyData[ comp._rowindex ] = me._selected;//把最新的数据更新到脏数据中的数据
							me._selected[ dataField ] = comp.getValue ();
							me._selected[ renderField ] = comp.getRawValue ();
							var val = comp.getRawValue ();
							var handler = eval ( me.aRender[ cellindex ] );

							handler = handler || function ( rowdata, rowindex, colindex, value ) {
									return value;
								};
							var el = handler && handler.call ( {}, me._selected, comp._rowindex,
									comp._cellindex, val );

							comp._tdtarget.append ( el );
							//在次实现获取comp的父级dom的样式添加,comp为双击单元格生成的表单元素组件,
							// comp的parent为bodyCell,bodyCell的parent是表格的td
							if ( ! comp._tdtarget.hasClass ( "bodycell-biaoji" ) ) {
								comp._tdtarget.addClass ( "bodycell-biaoji" );
							}
							comp._tdtarget.attr ( "title", val );
						}
					} );
				} else {
					tdtarget.html ( "" );
					tdtarget.append ( el );
					comp.show ();
					comp._isShow = true;
				}
				//textarea特殊处理
				var width = tdtarget.width ();

				if ( comp.ctype == "textarea" ) {
					//对产生的textArea所在的行的高亮样式修改
					if ( isIe ) {
						comp.setWidth ( width + 5 );
					} else {
						comp.setWidth ( width + 3 );
					}
				} else {
					comp.setWidth ( width );
				}
				comp.setValue ( value );
			},

			/**
			 * 提交修改的数据
			 * @method commit
			 *
			 */
			commit : function () {
				var me = this;

				if ( me.fireEvent ( "beforecommit", me, me._dirtyData ) === false ) {
					return;
				}
				var params = {
					"data" : FAPUI.toJSON ( me._dirtyData )
				};

				$.post ( me.commitUrl, params, function ( data ) {
					me.fireEvent ( "aftercommit", me, me._dirtyData, data );
					if ( data.success ) {
						me._originalData = {};//初始化源数据
						me._dirtyData = {};//初始化脏数据
					}
				} );
			},
			/**
			 * @access private
			 */
			_cellClick : function ( target, event ) {
				var me = this;
				var result = true;

				if ( target.attr ( "type" ) == "common" ) {
					var rowindex = target.parent ().attr ( "rowindex" );
					var rowdata = me._getSelectRow ( rowindex );
					var collindex = target.attr ( "collindex" );
					var dataField = me.columns[ collindex ].dataField;
					var renderField = me.columns[ collindex ].renderField || dataField;

					if ( me.clicksToEdit == 1 && me.columns[ collindex ].editor != null ) {
						result = false;
						var tdtarget = target;
						var columnCfg = me.columns[ collindex ];

						me._editorFun ( columnCfg, rowindex, collindex, tdtarget );
					} else {
						result = me.fireEvent ( "cellclick", me, rowindex, collindex, dataField, renderField,
							rowdata[ dataField ], rowdata[ renderField ], event );
					}
				} else if ( target.attr ( "type" ) == "checkbox" ) {
					$ ( ".rowselected", me.gridBody ).removeClass ( "rowselected" );
					target.parent ().addClass ( "rowselected" );
					var img = target.find ( "img" );
					var data = me.store.data[ target.parent ().attr ( "rowindex" ) ];

					if ( img.hasClass ( "check" ) ) {
						img.removeClass ( "check" );
						data.check = false;
					} else {
						img.addClass ( "check" );
						data.check = true;
					}
					result = false;
				} else if ( target.attr ( "type" ) == "collapse" ) {
					var img = target.find ( "img" );

					if ( img.hasClass ( "expand" ) ) {
						img.removeClass ( "expand" );
						target.parent ().next ().hide ();
					} else {
						img.addClass ( "expand" );
						if ( target.parent ().next ().attr ( "type" ) != "collapse" ) {
							var data = me.store.data[ target.parent ().attr ( "rowindex" ) ]
								[ target.attr ( "field" ) ];
							var cfg = {
								colsize : me.columns.length, data : data
							};
							var newTr = $ ( juicer ( me.collapsetpl, cfg ) );

							newTr.insertAfter ( target.parent () );
						}
						target.parent ().next ().show ();
					}
					result = false;
				}
				event.stopPropagation ();
				return result;
			}
		}
	} );
	FAPUI.register ( "propertygrid", FAPUI.PropertyGrid );
	return FAPUI.PropertyGrid;
} );