/**
 *    把几个form组件合并在一起形成一个新的form组件
 **/
define ( function ( require ) {

	var importcss = "./themes/" + FAPUI.getTheme () + "/css/ui-composite.css";

	require.async ( importcss );

	require ( "./fapui-component" );
	require ( "./fapui-gridlayout" );

	FAPUI.define ( "FAPUI.form.Composite", {
		extend : "FAPUI.Component", props : {
			/**
			 * composite 标题
			 * @property title
			 * @type string
			 * @default null
			 */
			title : null, /**
			 * 面板内容区域自定义html片段
			 * @property html
			 * @type String
			 * @default null
			 */
			html : null, /**
			 * composite 宽度
			 * @property width
			 * @type number
			 * @default 200
			 */
			width : 200, /**
			 * composite 高度
			 * @property height
			 * @type number
			 * @default 100
			 */
			height : 100, /**
			 * 是一个CSS class，作用于面板内容区域上
			 * @property bodyCls
			 * @type String
			 * @default ""
			 */
			bodyCls : "", /**
			 * composite 组件集合
			 * @property items
			 * @type Array
			 * @default []
			 */
			items : [], /**
			 * composite描述性文字
			 * @property fieldLabel
			 * @type string
			 * @default null
			 */
			fieldLabel : null, /**
			 * composite描述性文字宽度
			 * @property labelWidth
			 * @type number
			 * @default 60
			 */
			labelWidth : 60, /**
			 * composite描述性文字位置
			 * @property labelAlign
			 * @type string
			 * @default right
			 */
			labelAlign : "right", /**
			 * composite跨几列
			 * @property colspan
			 * @type number
			 * @default 1
			 */
			colspan : 1,

			/**
			 * 文本标签与输入框的分隔符
			 * @property  labelSplit
			 * @type String
			 * @default ""
			 */
			labelSplit : ""
		}, override : {
			/**
			 * 初始化配置对象
			 */
			initConfig : function () {
				this.tpl = "<div id=\"${id}\" class=\"composite-panel\">$${bodyContent==null?\"\":bodyContent}</div>";
				this.contenttpl = [ "{@if fieldLabel!=null}", "<div class=\"composite-label\"",
					"style=\"display: inline-block;float:left;width:${labelWidth}px;",
					"font-size:12px;margin-top:10px;text-align:${labelAlign};\">${fieldLabel}$${labelSplit}</div>",
					"{@/if}<div id=\"$${pId}\" class=\"composite-content ${bodyCls}\"",
					"style=\"display: inline-block;float:left;\" >", "$${html==null?\"\":html}", "</div>" ].join ( "" );

				juicer.set ( "cache", true );
				juicer.set ( "errorhandling", false );
				juicer.set ( "strip", true );
				juicer.set ( "detection", false );

				var me = this;
				var cfg = {};

				cfg.items = me.items || [];
				cfg.columns = cfg.items.length;
				cfg.anchor = me.anchor || "100%";
				cfg.defaultStyle = me.defaultStyle || "margin-top:5px;";
				cfg.defaultCls = me.defaultCls || "";
				cfg.defaultSet = me.defaultSet || null;
				this.layout = new FAPUI.Layout.GridLayout ( cfg );
			}, /**
			 * 渲染组件
			 * @private
			 * @param el 目标容器对象
			 */
			render : function ( el ) {
				var me = this;

				me.callParent ( [ el ] );
				me.bodyEl = $ ( "#" + me.id, me.el );
			},

			/**
			 * 创建DOM元素
			 * @private
			 */
			createDom : function () {
				var me = this;

				var cfg = {};
				var tpl = {};

				me.pId = FAPUI.getId ();
				cfg.pId = me.pId;

				me.id = FAPUI.getId ();

				cfg.bodyCls = me.bodyCls;
				me.layout = FAPUI.create ( this.layout );

				var html = this.layout.createDom ();

				cfg.html = html;
				cfg.fieldLabel = me.fieldLabel;
				cfg.labelWidth = me.labelWidth;
				cfg.labelAlign = me.labelAlign;
				cfg.labelSplit = me.labelSplit;

				var bodyContent = juicer ( me.contenttpl, cfg );

				tpl.bodyContent = bodyContent;
				tpl.id = me.id;
				var tmp = juicer ( me.tpl, tpl );

				me.items = me.layout.items;
				return tmp;
			}, /**
			 * 最大化最小化按钮事件绑定
			 * @private
			 */
			bindEvent : function () {
				var me = this;

				me.el = me.el || $ ( "#" + me.id );
				me.layout.bindEvent ();
			}, /**
			 * 计算面板大小
			 * @private
			 */
			computerSize : function () {
				var me = this;
				var p = me.el.parent ();

				me.width = me.width || p.width ();
				me.height = me.height || p.height ();

				//设置面板及内容区域的宽度
				if ( ! isNaN ( me.width ) ) {
					me.width += 1;
					me._outerWidth ( me.width, me.el );
				} else {
					me.el.width ( "auto" );
				}
			}, /**
			 * 隐藏composite
			 */
			hide : function () {
				var me = this;

				me.callParent ();
			}, /**
			 * 显示composite
			 */
			show : function () {
				var me = this;

				me.callParent ();
			}, /**
			 * 表单信息校验
			 * @method validate
			 * @return {boolean} true：验证通过，false：验证未通过
			 */
			validate : function () {
				var items = this.layout.items;
				var flag = true;
				var that;

				$ ( items ).each ( function () {
					that = this;

					if ( that.validate () !== true ) {
						flag = false;
						return false;
					}
				} );
				return flag;
			}, /**
			 * 重置表单信息
			 * @method reset
			 */
			reset : function () {
				var me = this;

				if ( me.html ) {
					me.contentEl.html ( "" );
				} else if ( me.layout.isUI && me.layout.isUI () ) {
					me.layout.reset ();
				}
			}, /**
			 * 根据不同浏览器计算宽度
			 * @private
			 * @param {number} width 目标宽度值
			 * @param {Object} ele 目标对象
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
			}, /**
			 * 根据不同浏览器计算高度
			 * @private
			 * @param {number} height 目标高度值
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
			 *@private
			 *布局高度
			 */
			doLayoutH : function () {
				this.computerSize ();
				if ( this.el && this.layout ) {
					this.layout.setHeight ( this.el.height () );
				}
			}, /**
			 *@private
			 * 布局宽度
			 */
			doLayoutW : function () {
				this.computerSize ();
				if ( this.el && this.layout ) {
					this.layout.setWidth ( this.el.width () - this.labelWidth );
				}
			}, /**
			 * 要添加的组件或者组件数组
			 */
			addItems : function ( items ) {
				var me = this;
				var layout = me.layout;

				if ( ! FAPUI.isArray ( items ) ) {
					items = [ items ];
				}
				layout.columns = layout.items.length + items.length;
				layout.addItems ( items );
			}, /**
			 * 销毁组件
			 */
			onDestroy : function () {
				var me = this;

				me.el.remove ();
				delete me.el;
				delete me.pId;
				if ( this.layout ) {
					this.layout.destroy ();
				}
				me.callParent ();
			}
		}
	} );
	FAPUI.register ( "composite", FAPUI.form.Composite );
	return FAPUI.form.Composite;
} );
