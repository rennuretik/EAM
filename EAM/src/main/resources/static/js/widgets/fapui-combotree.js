/**
 *下拉树,如下创建
 *
 new FAPUI.form.ComboxTree({
			  renderTo:'ab',
			  listeners:{
			  	"change":function(oldValue,oldText,newValue,newText){
			  		alert("oldValue:"+oldValue+" oldText:"+oldText+" newValue:"+newValue+" newText:"+newText);
			  	}
			  },
			  value:"0",
			  firstUrl:'<%=path%>/store/first',
			  setting : {
						async: {
							enable: true,
							url: "<%=path%>/ztreeDataController/data",
							autoParam: ["id","count"]
						}
					}
		});
 *
 *@class FAPUI.form.ComboxTree
 *@extends FAPUI.form.TextField
 */
define ( function ( require, exports, module ) {

	var importcss = "./themes/" + FAPUI.getTheme () + "/css/ui-combobox.css";

	require.async ( importcss );

	require ( "./fapui-textfield" );

	require ( "./fapui-tree" );
	FAPUI.define ( "FAPUI.form.ComboxTree", {
		extend : "FAPUI.form.TextField",
		props : {
			/**
			 *@property width
			 *@type number
			 *combotree的宽度
			 */
			width : 240,
			/**
			 *@property height
			 *@type number
			 *combotree的高度
			 */
			height : 300,
			/**
			 *参见tree组件
			 *@property znodes
			 *@type Array
			 */
			znodes : [],
			/**
			 *多选时有效,默认为true,提交所有选中节点,为false时只提交叶子节点
			 *@property submitAll
			 *@type Boolean
			 */
			submitAll : true,
			/**
			 *参见tree组件
			 *@property setting
			 *@type Object
			 */
			setting : null,
			/**
			 *是否启用多选功能,如果启用多先,下拉树将增加”确定,关闭”两个按钮
			 *@property multiSelect
			 *@type Boolean
			 */
			multiSelect : false,
			/**
			 *延时加载,默认为true,当且仅当第一次点击下拉按钮时触发树的加载动作.当value属性不为空时,延时加载无效.
			 *@property lazyLoad
			 *@type Boolean
			 */
			lazyLoad : true,

			/**
			 *分隔符,当且仅当multiSelect为true时有效
			 *@property separator
			 *@type String
			 */
			separator : ",",

			/**
			 * 树是否已经创建
			 * @private
			 * @default false
			 */
			_IsCreate : false,

			/**
			 * 下拉列表是否和文本框等宽
			 * @property isEqualWidth
			 * @type Boolean
			 * @default true
			 */
			isEqualWidth : true,

			/**
			 *如果有默认值,渲染后会根据默认值跑到对应后台匹配对应的显示值
			 *@property firstUrl
			 *@type String
			 */
			firstUrl : null,
			/**
			 * 是否可以编辑
			 * @property editAble
			 * @type Boolean
			 */
			editAble : false,

			/**
			 *内部树的配置,最后树里面的配置,以用户配置的为准。详见FAPUI.tree的配置
			 */
			treeCfg : {},

			/**
			 * 勾选checkbox 对于父子节点的关联关系
			 * Y 属性定义 checkbox 被勾选后的情况；
			 * N 属性定义 checkbox 取消勾选后的情况；
			 * "p" 表示操作会影响父级节点；
			 * "s" 表示操作会影响子级节点。
			 * 请注意大小写，不要改变
			 * @property checkStyleType
			 * @type {}
			 */
			checkStyleType : {
				"Y" : "ps",
				"N" : "ps"
			},

			/**
			 * 多选情况下出现的按钮的类型,默认为linkButton
			 */
			buttonType : "linkButton",

			/**
			 * 控件值绑定的数据域名
			 * @property field
			 *@type String
			 */
			field:"id",

			/**
			 * 控件显示值绑定的数据域名
			 * @property field
			 *@type String
			 */
			rawField :"name",
			/**
			 * 下拉树支持展开搜索
			 */
			expandSearch:false
		},
		override : {
			/**
			 *
			 */
			initConfig : function () {

				var me = this;

				me.callParent ();
				this.addEvents ( /**
					 *值改变时触发
					 *@event change
					 *@param comboxtree {ComboxTree}  组件本身
					 *@param oldvalue {String} 原来的值
					 *@param newvalue {String} 新的值
					 */
					"change" );
				this.tpl = [ "<div class=\"combo-container\" id=\"$${id}\">", "{@if !hideLabel}",
							"{@if fieldLabel!=\"\"}", "<span class=\"field-label\"" ,
							" style=\"width:${labelWidth}px;text-align:${labelAlign};\">" ,
							"$${fieldLabel}{@if !allowBlank}<span class=\"field-required\">*</span>" ,
							"{@/if}$${labelSplit}</span>", "{@else if fieldLabel==\"\"}",
							"<span class=\"field-label\" style=\"width:${labelWidth}px;" ,
							"text-align:${labelAlign};\">&nbsp;</span>", "{@/if}", "{@/if}",
							"<span  class=\"combo\">", "<input class=\"combo-value\" " ,
							"type=\"hidden\" name=\"${realName}\"/>", "<input id=\"aa\" class=\"combo-text\" " ,
							"type=\"text\"  name=\"${name}\" style=\"width:${width}px;\"/>",
							"<a class=\"combo-arrow\" href=\"javascript:void(0);\" hidefocus=\"true\"></a>",
							"</span>", "</div>" ].join ( "" );
				juicer.set ( "cache", true );
				juicer.set ( "errorhandling", false );
				juicer.set ( "strip", true );
				juicer.set ( "detection", false );

				//浏览器类型信息
				me.browser = me._getBrowser ();

			},
			/**
			 * 渲染组件至目标对象
			 * @param {*} el
			 * @private
			 */
			render : function ( el ) {

				var me = this;

				me.callParent ( [ el ] );
			},
			/**
			 * blur事件
			 * @private
			 */

			onBlur:function(){
				var me=this;
				var v=me.getRawValue();
				if(!v){
					$("input[name="+me.realName+"]").val("");
				}
				if(me.editAble){
					$("input[name="+me.realName+"]",me.el).val(v);
				}
			},
			/**
			 * 创建Dom元素
			 * @private
			 */

			createDom : function () {

				var me = this;

				me.id = me.id || FAPUI.getId ();
				me.contentEl = $ ( "<div class=\"combogrid-content\" style=\"height:$${height}px;width:auto\" ></div>" );
				me.contentEl.appendTo ( $ ( document.body ) );

				var tmp = juicer ( this.tpl, me );
				me.createContent ();
				return tmp;
			},

			/**
			 * 设置默认值
			 * @private
			 */
			setDefaultValue : function () {

				var me = this;

				if ( me.value ) {
					me.setValue ( me.value );
				}
				;
			},
			/**
			 * 设置combotree值
			 * @param {*} v 格式：显示值##隐藏值
			 * @method setValue
			 */
			setValue : function ( v ) {

				var me = this;

				if ( ! v || v === "" ) {
					return;
				}

				var vs = v.split ( "##" );

				if ( vs.length === 2 ) {
					me.callParent ( [ vs[ 0 ] ] );
					me.setRawValue ( vs[ 1 ] );
				} else {
					me.callParent ( [ vs[ 0 ] ] );

					var name = me.findRawValue ( me.value );

					me.setRawValue ( name );
				}
			},
			/**
			 *创建树
			 *@private
			 */
			createContent : function () {

				var me = this;

				this.setting = this.setting || {};
				FAPUI.applyIf ( this.setting, {
					async : {
						enable : false,
						url : me.url
					}
				} );

				var bbar = null;

				if ( this.multiSelect ) {// 如果是多选的话往setting里面添加check属性
					this.setting.check = this.setting.check || {};
					FAPUI.applyIf ( this.setting.check, {
						enable : true,
						chkStyle : "checkbox",
						chkboxType : me.checkStyleType || {
							"Y" : "ps",
							"N" : "ps"
						}
					} );
					bbar = {
						align : "right",
						items : [ {
							type : me.buttonType,
							text : "确定",
							/**
							 *
							 * @param {*} b
							 * @param {*} event
							 */
							handler : function ( b, event ) {
								event.preventDefault ();
								var me = this;
								var nodes = me._tree.getCheckedNodes ( true );
								var text = "";

								var value = "";

								$ ( nodes ).each ( function () {
									if ( me.submitAll ) {
										text = text + this[me.rawField] + me.separator;
										value = value + this[me.field] + me.separator;
									} else {
										if ( ! this.isParent ) {
											text = text + this[me.rawField] + me.separator;
											value = value + this[me.field] + me.separator;
										}
									}
								} );
								text = text.slice ( 0, - 1 );
								value = value.slice ( 0, - 1 );
								var oldValue = me.getValue ();

								var oldText = me.getRawValue ();

								me.setValue ( value );
								me.setRawValue ( text );
								me.contentEl.hide ();
								if ( oldValue !== value ) {
									/**
									 * 当值发生改变时执行change事件参数为旧的隐藏值、旧的显示值、新的隐藏值、新的显示值
									 */
									me.fireEvent ( "change", oldValue, oldText, value, text ,nodes);
								}
								me.onBlur();
							},
							scope : me
						}, {
							text : "关闭",
							type : me.buttonType,
							/**
							 *@private
							 */
							handler : function () {
								var me = this;

								me.contentEl.hide ();
							},
							scope : me
						} ]
					};

				}

				var treeCfg = {
					border : false,
					setting : me.setting,
					height : me.height,
					bbar : bbar,
					width : me.width

				};

				FAPUI.apply ( treeCfg, me.treeCfg );
				me._tree = new FAPUI.Tree ( treeCfg );
				me._tree.setting.callback[ "onAsyncSuccess" ]=function(){
					//if ( me._checkIsInitAll(me._tree.getNodes()) ) {
					//	me.isInitAll = true;
					//}
					var val=me.getRawValue ();

					if(!val){
						return false;
					}
				};
				if ( ! this.multiSelect ) {//如果不是多选_tree添加双击事件
					me._tree.addListener ( "click", function ( event, treeId, treeNode ) {
						var me = this;
						//if (!treeNode.isParent) {

						var oldValue = me.getValue ();
						var oldText = me.getRawValue ();

						me.setValue ( treeNode[me.field] );
						me.setRawValue ( treeNode[me.rawField] );

						me.contentEl.hide ();
						if ( treeNode[me.field] !== oldValue ) {
							/**
							 * 当值发生改变时执行change事件参数为旧的隐藏值、旧的显示值、新的隐藏值、新的显示值
							 */
							me.fireEvent ( "change", oldValue, oldText, treeNode[me.field], treeNode[me.rawField] ,treeNode);
						}
						//}
					}, me );
				}
				me._tree.render ( me.contentEl );
				me._IsCreate = true;
			},
			/*判断节点是否加载完*/
			//_checkIsInitAll : function(nodes){
			//	var me = this;
			//	var isInit = true;
			//	nodes.each(function(node){
			//		var children = node.children;
			//		if ( children && children.length>0 ) {
			//			me._checkIsInitAll(children);
			//		} else if ( node.isParent ) {
			//			isInit = false
			//			return;
			//		}
			//	});
			//	if ( !isInit ){
			//		return false;
			//	}
			//	return true;
			//},
			/**
			 * 定位tree的位置
			 */
			contentPosition : function () {

				var me = this;

				if ( me.isEqualWidth ) {
					//下拉列表宽度
					var offset = me.browser.version <= "8.0" ? me.arrowWidth + 1 : me.arrowWidth + 2;
					//me.contentEl.width(me.fieldWidth+offset);
					me._tree.setWidth ( me.fieldWidth + offset );
				}

				//定位下拉框
				var docHeight = $ ( window ).height ();//document.documentElement.offsetHeight;
				//下拉左偏移量
				var pos = $ ( "span.combo a.combo-arrow", me.el ).offset ();
				var comboWidth = me.width - me.labelWidth;

				var lf = comboWidth - 16;

				if ( me.browser.version <= "8.0" ) {
					lf -= 3;
				}

				var input = me._getRawField ();
				var inputHeight = input.height ();
				var top = input.offset ().top;

				var offsetTop = me.browser.version > "7.0" ? pos.top + inputHeight + 2 : pos.top + inputHeight + 4;

				var offsetLeft = pos.left - lf;

				me.contentEl.css ( {
					left : offsetLeft,
					top : offsetTop
				} );

				//下拉列表弹出位置边界控制

				var maxHeight = docHeight - me.height - inputHeight - 5;

				if ( top > maxHeight ) {
					me.contentEl.height ( maxHeight );
					me._tree.setHeight ( maxHeight );
				} else {
					me.contentEl.height ( me.height );
					me._tree.setHeight ( me.height );
				}
			},
			/**
			 * 绑定右边下拉按钮事件处理
			 * @private
			 */
			bindEvent : function () {

				var me = this;

				me.callParent ();
				me.el = me.el || $ ( "#" + me.id );
				if ( me.hidden ) {
					this.el.hide ();
				}
				$ ( "span.combo a.combo-arrow", me.el ).click ( function ( event ) {
					event.preventDefault ();
					if ( ! me._IsCreate && me.lazyLoad ) {
						me.createContent ();
					}

					if ( me.contentEl.is ( ":hidden" ) ) {
						me.contentEl.show ();
						me.contentPosition ();
						me._initTree ();
					} else {
						me.contentEl.hide ();
					}

					//if( !me.isInitAll ){
					//	me._load(me._tree.getNodes());
					//} else {
					if(me.expandSearch){
						var val=me.getRawValue ();
						if(!val){
							return false;
						}
						me._tree.searchNode(val,null);
						me._tree.setSearchVal(val);
						me._tree.expandAll(true);
					}


					//}



				} );
				//关闭下拉列表
				$ ( document ).bind ( "mousedown", function ( event ) {

					var target = $ ( event.target );

					if ( ! target.is ( "div.combogrid-content,div.combogrid-content *" ) ) {
						me.contentEl && me.contentEl.hide ();
						$ ( "span.combo a.combo-arrow", me.el ).parent ().removeClass ( "input-onfoucs" );
					}
				} );
				if ( ! me.editAble ) {
					me._getRawField ().bind ( "keydown", function ( event ) {
						return false;
					} );
				}

			},
			_load :  function ( nodes ) {
				var me = this;
				nodes.each(function(node){
					me._tree.reAsyncChildNodes(node,"refresh");
					if ( node.children ){
						me._load(node.children);
					}
				});
			},
			/**
			 * @access private
			 * 初始化tree节点的状态,如果隐藏值是tree的某个节点,那么该节点为选中状态
			 */
			_initTree : function () {

				var me = this;

				if ( me.multiSelect ) {// 如果是多选的这是checkbox的选中框打勾
					me._tree.checkAllNodes ( false );// 先取消所有节点的打勾
					var vs = me.getValue ().split ( me.separator );

					$ ( vs ).each ( function () {

						var node = me._tree.getNodeByParam ( "id", this, null );

						if ( ! node ) {
							return true;
						}
						me._tree.checkNode ( node, true, false );
					} );
				} else {

					var node = me._tree.getNodeByParam ( "id", me.getValue (), null );

					if ( ! node ) {
						return;
					}
					me._tree.selectNode ( node, false );
				}

			},

			/**
			 * 根据隐藏值,找到显示值
			 * @param {*} v
			 */
			findRawValue : function ( v ) {
				var me = this;

				var value = "";

				if ( me._IsCreate && me._tree ) {//如果内部树已经创建,则从树中获取显示值
					if ( me.multiSelect ) {

						var vs = v.split ( me.separator );

						$ ( vs ).each ( function () {

							var node = me._tree.getNodeByParam ( "id", this, null );

							if ( node ) {
								value = value + node.name + me.separator;
							}
						} );
					} else {

						var node = me._tree.getNodeByParam ( "id", v, null );

						if ( node ) {
							value = node.name;
						}
					}
				} else {//否则从后台获取,如果配置了firstUrl的话
					if ( me.firstUrl ) {
						$.post ( me.firstUrl, {
							"value" : v
						}, function ( data ) {
							me.setRawValue ( data.text );
						} );
					}
				}
				if ( value === "" ) {//如果到最后还是空值,则设为和value的值一样
					value = v;
				}
				return value;

			},

			/**
			 * 获取Combo存值的对象
			 * @private
			 */
			_getField : function () {
				var me = this;

				var f = $ ( "input.combo-value", me.el );

				return f.length === 0 ? null : f;
			},
			/**
			 * 获取Combo对象
			 * @private
			 */
			_getRawField : function () {
				var me = this;
				if(me.el){
					var f = $ ( "input.combo-text", me.el );
					return f.length === 0 ? null : f;
				}


			},
			/**
			 * 重新加载下拉内容
			 * @method reloadData
			 */
			reloadData : function () {

				var me = this;

				me._tree.reAsyncChildNodes ( null, "refresh", false );
			},
			/**
			 * 给Combo Tree重新加载数据
			 * @method reload
			 */
			reload : function () {

				var me = this;

				me._tree.refresh ();
			},
			/**
			 * 设置Combo Tree宽度
			 * @method setWidth
			 * @param {Nmuber} wid
			 */
			setWidth : function ( wid ) {

				var me = this;

				this.el.width ( wid );
				this.width = wid;

				var arrow = me.el.children ( "span.combo" ).children ( "a.combo-arrow" );

				me.arrowWidth = arrow.width ();

				if ( ! me.hideLabel ) {
					me.fieldWidth = wid - me.labelWidth - me.arrowWidth;
				}

				var pr = parseInt ( me.el.find ( "input.combo-text" ).css ( "padding-right" ) , 10 );

				me.fieldWidth = me.fieldWidth - pr - 2;
				me.el.find ( "input" ).css ( "width", me.fieldWidth );
			},
			/**
			 * 设置Combo Tree的高度
			 * @method setHeight
			 * @param {Nmuber} h
			 */
			setHeight : function ( h ) {

			},
			/**
			 * 设置输入框是否禁用
			 * @method setDisabled
			 * @param {boolean} dised
			 */
			setDisabled : function ( dised ) {

				var me = this;
				if(me._getRawField ()){
					if ( dised ) {
						me.disabled = true;
						me._getRawField ().attr ( "disabled", true );
						me.el.find ( "a" ).attr ( "disabled", true );
						$ ( "span.combo a.combo-arrow", me.el ).unbind("click");
					} else {
						me.disabled = false;
						me._getRawField ().attr ( "disabled", false );
						me.el.find ( "a" ).attr ( "disabled", false );
					}
				}


			},

			/**
			 * 设置输入框是否为只读
			 * @method setReadOnly
			 * @param {boolean} rOnly
			 */
			setReadOnly : function ( rOnly ) {

				var me = this;
				if(me._getRawField ()){
					if ( rOnly ) {
						me.readOnly = true;
						me._getRawField ().attr ( "readOnly", true );
						me.el.find ( "a" ).attr ( "disabled", true );
					} else {
						me.readOnly = false;
						me._getRawField ().attr ( "readOnly", false );
						me.el.find ( "a" ).attr ( "disabled", false );
					}
				}
			},
			/**
			 * 获取浏览器类型信息
			 * @private
			 * @return {Object}
			 */
			_getBrowser : function () {
				var _agent = navigator.userAgent.toLowerCase ();
				var _browser = {
					agent : _agent,
					msie : /msie/.test ( _agent ),
					firefox : /mozilla/.test ( _agent ) && ! /(compatible|webkit|chrome)/.test ( _agent ),
					opera : /opera/.test ( _agent ),
					chrome : /chrome/.test ( _agent ),
					safari : /webkit/.test ( _agent ) && ! /chrome/.test ( _agent ),
					version : ( _agent.match ( /.+(?:chrome|firefox|msie|version)[\/: ]([\d.]+)/ ) || [ 0, 0 ] )[ 1 ]

				};

				return _browser;
			},
			/**
			 * 销毁comboxtree
			 */
			onDestroy : function () {

				var me = this;

				me._tree.destroy ();
				me.contentEl.remove ();
				delete me.contentEl;
				me.callParent ();
			}
		}
	} );
	FAPUI.register ( "combotree", FAPUI.form.ComboxTree );
	return FAPUI.form.ComboxTree;
} );
