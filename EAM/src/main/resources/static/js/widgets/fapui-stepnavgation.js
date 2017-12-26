/**
 *定义FAPUI.StepNavgation
 *<p>以下代码将演示如何使用StepNavgation组件</p>
 *
 *
 seajs.use(["jquery","widgets/fapui-stepnavgation"], function($,StepNavgation) {
	$(function(){
		var st = new FAPUI.StepNavgation({
	    	renderTo : document.body,
	        width : "100%",
	        height:30,
	        name:"bb",
	        data:{
					"id": "891010",
					"text": "\u745e\u4e30\u94f6\u884c\u8425\u4e1a\u90e8",
					"url": "\u745e\u4e30\u94f6\u884c\u8425\u4e1a\u90e8",
					"cls": "",
					"children": [
					{
					"id": "B000400",
					"text": "\u745e\u4e30\u94f6\u884c\u8425\u4e1a\u90e8\u672c\u90e8",
					"url": "\u745e\u4e30\u94f6\u884c\u8425\u4e1a\u90e8\u672c\u90e8",
					"cls": "",
					"parentId": "891010"
					},{
					"id": "B000401",
					"text": "\u745e\u4e30\u94f6\u884c\u8425\u4e1a\u90e8\u672c\u90e8",
					"url": "\u745e\u4e30\u94f6\u884c\u8425\u4e1a\u90e8\u672c\u90e8",
					"cls": "",
					"parentId": "891010"
					},{
					"id": "B000402",
					"text": "\u745e\u4e30\u94f6\u884c\u8425\u4e1a\u90e8\u672c\u90e8",
					"url": "\u745e\u4e30\u94f6\u884c\u8425\u4e1a\u90e8\u672c\u90e8",
					"cls": "",
					"parentId": "891010"
					},{
					"id": "B000403",
					"text": "\u745e\u4e30\u94f6\u884c\u8425\u4e1a\u90e8\u672c\u90e8",
					"url": "\u745e\u4e30\u94f6\u884c\u8425\u4e1a\u90e8\u672c\u90e8",
					"cls": "",
					"parentId": "891010"
					}
					],
					"parentId": "891000"
					},
	        listeners:{
	           "itemClick":function(id,url,menu){
	               alert(id);
	           }
	        }

	    });
	});
});
 * @class FAPUI.StepNavgation
 * @extend FAPUI.Component
 * */

