/**
 *定义FAPUI.NavgationMenu
 *<p>
 *     以下代码将演示如何使用NavgationMenu组件
 *     @since 4.0.1 支持一级菜单直接使用可操作
 * </p>

 var n = new FAPUI.NavgationMenu ( {
		renderTo : document.body,	//要渲染的位置
		width : 300,	//指定宽度
		height : 600,	//指定高度
		data : getData (),
		//url : "http://172.16.16.32:8090/fapui/test/getMenus",
		listeners : {
			"itemClick" : function ( id, url, menu ) {
				alert ( id );
			}
		}
 	} );
 * @class FAPUI.NavgationMenu
 * @extend FAPUI.Panel
 * */

define ( function ( require ) {
	var importcss = "./themes/" + FAPUI.getTheme () + "/css/ui_navgationmenu.css";

	require.async ( importcss );
	require ( "./fapui-component" );

	FAPUI.define ( "FAPUI.NavgationMenu", {
		extend : "FAPUI.Component", props : {
			/**
			 *菜单宽度
			 * @property  width
			 * @type  Number
			 * @default  "auto"
			 */
			width : null, /**
			 * 菜单高度
			 * @property height
			 * @type Number
			 * @default "auto"
			 */
			height : null, /**
			 *面板边框
			 * @property border
			 * @type boolean
			 * @default true
			 */
			border : true,

			/**
			 *菜单标题
			 * @property title
			 * @type string
			 * @default null
			 */
			title : null, /**
			 * 菜单面板标题图片
			 * @property title
			 * @type string
			 * @default null
			 */
			titleIconCls : null, /**
			 * 菜单级别
			 *  @property level
			 * @type Number
			 * @default 2
			 */
			level:2,/**
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
			 *@type array
			 *@default []
			 */
			data : [], /**
			 * 保存菜单html代码
			 * @private
			 * @type array
			 * @default null
			 */
			_htmlArray : [], /**
			 *保存菜单状态
			 *@private
			 *@type boolean
			 *@default false
			 */
			expand : false,
			resultField : ""
		}, override : {
			/**
			 *初始化配置对象
			 *@private
			 */
			initConfig : function () {
				this.addEvents ( /**
					 *菜单点击事件
					 *@event itemClick
					 *@param id string 菜单id
					 *@param url string 菜单url
					 *@param namenu {Object} 菜单对象本身
					 */
					" itemClick " );
				this.tpl = [ "<div id=\"${id}\" class=\"na_body ${bodyCls}\">",
					"<div id=\"${contentId}\" class=\"na_content\"></div>", "</div>" ].join ( " " );
				/**
				 * 菜单选项
				 */
				this.contenttpl =
					[ "<div class=\"child_menu ${bodyCls}\" id=\"${id}\" url=\"${url}\" title=\"${text}\">",
						"{@if children}<span class=\"nav-icon ${cls}\"></span>", "${text}", "<em class=\"na_em na_em_expand\"></em></div>{@else}",
						"<span class=\"nav-icon ${cls}\"></span>",
						"<a  href=\"javascript:void(0);\">${text}</a>{@/if}",
						"{@if children}<div class=\"child_vicon\" style=\"display:none; width:100%;\">",
						"<ul class=\"na_list\">", "{@each children as nd,k}",
						"<li id=\"${nd.id}\" index=\"${k}\" url=\"${nd.url}\" title=\"${nd.text}\">",
						"<a  href=\"javascript:void(0);\">${nd.text}</a>", "</li>", "{@/each}",
						"</ul>{@/if}", "</div>" ].join ( " " );
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
				cfg.bodyCls = me.bodyCls;
				cfg.contentId = me.contentId;
				var tmp = juicer ( me.tpl, cfg );

				return tmp;
			}, /**
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

				me._outerHeight ( bH, me.contentEl-1 );
			},

			/**
			 *重新布局
			 *@private
			 * @method doLayout
			 */
			doLayout : function () {
				this.computerSize ();
				if ( this.bodyEl ) {
					this.bodyEl.addClass ( "namenu-noscroll" );
					if ( this.border === true ) {
						this.setWidth ( this.bodyEl.width () - 2 );
						this.setHeight ( this.bodyEl.height () - 2 );
					} else {
						this.setWidth ( this.bodyEl.width () );
						this.setHeight ( this.bodyEl.height () );
					}
				}
			},

			/**
			 *@private
			 *布局高度
			 * @method doLayoutH
			 */
			doLayoutH : function () {
				this.computerSize ();
				if ( this.bodyEl ) {
					this.bodyEl.addClass ( "namenu-noscroll" );

				}

			},

			/**
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
				var tabIndex = -1;

				me.contentEl.unbind('click');
				me.contentEl.click ( function ( event ) {
					var tgt = $ ( event.target );

					if ( tgt.is ( "div" ) && tgt.hasClass ( "child_menu" ) ) {
						$ ( ".child_vicon", me.contentEl.el ).slideUp ();
						if ( $ (tgt).next ().is ( ":hidden" ) ) {
							$ (tgt).next().slideDown ();
							$ (tgt).children("em").removeClass("na_em_expand" ).addClass("na_em_collapse" );
						}else{
							$ (tgt).children("em").removeClass("na_em_collapse" ).addClass("na_em_expand" );
						}

					}
					if ( tgt.is ( ".child_menu em" ) ) {
						var j = $ ( ".child_menu", me.contentEl.el ).index ( tgt.parent("div") );
						$ ( ".child_vicon", me.contentEl.el ).slideUp ();
						if ( $ ( tgt.parent("div") ).next ().is ( ":hidden" ) ) {
							$ ( tgt.parent("div") ).next ().slideDown ();
							$ ( tgt.parent("div") ).children("em").removeClass("na_em_expand" ).addClass("na_em_collapse" );
						}else{
							$ (tgt.parent("div")).children("em").removeClass("na_em_collapse" ).addClass("na_em_expand" );
						}

					}

					if ( tgt.is ( "li" ) || tgt.is ( "a" ) ) {
						if ( tgt.is ( "a" ) ) {
							tgt = tgt.parent ();
						}
						me.fireEvent ( "itemClick", tgt.attr ( "id" ), tgt.attr ( "url" ), tgt.attr ( "title" ), me );
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
				if ( me.url && me.data.length === 0 ) {
					me._loadData ();
				} else if ( me.data.length > 0 ) {
					me.loadLocalData ( this.data );
				}
			},

			/**
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
			 * <font color="red">设置隐藏面板,该方法是其他组件继承自panel的父类方法（不适用于其他组件方法）,
			 * 请调用组件自己的隐藏方法</font>
			 * @method hide
			 */
			hide : function () {
				var me = this;

				me.el.hide ();
			},

			/**
			 * 设置面板高度
			 * @method setHeight
			 * @param {number} h
			 */
			setHeight : function ( h ) {
				this.height = h;
				this.el.height ( h );
				this.doLayoutH ();
			},

			/**
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
			 * @param {element} ele 目标对象
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
			 * @param {element} ele 目标对象
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
			 * @param {Object} data - 加载的菜单项数据
			 */
			loadLocalData : function ( data ) {
				var me = this;
				me._htmlArray = [];
				this._recursionHtml ( data );
				this.contentEl.html ( this._htmlArray.join ( "" ) );
				this._bindEvent ();
			},

			/**
			 * @access private
			 * 加载远程数据
			 * @method _loadData
			 */
			_loadData : function () {
				var me = this;

				$.ajax ( {
					url : me.url, type : "POST", dataType : "JSON", /**
					 * @param {Object} data
					 */
					success : function ( data ) {
						//处理后台返回的json数据，转换成需要的 封装结果
						var fields = [] ;
						if (me.resultField ) {
							if ( me.resultField.indexOf(".") >= 0) {
								fields = me.resultField.split(".");
							} else {
								fields.push(me.resultField);
							}
						}
						if (fields) {
							for (var i = 0; i < fields.length; i++) {
								data = data[fields[i].trim()]
							}
						}

						if(data.result){//FAP4兼容性
							data = data.result;
						}
						if ( data && data.length > 0 ) {
							me._htmlArray = [];
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
			 * 递归菜单data生成html
			 * @method _recursionHtml
			 * @param {Object} data 数据(远程或者本地)
			 */
			_recursionHtml : function ( data ) {
				var me = this;

				$ ( data ).each ( function () {
					var cfg = {};

					cfg.cls = this.cls || "";
					cfg.bodyCls = me.bodyCls;
					cfg.text = this.text;
					cfg.expand = this.expand;
					cfg.id = this.id;
					cfg.url = this.url;

					cfg.children = this.children;
					if ( this.menuLevel < me.level ) {
						var htm = juicer ( me.contenttpl, cfg );

						me._htmlArray.push ( htm );

						me._recursionHtml ( this.children );
					}
				} );
			}
		}
	} );

	FAPUI.register ( "navgationmenu", FAPUI.NavgationMenu );

	return FAPUI.NavgationMenu;
} );

