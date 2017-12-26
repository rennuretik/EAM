/**
 * UI组件
 * @module widgets
 */

/**
 *定义FAPUI.Layout.AccordionLayout布局组件
 *<p>以下代码将演示如何使用AccordionLayout组件</p>
 define(function(require) {
	require("jquery");
	require("widgets/fapui-accordion");
	require("widgets/fapui-panel");
	$(function () {
		var a = new FAPUI.Layout.AccordionLayout({
			renderTo: "ab",//要渲染的位置
			width: 200,//指定宽度
			height: 250,//指定高度
			items: [new FAPUI.Panel({	//内部元素
				border: false, //icons:"icon-edit",
				itemId: "itemd_example1",
				title: "title_example1",
				html: "text_example1"
			}), new FAPUI.Panel({
				border: false,
				itemId: "itemd_example2",
				title: "title_example2",
				html: "text_example2"
			}), new FAPUI.Panel({
				border: false,
				itemId: "itemd_example3",
				title: "title_example3",
				html: "text_example3"
			}), new FAPUI.Panel({
				border: false,
				itemId: "itemd_example4",
				title: "title_example4",
				html: "text_example4"
			})]
 		})
 	})
 })
 * @class FAPUI.Layout.AccordionLayout
 * @extends FAPUI.Component
 */

