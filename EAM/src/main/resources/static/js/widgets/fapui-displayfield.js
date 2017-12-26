/*
 * Sunyard.com Inc.
 * Copyright (c) $year-2018 All Rights Reserved.
 */

/**
 * 定义FAPUI.form.DisplayField显示组件
 * @description
 *<p>以下代码将演示如何使用CompositeField组件</p>
 */

define ( function ( require ) {

	require ( "./fapui-component" );

	FAPUI.define ( "FAPUI.form.DisplayField", {
		extend : "FAPUI.Component", props : {
			/**
			 * 小数点位数
			 * @property value
			 * @type String
			 * @default ""
			 */
			value : ""
		}, override : {
			/**
			 * 创建DOM元素
			 * @private
			 */
			createDom : function () {
				var me = this;

				me.id = me.id || FAPUI.getId ();
				var value = me.value || "";

				return "<div id=" + me.id + " class=\"diplay-field\">" + value + "</div>";

			},

			setText : function ( text ) {
				var me = this;

				$ ( me.id ).text ( text );
			}
		}
	} );

	FAPUI.register ( "displayfield", FAPUI.form.DisplayField );

	return FAPUI.form.DisplayField;
} );

