/**
 *定义FAPUI.ToolBar组件
 *<p>以下代码将演示如何使用ToolBar组件</p>
 var toolbar = new FAPUI.ToolBar({
		renderTo:"box",
		align:"right",
		items:[{
			type:"linkButton",
			iconCls:"icon-add",
			handler:function(a,b,event){

			},
			listeners:{
				"click":function(Button,btn,event){
					alert("click"+"  "+Button.renderTo);
				},
				"mouseover":function(Button,btn,event){

				},
				"mouseout":function(Button,btn,event){

				}
			}
		},{
			type:"-"
		},{
			type:"linkButton",
			text:"MenuButton",
			handler:function(a,b,event){
				alert("toolbar");
			},
			listeners:{
				"click":function(Button,btn,event){
					////alert("click"+"  "+Button.renderTo);
				},
				"mouseover":function(Button,btn,event){
					//alert("moue over");
				},
				"mouseout":function(Button,btn,event){
					//alert("mouse out");
				}
			}
		},{
			type:"-"
		},{
			type:"linkButton",
			iconCls:"icon-save",
			text:"Format",
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
			type:"-"
		},{
			type:"linkButton",
			iconCls:"icon-save",
			text:"Save",
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
			type:"-"
		},{
			type:"linkButton",
			text:"Search",
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
					alert("click"+"  "+Button.renderTo);
				},
				"mouseover":function(Button,btn,event){

				},
				"mouseout":function(Button,btn,event){

				}
			}
		},{
			type:"-"
		},{
			type:"normalButton",
			text:"Confirm",
			handler:function(a,b,event){

			},
			listeners:{
				"click":function(Button,btn,event){
					alert("click"+"  "+Button.renderTo);
				},
				"mouseover":function(Button,btn,event){

				},
				"mouseout":function(Button,btn,event){

				}
			}
		},{
			type:"normalButton",
			text:"Confirm",
			iconCls:"icon-ok",
			handler:function(a,b,event){
				alert("toolbar");
			},
			listeners:{
				"click":function(Button,btn,event){
				  alert("click"+"  "+Button.renderTo);
				},
				"mouseover":function(Button,btn,event){

				},
				"mouseout":function(Button,btn,event){

				}
			}
		}]
	});

 *@class FAPUI.ToolBar
 *@extend FAPUI.Component
 *@author wzj
 */

define ( function ( require ) {
	var importcss = "./themes/" + FAPUI.getTheme () + "/css/ui-toolbar.css";

	require.async ( importcss );

	require ( "./fapui-button" );

	require ( "./fapui-menu" );

	require ( "./fapui-component" );

	FAPUI.define ( "FAPUI.ToolBar", {
		extend : "FAPUI.Component", props : {
			/**
			 * 子组件数组
			 * spanNum子组件中的添加spanNum属性为组件与组件之间的距离是多少;
			 * 可以设置像素如5px,可以设置百分比20%,如果是百分比则安toolbar的总长度来计算
			 * @property  items
			 * @type Array
			 * @default []
			 */
			items : [], /**
			 * ToolBar按钮对象
			 * @private
			 */
			button : null,

			/**
			 * ToolBar对齐方式
			 * @property  align
			 * @type String
			 * @default "left"
			 */
			align : "left",

			showBg : true
		}, override : {

			/**
			 * 初始化配置项
			 * @private
			 */
			initConfig : function () {
				this.callParent ();
			},

			/**
			 * 渲染ToolBar
			 * @method  render
			 * @param {Object} el 目标容器
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

				me._json2Widgets ();
				me.id = me.id || FAPUI.getId ();
				var html = [];

				html.push ( "<div id=\"" + me.id + "\" class=\"toolbar \"" + ( me.showBg ? "toolbar-bg" :
						"" ) + "\" style=\"text-align:" + this.align + ";\">" );
				$ ( me.items ).each ( function () {
					var that = this;

					that.spanNum = that.spanNum || "0px";
					html.push ( "<div style=\"display:inline-block;" +
						"vertical-align: top;_zoom:1;_display:inline;" +
						"padding-left:" + that.spanNum + ";\">" );
					if ( that.isUI && that.isUI () ) {
						html.push ( that.createDom () );
					} else if ( that.type === "text" ) {
						html.push ( "<div  style=\" color: #15428b;" +
							"font-size: 12px;font-weight: bold;" +
							"line-height: 15px;padding-top:5px;\" >" + that.text + "</div>" );
					} else {
						html.push ( "<a href=\"javascript:void(0);\" class=\"button-separator\" hidefocus=\"true\"></a>" );
					}
					html.push ( "</div>" );
				} );

				html.push ( "</div>" );
				return html.join ( " " );
			},
			/**
			 * @private
			 */
			bindEvent : function () {
				var me = this;

				$ ( me.items ).each ( function () {
					var that = this;

					if ( that.isUI && that.isUI () ) {
						that.bindEvent ();
						that.setWidth ( that.width );
					}
				} );
			},
			/**
			 * @access private
			 * 将json格式的字符串转换为组件对象
			 */
			_json2Widgets : function () {
				var me = this;
				var newitems = [];

				$ ( me.items ).each ( function () {
					var that = this;

					if ( that !== "-" && that.type !== "-" && that.type !== "text" ) {
						that.ctype = that.ctype || "button";
						that = FAPUI.create ( that );
					}
					newitems.push ( that );
				} );
				me.items = newitems;
			},

			/**
			 * 设置宽度
			 * @private
			 */
			setWidth : function ( w ) {

			}, /**
			 * 设置高度
			 * @private
			 */
			setHeight : function ( h ) {

			},

			/**
			 * 显示ToolBar
			 * @method show
			 */
			show : function () {
				this.callParent ();
			},

			/**
			 * 隐藏ToolBar
			 * @method hide
			 */
			hide : function () {
				this.callParent ();
			},

			/**
			 * 根据itemId获取对应的按钮
			 * @method getToolItem
			 * @param {string} itemId
			 * @returns {Button} cmp
			 */
			getToolItem : function ( itemId ) {
				var me = this;
				var cmp;

				if ( itemId && FAPUI.isString ( itemId ) ) {
					$ ( me.items ).each ( function () {
						var that = this;

						if ( that.itemId === itemId ) {
							cmp = that;
							return false;
						}
					} );
					return cmp;
				}
			},

			/**
			 * 根据itemId禁用对应的按钮
			 * @method disable
			 * @param {string} itemId
			 */
			disable : function ( itemId ) {
				var me = this;

				me.getToolItem ( itemId ).disable ();
			},

			/**
			 * 根据itemId启用对应的按钮
			 * @method enable
			 * @param {string} itemId
			 */
			enable : function ( itemId ) {
				var me = this;

				me.getToolItem ( itemId ).enable ();
			},
			/**
			 * 销毁
			 */
			onDestroy : function () {
				var me = this;

				if ( me.items ) {
					$ ( me.items ).each ( function () {
						var that = this;

						if ( that.type === "-" ) {
							that = null;
						} else {
							that.destroy ();

						}
					} );
				}
				me.callParent ();
			}
		}
	} );
	FAPUI.register ( "toolBar", FAPUI.ToolBar );

	return FAPUI.ToolBar;
} );
