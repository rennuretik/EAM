/**
 *定义FAPUI.Layout.HBoxLayout水平布局组件
 *<p>以下代码将演示如何使用HBoxLayout组件</p>
 *
 *
 *
 *
 define(function(require) {
	require("jquery");
	require("widgets/fapui-hboxlayout");
	require("widgets/fapui-panel");
	$ ( function () {
		var hbox = new HBoxLayout ( {
			border : true,

			valign : "stretch", items : [ new FAPUI.Panel ( {
				height : 150,
				itemStyle : "padding:2px 2px 2px 4px",
				title : "item-panel",
				itemId : "first",
				html : "panel-1",
				flex : 1
			} ), new FAPUI.Panel ( {
				height : 150,
				itemStyle : "padding:2px",
				title : "item-panel",
				itemId : "second",
				html : "panel-2",
				flex : 1
			} ), new FAPUI.Panel ( {
				height : 150,
				itemStyle : "padding:2px",
				title : "item-panel",
				itemId : "third",
				html : "panel-3",
				flex : 1
			} ), new FAPUI.Panel ( {
				height : 150,
				itemStyle : "padding:2px",
				title : "item-panel",
				itemId : "four",
				html : "panel-4",
				flex : 3
			} ) ]
		} );

		new FAPUI.Panel ( {
			width : 800, height : 450, layout : hbox, renderTo : document.body
		} );

		$ ( "#add" ).click ( function () {
			hbox.addItems ( [ new FAPUI.Panel ( {
				height : 150,
				itemStyle : "padding:2px",
				title : "item-panel",
				itemId : "four",
				html : "panel-4",
				flex : 3
			} ), new FAPUI.Panel ( {
				height : 150,
				itemStyle : "padding:2px",
				title : "item-panel",
				itemId : "four",
				html : "panel-4",
				flex : 3
			} ) ] );

		} );

		$ ( "#remove" ).click ( function () {
			hbox.removeItem ( 2 );
		} );
	} );
} );
 *@class FAPUI.Layout.HBoxLayout
 *@extend FAPUI.Component
 *@author wzj
 */

