/**
 *菜单组件,如下创建：
 *
 new FAPUI.Menu({
				renderTo:"ad",
				items:[{
					text:"JavaScript 学习",
					icons:"ui-icon-collapse",
					textCls:"fb",
					itemid:"学习1",
					handler:function(a,b,c,d,e){
						alert("asdf");
					}
		  		},{
					separator:true
				},{
					text:"第一课",
					checkbox:true,
					children:[{
						checkbox:true,
						text:"网页特效原理分析",
					    iconCls:"ui-icon-close",
					    children:[{
					    	text:"响应用户操作1"
					    },{
					    	separator:true
					    },{
					    	text:"响应用户操作2"
					    }]
					},{
						text:"响应用户操作"
					}]
				}]
			});
 *
 *@class FAPUI.Menu
 *@extends FAPUI.Component
 */
define ( function ( require ) {

	var importcss = "./themes/" + FAPUI.getTheme () + "/css/ui-menu.css";

	require.async ( importcss );
	require ( "./fapui-component" );

	FAPUI.define ( "FAPUI.Menu", {
		extend : "FAPUI.Component", props : {
			/**
			 *@property items
			 *@type Array
			 */
			items : null,
			activeSource : null,
			separator : false
		}, override : {
			/**
			 * 初始化方法
			 */
			initConfig : function () {
				this.renderTo = this.renderTo || $ ( document.body );
				this.callParent ();
				this.addEvents ( /**
					 *菜单项点击时触发
					 *@event itemclick
					 *@param cmp {Component} 组件对象
					 *@param li {Dom} 被点击的li元素
					 *@param text {String} 元素的文本
					 *@param Itemid {String} 元素的itemid属性
					 *@param event {Event} 事件对象
					 */
					"itemclick", /**
					 *如果菜单项可以勾选,选中时触发
					 *@event itemchecked
					 *@param cmp {Component} 组件对象
					 *@param li {Dom} 被点击的li元素
					 *@param text {String} 元素的文本
					 *@param Itemid {String} 元素的itemid属性
					 *@param event {Event} 事件对象
					 */
					"itemchecked", /**
					 *如果菜单项可以勾选,不选中时触发
					 *@event itemunchecked
					 *@param cmp {Component} 组件对象
					 *@param li {Dom} 被点击的li元素
					 *@param text {String} 元素的文本
					 *@param Itemid {String} 元素的itemid属性
					 *@param event {Event} 事件对象
					 */
					"itemunchecked" );
				this.tpl = [ "{@if checkbox===true}",
							"<li><img class=\"ui-icon  ui-icon-cb-checked\"",
							" src=\"\" + FAPUI.BLANK_IMG + \"\">" ,
							"<span class=\"${textCls}\" onselectstart=\"return false\">${text}</span></li>",
							 "{@else if checkbox===false}",
							 "<li><img class=\"ui-icon  ui-icon-cb-unchecked\" " ,
							 "src=\"\" + FAPUI.BLANK_IMG + \"\"><span class=\"${textCls}\" " ,
							 "onselectstart=\"return false\">${text}</span></li>",
							 "{@else if icons!==null}",
							 "<li><img class=\"ui-icon  ${icons}\" src=\"\" + FAPUI.BLANK_IMG + \"\">" ,
							 "<span class=\"${textCls}\" onselectstart=\"return false\">${text}</span></li>",
							 "{@else}",
							 "<li><img class=\"ui-icon\" src=\"\" + FAPUI.BLANK_IMG + \"\">" ,
							 "<span class=\"${textCls}\" onselectstart=\"return false\">${text}</span></li>",
							 "{@/if}" ].join ( " " );
				juicer.set ( "cache", true );
				juicer.set ( "errorhandling", false );
				juicer.set ( "strip", true );
				juicer.set ( "detection", false );
			},
			/**
			 * updateRender
			 */
			updateRender : function () {
				var me = this;
				var aDoc = [ document.documentElement.offsetWidth, document.documentElement.offsetHeight ];

				me.el.addClass ( "ui-menu" );
				me.el.find ( "li:has(ul)" ).addClass ( "sub" );
				me.el.find ( "li" ).each ( function () {
					var text = $ ( this ).attr ( "text" );
					var textCls = $ ( this ).attr ( "textCls" );
					var sp;

					if ( text ) {
						sp = $ ( "<span>" + text + "</span>" );
						textCls && sp.addClass ( textCls );
						$ ( this ).prepend ( sp );
					}

					var checkbox = $ ( this ).attr ( "checkbox" );
					var img = $ ( "<img class=\"ui-icon\" src=\"\" + FAPUI.BLANK_IMG + \"\" />" );

					if ( checkbox ) {
						img.addClass ( checkbox === "true" ? "ui-icon-cb-checked" : "ui-icon-cb-unchecked" );
					} else {
						var iconCls = $ ( this ).attr ( "iconCls" );

						img.addClass ( iconCls );
					}
					$ ( this ).prepend ( img );

					var handler = $ ( this ).attr ( "handler" );

					if ( handler ) {
						handler = handler.trim ();
						if ( /function\(.*?\)\{.*?\}/.test ( handler ) ) {
							handler = eval ( "(" + handler + ")" );
						} else if ( window [ handler ] ) {
							handler = window[ handler ];
						} else {
							/**
							 * handler
							 */
							handler = function () {
								eval ( handler );
							};
						}
					}

					$ ( this ).click ( function ( event ) {
						handler && handler.call ( me, me, $ ( this ), $ ( this ).find ( "span:first" ).html (),
							$ ( this ).attr ( "itemid" ), event );
						event.stopPropagation ();
						var target = $ ( event.target );

						if ( target.is ( "img" ) ) {
							if ( target.hasClass ( "ui-icon-cb-checked" ) ) {
								target.removeClass ( "ui-icon-cb-checked" );
								target.addClass ( "ui-icon-cb-unchecked" );
								$ ( this ).attr ( "checkbox", false );
								me.fireEvent ( "itemunchecked", me, $ ( this ),
									$ ( this ).find ( "span:first" ).html (),
									$ ( this ).attr ( "itemid" ), event );
							} else if ( target.hasClass ( "ui-icon-cb-unchecked" ) ) {
								target.addClass ( "ui-icon-cb-checked" );
								target.removeClass ( "ui-icon-cb-unchecked" );
								$ ( this ).attr ( "checkbox", true );
								me.fireEvent ( "itemchecked", me, $ ( this ),
									$ ( this ).find ( "span:first" ).html (),
									$ ( this ).attr ( "itemid" ), event );
							} else {
								me.hide ();
								me.fireEvent ( "itemclick", me, $ ( this ),
									$ ( this ).find ( "span:first" ).html (),
									$ ( this ).attr ( "itemid" ), event );
							}
						} else {
							me.hide ();
							me.fireEvent ( "itemclick", me, $ ( this ),
								$ ( this ).find ( "span:first" ).html (),
								$ ( this ).attr ( "itemid" ), event );
						}
					} );

				} );
				me.el.find ( "li" ).hover ( function () {
					var oLi = $ ( this ).addClass ( "active" );
					var maxWidth;
					var maxHeight;
					var oUL = oLi.find ( "ul:first" );

					if ( oUL.length === 0 ) {
						return;
					}
					oUL.show ();
					oUL.css ( {
						top : this.offsetTop + "px", left : this.offsetWidth + "px"
					} );
					me.updateWidth ( oUL );
					maxWidth = aDoc[ 0 ] - oUL.width ();
					maxHeight = aDoc[ 1 ] - oUL.height ();
					//防止溢出
					var p = oUL.offset ();

					p.left > maxWidth && oUL.css ( "left", - oUL.width () );
					p.top > maxHeight && oUL.css ( "top",
						- oUL.height () + parseInt ( oUL.css ( "top" ) ) + oLi.height () );

				}, function () {
					$ ( this ).removeClass ( "active" ).find ( "ul:first" ).hide ();
				} );
				$ ( document ).bind ( "click", function ( event ) {
					me.hide ();
				} );
			},
			/**
			 *
			 * @param {Object} l
			 * @param {Object} t
			 */
			setPosition : function ( l, t ) {
				this.el.css ( {
					top : t + "px", left : l + "px"
				} );
			},
			/**
			 *
			 * @param {Object} jq
			 */
			updateWidth : function ( jq ) {
				var maxWidth = 0;

				jq.children ().each ( function () {
					var w = $ ( this ).width ();

					maxWidth = w > maxWidth ? w : maxWidth;
				} );
				jq.children ().width ( maxWidth );
				jq.children ( "li.menu-sep" ).width ( maxWidth - 24 );
			},
			/**
			 *
			 * @param {Object} l
			 * @param {Object} t
			 */
			show : function ( l, t ) {
				var me = this;

				me.callParent ();
				this.setPosition ( l, t );

				this.updateWidth ( this.el.children ( "ul:first" ) );
				var aDoc = [ document.documentElement.offsetWidth,
							document.documentElement.offsetHeight ];
				var maxWidth = aDoc[ 0 ] - this.el.width ();
				var maxHeight = aDoc[ 1 ] - this.el.height ();
				var offset = this.el.offset ();
				//防止菜单溢出
				offset.left > maxWidth &&  this.el.css ( "left", maxWidth ) ;
				offset.top > maxHeight &&  this.el.css ( "top", maxHeight ) ;
			}, /**
			 *做为右键方式进行元素绑定,即作为右键菜单,参数为对象元素或id号
			 *@method bindByContextMenu
			 *@param el {El} el对象
			 *@param cmp {Component} 组件
			 */
			bindByContextMenu : function ( el, cmp ) {
				var me = this;

				if ( ! $ ( document ).data ( "events" ) || ! $ ( document ).data ( "events" )["contextmenu"]) {
					$ ( document ).bind ( "contextmenu", function ( event ) {
						return false;
					} );
					//$(document).bind("click",function(event) {
					//	me.hide();
					//});
				}
				el = this.fly ( el );
				if ( ! el.data ( "events" ) || ! el.data ( "events" )["contextmenu"] ) {
					el.bind ( "contextmenu", function ( event ) {
						me.show ( event.clientX, event.clientY );
						me.activeSource = cmp || el;
					} );
				}
			},
			/**
			 *
			 * @returns {string}
			 */
			createDom : function () {
				var me = this;

				me.id = me.id || FAPUI.getId ();
				return "<div id=" + me.id +
					" class=\"ui-menu\" style=\"top: 370px; left: 202px; display: none;z-index:9999;\">";
			},
			/**
			 *
			 * @param {Object} el
			 */
			render : function ( el ) {
				this.callParent ( [ el ] );
			},
			/**
			 * bindEvent的实现
			 */
			bindEvent : function () {
				var me = this;

				me.el = me.el || $ ( "#" + me.id );
				var ul = $ ( "<ul></ul>" );

				ul.appendTo ( me.el );
				this.afterRender ( this.items, ul );
				this.bindHideEvent ();
				this.bindLiEvent ();
			},
			/**
			 * 绑定隐藏事件
			 */
			bindHideEvent : function () {
				var me = this;

				$ ( document ).bind ( "mousedown", function ( event ) {
					var target = $ ( event.target );

					if ( target.is ( "img,span,li" ) ) {
						return false;
					}
					me.hide ();
				} );
			},
			/**
			 * 绑定事件
			 */
			bindLiEvent : function () {
				var me = this;
				var aDoc = [ document.documentElement.offsetWidth,
									   document.documentElement.offsetHeight ];

				me.el = me.el || $ ( "#" + me.id );
				me.el.find ( "li" ).hover ( function () {
					//若为分隔符，直接return false
					if ( $ ( this ).hasClass ( "menu-sep" ) ) {
						return false;
					}

					//若此项不 可用，直接return false
					if ( $ ( this ).hasClass ( "menuitem-disabled" ) ) {
						return false;
					}
					var oLi = $ ( this ).addClass ( "active" );
					var maxWidth;
					var maxHeight;
					var oUL = oLi.find ( "ul:first" );

					if ( oUL.length === 0 ) {
						return;
					}
					oUL.show ();
					oUL.css ( {
						top : this.offsetTop + "px", left : this.offsetWidth + "px"
					} );
					me.updateWidth ( oUL );
					maxWidth = aDoc[ 0 ] - oUL.width ();
					maxHeight = aDoc[ 1 ] - oUL.height ();
					//防止溢出
					var p = oUL.offset ();

					p.left > maxWidth && oUL.css ( "left", - oUL.width () );
					p.top > maxHeight && oUL.css ( "top",
						- oUL.height () + parseInt ( oUL.css ( "top" ) ) + oLi.height () );

				}, function () {
					$ ( this ).removeClass ( "active" ).find ( "ul:first" ).hide ();
				} );
			},
			/**
			 *
			 * @param {Object} children
			 * @param {Object} el
			 */
			afterRender : function ( children, el ) {
				var me = this;

				if ( ! this.border ) {
					this.el.css ( "border", "0px" );
				}
				$ ( children ).each ( function () {
					var that = this;

					//分隔符
					if ( that.separator === true ) {
						$ ( "<li class=\"menu-sep\"></li>" ).appendTo ( el );
						return;
					}
					if ( ! that.textCls ) {
						that.textCls = " ";
					}
					var handler = that.handler;

					if ( handler ) {
						if ( handler.constructor === String ) {
							handler = handler.trim ();
							if ( /function\(.*?\)\{.*?\}/.test ( handler ) ) {
								handler = eval ( "(0," + handler + ")" );
							} else if ( window[ handler ] ) {
								handler = window[ handler ];
							} else {
								/**
								* handler
								*/
								handler = function () {
									eval ( handler );
								};
							}
						}
					}
					var tmp = $ ( juicer ( me.tpl, that ) );

					if ( that.itemid ) {
						tmp.attr ( "itemid", that.itemid );
					}
					tmp.appendTo ( el );
					tmp.click ( function ( event ) {

						//若此项有二级菜单，直接return false
						if ( $ ( this ).hasClass ( "sub" ) ) {
							return false;
						}

						//若此项不 可用，直接return false
						if ( $ ( this ).hasClass ( "menuitem-disabled" ) ) {
							return false;
						}
						handler && handler.call ( me, me, $ ( this ),
							$ ( this ).find ( "span:first" ).html (),
							$ ( this ).attr ( "itemid" ), event );
						event.stopPropagation ();
						var target = $ ( event.target );

						if ( target.is ( "img" ) ) {
							if ( target.hasClass ( "ui-icon-cb-checked" ) ) {
								target.removeClass ( "ui-icon-cb-checked" );
								target.addClass ( "ui-icon-cb-unchecked" );
								$ ( this ).attr ( "checkbox", false );
								me.fireEvent ( "itemunchecked", me, $ ( this ),
									$ ( this ).find ( "span:first" ).html (),
									$ ( this ).attr ( "itemid" ), event );
							} else if ( target.hasClass ( "ui-icon-cb-unchecked" ) ) {
								target.addClass ( "ui-icon-cb-checked" );
								target.removeClass ( "ui-icon-cb-unchecked" );
								$ ( this ).attr ( "checkbox", true );
								me.fireEvent ( "itemchecked", me, $ ( this ),
									$ ( this ).find ( "span:first" ).html (),
									$ ( this ).attr ( "itemid" ), event );
							} else {
								me.hide ();
								me.fireEvent ( "itemclick", me, $ ( this ),
									$ ( this ).find ( "span:first" ).html (),
									$ ( this ).attr ( "itemid" ), event );
							}
						} else {
							me.hide ();
							me.fireEvent ( "itemclick", me, $ ( this ),
								$ ( this ).find ( "span:first" ).html (),
								$ ( this ).attr ( "itemid" ), event );
						}
					} );
					if ( this.children ) {
						tmp.addClass ( "sub" );
						var ul = $ ( "<ul></ul>" );

						ul.appendTo ( tmp );
						me.afterRender ( this.children, ul );
					}
					if( that.hidden ) {
						tmp.hide();
					}

				 } );
			},

			/**
			 * @access private
			 * 根据itemId获取某一个菜单项的jquery对象
			 * @param {*} itemId
			 *
			 */
			_getMenuItem : function ( itemId ) {
				var me = this;
				var menuItem;

				$ ( me.items ).each ( function () {
					if ( this.itemid === itemId ) {
						menuItem = me.el.find ( "li[ itemid=\"\" + itemId + \"\" ]" );
						return false;
					}
				} );
				return menuItem;
			},
			/**
			 * 根据itemId获取某一个菜单项
			 * @param {*} itemId
			 *
			 */
			getMenuItem : function ( itemId ) {
				var me = this;
				var menuItem;

				$ ( me.items ).each ( function () {
					if ( this.itemid === itemId ) {
						menuItem = this;
						return false;
					}
				} );
				return menuItem;
			},/**
			 * 根据itemId禁用某一个菜单项
			 * @param {String/Array} itemId
			 * @method
			 */
			disableMenuItem : function ( itemId ) {
				var me = this;

				if ( FAPUI.isString ( itemId ) ) {
					var item = me._getMenuItem ( itemId );

					item.addClass ( "menuitem-disabled" );
				} else {
					$ ( itemId ).each ( function () {
						var that = this;
						var item = me._getMenuItem ( that );

						item.addClass ( "menuitem-disabled" );
					} );
				}
			},
			/**
			 * 根据itemId启用某一个菜单项
			 * @param {*} itemId
			 * @method
			 */
			enableMenuItem : function ( itemId ) {
				var me = this;

				if ( FAPUI.isString ( itemId ) ) {
					var item = me._getMenuItem ( itemId );

					item.removeClass ( "menuitem-disabled" );
				} else {
					$ ( itemId ).each ( function () {
						var that = this;
						var item = me._getMenuItem ( that );

						item.removeClass ( "menuitem-disabled" );
					} );
				}
			},
			/**
			 * removeAllItems
			 */
			removeAllItems : function () {
				var me = this;
				var el = me.el;

				if ( el ) {
					el.unbind ();
					var ul = el.children ( "ul" );

					ul.remove ();
				}
				if ( $.browser.msie ) {
					CollectGarbage ();
				}
				this.items = [];
			},
			/**
			 * unbindLiEvent
			 */
			unbindLiEvent : function () {
				var me = this;

				me.el.find ( "li" ).unbind ( "hover" );
			},
			/**
			 *
			 * @param {Object} items
			 */
			addItems : function ( items ) {
				var me = this;

				var el = this.el;
				var ul = el.children ( "ul" );

				if ( ul.length === 0 ) {
					ul = $ ( "<ul></ul>" );
					ul.appendTo ( me.el );
				}
				this.afterRender ( items, ul );
				this.unbindLiEvent ();
				this.bindLiEvent ();
				this.items = this.items || [];
				this.items = this.items.concat ( items );
			}
		}
	} );
	FAPUI.register ( "menu", FAPUI.Menu );

	return FAPUI.Menu;
} );
