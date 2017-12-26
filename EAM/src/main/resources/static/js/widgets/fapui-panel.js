/*
 * Sunyard.com Inc.
 * Copyright (c) 2014-2016 All Rights Reserved.
 */

/**
 *定义FAPUI.Panel面板容器
 *<p>以下代码将演示如何使用Panel组件</p>
 *
 *
 *
 *
 var panel = new FAPUI.Panel({
		renderTo:"box",
		height:300,
		width:500,
		title:"标题栏",
		titleIconCls:"icon-add",
		titleBtns:[{
			iconCls:"panel-tool-min",
			handler:function(){
				alert("min");
			},
			text:"最小化"
		},{
			iconCls:"panel-tool-max",
			handler:function(){
				alert("max");
			},
			text:"向下还原"
		},{
			iconCls:"panel-tool-close",
			handler:function(){
				alert("close");
			},
			text:"关闭"
		}],
		collapsable:true,
		tbar:{
			items:[{
				type:"linkButton",
				iconCls:"icon-add",
				handler:function(b,e){
					alert(b.type);
				},
				listeners:{
					"click":function(b,e){
					  alert(b.iconCls);
					},
					"mouseover":function(b,e){
						//alert("moue over");
					},
					"mouseout":function(b,e){
						//alert("mouse out");
					}
				}
			},{
				type:"-"
			},{
				type:"linkButton",
				text:"MenuButton",
				handler:function(b,e){
					alert("toolbar");
				},
				listeners:{
					"click":function(b,e){
					  alert("click");
					},
					"mouseover":function(b,e){
						//alert("moue over");
					},
					"mouseout":function(b,e){
						//alert("mouse out");
					}
				}
			},{
				type:"-"
			},{
				type:"linkButton",
				iconCls:"icon-ok",
				text:"Cut",
				handler:function(b,e){
					alert("toolbar");
				},
				listeners:{
					"click":function(b,e){
					  alert("click");
					},
					"mouseover":function(b,e){
						//alert("moue over");
					},
					"mouseout":function(b,e){
						//alert("mouse out");
					}
				}
			},{
				type:"-"
			},{
				type:"linkButton",
				text:"Confirm",
				handler:function(b,e){
					alert("toolbar");
				}
			},{
				type:"-"
			},{
				type:"normalButton",
				iconCls:"icon-search",
				text:"Confirm",
				handler:function(b,e){
					alert("toolbar");
				}
			}]
		},
		listeners:{
			"beforehide":function(){
				alert("即将隐藏");
			}
		}
	});

 *@class FAPUI.Panel
 *@extend FAPUI.Component
 */

