/**
 *定义FAPUI.form.TextArea组件
 *<p>以下代码将演示如何使用TextArea组件</p>

 var textField = new FAPUI.form.TextArea({
		   renderTo : "aa",
		   name : 'userName',
		   value : '',
		   width : 500,
		   height:100,
		   //fieldLabel : '输入框',
		   labelWidth : 100,
		   allowBlank : false,
		   emptyText : 'dddddd',
		   errorMsg : '姓名不能为空',
		   maskReg : /[^a-zA-Z]/g
		});
 });
 textField.reset();
 textField.setValue('sunznxkng');

 *@class FAPUI.form.TextArea
 *@extend FAPUI.form.TextField
 */

define ( function ( require) {

	require ( "./fapui-textfield" );

	FAPUI.define ( "FAPUI.form.TextArea", {
		extend : "FAPUI.form.TextField",
		props : {
			/**
			 * 初始化高度(默认值30)
			 * @property height
			 * @type int
			 * @default 30
			 */
			height : 30
		},
		override : {

			/**
			 * 初始化配置项
			 * @private
			 */
			initConfig : function () {

				var me = this;

				me.callParent ();
				me.tpl = [ "<div class=\"textfield-container textarea-container\" id=\"${id}\">", "{@if !hideLabel}",
							"{@if fieldLabel!=\"\"}", "<span class=\"field-label\" " ,
							"style=\"width:${labelWidth}px;text-align:${labelAlign};\">$${fieldLabel}{@if !allowBlank}",
							"<span class=\"field-required\">*</span>{@/if}$${labelSplit}</span>",
							"{@else if fieldLabel==\"\"}", "<span class=\"field-label\" " ,
							"style=\"width:${labelWidth}px;text-align:${labelAlign};\">&nbsp;</span>", "{@/if}",
							"{@/if}", "<textarea  name=\"${name}\" value=\"${value}\" class=\"input-default\" >" ,
							"${value}</textarea>", "</div>" ].join ( "" );
			},

			/**
			 *
			 */
			bindEvent : function () {

				var me = this;

				me.callParent ();
				if ( me.height ) {
					me.setHeight ( me.height );
				}
			},

			/**
			 * 获取存真实值的输入框对象
			 * @private
			 * @returns {Object}
			 */
			_getField : function () {
				var me = this;

				var f = $ ( "textarea", me.el );

				return f.length === 0 ? null : f;
			},

			/**
			 * 获取存显示值的输入框对象
			 * @private
			 * @returns {Object}
			 */
			_getRawField : function () {
				var me = this;

				var f = $ ( "textarea", me.el );

				return f.length === 0 ? null : f;
			},

			/**
			 *
			 * @param {*} wid
			 */
			setWidth : function ( wid ) {

				var me = this;

				me.callParent ( [ wid ] );

				var fieldWidth = wid;

				if ( ! me.hideLabel ) {
					fieldWidth = wid - me.labelWidth;
				}
				if ( $.browser.msie ) {
					fieldWidth -= 5;//IE下偏差5像素
				}
				else {
					fieldWidth -= 3;
				}
				$ ( me.el.children ( "textarea" ) ).css ( "width", fieldWidth );
			},

			/**
			 * 设置输入框高度
			 * @method setHeight
			 * @param {number} hght
			 */
			setHeight : function ( hght ) {
				var me = this;
				//me.callParent(height);
				hght = hght || me.height;
				me._getRawField ().height ( hght );
				me.height = hght;
			},
			/**
			 * 获取当前文本域的高度
			 * @method getHeight
			 */
			getHeight : function () {

				var me = this;

				return me.height;
			},
			/**
			 * 隐藏textarea
			 * @method hide
			 */
			hide : function () {

				var me = this;

				me.el.css ( "display", "none" );
			},
			/**
			 * 显示textarea
			 * @method show
			 */
			show : function () {

				var me = this;

				me.el.css ( "display", "block" );
			}
		}
	} );

	FAPUI.register ( "textarea", FAPUI.form.TextArea );
	return FAPUI.form.TextArea;
} );