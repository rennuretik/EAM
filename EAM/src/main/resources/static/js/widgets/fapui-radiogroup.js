/**
 *定义FAPUI.form.RadioGroup单选按钮组
 *<p>以下代码将演示如何使用RadioGroup组件</p>
 *
 *
 var radioGroup = new FAPUI.form.RadioGroup({
		renderTo : document.body,
		name : 'grage',
		value : 1,
		fieldLabel : '等级',
		width : 500,
		labelWidth : 100,
		allowBlank : false,
		columnSize : 3,
		errorMsg : '必选',
		listeners:{
			change:function(c,o,v){

			}
		},
		items : [{
			value : '0',
			fieldLabel : '第一级',
			itemWidth :50,
			checked : false
		},{
			value : '1',
			fieldLabel : '第二级',
			itemWidth :50,
			checked : false
		},{
			value : '2',
			fieldLabel : '第三级',
			itemWidth :50,
			checked : false
		},{
			value : '3',
			fieldLabel : '第四级',
			itemWidth :50,
			checked : false
		}]
	});
 *<p>以下代码将演示如何重置RadioGroup的值</p>
 radioGroup.reset();

 *<p>以下代码将演示如何设置RadioGroup的值</p>
 radioGroup.setValue('2');

 *@class FAPUI.form.RadioGroup
 *@extend FAPUI.form.TextField
 */

