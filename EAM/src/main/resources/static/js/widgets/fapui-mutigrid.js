/**
 * 基础表格
 *@class FAPUI.SingleGrid
 *@extends FAPUI.Panel
 */
define ( function ( require) {
	var importcss = "./themes/" + FAPUI.getTheme () + "/css/ui-grid.css";

	require.async ( importcss );
	require ( "./fapui-store" );
	require ( "./fapui-gridbase" );
	require ( "./fapui-menu" );
	require ( "./fapui-resize" );
	FAPUI.define ( "FAPUI.MutiGrid", {
		extend : "FAPUI.Panel", props : {

			/**
			 *数据集
			 *@property store
			 *@type Store
			 */
			store : {},

			/**
			 *分页栏，默认为null
			 *@property pagingbarCfg
			 *@type pagingbar
			 */
			pagingbarCfg : null,

			/**
			 * 主体表格
			 */
			mainGrids:[],

			hbox:null,

			/**
			 *智能渲染模式该模式主要用大数据量的一次性渲染.默认为true,如果有动作列那么smartRender为false
			 *@property smartRender
			 *@type Boolean
			 */
			smartRender : true,

			/**
			 *默认值为50,当且仅当分页大小大于此值并且smartRender为true时启用智能渲染模式
			 *@property smartRenderSize
			 *@type Number
			 */
			smartRenderSize : 50,

			/**
			 * 行高,默认为20
			 * @property rowHeight
			 * @type Number
			 */
			rowHeight : 20, cfg : {}, /**
			 * 是否需要分页栏,默认为true,如果不需要设为false
			 * @property pagingBar
			 * @type Boolean
			 */
			pagingBar : true,
		},

		override : {
			/**
			 * 初始化方法
			 */
			initConfig : function () {
				var me = this;

				this.datas = [];

				me.callParent ();
				if(me.mainGrids) {
					for ( var i = 0; i < me.mainGrids.length; i ++ ) {}
					me.mainGrids[0].initConfig ();
				}
			},

			/**
			 * 渲染组件至目标容器
			 * @private
			 * @param {Object} el 目标容器
			 */
			render : function ( el ) {
				this.callParent ( [ el ] );
			},



			/**
			 * @private
			 */
			initContentEvent : function () {
				var me = this;
				if(me.mainGrid){
					me.mainGrid.initContentEvent();
				}
				if ( me.pagingBar ) {
					me._pagingBar.bindEvent ();
				}
			},


			/**
			 * 初始化内容布局
			 * @private
			 */
			createContentDom : function () {
				var me = this;

				var html = [];

				if(me.hbox) {
					if(me.mainGrids){
						me.hbox.addItems(me.mainGrids);
					}
					html.push (me.hbox.createContentDom () );
				}else{
					html.push ("未定义横向表格！" );
				}


				if ( me.pagingBar ) {
					me.pagingbarCfg = me.pagingbarCfg || {};

					FAPUI.applyIf ( me.pagingbarCfg, {
						store : me.store
					} );
					me._pagingBar = new FAPUI.PagingBar ( me.pagingbarCfg );
					html.push ( me._pagingBar.createDom () );
				}
				return html.join ( "" );
			},

			/**
			 * @private
			 */
			computerSize : function () {
				var me = this;

				this.callParent ();
				var heightSum = me.contentEl.innerHeight () - me.gridHead.outerHeight ();

				if ( me.pagingBar ) {
					heightSum = heightSum - me._pagingBar.el.outerHeight ();
				}
				me.mainGrid.gridBody.css ( "height", heightSum );
			},





			/**
			 * @access private
			 */
			_refreshView : function () {
				var me = this;
				var start = 0;

				me.addCount = 0;
				me._showHeader ();
				var end = me._scrollTopAndGetSize ();

				if ( me.smartRender && end > me.smartRenderSize ) {
					end = me._smartRenderAndGetSize ( start );
				}
				me._destorySelected ();
				me._originalData = {};//初始化源数据
				me._dirtyData = {};//初始化脏数据
				me._writeDataFirst ( me.store.data, start, end );
				me._adjustMsie ();
				me._hideMask ();
			},


			/**
			 * 显示表头
			 * @private
			 */
			_showHeader : function () {
				var me = this;

				var htable = me.gridHead.find ( "table.grid-header-table" );

				htable.find ( "tr:first" ).children ( "th" ).show ();
				htable.find ( "tr:last" ).children ( "td" ).show ();

			},

			/**
			 * @access private
			 */
			_befroerefresh : function () {
				var me = this;

				if ( me.mask ) {
					me.mask.height ( me.mask.parent ().height () );
					me.mask.width ( me.mask.parent ().width () );
					me.mask.show ();
				} else {
					if ( me.contentEl ) {
						me.mask = $ ( juicer ( me.gridmasktpl, me ) );
						me.mask.appendTo ( me.contentEl.parent () );

						me.mask.height ( me.mask.parent ().height () );
						me.mask.width ( me.mask.parent ().width () );
						me.mask.show ();
					}
				}
			},

			/**
			 * 设置面板宽度
			 * @method setWidth
			 * @param {number} w
			 */
			setWidth : function ( w ) {
				var me = this;

				this.width = w;
				this.el.width ( w );
				this.doLayout ();
				if(me.mainGrids){
					var wid = w/me.mainGrids.length;
					me.mainGrid.setWidth(wid);
				}

			},

			/**
			 * 设置grid的高度
			 * @method setHeight
			 * @param {number} h 高度
			 */
			setHeight : function ( h ) {
				this.height = h;
				this.el.height ( h );
				this.doLayout ();
				this.computerSize ();
			},


			/**
			 * 添加行
			 * @method addRow
			 * @param {Object} rowObjs 添加的行对象或者是行对象数组
			 */
			addRows : function ( rowObjs ) {
				var me = this;
				var rowCount = rowObjs.length;

				if ( rowCount < 1 ) {
					return;
				}
				//获取当前要添加的数据的第一行的rownindex(grid中数据行下标从0开始)
				var rowLastIndex = me.store.data.length;
				var oldLastIndex = rowLastIndex;
				//从第几行开始渲染
				var startIndex = rowLastIndex;

				if ( me.mainGrid ) {

					me.mainGrid.addRows(rowObjs);
					for ( var i = 0; i < rowCount; i ++ ) {
						rowObjs[ i ]._gridRowIndex = rowLastIndex + i;
						me.store.data.push ( rowObjs[ i ] );
					}
					me.addCount = me.addCount + rowCount;
				}
			},

			/**
			 *
			 * 释放组件
			 * @private
			 */
			onDestroy : function () {
				var me = this;

				if(me.mainGrid){
					me.mainGrid.onDestroy();
				}

			}
		}
	} );
	FAPUI.register ( "mutigrid", FAPUI.MutiGrid );
	return FAPUI.MutiGrid;
} );
