/**
 *下拉表格,如下创建:
 *
 new FAPUI.form.ComboxGrid({
			  renderTo:'ab',
			  multiSelect:true,
			  width :200,
			  height : 400,
			  //submitAll:false,
			  listeners:{
			  	"change":function(oldValue,oldText,newValue,newText){
			  		alert("oldValue:"+oldValue+" oldText:"+oldText+" newValue:"+newValue+" newText:"+newText);
			  	}
			  },
			  value:"0",
			  firstUrl:'<%=path%>/store/first',
			  valueField:"def",
			  fieldLabel:"sdkf",
			  textField:"dep",
			  grid:{
				  store:new FAPUI.Store({
						url:'<%=path%>/store/storeTest',
						limit:10
					}),
					columns:[{
						type:'collapse',
						dataField:"userName"
					},{
						type:'rowIndex'
					},{
						type:'checkbox'
					},{
						type:'common',
						header:'员工编号',
						dataField:'userId',
						renderField:'userName',
						hide:true,
						align:"center",
						width:200
					},{
						type:'common',
						header:'员工姓名',
						dataField:'userName',
						width:200
					},{
						type:'common',
						header:'所在部门',
						dataField:'dep',
						width:200
					}]
			  }
		});
 *
 *@class FAPUI.form.ComboxGrid
 *@extends FAPUI.form.TextField
 */
