/**
 *定义FAPUI.Layout.VBoxLayout垂直布局组件
 *<p>以下代码将演示如何使用VBoxLayout组件</p>
 *
 *
 *
 *
 define(function(require) {
	require("jquery");
	require("widgets/fapui-vboxlayout");
	require("widgets/fapui-panel");
	$( function () {
		var hbox = new FAPUI.Layout.VBoxLayout( {
			renderTo : "ab",
			border : true,
			width : 200,
			height : 500,
			halign : "stretch",
			items : [
				new FAPUI.Panel( {
					width : 100,
					itemStyle : "padding:2px",
					title : "item-panel",
					itemId : "first",
					html : "panel-1",
					flex : 1
				} ),
				new FAPUI.Panel( {
					width : 100,
					itemStyle : "padding:2px",
					title : "item-panel",
					itemId : "second",
					html : "panel-2",
					flex : 1
				} ),
				new FAPUI.Panel( {
					width : 100,
					itemStyle : "padding:2px",
					title : "item-panel",
					itemId : "third",
					html : "panel-3",
					flex : 1
				} ), new FAPUI.Panel( {
					width : 100,
					itemStyle : "padding:2px",
					title : "item-panel",
					itemId : "four",
					html : "panel-4",
					flex : 3
				} )
			]
		} );

		$( "#add" ).click( function () {
			hbox.addItems( [ {
						width : 100,
						itemStyle : "padding:2px",
						title : "item-panel",
						itemId : "eight",
						html : "panel-7",
						flex : 2
					}, {
						width : 100,
						itemStyle : "padding:2px 4px 2px 2px",
						title : "item-panel",
						itemId : "nine",
						html : "panel-8",
						flex : 2
					} ] );
		} );
		$( "#remove" ).click( function () {
			hbox.removeItem( 2 );
		} );
	} );
} );
 *@class FAPUI.Layout.VBoxLayout
 *@extend FAPUI.Component
 *@author wzj
 */

