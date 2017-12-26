/**
 *定义FAPUI.form.NumberField数字输入框
 *<p>以下代码将演示如何使用NumberField组件</p>

 var numberField = new FAPUI.form.NumberField({
		renderTo : document.body,
		name : 'userName',
		value : '',
		width : 300,
		allowBlank : false,
		emptyText : '请输入数字',
		errorMsg : '数字不能为空',
		minVal : 0,
		fieldLabel:'请输入数字',
		labelWidth : 100,
		maxVal : 100
	});

 * @class FAPUI.form.NumberField
 *@extend FAPUI.form.TextField
 */

define ( function ( require, exports, module ) {

	require ( "./fapui-textfield" );

	FAPUI.define ( "FAPUI.form.NumberField", {
		extend : "FAPUI.form.TextField",
		props : {

			/**
			 * 允许输入数字的最大值
			 * @property maxVal
			 * @type Number
			 * @default Number.MAX_VALUE
			 */
			maxVal : Number.MAX_VALUE,

			/**
			 * 允许输入数字的最小值
			 * @property minVal
			 * @type Number
			 * @default Number.MIN_VALUE
			 */
			minVal : - Number.MAX_VALUE,

			/**
			 * 小数点位数
			 * @property decimalPrecision
			 * @type Number
			 * @default 2
			 */
			decimalPrecision : 0
		},
		override : {
			/**
			 *
			 */
			initConfig : function () {

				var me = this;

				me.callParent ();
				me.value = parseFloat ( me.value ).toFixed ( me.decimalPrecision );
				me._defaultValue = me.value;
				me.tpl = [ "<div class=\"textfield-container\" id=\"$${id}\">",
							"{@if inputType==\"text\" || inputType == \"password\"} " ,
							"{@if !hideLabel}{@if fieldLabel!=\"\"}", "<span class=\"field-label\"" ,
							" style=\"width:$${labelWidth}px;text-align:${labelAlign};\">$${fieldLabel}{@if !allowBlank}" ,
							"<span class=\"field-required\">*</span>{@/if}$${labelSplit}</span>",
							"{@else if fieldLabel==\"\"}", "<span class=\"field-label\" style=" ,
							"\"width:$${labelWidth}px;text-align:${labelAlign};\"></span>", "{@/if}", "{@/if}",
							"<span class=\"textfield\">", "<input type=\"${inputType}\" style=" ,
							"\"ime-mode:disabled\" name=\"${name}\" value=\"${value}\" class=\"input-default\">" ,
							"</input>", "{@else if inputType==\"hidden\"}", "<input type=\"${inputType}\" " ,
							" name=\"${name}\" value=\"${value}\" class=\"input-default\"></input>", "{@/if}",
							"</span>", "</div>" ].join ( "" );
			},

			/**
			 * 验证所输入的数据是否和最大值最小值符合
			 * @private
			 */
			_vLength : function () {
				var me = this;
				var minValue = me.minVal;
				var maxValue = me.maxVal;
				var val = me.getValue ();
				var numVal = Number ( val );
				//var addStr = "";

				var bicPre = me.decimalPrecision;

				if ( numVal < minValue || numVal > maxValue ) {

					var msg = FAPUI.lang.ERROR_NUMBER_MSG.format ( val, minValue, maxValue, bicPre );

					me.markError ( msg );
					return false;
				}
				return true;
			},
			/**
			 *
			 * @param {*} event
			 */
			onKeydown : function ( event ) {
				if ( event.which == 189 ) {
					var me = this;
					var rawValue = me.getRawValue ();

					var bspoint = me.getLocation ();//获取光标所在的位置

					if ( rawValue.indexOf ( "-" ) != - 1 || bspoint != 0 ) {
						event.preventDefault ();
						return false;
					}
				}
				return true;
			},
			/**
			 *
			 * @param {*} event
			 */
			onKeypress : function ( event ) {
				var me = this;
				var re = /[\d\-]/;
				var rawValue = me.getRawValue ();

				var bspoint = me.getLocation ();//获取光标所在的位置

				if ( rawValue.indexOf ( "." ) != - 1 ) {

					var pointIndex = rawValue.indexOf ( "." );//获取小数点的位置

					if ( bspoint > pointIndex && rawValue.length - pointIndex - 1 >= me.decimalPrecision ) {
						event.preventDefault ();
						return false;
					}
					if ( bspoint > pointIndex + me.decimalPrecision ) {//判断光标所在的位置与小数点位置的距离是否为设置的小数点位置如果是，怎不能再输入
						event.preventDefault ();
						return false;
					}
				}

				if ( re.test ( String.fromCharCode ( event.which ) ) ) {
					return true;
				}
				if ( event.which == 46 && me.decimalPrecision ) {

					var rawValue = me.getRawValue ();

					if ( rawValue.indexOf ( "." ) == - 1 ) {
						return true;
					}
				}
				event.preventDefault ();
				return false;
			},
			/**
			 *
			 */
			getLocation : function () {
				var me = this;

				var elm = me._getRawField ()[ 0 ];

				if ( elm.createTextRange ) { // IE
					if(document.selection){
						var range = document.selection.createRange ();

						if ( range.text.length > 0 ) {
							range.collapse ( true );
						}
						range.setEndPoint ( "StartToStart", elm.createTextRange () );
						return range.text.length;
					}else{
						return 0;
					}
				} else if ( typeof elm.selectionStart == "number" ) { // Firefox
					return elm.selectionStart;
				}
			},

			/**
			 * @private
			 * @param {*} event
			 */
			onKeyup : function ( event ) {

				var me = this;

				me.value = me.getRawValue ();
				var value = String ( me.value );
				var intPart = value.substring ( 0, value.indexOf ( "." ) ) == "" ? value :
					value.substring ( 0, value.indexOf ( "." ) );
				var newValue = me.appendToZero ( me.value );
				var newIntPart = newValue.substring ( 0, newValue.indexOf ( "." ) ) == "" ? newValue :
					newValue.substring ( 0, newValue.indexOf ( "." ) );

				if ( intPart != "-0" && intPart != "-" && intPart != "0" && intPart != newIntPart ) {
					me.setValue ( newValue );
				}
				me.validate ();
			},

			/**
			 * 自定追加0
			 * @private
			 */
			appendToZero : function ( val ) {

				var me = this;

				val = parseFloat ( val ).toFixed ( me.decimalPrecision );
				if ( isNaN ( val ) ) {
					val = "";
				}
				return val;
			},
			/**
			 * 定义输入框的blur事件
			 * @private
			 */
			onBlur : function ( event ) {

				var me = this;

				me.callParent ();
				var v = me.value;

				var v = String ( me.value );

				if ( ! v || v == "" || v == me.emptyText ) {
					v = me.appendToZero ( "" );
				} else {
					v = me.appendToZero ( v );
				}
				me.setValue ( v );
			},

			/**
			 * 设置默认值
			 * @private
			 */
			setDefaultValue : function () {
				var me = this;

				var value = String ( me.value );

				if ( isNaN ( value ) ) {
					$ ( "input", me.el ).addClass ( "input-default-emptyText" );
					me.setRawValue ( me.emptyText );
					return;
				}
				if ( value ) {
					me.setValue ( value );
				} else {
					$ ( "input", me.el ).addClass ( "input-default-emptyText" );
					me.setRawValue ( me.emptyText );
					return;
				}
			},

			/**
			 * 设置输入框值
			 * @method setValue
			 * @param {string} v 输入框值
			 */
			setValue : function ( v ) {
				var me = this;

				var rawValue = me.appendToZero ( v );

				me.value = rawValue;

				var r = me._getRawField ();

				if ( r.hasClass ( "input-default-emptyText" ) ) {
					r.removeClass ( "input-default-emptyText" );
				}

				var f = me._getField ();

				if ( f ) {
					f.val ( me.value );
				}
				r.val ( me.value );
				me.validate ();
			},

			/**
			 * 输入框获取焦点事件处理
			 * @private
			 */
			onFocus : function ( event ) {

				var me = this;

				me.callParent ();

				var v = String ( me.value );

				if ( ! v || v == "" || v == me.emptyText ) {
					me.setRawValue ( "" );
				} else {
					me.setRawValue ( v );
				}
				var r = me._getRawField ()[ 0 ];

				var pos = v.length;

				if ( r.setSelectionRange ) {
					r.setSelectionRange ( pos, pos );
				} else if ( r.createTextRange ) {

					var range = r.createTextRange ();

					range.collapse ( true );
					range.moveEnd ( "character", pos );
					range.moveStart ( "character", pos );
					range.select ();
				}
			}
		}
	} );
	FAPUI.register ( "numberfield", FAPUI.form.NumberField );

	return FAPUI.form.NumberField;
} );