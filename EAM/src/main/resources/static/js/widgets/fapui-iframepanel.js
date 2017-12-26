/**
 *定义FAPUI.IframePanel面板容器
 *<p>以下代码将演示如何使用IframePanel组件</p>
 var panel = new FAPUI.IframePanel({
		renderTo:"box",
		url:"http://www.baidu.com" //目标页面地址
	});

 *@class FAPUI.IframePanel
 *@extend FAPUI.Panel
 */

define ( function ( require ) {
	require ( "./fapui-panel" );
	FAPUI.define ( "FAPUI.IframePanel", {
		extend : "FAPUI.Panel", props : {
			/**
			 * 目标页面地址
			 * @property url
			 * @type String
			 * @default null
			 */
			url : null,

			/**
			 * 面板边框
			 * @property border
			 * @type boolean
			 * @default false
			 */
			border : false
		}, override : {

			/**
			 * 初始化配置对象
			 * @private
			 */
			initConfig : function () {
				this.callParent ();
			}, /**
			 * 渲染组件
			 * @private
			 * @param el目标容器对象
			 */
			render : function ( el ) {
				this.callParent ( [ el ] );
			}, /**
			 *
			 * @returns {string}
			 */
			createContentDom : function () {
				var me = this;

				me.iframeId = me.iframeId || FAPUI.getId ( "iframe" );
				me.name = me.name || me.iframeId;
				var src = me.url || "";

				return "<iframe name=\"" + me.name + "\" id=\"" + me.iframeId + "\"" +
					   " frameborder=\"0\" align=\"middle\" src=" + src + "></iframe>";
			}, /**
			 * 向内容区域嵌入一个页面
			 * @method attachUrl
			 * @param {String} url目标页面地址
			 */
			attachUrl : function ( url ) {
				var me = this;

				me.iframe = me.iframe || $ ( "#" + me.iframeId, me.el );
				me.iframe.attr ( "src", url );
				me.iframe.width ( me.contentEl.width () );
				me.iframe.height ( me.contentEl.height () );
			}, /**
			 * 更新界面
			 * @private
			 * @param url目标页面地址
			 */
			updateFrame : function ( url ) {
				var me = this;

				me.iframe = me.iframe || $ ( "#" + me.iframeId, me.el );
				me.iframe.attr ( "src", url );
			}, /**
			 * @private
			 */
			doLayout : function () {
				var me = this;

				me.iframe = me.iframe || $ ( "#" + me.iframeId, me.el );
				me.computerSize ();
				if ( me.contentEl && me.iframe ) {
					me.iframe.width ( me.contentEl.width () );
					me.iframe.height ( me.contentEl.height () );
					me.iframe.parent ().addClass ( "panel-noscroll" );
					var el = me.iframe.contents ().find ( "body" ).children ( "div:first" );

					if ( el ) {
						el.width ( me.contentEl.width () );
						el.height ( me.contentEl.height () );
					}
				}
			}, /**
			 * @private
			 */
			doLayoutH : function () {
				var me = this;

				me.iframe = me.iframe || $ ( "#" + me.iframeId, me.el );
				me.computerSize ();
				if ( me.contentEl && me.iframe ) {
					me.iframe.height ( me.contentEl.height () );
					me.iframe.parent ().addClass ( "panel-noscroll" );
					var el = me.iframe.contents ().find ( "body" ).children ( "div:first" );

					if ( el ) {
						el.height ( me.contentEl.height () );
					}
				}
			}, /**
			 * @private
			 */
			doLayoutW : function () {
				var me = this;

				me.iframe = me.iframe || $ ( "#" + me.iframeId, me.el );
				me.computerSize ();
				if ( me.contentEl && this.iframe ) {
					me.iframe.width ( this.contentEl.width () );
					me.iframe.parent ().addClass ( "panel-noscroll" );
					var el = me.iframe.contents ().find ( "body" ).children ( "div:first" );

					if ( el ) {
						el.width ( this.contentEl.width () );
					}
				}
			}, /**
			 * @private
			 */
			onDestroy : function () {
				var me = this;
				var iframe = me.iframe || $ ( "#" + me.iframeId, me.el );

				delete me.iframe;
				delete me.iframeId;
				iframe.unbind ();
				iframe[ 0 ].src = "about:blank";
				iframe[ 0 ].contentWindow.document.write ( "" );//清空iframe的内容
				iframe[ 0 ].contentWindow.close ();//避免iframe内存泄漏
				iframe.remove ();
				me.callParent ();
			}
		}
	} );
	FAPUI.register ( "iframepanel", FAPUI.IframePanel );

	return FAPUI.IframePanel;
} );
