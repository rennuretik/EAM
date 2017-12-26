/**
 *定义FAPUI.Layout.TabLayout组件
 *<p>1.以下代码将演示如何使用面板对象构建TabLayout组件</p>
 *
 *
 *
 *
 var tab1 = new FAPUI.Layout.TabLayout({
		renderTo:'ab',
		width :600,
		height:500,
		//border:false,//是否有边框
		items:[new FAPUI.Panel({
			itemId:'Tab1',
			title:'Tab1',
			html:'Tab1',
			//iconCls:'icon-edit',//是否有图标（16x16）
			closeable:true
		}),new FAPUI.Panel({
			itemId:'Tab2',
			title:'Tab2',
			html:'Tab2'
			//iconCls:'icon-cut',
			//closeable:true //是否有关闭按钮
		})],
		listeners:{
			'tabclick':function(comp,newindex,oldindex){

			},
			'beforetabclick':function(comp,newindex,oldindex){

			},
			'activetab':function(comp,index){

			},
			'beforeactivetab':function(comp,index){

			}
		}
	});
 *<p>2.以下代码将演示如何使用JSON对象构建TabLayout组件</p>
 var tab2 = new FAPUI.Layout.TabLayout({
		renderTo:'ab',
		width :600,
		height:500,
		//border:false,//是否有边框
		items:[{
			itemId:'Tab1',
			title:'Tab1',
			html:'Tab1'
			//closeable:true //是否有关闭按钮
		},{
			itemId:'Tab2',
			title:'Tab2',
			html:'Tab2',
			iconCls:'icon-edit',//是否有图标（16x16）
			closeable:true
		}],
		listeners:{
			'closetab':function(comp,index){

			},
			'beforeclosetab':function(comp,index){

			}
		}
	});
 *<p>以下代码将演示如何添加新的tab对象</p>
 tab1.addTab({
		itemId:'New Tab'+index,
		title:'New Tab'+index,
		iconCls:'icon-save',
		closable:true,
		html:'New Tab'+index
	});
 *<p>以下代码将演示如何在指定的索引前插入新的tab对象</p>
 tab1.insertTab(2,{
		itemId:'New Tab'+count,
		title:'New Tab'+count,
		iconCls:'icon-cancel',
		closable:true,
		html:'New Tab'+count
	});
 *@class FAPUI.Layout.TabLayout
 *@extend FAPUI.
 */

