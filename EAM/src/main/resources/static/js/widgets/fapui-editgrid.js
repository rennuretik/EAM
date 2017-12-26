/**
 *可编辑表格数据表格组件,如下创建:
 *
 *
 *
 *
 var hoverFlag = FAPUI.isIE6();
 //可编辑表格(表头的跨行跨列配置)
 a = new FAPUI.Grid({
			title:"grid1非智能渲染模式的表格",
			renderTo:"ab",
			width:500,
			commitUrl:path+"/store/commit",
			smartRender:false,//智能渲染模式,默认为true。但当有动作列和collapse列时会自动设为false
			hoverFlag:!hoverFlag,
			height:800,
			tbar:{
				items:[{
						ctype:"button",
						text:"提交修改后的表格",
						type:"linkButton",
						handler:function(){
							a.commit();
						}
				}]
			},
			pagingBar:true,//是否要分页栏,如不需要设置为false
			store:new FAPUI.Store({
				url:path+"/store/storeTest",
				limit:100
			}),
			clicksToEdit:2,//点击单元格多少次,单元格转换为可编辑表格
			//多表头配置
			multipleHeaderCfg:[
			                  	  [
			                   		{
			                	   		type:"checkbox"
			                   		},{
					                	header:"跨两行",
					                	colspan:1,//配置表头跨多少列
					                	rowspan:2 //配置表头跨多少行
			                   		},{
					                	header:"跨三列",
					                	colspan:3,
					                	rowspan:1
					                }
					              ],[
					            	{
					                	header:"跨两列",
					                	colspan:2,
					                	rowspan:1
			                   		},{
					                	header:"一列",
					                	colspan:1,
					                	rowspan:1
				                    }
				                  ],[
				                    {
										header:"特殊渲染列",
										colspan:1,
										rowspan:1
									},{
										header:"所在部门",
										colspan:1,
										rowspan:1
									},{
										header:"普通的员工姓名",
										colspan:1,
										rowspan:1
									},{
										header:"动作列",
										colspan:1,
										rowspan:1
									}
				                  ]
			                  ],
			columns:[{
         	   type:"checkbox"
            },{
				type:"common",
				header:"特殊渲染列(可编辑单元格)",
				dataField:"userName",
				width:200,
				render:function(rowdata,rowindex,colindex,value){
					if(rowindex%2===0){
						return "<font color="red">"+value+"</font>";
					}
					return "<font color="gray">"+value+"</font>";
				},
            editor:{
				ctype:"textfield"
			}
			},{
				type:"common",
				header:"所在部门",
				dataField:"dep",
				width:100,
				editor:{
					ctype:"textarea"
				}
			},{
				type:"common",
				header:"普通的员工姓名(可编辑下拉框)",
				dataField:"dep",
				renderField:"userName",
				width:100,
				editor:{
					ctype:"combobox",
					store:new FAPUI.Store({
						url:path+"/store/storeTest",
						limit:10
					}),
					 valueField:"userId",
					 textField:"userName"
				}
			},{
				type:"common",
				//dataField:"dep",  //注意：若没有此属性，则下列方法返回的value为undefined
				width:50,
				header:"动作列",
				align:"center",
				actionRe:"actionCol-editor",//配合handler使用,需要匹配的动作列
				render:function(rowdata,rowindex,colindex,value){
					if(rowindex%2===0){
						return "<img class="actionCol-editor" src=""+path+"/js/widgets/resources/icons/edit_add.png" title="编辑"/>";
					}
					return "<img class="actionCol-editor" src=""+path+"/js/widgets/resources/icons/edit_remove.png" title="移除"/>";
				},
				handler:function(comp,rowIndex,cellIndex,dataField,renderField,dataValue,renderValue,event){
					alert("第"+rowIndex+"行");
				}
			}],
			listeners:{
 				"dbrowclick":function(a,b){
                  alert(a);
                  alert(b);
				},
				"beforeedit":function(input,grid,rowindex,colindex,dataField,renderField,dataValue,renderValue){/*
					alert("input:"+input);
					alert("grid:"+grid);
					alert("rowindex:"+rowindex);
					alert("colindex:"+colindex);
					alert("dataFiled:"+dataField);
					alert("renderField:"+renderField);
					alert("dataValue:"+dataValue);
					alert("renderValue:"+renderValue)
				},
				"afteredit":function(input,grid,rowindex,colindex,dataField,renderField,dataValue,renderValue){
					alert("input:"+input);
					alert("grid:"+grid);
					alert("rowindex:"+rowindex);
					alert("colindex:"+colindex);
					alert("dataFiled:"+dataField);
					alert("renderField:"+renderField);
					alert("dataValue:"+dataValue);
					alert("renderValue:"+renderValue)
				},
				"beforecommit":function(grid,data){
					alert(data);
				},
				"aftercommit":function(grid,data,ret){
					alert(data);
				}
			}
		});
 *
 *@class FAPUI.Grid
 *@extends FAPUI.Panel
 */
