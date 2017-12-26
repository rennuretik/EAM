/*
 * Sunyard.com Inc.
 * Copyright (c) $year-2018 All Rights Reserved.
 */

/**
 *定义FAPUI.Text组件
 *<p>以下代码将演示如何使用TextField组件</p>

 var text = new FAPUI.Text({
		renderTo : document.body,
		text : '',
		width : 500,
		lable : '输入框',
		labelSplit:'()',
		labelWidth : 100
	});

 *@class FAPUI.Text
 *@extend FAPUI.Component
 */

define ( function ( require, exports, module ) {

	var importcss = "./themes/" + FAPUI.getTheme () + "/css/ui-text.css";

	require.async ( importcss );

	require ( "./fapui-component" );


	FAPUI.define ( "FAPUI.Text", {
		extend : "FAPUI.Component",

		props : {

			/**
			 * 显示的真实值
			 * @property  value
			 * @type String
			 * @default ''
			 */
			text : "",

			/**
			 * 文本标签与输入框的分隔符
			 * @property  labelSplit
			 * @type String
			 * @default ''
			 */
			labelSplit : "",


			/**
			 * 文本标签
			 * @property  fieldLabel
			 * @type String
			 * @default ''
			 */
			label : "",

			/**
			 * 文本标签宽度
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
			 * 文本标签对齐方式
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
			hideLabel : false

		},

		override : {

			/**
			 * 初始化配置项
			 * @private
			 */
			initConfig : function () {
				var me = this;

				me.callParent ();

				me.addEvents ();
				me.id = me.id || FAPUI.getId ();
				me.tpl = [ "<div class=\"text-container\" id=\"$${id}\">", "{@if !hideLabel}", "{@if fieldLabel!=\"\"}",
					"<span class=\"field-label\" ",
					"style=\"width:$${labelWidth}px;text-align:${labelAlign};\">$${fieldLabel}",
					"$${labelSplit}</span>", "{@else if fieldLabel==\"\"}",
					"<span class=\"field-label\" style=\"width:$${labelWidth}",
					"px;text-align:${labelAlign};\"></span>{@/if}{@/if}", "<span class=\"text\">",
					"${text}</span>", "</div>" ].join ( "" ), juicer.set ( "cache", true );
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
				$ ( ".field-label", me.el ).css ( "width", width );
				me.setWidth ( me.width );
			}, /**
			 * 获取输入框文本标签的宽度
			 * @method getLabelWidth
			 * @returns {number}
			 */
			getLabelWidth : function () {
				var me = this;
				return me.labelWidth;
			}

		}
	} );
	FAPUI.register ( "text", FAPUI.Text );

	return FAPUI.Text;

} );