define ( function ( require, exports, module ) {

	var importcss = "./themes/" + FAPUI.getTheme () + "/css/ui_stepnavgation.css";

	require.async ( importcss );

	require ( "./fapui-component" );
	require ( "./fapui-panel" );
	require ( "./fapui-tabs" );
	require ( "./fapui-borderlayout" );

	FAPUI.define ( "FAPUI.StepNavgation", {
		extend : "FAPUI.Component", props : {
			/**
			 *菜单宽度
			 * @property  width
			 * @type  number
			 * @default  "auto"
			 */
			width : null, /**
			 * 菜单高度
			 * @property height
			 * @type number
			 * @default "auto"
			 */
			height : null, /**
			 * 菜单面板样式
			 * @property bodyCls
			 * @type string
			 * @default ''
			 */
			bodyCls : "", /**
			 *菜单root
			 *@property root
			 *@type string
			 *@default root
			 */
			root : "root", /**
			 *菜单数据
			 *@property data
			 *@type Object
			 *@default {}
			 */
			data : {}, /**
			 * 保存菜单html代码
			 * @private
			 * @type array
			 */
			_htmlArray : []
		}, override : {
			/**
			 *初始化配置对象
			 *@private
			 *
			 */
			initConfig : function () {
				this.addEvents ( /**
					 *菜单点击事件
					 *@event itemClick
					 *@param id string 菜单id
					 *@param url string 菜单url
					 *@param namenu {object} 菜单对象本身
					 */
					" itemClick " );
				this.tpl = [ "<div id=\"${id}\" class=\"na_body ${bodyCls}\">",
							 "<div id=\"${contentId}\" class=\"na_content\"></div>",
							 "</div>" ].join ( " " );

				this.contenttpl = [ "<div class=\"title\" style=\"border-bottom:2px solid #4183c5;\">",
									"<span class=\"na_text\"></span>", "${text}", "</div>",
									"<div class=\"step\">", "<ul>", "{@each children as nd,k}",
									"{@if k==0}",
									"<li isClick=true node-id=\"${nd.id}\" index=${k} text=\"${nd.text}\" url=\"${nd.url}\">",
									"{@else}",
									"<li isClick=false node-id=\"${nd.id}\" index=${k} text=\"${nd.text}\" url=\"${nd.url}\">",
									"{@/if}", "<a href=\"javascript:void(0);\">${nd.text}</a>", "</li>",
									"{@/each}",
									"</ul>",
									"</div>" ].join ( " " );
				juicer.set ( "cache", true );
				juicer.set ( "errorhandling", false );
				juicer.set ( "strip", true );
				juicer.set ( "detection", false );
			},

			/**
			 *创建DOM元素
			 * @method createDom
			 *@private
			 * @returns {String}
			 */
			createDom : function () {
				var me = this;

				me.id = me.id || FAPUI.getId ();
				me.contentId = me.contentId || FAPUI.getId ();
				var cfg = {};

				cfg.id = me.id;
				cfg.contentId = me.contentId;
				cfg.bodyCls = me.bodyCls;
				var tmp = juicer ( me.tpl, cfg );

				return tmp ;
			},
			/**
			 *销毁
			 * @method onDestroy
			 */
			onDestroy : function () {
				var me = this;

				me.bodyEl.remove ();
				delete me.bodyEl;
				me.contentEl.remove ();
				delete me.contentEl;
				delete me.id;
				me.callParent ();
			},

			/**
			 * 计算大小
			 * @method computerSize
			 * @private
			 */
			computerSize : function () {
				var me = this;
				var p = me.el.parent ();

				me.width = me.width || p.width ();
				me.height = me.height || p.height ();
				if ( ! me.bodyEl ) {
					return;
				}
				//设置面板及内容区域的宽度
				if ( isNaN ( me.width ) ) {
					me.bodyEl.width ( "auto" );
				} else {
					me._outerWidth ( me.width, me.el );
					me._outerWidth ( me.width, me.bodyEl );
				}

				//设置面板及有效区域的高度
				if ( isNaN ( me.height ) ) {
					me.bodyEl.height ( "auto" );
				} else {
					me._outerHeight ( me.height, me.bodyEl );
				}

				//设置面板内容区域的高度
				var bH = me.bodyEl.outerHeight ( true );

				me._outerHeight ( bH, me.contentEl );
			},

			/**
			 *重新布局
			 *@private
			 * @method doLayout
			 */
			doLayout : function () {
				this.computerSize ();
				if ( this.bodyEl ) {
					this.setWidth ( this.bodyEl.width () );
					this.setHeight ( this.bodyEl.height () );
				}
			}
		}, /**
		 *@private
		 *布局高度
		 * @method doLayoutH
		 */
		doLayoutH : function () {
			this.computerSize ();
			if ( this.bodyEl ) {
				this.bodyEl.addClass ( "namenu-noscroll" );

			}

		}, /**
		 * 布局宽度
		 * @private
		 *@method doLayoutW
		 */
		doLayoutW : function () {
			this.computerSize ();
			if ( this.bodyEl ) {
				this.bodyEl.addClass ( "namenu-noscroll" );

			}
		},

		/**
		 * @access private
		 * 自定义绑定事件方法
		 * @method _bindEvent
		 */
		_bindEvent : function () {
			var me = this;

			me.contentEl.click ( function ( event ) {
				var tgt = $ ( event.target );

				if ( tgt.is ( "a" ) ) {
					var ul = me.contentEl.find ( "div.step" ).find ( "ul:first" );
					var li = tgt.parent ();
					var index = li.attr ( "index" );

					//获取当前步骤菜单的点击状态
					var isClick = li.attr ( "isClick" );

					//获取所有的步骤菜单
					var lis = ul.find ( "li" );
					//判断是否触发当前itemClick事件
					var isFireEvent = true;
					//循环所有的步骤菜单，判断当前点击的步骤菜单以前所有的步骤是否被点击过
					lis.each ( function ( ind ) {
						var cur = $ ( this );
						var currentIndex = parseInt ( index );
						//去除第一步的判断
						if ( currentIndex > 0 ) {
							if ( ind < currentIndex ) {
								var liIsClick = ul.children ( "li[index=" + ind + "]" ).attr ( "isClick" );

								if ( liIsClick === "false" ) {

									alert ( "您[" + cur.attr ( "text" ) + "]还没有处理" );
									isFireEvent = false;
									return false;
								}
							}
						} else {
							return false;
						}
					} );
					if ( isFireEvent ) {
						/**
						 * firstindex 第一步的索引
						 * prindex 第二步的索引
						 * nextindex 倒数第二步的索引
						 * lastindex 最后一步的索引
						 */
						var firstindex = 0;
						var prindex = firstindex + 1;
						var nextindex = me.data.children.length - 2;
						var lastindex = me.data.children.length - 1;
						var targetLiObj = me._getTargetLi ( ul, firstindex, nextindex, prindex, lastindex );

						if ( isClick === "false" ) {
							//如果是第一个li
							if ( index === 0 ) {

								me._styleChange1 ( targetLiObj.prLi );

								me._styleChange2 ( targetLiObj.firstLi );
							}
							//如果当前li是最后一个
							if ( index === lastindex ) {
								me._styleChange3 ( targetLiObj.firstLi );

								me._styleChange4 ( targetLiObj.prLi );

								me._styleChange5 ( targetLiObj.nextLi );

								me._styleChange6 ( targetLiObj.lastLi );

							}//如果当前点击的是中间步骤
							if ( index !== 0 && index !== lastindex ) {
								if ( index === 1 ) {

									//如果是中间步骤也是第二个

									me._styleChange7 ( targetLiObj.firstLi );

								} else {

									//如果是中间步骤但不是第二个

									me._styleChange8 ( targetLiObj.prLi );

									me._styleChange9 ( targetLiObj.firstLi );
								}

								li.addClass ( "do" );
							}

						} else {
							//如果当前点击的li已被点击,且是第一个
							if ( index === 0 ) {
								me._styleClickChange1 ( targetLiObj.prLi );

								me._styleClickChange2 ( targetLiObj.nextLi );

								me._styleClickChange3 ( targetLiObj.lastLi );

								me._styleClickChange4 ( targetLiObj.firstLi );
							}
							if ( index !== 0 && index !== lastindex ) {
								if ( index === 1 ) {//如果是中间步骤也是第二个

									me._styleClickChange5 ( targetLiObj.firstLi );

									me._styleClickChange6 ( targetLiObj.nextLi );

									me._styleClickChange7 ( targetLiObj.lastLi );

									me._styleClickChange8 ( targetLiObj.prLi );

								} else {//如果是中间步骤但不是第二个

									me._styleClickChange9 ( targetLiObj.prLi );

									me._styleClickChange7 ( targetLiObj.lastLi );

									me._styleClickChange11 ( targetLiObj.firstLi );

									me._styleClickChange12 ( targetLiObj.nextLi );
								}

							}
							//如果当前li是最后一个
							if ( index === lastindex ) {

								me._styleClickChange13 ( targetLiObj.firstLi );

								me._styleClickChange14 ( targetLiObj.prLi );

								me._styleClickChange15 ( targetLiObj.nextLi );

								me._styleClickChange16 ( targetLiObj.lastLi );

							}
						}

						li.attr ( "isClick", true );
						me.fireEvent ( "itemClick", tgt.parent ().attr ( "node-id" ), tgt.parent ().attr ( "url" ),
							me );
					}
				}
			} );
		},

		 /**
		 * @private
		 * @method afterRender
		 */
		afterRender : function () {
			var me = this;

			me.bodyEl = $ ( "#" + me.id );
			me.contentEl = me.bodyEl.children ( "#" + me.contentId );
			me.initWidth = me.width;
			me.initHieght = me.height;

			if ( me.url && me.data.children.length === 0 ) {
				me._loadData ();
			} else if ( me.data.children.length > 0 ) {

				me.loadLocalData ( this.data );
			}
			var li = me.contentEl.find ( "div.step" ).find ( "ul:first" );
			var firstli = li.find ( "li:first" );

			firstli.addClass ( "do" );
			firstli.addClass ( "past" );
			var lastli = li.find ( "li:last" );

			lastli.addClass ( "last" );
		}, /**
		 * 最大化最小化按钮事件绑定
		 * @private
		 * @method bindEvent
		 */
		bindEvent : function () {
			var me = this;

			me.el = me.el || $ ( "#" + me.id );
			me.afterRender ();
		},

		/**
		 * 关闭面板
		 * @method close
		 * @param {boolean} closed 为true则销毁面板，为false则隐藏面板
		 * @returns {boolean}
		 */
		close : function ( closed ) {
			return closed;
		},

		/**
		 * 设置标题信息
		 * @method setTitle
		 * @param {string} title 标题
		 */
		setTitle : function ( title ) {
			this.title = title;
		}, /**
		 * 设置显示面板
		 * @method show
		 */
		show : function () {
			var me = this;

			me.el.show ();
		},
		/**
		 * <font color="red">设置隐藏面板,该方法是其他组件继承自panel的父类方法（不适用于其他组件方法）,请调用组件自己的隐藏方法</font>
		 * @method hide
		 */
		hide : function () {
			var me = this;

			me.el.hide ();
		}, /**
		 * 设置面板高度
		 * @method setHeight
		 * @param {number} h
		 */
		setHeight : function ( h ) {
			this.height = h;
			this.el.height ( h );
			this.doLayoutH ();
		}, /**
		 * 设置面板宽度
		 * @method setWidth
		 * @param {number} w
		 */
		setWidth : function ( w ) {
			this.width = w;
			this.el.width ( w );
			this.doLayoutW ();
		}, /**
		 * 获取面板的高度
		 * @method getHeight
		 * @returns {number} height
		 */
		getHeight : function () {
			return this.height;
		}, /**
		 * 获取面板的宽度
		 * @method getWidth
		 * @returns {number} width
		 */
		getWidth : function () {
			return this.width;
		},

		/**
		 * @access private
		 * 根据不同浏览器计算宽度
		 * @method _outerWidth
		 * @param {number} width 目标宽度值
		 * @param {Element} ele 目标对象
		 */
		_outerWidth : function ( width, ele ) {
			if ( ! ele ) {
				return;
			}
			if ( ! $.boxModel && $.browser.msie ) {
				ele.width ( width );
			} else {
				ele.width ( width - ( ele.outerWidth () - ele.width () ) );
			}
		},
		/**
		 * @access private
		 * 根据不同浏览器计算高度
		 * @method _outerHeight
		 * @param {number} height 目标高度值
		 * @param {Element} ele 目标对象
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
		},
		/**
		 * 加载本地数据
		 * @method loadLocalData
		 */
		loadLocalData : function ( data ) {
			var me = this;

			me._recursionHtml ( data );
			me.contentEl.html ( me._htmlArray.join ( " " ) );

			this._bindEvent ();
		},
		/**
		 * @access private
		 * 加載遠程數據
		 * @method _outerHeight
		 */
		_loadData : function () {

			var me = this;

			$.ajax ( {
				url : me.url,
				type : "POST",
				dataType : "JSON", /**
				 *
				 * @param {Object} data
				 */
				success : function ( data ) {
					if ( data ) {
						me.data = data;
						me._recursionHtml ( data );
						if ( me._htmlArray.length > 0 ) {
							me.contentEl.html ( me._htmlArray.join ( " " ) );
							me._bindEvent ();
						}

					}

				}
			} );
		},
		/**
		 * @access private
		 * @method _outerHeight
		 * @param {Object} data 数据
		 */
		_recursionHtml : function ( data ) {
			var me = this;

			me._stepConfig = {};
			var cfg = {};

			cfg.cls = data.cls;
			cfg.bodyCls = me.bodyCls;
			cfg.text = data.text;
			cfg.id = data.id;
			cfg.children = data.children;
			var htm = juicer ( me.contenttpl, cfg );

			me._htmlArray.push ( htm );
		},
		/**
		 * 获取所有的LI
		 * @access private
		 * @param {number} ul
		 * @param {number} index
		 * @param {number} nextindex
		 * @param {number} prindex
		 * @param {number} lastindex
		 * @returns {Object}
		 */
		_getTargetLi : function ( ul, index, nextindex, prindex, lastindex ) {
			var obj = {
				firstLi : $ ( ul.children ( " li[ index = " + index + "] " ) ),
				nextLi : $ ( ul.children ( " li[ index=" + nextindex + " ] " ) ),
				prLi : $ ( ul.children ( " li[ index = " + prindex + " ] " ) ),
				lastLi : $ ( ul.children ( " li[ index = " + lastindex + " ] " ) )
			};

			return obj;
		},
		/**
		 * @access private
		 * 根据点击不同的li改变样式
		 * @method _styleChange1
		 * @param {number} li 目标li
		 */
		_styleChange1 : function ( li ) {
			li.removeClass ( "past" );
			li.removeClass ( "prev_old" );
			li.removeClass ( "prev" );
			li.removeClass ( "do" );
		},
		/**
		 * @access private
		 * 根据点击不同的li改变样式
		 * @method _styleChange2
		 * @param {number} li 目标li
		 */
		_styleChange2 : function ( li ) {
			li.removeClass ( "past" );
			li.removeClass ( "prev_old" );
			li.removeClass ( "prev" );
			li.addClass ( "do" );
			li.addClass ( "past" );
		},
		/**
		 * @access private
		 * 根据点击不同的li改变样式
		 * @method _styleChange3
		 * @param {number} li 目标li
		 */
		_styleChange3 : function ( li ) {
			li.removeClass ( "do" );
			li.addClass ( "past" );
			li.addClass ( "prev_old" );
		},
		/**
		 * @access private
		 * 根据点击不同的li改变样式
		 * @method _styleChange4
		 * @param {number} li 目标li
		 */
		_styleChange4 : function ( li ) {
			li.addClass ( "past" );
			li.addClass ( "prev_old" );
		},
		/**
		 * @access private
		 * 根据点击不同的li改变样式
		 * @method _styleChange5
		 * @param {number} li 目标li
		 */
		_styleChange5 : function ( li ) {
			li.removeClass ( "do" );
			li.removeClass ( "link" );
			li.addClass ( "past" );
			li.addClass ( "prev" );
		},
		/**
		 * @access private
		 * 根据点击不同的li改变样式
		 * @method _styleChange6
		 * @param {number} li 目标li
		 */
		_styleChange6 : function ( li ) {
			li.addClass ( "last" );
			li.addClass ( "do" );
			li.addClass ( "finish" );
		},
		/**
		 * @access private
		 * 根据点击不同的li改变样式
		 * @method _styleChange7
		 * @param {number} li 目标li
		 */
		_styleChange7 : function ( li ) {
			li.removeClass ( "do" );
			li.addClass ( "past" );
			li.addClass ( "prev" );
		},
		/**
		 * @access private
		 * 根据点击不同的li改变样式
		 * @method _styleChange8
		 * @param {number} li 目标li
		 */
		_styleChange8 : function ( li ) {
			li.removeClass ( "do" );
			li.addClass ( "past" );
			li.addClass ( "prev" );
		},
		/**
		 * @access private
		 * 根据点击不同的li改变样式
		 * @method _styleChange9
		 * @param {number} li 目标li
		 */
		_styleChange9 : function ( li ) {
			li.removeClass ( "do" );
			li.addClass ( "past" );
			li.addClass ( "prev_old" );
		},

		/**
		 * @access private
		 * 根据点击不同的li改变样式
		 * @method _styleClickChange1
		 * @param {number} li 目标li
		 */
		_styleClickChange1 : function ( li ) {
			li.removeClass ( "do" );
			li.removeClass ( "link" );
			li.removeClass ( "prev" );
			li.removeClass ( "back" );
			li.removeClass ( "prev_old" );
			li.addClass ( "past" );
			li.addClass ( "prev_old" );
		},
		/**
		 * @access private
		 * 根据点击不同的li改变样式
		 * @method _styleClickChange2
		 * @param {number} li 目标li
		 */
		_styleClickChange2 : function ( li ) {
			li.removeClass ( "do" );
			li.removeClass ( "back" );
			li.removeClass ( "past" );
			li.removeClass ( "prev" );
			li.addClass ( "past" );
			li.addClass ( "prev_old" );
		},
		/**
		 * @access private
		 * 根据点击不同的li改变样式
		 * @method _styleClickChange3
		 * @param {number} li 目标li
		 */
		_styleClickChange3 : function ( li ) {
			li.removeClass ( "do" );
			li.removeClass ( "finish" );
			li.addClass ( "past" );
			li.addClass ( "back_last" );
		},
		/**
		 * @access private
		 * 根据点击不同的li改变样式
		 * @method _styleClickChange4
		 * @param {number} li 目标li
		 */
		_styleClickChange4 : function ( li ) {
			li.removeClass ( "past" );
			li.removeClass ( "prev" );
			li.removeClass ( "prev_old" );
			li.removeClass ( "back_before" );
			li.addClass ( "do" );
			li.addClass ( "back" );
		},
		/**
		 * @access private
		 * 根据点击不同的li改变样式
		 * @method _styleClickChange5
		 * @param {number} li 目标li
		 */
		_styleClickChange5 : function ( li ) {
			li.removeClass ( "do" );
			li.removeClass ( "link" );
			li.removeClass ( "past" );
			li.removeClass ( "prev_old" );
			li.addClass ( "past" );
			li.addClass ( "back_before" );
		},
		/**
		 * @access private
		 * 根据点击不同的li改变样式
		 * @method _styleClickChange6
		 * @param {number} li 目标li
		 */
		_styleClickChange6 : function ( li ) {
			li.removeClass ( "past" );
			li.removeClass ( "prev" );
			li.removeClass ( "do" );
			li.removeClass ( "back" );
			li.addClass ( "past" );
		},
		/**
		 * @access private
		 * 根据点击不同的li改变样式
		 * @method _styleClickChange7
		 * @param {number} li 目标li
		 */
		_styleClickChange7 : function ( li ) {
			li.removeClass ( "do" );
			//li.removeClass ( "do" );
			li.removeClass ( "finish" );
			li.addClass ( "past" );
			li.addClass ( "back_last" );
		},
		/**
		 * @access private
		 * 根据点击不同的li改变样式
		 * @method _styleClickChange8
		 * @param {number} li 目标li
		 */
		_styleClickChange8 : function ( li ) {
			li.removeClass ( "past" );
			li.removeClass ( "prev" );
			li.removeClass ( "prev_old" );
			li.removeClass ( "back_before" );
			li.addClass ( "do" );
			li.addClass ( "back" );
		},
		/**
		 * @access private
		 * 根据点击不同的li改变样式
		 * @method _styleClickChange9
		 * @param {number} li 目标li
		 */
		_styleClickChange9 : function ( li ) {
			li.removeClass ( "do" );
			li.removeClass ( "past" );
			li.removeClass ( "prev_old" );
			li.removeClass ( "back" );
			li.addClass ( "past" );
			li.addClass ( "back_before" );
		},
		/**
		 * @access private
		 * 根据点击不同的li改变样式
		 * @method _styleClickChange11
		 * @param {number} li 目标li
		 */
		_styleClickChange11 : function ( li ) {
			li.removeClass ( "do" );
			li.removeClass ( "back" );
			li.removeClass ( "prev" );
			li.removeClass ( "back_before" );
			li.addClass ( "past" );
			li.addClass ( "prev_old" );
		},
		/**
		 * @access private
		 * 根据点击不同的li改变样式
		 * @method _styleClickChange12
		 * @param {number} li 目标li
		 */
		_styleClickChange12 : function ( li ) {
			li.removeClass ( "past" );
			li.removeClass ( "prev" );
			li.addClass ( "do" );
			li.addClass ( "back" );
		},
		/**
		 * @access private
		 * 根据点击不同的li改变样式
		 * @method _styleClickChange13
		 * @param {number} li 目标li
		 */
		_styleClickChange13 : function ( li ) {
			li.removeClass ( "do" );
			li.removeClass ( "back_before" );
			li.addClass ( "past" );
			li.addClass ( "prev_old" );
		},
		/**
		 * @access private
		 * 根据点击不同的li改变样式
		 * @method _styleClickChange14
		 * @param {number} li 目标li
		 */
		_styleClickChange14 : function ( li ) {
			li.removeClass ( "back_before" );
			li.addClass ( "past" );
			li.addClass ( "prev_old" );
		},
		/**
		 * @access private
		 * 根据点击不同的li改变样式
		 * @method _styleClickChange15
		 * @param {number} li 目标li
		 */
		_styleClickChange15 : function ( li ) {
			li.removeClass ( "do" );
			li.removeClass ( "back" );
			li.removeClass ( "link" );
			li.removeClass ( "prev_old" );
			li.addClass ( "past" );
			li.addClass ( "prev" );
		},
		/**
		 * @access private
		 * 根据点击不同的li改变样式
		 * @method _styleClickChange16
		 * @param {number} li 目标li
		 */
		_styleClickChange16 : function ( li ) {
			li.removeClass ( "past" );
			li.removeClass ( "back_last" );
			li.addClass ( "do" );
			li.addClass ( "finish" );
		}

	} );
	FAPUI.register ( "stepnavgation", FAPUI.StepNavgation );
	return FAPUI.StepNavgation;
} );