define ( function ( require ) {
	require ( "./fapui-grid" );
	FAPUI.define ( "FAPUI.EditGrid", {
			extend : "FAPUI.Grid", props : {
				/**
				 *列定义Grid的单元格的数据包含两部分:实际值和显示内容,
				 * 实际值指向dataField属性所指的数据,显示值可以由renderField字段或render函数指定
				 *单项column的配置如下：
				 * type:String type具体值如下:common普通类型(默认),rowIndex 行数,
				 * collapse 收缩图标,detail明细类型,custactioncolumn动作列
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
				 *@property columns
				 *@type Array
				 */
				columns : [],

				/**
				 * 把单元格转化为可编辑框的鼠标按键次数
				 * @property clicksToEdit
				 * @type int
				 */
				clicksToEdit : 2,
			    _originalData : {},
			    _dirtyData : {}
			}, override : {
				/**
				 * 初始化方法
				 */
				initConfig : function () {
					var me = this;

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
						"afteredit",

						/**
						 * @event beforecommit
						 * grid: 表格对象
						 * data: 要提交的数据
						 *
						 */
						"beforecommit",

						/**
						 * @event beforecommit
						 * grid: 表格对象
						 * data: 要提交的数据
						 *
						 */
						"aftercommit" );
					$ ( this.columns ).each ( function () {
						var me = this;

						if ( me.editor ) {
							me.editor = FAPUI.create ( me.editor );
						}
					} );

					me.callParent ();
				},
				/**
				 * 绑定表体事件
				 * @private
				 */
				_bindBodyEvent : function () {
					var me = this;

					me.gridBody.bind ( {
						/**
						 *
						 * @param {Object} event
						 */
						"click" : function ( event ) {
							var target = $ ( event.target );
							//事件源
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

								if ( me.clicksToEdit === 2 && ( columnCfg.editor !== null ||
									columnCfg.editorRender !== null ) ) {
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
				 * @param {*} target
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
				 * @param {Object}columnCfg
				 * @param {number}rowindex
				 * @param {number} cellindex
				 * @param {Object} tdtarget
				 */
				_editorFun : function ( columnCfg, rowindex, cellindex, tdtarget ) {
					var isIe = $.browser.msie;
					var me = this;

					var dataField = columnCfg.dataField;
					var renderField = columnCfg.renderField;
					var value = me._selected[ dataField ];
					//如果对应的columns配置项不为空则
					var comp = columnCfg.editor ;
					if(comp){
						comp.labelWidth = 0;
						if ( me.fireEvent ( "beforeedit", comp, me, rowindex, cellindex, dataField, renderField, value,
											me._selected[ renderField ] ) === false ) {
							return;
						}
						var el = comp.el;

						tdtarget = tdtarget.find ( "div.bodycell" );

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
									if ( me.fireEvent ( "afteredit", comp, me, comp._rowindex,
														comp._cellindex, dataField,
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
									var el = handler && handler.call ( {}, me._selected, comp._rowindex, comp._cellindex,
																		   val );

									comp._tdtarget.append ( el );
									//在次实现获取comp的父级dom的样式添加,comp为双击单元格生成的表单元素组件，comp的parent为bodyCell,bodyCell的parent是表格的td
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

						if ( comp.ctype === "textarea" ) {
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


					}else{
						return false;
					}
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
					var params= me._dirtyData;
					var arr = [];
					for(var p in params){
						arr.push(params[p]);
					}
					$.ajax({
						url:me.commitUrl,
						data:JSON.stringify(arr),
						type:'POST',
						contentType:'application/json',
						traditional:true,
						success:function ( data ) {
							me.fireEvent ( "aftercommit", me, me._dirtyData, data );
							if ( data.success ) {
								me._originalData = {};//初始化源数据
								me._dirtyData = {};//初始化脏数据
							}
						}
					})
				},
				/**
				 * @access private
				 */
				_cellClick : function ( target, event ) {
					var me = this;
					var result = true;

					if ( target.attr ( "type" ) === "common" ) {
						var rowindex = target.parent ().attr ( "rowindex" );
						var rowdata = me._getSelectRow ( rowindex );
						var collindex = target.attr ( "collindex" );
						var dataField = me.columns[ collindex ].dataField;
						var renderField = me.columns[ collindex ].renderField || dataField;

						if ( me.clicksToEdit === 1 && me.columns[ collindex ].editor !== null ) {
							result = false;
							var tdtarget = target;
							var columnCfg = me.columns[ collindex ];

							me._editorFun ( columnCfg, rowindex, collindex, tdtarget );
						} else {
							result = me.fireEvent ( "cellclick", me, rowindex, collindex, dataField, renderField,
								rowdata[ dataField ], rowdata[ renderField ], event );
						}
					} else if ( target.attr ( "type" ) === "checkbox" ) {
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
					} else if ( target.attr ( "type" ) === "collapse" ) {
						var img = target.find ( "img" );

						if ( img.hasClass ( "expand" ) ) {
							img.removeClass ( "expand" );
							target.parent ().next ().hide ();
						} else {
							img.addClass ( "expand" );
							if ( target.parent ().next ().attr ( "type" ) !== "collapse" ) {
								var data = me.store.data[
									target.parent ().attr ( "rowindex" ) ][ target.attr ( "field" ) ];
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
	FAPUI.register ( "editgrid", FAPUI.EditGrid );
	return FAPUI.Grid;
} );