define ( function ( require ) {

	var importcss = "./themes/" + FAPUI.getTheme () + "/css/ui-combobox.css";

	require.async ( importcss );

	require ( "./fapui-textfield" );

	require ( "./fapui-grid" );

	FAPUI.define ( "FAPUI.form.ComboxGrid", {
		extend : "FAPUI.form.TextField", props : {
			width : 240, /**
			 *Grid组件
			 *@property grid
			 *@type Grid
			 */
			grid : {}, /**
			 *实际输入框的值对象grid中的列名
			 *@property valueField
			 *@type String
			 */
			valueField : "", /**
			 *实际显示框的值对象grid中的列名
			 *@property textField
			 *@type String
			 */
			textField : "", /**
			 *延时加载,默认为true,当且仅当第一次点击下拉按钮时触发数据加载
			 *@property lazyLoad
			 *@type Boolean
			 */
			lazyLoad : true, _IsCreate : false,	//表格是否已经创建默认为false
			isEqualWidth : true, //下拉列表是否和文本框等宽，默认为true
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
			editAble : false
		}, override : {
			/**
			 *
			 */
			initConfig : function () {

				var me = this;

				me.callParent ();
				this.addEvents ( "change" );
				this.tpl = [ "<div class=\"combo-container\" id=\"$${id}\">", "{@if !hideLabel}", "{@if !hideLabel}",
					"{@if fieldLabel!=\"\"}", "<span class=\"field-label\" ",
					"style=\"width:${labelWidth}px;text-align:${labelAlign};\">$${fieldLabel}{@if !allowBlank}",
					"<span class=\"field-required\">*</span>{@/if}$${labelSplit}</span>", "{@else if fieldLabel==\"\"}",
					"<span class=\"field-label\" style=\"width:${labelWidth}px;",
					"text-align:${labelAlign};\">&nbsp;</label>", "{@/if}", "{@/if}", "{@/if}",
					"<span class=\"combo\">", "<input class=\"combo-value\" type=\"hidden\" name=\"${realName}\"/>",
					"<input class=\"combo-text\" type=\"text\"  name=\"${name}\" />",
					"<a class=\"combo-arrow\" href=\"javascript:void(0)\" hidefocus=\"true\"></a>", "</span>",
					"</div>" ].join ( "" );
				juicer.set ( "cache", true );
				juicer.set ( "errorhandling", false );
				juicer.set ( "strip", true );
				juicer.set ( "detection", false );

				//浏览器类型信息
				me.browser = me._getBrowser ();
			}, /**
			 * 渲染组件至目标对象
			 * @param {*} el
			 * @private
			 */
			render : function ( el ) {

				var me = this;

				me.callParent ( [ el ] );
			}, /**
			 * 创建Dom元素
			 * @private
			 */
			createDom : function () {

				var me = this;

				me.id = me.id || FAPUI.getId ();
				me.contentEl = $ ( "<div class='combogrid-content' ></div>" );
				me.height = me.height || "200px";
				me.contentEl.css ( "width", me.width + "px" );
				me.contentEl.css ( "height", me.height );
				me.contentEl.appendTo ( $ ( document.body ) );

				var tmp = juicer ( this.tpl, me );
				//如果不是延迟加载马上创建表格
				me.createContent ();
				return tmp;
			}, /**
			 * 设置默认值
			 * @private
			 */
			setDefaultValue : function () {

				var me = this;

				if ( me.value ) {
					me.setValue ( me.value );

					var rawValue = me.findRawValue ( me.value );

					me.setRawValue ( rawValue );
				}

			}, /**
			 * 创建下拉表格
			 * @private
			 */
			createContent : function () {

				var me = this;

				if ( me.grid.isUI && me.grid.isUI () ) {
					me.grid.render ( me.contentEl );
				} else {
					FAPUI.apply ( me.grid, {
						border : false
					} );

					var grid = new FAPUI.Grid ( me.grid );

					grid.render ( me.contentEl );
					me.grid = grid;
				}
				me.grid.on ( "dbrowclick", function ( grid, rowindex ) {
					var record = grid.store.data[ rowindex ];
					var value = record[ me.valueField ];
					var text = record[ me.textField ];
					var oldValue = me._getField ().val ();

					var oldText = me._getRawField ().val ();

					me.setValue ( value );
					me.setRawValue ( text );
					if ( oldValue !== value ) {
						me.fireEvent ( "change", oldValue, oldText, value, text );
					}
					me.contentEl.hide ();
				} );
				me._IsCreate = true;
			},

			/**
			 * 内容框定位
			 */
			contentPosition : function () {
				var me = this;
				//定位下拉框
				var docHeight = $ ( window ).height ();//document.documentElement.offsetHeight;
				//下拉左偏移量
				var pos = $ ( "span.combo a.combo-arrow", me.el ).offset ();
				var comboWidth = me.width - me.labelWidth;

				var lf = comboWidth - 16;

				if ( me.browser.version <= "8.0" ) {
					lf -= 1;
				}

				var input = me._getRawField ();
				var inputHeight = input.height ();
				var top = input.offset ().top;

				var offsetTop = me.browser.version > "7.0" ? pos.top + inputHeight + 2 : pos.top + inputHeight + 4;

				var offsetLeft = pos.left - lf;

				me.contentEl.css ( {
					left : offsetLeft, top : offsetTop
				} );

				//下拉列表弹出位置边界控制

				var maxHeight = docHeight - me.contentEl.height () - inputHeight - 5;

				top > maxHeight && me.contentEl.css ( {
					"top" : - me.contentEl.height () + top - 3, "border-top" : "1px solid #7EADD9"
				} );
			}, /**
			 * 绑定右边下拉按钮事件处理
			 * @private
			 */
			bindEvent : function () {

				var me = this;

				me.callParent ();
				$ ( "span.combo a.combo-arrow", me.el ).click ( function ( event ) {
					event.preventDefault ();
					$ ( this ).parent ().addClass ( "input-onfoucs" );

					if ( me.lazyLoad && ! me._IsCreate ) {
						me.createContent ();
					}
					if ( me.grid.store.data.length === 0 ) {
						me.grid.load ();
					}
					if ( me.contentEl.is ( ":hidden" ) ) {
						me.contentPosition ();
						me.contentEl.show ();
					} else {
						me.contentEl.hide ();
					}
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
			}, /**
			 * 根据隐藏值,查询显示值
			 * @param {*} v
			 */
			findRawValue : function ( v ) {
				var me = this;

				if ( me._IsCreate && me.grid && me.grid.store ) {
					$ ( me.grid.store.data ).each ( function () {

						var me = this;

						if ( me[ me.valueField ] === v ) {
							return me[ me.textField ];//如果查到则返回
						}
					} );
				}
				if ( me.firstUrl ) {
					var url = me.firstUrl;

					var params = {
						value : v
					};

					$.post ( url, params, function ( data ) {
						me.setRawValue ( data.text );
					} );
				}
				return v;
			}, /**
			 *设置值
			 *@method setValue
			 *@param v {String}
			 */
			setValue : function ( v ) {
				if ( ! ( v || v === "" ) ) {
					return;
				}

				var me = this;

				if ( me._getRawField ().hasClass ( "input-default-emptyText" ) ) {
					me._getRawField ().removeClass ( "input-default-emptyText" );
				}
				var text = v;

				var flag = false;//是否在grid中的stroe中找到对应值的标志

				if ( me.grid.isUI && me.grid.isUI () ) {//如果是grid组件

					var data = me.grid.store.data;

					$ ( data ).each ( function () {

						var o = this;

						if ( o [ me.valueField ] === v ) {
							text = o[ me.textField ];
							me._getRawField ().val ( text );
							me._getField ().val ( v );
							flag = true;
							return false;
						}
					} );
				}
				if ( ! flag ) {//如果没有找到则到后台去找
					if ( me.firstUrl ) {
						$.post ( me.firstUrl, {
							value : v
						}, function ( data ) {
							var o = data;

							text = o.text;
							me._getRawField ().val ( text );
							me._getField ().val ( v );
						} );
					} else {
						me._getRawField ().val ( v );
						me._getField ().val ( v );
					}
				}
				me.validate ();
			}, /**
			 * 获取Combo存值的对象
			 * @private
			 */
			_getField : function () {
				var me = this;

				var f = $ ( "input.combo-value", me.el );

				return f.length === 0 ? null : f;
			}, /**
			 * 获取Combo对象
			 * @private
			 */
			_getRawField : function () {
				var me = this;

				var f = $ ( "input.combo-text", me.el );

				return f.length === 0 ? null : f;
			}, /**
			 *重新加载下拉内容
			 *@method reloadData
			 */
			reloadData : function () {

				var me = this;

				me.grid.store.reload ();
			}, /**
			 * 给Combo Grid重新加载数据
			 * @method reload
			 */
			reload : function () {

				var me = this;

				me.store.reload ();
			}, /**
			 * 设置Combo Grid宽度
			 * @method setWidth
			 * @param {Nmuber} wid
			 */
			setWidth : function ( wid ) {

				var me = this;

				me.callParent ( [ wid ] );

				var arrow = me.el.children ( "span.combo" ).children ( "a.combo-arrow" );

				me.arrowWidth = arrow.width ();
				if ( ! me.hideLabel ) {
					me.fieldWidth = wid - me.labelWidth - me.arrowWidth;
				}

				var pr = parseInt ( me.el.find ( "input.combo-text" ).css ( "padding-right" ) );

				me.fieldWidth = me.fieldWidth - pr - 3;
				me.el.find ( "input" ).css ( "width", me.fieldWidth );
			},
			/**
			 * 设置输入框是否禁用
			 * @method setDisabled
			 * @param {boolean} dised
			 */
			setDisabled : function ( dised ) {

				var me = this;

				if ( dised ) {
					me.disabled = true;
					me._getRawField ().attr ( "disabled", true );
					me.el.find ( "a" ).attr ( "disabled", true );
				} else {
					me.disabled = false;
					me._getRawField ().attr ( "disabled", false );
					me.el.find ( "a" ).attr ( "disabled", false );
				}
			},

			/**
			 * 设置输入框是否为只读
			 * @method setReadOnly
			 * @param {boolean} rOnly
			 */
			setReadOnly : function ( rOnly ) {

				var me = this;

				if ( rOnly ) {
					me.readOnly = true;
					me._getRawField ().attr ( "readOnly", true );
					me.el.find ( "a" ).attr ( "disabled", true );
				} else {
					me.readOnly = false;
					me._getRawField ().attr ( "readOnly", false );
					me.el.find ( "a" ).attr ( "disabled", false );
				}
			}, /**
			 * 获取浏览器类型信息
			 * @private
			 * @return {Object}
			 */
			_getBrowser : function () {
				var _agent = navigator.userAgent.toLowerCase ();
				var _browser = {
					agent : _agent, msie : /msie/.test ( _agent ),
					firefox : /mozilla/.test ( _agent ) && ! /(compatible|webkit|chrome)/.test ( _agent ),
					opera : /opera/.test ( _agent ), chrome : /chrome/.test ( _agent ),
					safari : /webkit/.test ( _agent ) && ! /chrome/.test ( _agent ),
					version : ( _agent.match ( /.+(?:chrome|firefox|msie|version)[\/: ]([\d.]+)/ ) || [ 0, 0 ] )[ 1 ]

				};

				return _browser;
			}, /**
			 *
			 */
			onDestroy : function () {

				var me = this;

				me.grid.destroy ();
				me.contentEl.remove ();
				delete me.contentEl;
				me.callParent ();
			}
		}
	} );
	FAPUI.register ( "combogrid", FAPUI.form.ComboxGrid );
	return FAPUI.form.ComboxGrid;
} );
