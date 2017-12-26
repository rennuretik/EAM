/**组件的基类
 *@class FAPUI.Component
 *@extends FAPUI.Observable
 */
define ( function ( require ) {
	var importcss = "./themes/" + FAPUI.getTheme () + "/css/ui-core.css";

	require.async ( importcss );

	importcss = "./themes/" + FAPUI.getTheme () + "/css/ui-icon.css";
	require.async ( importcss );

	require ( "jquery" );

	require ( "juicer" );

	require ( "./fapui-observable" );

	FAPUI.define ( "FAPUI.Component", {
		extend : "FAPUI.Observable",
		/**
		 *
		 * @param {Object}cfg
		 */
		constructor : function ( cfg ) {
			var me = this;

			me.callParent ( [ cfg ] );
			//FAPUI.apply(this,cfg||{});
			me.initConfig ();
			var createType = this.getCreateType ();

			if ( "dom" === createType ) {
				this.updateRender ();
			} else {
				if ( this.renderTo ) {
					this.render ( this.renderTo );
				}
			}
		},
		props : {
			/**
			 * 创建组件的方式:"js","dom",默认为js
			 * @property createType
			 * @type String
			 */
			createType : "js",	//js||dom

			/**
			 * 是否显示组件
			 * @property display
			 * @type String
			 */
			display:true,
			width : null,
			height : null,

			/**
			 * itemId,在form表单中通过form.getComponent( itemId)来获取form布局中的控件
			 * @property itemId
			 * @type String
			 */
			itemId:null,

			/**
			 * 在form表单中或者gridlayout中，每一个列占总宽度的占比
			 * @property anchor
			 * @type Number
			 */
			anchor:null
		},
		override : {
			/**
			 * @private
			 */
			initConfig : function () {
				var me = this;

				this.addEvents (
					"resize",
					"beforeDestroy",
					"destroy"
				);

				juicer.set ( "cache", true );
				juicer.set ( "errorhandling", false );
				juicer.set ( "strip", true );
				juicer.set ( "detection", false );

				me.id = me.id || FAPUI.getId ();

				FAPUI.registerInstance ( me );

				if ( "dom" === this.getCreateType () ) {
					this.el = this.fly ( this.el );
					this.parseDom ();
				}
			},
			/**
			 * @private
			 */
			parseDom : function () {

			},
			/**
			 *
			 * @returns {boolean} true
			 */
			isUI : function () {
				return true;
			},
			/**
			 * @private
			 */
			updateRender : function () {

			},
			/**
			 * @private
			 */
			render : function ( el ) {
				var parent = this.fly ( el );

				parent.append ( $ ( this.createDom () ) );
				this.el = $ ( "#" + this.id, parent );
				this.bindEvent ();
				this.doLayout ();
			},
			/**
			 * @private
			 */
			createDom : function () {
				var me = this;

				me.id = me.id || FAPUI.getId ();
				return "<div id=" + me.id + " style="+me.display?"block":"none"+"></div>";
			},
			/**
			 * @private
			 */
			bindEvent : function () {
				var me = this;

				me.el = me.el || $ ( "#" + me.id );
			},
			/**
			 * @private
			 */
			destroy : function () {
				var me = this;

				if ( false !== me.fireEvent ( "beforeDestroy", this ) ) {
					me.fireEvent ( "destroy", this );
					FAPUI.unregisterInstance ( this );
					//this.purgeListeners ();
					this.onDestroy ();
				}
			},
			/**
			 * 销毁组件
			 */
			onDestroy : function () {
				if ( this.el ) {
					this.el.unbind ();
					this.el.remove ();
					delete this.el;
				}
				delete this.id;
				if ( $.browser.msie ) {
					window.CollectGarbage ();
				}
			},
			/**
			 * 基类方法(重新布局)
			 * @private
			 */
			doLayout : function () {
				this.setHeight ( this.height );
				this.setWidth ( this.width );
			},
			/**
			 * 基类方法(设置高度)
			 *  @private
			 */
			setHeight : function ( h ) {
				this.height = h;
				this.el.height ( h );

			},
			/**
			 * 基类方法(设置宽度)
			 * @private
			 */
			setWidth : function ( w ) {
				this.width = w;
				this.el.width ( w );

			},
			/**
			 * 基类方法(隐藏)
			 * @private
			 */
			hide : function () {
				this.el.hide ();
			},
			/**
			 * 基类方法(显示)
			 * @private
			 */
			show : function () {
				this.el.show ();
			}
		}
	} );

	return FAPUI.Component;

} );