define ( function ( require, exports, module ) {
	require ( "./fapui-component" );

	FAPUI.define ( "FAPUI.Layout.VBoxLayout", {
		extend : "FAPUI.Component", props : {

			/**
			 * 垂直盒布局的宽度
			 * @property width
			 * @type Number
			 * @default "auto"
			 */
			width : "auto",

			/**
			 * 垂直盒布局的高度
			 * @property height
			 * @type Number
			 * @default "auto"
			 */
			height : "auto",

			/**
			 * 垂直盒布局是否有边框
			 * @property border
			 * @type boolean
			 * @default false
			 */
			border : false,

			/**
			 * 子组件对象数组,垂直排列
			 * 子组件属性：flex{Number}，itemStyle{String}，itemCls{String}，itemId{String}
			 * @property items
			 * @type Array
			 * @default null
			 */
			items : null,

			/**
			 * 控制子组件在容器中水平方向的对齐方式
			 * @property halign
			 * @type String
			 * @default "left"
			 */
			halign : "left"
		}, override : {

			/**
			 * 初始化配置项
			 * @private
			 */
			initConfig : function () {
				this.callParent ();
				this.i = - 1;
				this.id = "-1";
			},

			/**
			 * 渲染组件
			 * @private
			 * @param {Object} el
			 */
			render : function ( el ) {
				if ( ! this.border ) {
					this.el.css ( "border", "0" );
				}
				this.callParent ( [ el ] );
			}, /**
			 * 释放组件
			 * @private
			 */
			onDestroy : function () {
				var me = this;

				var sub = me.el.children ();

				if ( sub ) {
					$ ( sub ).each ( function () {
						$ ( this ).remove ();
					} );
				}
				me.callParent ();
			}, /**
			 * 创建DOM文档
			 * @private
			 */
			createDom : function () {
				var me = this;

				me.items = me._createWidget ();
				var html = [];

				me.id = me.id || FAPUI.getId ();
				html.push ( "<table id=\"" + me.id + "\" class=\"hboxlayout-container\" " +
					"border=\"0\" cellpadding=\"0\" cellspacing=\"0\" " +
					"style=\"border:1px solid #99BBE8;\">" );
				html.push ( me._createColumn () );
				html.push ( "</table>" );
				return html.join ( "" );

			}, /**
			 * @private
			 * 绑定事件
			 */
			bindEvent : function () {
				var me = this;

				me.el = me.el || $ ( "#" + me.id );
				var items = me.items;

				$ ( items ).each ( function () {
					var that = this;

					that.bindEvent ();
				} );
			},
			/**
			 * @access private
			 * 创建布局列
			 */
			_createColumn : function ( items, index ) {
				var me = this;
				var columnHtml = [];

				items = items || me.items;
				$ ( items ).each ( function ( i ) {
					var that = this;

					i = index ? ++ index : i;
					var cls = that.itemCls || "";
					var styles = that.itemStyle || "";
					var itemId = that.itemId || "";
					var tpl = "<tr><td index=\"" + i + "\" id=\"" + itemId + "\" " +
					"class=\"" + cls + "\" style=\"" + styles + "\">" +
						that.createDom () + "</td></tr>";

					columnHtml.push ( tpl );
				} );

				return columnHtml.join ( "" );
			},

			/**
			 * 求flex之和
			 * @private
			 */
			_sumFlex : function () {
				var me = this;
				var sum = 0;

				$ ( me.items ).each ( function () {
					if ( ! this.flex ) {
						this.flex = 1;
					}
					sum += this.flex || 1;
				} );
				return sum;
			},

			/**
			 * 内部组件宽度计算
			 * @private
			 */
			_afterRender : function () {
				var me = this;

				$ ( me.items ).each ( function () {
					var that = this;
					var cel = that.itemId ? me.el.find ( "#" + that.itemId ) :
						me.el.find ( "td[index=\"" + i + "\"]" );
					var pt = parseInt ( cel.css ( "padding-top" ) , 10 );
					var pb = parseInt ( cel.css ( "padding-bottom" ), 10 );
					var sum = me._sumFlex ();
					var percent = that.flex / sum;
					var height = parseInt ( me.height * percent , 10 );

					that.setHeight ( height - pt - pb );
					if ( me.halign === "stretch" ) {
						that.setWidth ( me.width );
					} else {
						that.setWidth ( that.width );
						cel.attr ( "align", me.halign );
					}
				} );
			},

			/**
			 * 重新布局
			 * @private
			 */
			doLayout : function () {
				var me = this;

				me._afterRender ();
			},

			/**
			 * json格式的对象转换为面板对象
			 * @private
			 */
			_createWidget : function ( items, index ) {
				var me = this;
				var aw = [];

				items = items || me.items;
				$ ( items ).each ( function ( i ) {
					var that = this;

					that = FAPUI.create ( that );
					i = index ? ++ index : i;
					aw.push ( that );
					//var cel = that.itemId ? me.el.find("#"+that.itemId):me.el.find("td[index=""+i+""]");
					//that.render(cel);
				} );
				return aw;
			},

			/**
			 * 添加子组件
			 * @method addItems
			 * @param {Object} items 子组件配置
			 */
			addItems : function ( items ) {
				var me = this;
				var i = me.items.length - 1;

				if ( ! FAPUI.isArray ( items ) ) {
					items = [ items ];
				}
				items = me._createWidget ( items, i );
				var tpl = $ ( me._createColumn ( items, i ) );
				var cel = me.el.find ( "td[index=\"" + i + "\"]" );

				tpl.insertAfter ( cel.parent () );
				$ ( items ).each ( function () {
					var that = this;

					that.bindEvent ();
				} );
				me.items = me.items.concat ( items );
				me.doLayout ();
			},

			/**
			 * 移除指定位置的组件
			 * 注意:索引是从0开始的
			 * @method removeItem
			 * @param {*} index 索引/组件itemId
			 */
			removeItem : function ( index ) {
				var me = this;

				if ( FAPUI.isNumber ( index ) ) {
					if ( me.i === index ) {
						return;
					}
					var rm = me.el.find ( "td[index=\"" + index + "\"]" );

					rm.remove ();
					me.i = index;
				} else {
					if ( me.id === index ) {
						return;
					}
					var rm = me.el.find ( "#" + index );

					index = parseInt ( rm.attr ( "index" ), 10 );
					rm.remove ();
					me.id = index;
				}

				me.items.splice ( index, 1 );

				me.doLayout ();
			},

			/**
			 * 根据索引或者组件的的itemId获取组件
			 * @method getItem
			 * @param {*} index 索引/组件itemId
			 * @return {Object}
			 */
			getItem : function ( index ) {
				var me = this;

				if ( FAPUI.isNumber ( index ) ) {
					return me.items[ index ];
				} else {
					index = parseInt ( me.el.find ( "#" + index ).attr ( "index" ), 10 );
					return me.items[ index ];
				}
			},

			/**
			 * 设置高度
			 * @method setHeight
			 * @param {number} h
			 */
			setHeight : function ( h ) {
				this.height = h;
				this.el.height ( h );
				this.doLayout ();
			}, /**
			 * 设置宽度
			 * @method setWidth
			 * @param {number} w
			 */
			setWidth : function ( w ) {
				this.width = w;
				this.el.width ( w );
				this.doLayout ();
			}, /**
			 * 获取高度
			 * @method getHeight
			 * @return {number} height
			 */
			getHeight : function () {
				return this.height;
			}, /**
			 * 获取宽度
			 * @method getWidth
			 * @return {number} width
			 */
			getWidth : function () {
				return this.width;
			},
			/**
			 * onDestroy
			 */
			onDestroy : function () {
				var me = this;

				if ( me.items ) {
					$ ( me.items ).each ( function () {
						var that = this;

						that.destroy ();
					} );
				}
				me.callParent ();
			}
		}
	} );
	FAPUI.register ( "vboxLayout", FAPUI.Layout.VBoxLayout );

	return FAPUI.Layout.VBoxLayout;
} );
