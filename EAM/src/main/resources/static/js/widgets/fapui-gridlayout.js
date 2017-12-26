/**
 *定义FAPUI.Layout.GridLayout网格布局组件
 *@description 内部组件的宽度时自适应，高度需要显示的定义
 *<p>以下代码将演示如何使用GridLayout组件</p>
 *
 *
 *
 define(function(require) {
		require("jquery");
		require("widgets/fapui-gridlayout");
		require("widgets/fapui-panel");
		require("widgets/fapui-viewport");

		$ ( function () {
		var gridLayout = new FAPUI.Layout.GridLayout ( {
			columns : 1,
			border : true,
			items : [ new FAPUI.Panel ( {
				height : 100,
				itemStyle : "padding:4px",
				title : "item-panel",
				cId : "first",
				html : "panel-1",
			} ), new FAPUI.Panel ( {
				height : 100,
				itemStyle : "padding:4px",
				title : "item-panel",
				cId : "second",
				html : "panel-2"
			} ), new FAPUI.Panel ( {
				height : 100,
				itemStyle : "padding:4px",
				title : "item-panel",
				cId : "third",
				html : "panel-3"
			} ), new FAPUI.Panel ( {
				height : 100,
				itemStyle : "padding:4px",
				title : "item-panel",
				cId : "four",
				html : "panel-4"
			} )
			]
		} );

		$ ( "#add" ).click ( function () {
			gridLayout.addItems ( [ {
				height : 50,
				itemStyle : "padding:4px",
				title : "item-panel",
				cId : "eight",
				html : "panel-7"
			}, {
				height : 50,
				//itemStyle : "padding:4px",
				title : "item-panel",
				cId : "nine",
				html : "panel-8"
			}/*,{
			 height : 350,
			 itemStyle:"padding:4px",
			 title : "item-panel3",
			 cId:"ten",
			 html : "panel3"
			 }] );

} );
var view = new FAPUI.View.ViewPort( {
	renderTo :document.body,
	layout :gridLayout
})

$ ( "#remove" ).click ( function () {
	gridLayout.removeItem ( gridLayout.items.length - 1 );
} );
} );
} );

 *@class FAPUI.Layout.GridLayout
 *@extend FAPUI.Component
 *@author wzj
 */