define ( function ( require ) {
	var importcss = "./themes/" + FAPUI.getTheme () + "/css/ui-tabs.css";

	require.async ( importcss );

	require ( "./fapui-component" );

	require ( "./fapui-menu" );

	require ( "./fapui-panel" );

	FAPUI.define ( "FAPUI.Layout.TabLayout", {
		extend : "FAPUI.Component", props : {

			/**
			 * 当前激活的选项卡索引
			 * @private
			 * @type Number
			 * @default 0
			 */
			activeIndex : 0,

			/**
			 * 子组件集合
			 * @property items
			 * @type Array
			 * @default []
			 */
			items : [],

			/**
			 * 是否显示边框
			 * true显示,false不显示
			 * @property border
			 * @type Boolean
			 * @default true
			 */
			border : true,

			/**
			 * @private
			 */
			fit : false, /**
			 * 标签页的样式是矩形还是梯形
			 * R矩形,K是梯形
			 * @property tabCls
			 * @type string
			 * @default R
			 */
			tabCls : "R", /**
			 * 标签页标签的宽度
			 * @property tabWidth
			 * @type number
			 * @default 100
			 */
			tabWidth : 100,

			/**
			 * 菜单栏
			 * 请参照menu组件
			 */
			menuConfig : [], /**
			 * @property
			 * 空白页的背景
			 */
			blankHtml : ""
		}, override : {

			/**
			 * 初始化配置项
			 * @private
			 */
			initConfig : function () {
				var me = this;

				this.callParent ();
				this.menu = new FAPUI.Menu ( {
					renderTo : document.body,
					items : [ {
						width:60,
						text : "关闭当前页",
						itemid : "deletecurt", /**
						 * @method handler
						 */
						handler : function () {
							var activeIndex = me.activeIndex;

							me.removeTab ( activeIndex );
						}
					}, {
						text : "关闭其他页", itemid : "deleteother", /**
						 *
						 */
						handler : function () {
							for ( var i = 0; i < me.items.length; i ++ ) {
								if ( i !== me.activeIndex ) {
									me.removeTab ( i );
									i --;
								}
							}
						}
					}, {
						text : "关闭右边的页", itemid : "deleteright", /**
						 *
						 */
						handler : function () {
							for ( var i = 0; i < me.items.length; i ++ ) {
								if ( i > me.activeIndex ) {
									me.removeTab ( i );
									i --;
								}
							}
						}
					}, {
						text : "关闭左边的页", itemid : "deleteleft", /**
						 *
						 */
						handler : function () {
							for ( var i = 0; i < me.items.length; i ++ ) {
								if ( i < me.activeIndex ) {
									me.removeTab ( i );
									i --;
								}
							}
						}
					}, {
						text : "关闭全部", itemid : "deleteother", /**
						 *
						 */
						handler : function () {
							me.removeAllTab ();
							if ( me.blankId && me.blankEl ) {
								me.blankEl.show ();
							}
						}
					} ]
				} );

				this.addEvents ( /**
					 * 标签页点击触发,如果返回false,不执行激活操作,不执行事件tabclick
					 * @event beforetabclick
					 * @param tabs {Object} TabLayout组件本身
					 * @param newIndex {Number}
					 * @param oldIndex {Number}
					 */
					"beforetabclick",

					/**
					 * 标签页点击触发
					 * @event tabclick
					 * @param tabs {Object} TabLayout组件本身
					 * @param newIndex {Number}
					 * @param oldIndex {Number}
					 */
					"tabclick",

					/**
					 * 标签页关闭时触发,返回false时,不执行关闭移除操作
					 * @event beforeclosetab
					 * @param tabs {Object} TabLayout组件本身
					 * @param index {Number}
					 */
					"beforeclosetab",

					/**
					 * 标签页关闭时触发
					 * @event closetab
					 * @param tabs {Object} TabLayout组件本身
					 * @param index {Number}
					 */
					"closetab",

					/**
					 * 标签页激活时触发,返回false,不执行激活操作
					 * @event beforeactivetab
					 * @param tabs {Object} TabLayout组件本身
					 * @param index {Number}
					 */
					"beforeactivetab",

					/**
					 * 标签页激活时触发
					 * @event activetab
					 * @param tabs {Object} TabLayout组件本身
					 * @param index {Number}
					 */
					"activetab"
				 );
				this.tpl = [ "<div id=\"${id}\" class=\"tabs-container\">", "<div class=\"tabs-header\">",
					"<div class=\"tabs-scroll tabs-scroll-left\"></div>",
					"<div class=\"tabs-scroll tabs-scroll-right\"></div>", "<div class=\"tabs-wrap\">",
					"<ul class=\"tabs\">$${headContent}</ul>", "</div></div>",
					"<div class=\"tabs-body\">$${bodyContent}</div>", "</div>" ].join ( "" );
				this.headTpl =
					[ "{@each items as it,k}", "<li itemId=\"${it.itemId}\" class=\"tabs-li${tabCls}\" index=${k}>",
						"<span href=\"javascript:void(0)\" class=\"tabs-inner${tabCls}\" hidefocus=\"true\">",
						"<span class=\"tabs-inner-left${tabCls}\">",
						"<span class=\"tabs-icon ${it.iconCls?it.iconCls:\"\"}\"></span>",
						"{@if it.closeable&&it.iconCls}", "<span class=\"tabs-title tabs-with-icon tabs-closable\">",
						"${it.title?it.title:\"\"}</span>",
						"<a href=\"javascript:void(0)\" class=\"tabs-close${tabCls}\" hidefocus=\"true\"></a>",
						"{@else if it.iconCls}",
						"<span class=\"tabs-title tabs-with-icon\">${it.title?it.title:\"\"}</span>",
						"{@else if it.closeable}",
						"<span class=\"tabs-title tabs-closable\">${it.title?it.title:\"\"}</span>",
						"<a href=\"javascript:void(0)\" class=\"tabs-close${tabCls}\" hidefocus=\"true\"></a>",
						"{@else}", "<span class=\"tabs-title\">${it.title?it.title:\"\"}</span>", "{@/if}",
						"</span></span></li>", "{@/each}" ].join ( "" );
				this.bodyTpl = [ "{@each items as it,k}", "{@if activeIndex==k}",
					"<div class=\"tabs-body-wrap\" itemId=\"${it.itemId}\" index=\"${k}\"",
					" style=\"display: block;\">$${content}</div>", "{@else}",
					"<div class=\"tabs-body-wrap\" itemId=\"${it.itemId}\" index=\"${k}\"></div>", "{@/if}",
					"{@/each}" ].join ( "" );
				this.blankTpl = [ "<div id=\"${blankId}\" width==\"100%\" class=\"tabs-body-blank\" ",
					"height=\"100%\">$${blankHtml}</div>" ].join ( "" );
				juicer.set ( "cache", true );
				juicer.set ( "errorhandling", false );
				juicer.set ( "strip", true );
				juicer.set ( "detection", false );
			},

			/**
			 * 渲染组件
			 * @private
			 * @param {*} el 目标容器对象
			 */
			render : function ( el ) {
				this.callParent ( [ el ] );
			},

			/**
			 * 创建内部组件
			 * @private
			 */
			createDom : function ( ) {
				var me = this;

				me._jsonToWidget ();
				me.id = me.id || FAPUI.getId ();
				var cfg = {
					tabCls : me.tabCls, tabWidth : me.tabWidth
				};

				cfg.items = me.items;
				var headTmp = juicer ( me.headTpl, cfg );

				cfg.activeIndex = me.activeIndex;
				if ( me.items.length > 0 ) {
					me.items[ me.activeIndex ].title = null;
					cfg.content = me.items[ me.activeIndex ].createDom ();
					me.items[ me.activeIndex ].isRender = true;
				} else {
					cfg.content = "";
				}
				var bodyTmp = juicer ( me.bodyTpl, cfg );

				cfg.headContent = headTmp;
				cfg.bodyContent = bodyTmp;

				if ( me.items.length === 0 || me.activeIndex + 1 > me.items.length ) {
					if ( me.blankHtml ) {
						me.blankId = FAPUI.getId ();
						cfg.blankId = me.blankId;
						cfg.blankHtml = me.blankHtml;
						var blankTmp = juicer ( me.blankTpl, cfg );

						cfg.bodyContent = blankTmp;
					}
				}
				cfg.id = me.id;
				var tmp = juicer ( me.tpl, cfg );

				return tmp;
			}, /**
			 *
			 */
			afterRender : function () {
				var me = this;

				me.el = me.el || $ ( "#" + me.id );
				this.el.parent ().addClass ( "panel-noscroll" );
				me.headEl = me.el.children ( "div.tabs-header" ).children ( "div.tabs-wrap" ).children ( "ul.tabs" );
				me.bodyEl = me.el.children ( "div.tabs-body" );
				me.el.children ( "div.tabs-header" ).addClass ( me.border ? "" : "tabs-header-noborder" );
				me.el.children ( "div.tabs-body" ).addClass ( me.border ? "" : "tabs-body-noborder" );
				var item = $ ( "li[index='" + me.activeIndex + "']", me.headEl );

				item.addClass ( "tabs-selected" );
				me.header = me.el.children ( "div.tabs-header" );
				me.scrollLeft = me.header.children ( "div.tabs-scroll-left" );
				me.scrollRight = me.header.children ( "div.tabs-scroll-right" );
				me.headerWrap = me.header.children ( "div.tabs-wrap" );
				if ( me.blankId ) {
					me.blankEl = $ ( "#" + me.blankId, me.el );
				}
				me._scrollTab ();
			}, /**
			 * 事件绑定
			 * @private
			 */
			bindEvent : function () {
				var me = this;

				me.afterRender ();
				if ( me.items.length > 0 ) {
					me.items[ me.activeIndex ].bindEvent ();
				}
				me.headEl.click ( function ( event ) {
					var target = $ ( event.target );
					if ( target.is ( "a.tabs-close" + me.tabCls ) ) {
						var index = $ ( target ).parent ().parent ().parent ().attr ( "index" );

						me.closeTab ( parseInt ( index, 10 ) );
						event.stopPropagation ();
					} else {
						while ( ! target.is ( "li" ) && target.size () !== 0 ) {
							target = target.parent ();
						}
						/*if(target.is("a")){
						 target=target.parent();
						 }
						 if(target.is("span")){
						 target=target.parent().parent().parent();
						 }*/
						var oldindex = me.activeIndex;
						var newindex = parseInt ( $ ( target ).attr ( "index" ), 10 );

						if ( me.fireEvent ( "beforetabclick", me, newindex, oldindex ) !== false ) {
							if ( me.activeTab ( parseInt ( $ ( target ).attr ( "index" ), 10 ) ) !== false ) {
								me.fireEvent ( "tabclick", me, newindex, oldindex );
							}
						}
					}
				} );

				me.headEl.bind ( "contextmenu", function ( event ) {
					var target = $ ( event.target );

					while ( ! target.is ( "li" ) && target.size () != 0 ) {
						target = target.parent ();
					}
					if ( target.hasClass ( "tabs-selected" ) ) {
						me.menu.show ( event.clientX, event.clientY );
					}
					return false;
				} );
				/*me.headEl.bind ( "dblclick", function ( event ) {
					var target = $ ( event.target );


						var activeIndex = me.activeIndex;

						me.removeTab ( activeIndex )


					return false;
				} );*/
			},

			/**
			 * 设置选项卡高度
			 * @method setHeight
			 * @param {number} h
			 */
			setHeight : function ( h ) {
				this.callParent ();
				this.height = h;
				this.el.height ( h );
				var contentH = h - this.el.children ( "div.tabs-header" ).outerHeight ( true );

				this.el.children ( "div.tabs-body" ).height ( contentH );
				$ ( "div.tabs-body", this.el ).children ().each ( function () {
					$ ( this ).css ( "height", contentH );
				} );
				this.doLayoutH ();
			}, /**
			 * 设置选项卡宽度
			 * @method setWidth
			 * @param {number} w
			 */
			setWidth : function ( w ) {
				this.callParent ();
				this.width = w;
				this.el.width ( w );
				this.el.children ( "div.tabs-header" ).width ( w );
				if ( this.border ) {
					this.el.children ( "div.tabs-body" ).width ( w - 2 );
				} else {
					this.el.children ( "div.tabs-body" ).width ( w );
				}
				this.doLayoutW ();
				this._showScroll ();
			}, /**
			 * 获取选项卡高度
			 * @method getHeight
			 * @return {number}
			 */
			getHeight : function () {
				return this.height;
			}, /**
			 * 获取选项卡宽度
			 * @method getWidth
			 * @return {number}
			 */
			getWidth : function () {
				return this.width;
			}, /**
			 * 激活选项卡
			 * @method activeTab
			 * @param {string} i 索引或者是itemId
			 */
			activeTab : function ( i ) {
				var me = this;
				var item;
				var index;
				//var sunWidth = 0;

				if ( FAPUI.isNumber ( i ) ) {
					item = $ ( "li[index=" + i + "]", me.headEl );
					index = i;
				} else {
					item = $ ( "li[itemId='" + i + "']", me.headEl );
					index = parseInt ( item.attr ( "index" ), 10 );
				}
				if ( ! item[ 0 ] ) {
					return;
				}
				if ( me.fireEvent ( "beforeactivetab", me, i ) === false ) {
					return false;
				} else {
					item.addClass ( "tabs-selected" );
					item.siblings ().removeClass ( "tabs-selected" );
					for ( var i = 0; i < me.items.length; i ++ ) {
						me.bodyEl.children ( "div[index=" + i + "]" ).hide ();
					}
					var curContent = me.bodyEl.children ( "div[index=" + index + "]" );

					curContent.show ();
					me.activeIndex = index;
					me._renderWidget ( index, curContent );
					me.fireEvent ( "activetab", me, i );
					var headw = me.header.width ();

					$ ( "ul.tabs li", me.header ).each ( function ( i ) {
						if ( $ ( this )[ 0 ].offsetLeft > headw && i === index ) {
							me.headerWrap.animate ( {
								scrollLeft : $ ( this )[ 0 ].offsetLeft - headw + 120
							}, 400 );
						}
						if ( $ ( this )[ 0 ].offsetLeft < headw && i === index ) {
							me.headerWrap.animate ( {
								scrollLeft : 0
							}, 400 );
						}
					} );
				}
				if ( me.blankId && me.blankEl ) {
					me.blankEl.hide ();
				}
				me.doLayout ();
			},

			/**
			 * 关闭选项卡
			 * @method closeTab
			 * @param {string} i 为索引或者是itemId
			 */
			closeTab : function ( i ) {
				var me = this;
				var item;
				var index;

				if ( FAPUI.isNumber ( i ) ) {
					item = $ ( "li[index=" + i + "]", me.headEl );
					index = i;
				} else {
					item = $ ( "li[itemId='" + i + "']", me.headEl );
					index = parseInt ( item.attr ( "index" ), 10 );
				}

				if ( me.fireEvent ( "beforeclosetab", me, index ) !== false ) {
					//关闭当前Tab选项卡,销毁对象
					item.remove ();
					me.items[ index ].destroy ();
					var content = $ ( "div[index=" + index + "]", me.bodyEl );

					content.remove ();
					me.items.splice ( i, 1 );
					$ ( me.items ).each ( function ( i ) {
						var that = this;
						var head = me.headEl.find ( "li[itemId=" + that.itemId + "]" );

						head.attr ( "index", i );
						var body = me.bodyEl.find ( "div[itemId=" + that.itemId + "]" );

						body.attr ( "index", i );

					} );
					me.fireEvent ( "closetab", me, index );

					//若当前关闭的选项卡已经激活
					if ( me.activeIndex === index ) {
						if ( index < me.items.length ) {
							me.activeIndex = - 1;
							me.activeTab ( index );
						} else {
							me.activeIndex = - 1;
							me.activeTab ( index - 1 );
						}
					} else if ( me.activeIndex > index ) {
						me.activeIndex = me.activeIndex - 1;
					}
				}
				if ( me._checkAllClosed () === 0 ) {
					if ( me.blankId && me.blankEl ) {
						me.blankEl.show ();
					}
				}
				me._showScroll ();
			}, /**
			 * 添加选项卡
			 * @method addTab
			 * @param {Object} cmp 新选项卡配置对象
			 */
			addTab : function ( cmp ) {
				var me = this;

				me.insertTab ( me.items.length, cmp );
			}, /**
			 * 在指定的索引之前插入新的选项卡
			 * @method insertTab
			 * @param {*} index 目标索引
			 * @param {*} cmp 新选项卡配置对象
			 */
			insertTab : function ( index, cmp ) {
				var me = this;
				var items = cmp;

				if ( me.items.length === 0 ) {
					index = 0;
				}
				if ( ! FAPUI.isArray ( cmp ) ) {
					items = [ cmp ];
				}
				var newItems = [];

				$ ( items ).each ( function () {
					var that = this;

					that.itemId = that.itemId || FAPUI.getId ( "itemId" );
					that.border = false;
					var cmp = new FAPUI.create ( that );

					cmp.isRender = false;
					newItems.push ( cmp );
				} );
				var head = me.headEl.find ( "li[index=" + index + "]" );
				var body = me.bodyEl.find ( "div[index=" + index + "]" );
				var cfg = {
					items : newItems, tabCls : me.tabCls, tabWidth : me.tabWidth
				};

				var headTmp = $ ( juicer ( this.headTpl, cfg ) );

				if ( head[ 0 ] ) {
					$ ( head[ 0 ] ).before ( headTmp );
				} else {
					headTmp.appendTo ( me.headEl );
				}

				var bodyTmp = $ ( juicer ( this.bodyTpl, cfg ) );

				if ( body[ 0 ] ) {
					$ ( body[ 0 ] ).before ( bodyTmp );
				} else {
					bodyTmp.appendTo ( me.bodyEl );
				}
				$ ( newItems ).each ( function ( i ) {//把新的组件按照指定顺序添加到items中
					me.items.splice ( index + i, 0, newItems[ i ] );
				} );
				$ ( me.items ).each ( function ( i ) {//根据items的顺序重新设置index属性
					var that = this;
					var head = me.headEl.find ( "li[itemId=" + that.itemId + "]" );

					head.attr ( "index", i );
					var body = me.bodyEl.find ( "div[itemId=" + that.itemId + "]" );

					body.attr ( "index", i );
				} );
				me._showScroll ();
				me.activeTab ( index );
			}, /**
			 * 删除指定索引处的选项卡
			 * @method removeTab
			 * @param {number} index 目标索引
			 */
			removeTab : function ( index ) {
				var me = this;

				me.closeTab ( index );
			}, /**
			 * @method removeTab
			 */
			removeAllTab : function () {
				var me = this;
				//var items = me.items;

				for ( var i = 0; i < me.items.length; i ++ ) {
					me.removeTab ( i );
					i --;
				}
			},

			/**
			 * 根据index或者itemId选中已存在的Tab
			 * @method selectTab
			 * @param {string} which index或者itemId
			 */
			selectTab : function ( which ) {
				var me = this;

				me.activeTab ( which );
			}, /**
			 * 根据index或者itemId判断是否存在Tab
			 * @method exists
			 * @param {string} which index或者itemId
			 * @return {boolean} true已存在，false不存在
			 */
			exists : function ( which ) {
				var me = this;

				//若which的值为索引index
				if ( FAPUI.isNumber ( which ) ) {
					return me.items[ which ] != null;
				}
				//若which的值为标题itemId
				else if ( FAPUI.isString ( which ) ) {
					for ( var k in me.items ) {
						var o = me.items[ k ];

						if ( which === o.itemId ) {
							return true;
						}
					}
				}
				//若which的值不是索引index或者标题itemId，则提示参数无效，并返回false
				else {
					alert ( "The parameter is invalid!" );
					return false;
				}
			}, /**
			 * 根据指定的索引获取选项卡
			 * @method getItem
			 * @param {string} index 目标索引或者itemId的值
			 * @return {Object}
			 */
			getItem : function ( index ) {
				var items = this.items;
				var me;

				if ( FAPUI.isNumber ( index ) ) {
					me = items[ index ];
				} else {
					$ ( items ).each ( function () {
						if ( this.itemId === index ) {
							me = this;
							return;
						}
					} );
				}
				return me;
			},

			/**
			 * 把json数据转换为面板对象
			 * @private
			 */
			_jsonToWidget : function () {
				var me = this;

				if ( me.items != null && me.items.length > 0 ) {
					var items = [];

					$ ( me.items ).each ( function () {
						var that = this;

						that.itemId = that.itemId || FAPUI.getId ( "itemId" );
						that.border = false;
						var cmp = new FAPUI.create ( that );

						cmp.isRender = false;
						items.push ( cmp );
					} );
					this.items = items;
				}
			},

			/**
			 * 渲染面板组件
			 * @private
			 * @param {number} index
			 * @param {Object} wrap
			 */
			_renderWidget : function ( index, wrap ) {
				var me = this;
				//如果没有渲染则进行渲染
				if ( me.items[ index ] && ! me.items[ index ].isRender ) {
					delete me.items[ index ].title;
					me.items[ index ].render ( wrap );
					me.items[ index ].setWidth ( wrap.innerWidth () );
					me.items[ index ].setHeight ( wrap.innerHeight () );
					me.items[ index ].isRender = true;
				}
			},

			/**
			 * 重新布局
			 * 重写父类的doLayout方法
			 * @method doLayout
			 */
			doLayout : function () {
				var tabsBody = this.el.children ( "div.tabs-body" );
				var curContent = this.bodyEl.children ( "div[index=" + this.activeIndex + "]" );

				if ( ! curContent[ 0 ] ) {
					return;
				}
				curContent.css ( "height", tabsBody.innerHeight () );
				curContent.css ( "width", tabsBody.innerWidth () );
				var w = curContent.innerWidth ();
				var h = curContent.innerHeight ();

				this.items[ this.activeIndex ].setWidth ( w );
				this.items[ this.activeIndex ].setHeight ( h );
			}, /**
			 *
			 */
			doLayoutH : function () {
				var tabsBody = this.el.children ( "div.tabs-body" );
				var curContent = this.bodyEl.children ( "div[index=" + this.activeIndex + "]" );

				if ( ! curContent[ 0 ] ) {
					return;
				}
				curContent.css ( "height", tabsBody.innerHeight () );
				var h = curContent.innerHeight ();

				this.items[ this.activeIndex ].setHeight ( h );
			}, /**
			 *
			 */
			doLayoutW : function () {
				var tabsBody = this.el.children ( "div.tabs-body" );
				var curContent = this.bodyEl.children ( "div[index=" + this.activeIndex + "]" );

				if ( ! curContent[ 0 ] ) {
					return;
				}
				curContent.css ( "width", tabsBody.innerWidth () );
				var w = curContent.innerWidth ();

				this.items[ this.activeIndex ].setWidth ( w );
			},

			/**
			 * 当选项卡标签页太多时，显示左右滚动按钮
			 * @private
			 */
			_showScroll : function () {
				var me = this;
				var sumWidth = 0;

				$ ( "ul.tabs li", me.header ).each ( function () {
					sumWidth += $ ( this ).outerWidth ( true );
				} );
				var headerW = me.header.width ();

				if ( sumWidth > headerW ) {
					me.scrollLeft.show ();
					me.scrollRight.show ();
					me.headerWrap.css ( {
						marginLeft : me.scrollLeft.outerWidth (), marginRight : me.scrollRight.outerWidth (), left : 0,
						width : headerW - me.scrollLeft.outerWidth () - me.scrollRight.outerWidth ()
					} );
				} else {
					me.scrollLeft.hide ();
					me.scrollRight.hide ();
					me.headerWrap.css ( {
						marginLeft : 0, marginRight : 0, left : 0, width : headerW
					} );
					me.headerWrap.scrollLeft ( 0 );
				}
			},

			/**
			 * 计算最大宽度
			 * @private
			 * @return {number}
			 */
			_maxWidth : function () {
				var me = this;
				var sum = 0;

				$ ( "ul.tabs li", me.header ).each ( function () {
					sum += $ ( this ).outerWidth ( true );
				} );
				var headerWrapW = me.headerWrap.width ();
				var pad = parseInt ( me.header.find ( "ul.tabs" ).css ( "padding-left" ), 10 );

				return sum - headerWrapW + pad;
			},

			/**
			 * 左右滚动
			 * @private
			 */
			_scrollTab : function () {
				var me = this;

				me.scrollLeft.bind ( "click", function () {
					var pos = me.headerWrap.scrollLeft () - 100;

					me.headerWrap.animate ( {
						scrollLeft : pos
					}, 400, function () {
						if ( pos < 0 ) {
							me.scrollLeft.css ( "cursor", "default" );
						}
						if ( me.scrollRight.css ( "cursor" ) !== "pointer" ) {
							me.scrollRight.css ( "cursor", "pointer" );
						}
					} );
				} );
				me.scrollRight.bind ( "click", function () {
					var pos = me.headerWrap.scrollLeft () - 100;

					me.headerWrap.animate ( {
						scrollLeft : pos
					}, 400, function () {
						if ( me.scrollLeft.css ( "cursor" ) !== "pointer" ) {
							me.scrollLeft.css ( "cursor", "pointer" );
						}
					} );
				} );
			}, /**
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
				me.headEl.remove ();
				delete me.headEl;
				me.bodyEl.remove ();
				delete me.bodyEl;
				me.blankEl.remove ();
				delete me.blankEl;
				me.callParent ();
			}
		},

		/**
		 * @access private
		 * 检查是否所有的标签页都关闭
		 */
		_checkAllClosed : function () {
			var me = this;
			var lis = me.headEl.find ( "li" );

			return lis.length;
		}
	} );
	FAPUI.register ( "tabLayout", FAPUI.Layout.TabLayout );

	return FAPUI.Layout.TabLayout;
} );
