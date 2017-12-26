/**
 *以下代码是展示如何创建一个menubar
 *
 *
 var panel = new FAPUI.MenuBar( {
		renderTo:"box",
		items:[ {
			iconCls:"icon-add16",
			handler:function(a,b,event){
				alert("menuclcik");
			},
			hoverIntent:true,
			subMenu:{
				items:[ {
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
					children:[ {
						checkbox:true,
						text:"网页特效原理分析",
					    iconCls:"ui-icon-close",
					    children:[ {
					    	text:"响应用户操作1"
					    },{
					    	text:"响应用户操作2"
					    } ]
					},{
						text:"响应用户操作"
					} ]
				} ]
			},
			listeners:{
				"click":function(Button,btn,event){
	              //alert("click"+"  "+Button.renderTo);
				},
				"mouseover":function(Button,btn,event){
					//alert("moue over");
				},
				"mouseout":function(Button,btn,event){
					//alert("mouse out");
				}
			}
		},{
			text:"MenuButton",
			handler:function(a,b,event){
				alert("toolbar");
			},
			listeners:{
				"click":function(Button,btn,event){
	              //alert("click"+"  "+Button.renderTo);
				},
				"mouseover":function(Button,btn,event){
					//alert("moue over");
				},
				"mouseout":function(Button,btn,event){
					//alert("mouse out");
				}
			}
		},{
			iconCls:"icon-add16",
			text:"Format",
			handler:function(a,b,event){
				alert("toolbar");
			},
			subMenu:{
				items:[ {
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
					children:[ {
						checkbox:true,
						text:"网页特效原理分析",
					    iconCls:"ui-icon-close",
					    children:[{
					    	text:"响应用户操作1"
					    },{
					    	text:"响应用户操作2"
					    } ]
					},{
						text:"响应用户操作"
					} ]
				} ]
			},
			hoverIntent:true,
			listeners:{
				"click":function(Button,btn,event){
	              //alert("click"+"  "+Button.renderTo);
				},
				"mouseover":function(Button,btn,event){
					//alert("moue over");
				},
				"mouseout":function(Button,btn,event){
					//alert("mouse out");
				}
			}
		},{
			iconCls:"icon-add16",
			text:"Cut",
			handler:function(a,b,event){
				alert("toolbar");
			},
			listeners:{
				"click":function(Button,btn,event){
	              //alert("click"+"  "+Button.renderTo);
				},
				"mouseover":function(Button,btn,event){
					//alert("moue over");
				},
				"mouseout":function(Button,btn,event){
					//alert("mouse out");
				}
			}
		},{
			text:"Copy",
			handler:function(a,b,event){
				alert("toolbar");
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
	              //alert("click"+"  "+Button.renderTo);
				},
				"mouseover":function(Button,btn,event){
					//alert("moue over");
				},
				"mouseout":function(Button,btn,event){
					//alert("mouse out");
				}
			}
		},{
			text:"Paste",
			handler:function(a,b,event){
				alert("toolbar");
		},
		listeners:{
			"click":function(Button,btn,event){
              //alert("click"+"  "+Button.renderTo);
			},
			"mouseover":function(Button,btn,event){
				//alert("moue over");
			},
			"mouseout":function(Button,btn,event){
				//alert("mouse out");
			}
		}
	}]
});
 *@class FAPUI.MenuBar
 *@extends FAPUI.Component
 *菜单栏
 */
define ( function ( require, exports, module ) {
	var importcss = "./themes/" + FAPUI.getTheme () + "/css/ui-menubar.css";

	require.async ( importcss );

	require ( "./fapui-menuitem" );

	FAPUI.define ( "FAPUI.MenuBar", {
		extend : "FAPUI.Component", props : {
			/**
			 *见menu的配置
			 *@property items
			 *@type Array
			 */
			items : null, menuItem : null
		}, override : {
			/**
			 * @private
			 */
			initConfig : function () {
				this.callParent ();
			}, /**
			 * @private
			 */
			render : function ( el ) {
				this.callParent ( [ el ] );
			}, /**
			 * @private
			 * 绑定事件
			 */
			bindEvent : function () {
				var me = this;

				me.el = me.el || $ ( "#" + me.id );
				me.afterRender ();
			}, /**
			 * @private
			 */
			afterRender : function () {
				var me = this;

				$ ( me.items ).each ( function () {
					var that = this;

					that.renderTo = me.el;
					me.menuItem = new FAPUI.MenuItem ( that );
				} );

			}, /**
			 * @private
			 * 创建dom
			 */
			createDom : function () {
				var me = this;

				me.id = me.id || FAPUI.getId ();
				return "<div id=\"" + me.id + "\" class=\"menubar\"></div>";
			}, /**
			 *显示
			 *@method show
			 */
			show : function () {
				this.callParent ();
			},

			/**
			 *隐藏
			 *@method show
			 */
			hide : function () {
				this.callParent ();
			}, /**
			 * @private
			 * 释放元素
			 */
			onDestroy : function () {
				var me = this;

				if ( me.items ) {
					$ ( me.items ).each ( function () {
						var me = this;

						me.destroy ();
					} );
				}
				me.callParent ();
			}
		}
	} );
	FAPUI.register ( "menuBar", FAPUI.MenuBar );

	return FAPUI.MenuBar;
} );
