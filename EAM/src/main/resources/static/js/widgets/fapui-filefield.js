/**
*以下代码演示如何创建一个FileField
*
*
*
        new FAPUI.form.FileField({
            itemId : 'uploadFile',
            id : 'Sourcefilepath',
            fieldLabel : '业务信息文件',
            allowBlank : false,
          	errorMsg : '业务信息文件不能为空',
           	name:"enUploadFile",
			labelAlign : 'right',
			labelSplit : ':&nbsp;&nbsp;&nbsp;',
			labelWidth : 100,
			anchor:'70%'
		}),
*@class FAPUI.form.FileField
 *@extend FAPUI.form.TextField
 */
define(function(require, exports, module){
	
	require('./fapui-textfield');
	
	FAPUI.define('FAPUI.form.FileField',{
			extend: 'FAPUI.form.TextField',
			override : {
				/**
				 * 初始化配置项
				 * @private 
				 */
				initConfig : function(){
					var me = this;
					me.callParent();
					me.tpl = [
					          '<div class="textfield-container" id="${id}">',
							   '{@if !hideLabel}',
							   '{@if fieldLabel==""}',
							   '<apan class="field-label" style="width:${labelWidth}px;text-align:${labelAlign};"></span>',
							   '{@else}',
							   '<span class="field-label" style="width:${labelWidth}px;text-align:${labelAlign};">$${fieldLabel}{@if !allowBlank}<span class="field-required">*</span>{@/if}$${labelSplit}</span>',
							   '{@/if}',
							   '{@else}',
							   '<apan class="field-label" style="width:${labelWidth}px;text-align:${labelAlign};"></span>',
							   '{@/if}',
							   '<input type="file" name="${name}" class="browse-file input-default"/>',
							   '</div>'
							   ].join(''),
					juicer.set('cache', true);
					juicer.set('errorhandling', false);
					juicer.set('strip', true);
					juicer.set('detection', false);
				},
				
				/**
		         * 获取存真实值的输入框对象
				 * @private
				 * @returns {Object} 
				 */
				_getField:function(){
					var me = this;
					return me.el.children("input");
				},
				
				/**
		         * 获取存显示值的输入框对象
				 * @private
				 * @returns {Object} 
				 */
				_getRawField:function(){
					var me = this;
					return me.el.children("input");
				},
				/**
				 * 设置输入框宽度
				 * @method setWidth
				 * @param {Number} w输入框宽度
				 */
				setWidth : function(w){
					var me = this;
					me.callParent([w]);
					var fieldWidth = w;
					var input = me.el.children("input");
					if(!me.hideLabel){
						fieldWidth = w - me.labelWidth;
					}
					fieldWidth = fieldWidth-2;
					input.css("width",fieldWidth);
				},
				/**
				 * @private 
				 * file文本框的reset
				 */
				reset:function(){
					var me = this;
					var rawField=me._getRawField();
					var newRawField=rawField.clone(true);
					newRawField.replaceAll(rawField);
				}
			}
		});
		FAPUI.register('filefield',FAPUI.form.FileField);
	
	return FAPUI.form.FileField;
});