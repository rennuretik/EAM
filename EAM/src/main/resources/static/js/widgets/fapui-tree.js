/**
 *定义树FAPUI.Tree组件(如使用其他配置请参看JQuery_zTree_v的API)
 *<p>以下代码将演示如何使用Tree组件</p>

 var Mytree = new ztree({
			  renderTo:"ad",
			  width : 220,
			  border:true,
			  filterAble : true,
			  setting : {
				async : {
					enable: true,
					url: path+"/ztreeDataController/data",
					otherParam:{"node":"root"},
					autoParam : [ "id" ]
				},
				check : {
					enable : true,
					chkStyle : "checkbox",
					chkboxType: { "Y": "ps", "N": "s" }
				},
				view: {
					dblClickExpand: true,
					selectedMulti: false,
					expandSpeed: ($.browser.msie && parseInt($.browser.version)<=6)?"":"fast"
				},
				listeners : {
					"click" : function(event, treeId, treeNode) {
						alert(treeNode.id + ":" + treeNode.name);
					}
				}
			}
		});

 *@class FAPUI.Tree
 *@extend FAPUI.Panel
 */

define ( function ( require ) {

	require ( "ztree" );

	require ( "./fapui-textfield" );
	require ( "./fapui-button" );
	require ( "./fapui-panel" );
	var importcss = "./themes/" + FAPUI.getTheme () + "/css/ui-tree.css";

	require.async ( importcss );

	FAPUI.define ( "FAPUI.Tree", {
		extend : "FAPUI.Panel", props : {

			/**
			 * 本地数据
			 * @property znodes
			 * @type Array
			 * @default []
			 */
			znodes : [],

			/**
			 * ztree配置项，具体参见zTree控件api
			 * @property setting
			 * @type Object
			 * @default {}
			 */
			setting : {
				callback : {}, view : {}
			}, /**
			 * 是否添加tree上的搜索框
			 * @property filterAble
			 * @type boolean
			 * @default  true默认为添加搜索框
			 */
			filterAble : true,

			/**
			 * 是否添加展开的按钮;true为添加,false为不添加
			 * @property expandAble
			 * @type boolean
			 * @default true
			 */
			expandAble : true,

			/**
			 * 是否添加展开的按钮;true为添加,false为不添加
			 * @property collposeAble
			 * @type boolean
			 * @default true
			 */
			collposeAble : true,

			/**
			 * 是否添加展开的按钮;true为添加,false为不添加
			 * @property refreshAble
			 * @type boolean
			 * @default true
			 */
			refreshAble : true, /**
			 * 加载节点个数
			 * @property curAsyncCount
			 * @private
			 * @type number
			 * @default 0
			 */
			curAsyncCount : 0, /**
			 * 是否已经全部加载完毕
			 * @property asyncForAll
			 * @private
			 * @type boolean
			 * @default false
			 */
			asyncForAll : false, /**
			 * 当前节点是否已加载
			 * @property goAsync
			 * @private
			 * @type boolean
			 * @default false
			 */
			goAsync : false, /**
			 * 当前节点的状态，init 初始化中，async 异步加载中，expand 已展开
			 * @property curStatus
			 * @private
			 * @type boolean
			 * @default false
			 */
			curStatus : "init", /**
			 * 当前页数
			 * @property curPage
			 * @private
			 * @type number
			 * @default 0
			 */
			curPage : 0
		}, override : {

			/**
			 * 初始化配置对象
			 * @private
			 */
			initConfig : function () {
				var me = this;

				me.callParent ();
				var arr = [

				/**
				 * 具体参见zTree控件api
				 */
					"beforeAsync",

				/**
				 * 具体参见zTree控件api
				 */
					"beforeCheck",

				/**
				 * 具体参见zTree控件api
				 */
					"beforeClick",

				/**
				 * 具体参见zTree控件api
				 */
					"beforeCollapse",

				/**
				 * 具体参见zTree控件api
				 */
					"beforeDbClick",

				/**
				 * 具体参见zTree控件api
				 */
					"beforeDrag",

				/**
				 * 具体参见zTree控件api
				 */
					"beforeEditName",

				/**
				 * 具体参见zTree控件api
				 */
					"beforeExpand",

				/**
				 * 具体参见zTree控件api
				 */
					"beforeMouseDown",

				/**
				 * 具体参见zTree控件api
				 */
					"beforeMouseUp",

				/**
				 * 具体参见zTree控件api
				 */
					"beforeRemove",

				/**
				 * 具体参见zTree控件api
				 */
					"beforeRename",

				/**
				 * 具体参见zTree控件api
				 */
					"beforeRightClick",

				/**
				 * 具体参见zTree控件api
				 */
					"onAsyncError",

				/**
				 * 具体参见zTree控件api
				 */
					"onAsyncSuccess",

				/**
				 * 具体参见zTree控件api
				 */
					"onCheck",

				/**
				 * 具体参见zTree控件api
				 */
					"onClick",

				/**
				 * 具体参见zTree控件api
				 */
					"onCollapse",

				/**
				 * 具体参见zTree控件api
				 */
					"onDblclick",

				/**
				 * 具体参见zTree控件api
				 */
					"onDrag",

				/**
				 * 具体参见zTree控件api
				 */
					"onDrop",

				/**
				 * 具体参见zTree控件api
				 */
					"onExpand",

				/**
				 * 具体参见zTree控件api
				 */
					"onMouseDown",

				/**
				 * 具体参见zTree控件api
				 */
					"onMouseUp",

				/**
				 * 具体参见zTree控件api
				 */
					"onNodeCreated",

				/**
				 * 具体参见zTree控件api
				 */
					"onRemove",

				/**
				 * 具体参见zTree控件api
				 */
					"onRename",

				/**
				 * 具体参见zTree控件api
				 */
					"onRightClick" ];

				this.formmasktpl = [ "<div class=\"grid-loading-container\" style=\"z-index:9999;" ,
					"position:absolute;left:0px;top:0px;\"></div>" ].join ( " " );

				if ( me.filterAble ) {
					me.initCallBack ();
				}

				me.setting = me.setting || {};
				me.setting.callback = me.setting.callback || {};
				for ( var i = 0; i < arr.length; i ++ ) {
					var key = arr[ i ];

					( function ( me, key ) {
						me.setting.callback [ key ] = me.setting.callback[ key ] || function () {
								return true;
							};
						me.setting.callback[ key ] = me.setting.callback[ key ].createInterceptor (
							function () {
								var callArgs = Array.prototype.slice.call ( arguments, 0 );

								key = key.toLowerCase ();
								key = key.indexOf ( "on" ) === - 1 ? key : key.substr ( 2 ).uncapitalize ();
								callArgs.splice ( 0, 0, key );
								me.fireEvent.apply ( me, callArgs );
							} );
					} ) ( me, key );
				}
			},

			/**
			 * 渲染组件
			 * @private
			 * @param {Object} el 目标容器对象
			 */
			render : function ( el ) {
				this.callParent ( [ el ] );
			},
			/**
			 *初始化
			 */
			initContentEvent : function () {
				var me = this;

				var contentEl = me.contentEl;

				me.treeId = FAPUI.getId ();
				contentEl.attr ( "id", me.treeId );
				contentEl.addClass ( "ztree" );
				me._tree = $.fn.zTree.init ( contentEl, me.setting, me.znodes );
			}, /**
			 * 创建搜索框
			 */
			createTToolbarDom : function () {
				var me = this;

				me.tbar = me.tbar || {};
				me.tbar.items = me.tbar.items || [];
				if ( me.filterAble ) {
					var searchTxt = new FAPUI.form.TextField ( {
						ctype : "textfield",
						inputType : "text",
						width : me.width * 0.33 || 100,
						emptyText : "输入查询的条件....",
						listeners : {
							/**
							 *
							 * @param {Object} tx
							 * @param {Object} evt
							 */
							"keydown" : function ( tx, evt ) {
								if ( evt.keyCode === 13 ) {
									me.searchNode ( tx.getValue (), null );
								}
								if ( evt.keyCode === 8 ) {
									document.onkeydown = null;
								}
							}
						}
					} );

					var but = new FAPUI.Button ( {
						type : "linkButton",
						title : "搜索",
						iconCls : "icon-search",
						/**
						 *
						 * @param {Object} Button
						 * @param {Object} btn
						 * @param {Object} event
						 */
						handler : function ( Button, btn, event ) {
							me.searchNode ( searchTxt.getValue (), null );
						}
					} );

					me.tbar.items.push ( searchTxt );
					me.tbar.items.push ({
						type : "-"
					});
					me.tbar.items.push ( but );
				}

				if ( me.expandAble ) {
					var butExpand = new FAPUI.Button ( {
						type : "linkButton",
						iconCls : "icon-tree-expand",
						title : "展开全部",
						/**
						 *
						 * @param {Object} Button
						 * @param {Object} btn
						 * @param {Object} event
						 */
						handler : function ( Button, btn, event ) {
							if ( ! me.mask ) {
								me.mask = $ ( juicer ( me.formmasktpl, {} ) );
								me.mask.appendTo ( me.el );
							}
							me.mask.height ( me.mask.parent ().height () );
							me.mask.width ( me.mask.parent ().width () );
							me.mask.show ();
							me.expandAll ( me, me.mask );
							me.mask.hide ();
						}
					} );

					me.tbar.items.push ( butExpand );
				}

				if ( me.collposeAble ) {
					var butAcco = new FAPUI.Button ( {
						type : "linkButton",
						title : "收缩",
						iconCls : "icon-tree-collpose",
						/**
						 *
						 * @param {Object} Button
						 * @param {Object} btn
						 * @param {Object} event
						 */
						handler : function ( Button, btn, event ) {
							me.expandAll ( false );
						}
					} );

					me.tbar.items.push ( butAcco );
				}

				if ( me.refreshAble ) {
					var butRefresh = new FAPUI.Button ( {
						type : "linkButton",
						iconCls : "icon-reload",
						title : "刷新",
						/**
						 *
						 * @param {Object} Button
						 * @param {Object} btn
						 * @param {Object} event
						 */
						handler : function ( Button, btn, event ) {
							me.expandAll ( false );
							me.reAsyncChildNodes ( null, "refresh" );
						}
					} );

					me.tbar.items.push ( butRefresh );
				}
				return me.callParent ();
			},
			/**
			 * 搜索框设置值
			 * @param val
			 */
			setSearchVal:function(val){
				this.tbar.items[0].setValue(val);
			},
			/**
			 * 添加节点
			 * @method addNodes
			 * @param {Object} parentNode
			 * @param {Object} newNodes
			 * @param {boolean} isSilent
			 */
			addNodes : function ( parentNode, newNodes, isSilent ) {
				var me = this;

				me._tree.addNodes ( parentNode, newNodes, isSilent );
			},

			/**
			 * 取消节点名称编辑
			 * @method cancelEditName
			 * @param {string} newName
			 */
			cancelEditName : function ( newName ) {
				var me = this;

				me._tree.cancelEditName ( newName );
			},

			/**
			 * 取消节点选中
			 * @method cancelSelectedNode
			 * @param {Object} treeNode
			 */
			cancelSelectedNode : function ( treeNode ) {
				var me = this;

				me._tree.cancelSelectedNode ( treeNode );
			},

			/**
			 * 选中所有节点
			 * @method checkAllNodes
			 * @param {*} checked 参见zTree控件api
			 */
			checkAllNodes : function ( checked ) {
				var me = this;

				me._tree.checkAllNodes ( checked );
			},

			/**
			 * 选中节点
			 * @method checkNode
			 * @param {*} node
			 * @param {*} checked
			 *@param {*} checkTypeFlag
			 *@param {*} callbackFlag 参见zTree控件api
			 */
			checkNode : function ( node, checked, checkTypeFlag, callbackFlag ) {
				var me = this;

				me._tree.checkNode ( node, checked, checkTypeFlag, callbackFlag );
			},

			/**
			 * 拷贝节点
			 * @method copyNode
			 * @param {*} targetNode 参见zTree控件api
			 * @param {*} node 参见zTree控件api
			 * @param {*} moveType 参见zTree控件api
			 * @param {*} isSilent 参见zTree控件api
			 */
			copyNode : function ( targetNode, node, moveType, isSilent ) {
				var me = this;

				me._tree.copyNode ( targetNode, node, moveType, isSilent );
			},

			/**
			 * 销毁控件
			 * @method destroy
			 */
			destroy : function () {
				var me = this;

				me._tree.destroy ();
			},

			/**
			 * 编辑节点名称
			 * @method editName
			 * @param {*} node 参见zTree控件api
			 */
			editName : function ( node ) {
				var me = this;

				me._tree.editName ( node );
			},

			/**
			 * 展开所有节点
			 * @method expandAll
			 * @param {*} expandFlag 参见zTree控件api
			 */
			expandAll : function ( expandFlag ) {
				var me = this;

				me._tree.expandAll ( expandFlag );
			},

			/**
			 * 展开节点
			 * @method expandNode
			 * @param {*} node 参见zTree控件api
			 * @param {*} expandFlag 参见zTree控件api
			 * @param {*} sonSign 参见zTree控件api
			 * @param {*} focus 参见zTree控件api
			 * @param {*} callbackFlag 参见zTree控件api
			 */
			expandNode : function ( node, expandFlag, sonSign, focus, callbackFlag ) {
				var me = this;

				me._tree.expandNode ( node, expandFlag, sonSign, focus, callbackFlag );
			},

			/**
			 * 具体说明参见zTree控件api
			 * @method getChangeCheckedNodes
			 */
			getChangeCheckedNodes : function () {
				var me = this;

				return me._tree.getChangeCheckedNodes ();
			},

			/**
			 * 获取选中的节点
			 * @method getCheckedNodes
			 * @param {*} checked 参见zTree控件api
			 */
			getCheckedNodes : function ( checked ) {
				var me = this;

				return me._tree.getCheckedNodes ( checked );
			},

			/**
			 * 具体说明请参见zTree控件api
			 * @method getNodeByParam
			 * @param {*} key 参见zTree控件api
			 * @param {*} value 参见zTree控件api
			 * @param {*} parentNode 参见zTree控件api
			 */
			getNodeByParam : function ( key, value, parentNode ) {
				var me = this;

				return me._tree.getNodeByParam ( key, value, parentNode );
			},

			/**
			 * 具体说明请参见zTree控件api
			 * @method getNodeByTId
			 * @param {*} tId 参见zTree控件api
			 */
			getNodeByTId : function ( tId ) {
				var me = this;

				return me._tree.getNodeByTId ( tId );
			},

			/**
			 * 具体说明请参见zTree控件api
			 * @method getNodeIndex
			 * @param {*} node 参见zTree控件api
			 */
			getNodeIndex : function ( node ) {
				var me = this;

				return me._tree.getNodeIndex ( node );
			},

			/**
			 * 具体说明请参见zTree控件api
			 * @method getNodes
			 */
			getNodes : function () {
				var me = this;

				return me._tree.getNodes ();
			},

			/**
			 * 具体说明请参见zTree控件api
			 * @method getNodesByFilter
			 * @param {*} filter 参见zTree控件api
			 * @param {*} isSingle 参见zTree控件api
			 * @param {*} parentNode 参见zTree控件api
			 * @param {*} invokeParam 参见zTree控件api
			 */
			getNodesByFilter : function ( filter, isSingle, parentNode, invokeParam ) {
				var me = this;

				return me._tree.getNodesByFilter ( filter, isSingle, parentNode, invokeParam );
			},

			/**
			 * 具体说明请参见zTree控件api
			 * @method getNodesByParam
			 * @param {*} key 参见zTree控件api
			 * @param {*} value 参见zTree控件api
			 * @param {*} parentNode 参见zTree控件api
			 */
			getNodesByParam : function ( key, value, parentNode ) {
				var me = this;

				return me._tree.getNodesByParam ( key, value, parentNode );
			},

			/**
			 * 具体说明请参见zTree控件api
			 * @method getNodesByParamFuzzy
			 * @param {*} key 参见zTree控件api
			 * @param {*} value 参见zTree控件api
			 * @param {*} parentNode 参见zTree控件api
			 */
			getNodesByParamFuzzy : function ( key, value, parentNode ) {
				var me = this;

				return me._tree.getNodesByParamFuzzy ( key, value, parentNode );
			},

			/**
			 * 具体说明请参见zTree控件api
			 * @method getSelectedNodes
			 */
			getSelectedNodes : function () {
				var me = this;

				return me._tree.getSelectedNodes ();
			},

			/**
			 * 具体说明请参见zTree控件api
			 * @method hideNode
			 * @param {*} node 参见zTree控件api
			 */
			hideNode : function ( node ) {
				var me = this;

				me._tree.hideNode ( node );
			},

			/**
			 * 具体说明请参见zTree控件api
			 * @method hideNodes
			 * @param {*} nodes 参见zTree控件api
			 */
			hideNodes : function ( nodes ) {
				var me = this;

				me._tree.hideNodes ( nodes );
			},

			/**
			 * 具体说明请参见zTree控件api
			 * @method moveNode
			 * @param {*} targetNode 参见zTree控件api
			 * @param {*} node 参见zTree控件api
			 * @param {*} moveType 参见zTree控件api
			 * @param {*} isSilent 参见zTree控件api
			 */
			moveNode : function ( targetNode, node, moveType, isSilent ) {
				var me = this;

				me._tree.moveNode ( targetNode, node, moveType, isSilent );
			},

			/**
			 * 具体说明请参见zTree控件api
			 * @method reAsyncChildNodes
			 * @param {*} parentNode 参见zTree控件api
			 * @param {*} reloadType 参见zTree控件api
			 * @param {*} isSilent 参见zTree控件api
			 */
			reAsyncChildNodes : function ( parentNode, reloadType, isSilent ) {
				var me = this;

				me._tree.reAsyncChildNodes ( parentNode, reloadType, isSilent );
			},

			/**
			 * 刷新树节点
			 * @method refresh
			 */
			refresh : function () {
				var me = this;

				me._tree.refresh ();
			},

			/**
			 * 根据父节点移除子节点
			 * @method removeChildNodes
			 * @param {*} parentNode 参见zTree控件api
			 */
			removeChildNodes : function ( parentNode ) {
				var me = this;

				me._tree.removeChildNodes ( parentNode );
			},

			/**
			 * 移除节点
			 * @method removeNode
			 * @param {*} node 参见zTree控件api
			 * @param {*} callbackFlag 参见zTree控件api
			 */
			removeNode : function ( node, callbackFlag ) {
				var me = this;

				me._tree.removeNode ( node, callbackFlag );
			},

			/**
			 * 选中节点
			 * @method selectNode
			 * @param {*} node 参见zTree控件api
			 * @param {*} addFlag 参见zTree控件api
			 */
			selectNode : function ( node, addFlag ) {
				var me = this;

				me._tree.selectNode ( node, addFlag );
			},

			/**
			 * 具体说明请参见zTree控件api
			 * @method setChkDisabled
			 * @param {*} node 参见zTree控件api
			 * @param {*} disabled 参见zTree控件api
			 */
			setChkDisabled : function ( node, disabled ) {
				var me = this;

				me._tree.setChkDisabled ( node, disabled );
			},

			/**
			 * 具体说明请参见zTree控件api
			 * @method setEditable
			 * @param {*} editable 参见zTree控件api
			 */
			setEditable : function ( editable ) {
				var me = this;

				me._tree.setEditable ( editable );
			},

			/**
			 * 显示节点
			 * @method showNode
			 * @param  {*} node 参见zTree控件api
			 */
			showNode : function ( node ) {
				var me = this;

				me._tree.showNode ( node );
			},

			/**
			 * 显示节点
			 * @method showNodes
			 * @param {*} nodes 参见zTree控件api
			 */
			showNodes : function ( nodes ) {
				var me = this;

				me._tree.showNodes ( nodes );
			},

			/**
			 * 具体说明请参见zTree控件api
			 * @method transformToArray
			 * @param {*} nodes 参见zTree控件api
			 */
			transformToArray : function ( nodes ) {
				var me = this;

				return me._tree.transformToArray ( nodes );
			},

			/**
			 * 具体说明请参见zTree控件api
			 * @method transformTozTreeNodes
			 * @param {*} simpleNodes 参见zTree控件api
			 */
			transformTozTreeNodes : function ( simpleNodes ) {
				var me = this;

				return me._tree.transformTozTreeNodes ( simpleNodes );
			},

			/**
			 * 更新节点
			 * @method updateNode
			 * @param {*} node 参见zTree控件api
			 * @param {*} checkTypeFlag 参见zTree控件api
			 */
			updateNode : function ( node, checkTypeFlag ) {
				var me = this;

				me._tree.updateNode ( node, checkTypeFlag );
			},
			/**
			 * 销毁
			 */
			onDestroy : function () {
				var me = this;

				me._tree.destroy ();
				delete me._tree;
				me.mask && me.mask.remove () &&  delete me.mask ;
				me.callParent ();
			},
			/**
			 *
			 * @param {*} value
			 * @param {*} type
			 */
			searchNode : function ( value ) {
				var me = this;

				var contextNodes = me.transformToArray ( me.getNodes () );

				me.hideNodes ( contextNodes );

				if ( ! value ) {
					me.showNodes ( contextNodes );
					me.expandAll ( false );
					return;
				}
				if ( value ) {
					var name=(me.setting.data&& me.setting.data.key && me.setting.data.key.name)||"name";
					var nodes = me.getNodesByParamFuzzy ( name, value, null );
					//递归父节点
					for ( var i = 0, l = nodes.length; i < l; i ++ ) {
						me.getParents ( nodes[ i ], nodes );
					}
					me.showNodes ( nodes );
					me.expandAll ( true );

				}
			},
			/**
			 * 递归父节点
			 * @param {Object} nd
			 * @param {Object} nodeList
			 */
			getParents : function ( nd, nodeList ) {
				var me = this;

				if ( nd ) {
					var ndp = nd.getParentNode ();

					if ( ndp ) {
						if ( nodeList.indexOf ( ndp ) === - 1 ) {
							nodeList.push ( ndp );
						}
						me.getParents ( ndp, nodeList );
					}
				}
			},
			/**
			 * initCallBack
			 */
			initCallBack : function () {
				var me = this;

				me.setting.callback = me.setting.callback || {};
				me.setting.view = me.setting.view || {};
				me.setting.async = me.setting.async || {};
				//me.setting.async[ "dataFilter" ] = filter;
				//me.setting.callback[ "beforeAsync" ] = beforeAsync;
				//me.setting.callback[ "onAsyncSuccess" ] = onAsyncSuccess;
				//me.setting.callback[ "onAsyncError" ] = onAsyncError;
				me.setting.view.expandSpeed = "";
			}
		}
	} );
	FAPUI.register ( "tree", FAPUI.Tree );
	return FAPUI.Tree;
} );