define ( function ( require, exports, module ) {
	require ( "./fapui-component" );
	FAPUI.define ( "FAPUI.Layout.HBoxLayout", {
		extend : "FAPUI.Component",
		props : {
			/**
			 * 水平盒布局的宽度
			 * @property width
			 * @type Number
			 * @default "auto"
			 */
			width : FAPUI.getViewSize ().width,

			/**
			 * 水平盒布局的高度
			 * @property height
			 * @type Number
			 * @default "auto"
			 */
			height : 40, /**
			 * 水平盒布局是否有边框
			 * @property border
			 * @type boolean
			 * @default false
			 */
			border : false, /**
			 * 子组件对象数组,水平排列
			 * 子组件属性：flex{Number}，itemStyle{String}，itemCls{String}，itemId{String}
			 * @property items
			 * @type Array
			 * @default null
			 */
			items : null, /**
			 * 控制子组件在容器中垂直方向的对齐方式
			 * @property valign
			 * @value "top","middle","bottom","stretch"
			 * @type String
			 * @default "top"
			 */
			valign : "top"
		}, override : {

			/**
			 * 初始化配置项
			 * @private
			 */
			initConfig : function () {
				this.callParent ();
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
				me.id = me.id || FAPUI.getId ();
				var html = [];

				html.push ( "<table id=\"" + me.id + "\" class=\"hboxlayout-container\"" +
					" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"" +
					" style=\"border:1px solid #99BBE8;\">" );
				var tpl = "<tr>" + me._createColumn () + "</tr>";

				html.push ( tpl );
				html.push ( "</table>" );
				return html.join ( "" );

			}, /**
			 * @private
			 */
			bindEvent : function () {
				var me = this;

				me.el = me.el || $ ( "#" + me.id );
				var items = me.items;

				$ ( items ).each ( function () {
					var that = this;

					that.bindEvent ();
				} );
				me.afterRender ();
			}, /**
			 * @private
			 */
			afterRender : function () {
				var me = this;

				me.setWidth ( me.width );
				me.setHeight ( me.height );
			},

			/**
			 * 创建布局列
			 * @private
			 */
			_createColumn : function ( items, index ) {
				var me = this;
				var columnHtml = [];

				items = items || me.items;
				var anchor = 100 / items.length;
				var lastanchor = 100;

				$ ( items ).each ( function ( i ) {
					var that = this;

					i = index ? ++ index : i;
					var cls = that.itemCls || "";
					var styles = that.itemStyle || "";

					that._index = i;
					that.cId = that.cId || FAPUI.getId ( "Hbox" );
					anchor = that.anchor || ( anchor + "%" );
					lastanchor = lastanchor - parseInt ( anchor );
					var tpl = "<td index=\"" + i + "\" id=\"" + that.cId + "\" " +
						"class=\"" + cls + "\" width=\"" + anchor + "\" " +
						"style=\"" + styles + "\">" + that.createDom () + "</td>";

					columnHtml.push ( tpl );
				} );
				if ( lastanchor > 0 ) {
					var tpl = "<td width=\"" + lastanchor + "%\"></td>";

					columnHtml.push ( tpl );
				}
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
					sum += this.flex;
				} );
				return sum;
			},

			/**
			 * 重新布局
			 * @private
			 */
			doLayout : function () {
				var me = this;
				var width;

				$ ( me.items ).each ( function ( i ) {
					var that = this;
					var cel = me.el.find ( "#" + that.cId );
					var pl = parseInt ( cel.css ( "padding-left" ) );
					var pr = parseInt ( cel.css ( "padding-right" ) );
					var sum = me._sumFlex ();
					var percent = that.flex / sum;

					width = parseInt ( me.width * percent );
					if ( percent ) {
						width = parseInt ( me.width * percent );
					} else {
						width = parseInt ( me.width * ( parseInt ( that.anchor ) / 100 ) );
					}
					that.setWidth ( width - pl - pr );
					if ( me.valign === "stretch" ) {
						that.setHeight ( me.height );
					} else {
						that.setHeight ( that.height );
						cel.attr ( "valign", me.valign );
					}
				} );
			}, /**
			 * @private
			 */
			doLayoutW : function () {

				var me = this;
				var width;

				$ ( me.items ).each ( function ( i ) {
					var that = this;
					var cel = me.el.find ( "#" + that.cId );
					var pl = parseInt ( cel.css ( "padding-left" ) );
					var pr = parseInt ( cel.css ( "padding-right" ) );
					var sum = me._sumFlex ();
					var percent = that.flex / sum;

					if ( percent ) {
						width = parseInt ( me.width * percent );
					} else {
						width = parseInt ( me.width * ( parseInt ( that.anchor ) / 100 ) );
					}
					that.setWidth ( width - pl - pr );
				} );
			}, /**
			 * @private
			 */
			doLayoutH : function () {
				var me = this;

				$ ( me.items ).each ( function ( i ) {
					var that = this;

					if ( me.valign === "stretch" ) {
						that.setHeight ( me.height );
					} else {
						that.setHeight ( that.height );
						//that.attr("valign",me.valign);
					}
				} );

			},
			/**
			 * @access private
			 * json格式的对象转换为面板对象
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
				var cel = me.el.find ( "td[index=\"\"+i+\"\"]" );

				tpl.insertAfter ( cel );
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
					var rm = me.el.find ( "td[index=\"\"+index+\"\"]" );

					rm.remove ();
					me.i = index;
				} else {
					if ( me.id === index ) {
						return;
					}
					var rm = me.el.find ( "#" + index );

					index = parseInt ( rm.attr ( "index" ) );
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
					index = parseInt ( me.el.find ( "#" + index ).attr ( "index" ) );
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
				this.doLayoutH ();
			}, /**
			 * 设置宽度
			 * @method setWidth
			 * @param {number} w
			 */
			setWidth : function ( w ) {
				this.width = w;
				this.el.width ( w );
				this.doLayoutW ();
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
			}, /**
			 * @private
			 */
			onDestroy : function () {
				var me = this;

				if ( me.items ) {
					var that = this;

					that.destroy ();
				}
				me.callParent ();
			}
		}
	} );
	FAPUI.register ( "hboxLayout", FAPUI.Layout.HBoxLayout );

	return FAPUI.Layout.HBoxLayout;
} );
