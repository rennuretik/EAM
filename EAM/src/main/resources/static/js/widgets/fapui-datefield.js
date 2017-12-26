/**
 *定义日期输入框FAPUI.form.DateField组件
 *<p>以下代码将演示如何使用DateField组件

 new FAPUI.form.DateField({
		renderTo:document.body,
		format:'yyyy-MM-dd hh:mm:ss',
		initDate:new Date(2012,10-1,28),
		width:300,
		showTime:false,
		allowBlank:false,
		readOnly:false,
		disabled:false,
		editable:true,
		errorMsg:'日期不能为空',
		fieldLabel:'日期',
		//selectDates:[new Date(2012,10-1,20),new Date(2012,10-1,10),new Date(2012,10-1,8),new Date(2012,10-1,2)],
		//disableDays:[1,2,3,4,5,6,7,20,21,22,24,31,28],
		minDate:new Date(2012,10-1,20),
		maxDate:new Date(2013,2-1,26)
	});

 *@class FAPUI.form.DateField
 *@extend FAPUI.form.TextField
 */

define ( function ( require, exports, module ) {

	require ( "./fapui-textfield" );

	require ( "./fapui-datepicker" );

	FAPUI.define ( "FAPUI.form.DateField", {
		extend : "FAPUI.form.TextField",
		props : {

			/**
			 * 是否显示时分秒
			 * @property showTime
			 * @type boolean
			 * @default false
			 */
			showTime : false,

			/**
			 * 日期格式
			 * @property format
			 * @type String
			 * @default 'yyyy-MM-dd'
			 */
			format : "yyyy-MM-dd",

			/**
			 * 选择的日期
			 * @property selectDates
			 * @type Array
			 * @default []
			 */
			selectDates : [],

			/**
			 * 不可用的日期
			 * @property disableDays
			 * @type Array
			 * @default []
			 */
			disableDays : [],

			/**
			 * 是否允许编辑
			 * @property editable
			 * @type boolean
			 * @default true
			 */
			editable : true,

			/**
			 * 用户指定的当前日期输入框的最小日期
			 * @property minDate
			 * @type Date
			 * @default null
			 */
			minDate : null,

			/**
			 * 用户指定的当前日期输入框的最大日期
			 * @property maxDate
			 * @type Date
			 * @default null
			 */
			maxDate : null
		},
		override : {

			/**
			 * 初始化配置对象
			 * @private
			 */
			initConfig : function () {
				this.callParent ();
				this.tpl = [ "<div class=\"datefield-container\" id=\"$${id}\">", "{@if !hideLabel}",
							"{@if fieldLabel!=\"\"}", "<span class=\"datefield-label field-label\" " ,
							"style=\"width:${labelWidth}px;text-align:${labelAlign};\">$${fieldLabel}{@if !allowBlank}" ,
							"<span class=\"datefield-required\">*</span>{@/if}$${labelSplit}</span>",
							"{@else if fieldLabel==\"\"}", "<span class=\"datefield-label field-label\" " ,
							"style=\"width:${labelWidth}px;text-align:${labelAlign};\">&nbsp;</span>", "{@/if}",
							"{@/if}", "<span class=\"datefield\">", "<input class=\"datefield-text\" " ,
							"type=\"text\" name=\"${name}\" value=\"${value}\" />",
							"<a class=\"datefield-arrow\" href=\"javascript:void(0);\" hidefocus=\"true\">" ,
							"</a>", "</span>", "</div>" ].join ( "" );
				juicer.set ( "cache", true );
				juicer.set ( "errorhandling", false );
				juicer.set ( "strip", true );
				juicer.set ( "detection", false );
				this.addEvents ( "select" );
			},

			/**
			 * 渲染组件至目标容器
			 * @private
			 * @param {Object} el 目标容器
			 */
			render : function ( el ) {

				var me = this;

				me.callParent ( [ el ] );
			},

			/**
			 * 组件渲染之后的处理
			 * @private
			 */
			afterRender : function () {

				var me = this;

				me.readOnly != undefined && me.setReadOnly ( me.readOnly ), me.disabled != undefined &&
				me.setDisabled ( me.disabled ), me.editable != undefined && me.setEditable ( me.editable );
			},

			/**
			 * 事件绑定处理
			 * @private
			 */
			bindEvent : function () {

				var me = this;

				me.callParent ();
				me.el = me.el || $ ( "#" + me.id );
				$ ( "span.datefield a.datefield-arrow", me.el ).click ( function ( event ) {
					if ( $ ( this ).attr ( "_readOnlyAction" ) == "true" || $ ( this ).attr ( "_disabledAction" ) == "true" ) {
						return;
					}
					if ( me.datePicker && me.datePicker.isVisiable () ) {
						$ ( this ).removeClass ( "datefield-arrow-active" );
						$ ( this ).parent ().removeClass ( "datefield-text-foucs" );
						me._onHideDatePicker ( event );
					} else {
						$ ( this ).addClass ( "datefield-arrow-active" );
						$ ( this ).parent ().addClass ( "datefield-text-foucs" );
						me._onShowDatePicker ( event );
					}
				} );
				me._getRawField ().bind ( "click", function () {
					if ( ! me.readOnly && ! me.editable ) {
						me.el.find ( "a.datefield-arrow" ).trigger ( "click" );
					}

				} );


				//关闭下拉列表
				$ ( document ).bind ( "mousedown", function ( event ) {

					var target = $ ( event.target );

					if (me.el && ! target.is ( "datefield-arrow,div.datepicker-container *" ) ) {
						me.datePicker && me.datePicker.hide ();
						me.el.find ( "span.datefield" ).removeClass ( "datefield-text-foucs" );
						me.el.find ( "span.datefield" ).find ( "a.datefield-arrow" ).removeClass ( "datefield-arrow-active" );
					}
				} );
				me.afterRender ();
			},

			/**
			 * 显示日期
			 * @private
			 */
			_onShowDatePicker : function ( pickerHeight, event ) {
				var me = this;
				var docHeight = $ ( window ).height ();//document.documentElement.offsetHeight;

				if ( ! me.datePicker ) {
					me.datePicker = new FAPUI.Datepicker ( {
						renderTo : document.body,
						initDate : me.initDate,
						showTime : me.showTime,
						selectDates : me.selectDates,
						disableDays : me.disableDays,
						minDate : me.minDate,
						maxDate : me.maxDate,
						listeners : {
							"selectDay" : me._onSelectDay,
							"clear" : me._onClear,
							"close" : me._onClose,
							"confirm" : me._onConfirm,
							"today" : me._onToday,
							scope : me
						}
					} );
					me.pickerHeight = me.datePicker.getHeight ();
				}
				me.datePicker.show ();

				var input = me._getRawField ();
				var top = input.offset ().top;

				me.datePicker.setPosition ( input.offset ().left, top + input.height () + 3 );

				//日期面板弹出位置边界控制

				var maxHeight = docHeight - me.pickerHeight - input.height () - 5;

				top > maxHeight && me.datePicker.el.css ( "top", - me.pickerHeight + top - 3 );
			},

			/**
			 * 隐藏日期
			 * @private
			 */
			_onHideDatePicker : function ( event ) {

				var me = this;

				if ( me.datePicker ) {
					me.datePicker.hide ();
				}
			},

			/**
			 * 选择日期
			 * @private
			 */
			_onSelectDay : function ( dp, oldDays, now ) {
				var me = this;
				var _date = dp.getCurrentDate ();

				var value = _date.format ( me.format );

				if ( ! me.showTime ) {
					me.setValue ( value );
					me.datePicker.hide ();
					me.onFocus ();
					me.fireEvent ( "select", me, _date );
				}
			},

			/**
			 * 清除选择的日期
			 * @private
			 */
			_onClear : function (  ) {

				var me = this;

				me.reset ();
			},

			/**
			 * 关闭日期选择框
			 * @private
			 */
			_onClose : function (  ) {

			},
			mouseOver:function(){

			},
			mouseOut:function(){

			},
			onFocus:function(){
				var me=this;
				if ( me.isError ) {
					if ( me.errortip ) {
						me.errortip.hide ();
					}
				}
			},

			/**
			 * 点击确定之后的处理
			 * @private
			 */
			_onConfirm : function ( dp ) {
				var me = this;
				var _date = dp.getCurrentDate ();

				var value = _date.format ( me.format );

				me.setValue ( value );
				me.onFocus ();
				me.fireEvent ( "select", me, _date );
			},

			/**
			 * 点击今天之后的处理
			 * @private
			 */
			_onToday : function ( dp ) {
				var me = this;

				var value = new Date ().format ( me.format );

				me.setValue ( value );
				me.onFocus ();
			},

			/**
			 * 获取存日期真实值的输入框
			 * @private
			 */
			_getField : function () {
				var me = this;

				var f = $ ( "input.datefield-text", me.el );

				return f.length === 0 ? null : f;
			},

			/**
			 * 获取存日期显示值的输入框
			 * @private
			 */
			_getRawField : function () {
				var me = this;

				var f = $ ( "input.datefield-text", me.el );

				return f.length ===0 ? null : f;
			},

			/**
			 * 日期输入框失去焦点的处理
			 * @private
			 */
			onBlur : function ( event ) {

				var me = this;
				var me = this;
				var val = String ( me.getValue () );
				if(val&&val.length===8){
					var v=(val.substr(0,4)+"-"+val.substr(4,2)+"-"+val.substr(6,2));
					me.setValue ( v);
				}
				me.callParent ( [ event ] );
				if ( me.isError ) {
					if ( me.errortip ) {
						me.errortip.show ();
					}
				}
				( function () {
					if ( me.datePicker ) {
						me.datePicker.hide ();
					}
				} ).defer ( 200 );
			},

			/**
			 * 键盘弹起时的处理
			 * @private
			 */
			onKeyup : function ( event ) {
				var me = this;

				var val = String ( me.getValue () );

				val = val.replace ( /[^\d\.\:\-\/\s]/g, "" );
				//me.setValue ( val );键盘弹起时不需要设置值

				me.callParent ();
			},

			/**
			 * 设置日期输入框的宽度
			 * @method setWidth
			 * @param {number} wid
			 */
			setWidth : function ( wid ) {

				var me = this;

				me.width = wid;
				me.callParent ( [ wid ] );

				var fieldWidth = wid;

				if ( ! me.hideLabel ) {
					fieldWidth = wid - me.labelWidth;
				}
				//if($.browser.msie) fieldWidth -=5;//IE下偏差5像素
				me._getRawField ().width ( fieldWidth - 18 - 5 );
			},

			/**
			 * 设置输入框是否可编辑
			 * @method setEditable
			 * @param {boolean} flag
			 */
			setEditable : function ( flag ) {

				var me = this;

				if ( ! me.readOnly ) {
					if ( flag ) {
						me._getRawField ().attr ( "readOnly", false );
					} else {
						me._getRawField ().attr ( "readOnly", true );
					}
					me.editable = flag;
				}
			},

			/**
			 * 设置输入框是否只读
			 * @method setReadOnly
			 * @param {boolean} flag
			 */
			setReadOnly : function ( flag ) {

				var me = this;

				me.callParent ( [ flag ] );
				me.el.find ( "a.datefield-arrow" ).attr ( "_readOnlyAction", flag );
			},

			/**
			 * 设置输入框是否禁用
			 * @method setDisabled
			 * @param {boolean} flag
			 */
			setDisabled : function ( flag ) {

				var me = this;

				me.callParent ( [ flag ] );
				me.el.find ( "a.datefield-arrow" ).attr ( "_disabledAction", flag );
			},

			/**
			 * 设置日期输入框的最小日期
			 * @method setMinDate
			 * @param {Date} d
			 */
			setMinDate : function ( d ) {

				var me = this;

				me.minDate = d;
				if ( me.datePicker ) {
					me.datePicker.setMinDate ( d );
				}
			},

			/**
			 * 设置日期输入框的最大日期
			 * @method setMaxDate
			 * @param {Date} d
			 */
			setMaxDate : function ( d ) {

				var me = this;

				me.maxDate = d;
				if ( me.datePicker ) {
					me.datePicker.setMaxDate ( d );
				}
			},

			/**
			 * 销毁组件
			 * @private
			 */
			destroy : function () {

				var me = this;

				if ( me.datePicker ) {
					me.datePicker.destroy ();
					delete me.datePicker;
				}
				me.callParent ();
			},
			/**
			 * 创建根Dom
			 * @private
			 * @returns {Object}
			 */
			createBaseDom : function () {
				return $ ( "</div>" );
			}
		}
	} );

	FAPUI.register ( "datefield", FAPUI.form.DateField );

	return FAPUI.form.DateField;
} );