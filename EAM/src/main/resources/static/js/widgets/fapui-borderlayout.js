/**
 * BorderLayout布局,如下创建：
 *
 *
 *
 *

 define(function(require) {
	require("jquery");
	require("widgets/fapui-borderlayout");
	require("widgets/fapui-panel");
	$ ( function () {
		var Layout = new FAPUI.Layout.BorderLayout ( {
			renderTo : document.body,
			northregion : {
				height : 120,
				border : false,
				split : true,
				title : "item-north",
				html : "north"
			},
			westregion : {
				width : 200,
				split : true,
				html : "west<br/west</br>west<br/west</br>west<br/west</br>" +
				"west<br/west</br>west<br/west</br>west<br/west</br>west<br/west</br>"
			},
			centerregion : {
				html : "center"
			},
			eastregion : {
				width : 200,
				split : true,
				title : "item-east",
				html : "east"
			},
			southregion : {
				height : 40,
				split : true,
				border : true, //title : 'item-south',
				html : "south"
			}
		} );

	} );

} );
 *
 * @class FAPUI.Layout.BorderLayout
 * @extends FAPUI.Component
 */
define ( function ( require, exports, module ) {

	require ( "./themes/default/css/ui-borderlayout.css" );

	require ( "./fapui-component" );

	require ( "./fapui-dragdrop" );

	require ( "./fapui-resize" );

	require ( "./fapui-panel" );

	FAPUI.define ( "FAPUI.Layout.BorderLayout", {
		extend : "FAPUI.Component",
		override : {
			/**
			 *@private
			 */
			initConfig : function () {
				this.callParent ();
				this.contentTpl = "<div id=\"${id}\" class=\"layout-${position}\" " +
					"{@if style} style=\"${style}\"{@/if}>$${content}</div>";
				this.splitTpl = "<div id=\"${id}\" class=\"horizontal-separator\">" +
								"<span><img class=\"ui-icon ${iconCls}\" src=\"" + FAPUI.BLANK_IMG + "\" /></span></div>";

				this.splitTpl1 = "<div id=\"${id}\"  class=\"vertical-separator\">" +
								"<a href=\"javascript:void(0)\" class=\"separator-a\">" +
								"<img class=\"ui-icon ${iconCls}\" src=\"" + FAPUI.BLANK_IMG + "\" /></a></div>";

				//this.middleTpl = '<div id="${id}"
				// class="layout-middle">${west}${westsplit}${center}${eastsplit}${east}</div>';
			},

			/**
			 *@private
			 */
			createDom : function () {
				var me = this;

				me.id = me.id || FAPUI.getId ();
				var html = [];

				html.push ( "<div id=\"" + me.id + "\" class=\"layout-container\">" );
				if ( this.northregion ) {
					this.northInnerPanel = this._jsonToWidget ( this.northregion );
					var northPaneltpl = juicer ( this.contentTpl, {
						id : FAPUI.getId (),
						position : "north",
						style : this.northregion.height ? "height:" + this.northregion.height + "px;" : "",
						content : this.northInnerPanel.createDom ()
					} );

					html.push ( northPaneltpl );
					if ( this.northregion.split === true ) {
						this.northregion.splitId = FAPUI.getId ();
						var northPanelSplittpl = juicer ( this.splitTpl, {
							id : this.northregion.splitId,
							position : "top",
							iconCls : "ui-con-split-top"
						} );

						html.push ( northPanelSplittpl );
					}

				}
				this.middlePanelId = this.middlePanelId || FAPUI.getId ();
				html.push ( "<div id=\"" + this.middlePanelId + "\" class=\"layout-middle\">" );
				if ( this.westregion ) {
					this.westInnerPanel = this._jsonToWidget ( this.westregion );
					var westPaneltpl = juicer ( this.contentTpl, {
						id : FAPUI.getId (),
						position : "west",
						style : "width:" + this.westregion.width + "px;",
						content : this.westInnerPanel.createDom ()
					} );

					html.push ( westPaneltpl );
					if ( this.westregion.split === true ) {
						this.westregion.splitId = FAPUI.getId ();
						var westPanelSplittpl = juicer ( this.splitTpl1, {
							id : this.westregion.splitId,
							position : "left",
							iconCls : "ui-icon-split-left"
						} );

						html.push ( westPanelSplittpl );
					}
				}
				if ( this.centerregion ) {
					this.centerInnerPanel = this._jsonToWidget ( this.centerregion );
					var centerPaneltpl = juicer ( this.contentTpl, {
						id : FAPUI.getId (),
						position : "center",
						content : this.centerInnerPanel.createDom ()
					} );

					html.push ( centerPaneltpl );
				}
				if ( this.eastregion ) {
					if ( this.eastregion.split) {
						this.eastregion.splitId = FAPUI.getId ();
						var eastPanelSplittpl = juicer ( this.splitTpl1, {
							id : this.eastregion.splitId,
							position : "right",
							iconCls : "ui-icon-split-right"
						} );

						html.push ( eastPanelSplittpl );
					}
					this.eastInnerPanel = this._jsonToWidget ( this.eastregion, this.eastPanel );
					var eastPaneltpl = juicer ( this.contentTpl, {
						id : FAPUI.getId (),
						position : "east",
						style : "width:" + this.eastregion.width + "px;",
						content : this.eastInnerPanel.createDom ()
					} );

					html.push ( eastPaneltpl );
				}
				html.push ( "</div>" );
				if ( this.southregion ) {
					if ( this.southregion.split === true ) {
						this.southregion.splitId = FAPUI.getId ();
						var southPanelSplittpl = juicer ( this.splitTpl, {
							id : this.southregion.splitId,
							position : "bottom",
							iconCls : "ui-icon-split-bottom"
						} );

						html.push ( southPanelSplittpl );
					}
					this.southInnerPanel = this._jsonToWidget ( this.southregion, this.southPanel );
					var southPaneltpl = juicer ( this.contentTpl, {
						id : FAPUI.getId (),
						position : "south",
						style : "height:" + this.southregion.height + "px;",
						content : this.southInnerPanel.createDom ()
					} );

					html.push ( southPaneltpl );
				}
				html.push ( "</div>" );
				return html.join ( "" );
			},
			/**
			 *@private
			 */
			doLayoutH : function () {
				var me = this;
				var north = me.northPanel;
				var south = me.southPanel;
				var h = ( me.height || me.el.height () );

				if ( north && ! north.is ( ":hidden" ) ) {
					h -= north.outerHeight ();
				}
				if ( south && ! south.is ( ":hidden" ) ) {
					h -= south.outerHeight ();
				}
				if ( me.northPanelSplit ) {
					h -= me.northPanelSplit.height ();
				}
				if ( me.southPanelSplit ) {
					h -= me.southPanelSplit.height ();
				}
				//h = h-5;
				h = h - 2;
				me.middlePanel.css ( "height", h );
				h = h - 2;
				if ( me.westInnerPanel ) {
					me.westInnerPanel.setHeight ( h );
				}
				if ( me.centerInnerPanel ) {
					me.centerInnerPanel.setHeight ( h );

				}
				if ( me.eastInnerPanel ) {
					me.eastInnerPanel.setHeight ( h );
				}
				if ( me.westPanel ) {
					me.westPanel.css ( "height", h );
				}
				if ( me.eastPanel ) {
					me.eastPanel.css ( "height", h );
				}
				if ( me.centerPanel ) {
					me.centerPanel.css ( "height", h );
				}
				me.setWindH ( me.centerPanel.height () );
			},
			/**
			 *@private
			 */
			doLayoutW : function () {
				var me = this;

				var west = me.westPanel;
				var east = me.eastPanel;
				var w = me.width || me.el.width ();

				if ( west && ! west.is ( ":hidden" ) ) {
					me.westInnerPanel.doLayoutW ();
					w -= west.outerWidth ();
				}
				if ( east && ! east.is ( ":hidden" ) ) {
					me.eastInnerPanel.doLayoutW ();
					w -= east.outerWidth ();
				}
				if ( me.westPanelSplit ) {
					w -= me.westPanelSplit.width ();
				}
				if ( me.eastPanelSplit ) {
					w -= me.eastPanelSplit.width ();
				}
				w = w - 2;
				if ( me.centerInnerPanel ) {
					me.centerInnerPanel.setWidth ( w );
				}
				me.centerPanel.css ( "width", w );
				//me.setWindW ( me.centerPanel.width () );
			},
			/**
			 *@private
			 */
			doLayout : function () {
				this.doLayoutW ();
				this.doLayoutH ();
			},
			/**
			 *
			 */
			bindEvent : function () {
				var me = this;

				me.el = me.el || $ ( "#" + me.id );
				if ( this.northregion ) {
					me.northInnerPanel.bindEvent ();
					this.northPanel = me.northInnerPanel.el.parent ();
					if ( this.northregion.split === true ) {
						this.northPanelSplit = $ ( "#" + me.northregion.splitId );
						this.northPanel.css ( "border-bottom", "1px solid #99BCE8" );
						this.northPanelSplit.find ( "img" ).click ( function ( event ) {
							if ( $ ( this ).hasClass ( "ui-icon-split-top" ) ) {
								$ ( this ).removeClass ( "ui-icon-split-top" );
								$ ( this ).addClass ( "ui-icon-split-bottom" );
								me.northPanel.hide ();
							} else if ( $ ( this ).hasClass ( "ui-icon-split-bottom" ) ) {
								$ ( this ).removeClass ( "ui-icon-split-bottom" );
								$ ( this ).addClass ( "ui-icon-split-top" );
								me.northPanel.show ();
							}
							me.doLayoutH ();
							event.stopPropagation ();
						} ).mousedown ( function ( event ) {
							event.stopPropagation ();
						} );
						if ( this.northregion.split === true ) {
							if ( this.northregion.expand === false ) {
								this.northPanelSplit = $ ( "#" + this.northregion.splitId );
								var c = this.northPanelSplit.find ( "img" );

								if ( c.hasClass ( "ui-icon-split-top" ) ) {
									c.removeClass ( "ui-icon-split-top" );
									c.addClass ( "ui-icon-split-bottom" );
								}
								this.northPanel.hide ();
								me.doLayoutH();
							}
						}
						var northSplit = this.northPanelSplit;

						/*northSplit.css ( "cursor", "n-resize" );*/
						var nr = new FAPUI.Resize ( {
							el : me.northPanel,
							createHandler : false,
							listeners : {
								/**
								 *
								 * @param {*} c
								 * @param {*} e
								 * @param {*} f
								 */
							/*	resize : function ( c, e, f ) {
									me.northInnerPanel.setHeight ( f.h );
									me.doLayoutH ();
								}*/
							}
						} );

					/*	nr.set ( northSplit, "down" );*/
					}
				}

				this.middlePanel = $ ( "#" + this.middlePanelId );
				if ( this.westregion ) {
					this.westInnerPanel.bindEvent ();
					this.westPanel = this.westInnerPanel.el.parent ();
					if ( this.westregion.split ) {
						this.westPanelSplit = $ ( "#" + this.westregion.splitId );
						this.westPanelSplit.find ( "img" ).click ( function ( event ) {
							var c = $ ( this );

							if ( c.hasClass ( "ui-icon-split-left" ) ) {
								c.removeClass ( "ui-icon-split-left" );
								c.addClass ( "ui-icon-split-right" );
								me.westPanel.hide ();
							} else if ( c.hasClass ( "ui-icon-split-right" ) ) {
								c.removeClass ( "ui-icon-split-right" );
								c.addClass ( "ui-icon-split-left" );
								me.westPanel.show ();
							}
							me.doLayoutW ();
							event.stopPropagation ();
						} ).mousedown ( function ( event ) {
							event.stopPropagation ();
						} );

						var westSplit = this.westPanelSplit;

						/*westSplit.css ( "cursor", "e-resize" ).children ( "a" ).css ( "cursor", "e-resize" );*/
						/*var wr = new FAPUI.Resize ( {
							el : me.westPanel,
							createHandler : false,
							listeners : {
								/!**
								 *
								 * @param {*} c
								 * @param {*} e
								 * @param {*} f
								 *!/
								resize : function ( c, e, f ) {
									me.westInnerPanel.setWidth ( f.w );
									me.doLayoutW ();
								}
							}
						} );
*/
						/*wr.set ( westSplit, "right" );*/
					}
				}

				if ( this.centerregion ) {
					this.centerInnerPanel.bindEvent ();
					this.centerPanel = this.centerInnerPanel.el.parent ();
				}

				if ( this.eastregion ) {
					if ( this.eastregion.split) {
						this.eastPanelSplit = $ ( "#" + this.eastregion.splitId );
						this.eastPanelSplit.find ( "img" ).click ( function ( event ) {
							var c = $ ( this );

							if ( c.hasClass ( "ui-icon-split-left" ) ) {
								c.removeClass ( "ui-icon-split-left" );
								c.addClass ( "ui-icon-split-right" );
								me.eastPanel.show ();
							} else if ( c.hasClass ( "ui-icon-split-right" ) ) {
								c.removeClass ( "ui-icon-split-right" );
								c.addClass ( "ui-icon-split-left" );
								me.eastPanel.hide ();
							}
							me.doLayoutW ();
							event.stopPropagation ();
						} ).mousedown ( function ( event ) {
							event.stopPropagation ();
						} );
					}
					this.eastInnerPanel.bindEvent ();
					this.eastPanel = this.eastInnerPanel.el.parent ();
					if ( this.eastregion.split ) {
						if ( this.eastregion.expand === false ) {
							this.eastPanelSplit = $ ( "#" + this.eastregion.splitId );
							var c = this.eastPanelSplit.find ( "img" );

							if ( c.hasClass ( "ui-icon-split-right" ) ) {
								c.removeClass ( "ui-icon-split-right" );
								c.addClass ( "ui-icon-split-left" );
							}
							this.eastPanel.hide ();
							//me.doLayoutW();
						}
					}
					var eastSplit = this.eastPanelSplit;

					if ( eastSplit ) {
						this.eastPanel.css ( "border-left", "1px solid #99BBE8" );
						eastSplit.css ( "cursor", "e-resize" ).children ( "a" ).css ( "cursor", "e-resize" );
						/*var er = new FAPUI.Resize ( {
							el : me.eastPanel,
							createHandler : false,
							listeners : {
								/!**
								 *
								 * @param {*} c
								 * @param {*} e
								 * @param {*} f
								 *!/
								resize : function ( c, e, f ) {
									me.eastInnerPanel.setWidth ( f.w );
									me.doLayoutW ();
								}
							}
						} );

						er.set ( eastSplit, "left" );*/
					}
				}

				if ( this.southregion ) {
					if ( this.southregion.split === true ) {
						this.southPanelSplit = $ ( "#" + this.southregion.splitId );
						this.southPanelSplit.find ( "img" ).click ( function ( event ) {
							if ( $ ( this ).hasClass ( "ui-icon-split-top" ) ) {
								$ ( this ).removeClass ( "ui-icon-split-top" );
								$ ( this ).addClass ( "ui-icon-split-bottom" );
								me.southPanel.show ();
							} else if ( $ ( this ).hasClass ( "ui-icon-split-bottom" ) ) {
								$ ( this ).removeClass ( "ui-icon-split-bottom" );
								$ ( this ).addClass ( "ui-icon-split-top" );
								me.southPanel.hide ();
							}
							me.doLayoutH ();
							event.stopPropagation ();
						} ).mousedown ( function ( event ) {
							event.stopPropagation ();
						} );
					}
					this.southInnerPanel.bindEvent ();
					this.southPanel = this.southInnerPanel.el.parent ();
					if ( this.southregion.split === true ) {
						if ( this.southregion.expand === false ) {
							this.southPanelSplit = $ ( "#" + this.southregion.splitId );
							var c = this.southPanelSplit.find ( "img" );

							if ( c.hasClass ( "ui-icon-split-bottom" ) ) {
								c.removeClass ( "ui-icon-split-bottom" );
								c.addClass ( "ui-icon-split-top" );
							}
							this.southPanel.hide ();
							me.doLayoutH();
						}
					}
					var southSplit = this.southPanelSplit;

					if ( southSplit ) {
						this.southPanel.css ( "border-top", "1px solid #99BCE8" );
					/*	southSplit.css ( "cursor", "n-resize" );*/
						/*var nr = new FAPUI.Resize ( {
							el : me.southPanel,
							createHandler : false,
							listeners : {
								/!**
								 *
								 * @param {*} c
								 * @param {*} e
								 * @param {*} f
								 *!/
								resize : function ( c, e, f ) {
									me.southInnerPanel.setHeight ( f.h );
									me.doLayoutH ();
								}
							}
						} );

						nr.set ( southSplit, "up" );W*/
					}
				}

			},
			/**
			 *@private
			 */
			render : function ( el ) {
				var me = this;

				this.callParent ( [ el ] );
			},
			/**
			 *设置宽
			 *@method setWidth
			 *@param w {int}
			 */
			setWidth : function ( w ) {
				this.width = w;
				this.northInnerPanel && this.northInnerPanel.setWidth ( w );
				this.northPanel && this.northPanel.width ( w );
				this.southInnerPanel && this.southInnerPanel.setWidth ( w );
				this.southPanel && this.southPanel.width ( w );
				this.el.width ( w );
				this.doLayoutW ();

			},
			/**
			 *获取宽度
			 *@method getWidth
			 */
			getWidth : function () {
				return this.width;
			},
			/**
			 *设置高度
			 *@method setHeight
			 *@param h {int}
			 */
			setHeight : function ( h ) {
				this.height = h;
				//this._setPanelHeight();
				this.el.height ( h );
				this.doLayoutH ();

			},
			/**
			 *获取高度
			 *@method getHeight
			 *
			 */
			getHeight : function () {
				return this.height;
			},
			/**
			 *根据区域返回该区域的组件
			 *@method getRegion
			 *@param region {String} region的值为:"north","south","west","east"
			 */
			getRegion : function ( region ) {
				var me = this;

				switch ( region ) {
					case "north": {
						return me.northInnerPanel;
					}
					case "south": {
						return me.southInnerPanel;
					}
					case "west": {
						return me.westInnerPanel;
					}
					case "east": {
						return me.eastInnerPanel;
					}
					default: {
						return me.centerInnerPanel;
					}
				}
			},
			/**
			 * @access private
			 * 把json格式的数据转换为panel
			 */
			_jsonToWidget : function ( region ) {
				region = new FAPUI.create ( region );
				return region;
			},
			/**
			 *
			 */
			onDestroy : function () {
				var me = this;

				if ( me.northInnerPanel ) {
					me.northInnerPanel.destroy ();
					delete me.northInnerPanel.splitId;
				}
				if ( me.southInnerPanel ) {
					me.southInnerPanel.destroy ();
					delete me.southInnerPanel.splitId;
				}
				if ( me.westInnerPanel ) {
					me.westInnerPanel.destroy ();
					delete me.westInnerPanel.splitId;
				}
				if ( me.eastInnerPanel ) {
					me.eastInnerPanel.destroy ();
					delete me.eastInnerPanel.splitId;
				}
				if ( me.centerInnerPanel ) {
					me.centerInnerPanel.destroy ();
					delete me.centerInnerPanel.splitId;
				}
				me.callParent ();
			},
			/**
			 * 设置当前弹出的window的遮罩在bordery布局中，布局改变以后遮罩宽度
			 */
			setWindW : function ( w ) {
				var me = this;
				var winds = $ ( me.centerPanel ).find ( "iframe" ).contents ().find ( "#window-mask" );

				if ( winds.length > 0 ) {
					winds.css ( "width", w );
				}
			},
			/**
			 * 设置当前弹出的window的遮罩在bordery布局中，布局改变以后遮罩高度
			 */
			setWindH : function ( h ) {
				var me = this;
				var winds = $ ( me.centerPanel ).find ( "iframe" ).contents ().find ( "#window-mask" );

				if ( winds.length > 0 ) {
					winds.css ( "height", h );
				}
			}
		}
	} );

	FAPUI.register ( "borderLayout", FAPUI.Layout.BorderLayout );

	return FAPUI.Layout.BorderLayout;

} );
