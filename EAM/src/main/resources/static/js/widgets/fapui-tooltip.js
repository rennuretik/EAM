/**
 *定义FAPUI.Tooltip组件
 *@class FAPUI.Tooltip
 *@extend FAPUI.Component
 */

define ( function ( require, exports, module ) {
	var importcss = "./themes/" + FAPUI.getTheme () + "/css/ui-tooltip.css";

	require.async ( importcss );

	require ( "./fapui-component" );

	FAPUI.define ( "FAPUI.Tooltip", {
		extend : "FAPUI.Component", props : {}, override : {

			/**
			 * 初始化配置项
			 * @private
			 */
			initConfig : function () {
				var me = this;

				me.callParent ();
				this.renderTo = this.renderTo || document.body;
				this.tpl = [ "<div class=\"tooltips\" id=\"${id}\" style=\"display:none;\">",
							"<span class=\"error-title\">&nbsp;</span>",
							"<span class=\"error-content\"></span>",
							"</div>" ].join ( " " );
			},

			/**
			 * 创建根Dom元素
			 * @private
			 * @returns {Object}
			 */
			createDom : function () {
				var me = this;

				me.id = me.id || FAPUI.getId ();
				return juicer ( me.tpl, me );
			},

			/**
			 * 更新提示信息的位置
			 * @method  updatePosition
			 * @param {number} x 左边距离
			 * @param {number} y 顶部距离
			 */
			updatePosition : function ( x, y ) {
				this.el.css ( {
					"top" : y, "left" : x + 2
				} );
				this.el.width ( "auto" );
				this.el.height ( "auto" );
			},

			/**
			 * 更新提示信息的内容
			 * @method  updateErrorMsg
			 * @param {string} msg 错误信息
			 */
			updateErrorMsg : function ( msg ) {
				$ ( ".error-content", this.el ).html ( msg );
			},

			/**
			 * 在指定的位置显示提示信息
			 * @method  showAt
			 * @param {number} x 左边距离
			 * @param {number} y 顶部距离
			 */
			showAt : function ( x, y ) {
				if ( this.el.is ( ":hidden" ) ) {
					this.el.show ();
				}
				this.updatePosition ( x, y );
			},

			/**
			 * 显示提示信息
			 * @method  show
			 */
			show : function () {
				this.el.show ();
				this.el.css ( "z-index", FAPUI.zindex ++ );
			},

			/**
			 * 隐藏提示信息
			 * @method  show
			 */
			hide : function () {
				this.el.hide ();
			},
			/**
			 *
			 * @param {*} w
			 */
			setWidth : function ( w ) {

			},
			/**
			 * 基类方法(设置高度)
			 * @private
			 * @param {number} h
			 */
			setHeight : function ( h ) {

			},
			/**
			 * 渲染提示信息
			 * @method  render
			 * @param {Object} el 目标容器
			 */
			render : function ( el ) {
				var me = this;

				me.callParent ( [ el ] );
				//me.el.append(me.tpl);
			}
		}
	} );

	$ ( function () {
		FAPUI.globalTip = new FAPUI.Tooltip ();
	} );

	return FAPUI.Tooltip;
} );