define ( function ( require ) {
	var importcss = "./themes/" + FAPUI.getTheme () + "/css/ui-panel.css";

	require.async ( importcss );
	require ( "./fapui-component" );

	require ( "./fapui-toolbar" );

	require ( "./fapui-gridlayout" );

	FAPUI.define ( "FAPUI.Panel", {
		extend : "FAPUI.Component",
		props : {

			/**
			 * 面板宽度
			 * @property width
			 * @type Number
			 * @default "auto"
			 */
			width : null,

			/**
			 * 面板高度
			 * @property height
			 * @type Number
			 * @default "auto"
			 */
			height : null,

			/**
			 * 是一个CSS class，作用于面板内容区域上
			 * @property bodyCls
			 * @type String
			 * @default ""
			 */
			bodyCls : "",

			/**
			 * 面板内部布局的配置
			 * @property layout
			 * @type Object
			 * @default null
			 */
			layout : null,

			/**
			 * 上工具栏
			 * @property tbar
			 * @type FAPUI.ToolBar
			 * @default null
			 */
			tbar : null,

			/**
			 * 下工具栏
			 * @property bbar
			 * @type FAPUI.ToolBar
			 * @default null
			 */
			bbar : null, /**
			 * title工具栏
			 * @property titleBtns
			 * @type Array
			 * @default null
			 */
			titleBtns : null, /**
			 * 面板内容区域自定义html片段
			 * @property html
			 * @type String
			 * @default null
			 */
			html : null,

			/**
			 * 面板边框
			 * @property border
			 * @type boolean
			 * @default true
			 */
			border : true,

			/**
			 * 是否关闭并销毁面板
			 * @property closed
			 * @type boolean
			 * @default false
			 */
			closed : false,

			/**
			 * 是否已经有布局
			 * @private
			 * @type boolean
			 * @default false
			 */
			//isLayout:false,

			/**
			 * 是否显示折叠按钮
			 * @property collapsable
			 * @type boolean
			 * @default false
			 */
			collapsable : false,

			/**
			 * 是否已经折叠
			 * @private
			 */
			collapsed : false,

			/**
			 * 是否已经最小化
			 * @private
			 */
			minimized : false,

			/**
			 * 是否已经最大化
			 * @private
			 */
			maximized : false,

			/**
			 * 全部填充
			 * @private
			 */
			fit : false,
			/**
			 * 标题
			 * @private
			 */
			title:"",
			/**
			 * 标题前面的全局Cls如：icon-save
			 * @private
			 */
			titleIconCls:""
		}, override : {

			/**
			 * 初始化配置对象
			 * @private
			 */
			initConfig : function () {
				this.callParent ();
				this.addEvents ( /**
					 * 在关闭面板之前触发，若其返回false则不执行close事件
					 * @event beforeclose
					 * @param panel {Object} 面板对象本身
					 */
					"beforeclose",

					/**
					 * 在关闭面板时触发
					 * @event close
					 * @param panel {Object} 面板对象本身
					 */
					"close",

					/**
					 * 在隐藏面板之前触发，若其返回false则不执行hide事件
					 * @event beforehide
					 * @param panel {Object} 面板对象本身
					 */
					"beforehide",

					/**
					 * 在隐藏面板时触发
					 * @event hide
					 * @param panel {Object} 面板对象本身
					 */
					"hide",

					/**
					 * 在折叠面板时触发
					 * @event collapse
					 * @param panel {Object} 面板对象本身
					 */
					"collapse",

					/**
					 * 在展开面板时触发
					 * @event expand
					 * @param panel {Object} 面板对象本身
					 */
					"expand" );
				this.tpl = [ "<div id=${id} class=\"panel\">",
					"$${headContent==null?\"\":headContent}",
					"$${bodyContent==null?\"\":bodyContent}",
					"</div>" ].join ( "" );
				this.headtpl = [ "{@if title}",
					"{@if border}",
					"<div class=\"panel-header\" id=\"$${headId}\">",
					"{@else}",
					"<div class=\"panel-header panel-header-noborder\" id=\"$${headId}\">",
					"{@/if}",
					"{@if titleIconCls!=null}",
					"<div class=\"panel-title panel-with-icon\"",
					"onselectstart=\"return false\">${title}</div>",
					"<div class=\"panel-icon ${titleIconCls}\"></div>",
					"{@else}",
					"<div class=\"panel-title\" onselectstart=\"return false\">${title}</div>",
					"{@/if}","$${tool==null?\"\":tool}",
					"</div>","{@else}",
					"<div></div>",
					"{@/if}"].join ( " " );

				this.headtooltpl = "<div class=\"panel-tool\" style=\"display:inline-block;\" >$${toolContent}</div>",

					this.bodytpl = [ "{@if border}",
						"<div id=\"$${bodyId}\" class=\"panel-body\">",
						"{@else}",
						"<div id=\"$${bodyId}\" class=\"panel-body panel-body-noborder\">",
						"{@/if}", "$${tbar==null?\"\":tbar}",
						"$${content}", "$${bbar=null?\"\":bbar}",
						"</div>" ].join ( " " );
				this.tbartpl = "<div class=\"panel-tbar\" " +
					"id=\"$${tbarId}\">$${tbarContent==null?\"\":tbarContent}</div>";
				this.bbartpl = "<div class=\"panel-bbar\" " +
					"id=\"$${bbarId}\">$${bbarContent==null?\"\":bbarContent}</div>";
				this.contenttpl = "<div id=\"$${pId}\" " +
					"class=\"panel-content ${bodyCls}\">$${html==null?\"\":html}</div>";
				juicer.set ( "cache", true );
				juicer.set ( "errorhandling", false );
				juicer.set ( "strip", true );
				juicer.set ( "detection", false );

			}, /**
			 * 渲染组件
			 * @private
			 * @param el目标容器对象
			 */
			render : function ( el ) {
				this.callParent ( [ el ] );
			},

			/**
			 * 创建DOM元素
			 * @private
			 */
			createDom : function () {
				var me = this;

				me.id = me.id || FAPUI.getId ();

				var headCfg = {};

				me.headId = FAPUI.getId ();
				headCfg.title = me.title;
				headCfg.border = me.border;
				headCfg.titleIconCls = me.titleIconCls;
				headCfg.tool = me.createTitleBarDom ();
				headCfg.headId = me.headId;
				var headContent = juicer ( me.headtpl, headCfg );

				var bodycfg = {};

				me.bodyId = FAPUI.getId ();
				bodycfg.border = me.border;
				bodycfg.content = me.initContentDom ();
				bodycfg.tbar = me.createTToolbarDom ();
				bodycfg.bbar = me.createBToolbarDom ();
				bodycfg.bodyId = me.bodyId;
				var bodyContent = juicer ( me.bodytpl, bodycfg );

				var cfg = {};

				cfg.headContent = headContent;
				cfg.bodyContent = bodyContent;
				cfg.id = me.id;
				var tmp = juicer ( me.tpl, cfg );

				return tmp;
			},

			/**
			 * 销毁
			 */
			onDestroy : function () {
				var me = this;

				me.bodyEl.remove ();
				delete me.bodyEl;
				me.tbar && me.tbar.destroy () && me.tbarEl.remove () && delete me.tarEl && delete me.tbarId;
				me.bbar && me.bbar.destroy () && me.bbarEL.remove () && delete me.bbarEl && delete me.bbarId;
				me.contentEl.remove ();
				delete me.contentEl;
				me.headEl.remove ();
				delete me.headEl;
				delete me.bodyId;
				delete me.pId;
				delete me.headId;
				if ( this.layout ) {
					this.layout.destroy ();
				}
				me.callParent ();
			},
			/**
			 * 计算面板大小
			 * @private
			 */
			computerSize : function () {
				var me = this;
				//获取标题栏和上下工具栏的高度
				var tbarH = me.tbarEl.length > 0 ? me.tbarEl.outerHeight () : 0;
				var bbarH = me.bbarEl.length > 0 ? me.bbarEl.outerHeight () : 0;

				me.headH = me.headEl.length > 0 ? me.headEl.outerHeight () : 0;
				var p = me.el.parent ();

				p.addClass ( "panel-noscroll" );
				me.width = me.width || p.width ();
				me.height = me.height || p.height ();
				if ( ! me.bodyEl ) {
					return;
				}
				//设置面板及内容区域的宽度
				if ( isNaN ( me.width ) ) {
					me.contentEl.width ( "auto" );
				} else {
					me._outerWidth ( me.width, me.el );
					me._outerWidth ( me.width, me.contentEl );
				}

				//设置面板及有效区域的高度
				if ( isNaN ( me.height ) ) {
					me.bodyEl.height ( "auto" );
				} else {
					me._outerHeight ( me.height - me.headH, me.bodyEl );
				}

				//设置面板内容区域的高度
				var bH = me.bodyEl.outerHeight ( true );

				me._outerHeight ( bH - tbarH - bbarH, me.contentEl );
			},
			/**
			 * 重新布局
			 * @private
			 */
			doLayout : function () {
				this.computerSize ();
				if ( this.contentEl && this.layout ) {
					this.contentEl.addClass ( "panel-noscroll" );
					if ( this.layout.border ) {
						this.layout.setWidth ( this.contentEl.width () - 2 );
						this.layout.setHeight ( this.contentEl.height () - 2 );
					} else {
						this.layout.setWidth ( this.contentEl.width () );
						this.layout.setHeight ( this.contentEl.height () );
					}
				}
			},
			/**
			 * 布局高度
			 */
			doLayoutH : function () {
				this.computerSize ();
				if ( this.contentEl && this.layout ) {
					this.contentEl.addClass ( "panel-noscroll" );
					if ( this.layout.border && this.layout.border === true ) {
						this.layout.setHeight ( this.contentEl.height () - 2 );
					} else {
						this.layout.setHeight ( this.contentEl.height () );
					}
				}
			}, /**
			 * @private
			 * 布局宽度
			 */
			doLayoutW : function () {
				this.computerSize ();
				if ( this.contentEl && this.layout ) {
					this.contentEl.addClass ( "panel-noscroll" );
					if ( this.layout.border ) {
						this.layout.setWidth ( this.contentEl.width () - 2 );
					} else {
						this.layout.setWidth ( this.contentEl.width () );
					}
				}
			},

			/**
			 * 创建标题栏
			 * @private
			 */
			createTitleBarDom : function () {
				var me = this;

				if ( me.title ) {
					me.collapseId = FAPUI.getId ( "collapse" );
					var cfg = {};
					var toolContent = "";
					var tpBtns = me.titleBtns;

					if ( tpBtns != null && tpBtns.length > 0 ) {
						var tempBtn;
						var aId = "";

						for ( var i = 0; i < tpBtns.length; i ++ ) {
							tempBtn = tpBtns[ i ];
							aId = FAPUI.getId ( "headToolTpl" + i );
							//判断是否存在iconCls属性，如果存在则渲染为图片，如果不存在则取text为超链接
							tempBtn.headToolId = aId;
							if ( tempBtn.iconCls ) {
								toolContent += "<a href=\"javascript:void(0);\" " +
									"id = \"" + aId + "\" class=\"" + tempBtn.iconCls + "\" " +
									"hidefocus=\"false\" style=\"display:inline-block;\"></a>";
							} else {
								toolContent += "<a href=\"javascript:void(0);\" " +
									"id = \"" + aId + "\" hidefocus=\"false\" " +
									"style=\"display:inline;\">" + tempBtn.text + "</a>";
							}
						}
					}
					if ( me.collapsable ) {
						toolContent += "<a href=\"javascript:void(0);\" " +
							"id=\"" + me.collapseId + "\" class=\"panel-tool-collapse\" " +
							"hidefocus=\"false\" title=\"点击折叠/展开\"></a>";
					}
					cfg.toolContent = toolContent;
					return juicer ( me.headtooltpl, cfg );
				} else {
					return "";
				}
			}, /**
			 * 创建标题栏事件
			 * @private
			 */
			createTitleBarEvent : function () {
				var me = this;

				if ( me.title ) {
					if ( me.collapsable ) {
						var collapseEL = $ ( "#" + me.collapseId );

						collapseEL.click ( function () {
							if ( me.collapsed === true ) {
								me.expand ( collapseEL );
							} else {
								me.collapse ( collapseEL );
							}
						} );
					}
					var tpBtns = me.titleBtns;
					var handler = "";
					var tmpAtag;

					if ( tpBtns != null && tpBtns.length > 0 ) {
						for ( var j = 0; j < tpBtns.length; j ++ ) {
							var headTpEl = $ ( "#" + tpBtns[ j ].headToolId );

							headTpEl.bind ( "click", function ( event ) {
								var targetId = $ ( event.target ).attr ( "id" );

								for ( var i = 0; i < tpBtns.length; i ++ ) {
									handler = tpBtns[ i ].handler;
									if ( targetId === tpBtns[ i ].headToolId ) {
										tmpAtag = $ ( "#" + targetId );
										handler && handler.call ( tmpAtag, tmpAtag, event );
										event.stopPropagation ();
									}
								}
							} );
						}
					}
					//	        		if(tpBtns != null && tpBtns.length > 0){
					//	        			headToolTplEl.bind("click",function(event){
					//        					var targetId = $(event.target).attr("id");
					//        					for(var i = 0 ; i < tpBtns.length ; i ++){
					//        						handler = tpBtns[i].handler;
					//        						if(targetId === tpBtns[i].headToolId){
					//        							tmpAtag = $("#"+targetId);
					//        							handler && handler.call(tmpAtag,tmpAtag,event);
					//                					event.stopPropagation();
					//        						}
					//        					}
					//        				});
					//	        		}
				}
			}, /**
			 * 创建上工具栏
			 * @private
			 */
			createTToolbarDom : function () {
				var me = this;

				if ( this.tbar != null ) {
					this.tbar = new FAPUI.ToolBar ( this.tbar );
					var cfg = {};

					cfg.tbarContent = this.tbar.createDom ();
					me.tbarId = FAPUI.getId ( "tbar" );
					cfg.tbarId = me.tbarId;
					return juicer ( me.tbartpl, cfg );
				}
				;
				return "";
			}, /**
			 * 创建上工具栏事件
			 * @private
			 */
			createTToolbarEvent : function () {
				if ( this.tbar && this.tbar.isUI && this.tbar.isUI () ) {
					this.tbar.bindEvent ();
				}
				;
			}, /**
			 * 创建下工具栏
			 * @private
			 */
			createBToolbarDom : function () {
				var me = this;

				if ( this.bbar != null ) {
					this.bbar = new FAPUI.ToolBar ( this.bbar );
					var cfg = {};

					cfg.bbarContent = this.bbar.createDom ();
					me.bbarId = FAPUI.getId ( "bbar" );
					cfg.bbarId = me.bbarId;
					return juicer ( me.bbartpl, cfg );
				}
				;
				return "";
			}, /**
			 * 创建下工具栏事件
			 * @private
			 */
			createBToolbarEvent : function () {
				if ( this.bbar && this.bbar.isUI && this.bbar.isUI () ) {
					this.bbar.bindEvent ();
				}
				;
			}, /**
			 * 初始化内容
			 * 如果配置了布局则使用布局
			 * 如果配置了内容则添加内容,html的方式优先级高于布局。如果两者同时存在只有html配置有效
			 * @private
			 */
			initContentDom : function () {
				var me = this;
				var cfg = {};

				me.pId = FAPUI.getId ();
				cfg.pId = me.pId;
				cfg.bodyCls = me.bodyCls;
				if ( me.html ) {
					cfg.html = me.html;
				} else if ( this.layout ) {
					this.layout = FAPUI.create ( this.layout );
					cfg.html = this.layout.createDom ();
				} else {
					cfg.html = this.createContentDom ();
				}
				return juicer ( me.contenttpl, cfg );
			},
			/**
			 * @returns {string}
			 */
			createContentDom : function () {
				return "";
			}, /**
			 * 初始化内容区域的事件绑定
			 */
			initContentEvent : function () {
				if ( this.layout && this.layout.isUI && this.layout.isUI () ) {
					this.layout.bindEvent ();
				}
			},

			/**
			 * 向内容区域添加其他组件,该面板中必须有一个布局.添加组件实际是往布局中添加一个组件
			 * @method attachComponent
			 * @param {Ojbect} Comp
			 */
			attachComponent : function ( Comp ) {
				var me = this;

				if ( this.layout && me.layout.isUI && me.layout.isUI () ) {
					me.layout.addItems ( Comp );
				}
			},

			/**
			 * 向Panel内容区域添加自定义html代码片段
			 * @method attachContent
			 * @param {string} html 代码片段
			 */
			attachContent : function ( html ) {
				var me = this;

				if ( me.contentEl ) {
					me.contentEl.html ( html );
				}
			}, /**
			 * @private
			 */
			afterRender : function () {
				var me = this;

				me.bodyEl = me.el.children ( "#" + me.bodyId );
				me.tbarEl = me.bodyEl.children ( "#" + me.tbarId );
				me.bbarEl = me.bodyEl.children ( "#" + me.bbarId );
				me.contentEl = me.bodyEl.children ( "#" + me.pId );
				me.headEl = me.el.children ( "#" + me.headId );
				me.initWidth = me.width;
				me.initHieght = me.height;
			}, /**
			 * 最大化最小化按钮事件绑定
			 * @private
			 */
			bindEvent : function () {
				var me = this;

				me.el = me.el || $ ( "#" + me.id );
				me.afterRender ();
				me.createTitleBarEvent ();
				me.createTToolbarEvent ();
				me.initContentEvent ();
				me.createBToolbarEvent ();
			}, /**
			 * 标题栏折叠按钮展开事件
			 * @private
			 */
			expand : function ( tool ) {
				var me = this;
				var collapse = tool.find ( "a.panel-tool-collapse" );

				if ( me.collapsed === false ) {
					return;
				}
				me.bodyEl.stop ( true, true );
				collapse.removeClass ( "panel-tool-expand" );
				me.bodyEl.slideDown ( "normal", function () {
					me.collapsed = false;
					me.el.css ( "height", me.height );
				} );
				me.fireEvent ( "expand", me );
			}, /**
			 * 标题栏折叠按钮折叠事件
			 * @private
			 */
			collapse : function ( tool ) {
				var me = this;
				var collapse = tool.find ( "a.panel-tool-collapse" );

				if ( me.collapsed === true ) {
					return;
				}
				me.bodyEl.stop ( true, true );
				collapse.addClass ( "panel-tool-expand" );
				me.bodyEl.slideUp ( "normal", function () {
					me.collapsed = true;
					me.el.css ( "height", "auto" );
				} );
				me.fireEvent ( "collapse", me );
			}, /**
			 * 最大化
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
				me.minimized = false;
				me.maximized = true;
			}, /**
			 * 还原
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
				me.minimized = false;
				me.maximized = false;
			},

			/**
			 * 关闭面板
			 * @method close
			 * @param {boolean} closed 为true则销毁面板，为false则隐藏面板
			 */
			close : function ( closed ) {
				var me = this;

				closed = closed || me.closed;
				if ( closed ) {
					if ( false !== me.fireEvent ( "beforeclose", me ) ) {
						me.fireEvent ( "close", me );
						me.destroy ();
					}
				} else {
					me.hide ();
				}

			}, /**
			 * 设置标题信息
			 * @method setTitle
			 * @param {String} title标题
			 */
			setTitle : function ( title ) {
				if ( this.headEl ) {
					this.headEl.children ( "div.panel-title" ).html ( title );
				}
				this.title = title;
			}, /**
			 * 设置显示面板
			 * @method show
			 */
			show : function () {
				this.callParent ();
			}, /**
			 * <font color="red">设置隐藏面板,该方法是其他组件继承自panel的父类方法（不适用于其他组件方法）,请调用组件自己的隐藏方法</font>
			 * @method hide
			 */
			hide : function () {
				var me = this;

				if ( false !== me.fireEvent ( "beforehide", me ) ) {
					me.callParent ();
					me.fireEvent ( "hide", me );
				}
			}, /**
			 * 设置面板高度
			 * @method setHeight
			 * @param {Number} h
			 */
			setHeight : function ( h ) {
				this.height = h;
				this.el.height ( h );
				this.doLayoutH ();
			}, /**
			 * 设置面板宽度
			 * @method setWidth
			 * @param {Number} w
			 */
			setWidth : function ( w ) {
				this.width = w;
				this.el.width ( w );
				this.doLayoutW ();
			}, /**
			 * 设置面板标题栏不可见
			 * @method setTitleVisible
			 * @param {boolean} visible 为true则隐藏标题栏，反之则显示标题栏
			 */
			setTitleVisible : function ( visible ) {
				if ( this.headEl ) {
					this.headEl.css ( "display", visible ? "block" : "none" );
				}
			}, /**
			 * 获取面板的高度
			 * @method getHeight
			 * @return {Number} height
			 */
			getHeight : function () {
				return this.height;
			}, /**
			 * 获取面板的宽度
			 * @method getWidth
			 * @return {Number} width
			 */
			getWidth : function () {
				return this.width;
			}, /**
			 * 获取上工具栏
			 * @method getTBar
			 * @returns {FAPUI.ToolBar}
			 */
			getTBar : function () {
				return this.tbar;
			}, /**
			 * 获取下工具栏
			 * @method getBBar
			 * @returns {FAPUI.ToolBar}
			 */
			getBBar : function () {
				return this.bbar;
			},
			/**
			 * @access private
			 * 根据不同浏览器计算宽度
			 * @param {Object} width 目标宽度值
			 * @param {Object} ele 目标对象
			 */
			_outerWidth : function ( width, ele ) {
				if ( ! ele ) {
					return;
				}
				if ( ! $.boxModel && $.browser.msie ) {
					ele.width ( width );
				} else {
					ele.width ( width - ele.outerWidth () + ele.width () );
				}
			},
			/**
			 * @access private
			 * 根据不同浏览器计算高度
			 * @param {Object} height 目标高度值
			 * @param {Object} ele 目标对象
			 */
			_outerHeight : function ( height, ele ) {
				if ( ! ele ) {
					return;
				}
				if ( ! $.boxModel && $.browser.msie ) {
					ele.height ( height );
				} else {
					ele.height ( height - ( ele.outerHeight () - ele.height () ) );
				}
			}
		}
	} );
	FAPUI.register ( "panel", FAPUI.Panel );

	return FAPUI.Panel;
} );

