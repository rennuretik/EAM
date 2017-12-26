/**
 * 以下是使用方法
 * var dialog = new FAPUI.ModalDialog({
 * 		url : "",
 * 		width : 300,
 * 		height : 400
 * });
 * dialog.showDialog();
 */
/**
 * 定义fapui中的模拟模态窗口
 *
 **/

define ( function ( require, exports, module ) {

	require ( "./fapui-window" );
	require ( "./fapui-iframepanel" );
	require ( "./fapui-fitlayout" );

	FAPUI.define ( "FAPUI.ModalDialog", {
		extend : "FAPUI.Window",

		/**
		 * 定义modaldialog属性
		 */
		props : {
			/**
			 * 窗口url
			 * @property url
			 * @type string
			 * @default ""
			 */
			url : "", /**
			 * 窗口名称
			 * @property name
			 * @type string
			 * @default ""
			 */
			name : "",

			/**
			 * 窗口id
			 * @property iframeId
			 * @type string
			 * @default ""
			 */
			iframeId : ""
		}, override : {
			/**
			 * 打开窗口
			 *  @method open
			 */
			showDialog : function () {
				var me = this;

				me.open ();
			}, /**
			 * 关闭窗口
			 *  @method open
			 */
			closeDialog : function () {
				var me = this;

				me.close ();
			}, /**
			 * 刷新或者更新頁面
			 * @method refreshIframe
			 */
			refreshIframe : function ( url ) {
				var me = this;

				url = url || me.url;
				me.iframe.updateFrame ( url );
			}, /**
			 * 初始化内容
			 * 配置fitlayout
			 * @private
			 */
			initContentDom : function () {
				var me = this;
				var cfg = {};

				me.pId = FAPUI.getId ();
				cfg.pId = me.pId;
				cfg.bodyCls = me.bodyCls;

				var ifr = new FAPUI.IframePanel ( {
					url : me.url,
					name : me.name,
					iframeId : me.iframeId,
					border : false,
					width : me.width,
					height : me.height
				} );

				me.iframe = ifr;

				this.layout = new FAPUI.Layout.FitLayout ( {
					item : ifr, border : false
				} );
				cfg.html = this.layout.createDom ();
				return juicer ( me.contenttpl, cfg );
			}, /**
			 * 获取当前iframe
			 * @method getIframe
			 */
			getIframe : function () {
				var me = this;

				return $ ( "#" + me.iframe.iframeId, me.el );
			}, /**
			 * 关闭iframe，触发close事件，将当前关闭的iframeJquery对象作为参数传递得当前触发的close事件方法
			 * @param boolean closed 如果closed为true，则销毁当前iframe组件
			 * @method close
			 */
			close : function ( closed ) {
				var me = this;

				closed = closed || me.closed;
				var ifa = $ ( "#" + me.iframe.iframeId, me.el );

				if ( closed ) {
					me.mask && me.mask.remove ();
					me.fireEvent ( "close", ifa );
					me.destroy ();
					me.isRendered = false;
				} else {
					me.mask && me.mask.hide ();
					me.hide ();
					me.fireEvent ( "close", ifa );
				}
				me = null;
			}
		}
	} );

	FAPUI.register ( "modaldialog", FAPUI.ModalDialog );

	return FAPUI.ModalDialog;
} );