define ( function ( require, exports, module ) {

	require ( "./fapui-textfield" );

	FAPUI.define ( "FAPUI.form.RadioGroup", {
		extend : "FAPUI.form.TextField",
		props : {

			/**
			 * 单选框name字段值
			 * @property name
			 * @type String
			 * @default ''
			 */
			name : "",

			/**
			 * 单选框列数，用户定义的单选输入框显示的列数
			 * @property columnSize
			 * @type Number
			 * @default 1
			 */
			columnSize : 1,

			/**
			 * 单选框输入值
			 * @property value
			 * @type String
			 * @default ''
			 */
			value : "",

			/**
			 * 原始值
			 * @private
			 */
			oldValue : "",
			/**
			 * 单选框宽度
			 * @property itemWidth
			 * @type Number
			 * @default 50
			 */
			itemWidth : 50,

			/**
			 * 用户定义的单选框
			 * @property items
			 * @type Array
			 * @default []
			 */
			items : []
		},
		override : {

			/**
			 * 初始化配置项
			 * @private
			 */
			initConfig : function () {

				var me = this;

				me.callParent ();
				me.addEvents ( /**
					 * 一组单选框改变值后触发
					 * @event change
					 * @param comp {Object} 单选组按钮本身
					 * @param oldValue {String} 原始值
					 * @param value {String} 选择的值
					 */
					"change",

					/**
					 * 点击单选框触发
					 * @event click
					 * @param comp {Object} 单选组按钮本身
					 * @param event {event} 事件对象
					 */
					"click" );
				me.id = me.id || FAPUI.getId ();
				me.tpl = [ "<div class=\"textfield-container\" id=\"${id}\">", "{@if !hideLabel}",
							"{@if fieldLabel!=\"\"}", "<span class=\"field-label\" " ,
							"style=\"width:${labelWidth}px;text-align:${labelAlign};margin-top:5px;\">$${fieldLabel}" ,
							"{@if !allowBlank}<span class=\"field-required\">*</span>{@/if}$${labelSplit}</span>",
							"{@else if fieldLabel==\"\"}", "<span class=\"field-label\" " ,
							"style=\"width:${labelWidth}px;text-align:${labelAlign};margin-top:5px;" ,
							"\">&nbsp;</span>", "{@/if}", "{@/if}", "<span style=\"display:inline-block;\">" ,
							"<table class=\"radio-group-table\">", me._createRow (), "</table></span>", "<div class=\"tooltips\">", "<span class=\"error-title\"></span>", "<span class=\"error-content\">!${errorMsg}</span>", "</div>", "</div>" ].join ( "" );
			},

			/**
			 * 验证单选按钮
			 * @method validate
			 * @return {boolean} true验证通过，false验证未通过
			 */
			validate : function () {
				var me = this;

				me.isError = ! ( me._vSpecial () || ( me._vBlank () && ( me.custValidate ( me ) ) ) );
				if ( ! me.isError ) {
					me.clearError ();
				}
				return ! me.isError;
			},

			/**
			 * 输入框事件绑定
			 * @private
			 */
			bindEvent : function () {

				var me = this;

				me.el = me.el || $ ( "#" + me.id );
				me.setHideLabel ( me.hideLabel );
				me.setDisabled ( me.disabled );
				me.setReadOnly ( me.readOnly );

				var tip = $ ( ".tooltips", me.el );

				me.changeValue ();
				$ ( ".radio-group-table" ).blur ( function ( event ) {
					me.fireEvent ( "blur", me, event );
					me.onBlur ( event );
				} ).mousemove ( function ( event ) {
					if ( me.isError ) {
						me.mouseMove ( event );
					}
				} ).hover ( function ( event ) {
						if ( me.isError ) {
							tip.show ();
						}
					}, function ( event ) {
						if ( me.isError ) {
							tip.hide ();
						}
					} );
			},

			/**
			 * 改变选择的值
			 * @private
			 */
			changeValue : function () {

				var me = this;

				me._getRawField ().click ( function ( event ) {
					me.fireEvent ( "click", me, event );
					me.fireEvent ( "change", me, me.getOldValue (), me.getValue () );
					me.onClick ( event );
				} );
			},

			/**
			 * 改变选择的值的事件处理
			 * @private
			 */
			onChange : function ( event ) {
				var me = this;

			},

			/**
			 * 点击事件处理
			 * @private
			 */
			onClick : function ( event ) {

				var me = this;

				me.validate ();
				me.setOldValue ();
			},

			/**
			 * 失去焦点事件处理
			 * @private
			 */
			onBlur : function ( event ) {

				var me = this;

				me.validate ();
			},

			/**
			 * 获得焦点事件处理
			 * @private
			 */
			onFocus : function ( event ) {
			},

			/**
			 * 获取选择的值
			 * @method getValue
			 * @return {string}
			 */
			getValue : function () {
				var me = this;
				var radio = me._getRawField ();

				var len = radio.length;

				for ( var i = 0; i < len; i ++ ) {
					if ( radio[ i ].checked ) {
						return radio[ i ].value;
					}
				}
				return "";
			},

			/**
			 * 设置值
			 * @method setValue
			 * @param {string} v
			 */
			setValue : function ( v ) {

				var me = this;

				me.value = v;
				var obj = me._getField ();

				var len = obj.length;

				for ( var i = 0; i < len; i ++ ) {
					if ( obj[ i ].value == v ) {
						$ ( obj[ i ] ).attr ( "checked", true );
						break;
					}
				}
			},

			/**
			 * 设置原始值
			 * @private
			 */
			setOldValue : function () {
				var me = this;
				var radio = me._getRawField ();

				var len = radio.length;

				for ( var i = 0; i < len; i ++ ) {
					if ( radio[ i ].checked ) {
						me.oldValue = radio[ i ].value;
					}
				}
			},

			/**
			 * 获取改变当前选择值的前一次值
			 * @private
			 */
			getOldValue : function () {
				var me = this;

				var value = me.oldValue;

				return value;
			},
			/**
			 * 获取原始值
			 * @private
			 */
			getOriginalValue : function () {
				var me = this;

				var value = me.orgValue;

				return value;
			},
			/**
			 * 标记单选按钮错误信息
			 * @method markError
			 * @param {string} msg 错误信息
			 */
			markError : function ( msg ) {

				var me = this;

				msg = msg || me.errorMsg;
				$ ( ".radio-group-table", me.el ).addClass ( "validate-failure" );
				$ ( ".error-content", me.el ).html ( msg );
				me.isError = false;
			},

			/**
			 * 判断单选按钮是否为空
			 * @private
			 * @return {boolean} true为空，false不为空
			 */
			_vBlank : function () {
				var me = this;

				var flag = me.allowBlank || me.getValue ().length != 0;

				if ( ! flag ) {

					var msg = FAPUI.lang.ERROR_RADIO_MSG.format ();

					me.markError ( msg );
				}
				return flag;
			},

			/**
			 * 清除错误标记
			 * @method clearError
			 */
			clearError : function () {

				var me = this;

				$ ( ".radio-group-table", me.el ).removeClass ( "validate-failure" );
				$ ( ".tooltips", me.el ).hide ();
				me.isError = false;
			},
			/**
			 * 创建表格行   wzj 2013-07-03新增
			 * @private
			 */
			_createRow : function () {

				var me = this;
				var value = me.value;
				var radioName = me.name;
				var cSize = me.columnSize;
				var strArray = new Array ();
				var newLine = true;
				var sTd = "";

				$ ( me.items ).each ( function ( i ) {
					var check = me.items[ i ].checked;
					var v = me.items[ i ].value;

					var label = me.items[ i ].fieldLabel || "";

					if ( newLine ) {
						strArray.push ( "<tr>" );
						newLine = false;
					}
					if ( value == v || check ) {
						me.oldValue = v;
						me.orgValue = v;
						checked = "checked";
						sTd = "<td><label>" +
							  "<input hidefocus=\"true\" type=\"radio\" name=\"" + radioName + "\" value=\"" + v + "\"  checked />" +
							  "<span style=\"font-size:12px;\">" + label + "</span>" +
							  "</label>";
					} else {
						sTd = "<td><label>" +
							  "<input hidefocus=\"true\" type=\"radio\" name=\"" + radioName + "\" value=\"" + v + "\" />" +
							  "<span style=\"font-size:12px;\">" + label + "</span></label>";
					}
					strArray.push ( sTd );
					if ( ( i + 1 ) == cSize ) {
						strArray.push ( "</tr>" );
						newLine = true;
					}
				} );
				return strArray.join ("");
			},

			/**
			 * 设置宽度
			 * @method setWidth
			 * @param {number} wid
			 */
			setWidth : function ( wid ) {

				var me = this;

				me.callParent ( [ wid ] );

				var fieldWidth = wid;

				if ( ! me.hideLabel ) {
					fieldWidth = wid - me.labelWidth;
				}

				//wzj 2013-07-03添加
				var w = parseInt ( fieldWidth / me.columnSize );

				var tds = me.el.find ( "table.radio-group-table" ).find ( "td" );

				$ ( tds ).each ( function () {
					$ ( this ).width ( w );
				} );

				//wzj 2013-07-03注释
				//$('.radio-group-table',me.el).css("width",fieldWidth);
			},

			/**
			 * 重置单选按钮组
			 * @method reset
			 */
			reset : function () {
				var me = this;
				var val = me.oriValue;
				var obj = me._getRawField ();

				var len = obj.length;

				for ( var i = 0; i < len; i ++ ) {
					if ( obj[ i ].value == val ) {
						$ ( obj[ i ] ).attr ( "checked", true );
						break;
					} else {
						$ ( obj[ i ] ).attr ( "checked", false );
					}
				}
				me.clearError ();
			}
		}
	} );
	FAPUI.register ( "radiogroup", FAPUI.form.RadioGroup );

	return FAPUI.form.RadioGroup;
} );