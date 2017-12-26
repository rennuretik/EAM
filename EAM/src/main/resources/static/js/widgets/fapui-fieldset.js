/**
 *定义日期FAPUI.form.FieldSet组件
 *<p>以下代码将演示如何使用FieldSet组件

 new FAPUI.form.FieldSet({
		title:"fieldset",
		//width:550,
		//height:70,
		items:[
			new FAPUI.form.TextField({
		   name : "userName",
		   value : "",
		   width : 500,
		   fieldLabel : "输入框",
		   labelWidth : 70,
		   allowBlank : false,
		   emptyText : "dddddd",
		   errorMsg : "姓名不能为空",
		   //maskReg : /[^a-zA-Z]/g,
		   maxLength : 10,
		   minLength : 5
		}),new FAPUI.form.TextField({
		    name : "userId",
		    value : "",
		    width : 500,
		    fieldLabel : "ID",
		    //labelWidth : 200,
		    allowBlank : false,
		    emptyText : "dddddd",
		    errorMsg : "姓名不能为空",
		    //maskReg : /[^a-zA-Z]/g,
		    maxLength : 10,
		    minLength : 5
		 })
		]
	})

 *@class FAPUI.form.FieldSet
 *@extend FAPUI.Component
 */

define ( function ( require ) {

	require ( "./fapui-component" );

	require ( "./fapui-gridlayout" );

	FAPUI.define ( "FAPUI.form.FieldSet", {
		extend : "FAPUI.Component", props : {

			/**
			 * 组件宽度
			 * @property width
			 * @type Number
			 * @default "auto"
			 */
			width : "auto",

			/**
			 * 组件高度
			 * @property height
			 * @type Number
			 * @default "auto"
			 */
			height : "auto",

			/**
			 * 组件左上角标题
			 * @property title
			 * @type String
			 * @default "fieldset"
			 */
			title : "fieldset",
			/**
			 *自组建所占的列数
			 * @property number
			 * @type number
			 * @default []
			 */
			columns:1,
			/**
			 * 内部组件集合
			 * @property items
			 * @type Array
			 * @default []
			 */

			items : []
		}, override : {

			/**
			 * 初始化配置对象
			 * @private
			 */
			initConfig : function () {
				this.callParent ();
			},
			/**
			 * 渲染组件至目标容器
			 * @private
			 * @param {Object} el 目标容器
			 */
			render : function ( el ) {
				var me = this;

				me.callParent ( [ el ] );
			}, /**
			 * 创建dom
			 * @private
			 */
			createDom : function () {
				var me = this;

				this.id = this.id || FAPUI.getId ();
				var cfg = {};

				cfg.items = me.items || [];
				cfg.columns = me.columns || 1;
				me.layout = new FAPUI.Layout.GridLayout ( cfg );
				var layoutContent = this.layout.createDom ();

				this.isLayout = true;
				me.items = this.layout.items;
				var html = [];

				html.push ( "<fieldset id=\"\" + this.id + \"\">" );
				if ( me.title ) {
					html.push ( "<legend>" + me.title + "</legend>" );
				}
				html.push ( layoutContent );
				html.push ( "</fieldset>" );
				return html.join ( " " );
			}, /**
			 * 绑定事件
			 * @private
			 */
			bindEvent : function () {
				var me = this;

				if ( me.width ) {
					me.setWidth ( me.width );
				}
				if ( me.height ) {
					me.setHeight ( me.height );
				}
				this.layout.bindEvent ();
			}
		}
	} );
	FAPUI.register ( "fieldset", FAPUI.FieldSet );

	return FAPUI.FieldSet;
} );