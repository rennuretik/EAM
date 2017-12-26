/**
 *定义FAPUI.Window组件
 *以下代码将演示如何初始化Window组件
 *
 *
 var window = new FAPUI.Window({
		container:"box",
		width:400,
		height:300,
		title:"添加节点信息",
		titleIconCls:"icon-save",
		border:true,
		minimizable:true,
		maximizable:true,
		closeable:true,
		collapsable:true,
		draggable:false,
		resizable:false,
		closed : true,
		modal : true,
		items : [new FAPUI.Panel({border:false,html:"哈哈"})],
		bbar : {
			align:"right",
			items : [ {
				type:"normalButton",
				text :"提交",
				handler : function(){
				}
			} ]
		}
	});
 *<p>以下代码将演示如何打开Window组件</p>
 window.open();

 *@class FAPUI.Window
 *@extend FAPUI.Panel
 *@author wzj
 */
define ( function ( require, exports, module ) {

	var importcss = "./themes/" + FAPUI.getTheme () + "/css/ui-window.css";

	require.async ( importcss );

	require ( "./fapui-panel" );

	require ( "./fapui-toolbar" );

	require ( "./fapui-dragdrop" );

	require ( "./fapui-resize" );

	FAPUI.define ( "FAPUI.Window", {
		extend : "FAPUI.Panel",

		props : {
			/**
			 * window宽度
			 * @property  width
			 * @type Number
			 * @default 400
			 */
			width : 400,

			/**
			 * window高度
			 * @property  height
			 * @type Number
			 * @default 300
			 */
			height : 300,

			/**
			 * window id
			 * @property  winId
			 * @type String
			 * @default ""
			 */
			winId : "",

			/**
			 * window 标题
			 * @property  title
			 * @type String
			 * @default "New Window"
			 */
			title : "New Window",

			/**
			 * window渲染的目标容器
			 * @property renderTo
			 * @type String
			 * @default null
			 */
			renderTo : null,

			/**
			 * window是否有最小化按钮
			 * @property  minimizable
			 * @type boolean
			 * @default true
			 */
			minimizable : true,

			/**
			 * window是否有最大化按钮
			 * @property  maximizable
			 * @type boolean
			 * @default true
			 */
			maximizable : true,

			/**
			 * window是否有关闭按钮
			 * @property  closeable
			 * @type boolean
			 * @default true
			 */
			closeable : true,

			/**
			 * window是否可以拖拽
			 * @property  draggable
			 * @type boolean
			 * @default true
			 */
			draggable : true,

			/**
			 * window是否可以改变大小
			 * @property  resizable
			 * @type boolean
			 * @default true
			 */
			resizable : true,

			/**
			 * window是否可以关闭
			 * 注意：如果此属性设置为true，则点击点击关闭按钮后，
			 * 要再次打开window，则需要重新初始化window对象，否则无法显示window
			 * @property  closed
			 * @type boolean
			 * @default false
			 */
			closed : false,

			/**
			 * window是否可以折叠
			 * @property  collapsable
			 * @type boolean
			 * @default true
			 */
			collapsable : true,

			/**
			 * window是否为模态
			 * @property  modal
			 * @type boolean
			 * @default false
			 */
			modal : false,

			/**
			 * window是否一打开为最大化状态
			 * @property  maxed
			 * @type boolean
			 * @default false
			 */
			maxed : false
		}, override : {

			/**
			 * 初始化配置项
			 * @private
			 */
			initConfig : function () {
				var me = this;

				me.callParent ();
				me.tpl = [ "<div id=\"${id}\" class=\"window\">",
						  "$${headContent===null?\"\":headContent}",
						  "$${bodyContent===null?\"\":bodyContent}",
						  "</div>" ].join ( " " );

				juicer.set ( "cache", true );
				juicer.set ( "errorhandling", false );
				juicer.set ( "strip", true );
				juicer.set ( "detection", false );

				//浏览器类型信息
				me.browser = me._getBrowser ();
				//避免初始化时就渲染组件
				if ( me.renderTo ) {
					me.container = me.renderTo;
					delete me.renderTo;
				}
			},
			/**
			 * 打开window
			 * @method open
			 */
			open : function () {
				var me = this;

				// 若为模态窗口，则生成遮罩
				if ( me.modal ) {

					// 若遮罩不存在,则创建
					if ( me.mask ) {
						me.mask.show ();
					} else {
						me.createMask ();
					}
				}
				if ( me.container ) {
					FAPUI.fly ( me.container ).css ( "position", "relative" );
				}

				//若window没有渲染，测渲染
				if ( me.isRendered !== true ) {
					me.render ( FAPUI.fly ( me.container || document.body ) );
					me.isRendered = true;
					me.bodyEl.addClass ( "window-body" );
					me.bodyEl.children ( "div.panel-content" ).css ( "overflow", "hidden" );
					var pos = me.defaultPosition ();

					me.el.css ( {
						left : pos.x, top : pos.y
					} );

					// 是否执行拖拽
					if ( me.draggable ) {
						me._drag ();
					}
					// 是否执行改变大小
					if ( me.resizable ) {
						me._resize ();
					}
					me.el.children ( "div.rRight" ).height ( me.height );
					me.el.children ( "div.rLeft" ).height ( me.height );

					// 记录窗口初始大小
					me.initWidth = me.width;
					me.initHeight = me.height;

					// 记录窗口初始位置
					me.initLeft = pos.x;
					me.initTop = pos.y;

					me._onClick ();
				}

				me.el.css ( "z-index", FAPUI.zindex ++ );
				me.showWindow ();
				if ( me.maxed ) {
					me.maximize ();
				}
			},
			/**
			 * 关闭window
			 * @method close
			 */
			close : function ( closed ) {
				var me = this;

				closed = closed || me.closed;
				if ( closed ) {
					if ( false !== me.fireEvent ( "beforeclose", me ) ) {
						me.mask && me.mask.remove ();
						me.fireEvent ( "close", me );
						me.destroy ();
						me.isRendered = false;
					}
				} else {
					if ( false !== me.fireEvent ( "beforeclose", me ) ) {
						me.mask && me.mask.hide ();
						me.hide ();
						me.fireEvent ( "close", me );
					}
				}
				me = null;
			},
			/**
			 * 显示或者隐藏window
			 * @method setHide
			 */
			setHide : function ( hide ) {
				var me = this;
				var cld = me.closed;

				if ( hide ) {
					me.close ( cld );
				} else {
					me.open ();
				}
			}, /**
			 * 销毁组件
			 * 重写父类的onDestroy方法
			 * @private
			 */
			onDestroy : function () {
				var me = this;

				me.mask && me.mask.remove () && ( delete me.mask );
				me.callParent ();
			}, /**
			 * window显示方式的处理
			 * @private
			 */
			showWindow : function ( speed ) {
				var me = this;

				if ( speed ) {
					me.el.show ( speed );
				} else {
					me.el.show ();
				}
			}, /**
			 * 创建模态遮罩层
			 * @private
			 */
			createMask : function () {
				var me = this;

				me.mask = $ ( " <div class=\"window-mask\" id=\"window-mask\"></div>" );
				me.mask.width ( FAPUI.getViewSize ().width );
				me.mask.height ( FAPUI.getViewSize ().height );
				me.mask.appendTo ( $ ( document.body ) );
			},
			/**
			 * @access private
			 * 改变window的大小 在父容器内部(需要修改)
			 *
			 */
			_resize : function () {
				var me = this;

				new FAPUI.Resize ( {
					el : me.el, max : true, //scale : true,
					listeners : {
						/**
						 *
						 * @param {Object} c
						 * @param {Object} oP
						 * @param {Object} nP
						 */
						resize : function ( c, oP, nP ) {
							me.width = nP.w;
							me.height = nP.h;
							me.initWidth = nP.w;
							me.initHeight = nP.h;
							me.initLeft = nP.x;
							me.initTop = nP.y;
							me.doLayout ();
							me.el.width ( me.width );
							me.el.height ( "auto" );
							me.el.children ( "div.rRight" ).height ( nP.h );
							me.el.children ( "div.rLeft" ).height ( nP.h );
						}
					}
				} );
			},
			/**
			 * @access private
			 * 拖动window
			 */
			_drag : function () {
				var me = this;

				new FAPUI.DragDrop ( {
					el : me.el, handlerEl : me.headEl.children ( "div.panel-title" ),
					/**
					 *
					 * @param {Object} el
					 * @returns {*|jQuery|HTMLElement}
					 */
					getProxy : function ( el ) {
						var _el = $ ( "<div></div>" );

						_el.width ( el.width () );
						_el.height ( el.height () );
						_el.offset ( el.offset () );
						_el.addClass ( "window-proxy" );
						return _el;
					}, listeners : {
						/**
						 *
						 * @param {Object} o
						 * @param {Object} e
						 */
						drop : function ( o, e ) {
							me.initLeft = o._fp.x;
							me.initTop = me.browser.msie ? o._fp.y : ( o._fp.y - ( me.el.parent ().offset ().top ) );
							me._repairPosition ();
						}
					}
				} );
			}, /**
			 * 创建标题栏
			 * 重写父类的createTitleBarDom方法
			 * @private
			 */
			createTitleBarDom : function () {
				var me = this;

				if ( ! me.title ) {
					return "";
				}
				var toolContent = "";
				var cfg = {};

				if ( me.collapsable ) {
					me.collapseId = FAPUI.getId ();
					toolContent = toolContent + "<a href=\"javascript:void(0);\" " +
						"id=\"" + me.collapseId + "\" class=\"panel-tool-collapse\"" +
						" hidefocus=\"false\" title=\"点击折叠/展开\"></a>";
				}
				if ( me.maximizable ) {
					me.maximizableId = FAPUI.getId ();
					toolContent = toolContent + "<a href=\"javascript:void(0);\" hidefocus=\"false\" " +
						"id=\"" + me.maximizableId + "\" class=\"panel-tool-max\" title=\"最大化/还原\"></a>";
				}
				if ( me.closeable ) {
					me.closeableId = FAPUI.getId ();
					toolContent = toolContent + ( "<a href=\"javascript:void(0);\" hidefocus=\"false\" " +
						"id=\"" + me.closeableId + "\" class=\"panel-tool-close\" title=\"关闭\"></a>" );
				}
				cfg.toolContent = toolContent;
				return juicer ( me.headtooltpl, cfg );
			}, /**
			 * 创建标题栏
			 * 重写父类的createTitleBarEvent方法
			 * @private
			 */
			createTitleBarEvent : function () {
				var me = this;

				if ( ! me.title ) {
					return;
				}
				if ( me.collapsable ) {
					var collapseEL = $ ( "#" + me.collapseId );

					collapseEL.click ( function () {
						var toolEl = me.headEl.children ( "div.panel-tool" );

						if ( me.collapsed === true ) {
							me.expand ( toolEl );
						} else {
							me.collapse ( toolEl );
						}
					} );
				}

				if ( me.maximizable ) {
					var max = $ ( "#" + me.maximizableId );

					max.click ( function () {
						if ( me.maximized === true ) {
							me.minimize ();
						} else {
							me.maximize ();
						}
						me.doLayout ();
					} );
				}
				if ( me.closeable ) {
					var close = $ ( "#" + me.closeableId );

					close.click ( function () {
						me.close ();
					} );
				}
			},

			/**
			 * 计算内部大小
			 * 重写父类的computerSize方法
			 * @private
			 */
			computerSize : function () {
				var me = this;

				if ( me.fit === true ) {
					var p = me.el.parent ();

					p.addClass ( "panel-noscroll" );
					if ( me.browser.msie ) {
						me.width = ( p.width () - 4 );
						me.height = ( p.height () - 12 );
					} else {
						me.width = p.width ();
						me.height = ( p.height () - 10 );
					}
				}
				// 获取标题栏和上下工具栏的高度
				var tbarHeight = me.tbarEl && me.tbarEl.is ( ":visible" ) ? me.tbarEl.height () : 0;
				var bbarHeight = me.bbarEl && me.bbarEl.is ( ":visible" ) ? me.bbarEl.height () : 0;
				var headHeight = me.headEl && me.headEl.is ( ":visible" ) ? me.headEl.height () : 0;
				var padding = parseInt ( me.el.css ( "padding" ) );
				//IE7,8能从window的class中取出值，但是IE9不能取出
				if ( isNaN ( padding ) ) {
					padding = 4;
				}
				var innerHeight = me.height - ( padding * 2 );
				var bodyHeight = innerHeight - headHeight;

				me._outerWidth ( me.width, me.el );
				me.bodyEl.height ( bodyHeight );
				me.contentEl.width ( me.width - ( padding * 2 ) - 4 );
				me.contentEl.height ( bodyHeight - tbarHeight - bbarHeight );
			},
			/**
			 * window最大化
			 * 重写父类的maximize方法
			 * @private
			 */
			maximize : function () {
				var me = this;

				var tool = me.headEl.find ( "a.panel-tool-max" );

				if ( me.maximized === true ) {
					return;
				}
				tool.addClass ( "panel-tool-restore" );
				me.fit = true;
				me.doLayout ();
				me.el.css ( {
					left : 0, top : 0
				} );
				me.hideHandleEl ();
				me.minimized = false;
				me.maximized = true;
			},
			/**
			 * window还原
			 * 重写父类的minimize方法
			 * @private
			 */
			minimize : function () {
				var me = this;

				var tool = me.headEl.find ( "a.panel-tool-max" );

				if ( me.maximized === false ) {
					return;
				}
				tool.removeClass ( "panel-tool-restore" );
				me.fit = false;
				me.width = me.initWidth;
				me.height = me.initHeight;
				me.doLayout ();
				me.el.css ( {
					left : me.initLeft, top : me.initTop
				} );
				me.showHandleEl ();
				me.minimized = false;
				me.maximized = false;
			},

			/**
			 * 显示所有的resize-handler、
			 * @private
			 */
			showHandleEl : function () {
				var me = this;

				me.el.children ( "div.resize-handler" ).show ();
			}, /**
			 * 隐藏所有的resize-handler
			 * @private
			 */
			hideHandleEl : function () {
				var me = this;

				me.el.children ( "div.resize-handler" ).hide ();
			}, /**
			 * 获取window默认显示的位置
			 * @private
			 * @return {} x 左边距离  y 上边距离
			 */
			defaultPosition : function () {
				var me = this;

				var p = me.el.parent ();
				var pW = p.width ();
				var pH = p.height ();

				if ( me.browser.msie ) {
					pH -= 12;
				}
				if ( me.browser.firefox ) {
					pH = p[ 0 ].tagName === "BODY" ? document.body.clientHeight : pH;
				}
				var left = parseInt ( ( pW - me.width ) / 2 );
				var top = parseInt ( ( pH - me.height ) / 2 ) - 5;

				return {
					x : left, y : top
				};
			},
			/**
			 * @access private
			 * window拖动超过父容器边界时，重新修复显示位置
			 *
			 */
			_repairPosition : function () {
				var me = this;
				var browserWidth = 0;
				var browserHeight = 0;

				if ( me.initLeft < 1 ) {
					me.initLeft = 1;
				}
				if ( me.initTop < 1 ) {
					me.initTop = 1;
				}
				var right = me.initLeft + me.width;
				var bottom = me.initTop + me.height;
				var p = me.el.parent ();
				var h = FAPUI.getViewSize ().height;

				if ( p[ 0 ].tagName === "BODY" ) {
					browserWidth = FAPUI.getViewSize ().width;
					browserHeight = me.browser.msie ? ( h - 10 ) : h;
				} else {
					browserWidth = me.el.parent ().width ();
					browserHeight = ( me.el.parent ().height () - 8 );
				}
				if ( right > browserWidth ) {
					me.initLeft = browserWidth - me.width;
				}
				if ( bottom > browserHeight ) {
					me.initTop = browserHeight - me.height;
				}
				/* 修正面板位置 */
				me.el.css ( {
					left : me.initLeft, top : me.initTop
				} );
			}, /**
			 * 设置window的位置
			 * @method setPosition
			 * @param {Number} t 顶部距离
			 * @param {Number} l 左边距离
			 */
			setPosition : function ( t, l ) {
				var me = this;

				t = t || 0;
				l = l || 0;
				me.el.css ( {
					top : t,
					left : l
				} );
			},

			/**
			 * 点击窗口标题时激活window
			 * @private
			 */
			_onClick : function () {
				var me = this;

				var headEl = me.headEl.children ( "div.panel-title" );

				headEl.mousedown ( function () {
					me.el.css ( "z-index", FAPUI.zindex ++ );
				} );
			},
			/**
			 * 获取浏览器类型信息
			 * @private
			 * @return {Object}
			 */
			_getBrowser : function () {
				var _agent = navigator.userAgent.toLowerCase ();
				var _browser = {
					agent : _agent,
					msie : /msie/.test ( _agent ),
					firefox : /mozilla/.test ( _agent ) && ! /(compatible|webkit|chrome)/.test ( _agent ),
					opera : /opera/.test ( _agent ),
					chrome : /chrome/.test ( _agent ),
					safari : /webkit/.test ( _agent ) && ! /chrome/.test ( _agent ),
					version : ( _agent.match ( /.+(?:chrome|firefox|msie|version)[ \/: ] ( [\d.] + )/ ) || [ 0, 0 ] ) [ 1 ]
				};

				return _browser;
			}
		}

	} );
	FAPUI.register ( "window", FAPUI.Window );

	return FAPUI.Window;
} );