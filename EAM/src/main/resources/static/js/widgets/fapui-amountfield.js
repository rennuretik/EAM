/**
 * UI组件
 * @module widgets
 */

/**
 * 金额输入框,如下创建：
 *
 define(function(require) {
	require("jquery");
	require("widgets/fapui-amountfield");
	$ ( function () {
		var amountField = new FAPUI.form.AmountField ( {
			renderTo : document.body,
			name : "userAmount",
			value : "4444444",
			width : 500,
			allowBlank : false,
			emptyText : "请输入金额",
			errorMsg : "金额不能为空",
			fieldLabel : "请输入金额",
			labelWidth : 200,
			minVal : 0,
			maxVal : 1000000000,
		} );

	} );
} );
 *
 * @class FAPUI.form.AmountField
 * @extends FAPUI.form.NumberField
 *
 */
define ( function ( require, exports, module ) {

	require ( "./fapui-numberfield" );

	FAPUI.define ( "FAPUI.form.AmountField", {
		extend : "FAPUI.form.NumberField",
		props : {
			/**
			 * 输入框显示name名称
			 * @property  name
			 * @type String
			 */
			name : "",

			/**
			 * 金额输入框金额符号如人民币￥美元$等,默认值为:¥
			 * @property amtTag
			 * @type String
			 *
			 */
			amtTag : "¥",

			/**
			 * 输入框真实name名称
			 * @property  realName
			 * @type String
			 */
			realName : "",
			/**
			 * 输入框数字是否转换为大写
			 * @property  isChanese
			 * @type boolean
			 */
			isChanese : false,
			/**
			 * 小数点位数
			 * @property decimalPrecision
			 * @type Number
			 * @default 2
			 */
			decimalPrecision : 2
		},
		override : {
			/**
			 * 初始化配置
			 * @private
			 */
			initConfig : function () {
				var me = this;

				me.callParent ();
				me.tpl = [ "<div class=\"textfield-container\" id=\"${id}\">",
							"<input type=\"hidden\" name=\"${realName}\" value=\"${value}\" " ,
							"class=\"input-default-hidden\"></input>", "{@if !hideLabel}", "{@if fieldLabel!=\"\"}",
							"<span class=\"field-label\" style=" ,
							"\"width:${labelWidth}px;text-align:${labelAlign};\">$${fieldLabel}{@if !allowBlank}" ,
							"<span class=\"field-required\">*</span>{@/if}$${labelSplit}</span>",
							"{@else if fieldLabel==\"\"}", "<span class=\"field-label\" style=" ,
							"\"width:${labelWidth}px;text-align:${labelAlign};\">&nbsp;</span>", "{@/if}", "{@/if}",
							"<span class=\"textfield\"><input type=\"${inputType}\" style=\"ime-mode:" ,
							"disabled\" name=\"${name}\" value=\"${value}\" class=\"input-default input-default-amount\">" ,
							"</input></span>", "</div>" ].join ( "" );
			},

			/**
			 * @private
			 *
			 */
			_getField : function () {
				var me = this;
				var f = $ ( ".input-default-hidden", me.el );

				return f.length == 0 ? null : f;
			},

			/**
			 * @private
			 *
			 */
			_getRawField : function () {
				var me = this;
				var f = $ ( ".input-default-amount", me.el );

				return f.length == 0 ?null: f;
			},

			/**
			 * @private
			 */
			amountFormat : function ( va ) {
				var me = this;

				if ( va ) {
					if ( me.isChanese ) {
						return me.chaneseForward ( va );
					} else {
						var formatStr = va.replace ( /[^\d\.\-]/g, "" ).replace ( /(\.\d{2}).+$/,
							"$1" ).replace ( /^0+([1-9])/, "$1" ).replace ( /^0+$/, "0" );
						var matText = formatStr.split ( "." );

						while ( /\d{4}(,|$)/.test ( matText[ 0 ] ) ) {
							matText[ 0 ] = matText[ 0 ].replace ( /(\d)(\d{3}(,|$))/, "$1,$2" );
						}
						return me.amtTag + matText[ 0 ] + ( matText.length > 1 ? "." + matText[ 1 ] : "" );
					}
				}
			},
			/**
			 * @private
			 * @param {*} num
			 */
			chaneseForward : function ( num ) {
				var strOutput = "";
				var strUnit = "仟佰拾亿仟佰拾万仟佰拾元角分";

				num += "00";
				var intPos = num.indexOf ( "." );

				if ( intPos >= 0 ) {
					num = num.substring ( 0, intPos ) + num.substr ( intPos + 1, 2 );
				}
				strUnit = strUnit.substr ( strUnit.length - num.length );
				for ( var i = 0; i < num.length; i ++ ) {
					strOutput += "零壹贰叁肆伍陆柒捌玖".substr ( num.substr ( i, 1 ), 1 ) + strUnit.substr ( i, 1 );
				}
				var result = strOutput.replace ( /零角零分$/, "整" ).replace ( /零[仟佰拾]/g, "零" ).replace ( /零{2,}/g,
					"零" ).replace ( /零([亿|万])/g, "$1" ).replace ( /零+元/, "元" ).replace ( /亿零{0,3}万/,
					"亿" ).replace ( /^元/, "零元" );

				return result;
			}
		},
		/**
		 *
		 * @param {*} num
		 */
		chineseForward2 : function ( num ) {
			var AA = new Array ( "零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖" );
			var BB = new Array ( "", "拾", "佰", "仟", "萬", "億", "圆", "" );
			var CC = new Array ( "角", "分", "厘" );
			var a = ( String( num ) ).replace ( /(^0*)/g, "" ).split ( "." );
			var k = 0;
			var re = "";

			for ( var i = a[ 0 ].length - 1; i >= 0; i -- ) {
				switch ( k ) {
					case 0 : {
						re = BB[ 7 ] + re;
						break;
					}
					case 4 : {
						if ( ! new RegExp ( "0{4}\\d{" + ( a[ 0 ].length - i - 1 ) + "}$" ).test ( a[ 0 ] ) ) {
							re = BB[ 4 ] + re;
						}
						break;
					}
					case 8 : {
						re = BB[ 5 ] + re;
						BB[ 7 ] = BB[ 5 ];
						k = 0;
						break;
					}
				}
				if ( k % 4 == 2 && a[ 0 ].charAt ( i ) == "0" && a[ 0 ].charAt ( i + 2 ) != "0" ) {
					re = AA[ 0 ] + re;
				}
				if ( a[ 0 ].charAt ( i ) != 0 ) {
					re = AA[ a[ 0 ].charAt ( i ) ] + BB[ k % 4 ] + re;
				}
				k ++;
			}
			if ( a.length > 1 ) {
				re += BB[ 6 ];
				for ( var i = 0; i < a[ 1 ].length; i ++ ) {
					re += AA[ a[ 1 ].charAt ( i ) ] + CC[ i ];
					if ( i == 2 ) {
						break;
					}
				}
			}
			if ( a[ 1 ].charAt ( 0 ) == "0" && a[ 1 ].charAt ( 1 ) == "0" ) {
				re += "元整";
			}
			else {
				re += "元整";
			}
			return re;
		},

		/**
		 * 设置默认值
		 * @private
		 */
		setDefaultValue : function () {
			var me = this;
			var value = String ( me.value );

			if ( value ) {
				me.setValue ( value );
			} else {
				$ ( "input", me.el ).addClass ( "input-default-emptyText" );
				me.setRawValue ( me.emptyText );
				return ;
			}

		},
		/**
		 * @private
		 * @param {*} event
		 */
		onKeyup : function ( event ) {
			var me = this;
			me.value = me.getRawValue ();
			var f = me._getField ();

			f.val ( me.value );
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
			if ( me.isFocus ) {
				r.val ( me.value );
			} else {
				r.val ( me.amountFormat ( me.value ) );
			}
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
	} );
	FAPUI.register ( "amountfield", FAPUI.form.AmountField );

	return FAPUI.form.AmountField;
} );