define ( function ( require, exports, module ) {
	var importcss = "./themes/" + FAPUI.getTheme () + "/css/ui-accordion.css";

	require.async ( importcss );
	require ( "./fapui-component" );

	FAPUI.define ( "FAPUI.Layout.AccordionLayout", {
		extend : "FAPUI.Component",
		props : {
			/**
			 * 内部变量
			 * 手风琴布局中当前激活的内容的索引
			 * @private
			 */
			activeIndex : 0,

			/**
			 * 宽度
			 * @property  width
			 * @type Num
			 * @default 默认值为200
			 */
			width : 200,

			/**
			 * 高度
			 * @property height
			 * @type Num
			 * @default 默认值为400
			 */
			height : 400,

			/**
			 * 子组件集合
			 * @property items
			 * @type Array
			 */
			items : [],

			/**
			 * 是否显示边框,true时为显示,false时为不显示
			 * @property border
			 * @type Boolean
			 * @default 默认值为true
			 */
			border : true,

			/**
			 * 创建自定义的动画
			 * @property  animate
			 * @type Boolean
			 * @default 默认值为false
			 */
			animate : false
		},
		override : {
			/**
			 * 初始化配置
			 * @private
			 */
			initConfig : function () {
				this.callParent ();
				this.addEvents ( /**
					 * 标签点击的时候触发,同时触发的事件可能有collapse或者expand
					 * @event itemclick
					 * @param comp {Object} AccordionLayout组件本身
					 * @param index {int} 面板索引
					 * @param itemId {String} 当前点击面板的itemId属性
					 * @param title {String} 当前点击面板的title属性
					 * @param event {event} 事件对象
					 */
					"itemclick",

					/**
					 * 面板关闭事件
					 * @event collapse
					 * @param comp {Object} AccordionLayout组件本身
					 * @param index {int} 面板索引
					 * @param itemId {String} 当前点击面板的itemId属性
					 * @param title {String} 当前点击面板的title属性
					 */
					"collapse",

					/**
					 * 面板展开事件
					 * @event expand
					 * @param comp {Object} AccordionLayout组件本身
					 * @param index {int} 面板索引
					 * @param itemId {String} 当前点击面板的itemId属性
					 * @param title {String} 当前点击面板的title属性
					 */
					"expand" );
				this.tpl = [
					"{@if it.itemId!=null}",
					"<div itemId=\"${it.itemId}\" index=\"${it.index}\" class=\"accordion\">",
					"{@else}",
					"<div  class=\"accordion\" index=\"${it.index}\">",
					"{@/if}", "{@if it.index==0}",
					"<div class=\"accordion-title accordion-title-noborder\" onselectstart=\"return false\">",
					"{@else}", "<div class=\"accordion-title\" onselectstart=\"return false\">",
					"{@/if}", "{@if it.icons}", "<span class=\"accordion-icon ${it.icons}\"></span>",
					"{@/if}", "<span>${it.title}</span>",
					"<span class=\"accordion-tool accordion-collapse\">&nbsp;</span>",
					"</div>", "{@if it.index==0}",
					"<div class=\"accordion-content accordion-content-first-default\" ></div>",
					"{@else}",
					"<div class=\"accordion-content\"></div>",
					"{@/if}", "</div>" ].join ( "" );
				juicer.set ( "cache", true );
				juicer.set ( "errorhandling", false );
				juicer.set ( "strip", true );
				juicer.set ( "detection", false );
			},

			/**
			 *
			 * @param {*} el
			 */
			render : function ( el ) {
				if ( ! FAPUI.isString ( el ) ) {
					el.addClass ( "panel-noscroll" );
				}
				this.callParent ( [ el ] );
			},

			/**
			 *
			 */
			createDom : function () {
				var me = this;

				me._items = me.items.slice ( 0 );
				me.id = me.id || FAPUI.getId ();
				var html = [];
				var divClass = "accordion-container";

				if ( ! me.border ) {
					divClass = divClass + " accordion-container-noborder";
				}
				html.push ( "<div id=\"" + me.id + "\" class=\"" + divClass + "\">" );
				var cfg = {};

				$ ( me._items ).each ( function ( i ) {
					this.index = i;
					cfg.it = this;
					html.push ( juicer ( me.tpl, cfg ) );
				} );
				html.push ( "</div>" );
				me.items = this._jsonToWidget ();
				return html.join ( "" );
			},

			/**
			 *
			 */
			bindEvent : function () {
				var me = this;

				me.el = me.el || $ ( "#" + me.id );
				me.el.click ( function ( event ) {
					var target = $ ( event.target );

					if ( target.parent ().is ( "div.accordion-title" ) ) {
						target = target.parent ();
					}
					if ( target.is ( "div.accordion-title" ) ) {
						var index = parseInt ( target.parent ().attr ( "index" ), 10 );

						me.fireEvent ( "itemclick", me, index, target.parent ().attr ( "itemId" ), event );
						me.expand ( index );
					}
				} );
				me.afterRender ();
			},
			/**
			 *
			 */
			afterRender : function () {
				var me = this;
				var i = me.activeIndex || 0;

				me.activeIndex = - 1;
				me.expand ( i );
			},
			/**
			 *
			 */
			updateRender : function () {
				this.callParent ();
			},

			/**
			 * 重新计算容器内子组件的宽和高,调用setHeight和setWidth方法后都会执行此方法
			 * @method  doLayout
			 */
			doLayout : function () {
				var me = this;

				me.setHeight ( me.height );
				me.setWidth ( me.width );
			},
			/**
			 *
			 * @param {*} h
			 */
			doLayoutH : function ( h ) {
				var me = this;
				//计算内容区域的高度
				var items = this.el.children ();
				var heightSum = 0;

				$ ( items ).each ( function () {
					heightSum = heightSum + $ ( "div:first", this ).outerHeight ();
				} );
				h = h - heightSum;
				var _itemHeight = h;

				$ ( items ).each ( function () {
					$ ( this ).children ( "div.accordion-content" ).height ( h );
				} );
				$ ( me.items ).each ( function () {
					var that = this;

					if ( that.isRender ) {
						that.setHeight ( _itemHeight );
					}
				} );
			},
			/**
			 *
			 * @param {*} w
			 */
			doLayoutW : function ( w ) {
				var me = this;
				var items = this.el.children ();

				$ ( items ).each ( function () {
					$ ( $ ( this ).children ( "div.accordion-title" ) ).width ( w - 5 );
					$ ( $ ( this ).children ( "div.accordion-content" ) ).width ( w );
				} );
				$ ( me.items ).each ( function () {
					var that = this;

					if ( that.isRender ) {
						that.setWidth ( me.width );
					}
				} );
			},
			/**
			 * 设置高
			 * @method setHeight
			 * @param {num} h
			 */
			setHeight : function ( h ) {
				this.height = h;
				this.el.height ( h );
				this.doLayoutH ( h );
			},

			/**
			 * 设置宽
			 * @method setWidth
			 * @param {num} w
			 */
			setWidth : function ( w ) {
				this.width = w;
				this.el.width ( w );
				this.doLayoutW ( w );
			},

			/**
			 * 得到AccordionLayout的高度
			 *  @method getHeight
			 * @return    {Num}
			 */
			getHeight : function () {
				return this.height;
			},

			/**
			 * 得到AccordionLayout的宽度
			 *  @method getWidth
			 * @return {Num}
			 */
			getWidth : function () {
				return this.width;
			},

			/**
			 * 展开子组件。如果index为数字,则展开items中的第index组件;如果index为String,则展开子组件的itemId等于index的组件
			 *  @method expand
			 * @param {string} index
			 */
			expand : function ( index ) {
				var me = this;

				if ( ! FAPUI.isNumber ( index ) ) {
					index = $ ( me.el.children ( "div[itemId='" + index + "']" )[ 0 ] ).attr ( "index" );
					index = parseInt ( index , 10 );
				}
				if ( index !== null && this.activeIndex !== index && me.items.length > 0 ) {
					me.collapse ( this.activeIndex );
					var contentArea = $ ( $ ( this.el ).
											  children ( "div[index=" + index + "]" )[ 0 ] ).
						children ( "div.accordion-content" );

					me._renderWidget ( index, contentArea );
					var contentEl = me.items[ index ].el.parent ();
					var headEl = contentEl.prev ();

					headEl.addClass ( "accordion-title-active" );
					$ ( "span.accordion-tool", headEl ).addClass ( "accordion-expand" );
					if ( me.animate === true ) {
						contentEl.slideDown ( "normal" );
					} else {
						contentEl.show ();
					}
					this.items[ index ].setWidth ( contentArea.innerWidth () );
					this.items[ index ].setHeight ( contentArea.innerHeight () );
					this.fireEvent ( "expand", this, index, this._items[ index ].itemId, this._items[ index ].title );
					this.activeIndex = index;
				}
			},

			/**
			 * 关闭子组件。如果index为数字,则关闭items中的第index组件;如果index为String,则关闭子组件的itemId等于index的组件
			 *  @method collapse
			 * @param {string} index
			 */
			collapse : function ( index ) {
				var me = this;

				if ( index == - 1 ) {
					return;
				}//如果index为-1则说明所有的选项都关闭了
				if ( ! FAPUI.isNumber ( index ) ) {
					index = $ ( me.el.children ( "div[itemId=\"" + index + "\"]" )[ 0 ] ).attr ( "index" );
					index = parseInt ( index );
				}
				if ( index !== null && this.activeIndex ==index && me.items.length > 0 ) {
					var contentEl = me.items[ index ].el.parent ();
					var headEl = contentEl.prev ();

					if ( me.animate === true ) {
						contentEl.slideUp ( "normal" );
					} else {
						contentEl.hide ();
					}
					contentEl.removeClass ( "accordion-content-first-default" );
					headEl.removeClass ( "accordion-title-active" );
					$ ( "span.accordion-tool", headEl ).removeClass ( "accordion-expand" );
					this.fireEvent ( "collapse", this, index, this._items[ index ].itemId, this._items[ index ].title );
					this.activeIndex = - 1;
				}
			},

			/**
			 * 添加子组件
			 *  @method addItems
			 * @param  {Array} items 需要添加组件集合
			 */
			addItems : function ( items ) {
				var me = this;

				if ( ! FAPUI.isArray ( items ) ) {
					items = [ items ];
				}
				var cfg = {};
				var html = [];

				$ ( items ).each ( function ( i ) {
					this.index = me.items.length + i;
					cfg.it = this;
					html.push ( juicer ( me.tpl, cfg ) );
				} );
				me.el.append ( html.join ( "" ) );
				me._items = me._items.concat ( items );
				me.items = me.items.concat ( me._jsonToWidget ( items ) );
				me.doLayout ();
			},

			/**
			 * 移除子组件。如果index为数字,则移除items中的第index组件;如果index为String,则移除子组件的itemId等于index的组件
			 * @method removeItem
			 * @param  {string} index
			 */
			removeItem : function ( index ) {
				var me = this;
				var comp;

				if ( FAPUI.isNumber ( index ) ) {
					comp = $ ( me.el.children ( "div[index=\"" + index + "\"]" )[ 0 ] );
				} else {
					comp = $ ( me.el.children ( "div[itemId=\"" + index + "\"]" )[ 0 ] );
					index = parseInt ( comp.attr ( "index" ) );
				}
				if ( comp[ 0 ] === null ) {
					return;
				}
				var siblings = comp.siblings ();

				siblings.each ( function () {
					var i = parseInt ( $ ( this ).attr ( "index" ) );

					if ( i > index ) {
						$ ( this ).attr ( "index", i - 1 );
					}
				} );
				if ( me.activeIndex > index ) {
					me.activeIndex = me.activeIndex - 1;
				} else if ( me.activeIndex == index ) {
					me.activeIndex = - 1;
				}
				comp.unbind ();
				comp.remove ();
				me.items.splice ( index, 1 );
				me._items.splice ( index, 1 );

				//删除后重新设置内容的高度
				me.setHeight ( me.height );
			},

			/**
			 * @access private
			 * @param {*} items 把items转换成组件
			 */
			_jsonToWidget : function ( items ) {
				items = items || this.items;
				var newItems = [];

				if ( items !== null && items.length > 0 ) {
					$ ( items ).each ( function ( index ) {
						var me = this;
						var o = {};

						FAPUI.apply ( o, me );
						delete o.title;
						o.isRender = false;
						if ( me.isUI && me.isUI () ) {
							newItems.push ( o );
						} else {
							var cmp = FAPUI.create ( me );

							newItems.push ( cmp );
						}
					} );
				}
				return newItems;
			},
			/**
			 * 渲染组件
			 * @private
			 */
			_renderWidget : function ( index, contentArea ) {
				if ( this.items && this.items[ index ] && ! this.items[ index ].isRender ) {
					this.items[ index ].render ( contentArea );
					this.items[ index ].isRender = true;
				}
			},
			/**
			 *
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
	FAPUI.register ( "accordionLayout", FAPUI.Layout.AccordionLayout );
	return FAPUI.Layout.AccordionLayout;
} );