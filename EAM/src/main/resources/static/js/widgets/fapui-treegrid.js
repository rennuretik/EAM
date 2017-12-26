/**
 *树表格组件,如下创建:
 *
 *
 *
 *
 var hoverFlag = FAPUI.isIE6();
 a = new FAPUI.TreeGrid({
			title:"grid1非智能渲染模式的表格",
			renderTo:'ab',
			width:500,
			commitUrl:path+"/store/commit",
			smartRender:false,//智能渲染模式,默认为true。但当有动作列和collapse列时会自动设为false
			hoverFlag:!hoverFlag,
			height:800,
			pagingBar:true,//是否要分页栏,如不需要设置为false
			store:new FAPUI.Store({
				url:path+"/store/storeTest",
				limit:100
			}),
			columns:[{
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
				header:"普通的员工姓名(可编辑下拉框)",
				dataField:"dep",
				renderField:"userName",
				width:100,

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
				"expand":function(a,b,c){
					 alert(b);
				},
				"collapse":function(a,b,c){
					 alert(b);
					 return false;
				}
			}
		});
 *
 *@class FAPUI.TreeGrid
 *@extends FAPUI.Grid
 */
define ( function ( require, exports, module ) {
	var importcss = "./themes/" + FAPUI.getTheme () + "/css/ui-treegrid.css";

	require.async ( importcss );
	require ( "./fapui-grid" );
	FAPUI.define ( "FAPUI.TreeGrid", {
		extend : "FAPUI.Grid", props : {
			/**
			 * 点击下拉图标往后台传输的参数字段
			 *@property idField
			 *@type String
			 */
			idField : "",
			resultField : ""
		},

		override : {
			/**
			 * 初始化方法
			 */
			initConfig : function () {
				var me = this;

				me.smartRender = false;
				me.callParent ();
				me.addEvents ( /**
					 *展开事件
					 *@event expand
					 *@param grid {Grid} grid组件
					 *@param rowIndex {Int} 行索引
					 *@param data {jsondata} 当前点击行的数据
					 *@return {boolean} 如果返回是false则不展开
					 */
					"expand",

					/**
					 *折叠事件
					 *@event expand
					 *@param grid {Grid} grid组件
					 *@param rowIndex {Int} 行索引
					 *@param data {jsondata} 当前点击行的数据
					 *@return {boolean} 如果返回是false则不折叠s
					 */
					"collapse" );
			},
			/**
			 * @access private
			 * 创建一行数据模板
			 * @return {string} row 一行数据的模板
			 */
			_concatTpl : function ( level, leaf ) {
				level = level || 0;
				leaf = leaf || false;
				var me = this;
				var row = "<tr class=\"${rowindex%2==1?\"odd_bg\":\"\"}\" " +
					"rowindex=${rowindex} style=\"height:" + me.rowHeight + "px;\">";

				$ ( me.columns ).each ( function ( i ) {
					var me = this;

					if ( ! me.hide ) {
						var align = me.align === null ? me.align : me.align;
						var fd = me.renderField === null ? me.dataField : me.renderField;

						if ( fd === null ) {
							fd = "";
						}
						if ( me.treeField ) {
							row += "<td onselectstart=\"return false\" " +
								"align=\"left\" type=\"" + me.type + "\" collindex=\"" + i + "\" " +
								"title=\"$${data[\"" +
								fd + "\"]}\" field=\"" + fd + "\"><div class=\"bodycell\">";
							for ( var i = 0; i < level; i ++ ) {
								row += "<span class=\"tree-indent\"></span>";
							}
							if ( leaf ) {
								row += "<span class=\"tree-icon tree-file\"></span><span " +
									"class=\"tree-title\">$${data|" + me.colname + ",rowindex," + i +
									",data[\"" + fd + "\"]==null?\"\":data[\"" + fd + "\"]}" +
									"</span></div></td>";
							} else {
								row += "<span class=\"tree-hit tree-collapsed\"></span><span " +
									"class=\"tree-icon tree-folder\"></span>" +
									"<span class=\"tree-title\">$${data|" + me.colname +
									"rowindex" + i + "data[\"" + fd + "\"]==null?\"\":data[\"" +
									fd + "\"]}</span></div></td>";
							}
						} else {
							row += "<td onselectstart=\"return false\" align=\"" + align +
								"\" type=\"" + me.type + "\" collindex=\"" + i + "\" title=\"$${data[\"" +
								fd + "\"]}\" field=\"" + fd + "\"><div class=\"bodycell\">$${data|" +
								me.colname + "rowindex" + i + "data[\"" + fd + "\"]==null?\"\":data[\"" +
								fd + "\"]}</div></td>";
						}

					}
				} );
				row += "</tr>";
				return row;
			},

			/**
			 * 根据rowindex获取rowdata
			 * @private
			 * @param {number} rowindex
			 * @returns {Object} rowdata
			 */
			_getSelectRow : function ( rowindex ) {
				var me = this;
				var indexs = rowindex.split ( "-" );
				var rowData = me.store;

				for ( var i = 0; i < indexs.length; i ++ ) {
					rowData = rowData.data[ parseInt ( indexs[ i ] ) ];
				}
				return rowData;
			},

			/**
			 * 绑定表体事件
			 * @private
			 */
			_bindBodyEvent : function () {
				var me = this;

				me.callParent ();
				me.gridBody.bind ( {
					/**
					 *
					 * @param {Object} event
					 */
					"click" : function ( event ) {

						var target = $ ( event.target );//事件源

						if ( target.hasClass ( "tree-hit" ) ) {
							var folder = target.next ( ".tree-icon" );
							var tr = target.parent ().parent ().parent ();
							var rowIndex = tr.attr ( "rowindex" );
							var rowData = me._getSelectRow ( rowIndex );

							if ( target.hasClass ( "tree-collapsed" ) ) {
								if ( me.fireEvent ( "expand", me, rowIndex, rowData ) === false ) {
									return;
								}
								target.removeClass ( "tree-collapsed" );
								target.addClass ( "tree-expanded" );
								folder.removeClass ( "tree-folder" );
								folder.addClass ( "tree-folder-open" );
								if ( rowData.data ) {
									var chtrs = $ ( me._renderChildrenTr ( rowData, rowIndex ) );

									if ( me.hoverFlag ) {
										chtrs.hover ( function () {
											$ ( this ).addClass ( "rowhover" );
										}, function () {
											$ ( this ).removeClass ( "rowhover" );
										} );
									}
									tr.after ( chtrs );
									me.gridBody.find ( "tr" ).each ( function ( i ) {
										var tr = $ ( this );

										tr.removeClass ( "odd_bg" );
										if ( i % 2 === 1 ) {
											tr.addClass ( "odd_bg" );
										}
									} );
								} else {
									var url = me.store.url;
									var value = rowData[ me.idField ];
									var param = {};

									param[ me.idField ] = value;

									$.post ( url, param, function ( data ) {
										var fields = [] ;
										if (me.resultField ) {
											if ( me.resultField.indexOf(".") >= 0) {
												fields = me.resultField.split(".");
											} else {
												fields.push(me.resultField);
											}
										}
										if (fields) {
											for (var i = 0; i < fields.length; i++) {
												data = data[fields[i].trim()]
											}
										}
										if ( data.success ) {
											rowData.data = data.results || [];
											var chtrs = $ ( me._renderChildrenTr ( rowData, rowIndex ) );

											if ( me.hoverFlag ) {
												chtrs.hover ( function () {
													$ ( this ).addClass ( "rowhover" );
												}, function () {
													$ ( this ).removeClass ( "rowhover" );
												} );
											}
											tr.after ( chtrs );
											me.gridBody.find ( "tr" ).each ( function ( i ) {
												var tr = $ ( this );

												tr.removeClass ( "odd_bg" );
												if ( i % 2 === 1 ) {
													tr.addClass ( "odd_bg" );
												}
											} );
										}
									} );
								}
							} else {
								if ( me.fireEvent ( "collapse", me, rowIndex, rowData ) === false ) {
									return;
								}
								;
								target.removeClass ( "tree-expanded" );
								target.addClass ( "tree-collapsed" );
								folder.removeClass ( "tree-folder-open" );
								folder.addClass ( "tree-folder" );
								var rowIndex = tr.attr ( "rowindex" );
								var trs = me.gridBody.find ( "tr[rowindex^='" + rowIndex + "-']" );

								trs.remove ();
								me.gridBody.find ( "tr" ).each ( function ( i ) {
									var tr = $ ( this );

									tr.removeClass ( "odd_bg" );
									if ( i % 2 === 1 ) {
										tr.addClass ( "odd_bg" );
									}
								} );
							}
						}
					}
				} );
			},
			/**
			 *
			 * @param {Object} rowData
			 * @param {Object} rowIndex
			 * @returns {string}
			 * @private
			 */
			_renderChildrenTr : function ( rowData, rowIndex ) {
				var me = this;
				var rowHtml = [];
				var storeCfg = {};
				var level = rowIndex.split ( "-" ).length;

				$ ( rowData.data ).each ( function ( i ) {
					storeCfg.rowindex = rowIndex + "-" + i;
					storeCfg.data = this;

					storeCfg.index = i;
					var leaf = this.leaf;
					var rowtpl = me._concatTpl ( level, leaf );
					var rowtemp = juicer ( rowtpl, storeCfg );

					rowHtml.push ( rowtemp );
				} );
				return rowHtml.join ( "" );
			}
		}

	} );
	FAPUI.register ( "treegrid", FAPUI.TreeGrid );
	return FAPUI.TreeGrid;
} );