define ( function ( require ) {
	var importcss = "./themes/" + FAPUI.getTheme () + "/css/ui-gridlayout.css";

	require.async ( importcss );

	require ( "./fapui-component" );

	FAPUI.define ( "FAPUI.Layout.GridLayout", {
		extend : "FAPUI.Component",
		props : {

			/**
			 * 网格布局容器的宽度
			 * @property width
			 * @type Number
			 * @default "auto"
			 */
			width : FAPUI.getViewSize ().width,

			/**
			 * 网格布局容器的高度
			 * @property height
			 * @type Number
			 * @default "auto"
			 */
			height : FAPUI.getViewSize ().height,

			/**
			 * 网格的列数
			 * @property columns
			 * @type Number
			 * @default 1
			 */
			columns : 1,

			/**
			 * 是否有边框
			 * @property border
			 * @type boolean
			 * @default false
			 */
			border : false,

			/**
			 * 全局class，会应用于所有的子组件
			 * @property defaultCls
			 * @type String
			 * @default ""
			 */
			defaultCls : "",

			/**
			 * 全局style，会应用于所有的子组件
			 * @property defaultStyle
			 * @type String
			 * @default ""
			 */
			defaultStyle : "",

			/**
			 * 对于每一个子组件的默认属性的配置
			 */
			defaultSet : null,

			/**
			 * 内部组件集,从左到右,从上到下进行排列
			 * 单项item的配置如下：
			 * cId:String 组件id号（不能重复）,如果没有，则以组件在items中的索引为组件的唯一标识
			 * itemStyle:String 组件的style样式，默认为""
			 * itemCls:String 组件的class样式名，默认为""
			 * colspan:number 组件所跨的列数，默认为1列
			 * height:number 组件的高度
			 * @property items
			 * @type Array
			 * @default null
			 */
			items : [],

			/**
			 * 布局在水平方向占布局容器的百分比（如90%，85%等等）
			 * @property anchor
			 * @type String
			 * @default "100%"
			 */
			anchor : "90%"
		}, override : {

			/**
			 * 初始化配置项
			 * @private
			 */
			initConfig : function () {
				var me = this;

				me.callParent ();
				me.id = me.id || FAPUI.getId ();
				if ( me.defaultSet ) {
					if ( me.items ) {
						$ ( me.items ).each ( function () {
							var that = this;

							FAPUI.applyIf ( that, me.defaultSet, {} );
						} );
					}
				}
			},

			/**
			 * 渲染组件
			 * @private
			 * @param {Object} el
			 */
			render : function ( el ) {
				var parent = this.fly ( el );

				parent.append ( $ ( this.createDom () ) );
				this.el = $ ( "#" + this.id, parent );
				this.bindEvent ();
				this.el.parent ().css ( "overflow", "hidden" );
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
			},

			/**
			 * 创建DOM文档
			 * @private
			 */
			createDom : function () {
				var me = this;

				me.id = me.id || FAPUI.getId ();
				me.items = me._createWidget ();
				if ( ! this.border ) {
					var elClass = "gridlayout-container gridlayout-container-noborder";
				}
				var html = "<div id=\"" + me.id + "\" class=\"" + elClass + "\">" + me._createColumn () + "</div>";

				return html;
			}, /**
			 * 创建布局列
			 * @private
			 */
			_createColumn : function ( items, index, initColspan ) {
				var me = this;
				var columnHtml = [];

				items = items || me.items;
				var anchor = "100%";

				initColspan = initColspan || 0;
				var c = initColspan;
				var clearEl = "<div class=\"gridlayout-clear\"></div>";

				$ ( items ).each ( function ( i ) {
					var that = this;

					i = index ? ++ index : i;
					var cls = that.itemCls || me.defaultCls || "";
					var styles = that.itemStyle || me.defaultStyle || "";

					that.cId = that.cId || FAPUI.getId ( "gridlayout" );
					var cId = that.cId;

					var itemEl = "<div id=\"" + cId + "\" index=\"" + i + "\" class=\"gridlayout-item " + cls +
								 "\" width=\"" + anchor + "\" style=\"" + styles + "\">" + that.createDom () + "</div>";
					var colspan = that.colspan || 1;

					if ( that.hidden || that.inputType && that.inputType === "hidden" ) {
						columnHtml.push ( itemEl );
					} else {
						if ( c + colspan > me.columns ) {
							columnHtml.push ( clearEl );
							columnHtml.push ( itemEl );
							c = colspan;
						} else if ( c + colspan === me.columns ) {
							columnHtml.push ( itemEl );
							columnHtml.push ( clearEl );
							c = 0;
						} else {
							columnHtml.push ( itemEl );
							c = c + colspan;
						}
					}

				} );
				//me._curColspan=c;
				return columnHtml.join ( "" );
			},

			/**
			 * 内部组件宽度计算
			 * @private
			 */
			_doLayoutWidth : function () {
				var me = this;
				var positionRight = 0;
				var percent = parseInt ( me.anchor, 10 ) / 100;
				var width = parseInt ( ( me.width * percent ) / me.columns, 10 );
				var sanpW = me.columns === 1 ? 0 : parseInt ( 20 / me.columns, 10 );

				$ ( me.items ).each ( function ( i ) {
					var that = this;
					var cel = that.cId ? me.el.children ( "#" + that.cId ) : me.el.children ( "div[index=\"" + i +
																							  "\"]" );

					if ( that.hidden || that.inputType && that.inputType === "hidden" ) {
						that.setWidth ( 0 );
						cel.width ( 0 );
					} else {
						var colspan = that.colspan || 1;
						var anchor = that.anchor ? parseInt ( that.anchor, 10 ) / 100 : 1;

						var pl = parseInt ( cel.css ( "padding-left" ), 10 ) || 0;
						var pr = parseInt ( cel.css ( "padding-right" ), 10 ) || 0;
						var w = ( width - pl - pr ) * colspan + ( colspan - 1 ) * ( pl + pr ) - colspan * sanpW;

						positionRight = that.position_right || positionRight;
						that.setWidth ( w * anchor );
						cel.width ( w );
					}

				} );
			}, /**
			 * @private
			 */
			_doLayoutHeight : function () {
				var me = this;

				$ ( me.items ).each ( function () {
					var that = this;

					that.setHeight ( that.height );
				} );
			}, /**
			 * 重新布局
			 * @private
			 */
			doLayout : function () {
				var me = this;
				var positionRight = 10;
				var percent = parseInt ( me.anchor, 10 ) / 100;
				var width = parseInt ( ( me.width * percent ) / me.columns, 10 );
				var sanpW = parseInt ( 20 / me.columns, 10 );

				$ ( me.items ).each ( function ( i ) {
					var that = this;
					var colspan = that.colspan || 1;
					var anchor = that.anchor ? parseInt ( that.anchor, 10 ) / 100 : 1;
					var cel = that.cId ? me.el.children ( "#" + that.cId ) : me.el.children ( "div[index=\"" + i +
																							  "\"]" );
					var pl = parseInt ( cel.css ( "padding-left" ), 10 ) || 0;
					var pr = parseInt ( cel.css ( "padding-right" ), 10 ) || 0;
					var w = ( width - pl - pr ) * colspan + ( colspan - 1 ) * ( pl + pr ) - colspan * sanpW;

					positionRight = that.position_right || positionRight;
					that.setWidth ( w * anchor );
					that.setHeight ( that.height );
					cel.width ( w * anchor + positionRight );
				} );
			},

			/**
			 * json格式的对象转换为面板对象
			 * @private
			 */
			_createWidget : function ( items ) {
				var me = this
				var aw = [];

				items = items || me.items;
				$ ( items ).each ( function () {
					var that = this;

					if ( that.hidden || that.inputType && that.inputType === "hidden" ) {
						that.itemStyle = " ";
					}
					that = FAPUI.create ( that );
					aw.push ( that );
				} );
				return aw;
			}, /**
			 * 验证子组件
			 * @returns {boolean}
			 */
			validate : function () {
				var items = this.items;
				var flag = true;

				$ ( items ).each ( function () {
					var that = this;

					if ( that.validate () !== true ) {
						flag = false;
						return false;
					}
				} );
				return flag;
			}, /**
			 * 添加子组件
			 * @method addItems
			 * @param {Object} items 子组件配置
			 */
			addItems : function ( items ) {
				var me = this;
				var i = me.items.length;
				
				if(i > 0){
					i = i - 1;
				}

				if ( ! FAPUI.isArray ( items ) ) {
					items = [ items ];
				}
				if ( me.defaultSet ) {
					if ( items ) {
						$ ( items ).each ( function () {
							var that = this;

							FAPUI.applyIf ( that, me.defaultSet, {} );
						} );
					}
				}
				var c = 0;

				$ ( me.items ).each ( function () {
					var that = this;
					var colspan = that.colspan ? that.colspan : 1;

					if ( ( c + colspan ) > me.columns ) {
						c = colspan;
					} else if ( ( c + colspan ) === me.columns ) {
						c = 0;
					} else {
						c = c + colspan;
					}
				} );
				items = me._createWidget ( items );
				var tpl = $ ( me._createColumn ( items, i, c ) );
				var cel = me.el.children ( "div[index=\"" + i + "\"]" );
				if( cel.length > 0 ){
					tpl.insertAfter ( cel );
				}else{
					me.el.append(tpl);
				}
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
			 * @param {number|string} index 索引 组件cId
			 */
			removeItem : function ( index ) {
				var me = this;

				if ( FAPUI.isNumber ( index ) ) {
					var rm = me.el.children ( "div[index=\"" + index + "\"]" );

					if ( rm.next ().hasClass ( "gridlayout-clear" ) ) {
						rm.next ().remove ();
					}
					rm.remove ();
				} else {
					var rm = me.el.children ( "div#" + index );

					index = parseInt ( rm.attr ( "index" ), 10 );
					rm.remove ();
				}
				me.items.splice ( index, 1 );
				me.setWidth ( me.width );
				me.setHeight ( me.height );
			},

			/**
			 * 根据索引或者组件的的cId获取组件
			 * @method getItem
			 * @param {number|string} index 索引 组件cId
			 * @return {Object}
			 */
			getItem : function ( index ) {
				var me = this;

				if ( FAPUI.isNumber ( index ) ) {
					return me.items[ index ];
				} else {
					index = parseInt ( me.el.children ( "div#" + index ).attr ( "index" ), 10 );
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
				this._doLayoutHeight ();
			}, /**
			 * 设置宽度
			 * @method setWidth
			 * @param {number} w
			 */
			setWidth : function ( w ) {
				this.width = w;
				this.el.width ( w );
				this._doLayoutWidth ();
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
			 * 重置布局中的组件
			 */
			reset : function () {
				var me = this;
				var items = me.items;

				$ ( items ).each ( function () {
					var that = this;

					if ( that.reset ) {
						that.reset ();
					}
				} );
			}, /**
			 * @private
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
	FAPUI.register ( "gridLayout", FAPUI.Layout.GridLayout );

	return FAPUI.Layout.GridLayout;
} );
