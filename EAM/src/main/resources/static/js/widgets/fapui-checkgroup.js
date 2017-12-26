/**
 *复选框,如下创建:
 *
 textField = new FAPUI.form.CheckGroup({
	        	renderTo : document.body,
	            name : 'grage',
	            value : '1',
	            fieldLabel : '等级',
	            labelWidth : 50,
	            allowBlank : false,
	            columnSize : 3,
	            errorMsg : '必选',
	            width : 400,
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
	    			checked : true
	            },{
	      			value : '3',
	    			fieldLabel : '第四级',
	    			itemWidth :50,
	    			checked : false
	           }]
			});
 *
 *@class FAPUI.form.CheckGroup
 *@extends FAPUI.form.RadioGroup
 */
define ( function ( require ) {

	require ( "./fapui-radiogroup" );

	FAPUI.define ( "FAPUI.form.CheckGroup", {
		extend : "FAPUI.form.RadioGroup",
		override : {
			/**
			 * @private
			 */
			render : function ( el ) {

				var me = this;

				me.callParent ( [ el ] );
			},
			/**
			 * @private
			 */
			_vBlank : function () {
				var me = this;

				var flag = me.allowBlank || me.getValue ().length != 0;

				if ( ! flag ) {

					var msg = FAPUI.lang.ERROR_CHECK_MSG.format ();

					me.markError ( msg );
				}
				return flag;
			},
			/**
			 * @private
			 */
			bindEvent : function () {

				var me = this;

				me.callParent ();
			},
			/**
			 * @private
			 */
			_createRow : function () {
				var me = this;
				var itemLength = me.items.length;
				var inputStr = "";
				var oValue = "";
				var strArray = [];

				var cSize = me.columnSize;

				if ( cSize !== 0 && cSize !== 1 ) {
					for ( var i = 0; i < itemLength; i ++ ) {
						if ( i === 0 ) {
							strArray.push ( "<tr>" );
						} else if ( i % cSize === 0 ) {
							strArray.push ( "</tr><tr>" );
						}
						if ( me.items[ i ].checked ) {
							oValue += me.items[ i ].value + ",";
							inputStr = "<input type=checkbox name=\"" + me.name + "\" " +
								"value=\"" + me.items[ i ].value +
								"\" checked=checked></input>";
						} else {
							inputStr = "<input type=checkbox name=\"" + me.name +
								"\" value=\"" + me.items[ i ].value  +
								" \"></input>";
						}
						strArray.push ( "<td style=\"align:left;width:\" + me.items[ i ].itemWidth + \"px;\">" +
							"<label style=\"font-size:12px;margin-top:5px;\">" +
							inputStr + me.items[ i ].fieldLabel +
							"</label></td>" );
					}
					strArray.push ( "</tr>" );
				} else if ( cSize === 1 ) {
					for ( var i = 0; i < itemLength; i ++ ) {
						strArray.push ( "<tr>" );
						if ( me.items[ i ].checked ) {
							oValue += me.items[ i ].value + ",";
							inputStr = "<input type=checkbox name=\"" + me.name + "\" value=\" + me.items" +
								"[ i ].value + \" checked=checked></input>";
						} else {
							inputStr = "<input type=checkbox name=\"" + me.name + "\" value=\" + me.items" +
								"[ i ].value + \"></input>";
						}
						strArray.push ( "<td style=\"align:left;width:\" + me.items[ i ].itemWidth + \"px;\">" +
							"<label style=\"font-size:12px;margin-top:5px;\">" +
							inputStr + me.items[ i ].fieldLabel + "</label></td>" );
						strArray.push ( "</tr>" );
					}
				} else if ( cSize === 0 ) {
					alert ( "[columnSize]列数不能0" );
				}
				me.oldValue = oValue;
				me.oriValue = oValue;
				return strArray.join ( "" ).toString ();
			},
			/**
			 * 获取checkgroup的值
			 * @method getValue
			 * @return {*} 逗号分隔的字符串
			 */
			getValue : function () {
				var me = this;
				var radio = me._getRawField ();
				var len = radio.length;

				var val = "";

				for ( var i = 0; i < len; i ++ ) {
					if ( radio[ i ].checked ) {
						val += radio[ i ].value + ",";
					}
				}
				return val;
			},
			/**
			 * 设置checkgroup的值
			 * @method setValue
			 * @param {*} v 逗号分隔的字符串
			 */
			setValue : function ( v ) {

				var me = this;

				me.value = v;

				var valStr = [];

				valStr = ( String ( v ) ).split ( "," );
				var valLength = valStr.length;

				var obj = me._getRawField ();

				obj.attr ( "checked", false );

				var len = obj.length;

				for ( var i = 0; i < len; i ++ ) {
					for ( var k = 0; k < valLength; k ++ ) {
						if ( obj[ i ].value === valStr[ k ] ) {
							$ ( obj[ i ] ).attr ( "checked", true );
						}
					}
				}
			},
			/**
			 * 设置checkgroup的原始值
			 * @method setValue
			 * @private
			 */
			setOldValue : function () {

				var me = this;

				me.oldValue = "";
				var radio = me._getRawField ();

				var len = radio.length;

				for ( var i = 0; i < len; i ++ ) {
					if ( radio[ i ].checked ) {
						me.oldValue += radio[ i ].value + ",";
					}
				}
			},
			/**
			 * 获取checkgroup的上一次的值
			 * @method setValue
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

				var value = me.oriValue;

				if ( value ) {
					value = value.split ( "," );
					value = value.splice ( value.length - 1, 1 );
					value = value.join ( "," );
				}
				return value;
			},
			/**
			 * 重置checkgroup的值
			 */
			reset : function () {
				var me = this;
				var valStr = [];

				var inputObj = me._getRawField ();

				inputObj.attr ( "checked", false );
				valStr = ( String ( me.oriValue ) ).split ( "," );
				var valueLength = valStr.length;

				var objLength = inputObj.length;

				for ( var i = 0; i < objLength; i ++ ) {
					for ( var k = 0; k < valueLength; k ++ ) {
						if ( inputObj[ i ].value === valStr[ k ] ) {
							$ ( ( me._getRawField () )[ i ] ).attr ( "checked", true );
						}
					}
				}
				me.clearError ();
			}
		}
	} );
	FAPUI.register ( "checkgroup", FAPUI.form.CheckGroup );

	return FAPUI.form.CheckGroup;
} );
