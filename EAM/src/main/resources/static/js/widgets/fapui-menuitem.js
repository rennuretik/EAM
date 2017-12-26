/**
 *@class FAPUI.MenuItem
 *@extends FAPUI.Component
 */
define ( function ( require, exports, module ) {
	var importcss = "./themes/" + FAPUI.getTheme () + "/css/ui-menuitem.css";

	require.async ( importcss );

	require ( "./fapui-component" );

	require ( "./fapui-menu" );

	FAPUI.define ( "FAPUI.MenuItem", {
		extend : "FAPUI.Component", props : {
			/**
			 *显示的文本
			 *@property text
			 *@type String
			 */
			text : null,

			/**
			 *显示的图标
			 *@property iconCls
			 *@type String
			 */
			iconCls : null,
			/**
			 *子菜单
			 *@property subMenu
			 *@type String
			 */
			subMenu : null, hoverIntent : false, isMenuShow : false
		}, override : {
			/**
			 * @private
			 */
			initConfig : function () {
				this.callParent ();
				this.addEvents ( /**
					 * 点击事件
					 * @event click
					 * @param comp {Object} 组件本身
					 * @param event {Event} 事件对象
					 */
					"click", /**
					 * 鼠标移上去事件
					 * @event mouseover
					 * @param comp {Object} 组件本身
					 * @param event {Event} 事件对象
					 */
					"mouseover", /**
					 * 鼠标离开事件
					 * @event mouseout
					 * @param comp {Object} 组件本身
					 * @param event {Event} 事件对象
					 */
					"mouseout" );
				this.tpl = [ "<div class=\"menuitem-small\">",
							"{@if iconCls!==null}" ,
							"<span class=\"menuitem-icon-default ${iconCls}\"></span>{@/if}",
					"{@if text!==null}<span class=\"menuitem-text\">${text}</span>{@/if}",
					"{@if subMenu!==null}<span class=\"menuitem-submenu\"></span>{@/if}",
					"</div>" ].join ( "" );
				juicer.set ( "cache", true );
				juicer.set ( "errorhandling", false );
				juicer.set ( "strip", true );
				juicer.set ( "detection", false );
				this.createMenu ();
			}, /**
			 * @private
			 */
			render : function ( el ) {
				this.callParent ( [ el ] );
			}, /**
			 * @private
			 * 绑定实事件
			 */
			bindEvent : function () {
				var me = this;

				me.el = me.el || $ ( "#" + me.id );
				me.afterRender ();
			},
			/**
			 * afterRender
			 */
			afterRender : function () {
				var me = this;
				var tmp = $ ( juicer ( this.tpl, me ) );

				tmp.appendTo ( this.el );
				
				var handler = me.handler;

				tmp.click ( function ( event ) {
					handler && handler.call ( me, me, event );
					event.stopPropagation ();
					me.fireEvent ( "click", me, event );
					if ( me.subMenu !== null ) {
						if ( me.hoverIntent === false ) {
							var pos = $ ( this ).offset ();

							if ( me.isMenuShow ) {
								me.subMenu.hide ();
								me.isMenuShow = ! me.isMenuShow;
							} else {
								me.showSubMenu ( pos, $ ( this ) );
								me.subMenu.clicked = true;
								me.isMenuShow = ! me.isMenuShow;
							}
						}
					}
				} ).bind ( "mouseenter", function ( event ) {
					$ ( this ).addClass ( "menuitem-small-hover" );
					me.fireEvent ( "mouseover", me, event );
					if ( me.subMenu && me.hoverIntent === true ) {
						var pos = $ ( this ).offset ();

						me.hideAllMenu ();
						me.showSubMenu ( pos, $ ( this ) );
					} else if ( me.subMenu && me.subMenu.clicked && me.subMenu.clicked === true ) {
						return;
					} else {
						me.hideAllMenu ();
					}
				} ).bind ( "mouseleave", function ( event ) {
					var pos = $ ( this ).offset ();

					$ ( this ).removeClass ( "menuitem-small-hover" );
					me.fireEvent ( "mouseout", me, event );
					if ( me.subMenu && me.hoverIntent === true ) {
						var mousePos = me.getMousePosition ( event );
						var minH = pos.top;
						var menuEl = null;
						var timer = null;

						if ( mousePos.y < minH ) {
							me.subMenu.hide ();
							return;
						}
						menuEl = me.subMenu.el;
						menuEl.bind ( "mouseenter", function () {
							if ( timer ) {
								clearTimeout ( timer );
								timer = null;
							}
						} ).bind ( "mouseleave", function () {
							timer = setTimeout ( function () {
								me.subMenu.hide ();
							}, 100 );
						} );
					}
				} );
			},
			/**
			 *
			 * @returns {string}
			 */
			createDom : function () {
				var me = this;

				me.id = me.id || FAPUI.getId ();
				return "<div id=\"" + me.id + "\" class=\"menuitem-wrap\"></div>";
			},
			/**
			 * createMenu
			 */
			createMenu : function () {
				if ( this.subMenu !== null ) {
					this.subMenu = new FAPUI.Menu ( this.subMenu );
				}
			},
			/**
			 * @param {Object} pos
			 * @param {Object} btn
			 */
			showSubMenu : function ( pos, btn ) {
				this.subMenu && this.subMenu.show ( pos.left, pos.top + btn.outerHeight () + 2 );
			},
			/**
			 * hideAllMenu
			 */
			hideAllMenu : function () {
				$ ( "body>div.ui-menu" ).hide ();
			},
			/**
			 * @returns {boolean}
			 */
			validate : function () {
				return true;
			},
			/**
			 * @param {Object} w
			 */
			setWidth : function ( w ) {

			},
			/**
			 *
			 * @param {Object} h
			 */
			setHeight : function ( h ) {

			},
			/**
			 *
			 * @param {Onject} e
			 * @returns {*}
			 */
			getMousePosition : function ( e ) {
				if ( e.pageX || e.pageY ) {
					return {
						x : e.pageX, y : e.pageY
					};
				}
				return {
					x : e.clientX + document.body.scrollLeft - document.body.clientLeft,
					y : e.clientY + document.body.scrollTop - document.body.clientTop
				};
			}
		}
	} );
	FAPUI.register ( "menuItem", FAPUI.MenuItem );

	return FAPUI.MenuItem;
} );
