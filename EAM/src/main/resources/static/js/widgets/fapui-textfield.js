/*
 * Sunyard.com Inc.
 * Copyright (c) $year-2018 All Rights Reserved.
 */

/**
 *定义FAPUI.form.TextField组件
 *<p>以下代码将演示如何使用TextField组件</p>

 var textField = new FAPUI.form.TextField({
		renderTo : document.body,
		inputType : 'text',
		name : 'userName',
		value : '',
		width : 500,
		fieldLabel : '输入框',
		labelSplit:'()',
		labelWidth : 100,
		allowBlank : false,
		emptyText : 'dddddd',
		errorMsg : '姓名不能为空',
		maskReg : /[^a-zA-Z]/g,
		maxLength : 10,
		minLength : 5
	});

 *@class FAPUI.form.TextField
 *@extend FAPUI.Component
 */

define ( function ( require, exports, module ) {

	var importcss = "./themes/" + FAPUI.getTheme () + "/css/ui-textfield.css";

	require.async ( importcss );

	require ( "./fapui-component" );

	require ( "./fapui-tooltip" );

	FAPUI.define ( "FAPUI.form.TextField", {
		extend : "FAPUI.Component",

		props : {

			/**
			 * 输入框类型,可取值：text和password
			 * @property  inputType
			 * @type String
			 * @default 'text'
			 */
			inputType : "text",

			/**
			 * 输入框name值
			 * @property  name
			 * @type String
			 * @default ''
			 */
			name : "",

			/**
			 * 输入框输入的真实值
			 * @property  value
			 * @type String
			 * @default ''
			 */
			value : "",

			/**
			 * 文本标签与输入框的分隔符
			 * @property  labelSplit
			 * @type String
			 * @default ''
			 */
			labelSplit : "", /**
			 * 保存输入框初始值
			 * @private
			 * @type String
			 * @default ''
			 */
			oriValue : "",

			/**
			 * 输入框提示信息
			 * @property  emptyText
			 * @type String
			 * @default ''
			 */
			emptyText : "",

			/**
			 * 错误提示信息
			 * @property  errorMsg
			 * @type String
			 * @default ''
			 */
			errorMsg : "",

			/**
			 * 输入框是否允许为空
			 * @property  allowBlank
			 * @type boolean
			 * @default true
			 */
			allowBlank : true,

			/**
			 * 输入框自定义正则验证（如果用户想输入要求的值 正则需要写成非-->和要求的相反）
			 * @property  maskReg
			 * @type String
			 * @default null
			 */
			maskReg : null,

			/**
			 * 输入框最大输入值
			 * @private
			 * @type Number
			 * @default Number.MAX_VALUE
			 */
			maxLength : Number.MAX_VALUE,

			/**
			 * 输入框最小输入值
			 * @private
			 * @type Number
			 * @default 0
			 */
			minLength : 0,

			/**
			 * 验证是否通过
			 * @private
			 * @type boolean
			 * @default false
			 */
			isError : false,

			/**
			 * 输入框文本标签
			 * @property  fieldLabel
			 * @type String
			 * @default ''
			 */
			fieldLabel : "",

			/**
			 * 输入框文本标签宽度
			 * @property  labelWidth
			 * @type Number
			 */
			labelWidth : null,

			/**
			 * 输入框总宽度
			 * @property  width
			 * @type Number
			 */
			width : null,

			/**
			 * 输入框文本标签对齐方式
			 * @property  labelWidth
			 * @type String
			 * @default 'riight'
			 */
			labelAlign : "right",

			/**
			 * 输入框文本标签是否隐藏
			 * @property  hideLabel
			 * @type boolean
			 * @default false
			 */
			hideLabel : false,

			/**
			 * 输入框是否为只读
			 * @property  readOnly
			 * @type booleann
			 * @default false
			 */
			readOnly : false,

			/**
			 * 输入框是否禁用
			 * @property  disabled
			 * @type boolean
			 * @default false
			 */
			disabled : false,

			/**
			 * 是否获得焦点
			 * @property isFocus
			 * @type boolean
			 * @default false
			 */
			isFocus : false,

			/**
			 * 是否显示组件
			 * @property display
			 * @type String
			 */
			display : true
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
					 * 输入框获得焦点时触发
					 * @event focus
					 * @param comp {Object} TextField组件本身
					 * @param event {event} 事件对象
					 */
					"focus",

					/**
					 * 输入框失去焦点时触发
					 * @event blur
					 * @param comp {Object} TextField组件本身
					 * @param event {event} 事件对象
					 */
					"blur",

					/**
					 * 输入框输入完键盘弹起时触发
					 * @event keyup
					 * @param comp {Object} TextField组件本身
					 * @param event {event} 事件对象
					 */
					"keyup",

					/**
					 * 输入框输入键盘按下时触发
					 * @event keypress
					 * @param comp {Object} TextField组件本身
					 * @param event {event} 事件对象
					 */
					"keypress",

					/**
					 * 输入框输入键盘按下时触发
					 * @event keydown
					 * @param comp {Object} TextField组件本身
					 * @param event {event} 事件对象
					 */
					"keydown" );
				me.oriValue = me.value;
				me.validateTask = new FAPUI.DelayedTask ( function () {
					me.validate ();
				} );
				me.id = me.id || FAPUI.getId ();
				me.tpl =
					[ "<div class=\"textfield-container\" id=\"$${id}\" style=\"display:{@if display}block{@else}none{@/if}\">",
						"{@if inputType==\"text\" || inputType == \"password\"}", "{@if !hideLabel}",
						"{@if fieldLabel!=\"\"}", "<span class=\"field-label\" ",
						"style=\"width:$${labelWidth}px;text-align:${labelAlign};\">$${fieldLabel}{@if !allowBlank}",
						"<span class=\"field-required\">*</span>{@/if}$${labelSplit}</span>",
						"{@else if fieldLabel==\"\"}", "<span class=\"field-label\" style=\"width:$${labelWidth}",
						"px;text-align:${labelAlign};\"></span>", "{@/if}", "{@/if}", "<span class=\"textfield\">",
						"<input type=\"${inputType}\" ",
						"name=\"${name}\" value=\"${value}\" class=\"input-default\"></input>",
						"{@else if inputType==\"hidden\"}", "<input type=\"${inputType}",
						"\"  name=\"${name}\" value=\"${value}\" class=\"input-default\"></input>", "{@/if}", "</span>",
						"</div>" ].join ( "" )
				juicer.set ( "cache", true );
				juicer.set ( "errorhandling", false );
				juicer.set ( "strip", true );
				juicer.set ( "detection", false );
			},

			/**
			 * 渲染组件
			 * @private
			 * @param {Object} el 目标容器对象
			 */
			render : function ( el ) {
				var me = this;

				me.callParent ( [ el ] );
			},

			/**
			 * 创建DOM元素
			 * @private
			 */
			createDom : function () {
				var me = this;

				me.id = me.id || FAPUI.getId ();
				var tmp = juicer ( me.tpl, me );

				return tmp;
			},

			/**
			 * 获取存真实值的输入框对象
			 * @private
			 * @returns {Object}
			 */
			_getField : function () {
				var me = this;
				var f = $ ( "input", me.el );

				return f.length ===0 ? null : f;
			},



			/**
			 * 获取存显示值的输入框对象
			 * @private
			 * @returns {Object}
			 */
			_getRawField : function () {
				var me = this;
				var f = $ ( "input", me.el );

				return f.length === 0 ? null : f;
			},

			/**
			 * 输入框事件绑定
			 * @private
			 */
			bindEvent : function () {
				var me = this;

				me.el = me.el || $ ( "#" + me.id );
				me.showLabel ( me.hideLabel );
				me.setDefaultValue ();
				me.setDisabled ( me.disabled );
				me.setReadOnly ( me.readOnly );
				//if(me.width){
				//	me.setWidth(me.width)
				//}

				var raw=me._getRawField ()
                raw.blur ( function ( event ) {
					me.fireEvent ( "blur", me, event );
					me.onBlur ( event );
				} );
				raw.focus ( function ( event ) {
					me.fireEvent ( "focus", me, event );
					me.onFocus ( event );
				} );
				raw.keypress ( function ( event ) {
					me.fireEvent ( "keypress", me, event );
					me.onKeypress ( event );
				} );
				raw.keydown ( function ( event ) {
					me.fireEvent ( "keydown", me, event );
					me.onKeydown ( event );
				} );
				raw.mousemove ( function ( event ) {
					if ( me.isError ) {
						me.mouseMove ( event );
					}
				} );
				raw.hover ( function ( event ) {
					me.updateMsg ( me._errorMsg );
					me.mouseOver ();
				}, function ( event ) {
					me.mouseOut ();
				} );

			    raw.keyup ( function ( event ) {
					me.fireEvent ( "keyup", me, event );
					me.onKeyup ( event );
				} );

			}, /**
			 * 设置输入框值
			 * @method setValue
			 * @param {string} v 输入框值
			 */
			setValue : function ( v ) {
				var me = this;

				me.value = v;
				var r = me._getRawField ();

				if ( r.hasClass ( "input-default-emptyText" ) ) {
					r.removeClass ( "input-default-emptyText" );
				}
				var f = me._getField ();

				if ( f ) {
					f.val ( v );
				}
				r.val ( v );
				me.validate ();
			}, /**
			 * 获取输入框值
			 * @method getValue
			 * @return {string}
			 */
			getValue : function () {
				var me = this;
				var f = me._getField ();

				if ( f ) {
					me.value = f.val () === me.emptyText ? "" : f.val ();
				}
				return me.value;
			},

			/**
			 * 获取输入框值的显示值
			 * @method getRawValue
			 * @return {string}
			 */
			getRawValue : function () {
				var me = this;
				var f = me._getRawField ();

				if ( f ) {
					return f.val () === me.emptyText ? "" : f.val ();
				}
				return me.getValue ();
			},

			/**
			 * 设置输入框值的显示值
			 * @method setRawValue
			 * @param {string} v 显示值
			 */
			setRawValue : function ( v ) {
				var me = this;
				var f = me._getRawField ();

				if ( f ) {
					f.val ( v );
				}
			},

			/**
			 * 重置输入框的值
			 * @method reset
			 */
			reset : function () {
				var me = this;
				var val = me.oriValue;

				me.clearError ();
				var rawField = me._getRawField ();

				rawField.addClass ( "input-default-emptyText" );
				if ( val ) {
					me.setValue ( val );
				} else {
					rawField.val ( me.emptyText );
					me._getField ().val ( me.emptyText );
				}
				me.value = val;
			},

			/**
			 * 标记输入框错误信息
			 * @method markError
			 * @param {string} msg 错误信息
			 */
			markError : function ( msg ) {
				var me = this;

				me._errorMsg = msg || me.errorMsg;
				me._getRawField ().addClass ( "validate-failure", me.el );
				if ( ! me.errortip ) {
					me.errortip = FAPUI.globalTip;
				}
				me.isError = false;
			}, /**
			 * 更新错误信息
			 * @private
			 */
			updateMsg : function ( msg ) {
				var me = this;

				msg = msg || me.errorMsg;
				if ( ! me.errortip ) {
					me.errortip = FAPUI.apply ( FAPUI.globalTip );
				}
				me.errortip.updateErrorMsg ( msg );
			}, /**
			 * 清除错误标记
			 * @method clearError
			 */
			clearError : function () {
				var me = this;

				me._getRawField ().removeClass ( "validate-failure", me.el );
				if ( me.errortip ) {
					me.errortip.hide ();
				}
				me.isError = false;
			},

			/**
			 * 验证输入框
			 * @method validate
			 * @return {boolean} true验证通过，false验证未通过
			 */
			validate : function () {
				var me = this;

				if ( me.inpuType === "hidden" || me.hidden ) {
					return true;
				}

				var flag = me._vBlank () && me._vLength () && ( me.custValidate ( me ) ) && me._vMaskReg ();

				me.isError = ! flag;
				if ( ! me.isError ) {
					me.clearError ();
				}
				return ! me.isError;
			}, /**
			 * @access private
			 */
			_vSpecial : function () {
				return true;
			}, /**
			 * 验证自定义正则表达式
			 * @private
			 * @return {boolean} true符合要求,false不符合要求
			 */
			_vMaskReg : function () {
				var me = this;
				var val = me.getValue ();

				if (val.toString().length!==0&& me.maskReg ) {
					me.maskReg.lastIndex = 0;

					var flag = me.maskReg.test ( val )||val.match( me.maskReg );

					if ( ! flag) {
						me.markError ( me.errorMsg || "与自定义的验证表达式不匹配" );
						return false;
					}
				}
				return true;
			},

			/**
			 * 判断输入框长度是否符合要求
			 * @private
			 * @return {boolean} true符合要求，false不符合要求
			 */
			_vLength : function () {
				var me = this;
				var strLength = String ( me.getValue () ).byteLen ();

				if ( strLength > me.maxLength || strLength < me.minLength ) {

					var msg = FAPUI.lang.ERROR_LENGTH_MSG.format ( strLength, me.minLength, me.maxLength );

					me.markError ( msg );
					return false;
				}
				return true;
			},

			/**
			 * 判断输入框是否为空
			 * @private
			 * @return {boolean} true为空，false不为空
			 */
			_vBlank : function () {
				var me = this;
				var flag = me.allowBlank || me.getValue ().length != 0;

				if ( ! flag ) {
					me.markError ( "该输入框不能为空" );
				}
				return flag;
			},

			/**
			 * 设置输入框宽度
			 * @method setWidth
			 * @param {number} wid 输入框宽度
			 */
			setWidth : function ( wid ) {
				var me = this;

				wid = wid || me.width;
				me.callParent ( [ wid ] );
				var fieldWidth = wid;

				if ( ! me.hideLabel ) {
					fieldWidth = wid - me.labelWidth;
				}
				var input = me.el.children ( "span.textfield" ).children ( "input.input-default" );
				var pr = parseInt ( input.css ( "padding-right" ) );

				fieldWidth = fieldWidth - pr - 2;
				input.css ( "width", fieldWidth);
			},

			/**
			 * 用户自定义验证
			 * @method custValidate
			 * @param {*} f
			 * @return {boolean}
			 */
			custValidate : function ( f ) {
				return true;
			},

			/**
			 * 鼠标进入dom范围控制
			 * @private
			 * @param {Event} ev
			 * @return {Object}
			 */
			mousePosition : function ( ev ) {
				if ( ev.pageX || ev.pageY ) {
					return {
						x : ev.pageX, y : ev.pageY
					};
				}
				return {
					x : ev.clientX + document.body.scrollLeft - document.body.clientLeft,
					y : ev.clientY + document.body.scrollTop - document.body.clientTop
				};
			},

			/**
			 * 鼠标移动控制
			 * @private
			 * @param {Event} ev
			 */
			mouseMove : function ( ev ) {
				var me = this;

				ev = ev || window.event;
				var mousePos = me.mousePosition ( ev );

				if ( me.isError && me.errortip ) {
					me.errortip.updatePosition ( mousePos.x, mousePos.y );
				}
			},

			/**
			 * 设置默认值
			 * @private
			 */
			setDefaultValue : function () {
				var me = this;

				if ( ! me.value ) {
					$ ( "input", me.el ).addClass ( "input-default-emptyText" );
					me.setRawValue ( me.emptyText );
					return;
				}
				if ( me.getValue () ) {
					me.setValue ( me.getValue () );
				} else {
					me.setRawValue ( me.emptyText );
				}
			},

			/**
			 * 键盘弹起事件处理
			 * @private
			 */
			onKeyup : function ( event ) {
				var me = this;
				me.validateTask.delay ( 70 );
			}, /**
			 *
			 * @param {*} event
			 */
			onKeydown : function ( event ) {

			}, /**
			 *
			 * @param {*} event
			 */
			onKeypress : function ( event ) {

			}, /**
			 * 输入框失去焦点事件处理
			 * @private
			 */
			onBlur : function ( event ) {
				var me = this;
				me.isFocus = false;
				me._getRawField ().parent ().removeClass ( "input-onfoucs" );
				( String ( me.getValue () ).length === 0 ) && me.applyEmptyText ();
				me.validateTask.delay ( 100 );
			},

			/**
			 * 输入框获取焦点事件处理
			 * @private
			 */
			onFocus : function ( event ) {
				var me = this;

				me.isFocus = true;
				if ( me._getRawField ().hasClass ( "input-default-emptyText" ) ) {
					me._getRawField ().removeClass ( "input-default-emptyText" );
				}
				me._getRawField ().parent ().addClass ( "input-onfoucs" );

				 String ( me.getValue () ).length ===0  && me.clearEmptyText ();
			},

			/**
			 * 设置输入框提示信息
			 * @private
			 */
			applyEmptyText : function () {
				var me = this;
				var rawField = me._getRawField ();

				rawField.addClass ( "input-default-emptyText" );
				rawField.val ( me.emptyText );
			},

			/**
			 * 清空输入框提示信息
			 * @private
			 */
			clearEmptyText : function () {
				var me = this;
				var rawField = me._getRawField ();

				rawField.removeClass ( "input-default-emptyText" );
				rawField.val ( "" );
			},

			/**
			 * 设置输入框是否为空
			 * @method setAllowBlank
			 * @param {boolean} isAllow
			 */
			setAllowBlank : function ( isAllow ) {
				var me = this;

				me.allowBlank = isAllow;
				if ( isAllow ) {
					$ ( ".field-label", me.el ).html ( me.fieldLabel + me.labelSplit );
				} else {
					$ ( ".field-label", me.el ).html ( me.fieldLabel + "<span class=\"field-required\">*</span>" +
													   me.labelSplit );
				}
				me.validate ();
			},

			/**
			 * 设置输入框是否为只读
			 * @method setReadOnly
			 * @param {boolean} rOnly
			 */
			setReadOnly : function ( rOnly ) {
				var me = this;
                var f=me._getRawField ();
				if(f){
					if ( rOnly ) {
						me.readOnly = true;
						f.attr( "readOnly", true );
					} else {
						me.readOnly = false;
						f.attr( "readOnly", false );
					}
				}
			},

			/**
			 * 设置输入框是否禁用
			 * @method setDisabled
			 * @param {boolean} dised
			 */
			setDisabled : function ( dised ) {
				var me = this;
				var f = me._getRawField ();

				if ( f ) {
					if ( dised ) {
						me.disabled = true;
						f.attr ( "disabled", true );
					} else {
						me.disabled = false;
						f.attr ( "disabled", false );
					}
				}
			},

			/**
			 * 鼠标over事件处理
			 * @private
			 */
			mouseOver : function () {
				var me = this;

				if ( me.isError ) {
					if ( me.errortip ) {
						me.errortip.show ();
					}
				}
			},

			/**
			 * 鼠标out事件处理
			 * @private
			 */
			mouseOut : function () {
				var me = this;

				if ( me.isError ) {
					if ( me.errortip ) {
						me.errortip.hide ();
					}
				}
			},

			/**
			 * 销毁输入框及其他组件
			 * 重写父类的destroy方法
			 * @method destroy
			 */
			destroy : function () {
				var me = this;

				delete me.errortip;
				me.callParent ();
			},

			/**
			 * 设置输入框高度
			 * @method setHeight
			 * @param {number} h
			 */
			setHeight : function ( h ) {

			},

			/**
			 * 设置输入框是否可见
			 * @method showLabel
			 * @param {boolean} hide
			 */
			showLabel : function ( hide ) {
				var me = this;

				if ( hide ) {
					$ ( ".field-label", me.el ).hide ();
				} else {
					$ ( ".field-label", me.el ).show ();
				}
				me.hideLabel = hide;
			},

			/**
			 * 设置输入框分隔符标签
			 * @method setFieldLabel
			 * @param {string} label
			 */
			setFieldLabel : function ( label ) {
				var me = this;

				me.fieldLabel = label;
				if ( label == "" ) {
					$ ( ".field-label", me.el ).html ( "" );
				} else {
					$ ( ".field-label", me.el ).html ( label );
				}
			},

			/**
			 * 设置输入框标签宽度
			 * @method setLabelWidth
			 * @param {number} width 标签宽度
			 */
			setLabelWidth : function ( width ) {
				var me = this;

				me.labelWidth = width;
				$ ( ".field-label", me.el ).css ( "width", width);
				me.setWidth ( me.width );
			}, /**
			 * 获取输入框文本标签的宽度
			 * @method getLabelWidth
			 * @returns {number}
			 */
			getLabelWidth : function () {
				return me.labelWidth;
			},

			/**
			 * 显示框获得焦点
			 *
			 */
			focus : function () {
				var me = this;
				var elm = me._getRawField ()[ 0 ];

				elm.focus ();
			}
			/**
			 * 创建根Dom元素
			 * @private
			 * @return {Object}
			 */
			//createBaseDom:function(){
			//    return $();
			//}
		}
	} );
	FAPUI.register ( "textfield", FAPUI.form.TextField );

	return FAPUI.form.TextField;

} );
