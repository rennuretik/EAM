/**
 *数据表格组件,如下创建(包含普通的grid):
 *
 *
 *
 //普遍grid配置
 b=     new FAPUI.Grid(
 {
			title:"grid2智能渲染表格",
			renderTo:"cd",
			width:500,
			hoverFlag:!hoverFlag,
			height:800,
			pagingBar:false,//是否要分页栏,如不需要设置为false
			store:new FAPUI.Store({
				url:path+"/store/storeTest",
				limit:10000
			}),
			columns:[{
				type:"rowIndex"
			},{
				type:"checkbox"
			},{
				type:"common",
				header:"员工编号",
				dataField:"userId",
				renderField:"userName",
				hide:true,
				align:"center",
				width:200
			},{
				type:"common",
				header:"特殊渲染列",
				dataField:"userName",
				width:200,
				render:function(rowdata,rowindex,colindex,value){
					if(rowindex%2===0){
						return "<font color="red">"+value+"</font>";
					}
					return "<font color="gray">"+value+"</font>";
				}
			},{
				type:"common",
				header:"所在部门",
				dataField:"dep",
				width:100
			},{
				type:"common",
				header:"普通的员工姓名",
				renderField:"userName",
				width:100
			}],
			listeners:{
 				"dbrowclick":function(a,b){
                  alert(a);
                  alert(b);
				}
			}
		});
 });
 *
 *@class FAPUI.Grid
 *@extends FAPUI.Panel
 */
