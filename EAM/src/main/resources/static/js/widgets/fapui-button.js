/**
 *按钮组件,如下创建：
 *
 *
 *
 new FAPUI.Button({
		renderTo:"box2",
		type:"normalButton",
		text:"ok",
		iconCls:"icon-ok",
		handler:function(Button,btn,event){
			alert("handler");
		},
		subMenu:{
			items:[{
				text:"JavaScript 学习",
				icons:"ui-icon-collapse",
				textCls:"fb",
				itemid:"学习1",
				handler:function(a,b,c,d,e){
					alert("asdf");
				}
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
				    	text:"响应用户操作2"
				    }]
				},{
					text:"响应用户操作"
				}]
			}]
		},
		listeners:{
			"click":function(Button,btn,event){
	          alert("click"+"  "+Button.renderTo);
			},
			"mouseover":function(Button,btn,event){
				//alert("moue over");
			},
			"mouseout":function(Button,btn,event){
				//alert("mouse out");
			}
		}
	});
 *
 *@class FAPUI.Button
 *@extends FAPUI.Component
 */
define ( function ( require, exports, module ) {
	var importcss = "./themes/" + FAPUI.getTheme () + "/css/ui-button.css";

	require.async ( importcss );
	require ( "./fapui-component" );
	require ( "./fapui-menu" );
	FAPUI.define ( "FAPUI.Button", {
		extend : "FAPUI.Component", props : {

			/**
			 * 组件唯一标识
			 * @property  itemId
			 * @type String
			 * @default ""
			 */
			itemId : "",

			/**
			 * 按钮类型,值可以为:"linkButton","normalButton","-"
			 * @property  type
			 * @type String
			 * @default  normalButton默认为普通按钮
			 */
			type : "normalButton",

			/**
			 * 按钮上显示的文本
			 * @property  text
			 * @type String
			 */
			text : null,

			/**
			 * 按钮前部图标的样式
			 * @property  iconCls
			 * @type String
			 * @default null
			 */
			iconCls : null,

			/**
			 * 子菜单,见Menu组件配置
			 * @property  subMenu
			 * @type Menu
			 * @default null
			 */
			subMenu : null,

			/**
			 * 按钮下拉菜单弹出的处理方式:
			 *1.true 鼠标移上去弹出
			 *2.false 鼠标单击时弹出
			 * @property  hoverIntent
			 * @type Boolean
			 * @default false
			 */
			hoverIntent : false,

			/**
			 *@private
			 */
			isMenuShow : false,

			/**
			 * 点击按钮时候的处理函数
			 * @property  handler
			 * @type function
			 */
			handler : null, /**
			 * 作用域,在handler函数中this的指向,默认为按钮本身
			 */
			scope : null,
			/**
			 * @property
			 * @type boolean
			 * @default false
			 * 是否隐藏当前按钮
			 */
			hide : false,
			/**
			 * @property
			 * @type boolean
			 * @default false
			 * 是否禁用当前按钮
			 */
			disabled : false
		}, override : {
			/**
			 * 初始化配置
			 * @private
			 */
			initConfig : function () {
				this.callParent ();
				this.addEvents ( /**
					 *@event click
					 *@param {object} btn 对象本身
					 *@param {event} event 事件对象
					 */
					"click", "mouseover", "mouseout" );
				this.btnTpl = [ "<span class=\"button-btn-left\">",
							   "{@if iconCls!=null && text!=null}",
							   "<span class=\"button-btn-icon ${iconCls}\"></span><span class=\"button-btn-text \">$${text}</span>",
					"{@else if iconCls!=null}",
					"<span class=\"button-btn-text\"><span class=\"button-btn-empty ${iconCls}\">&nbsp;</span></span>", "{@else}",
					"<span class=\"button-btn-text\">$${text}</span>",
					"{@/if}</span>" ].join ( " " );
				this.iconTpl = [ "<span class=\"button-btn-left\">",
								"<span class=\"button-btn-text\" style=\"padding-left:0;padding-bottom:3px\">",
								"<span class=\"button-btn-empty button-btn-icon ${iconCls}\">&nbsp;</span>",
								"</span></span>" ].join ( " " );
				this.textTpl = [ "<span class=\"button-btn-left\">",
								"<span class=\"button-btn-text\">$${text}</span>",
								"</span>" ].join ( " " );
				this.textMenuTpl = [ "<span class=\"button-btn-left\">",
									"<span class=\"button-btn-text\">$${text}",
									 "<span class=\"button-btn-arrow\">&nbsp;</span>",
									 "</span></span>" ].join ( " " );
				this.iconTextTpl = [ "<span class=\"button-btn-left\">",
									"<span class=\"button-btn-icon  ${iconCls}\"></span><span class=\"button-btn-text \">$${text}",
					"</span></span>" ].join ( " " );
				this.iconTextMenuTpl = [ "<span class=\"button-btn-left\">",
										"<span class=\"button-btn-icon  ${iconCls}\"></span><span class=\"button-btn-text  ${iconCls}\" >$${text}",
					"<span class=\"button-btn-arrow\">&nbsp;</span>",
					"</span></span>" ].join ( " " );
				juicer.set ( "cache", true );
				juicer.set ( "errorhandling", false );
				juicer.set ( "strip", true );
				juicer.set ( "detection", false );
				this.createMenu ();
			}, /**
			 * 渲染组件
			 * @private
			 */
			render : function ( el ) {
				this.callParent ( [ el ] );
			}, /**
			 * 创建DOM元素
			 * @private
			 */
			createDom : function () {
				var me = this;

				me.id = me.id || FAPUI.getId ();
				var tmp = [];
				
				me.isDisplay = "block";
				me.isDisabled = "";
				if ( me.hide ) {
					me.isDisplay = "none";
				}
				
				if ( me.disabled ) {
					me.isDisabled = "button-btn-disabled";
				}
				if ( me.title ) {
					tmp.push ( "<a title=\"" + me.title + "\" id=\"" + me.id + "\" " +
						"href=\"javascript:void(0);\" class=\"button-btn " + me.isDisabled +
						"\" style=\"margin-right: 3px;display:\"" + me.isDisplay + ";\" hidefocus=\"true\">" );
				} else {
					tmp.push ( "<a id=\"" + me.id + "\" href=\"javascript:void(0);" +
						"\" class=\"button-btn " + me.isDisabled + "\" style=\"margin-right: 3px;display:\"" + me.isDisplay + ";\" hidefocus=\"true\">" );
				}
				if ( me.type === "linkButton" ) {
					if ( me.iconCls && me.text && me.subMenu ) {
						tmp.push ( juicer ( me.iconTextMenuTpl, me ) );
					} else if ( me.iconCls && me.text ) {
						tmp.push ( juicer ( me.iconTextTpl, me ) );
					} else if ( me.text && me.subMenu ) {
						tmp.push ( juicer ( me.textMenuTpl, me ) );
					} else if ( me.text ) {
						tmp.push ( juicer ( me.textTpl, me ) );
					} else if ( me.iconCls ) {
						tmp.push ( juicer ( me.iconTpl, me ) );
					}
				} else if ( me.type === "normalButton" ) {
					tmp.push ( juicer ( me.btnTpl, me ) );
				} else {
					alert ( "Toolbar config error!" );
				}
				tmp.push ( "</a>" );
				return tmp.join ( "" );
			}, /**
			 * 事件绑定
			 * @private
			 */
			bindEvent : function () {
				var me = this;

				this.callParent ();
				me.el = $ ( "#" + me.id );
				if ( me.type === "linkButton" ) {
					me.el.addClass ( "button-btn-plain" );
				}
				var handler = me.handler;

				me.el.bind ( "click", function ( event ) {
					if ( $ ( this ).hasClass ( "button-btn-disabled" ) ) {
						return false;
					}
					var scope = me.scope || me;

					handler && handler.call ( scope, me, event );
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
					if ( $ ( this ).hasClass ( "button-btn-disabled" ) ) {
						return false;
					}
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
					if ( $ ( this ).hasClass ( "button-btn-disabled" ) ) {
						return false;
					}
					var pos = $ ( this ).offset ();

					me.fireEvent ( "mouseout", me, event );
					if ( me.subMenu && me.hoverIntent === true ) {
						var mousePos = me._getMousePosition ( event );
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
			 * 创建菜单
			 * @private
			 */
			createMenu : function () {
				if ( this.subMenu !== null ) {
					this.subMenu = new FAPUI.Menu ( this.subMenu );
				}
			}, /**
			 * 显示下拉菜单
			 * @private
			 * @param {} pos
			 * @param {} btn
			 */
			showSubMenu : function ( pos, btn ) {
				this.subMenu && this.subMenu.show ( pos.left, pos.top + btn.outerHeight () + 2 );
			}, /**
			 * 隐藏所有的菜单
			 * @private
			 */
			hideAllMenu : function () {
				$ ( "body>div.ui-menu" ).hide ();
			}, /**
			 * 空写此方法，是为了不需要form表单验证
			 * @private
			 * @return {Boolean}
			 */
			validate : function () {
				return true;
			}, /**
			 * 设置宽度
			 * @private
			 * @param {Number} w
			 */
			setWidth : function ( w ) {

			}, /**
			 * 设置高度
			 * @private
			 * @param {Number} h
			 */
			setHeight : function ( h ) {

			}, /**
			 * 显示Button
			 * @method show
			 */
			show : function () {
				this.hide = false;
				this.callParent ();
			},

			/**
			 * 隐藏Button
			 * @method hide
			 */
			hide : function () {
				this.hide = true;
				this.callParent ();
			},

			/**
			 * 禁用按钮
			 * @method disable
			 */
			disable : function () {
				if ( this.el.hasClass( "button-btn-disabled" ) === false ) {
					this.el.addClass ( "button-btn-disabled" );
				}
				this.disabled = true;
			},
			/**
			 * 启用按钮
			 * @method enable
			 */
			enable : function () {
				this.el.removeClass ( "button-btn-disabled" );
				this.disabled = false;
			},
			/**
			 * @access private
			 * 获取鼠标当前坐标
			 * @param {*} e
			 * @return {*} 返回鼠标坐标x，y的值
			 */
			_getMousePosition : function ( e ) {
				if ( e.pageX || e.pageY ) {
					return {
						x : e.pageX, y : e.pageY
					};
				}
				return {
					x : e.clientX + document.body.scrollLeft - document.body.clientLeft,
					y : e.clientY + document.body.scrollTop - document.body.clientTop
				};
			},
			/**
			 * 复写reset方法,用户可能在form中添加一个button按钮，此时调用form。reset方法时会出现错误
			 */
			reset : function () {
				
			}
		}
	} );
	FAPUI.register ( "button", FAPUI.Button );

	return FAPUI.Button;
} );
