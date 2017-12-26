/**
 *定义FAPUI.View.ViewPort组件
 *<p>以下代码将演示如何使用ViewPort组件</p>

 var border = new FAPUI.Layout.BorderLayout({
		northregion:{
			height:80,
			split:true,
			title:"item-north",
			html:"north"
		},
		westregion:new FAPUI.Panel({
			width:200,
			split:true,
			title:"item-west",
			border:false
		}),
		centerregion:{
			border:false
		},
		eastregion:{
			width:245,
			split:true,
			title:"item-east",
			html:"east"
		},
		southregion:{
			height:80,
			split:true,
			title:"item-south",
			html:"south"
		}
	});
 var view = new FAPUI.View.ViewPort({
		renderTo:document.body,
		layout:border
	});

 *@class FAPUI.View.ViewPort
 *@extend FAPUI.Panel
 *@author wzj
 */

define ( function ( require, exports, module ) {

	require ( "./fapui-panel" );

	FAPUI.define ( "FAPUI.View.ViewPort", {
		extend : "FAPUI.Panel", override : {

			/**
			 * 初始化配置项
			 * @private
			 */
			initConfig : function () {
				this.callParent ();
			},

			/**
			 * 改变大小
			 * @private
			 */
			resize : function () {
				var me = this;

				$ ( window ).resize ( function () {
					me.width = $ ( window ).width ();
					me.height = $ ( window ).height ();
					me.el.width ( me.width );
					me.el.height ( me.height );
					me.doLayout ();
				} );
			},

			/**
			 * 渲染组件
			 * @private
			 * @param {Object} el 要渲染的目标对象
			 */
			render : function ( el ) {
				if ( el.tagName === "BODY" ) {
					$ ( "html" ).css ( {
						height : "100%", width : "100%", overflow : "hidden"
					} );
					$ ( "body" ).css ( {
						height : "100%", width : "100%", overflow : "hidden", border : "none"
					} );
				}
				this.callParent ( [ el ] );
				this.resize ();
			},
			/**
			 * 创建DOM元素
			 * @private
			 */
			createDom : function () {
				var me = this;

				me.id = "viewport";
				return "<div id=\"viewport\" class=\"panel-noscroll\" >" + me.initContentDom () + "</div>";
			}, /**
			 * @private
			 * 绑定事件
			 */
			bindEvent : function () {
				var me = this;

				me.el = me.el || $ ( "#" + me.id );
				me.contentEl = me.el;
				me.initContentEvent ();
			}, /**
			 * 计算内容区域的大小
			 * 重写父类的computerSize方法
			 * @private
			 */
			computerSize : function () {
				var me = this;

				if ( this.contentEl ) {
					var p = me.el.parent ();

					p.addClass ( "panel-noscroll" );
					me.width = p.width ();
					me.height = p.height ();
					this.contentEl.height ( this.height );
					this.contentEl.width ( this.width );
				}
			}
		}
	} );
	FAPUI.register ( "viewPort", FAPUI.View.ViewPort );

	return FAPUI.View.ViewPort;
} );