define ( function ( require, exports, module ) {
	var importcss = "./themes/" + FAPUI.getTheme () + "/css/ui-grid.css";

	require.async ( importcss );
	require ( "./fapui-store" );
	require ( "./fapui-panel" );
	require ( "./fapui-pagingBar" );
	require ( "./fapui-menu" );
	require ( "./fapui-resize" );
	FAPUI.define ( "FAPUI.Grid", {
		extend : "FAPUI.Panel",
		props : {
			/**
			 *Grid列默认对其方式,如果某列有单独的对其方式,可以在columns配置项中单独配置。默认为左对齐
			 *@property align
			 *@type String
			 *@value "left","center","right"
			 */
			align : "left",

			/**
			 *数据集
			 *@property store
			 *@type Store
			 */
			store : {},

			/**
			 *分页栏，默认为null
			 *@property pagingbarCfg
			 *@type pagingbar
			 */
			pagingbarCfg : null,

			/**
			 *列定义Grid的单元格的数据包含两部分:实际值和显示内容,实际值指向dataField属性所指的数据,显示值可以由renderField字段或render函数指定
			 *单项column的配置如下：
			 * type:String type具体值如下:common普通类型(默认),rowIndex 行数,collapse 收缩图标,detail明细类型,custactioncolumn动作列
			 * header:String 该列的抬头文本
			 * dataField:String 该列指向的实际数据域
			 * renderField:String 该列指向的显示数据域
			 * width:int 列宽
			 * sortable:boolean 该列是否可排序,默认为true
			 * hide:boolean 该列是否隐藏
			 * render:function 自定义回调函数，参数明细：rowdata(行数据),rowindex(行索引),colindex(列索引),value(单元格内容)
			 * headMenu:boolean 该列是否有下拉菜单,默认为true
			 * align:String 该列的对其方式,值为"left","center","right",默认为left
			 * dataAlign:String 数据的对齐方式,如果不设置则和align的值一样。
			 * actionRe:String 如果该列的返回值是通过render函数返回的,那么需要在render中的第一个标签内加入一个为actionRe属性值的class。才能执行cellClick事件
			 * handler:function 如果配置了actionRe,render。如果配置了该属性那cellClick事件的执行函数为handler所配置的函数。参数与cellClick事件的参数一致
			 * onselectstart:Boolean 该列是否可以选择内容 如果这个有值,则以这个值为标准.不然就去grid中的onselectstart的值
			 * title : Boolean 鼠移动到单元格上是否浮动显示当前单元格内容默认值是true
			 *@property columns
			 *@type Array
			 */
			columns : [], /**
			 * 表格中的数据是否需要hover事件,默认为true。建议IE6设为false。
			 */
			hoverFlag : true,

			/**
			 *Grid边框
			 *@property border
			 *@type boolean
			 *@default true
			 */
			border : true,

			/**
			 *智能渲染模式该模式主要用大数据量的一次性渲染.默认为true,如果有动作列那么smartRender为false
			 *@property smartRender
			 *@type Boolean
			 */
			smartRender : true,

			/**
			 *默认值为50,当且仅当分页大小大于此值并且smartRender为true时启用智能渲染模式
			 *@property smartRenderSize
			 *@type Number
			 */
			smartRenderSize : 50,

			/**
			 * 行高,默认为20
			 * @property rowHeight
			 * @type Number
			 */
			rowHeight : 20,
			cfg : {}, /**
			 * 是否需要分页栏,默认为true,如果不需要设为false
			 * @property pagingBar
			 * @type Boolean
			 */
			pagingBar : true,

			/**
			 * 多表头配置,如果配置了这个属性,那么grid的表头按照这个配置来生成,columns单项配置中的header属性失效
			 * [{
                         * 	header:"列1",
                         *  colspan:2,
                         *  rowspan:1
                         * },{
                         * 	header:"列2",
                         * 	colspan:2,
                         *  rowspan:1
                         * }]
			 */
			multipleHeaderCfg : null, /**
			 * 是否移动
			 * @type boolean
			 * @property _moveAble
			 * @default true
			 * @private
			 */
			_moveAble : true, /**
			 * 是否可以选择grid里面的内容,默认为true
			 * @property onselectstart
			 * @type Boolean
			 */
			onselectstart : true, /**
			 * 拖拽换行，默认为false(与dragSort互斥,优先dragSort)
			 * @property dragChange
			 * @type Boolean
			 */
			dragChange : false, /**
			 * 拖拽排序，默认为false(与dragChange互斥,优先dragSort)
			 * @property dragSort
			 * @type Boolean
			 */
			dragSort : false, /**
			 * 记录当前页添加了多少行数据，当store充加载的时候 该计数重置为0
			 * @property addCount
			 * @private
			 * @type Number
			 */
			addCount : 0, /**
			 * 记录隐藏列的宽度
			 * @type object
			 * @property _headWidth
			 * @private
			 */
			_headWidth : {}
		}, override : {
			/**
			 * 初始化方法
			 */
			initConfig : function () {
				var me = this;

				me.callParent ();
				me.addEvents ( /**
					 *行点击事件
					 *@event rowclick
					 *@param grid {Grid} grid组件
					 *@param rowIndex {Int} 行索引
					 *@param data {jsondata} 当前点击行的数据
					 */
					"rowclick", /**
					 *行双击事件
					 *@event dbrowclick
					 *@param grid {Grid} grid组件
					 *@param rowIndex {Int} 行索引
					 *@param data {jsondata} 当前点击行的数据
					 */
					"dbrowclick", /**
					 *单元格点击事件
					 *@event cellclick
					 *@param grid {Grid} grid组件
					 *@param rowIndex {Int} 行索引
					 *@param colIndex {Int} 列索引
					 *@param dataField {String} 实际值所应对的列的名称
					 *@param renderField {String} 显示值所应对的列的名称
					 *@param dataValue {String} 实际值
					 *@param renderValue {String} 显示值
					 */
					"cellclick", /**
					 *行拖拽换行事件
					 *@event dragChange
					 *@param moveIndex {Int} 移动行索引(该行索引为要移动的行数据的原索引)
					 *@param movedIndex {Int} 被移动行索引(该行所以为被移动行索引)
					 *@param moveData {json} 移动的行数据
					 *@param movedData {json} 被移动的行数据
					 *@param grid {object} grid
					 */
				"dragChange", /**
					 *行拖拽排序
					 *@event dragSort
					 *@param moveIndex {Int} 移动行索引(该行索引为要移动的行数据的原索引)
					 *@param movedIndex {Int} 被移动行索引(该行所以为被移动行索引)
					 *@param moveData {json} 移动的行数据
					 *@param movedData {json} 被移动的行数据
					 *@param grid {object} grid
					 */
					"dragSort" );
				me.store.on ( "refresh", this._refreshView, this );
				me.store.on ( "beforerefresh", this._befroerefresh, this );
				me.store.on ( "afterupdate", this._updateView, this );
				me._beforeRender ();
				me.girdheadtpl = [ "<div class=\"grid-header\" style=\"width:100%\"", " id=$${gridHeadId}>",
					"<div class=\"grid-header-inner\" style=\"width:2000%\">",
					"<table class=\"grid-header-table\" border=\"0\"",
					" cellpadding=\"0\" cellspacing=\"0\" style=\"width:100%;\"><tbody>",
					"<tr style=\"height: auto;\">", "{@each columns as it, k}", "{@if it.type!=\"common\"}",
					"<th style=\"height: 0px;font-size:0; width: ${it.width};\"",
					" sort=\"false\" collindex=${k}></th>", "{@else if it.type==\"common\"}",
					"<th style=\"height: 0px;font-size:0; width: ${it.width};\" ",
					"field=\"${it.sortField==null?it.dataField:it.sortField}\" ",
					"sort=\"${it.sortable==null?\"true\":it.sortable}\"", " collindex=${k}></th>", "{@/if}", "{@/each}",
					"</tr>", "<tr>", "{@each columns as it, k}", "{@if it.type==\"common\"}",
					"<td collindex=${k} align=\"${it.align==null?\" ", "left\":it.align }\">",
					"<div class=\"headerinner\" menu=\"${it.headMenu==null?\"",
					"true\":it.headMenu}\" menushow=\"false\">",
					"<span class=\"headercell\" onselectstart=\"return false\"",
					" style=\"text-align:${it.align==null?\"left\":it.align}\">",
					"${it.header?it.header:\"\"}&nbsp;</span>", "<div class=\"headerresizer\"></div>",
					"<div class=\"headertrigger\"></div>", "</div>", "</td>", "{@else if it.type==\"checkbox\"}",
					"<td collindex=${k} align=\"center\">", "<div class=\"headerinner\" style=\"padding-top:6px;\" ",
					"sort=\"false\" menu=\"false\" menushow=\"false\">", "<img class=\"common uncheck\" ",
					"src=\"" + FAPUI.BLANK_IMG + "\">", "<div class=\"headerresizer\">&nbsp;</div>", "</div>",
					"</td>", "{@else if it.type==\"rowIndex\"}", "<td collindex=${k}>",
					"<div class=\"headerinner\" sort=\"${it.sortable==null?\"" + "true\":it.sortable}\" ",
					"menu=\"${it.headMenu==null?\"true\":it.headMenu}\" ", "menushow=\"false\">",
					"<span class=\"headercell\">序号</span>", "<div class=\"headerresizer\" >&nbsp;</div>",
					"<div class=\"headertrigger\"></div>", "</div>", "</td>", "{@else}", "<td collindex=${k}>",
					"<div class=\"headerinner\" sort=\"${it.sortable==null?\"", "true\":it.sortable}\" ",
					"menu=\"${it.headMenu==null?\"true\":it.headMenu}\" ", "menushow=\"false\">",
					"<span class=\"headercell\">&nbsp;</span>", "<div class=\"headerresizer\" >&nbsp;</div>",
					"<div class=\"headertrigger\"></div>", "</div>", "</td>", "{@/if}", "{@/each}", "<td>",
					"<span class=\"headercell\">&nbsp;</span>", "</td>", "</tr>", "</tbody>", "</table>", "</div>",
					"</div>" ].join ( " " );

				me.multipleHeadertpl = [ "<div class=\"grid-header\"  style=\"width:100%\" id=$${gridHeadId}>",
					"<div class=\"grid-header-inner\"", " style=\"width:${widthSum+1020}px\">",
					"<table class=\"grid-header-table\"", " border=\"0\" cellpadding=\"0\" ",
					"cellspacing=\"0\" style=\"width:${widthSum+1000}px;\">", "<tbody>", "<tr style=\"height: auto;\">",
					"{@each columns as it, k}", "{@if it.type!=\"common\"}", "<th style=\"height: 0px;font-size:0; ",
					"width: ${it.width==null?30:it.width}px;\" ", "sort=\"false\" collindex=${k}></th>",
					"{@else if it.type==\"common\"}", "<th style=\"height: 0px;font-size:0;",
					" width: ${it.width==null?100:it.width}px;\" ", "field=\"${it.dataField}\" ",
					"sort=\"${it.sortable==null?\"true\":it.sortable}\" ", " collindex=${k}></th>", "{@/if}",
					"{@/each}", "<th style=\"height: 0px;font-size:0; width: 1000px;\"></th>", "</tr>",
					"$${multipleHeaderRowtpl}", "</tbody>", "</table>", "</div>", "</div>" ].join ( " " );

				me.multipleHeaderRowtpl =
					[ "<tr>", "{@each rows as it, k}", "{@if it.type == \"common\"}", "<td collindex=${it.collindex} ",
						"align=\"${it.align==null?\"left\":it.align}\" ",
						"colspan=\"${it.colspan == null? \"1\" : it.colspan}\" ",
						"rowspan=\"${it.rowspan == null?\"1\":it.rowspan}\">",
						"<div class=\"headerinner\" menu=\"${it.isLastRow}\" menushow=\"false\">",
						"<span class=\"headercell\" onselectstart=\"return false\" ",
						" style=\"text-align:${it.align==null?\"left\":it.align}\">",
						"${it.header?it.header:\"\"}&nbsp;</span>", "{@if it.isLastRow}",
						"<div class=\"headertrigger\"></div>", "{@/if}", "</div>",
						"<div class=\"headerresizer\" style=\"height:${it.height}\"></div>", "</td>",
						"{@else if it.type==\"checkbox\"}", "<td collindex=${it.collindex} align=\"center\"",
						"colspan=\"${it.colspan == null? \"1\" : it.colspan}\" ",
						"rowspan=\"${it.rowspan == null?\"1\":it.rowspan}\" >",
						"<div class=\"headerinner\" style=\"padding-top:6px;\" ", " menu=\"false\" menushow=\"false\">",
						"<img class=\"common uncheck\" src=\"", FAPUI.BLANK_IMG, "\">", "</div>",
						"<div class=\"headerresizer\" ", "style=\"top:-1px;height:${it.height}\">&nbsp;</div>", "</td>",
						"{@/if}", "{@/each}", "</tr>" ].join ( " " );

				this.gridbodytpl = [ "<div class=\"grid-body\" id=$${gridBodyId} style=\"width:100%\">",
					"<table class=\"grid-body-table\" border=\"0\" cellpadding=\"0\" ",
					"cellspacing=\"0\" style=\"width:100%\">", "<tbody>", "<tr style=\"height:1px\"></tr>", "</tbody>",
					"</table>", "</div>" ].join ( " " );
				this.thtpl = [ "<tr style=\"height: 1px;\">", "{@each columns as it, k}", "{@if it.type!==\"common\"}",
					"<th style=\"height: 0px;font-size:0; width: ${it.width};\" ", "collindex=${k}></th>",
					"{@else if it.type==\"common\"}", "<th style=\"height: 0px;font-size:0; width: ${it.width};\" ",
					"collindex=${k}></th>", "{@/if}", "{@/each}", "</tr>" ].join ( " " );
				this.collapsetpl = [ "<tr type=\"collapse\"><td colspan=\"${colsize}\"",
					"style=\"height:80px;\"><div style=\"height:100%;",
					"background-color: #FFF1CC;\">${d ata}</div></td></tr>" ].join ( " " );
				this.gridmasktpl = [ "<div class=\"grid-loading-container\" ", "style=\"z-index:9999;\">",
					"<a href=\"javascript:void(0);\"><img class=\"load\" src=\"", FAPUI.BLANK_IMG, "\"/></a>",
					"</div>" ].join ( " " );
				juicer.set ( "cache", true );
				juicer.set ( "errorhandling", false );
				juicer.set ( "strip", true );
				juicer.set ( "detection", false );

				$ ( this.columns ).each ( function () {//如果有动作列那么不进行智能渲染
					var that = this;

					if ( that.handler ) {
						me.smartRender = false;
						return false;
					}
				} );
			},

			/**
			 * 渲染组件至目标容器
			 * @private
			 * @param {Object} el 目标容器
			 */
			render : function ( el ) {
				this.callParent ( [ el ] );
			},

			/**
			 * 注册列自定义函数
			 * @private
			 */
			_beforeRender : function () {
				var me = this;

				me.aRender = [];
				/**
				 *
				 * @param {Object} rowdata
				 * @param {Object} rowindex
				 * @param {Object} colindex
				 * @param {Object} value
				 * @returns {*}
				 */
				var handler = function ( rowdata, rowindex, colindex, value ) {
					return value;
				};

				$ ( me.columns ).each ( function ( i ) {
					var that = this;

					//对隐藏列不注册自定义函数
					that.colname = FAPUI.getId ( "colname" );
					that.renderField = that.renderField || that.dataField;
					if ( ! that.render ) {
						that.render = handler;

					}
					if ( ! that.titleFun ) {
						that.titleFun = handler;

					}
					var render = eval ( that.render );
					var titleFun = eval ( that.titleFun );

					juicer.register ( that.colname, render );
					juicer.register ( that.colname + "_title", titleFun );
					me.aRender.push ( render );
				} );
			},

			/**
			 * 创建一行数据模板
			 * @private
			 * @return {string} row 一行数据的模板
			 */
			_concatTpl : function () {
				var me = this;
				var row = "<tr class=\"${rowindex%2==1?\"odd_bg\":\"\"}\" rowindex=${rowindex} style=\"height:" +
						  me.rowHeight + "px;\">";

				$ ( me.columns ).each ( function ( i ) {
					var that = this;
					row += me._getTdTpl ( that, i );

				} );
				row += "</tr>";

				return row;

			},

			/**
			 * 获取td的模板
			 * @param i
			 * @private
			 */
			_getTdTpl : function ( that, i ) {
				var me = this;
				var titleDesc = "";
				var row;

				if ( that.type === "collapse" ) {
					var fd = that.renderField == null ? that.dataField : that.renderField;

					row = "<td align=\"center\" type=\"" + that.type + "\" " + "collindex=\"" + i + "\" field=\"" + fd +
						  "\"><img class=\"common collapse\" src=\"" + FAPUI.BLANK_IMG + "\"></td>";
				} else if ( that.type === "checkbox" ) {
					row = "<td align=\"center\" type=\"" + that.type + "\"" + " collindex=\"" + i + "\">" +
						  "<img class=\"common ${data.check?\"uncheck check\":\"uncheck\"}\" src=\"" + FAPUI.BLANK_IMG +
						  "\"></td>";
				} else if ( that.type === "rowIndex" ) {
					if ( that.title ) {
						titleDesc = "${data._gridRowIndex+1}";
					}
					row =
						"<td align=\"center\" type=\"" + that.type + "\" title=\"" + titleDesc + "\" collindex=\"" + i +
						"\" field=\"_gridRowIndex\">${data._gridRowIndex+1}</td>";
				} else {
					var align = that.dataAlign || that.align || me.align || "";
					var fd = that.renderField === null ? that.dataField : that.renderField;

					if ( fd === null ) {
						fd = "";
					}
					var onselectstart = that.onselectstart || me.onselectstart;

					if ( that.title ) {
						titleDesc = "$${data|" + that.colname + "_title,rowindex," + i + ",data[\"" + fd + "\"]}";
					}

					row = "<td onselectstart=\"return " + onselectstart + "\" align=\"" + align + "\" type=\"" +
						  that.type + "\" collindex=\"" + i + "\" title=\"" + titleDesc + "\" field=\"" + fd +
						  "\"><div class=\"bodycell\">$${data|" + that.colname + ",rowindex," + i + ",data[\"" + fd +
						  "\"]}&nbsp;</div></td>";
				}
				return row;
			},

			/**
			 * @private
			 */
			initContentEvent : function () {
				var me = this;

				var contentEl = me.contentEl;//panel中的

				me.gridHead = $ ( "#" + me.gridHeadId );
				me.gridBody = $ ( "#" + me.gridBodyId );
				contentEl.addClass ( "panel-noscroll" );
				me._bindHeadEvent ();//绑定表头事件
				me._bindBodyEvent ();
				//如果允许拖拽行
				if ( me.dragChange && ! me.dragSort ) {
					me.floatDivObj = $ ( "#" + me.dragDivId );
					me._dragChangeEvent ();
				}
				if ( ! me.dragChange && me.dragSort ) {
					me.floatDivObj = $ ( "#" + me.dragDivId );
					me._dragSortEvent ();
				}
				if ( me.dragChange && me.dragSort ) {
					me.floatDivObj = $ ( "#" + me.dragDivId );

					me._dragSortEvent ();

				}
				var headtmp = me.gridHead;

				if ( me.smartRender ) {//如果智能渲染,绑定滚动条事件
					var task = new FAPUI.DelayedTask ( me._smartRenderFn, me );

					me.gridBody.scroll ( function () {
						headtmp[ 0 ].scrollLeft = this.scrollLeft;

						if ( me._pageDataSize > me.smartRenderSize ) {
							task.delay ( 200 );
						}
					} );
				} else {
					me.gridBody.scroll ( function () {
						var a = headtmp;

						headtmp[ 0 ].scrollLeft = this.scrollLeft;
						var b = headtmp;
						var t = me.gridBody;
					} );
				}
				if ( me.pagingBar ) {
					me._pagingBar.bindEvent ();
				}
				var cfg = {};

				cfg.columns = me.columns;
				var thtemp = juicer ( me.thtpl, cfg );
				var dataEl = me.gridBody.find ( "tbody" );

				dataEl.html ( thtemp );
			}, /**
			 * @access private
			 * 给动作列绑定事件
			 */
			_bindCustactioncolumnEvent : function () {
				var me = this;

				$ ( me.columns ).each ( function ( i ) {
					var that = this;

					if ( that.actionRe ) {
						me.gridBody.find ( "." + that.actionRe ).click ( function ( event ) {
							var target = event.srcElement;

							target = $ ( target ).parent ().parent ();

							if ( that.handler ) {
								var rowindex = target.parent ().attr ( "rowindex" );
								var rowdata = me._getSelectRow ( rowindex );
								var collindex = target.attr ( "collindex" );
								var dataField = me.columns[ collindex ].dataField;
								var renderField = me.columns[ collindex ].renderField || dataField;

								that.handler.call ( that, me, rowindex, collindex, dataField, renderField,
													rowdata[ dataField ], rowdata[ renderField ], event );
								event.stopPropagation ();
							} else {
								me._cellClick ( target, event );
							}
						} ).css ( "cursor", "pointer" );
					}
					;
				} );
			}, /**
			 * 初始化内容布局
			 * @private
			 */
			createContentDom : function () {
				var me = this;

				var html = [];
				var cfg = {};
				var widthSum = 0;

				$ ( me.columns ).each ( function () {
					var width;

					if ( this.hide ) {
						width = this.width || 100;
					}
					if ( this.type === "common" ) {
						width = this.width || 100;
					} else {
						width = this.width || 30;
					}
					if ( FAPUI.isNumber ( width ) ) {
						this.width = width + "px";
					} else {
						me._moveAble = false;
					}

				} );
				cfg.columns = me.columns;
				var EL = "<div class=\"grid-container\">";

				if ( me.border && me.title || ! me.border ) {

					EL = "<div class=\"grid-container\" style=\"border-top-width:0\">";
				}
				html.push ( EL );
				me.gridHeadId = me.gridHeadId || FAPUI.getId ();
				cfg.gridHeadId = me.gridHeadId;
				var headtmp = "";

				if ( me.multipleHeaderCfg === null ) {
					headtmp = juicer ( me.girdheadtpl, cfg );
				} else {
					var columnSize = me.columns.length;
					var rowSize = me.multipleHeaderCfg.length;
					var multipleHeaderCfg = me.multipleHeaderCfg;

					$.each ( multipleHeaderCfg, function ( i ) {
						var that = this;
						var curcolcount = 0;

						$.each ( that, function ( ) {
							var the = this;

							the.type = the.type || "common";
							if ( the.type !== "common" ) {
								the.colspan = 1;
								the.rowspan = rowSize;
							}
							curcolcount = curcolcount + the.colspan;
						} );
						var columnIndex = columnSize - curcolcount - 1;

						$.each ( that, function ( ) {
							var the = this;

							the.collindex = columnIndex + the.colspan;
							columnIndex = the.collindex;
							the.height = the.rowspan * 25 + "px";
							if ( i + the.rowspan === rowSize ) {
								the.isLastRow = true;
							} else {
								the.isLastRow = false;
							}
						} );

					} );
					var multipleHeaderRowtpl = "";
					var mhrcfg = {};

					$.each ( multipleHeaderCfg, function ( i ) {
						mhrcfg.rows = this;

						multipleHeaderRowtpl = multipleHeaderRowtpl + juicer ( me.multipleHeaderRowtpl, mhrcfg );
					} );

					cfg.multipleHeaderRowtpl = multipleHeaderRowtpl;
					headtmp = juicer ( me.multipleHeadertpl, cfg );
				}
				html.push ( headtmp );

				me.gridBodyId = me.gridBodyId || FAPUI.getId ();
				cfg.gridBodyId = me.gridBodyId;
				var bodytemp = juicer ( me.gridbodytpl, cfg );

				html.push ( bodytemp );

				if ( me.pagingBar ) {
					me.pagingbarCfg = me.pagingbarCfg || {};

					FAPUI.applyIf ( me.pagingbarCfg, {
						store : me.store
					} );
					me._pagingBar = new FAPUI.PagingBar ( me.pagingbarCfg );
					html.push ( me._pagingBar.createDom () );
				}
				if ( me.dragChange || me.dragSort ) {
					me.dragDivId = FAPUI.getId ();
					var title = "";

					if ( me.dragChange ) {
						title = "切换到...";
					}
					if ( me.dragSort ) {
						title = "移动到...";
					}
					html.push ( "<div id=\"" + me.dragDivId + "\" " + "class=\"grid-drag-div\">" + title + "</div>" );
				}
				html.push ( "</div>" );
				return html.join ( "" );
			},

			/**
			 * @access private
			 * 刷新页面后写数据行
			 * @param {Object}datas
			 * @param {number} start
			 * @param {number} end
			 */
			_writeDataFirst : function ( datas, start, end ) {
				var me = this;

				start = start < 0 ? 0 : start;
				var dataEl = me.gridBody.find ( "tbody" );
				var data = datas.slice ( start, end );
				var html = "";

				me.bottomElId = me.bottomElId || FAPUI.getId ();
				me.topElId = me.topElId || FAPUI.getId ();
				if ( FAPUI.isIE6 () ) {
					html = me._writeHtmlIE6 ( data, start );
				} else {
					html = me._writeHtml ( data, start );
				}
				dataEl.html ( html );
				me._rowHoverEvent ();
				me._bindCustactioncolumnEvent ();

				me.bottomEl = $ ( "#" + me.bottomElId );
				me.topEl = $ ( "#" + me.topElId );

				me.topEl.height ( start * me.rowHeight );
				me.bottomEl.height ( ( me._pageDataSize - end ) * me.rowHeight );
				me._rowstart = start;
				me._rowend = end;

				me._setBodyThWidth ();

				$ ( me.columns ).each ( function ( index ) {
					if ( this.hide) {
						var htable = me.gridHead.find ( "table.grid-header-table" );
						var btable = me.gridBody.find ( "table.grid-body-table" );

						var th = htable.find ( "tr:first" ).children ( "th[collindex=\"" + index + "\"]" );
						var htableInd = htable.find ( "tr:last" ).children ( "td[collindex=\"" + index + "\"]" );
						var tbth = btable.find ( "tr:first" ).children ( "th[collindex=\"" + index + "\"]" );
						var tbtd = btable.find ( "tr[rowindex]" ).children ( "td[collindex=\"" + index + "\"]" );

						me._headWidth[ "headth" + index ] = th.width ();
						me._headWidth[ "bodyth" + index ] = tbth.width ();

						htableInd.hide ();
						th.hide ();
						tbth.hide ();
						tbtd.hide ();

					}
				} );
				me.gridBody[ 0 ].scrollLeft = me.gridHead[ 0 ].scrollLeft;
			},

			/**
			 * 智能渲染所执行的函数
			 * @private
			 */
			_smartRenderFn : function () {
				var me = this;

				var start = Math.ceil ( me.gridBody.scrollTop () / me.rowHeight ) - me.cacheSize;

				start = start < 0 ? 0 : start;
				var end = start + me.pageCount + me.cacheSize + me.addCount;

				if ( end > me._pageDataSize ) {
					end = me._pageDataSize;
					start = end - me.pageCount - me.cacheSize;
				}
				me._writeData ( me.store.data, start, end );
			},

	/**
			 * @private
			 */
			computerSize : function () {
				var me = this;

				this.callParent ();
				var heightSum = me.contentEl.innerHeight () - me.gridHead.outerHeight ();

				if ( me.pagingBar ) {
					heightSum = heightSum - me._pagingBar.el.outerHeight ();
				}
				me.gridBody.css ( "height", heightSum );
			}, /**
			 * @access private
			 * 智能渲染数据行
			 * @param {Object}datas
			 * @param {number}start
			 * @param {number}end
			 * @returns {boolean}
			 */
			_writeData : function ( datas, start, end ) {
				var me = this;

				var rowindexFirst = me._rowstart;
				var rowindexEnd = me._rowend;

				if ( start === rowindexFirst ) {

					return false;
				}
				var rowHeight = me.rowHeight;
				var bottomEl = me.bottomEl;
				var topEl = me.topEl;

				topEl.height ( start * rowHeight );
				bottomEl.height ( ( me._pageDataSize - end ) * rowHeight );
				if ( start < rowindexFirst && end > rowindexFirst ) {
					var aeds = $ ( this.gridBody.find ( "tr[rowindex]" ).filter ( function ( index ) {
						var me = this;
						var rowindex = $ ( this ).attr ( "rowindex" );

						return rowindex > end || rowindex === end;

					} ) );

					me._showData ( start, aeds );
					topEl.after ( aeds );
				} else if ( start > rowindexFirst && start < rowindexEnd ) {
					var bsds = $ ( this.gridBody.find ( "tr[rowindex]" ).filter ( function ( index ) {
						var me = this;

						var rowindex = $ ( this ).attr ( "rowindex" );

						return start > rowindex;
					} ) );

					rowindexEnd = parseInt ( rowindexEnd );
					me._showData ( rowindexEnd, bsds );
					bottomEl.before ( bsds );
				} else {
					var trs = $ ( this.gridBody.find ( "tr[rowindex]" ) );

					me._showData ( start, trs );
				}
				me._rowstart = start;
				me._rowend = end;
			},

			/**
			 * @access private
			 * 智能渲染的时候,修改移动行里面的数据
			 * @param {number}pos
			 * @param {Object}data
			 */
			_showData : function ( pos, data ) {
				var me = this;

				data.each ( function ( i ) {
					var $me = $ ( this );

					$me.attr ( "rowindex", i + pos );
					if ( me._selected && me._selected._rowindex === $me.attr ( "rowindex" ) ) {
						$me.addClass ( "rowselected" );
					} else {
						$me.removeClass ( "rowselected" );
					}
					var item = me.store.data[ i + pos ];

					if ( ! item ) {
						return;
					}

					var tds = $ ( $me ).find ( "td" );

					$ ( tds ).each ( function ( index ) {
						var $me = $ ( this );

						var cell = $me.find ( "div" );
						var colIndex = $me.attr ( "collindex" );

						if ( $me.attr ( "type" ) === "rowIndex" ) {
							var handler = eval ( me.aRender[ colIndex ] );
							var val = item._gridRowIndex + 1;

							if ( $me.attr ( "isAdd" ) ) {
								val = parseInt ( val ) - 1;
							}
							var el = handler && handler.call ( {}, item, i + pos, index, val );

							$me.html ( el );
							$me.attr ( "title", val );
						} else if ( $me.attr ( "type" ) === "checkbox" ) {
							var img = $me.find ( "img" );
							var val = item.check || false;

							if ( val ) {
								img.addClass ( "check" );
							} else {
								img.removeClass ( "check" );
							}
						} else {
							var handler = eval ( me.columns[ colIndex ].render );
							var val = item[ $me.attr ( "field" ) ] || "";
							var el = handler && handler.call ( {}, item, i + pos, index, val );

							cell.html ( el );
							var titleFun = eval ( me.columns[ colIndex ].titleFun );
							var title = titleFun && titleFun.call ( {}, item, i + pos, index, val );

							$me.attr ( "title", title );
						}
					} );
				} );
			}, /**
			 * @access private
			 */
			_writeHtmlIE6 : function ( data, start ) {
				var me = this;

				var cfg = {};
				var rowHtml = [];

				cfg.columns = me.columns;
				var thtemp = juicer ( me.thtpl, cfg );

				rowHtml.push ( thtemp );
				rowHtml.push ( "<tr itemid=\"top\" id=\"" + me.topElId + "\"></tr>" );
				me.rowtpl = me._concatTpl ();
				var storeCfg = {};

				$ ( data ).each ( function ( i ) {
					storeCfg.rowindex = start + i;
					storeCfg.data = this;
					var rowtemp = juicer ( me.rowtpl, storeCfg );

					rowHtml.push ( rowtemp );
				} );
				rowHtml.push ( "<tr itemid=\"bottom\" id=\"" + me.bottomElId + "\"></tr>" );
				return rowHtml.join ( "" );
			}, /**
			 * @access private
			 */
			_writeHtml : function ( data, start ) {
				var me = this;

				var cfg = {};

				cfg.columns = me.columns;
				var rowHtml = juicer ( me.thtpl, cfg );

				rowHtml += "<tr itemid=\"top\" id=\"" + me.topElId + "\"></tr>";
				me.rowtpl = me._concatTpl ();
				var storeCfg = {};

				$ ( data ).each ( function ( i ) {
					storeCfg.rowindex = start + i;
					storeCfg.data = this;
					var rowtemp = juicer ( me.rowtpl, storeCfg );

					rowHtml += rowtemp;
				} );
				rowHtml += "<tr itemid=\"bottom\" id=\"" + me.bottomElId + "\"></tr>";
				return rowHtml;
			},

			/**
			 * hover事件
			 * @private
			 */
			_rowHoverEvent : function () {
				var me = this;

				if ( me.hoverFlag ) {
					me.gridBody.find ( "tr[rowindex]" ).hover ( function () {
						$ ( this ).addClass ( "rowhover" );
					}, function () {
						$ ( this ).removeClass ( "rowhover" );
					} );
				}
			},

			/**
			 * @access private
			 * 根据rowindex获取rowdata
			 * @param {number} rowindex
			 * @returns {Object} rowdata
			 */
			_getSelectRow : function ( rowindex ) {
				var me = this;

				return me.store.data[ rowindex ];
			}, /**
			 * @access private
			 * 绑定表体事件
			 *
			 */
			_bindBodyEvent : function () {
				var me = this;

				me.gridBody.bind ( {
					/**
					 *
					 * @param {Object} event
					 */
					"click" : function ( event ) {
						//如果有mousedown事件，则mousedown事件优先级高
						var target = $ ( event.target );//事件源

						if ( target.is ( "tr" ) || target.is ( "td" ) || target.parent ().is ( "td" ) ) {
							//如果事件源是tr,td或者事件源的父节点为td则触发事件
							$ ( ".rowselected", me.gridBody ).removeClass ( "rowselected" );
							var rowclick = true;

							if ( target.parent ().is ( "td" ) ) {
								target = target.parent ();
							}
							target.parent ().addClass ( "rowselected" );
							var rowindex = target.parent ().attr ( "rowindex" );

							if ( ! rowindex ) {
								return;
							}
							me._selected = me._getSelectRow ( rowindex );
							me._selected._rowindex = rowindex;
							rowclick = me._cellClick ( target, event );
							if ( rowclick !== false ) {
								me.fireEvent ( "rowclick", me, rowindex, me._selected );
							}
						}
						event.stopPropagation ();
					}, /**
					 *
					 * @param {Object} event
					 */
					"dblclick" : function ( event ) {
						var target = $ ( event.target );//事件源
						var trtarget;
						var tdtarget;
						//如果事件源是tr,td或者事件源的父节点为td则触发事件
						if ( target.is ( "td" ) || target.parent ().is ( "td" ) ) {
							if ( target.is ( "td" ) ) {
								trtarget = target.parent ();
								tdtarget = target;
							} else if ( target.parent ().is ( "td" ) ) {
								trtarget = target.parent ().parent ();
								tdtarget = target.parent ();
							}

							$ ( ".rowselected", me.gridBody ).removeClass ( "rowselected" );
							trtarget.addClass ( "rowselected" );
							var rowindex = trtarget.attr ( "rowindex" );

							me._selected = me._getSelectRow ( rowindex );
							var cellindex = tdtarget.attr ( "collindex" );
							var columnCfg = me.columns[ cellindex ];

							me.fireEvent ( "dbrowclick", me, rowindex, me._selected );
							event.stopPropagation ();
						}
					}
				} );
			},

			/**
			 * @private
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

					result = me.fireEvent ( "cellclick", me, rowindex, collindex, dataField, renderField,
											rowdata[ dataField ], rowdata[ renderField ], event );
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
			},

			/**
			 * @access private
			 * 表头的拖拉事件
			 */
			_headResize : function () {
				var isIe = $.browser.msie;

				var me = this;

				var ss = me.gridHead.find ( "td" );

				ss.each ( function () {
					var o = $ ( this );

					var nr = new FAPUI.Resize ( {
						el : o, createHandler : false, listeners : {
							/**
							 *
							 * @param {Object} c
							 * @param {Object} e
							 * @param {Object} f
							 */
							resize : function ( c, e, f ) {
								var collindex = o.attr ( "collindex" );
								var headth = me.gridHead.find ( "th[collindex=" + collindex + "]" );
								var bodyth = me.gridBody.find ( "th[collindex=" + collindex + "]" );
								var cha = f.w - e.w;
								var width = headth.width () + cha + 1;

								headth.width ( width + 1 );//IE中f的值比原来的值小1
								bodyth.width ( width + 1 );

								me._headWidth[ "headth" + collindex ] = width + 1;
								me._headWidth[ "bodyth" + collindex ] = width + 1;
								//重新设置columns中对应项的width属性
								me.columns[ collindex ].width = width + 1 + "px";
								var tObj = me.columns[ collindex ];

								if ( tObj.editor ) {
									if ( tObj.editor.el ) {
										//textarea特殊处理
										if ( tObj.editor.ctype === "textarea" ) {
											if ( isIe ) {
												tObj.editor.setWidth ( width + 6 );
											} else {
												tObj.editor.setWidth ( width + 4 );
											}
										} else {
											tObj.editor.setWidth ( width + 1 );
										}
									}
								}
								me.gridHead[ 0 ].scrollLeft = me.gridBody[ 0 ].scrollLeft;
							}
						}, //
						/**
						 * 重写stop函数
						 * @param {Object} event
						 */
						stop : function ( event ) {
							if ( this.proxy ) {
								this.proxy.hide ();
							}
							this.fireEvent ( "resize", this, this._initPosition, this._finalPosition );
							$ ( document ).unbind ( "mousemove", this._fR );
							$ ( document ).unbind ( "mouseup", this._fS );
							if ( $.browser.msie ) {
								this.el.unbind ( "losecapture", this._fE );
								this.el.get ( 0 ).releaseCapture ();
							} else {
								$ ( window ).unbind ( "blur", this._fE );
							}

							event.stopPropagation ();
							me._resizeFlag = true;//是否调整表头大小的标志
							me.store.sort ( me.gridHead.find ( "th[collindex=" + o.attr ( "collindex" ) +
															   "] " ).attr ( "field" ), "asc" );
						}

					} );

					nr.set ( o.find ( "div.headerresizer" ), "right" );
				} );
			},

			/**
			 * @access private
			 * 表头的check框事件
			 */
			_headCheckEvent : function ( target, event ) {
				var me = this;

				var img = target;
				var data = me.store.data;

				if ( img.hasClass ( "check" ) ) {
					img.removeClass ( "check" );

					$ ( data ).each ( function () {
						this.check = false;
					} );
					me.gridBody.find ( "td[type=\"checkbox\"]>img" ).each ( function () {
						$ ( this ).removeClass ( "check" );
					} );
				} else {
					img.addClass ( "check" );

					$ ( data ).each ( function () {
						this.check = true;
					} );
					me.gridBody.find ( "td[type=\"checkbox\"]>img" ).each ( function () {
						$ ( this ).addClass ( "check" );
					} );
				}
				event.stopPropagation ();
			},

			/**
			 * 表头菜单按钮事件
			 * @private
			 */
			_headertriggerEvent : function ( target, event ) {
				var me = this;

				var collindex = target.parent ().parent ().attr ( "collindex" );
				var targetTH = me.gridHead.find ( "th[collindex=" + collindex + "]" );

				var m = $ ( this ).attr ( "menu" );
				var s = ( targetTH.attr ( "sort" ) === "true" ) && ( targetTH.attr ( "field" ) !== "undefined" );

				if ( m === "false" ) {
					return;
				}
				var pos = target.offset ();

				pos.top = pos.top + 26;
				target.parent ().attr ( "menushow", "true" );
				target.parent ().siblings ().attr ( "menushow", "false" );
				var comp = target.parent ().find ( "span.headercell" );

				me._createMenu ( comp, pos, s );
				event.stopPropagation ();

			},

			/**
			 * 表头中间区域事件,点击后升序或者降序排列
			 * @private
			 */
			_headerinnerEvent : function ( target, event ) {
				var me = this;

				var collindex = target.parent ().attr ( "collindex" );
				var targetTH = me.gridHead.find ( "th[collindex=" + collindex + "]" );

				if ( targetTH.attr ( "sort" ) === "false" || targetTH.attr ( "field" ) === "undefined" ) {
					return;
				}
				target.parent ().addClass ( "hover" );
				target.parent ().siblings ().removeClass ( "hover" );
				var headercell = target.find ( "span.headercell" );

				if ( headercell.hasClass ( "sort-desc" ) ) {
					me.gridHead.find ( "span.headercell" ).removeClass ( "sort-desc" );
					me.gridHead.find ( "span.headercell" ).removeClass ( "sort-asc" );
					headercell.addClass ( "sort-asc" );
					me.store.sort ( targetTH.attr ( "field" ), "asc" );
				} else {
					me.gridHead.find ( "span.headercell" ).removeClass ( "sort-desc" );
					me.gridHead.find ( "span.headercell" ).removeClass ( "sort-asc" );
					headercell.addClass ( "sort-desc" );
					me.store.sort ( targetTH.attr ( "field" ), "desc" );
				}
				event.stopPropagation ();
			}, /**
			 * @access private
			 * 绑定表头事件
			 *
			 */
			_bindHeadEvent : function () {
				var me = this;

				if ( me._moveAble ) {
					me._headResize ();
				}
				me.gridHead.click ( function ( event ) {
					if ( me._resizeFlag ) {
						me._resizeFlag = false;
						return;
					}

					var target = $ ( event.target );//事件源

					if ( target.is ( "img" ) ) {
						me._headCheckEvent ( target, event );
					} else if ( target.is ( "div.headertrigger" ) ) {
						me._headertriggerEvent ( target, event );
					} else if ( target.is ( "div.headerinner" ) ) {
						me._headerinnerEvent ( target, event );
					} else if ( target.is ( "span.headercell" ) ) {
						target = target.parent ();
						me._headerinnerEvent ( target, event );
					}
				} );

				me.gridHead.find ( "div.headerinner" ).hover ( function () {
					if ( $ ( this ).attr ( "menu" ) === "true" ) {
						$ ( this ).find ( "div.headertrigger" ).show ();
					}

					$ ( this ).parent ().addClass ( "hover" );
				}, function () {
					var flag = ( $ ( this ).find ( "span.headercell" ).hasClass ( "sort-asc" ) ) ||
							   ( $ ( this ).find ( "span.headercell" ).hasClass ( "sort-desc" ) );

					if ( $ ( this ).attr ( "menushow" ) === "false" ) {
						$ ( this ).find ( "div.headertrigger" ).hide ();
					}4
					if ( ! flag ) {
						$ ( this ).parent ().removeClass ( "hover" );
					}
				} );
				/**
				 *
				 * @param {Object} event
				 */
				me.docMousedownFun = function ( event ) {
					var target = $ ( event.target );

					if ( target.is ( "div.headertrigger,span,img,li" ) ) {
						return;
					}
					if ( me.gridHead ) {
						me.gridHead.find ( "div.headerinner" ).find ( "div.headertrigger" ).hide ();
						me.gridHead.find ( "div.headerinner" ).attr ( "menushow", "false" );
					}
				};

				//关闭菜单handle
				$ ( document ).bind ( "mousedown", me.docMousedownFun );
			},

			/**
			 * @private
			 */
			_createMenu : function ( comp, pos, s ) {
				var me = this;

				if ( ! me.popMenu ) {
					var opt = {
						items : [ {
							text : "升序", icons : "icon-sort-asc", itemid : "sort-asc", /**
							 *
							 * @param {Object} a
							 * @param {Object} b
							 * @param {Object} c
							 * @param {Object} d
							 * @param {Object} e
							 */
							handler : function ( a, b, c, d, e ) {
								me.gridHead.find ( "span.headercell" ).removeClass ( "sort-asc" );
								me.gridHead.find ( "span.headercell" ).removeClass ( "sort-desc" );
								var collindex = a.comp.parent ().parent ().attr ( "collindex" );
								var targetTH = me.gridHead.find ( "th[collindex=" + collindex + "]" );

								me.store.sort ( targetTH.attr ( "field" ), "asc" );
								a.comp.addClass ( "sort-asc" );
								me.gridHead.find ( "div.headerinner" ).find ( "div.headertrigger" ).hide ();
								me.gridHead.find ( "div.headerinner" ).attr ( "menushow", "false" );
							}
						}, {
							text : "降序", icons : "icon-sort-desc", itemid : "sort-desc", /**
							 *
							 * @param {Object} a
							 * @param {Object} b
							 * @param {Object} c
							 * @param {Object} d
							 * @param {Object} e
							 */
							handler : function ( a, b, c, d, e ) {
								me.gridHead.find ( "span.headercell" ).removeClass ( "sort-asc" );
								me.gridHead.find ( "span.headercell" ).removeClass ( "sort-desc" );
								a.comp.addClass ( "sort-desc" );
								var collindex = a.comp.parent ().parent ().attr ( "collindex" );
								var targetTH = me.gridHead.find ( "th[collindex=" + collindex + "]" );

								me.store.sort ( targetTH.attr ( "field" ), "desc" );
								me.gridHead.find ( "div.headerinner" ).find ( "div.headertrigger" ).hide ();
								me.gridHead.find ( "div.headerinner" ).attr ( "menushow", "false" );
							}
						} ], listeners : {
							/**
							 *
							 * @param {Object} menu
							 * @param {Object} item
							 * @param {Object} text
							 * @param {Object} id
							 * @param {Object} event
							 */
							"itemchecked" : function ( menu, item, text, id, event ) {
								me.showColumn ( parseInt ( id ) );
								me._setBodyThWidth ();
							}, /**
							 *
							 * @param {Object} menu
							 * @param {Object} item
							 * @param {Object} text
							 * @param {Object} id
							 * @param {Object} event
							 */
							"itemunchecked" : function ( menu, item, text, id, event ) {
								me.hideColumn ( parseInt ( id ) );
								me._setBodyThWidth ();
							}
						}
					};

					if ( me.multipleHeaderCfg === null ) {
						opt.items = opt.items.concat ( {
							separator : true
						}, {
							text : "列", icons : "icon-columns", itemid : "columns", children : me._createOptions ()
						} );
					}
					me.popMenu = new FAPUI.Menu ( opt );
					me.popMenu.comp = comp;
				}
				if ( s === false ) {
					me.popMenu.disableMenuItem ( [ "sort-asc", "sort-desc" ] );
				} else {
					me.popMenu.enableMenuItem ( [ "sort-asc", "sort-desc" ] );
				}
				me.popMenu.comp = comp;
				me.popMenu.show ( pos.left, pos.top );
			}, /**
			 * @access private
			 */
			_createOptions : function () {
				var me = this;
				var sub = [];

				$ ( me.columns ).each ( function ( i ) {
					var that = this;
					if ( ! that.render ) {
						var opt = {
							checkbox : true,
							text : that.header ? that.header : that.dataField || that.renderField || that.type,
							itemid : String ( i )
						};

						sub.push ( opt );
					}
					if ( that.hide ) {
						var opt = {
							checkbox : false,
							text : that.header ? that.header : that.dataField || that.renderField || that.type,
							itemid : String ( i )
						};

						sub.push ( opt );
					}
				} );
				return sub;
			}, /**
			 * 根据列索引显示已经隐藏的列
			 * @method showColumn
			 * @param {number} index 列索引
			 */
			showColumn : function ( index ) {
				var me = this;

				if ( FAPUI.isNumber ( index ) ) {
					var htable = me.gridHead.find ( "table.grid-header-table" );
					var btable = me.gridBody.find ( "table.grid-body-table" );
					var th = htable.find ( "tr:first" ).children ( "th[collindex=\"" + index + "\"]" );
					var htableInd = htable.find ( "tr:last" ).children ( "td[collindex=\"" + index + "\"]" );

					var tbth = btable.find ( "tr:first" ).children ( "th[collindex=\"" + index + "\"]" );
					var tbtd = btable.find ( "tr[rowindex]" ).children ( "td[collindex=\"" + index + "\"]" );

					htableInd.show ();
					th.show ();
					tbth.show ();
					tbtd.show ();

					if ( FAPUI.isNumber ( me._headWidth[ "headth" + index ] ) ) {
						th.width ( me._headWidth[ "headth" + index ] );
					}
					if ( FAPUI.isNumber ( me._headWidth[ "bodyth" + index ] ) ) {
						tbth.width ( me._headWidth[ "bodyth" + index ] );
					}

					me.gridBody[ 0 ].scrollLeft = me.gridHead[ 0 ].scrollLeft;

				}
			}, /**
			 * 根据列索引要隐藏列
			 * @method hideColumn
			 * @param {number} index 列索引
			 */
			hideColumn : function ( index ) {
				var me = this;

				if ( FAPUI.isNumber ( index ) ) {
					var htable = me.gridHead.find ( "table.grid-header-table" );
					var btable = me.gridBody.find ( "table.grid-body-table" );

					var th = htable.find ( "tr:first" ).children ( "th[collindex=\"" + index + "\"]" );
					var htableInd = htable.find ( "tr:last" ).children ( "td[collindex=\"" + index + "\"]" );
					var tbth = btable.find ( "tr:first" ).children ( "th[collindex=\"" + index + "\"]" );
					var tbtd = btable.find ( "tr[rowindex]" ).children ( "td[collindex=\"" + index + "\"]" );

					htableInd.hide ();
					th.hide ();
					tbth.hide ();
					tbtd.hide ();

					me.gridHead[ 0 ].scrollLeft = me.gridBody[ 0 ].scrollLeft;
				}
			}, /**
			 *加载数据
			 *@method load
			 *@param url {string} 与后台通信的URL
			 *@param params {Object} 传到后台的参数是一个json对象
			 */
			load : function ( url, params ) {
				var me = this;

				me.store.load ( url, params );
			},

			/**
			 *返回checkbox选中状态的数据集
			 *@method getChecked
			 *@return Array
			 */
			getChecked : function () {
				var me = this;

				var datas = [];

				if ( me.store && me.store.data ) {
					$ ( me.store.data ).each ( function () {
						if ( this.check === true ) {
							datas.push ( this );
						}
					} );
				}
				return datas;
			},

			/**
			 * @access private
			 */
			_refreshView : function () {
				var me = this;
				var start = 0;

				me.addCount = 0;
				me._showHeader ();
				var end = me._scrollTopAndGetSize ();

				if ( me.smartRender && end > me.smartRenderSize ) {
					end = me._smartRenderAndGetSize ( start );
				}
				me._destorySelected ();
				me._originalData = {};//初始化源数据
				me._dirtyData = {};//初始化脏数据
				me._writeDataFirst ( me.store.data, start, end );
				me._adjustMsie ();
				me._hideMask ();
			},

			/**
			 * 智能渲染及返回行数
			 * @param {number} start 起始行
			 * @returns {number}
			 * @private
			 */
			_smartRenderAndGetSize : function ( start ) {
				var me = this;

				var rowHeight = me.rowHeight;
				var heightSum = me.contentEl.innerHeight () - me.gridHead.outerHeight ();

				me.pageCount = Math.ceil ( heightSum / rowHeight );
				if ( me.pageCount % 2 !== 0 ) {//如果pageCount不是偶数
					me.pageCount = me.pageCount + 1;
				}
				me.cacheSize = me.cacheSize || me.pageCount;
				//如果设置缓存的条数过大
				if ( me.cacheSize > me._pageDataSize - me.pageCount ) {
					me.cacheSize = me._pageDataSize - me.pageCount;
				}
				return start + me.pageCount + me.cacheSize;
			},

			/**
			 * 滚到顶部并返回行数
			 * @returns {number}
			 * @private
			 */
			_scrollTopAndGetSize : function () {
				var me = this;
				var end = 0;

				if ( me.gridBody ) {
					me.gridBody.scrollTop ( 0 );
					me._pageDataSize = me.store.data.length;//当前页的数据总条数
					end = me._pageDataSize;
				}
				return end;
			},

			/**
			 * 销毁已选中的行
			 * @private
			 */
			_destorySelected : function () {
				var me = this;

				me._selected = null;
				delete me._selected;
			},

			/**
			 * 兼容ie浏览器
			 * @private
			 */
			_adjustMsie : function () {
				var me = this;
				if ( $.browser.msie ) {
					/**
					 * 如果是IE判断是否有竖直滚动条,如果有把gridbody中的table的width属性
					 * 设置为gridBody的width-20
					 */
					var gridbody = me.gridBody;
					var gridbodyTab = me.gridBody.find ( "table" );

					if ( gridbodyTab.height () > gridbody.height () ) {
						gridbodyTab.width ( gridbody.width () - 20 );
					}
				}
			},

			/**
			 * 显示表头
			 * @private
			 */
			_showHeader : function () {
				var me = this;

				var htable = me.gridHead.find ( "table.grid-header-table" );

				htable.find ( "tr:first" ).children ( "th" ).show ();
				htable.find ( "tr:last" ).children ( "td" ).show ();

			},

			/**
			 * 隐藏遮罩
			 * @private
			 */
			_hideMask : function () {
				var me = this;

				try {
					me.mask.hide ();
					me._setHeadThWidth ();
				} catch ( e ) {
					//alert ( e.message );
				}
			},
			/**
			 * 日期转换
			 * @private
			 */
	        format:function (time, format){
			   var t = new Date(time);
			   var tf = function(i){return (i < 10 ? '0' : '') + i};
				  return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a){
				  switch(a){
					 case 'yyyy':
						return tf(t.getFullYear());
						break;
					 case 'MM':
						return tf(t.getMonth() + 1);
						break;
					 case 'mm':
						return tf(t.getMinutes());
						break;
					 case 'dd':
						return tf(t.getDate());
						break;
					 case 'HH':
						return tf(t.getHours());
						break;
					 case 'ss':
						return tf(t.getSeconds());
						break;
					};
				});
			},

			/**
			 * @access private
			 */
			_befroerefresh : function () {
				var me = this;

				if ( me.mask ) {
					me.mask.height ( me.mask.parent ().height () );
					me.mask.width ( me.mask.parent ().width () );
					me.mask.show ();
				} else {
					if ( me.contentEl ) {
						me.mask = $ ( juicer ( me.gridmasktpl, me ) );
						me.mask.appendTo ( me.contentEl.parent () );

						me.mask.height ( me.mask.parent ().height () );
						me.mask.width ( me.mask.parent ().width () );
						me.mask.show ();
					}
				}
			}, /**
			 *
			 * @param {Object} Store
			 * @param {Object} Row
			 * @param {Object} Index
			 * @param {Object} Id
			 * @param {Object} Field
			 * @param {Object} value
			 * @private
			 */
			_updateView : function ( Store, Row, Index, Id, Field, value ) {
				var field = $ ( "table[rowindex=" + Index + "] div[field=" + Field + "]", me.gridBody );
			}, /**
			 *
			 * @private
			 */
			_setHeadThWidth : function () {
				var me = this;

				var gridBo = this.gridBody;
				var gridHd = this.gridHead;

				$ ( "th", gridBo ).each ( function ( i ) {
					var width = $ ( this ).width ();
					var headth = $ ( "th:eq(" + i + ")", gridHd );

					headth.width ( width);
				} );
			},
			/**
			 *
			 * @private
			 */
			_setBodyThWidth : function () {
				var me = this;

				var gridBo = this.gridBody;
				var gridHd = this.gridHead;

				$ ( "th", gridHd ).each ( function ( i ) {
					var width = $ ( this ).width ();
					var bodyth = $ ( "th:eq(" + i + ")", gridBo );

					bodyth.width ( width );
				} );
			}, /**
			 * 设置面板宽度
			 * @method setWidth
			 * @param {number} w
			 */
			setWidth : function ( w ) {
				var me = this;

				var gridHd = this.gridHead;
				var gridBo = this.gridBody;

				this.width = w;
				this.el.width ( w );
				this.doLayout ();
				if ( $.browser.msie ) {
					/**
					 * 如果是IE判断是否有竖直滚动条,
					 * 如果有把gridbody中的table的width属性设置为gridBody的width-20
					 */
					var gridbody = me.gridBody;
					var gridbodyTab = me.gridBody.find ( "table" );

					if ( gridbodyTab.height () > gridbody.height () ) {
						gridbodyTab.width ( gridbody.width () - 20 );
					}
				};
				this._setHeadThWidth ();
				gridBo[ 0 ].scrollLeft = gridHd[ 0 ].scrollLeft;
				this.gridBody.trigger ( "scroll" );
			}, /**
			 * 设置grid的高度
			 * @method setHeight
			 * @param {number} h 高度
			 */
			setHeight : function ( h ) {
				this.height = h;
				this.el.height ( h );
				this.doLayout ();
				this.computerSize ();
			}, /**
			 * @method getSelected 获取行
			 * @return 获取的行对象
			 */
			getSelected : function () {
				var me = this;

				return me._selected;
			}, /**
			 * 添加行
			 * @method addRow
			 * @param {Object} rowObjs 添加的行对象或者是行对象数组
			 */
			addRows : function ( rowObjs ) {
				var me = this;

				var gridTbody = me.gridBody.find ( "table.grid-body-table" ).find ( "tbody" );
				var rowCount;
				var dataObj;
				//获取当前要添加的数据的第一行的rownindex(grid中数据行下标从0开始)
				var rowLastIndex = me.store.data.length;
				var oldLastIndex = rowLastIndex;
				//从第几行开始渲染
				var startIndex = rowLastIndex;
				//获取当前grid表头列信息
				var columns = me.columns;
				/**
				 * 根据列属性解析要添加的数据对象生成行数据dom并添加到tbody中
				 */
				/**
				 * 将添加的行对象或者是行对象数组添加到集合中
				 */
				rowObjs = [].concat ( rowObjs );
				rowCount = rowObjs.length;
				if ( rowCount < 1 ) {
					return;
				}
				for ( var i = 0; i < rowCount; i ++ ) {
					rowObjs[ i ]._gridRowIndex = rowLastIndex + i;
					me.store.data.push ( rowObjs[ i ] );
				}
				rowLastIndex = me.store.data.length;

				var rowHtml = [];
				var storeCfg = {};
                me.rowtpl=me._concatTpl();
				$ ( rowObjs ).each ( function ( i ) {
					dataObj = rowObjs[ i ];
					storeCfg.rowindex = dataObj._gridRowIndex;
					storeCfg.data = this;
					var rowtemp = juicer ( me.rowtpl, storeCfg );

					rowHtml.push ( rowtemp );
				} );
				gridTbody.append ( rowHtml.join ( "" ) );
				me.addCount = me.addCount + rowCount;
			}, /**
			 * 渲染添加的数据
			 * @param {Object} pos
			 * @param {Object} doms
			 */
			showAddData  : function ( pos, doms ) {
				var me = this;

				doms.each ( function ( i ) {
					var $me = $ ( this );

					$me.attr ( "rowindex", i + pos );
					if ( me._selected && me._selected._rowindex === $me.attr ( "rowindex" ) ) {
						$me.addClass ( "rowselected" );
					} else {
						$me.removeClass ( "rowselected" );
					}
					var item = me.store.data[ i + pos ];

					if ( ! item ) {
						return;
					}

					var tds = $ ( $me ).find ( "td" );

					$ ( tds ).each ( function ( index ) {
						var $me = $ ( this );
						var cell = $me.find ( "div" );
						var colIndex = $me.attr ( "collindex" );

						if ( $me.attr ( "type" ) === "rowIndex" ) {
							var handler = eval ( me.aRender[ colIndex ] );
							var val = item._gridRowIndex + 1;
							var el = handler && handler.call ( {}, item, i + pos, index, val );

							$me.html ( el );
							$me.attr ( "title", val );
						} else if ( $me.attr ( "type" ) === "checkbox" ) {
							var img = $me.find ( "img" );
							var val = item.check || false;

							if ( val ) {
								img.addClass ( "check" );
							} else {
								img.removeClass ( "check" );
							}
						} else {
							var handler = eval ( me.columns[ colIndex ].render );
							var val = item[ $me.attr ( "field" ) ] || "";
							var el = handler && handler.call ( {}, item, i + pos, index, val );

							cell.html ( el );
							var titleFun = eval ( me.columns[ colIndex ].titleFun );

							var title = titleFun && titleFun.call ( {}, item, i + pos, index, val );

							$me.attr ( "title", title );
						}
					} );
				} );
			}, /**
			 * @access private
			 * 行拖拽换行
			 * @method
			 *
			 */
			_dragChangeEvent : function () {
				var me = this;

				//控制生成浮动div
				me.gridBody.bind ( {
					/**
					 *
					 * @param {Object} event
					 */
					"mousedown" : function ( event ) {
						me.isMove = false;
						var tgt = $ ( event.target );

						if ( tgt.is ( "td" ) || tgt.is ( "tr" ) || tgt.is ( "div" ) || tgt.parent ().is ( "td" ) ||
							 tgt.parent ().parent ().is ( "td" ) ) {
							if ( tgt.is ( "td" ) ) {
								tgt = tgt.parent ();
							}
							if ( tgt.is ( "div" ) ) {
								tgt = tgt.parent ().parent ();
							}
							me.source = tgt;
							if ( tgt.is ( "tr" ) ) {
								me.floatDivObj.css ( {
									"top" : event.pageY - 50, "left" : event.pageX
								} );
								me.floatDivObj.hide ();
							}
							me.gridBody.bind ( {
								/**
								 *
								 * @param {Object} event
								 */
								"mousemove" : function ( event ) {
									//生成DIV
									var tgt = $ ( event.target );

									if ( tgt.is ( "td" ) || tgt.is ( "tr" ) || tgt.is ( "div" ) ||
										 tgt.parent ().is ( "td" ) || tgt.parent ().parent ().is ( "td" ) ) {
										me.floatDivObj.show ();
										me.isMove = true;
										if ( tgt.is ( "td" ) ) {
											tgt = tgt.parent ();
										}
										if ( tgt.is ( "div" ) ) {
											tgt = tgt.parent ().parent ();
										}
										me.target = tgt;
										if ( tgt.is ( "tr" ) ) {
											me.floatDivObj.css ( {
												"top" : event.pageY - 50, "left" : event.pageX
											} );
										} else {
											me.floatDivObj.hide ();
										}
									}
								}
							} );
						}
					}, /**
					 *
					 * @param {Object} event
					 */
					"mouseup" : function ( event ) {
						var tgt = $ ( event.target );

						me.gridBody.unbind ( "mousemove" );
						me.floatDivObj.hide ();
						if ( tgt.is ( "td" ) || tgt.is ( "tr" ) || tgt.is ( "div" ) ) {
							if ( ! me.isMove ) {
								$ ( ".rowselected", me.gridBody ).removeClass ( "rowselected" );
								var rowclick = true;

								if ( tgt.parent ().is ( "td" ) ) {
									tgt = tgt.parent ();
								}
								tgt.parent ().addClass ( "rowselected" );
								var rowindex = tgt.parent ().attr ( "rowindex" );

								if ( ! rowindex ) {
									return;
								}
								me._selected = me._getSelectRow ( rowindex );
								me._selected._rowindex = rowindex;
								rowclick = me._cellClick ( tgt, event );
								//if ( rowclick !== false ) {
								//	me.fireEvent ( "rowclick", me, rowindex, me._selected );
								//}这样会导致触发mouseup的时候 rowclick触发两次
								me.isMove = false;
								return;
							}

							var sourceIndex = me.source.attr ( "rowindex" );
							var targetIndex = me.target.attr ( "rowindex" );

							var sourceTds = me.source.find ( "td" );
							var targetTds = me.target.find ( "td" );

							//更改data中的数据的顺序
							var dataArray = me.store.data;
							var sourceData = dataArray[ sourceIndex ];
							var targetData = dataArray[ targetIndex ];

							if ( targetIndex === 0 && sourceIndex === 0 ) {
								return;
							}

							if ( ! sourceData || ! targetData ) {
								return;
							}
							sourceData._gridRowIndex = parseInt ( targetIndex );
							targetData._gridRowIndex = parseInt ( sourceIndex );
							if ( targetIndex === 0 ) {
								dataArray.splice ( 0, 1, sourceData );
								dataArray.splice ( sourceIndex, 1, targetData );
							} else if ( sourceIndex === 0 ) {
								dataArray.splice ( 0, 1, targetData );
								dataArray.splice ( targetIndex, 1, sourceData );
							} else {
								dataArray.splice ( sourceIndex, 1, targetData );
								dataArray.splice ( targetIndex, 1, sourceData );
							}

							var sourceTitleTd;
							var targetTtileTd;

							$ ( sourceTds ).each ( function ( index ) {
								var td = $ ( this );

								if ( td.attr ( "type" ) === "rowIndex" ) {
									sourceTitleTd = td;
									return false;
								}
							} );

							$ ( targetTds ).each ( function ( index ) {
								var td = $ ( this );

								if ( td.attr ( "type" ) === "rowIndex" ) {
									targetTtileTd = td;
									return false;
								}
							} );
							if ( sourceTitleTd && targetTtileTd ) {
								var sourceTitle = sourceTitleTd.attr ( "title" );
								var targetTtile = targetTtileTd.attr ( "title" );

								sourceTitleTd.attr ( "title", targetTtile );
								targetTtileTd.attr ( "title", sourceTitle );

								sourceTitleTd.text ( targetTtile );
								targetTtileTd.text ( sourceTitle );
							}

							me.source.attr ( "rowindex", sourceIndex );
							me.target.attr ( "rowindex", targetIndex );

							var sourceHtml = me.source.html ();
							var targetHtml = me.target.html ();

							me.source.html ( targetHtml );
							me.target.html ( sourceHtml );
							me.fireEvent ( "dragChange", sourceIndex, targetIndex, sourceData, targetData, me );
						}
						me.isMove = true;
					}
				} );

			}, /**
			 * @access private
			 * 行拖拽sort
			 * @method
			 */
			_dragSortEvent : function () {
				var me = this;

				//控制生成浮动div
				me.gridBody.bind ( {
					/**
					 *
					 * @param {Object} event
					 */
					"mousedown" : function ( event ) {
						me.isMove = false;
						var tgt = $ ( event.target );

						if ( tgt.is ( "td" ) || tgt.is ( "tr" ) || tgt.is ( "div" ) || tgt.parent ().is ( "td" ) ||
							 tgt.parent ().parent ().is ( "td" ) ) {
							if ( tgt.is ( "td" ) ) {
								tgt = tgt.parent ();
							}
							if ( tgt.is ( "div" ) ) {
								tgt = tgt.parent ().parent ();
							}
							me.source = tgt;
							if ( tgt.is ( "tr" ) ) {
								me.floatDivObj.css ( {
									"top" : event.pageY - 50, "left" : event.pageX
								} );
								me.floatDivObj.hide ();
							}
							me.gridBody.bind ( {
								/**
								 *
								 * @param {Object} event
								 */
								"mousemove" : function ( event ) {
									//生成DIV
									var tgt = $ ( event.target );

									if ( tgt.is ( "td" ) || tgt.is ( "tr" ) || tgt.is ( "div" ) ||
										 tgt.parent ().is ( "td" ) || tgt.parent ().parent ().is ( "td" ) ) {
										me.floatDivObj.show ();
										me.isMove = true;
										if ( tgt.is ( "td" ) ) {
											tgt = tgt.parent ();
										}
										if ( tgt.is ( "div" ) ) {
											tgt = tgt.parent ().parent ();
										}
										me.target = tgt;
										if ( tgt.is ( "tr" ) ) {
											me.floatDivObj.css ( {
												"top" : event.pageY - 50, "left" : event.pageX
											} );
										} else {
											me.floatDivObj.hide ();
										}
									}
								}
							} );
						}
					}, /**
					 *
					 * @param {Object} event
					 */
					"mouseup" : function ( event ) {

						var tgt = $ ( event.target );

						me.gridBody.unbind ( "mousemove" );
						me.floatDivObj.hide ();
						if ( tgt.is ( "td" ) || tgt.is ( "tr" ) || tgt.is ( "div" ) ) {
							if ( ! me.isMove ) {

								$ ( ".rowselected", me.gridBody ).removeClass ( "rowselected" );

								var rowclick = true;

								if ( tgt.parent ().is ( "td" ) ) {
									tgt = tgt.parent ();
								}
								tgt.parent ().addClass ( "rowselected" );
								var rowindex = tgt.parent ().attr ( "rowindex" );

								if ( ! rowindex ) {
									return;
								}
								me._selected = me._getSelectRow ( rowindex );
								me._selected._rowindex = rowindex;
								rowclick = me._cellClick ( tgt, event );
								if ( rowclick !== false ) {
									me.fireEvent ( "rowclick", me, rowindex, me._selected );
								}
								me.isMove = false;
								return;
							}

							//如果sourceIndex > targetIndex 说明当前数据向上移动
							//如果sourceIndex < targetIndex 说明当前数据想下移动
							var sourceIndex = me.source.attr ( "rowindex" );
							var targetIndex = me.target.attr ( "rowindex" );

							if ( ( parseInt ( sourceIndex ) > parseInt ( targetIndex ) ) ||
								 parseInt ( targetIndex ) > parseInt ( sourceIndex ) ) {
								var sIndex = parseInt ( sourceIndex );
								var tIndex = parseInt ( targetIndex );
								//更改data中的数据的顺序
								var dataArray = me.store.data;
								var sourceData = dataArray[ sIndex ];
								var targetData = dataArray[ tIndex ];

								if ( ! sourceData || ! targetData ) {
									return;
								}

								var htmlArray = [];
								var trObj = [];
								var trs = me.gridBody.find ( "tbody" ).find ( "tr" );

								if ( sIndex > tIndex ) {
									var t;
									var rowx = 0;

									//将target和source的内容互相调换
									$ ( trs ).each ( function ( index ) {
										t = $ ( this );
										rowx = parseInt ( t.attr ( "rowindex" ) );
										if ( rowx >= tIndex && rowx <= sIndex ) {
											htmlArray.push ( t.html () );
											trObj.push ( t );
										}
									} );

									var lastHtml = htmlArray[ htmlArray.length - 1 ];

									//将最后一个放置第一个,删除最后一个
									htmlArray.splice ( htmlArray.length - 1, 1 );
									htmlArray.splice ( 0, 0, lastHtml );

									var rowindex = 0;

									for ( var i = 0; i < trObj.length; i ++ ) {
										if ( i === 0 ) {
											trObj[ i ].attr ( "rowindex", tIndex );
										} else {
											trObj[ i ].attr ( "rowindex", tIndex + i );
										}
										trObj[ i ].html ( htmlArray[ i ] );
										rowindex = parseInt ( trObj[ i ].attr ( "rowindex" ) );

										$ ( trObj[ i ].find ( "td" ) ).each ( function ( index ) {
											var td = $ ( this );

											if ( td.attr ( "type" ) === "rowIndex" ) {
												td.attr ( "title", rowindex + 1 );
												td.text ( rowindex + 1 );
												return false;
											}
										} );
									}

									dataArray.splice ( sIndex, 1 );
									dataArray.splice ( tIndex, 0, sourceData );

									for ( var i = 0; i < dataArray.length; i ++ ) {
										dataArray[ i ]._gridRowIndex = i;
									}
								}
								if ( tIndex > sIndex ) {
									var t;
									var rowx = 0;

									//将target和source的内容互相调换
									$ ( trs ).each ( function ( index ) {
										t = $ ( this );
										rowx = parseInt ( t.attr ( "rowindex" ) );
										if ( rowx >= sIndex && rowx <= tIndex ) {
											htmlArray.push ( t.html () );
											trObj.push ( t );
										}
									} );
									var firstHtml = htmlArray[ 0 ];
									//将最后一个放置第一个,删除最后一个
									htmlArray.splice ( 0, 1 );
									htmlArray.push ( firstHtml );
									var rowindex = 0;

									for ( var i = 0; i < trObj.length; i ++ ) {
										if ( i === trObj.length - 1 ) {
											trObj[ i ].attr ( "rowindex", tIndex );
										} else {
											trObj[ i ].attr ( "rowindex", sIndex + i );
										}
										trObj[ i ].html ( htmlArray[ i ] );
										rowindex = parseInt ( trObj[ i ].attr ( "rowindex" ) );

										$ ( trObj[ i ].find ( "td" ) ).each ( function ( index ) {
											var td = $ ( this );

											if ( td.attr ( "type" ) === "rowIndex" ) {
												td.attr ( "title", rowindex + 1 );
												td.text ( rowindex + 1 );
												return false;
											}
										} );
									}

									dataArray.splice ( sIndex, 1 );
									dataArray.splice ( tIndex, 0, sourceData );

									for ( var i = 0; i < dataArray.length; i ++ ) {
										dataArray[ i ]._gridRowIndex = i;
									}
								}
							}
							me.fireEvent ( "dragSort", sIndex, tIndex, sourceData, targetData, me );
						}
						me.isMove = true;
					}
				} );
			}, /**
			 *
			 * 释放组件
			 * @private
			 */
			onDestroy : function () {
				var me = this;

				$ ( document ).unbind ( "mousedown", me.docMousedownFun );
				me.gridHead.remove ();
				delete me.gridHead;
				delete me.gridHeadId;
				me.gridBody.remove ();
				delete me.gridBody;
				delete me.gridBodyId;
				if ( me.pagingBar ) {
					me._pagingBar.destroy ();
					delete me._pagingBar;
				}
				me.callParent ();
			},

			/**
			 * 获得分页工具条
			 * @returns {FAPUI.PagingBar|*}
			 */
			getPagingBar : function(){
				var me = this;

				return me._pagingBar;
			}
		}
	} );
	FAPUI.register ( "grid", FAPUI.Grid );
	return FAPUI.Grid;
} );
