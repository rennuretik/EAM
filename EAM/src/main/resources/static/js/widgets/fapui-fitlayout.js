/**
 *鑷�傚簲甯冨眬,濡備笅浣跨敤锛�
 *
 var panel = new FAPUI.Panel({
				title:'Fit甯冨眬绀轰緥',
				titleIconCls:'icon-add',
				collapsable:true,
				layout:null,
				html:'Fit甯冨眬绀轰緥'
			});

 new FAPUI.Layout.FitLayout({
				renderTo:document.body,
				width:900,
				height:600,
				//border:true,
				item:panel
			});
 *
 *@class FAPUI.Layout.FitLayout
 *@extends FAPUI.Component
 */
define ( function ( require, exports, module ) {

	require ( "./fapui-component" );

	FAPUI.define ( "FAPUI.Layout.FitLayout", {
		extend : "FAPUI.Component",
		props : {
			/**
			 *缁勪欢
			 *@property item
			 *@type Component
			 */
			item : {},
			border : false
		},
		override : {
			/**
			 *
			 */
			initConfig : function () {
				this.callParent ();
				this.addEvents ( "resize" );
			},
			/**
			 *
			 * @param {*} el
			 */
			render : function ( el ) {
				this.callParent ( [ el ] );

			},
			/**
			 * 閲婃斁缁勪欢
			 */
			onDestroy : function () {
				var sub = $ ( this.el ).children ();

				if ( sub ) {
					$ ( sub ).each ( function () {
						$ ( this ).remove ();
					} );
				}
				this.callParent ();
			},
			/**
			 * 鍒涘缓dom
			 */
			createDom : function () {
				var me = this;

				this._jsonToWidget ();
				me.id = me.id || FAPUI.getId ();
				var html = [];

				html.push ( "<div id=\"" + me.id + "\" class=\"fit-layout\" " +
					"style=\"border-style:solid;border-color:#99BCE8;overflow:hidden;\">" );
				html.push ( me.item.createDom () );
				html.push ( "</div>" );
				return html.join ( "" );
			},
			/**
			 * 缁戝畾浜嬩欢
			 */
			bindEvent : function () {
				var me = this;

				me.item.bindEvent ();
				me.afterRender ();
			},
			/**
			 * @private
			 */
			afterRender : function () {
				var me = this;

				me.el = me.el || $ ( "#" + me.id );
				this.el.parent ().addClass ( "panel-noscroll" );
				this.el.css ( "border-width", this.border ? "1px" : "0px" );
			},
			/**
			 * 閲嶆柊甯冨眬
			 */
			doLayout : function () {
				if ( this.item ) {
					var p = this.el.parent ();
					var w = p.width ();
					var h = p.height ();

					if ( this.item.border ) {
						this.item.setWidth ( ( this.width ? ( this.width - 2 ) : null ) || w - 2 );
						this.item.setHeight ( ( this.height ? ( this.height - 2 ) : null ) || h - 2 );
					} else {
						this.item.setWidth ( this.width || w );
						this.item.setHeight ( this.height || h );
					}
				}
			},
			/**
			 * @access private
			 * 甯冨眬瀹藉害
			 */
			_doLayoutW : function () {
				if ( this.item ) {
					if ( this.item.border ) {
						this.item.setWidth ( this.width - 2 );
					} else {
						this.item.setWidth ( this.width );
					}
				}
			},
			/**
			 * @access private
			 * 甯冨眬楂樺害
			 */
			_doLayoutH : function () {
				if ( this.item ) {
					if ( this.item.border ) {
						this.item.setHeight ( this.height - 2 );
					} else {
						this.item.setHeight ( this.height );
					}
				}
			},
			/**
			 * 璁剧疆楂樺害
			 */
			setHeight : function ( h ) {
				this.height = h;
				this.el.height ( h );
				this._doLayoutH ();
			},
			/**
			 * 璁剧疆瀹藉害
			 */
			setWidth : function ( w ) {
				this.width = w;
				this.el.width ( w );
				this._doLayoutW ();
			},
			/**
			 * 鑾峰彇楂樺害
			 */
			getHeight : function () {
				return this.height;
			},
			/**
			 * 鑾峰彇瀹藉害
			 */
			getWidth : function () {
				return this.width;
			},
			/**
			 * 鑾峰彇鍐呴儴缁勪欢
			 */
			getItem : function () {
				return this.item;
			},
			/**
			 * @access private
			 * json鏍煎紡鐨勫璞¤浆鎹负闈㈡澘瀵硅薄
			 */
			_jsonToWidget : function () {
				var me = this;

				me.item = FAPUI.create ( me.item );
			},
			/**
			 * 閲婃斁缁勪欢
			 */
			onDestroy : function () {
				var me = this;

				me.item.destroy ();
				me.callParent ();
			}
		}
	} );
	FAPUI.register ( "fitLayout", FAPUI.Layout.FitLayout );

	return FAPUI.Layout.FitLayout;
} );