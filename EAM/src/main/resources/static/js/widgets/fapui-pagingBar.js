/**
 * 定义FAPUI.PagingBar分页组件
 * @class FAPUI.PagingBar
 * @extends FAPUI.Component
 */

	//FAPUI.BLANK_IMG="../resources/s.gif";
define ( function ( require, exports, module ) {
	var importcss = "./themes/" + FAPUI.getTheme () + "/css/ui-pagingBar.css";

	require.async ( importcss );
	require ( "./fapui-store" );
	require ( "./fapui-component" );

	FAPUI.define ( "FAPUI.PagingBar", {
		extend : "FAPUI.Component", props : {

			/**
			 * 所绑定的数据存储对象
			 * @property store
			 * @type FAPUI.Store
			 * @default {}
			 */
			store : {},

			/**w
			 * 分页下拉框的内容
			 * @property pageSizeCombo
			 * @type Array
			 * @default [10,20,50,100,500,1000,10000]
			 */
			pageSizeCombo : [ 10, 20, 50, 100, 500, 1000, 10000 ]
		}, override : {

			/**
			 * 初始化配置对象
			 * @private
			 */
			initConfig : function () {
				this.callParent ();
				this.addEvents ();
				this.store.on ( "refresh", this._doRefresh, this );
				this.pagerTpl = [
					"<div id=\"${id}\" class=\"grid-paging\">",
					"<table style=\"float:left;height:100%;\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody><tr>",
					"<td style=\"padding-left:5px;\"><span class=\"pagination page-first\"></span></td>",
					"<td><span class=\"pagination page-prev\"></span></td>",
					"<td><span class=\"paging-separator\"></span></td>",
					"<td style=\"font-size:12px;\"><span class=\"paging-label\" style=\"margin-top:-4px;\">第</span>",
					"<input  style=\"width:35px;\" class=\"paging-input paging-num\" type=\"text\" value=\"${currPage}\"/>",
					"<span>页,共${countPage}页</span></td>",
					"<td><span class=\"paging-separator\"></span></td>",
					"<td><span class=\"pagination page-next\"></span></td>",
					"<td><span class=\"pagination page-last\"></span></td>",
					"<td><span class=\"paging-separator\"></span></td>",
					"<td><span class=\"pagination page-refresh\"></span></td>",
					"<td><span class=\"paging-separator\"></span></td>",
					"<td><span class=\"paging-label\" style=\"margin-bottom:2px;\">每页显示数</span>",
					"<input class=\"paging-combo paging-input\" type=\"text\" value=\"${currPage}\" readonly=\"true\">",
					"<a href=\"javascript:void(0)\" class=\"grid-arrow\" hidefocus=\"true\"></a></td>",
					"</tr></tbody></table>",
					"<div  class=\"paging-info\">第${start}条到${end}条,共${count}条</div>",
					"<div style=\"clear:both;\"></div>",
					"</div>"
				].join ( " " );
				juicer.set ( "cache", true );
				juicer.set ( "errorhandling", false );
				juicer.set ( "strip", true );
				juicer.set ( "detection", false );
			},

			/**
			 * 渲染组件
			 * @private
			 * @param {Object} el 目标容器的对象
			 */
			render : function ( el ) {
				var me = this;

				me.callParent ( [ el ] );
			},

			/**
			 * 重写父类的doLayout方法
			 */
			doLayout : function () {

			},

			/**
			 * 创建DOM元素
			 * @private
			 */
			createDom : function () {
				var me = this;

				me.contentEl = "<ul class='pg_grid-paging'>{@each pageSizeCombo as it,i}" +
					"<li class=${it==limit?'item-selected':''}>${it}</li>{@/each}</ul>";
				me.id = me.id || FAPUI.getId ();
				var count = me.store.count || 0;
				var limit = me.store.limit || me.pageSizeCombo[ 0 ];

				me.cfg = me.cfg || {};
				me.cfg.count = count;
				me.cfg.limit = limit;
				me.cfg.countPage = me.store.getTotalPage();
				me.cfg.countPage===0&&me.cfg.countPage++;
				me.cfg.currPage =me.store.getCurrentPage();
				me.cfg.start = me.store.start || 0;
				if ( me.cfg.start !== 0 ) {
					me.cfg.start = me.cfg.start + 1;
				}
				me.store.start = me.store.start || 0;
				me.cfg.id = me.id;
				var length = me.store.data ? me.store.data.length : 0;

				me.cfg.end = me.store.start + length - 1;
				if ( me.cfg.end === - 1 ) {
					me.cfg.end = 0;
				}
				me.cfg.pageSizeCombo = me.pageSizeCombo;
				var pagintmp = juicer ( me.pagerTpl, me.cfg );

				me.contentEl = $ ( juicer ( me.contentEl, {
					"pageSizeCombo" : me.pageSizeCombo,
					"limit" : limit
				} ) );
				me.contentEl.appendTo ( $ ( document.body ) );
				return pagintmp;
			},
			/**
			 *事件绑定
			 */
			bindEvent : function () {
				var me = this;

				me.el = me.el || $ ( "#" + me.id );
				me.pageEl = me.el.find ( "input.paging-num" );
				me.textEl = me.el.find ( "div.paging-info" );
				me.pageFirstEl = $ ( ".page-first", me.el );
				me.pagePrevEl = $ ( ".page-prev", me.el );
				me.pageNextEl = $ ( ".page-next", me.el );
				me.pageLastEl = $ ( ".page-last", me.el );
				me._setDefaultNum ();
				me._propCombo ();
				me._comboItemChange ();
				me._turnPage ();
				me._disableAllButton ();
			},
			/**
			 * @access private
			 * 翻页按钮事件
			 */
			_turnPage : function () {
				var me = this;

				me.pageFirstEl.click ( function () {
					if ( $ ( this ).hasClass ( "page-first-disable" ) ) {
						return;
					}
					me._toFirst ();
				} ).hover ( function () {
					if ( $ ( this ).hasClass ( "page-first-disable" ) ) {
						return;
					}
					$ ( this ).addClass ( "paging-hover" );
				}, function () {
					$ ( this ).removeClass ( "paging-hover" );
				} );
				me.pagePrevEl.click ( function () {
					if ( $ ( this ).hasClass ( "page-prev-disable" ) ) {
						return false;
					}
					me._toPrev ();
				} ).hover ( function () {
					if ( $ ( this ).hasClass ( "page-prev-disable" ) ) {
						return false;
					}
					$ ( this ).addClass ( "paging-hover" );
				}, function () {
					$ ( this ).removeClass ( "paging-hover" );
				} );
				me.pageNextEl.click ( function () {
					if ( $ ( this ).hasClass ( "page-next-disable" ) ) {
						return false
					}
					me._toNext ();
				} ).hover ( function () {
					if ( $ ( this ).hasClass ( "page-next-disable" ) ) {
						return false;
					}
					$ ( this ).addClass ( "paging-hover" );
				}, function () {
					$ ( this ).removeClass ( "paging-hover" );
				} );
				me.pageLastEl.click ( function () {
					if ( $ ( this ).hasClass ( "page-last-disable" ) ) {
						return false;
					}
					me._toEnd ();
				} ).hover ( function () {
					if ( $ ( this ).hasClass ( "page-last-disable" ) ) {
						return false;
					}
					$ ( this ).addClass ( "paging-hover" );
				}, function () {
					$ ( this ).removeClass ( "paging-hover" );
				} );
				$ ( ".page-refresh", me.el ).click ( function () {
					me._toRefresh ();
				} ).hover ( function () {
					$ ( this ).addClass ( "paging-hover" );
				}, function () {
					$ ( this ).removeClass ( "paging-hover" );
				} );

				//页数跳转文本框回车事件处理
				$ ( "input.paging-num", me.el ).keydown ( function ( event ) {
					if ( event.keyCode === 13 ) {
						me._toCustPage ();
					}
					;
				} );
			},
			/**
			 * @access private
			 * 设置下拉框的值
			 */
			_setDefaultNum : function () {
				var me = this;
				var td = me.el.children ( "table" ).find ( "td" );
				var item = me.contentEl.find ( "li.item-selected" );
				var val = parseInt ( item.html () );
				var combo = td.find ( "input.paging-combo" );

				combo.css ( "cursor", "default" );
				combo.val ( val );
			},
			/**
			 * @access private
			 * 弹出下拉框
			 */
			_propCombo : function () {
				var me = this;
				var td = me.el.children ( "table" ).find ( "td" );
				var list = me.contentEl;
				var arrow = td.find ( "a.grid-arrow" );

				arrow.click ( function () {
					var pos = $ ( this ).offset ();
					var docHeight = document.documentElement.offsetHeight;

					list.css ( {
						left : pos.left - 31, top : pos.top + 17
					} );

					//下拉列表弹出位置边界控制
					var maxHeight = docHeight - list.height () - 16;
					var top = me.el.find ( "input.paging-combo" ).offset ().top;

					top > maxHeight && list.css ( {
						"top" : - list.height () + top - 1,
						"border-top" : "1px solid #ccc",
						"border-bottom" : "0"
					} );
					list.is ( ":hidden" ) ? list.show () : list.hide ();
				} );

				//关闭下拉列表
				$ ( document ).bind ( "mousedown", function ( event ) {
					var target = $ ( event.target );

					if ( ! target.is ( "a,ul.pg_grid-paging,ul.pg_grid-paging *" ) ) {
						list.hide ();
					}
				} );
			},
			/**
			 * @access private
			 * 下拉框列表的值改变事件的处理
			 *
			 */
			_comboItemChange : function () {
				var me = this;
				var td = me.el.children ( "table" ).find ( "td" );
				var combo = td.find ( "input.paging-combo" );
				var list = me.contentEl.find ( "li" );

				list.click ( function () {
					$ ( this ).addClass ( "item-selected" ).siblings ().removeClass ( "item-selected" );
					var limit = parseInt ( $ ( this ).html () );

					combo.val ( limit );
					me._refreshByLimit ( limit );
					$ ( this ).parent ().hide ();
				} ).hover ( function () {
					$ ( this ).addClass ( "hover" ).siblings ().removeClass ( "hover" );
				}, function () {
					$ ( this ).removeClass ( "hover" );
				} );
			}, /**
			 * 更新DOM元素
			 * @private
			 */
			updateRender : function () {
				this.callParent ();
			},
			/**
			 * 上一页
			 * @private
			 */
			_toPrev : function () {
				var me = this;

				if ( me.store.start === 0 ) {
					return false;
				}
				me.store.toPrev();
			},

			/**
			 * 刷新分页栏
			 * @private
			 */
			_doRefresh : function () {
				var me = this;
				var cfg = me.cfg||{};

				cfg.start = me.store.start;
				var length = me.store.data ? me.store.data.length : 0;

				cfg.end = me.store.start + length;
				cfg.count = me.store.count;
				cfg.start = cfg.start + 1;
				if ( cfg.end === 0 ) {
					cfg.start = 0;
				}
				var tpl = "第${start}条到${end}条,共${count}条";

				me.textEl.text ( juicer ( tpl, cfg ) );
				var currPage = me.store.getCurrentPage();
				me.pageEl.val ( currPage );
				var countPage = me.store.getTotalPage();
			    countPage===0&&countPage++;
				cfg.countPage=countPage;
				me.pageEl.next ().text ( "页,共" + countPage + "页" );
				me._disAble ();
			},

			/**
			 * 首页，专门用于查询时更换条件后被调用
			 * @method toFist
			 */
			toFirst : function(){
				var me = this;

				me._toFirst();
			},
			/**
			 * 下一页
			 * @private
			 */
			_toNext : function () {
				var me = this;

				if ( me.cfg.currPage === me.cfg.countPage ) {
					return false;
				}
				me.store.toNext();
			},

			/**
			 * 首页
			 * @private
			 */
			_toFirst : function () {
				var me = this;

				if ( me.store.start === 0 ) {
					me.store.load();
				}else{
					me.store.toFirst();
				}

			},

			/**
			 * 最后一页
			 * @private
			 */
			_toEnd : function () {
				var me = this;

				if ( me.cfg.currPage === me.cfg.countPage ) {
					return false;
				}
				me.store.toEnd();
			},

			/**
			 * 自定义分页
			 * @private
			 */
			_toCustPage : function () {
				var me = this;
				var valuecode=$ ( "input.paging-num", me.el ).attr ( "value" );
				var page = parseInt(valuecode);
				page===0&&page++;
				me.store.start = ( page - 1 ) * ( me.store.limit );
				me.store.reload ();
			},

			/**
			 * 刷新
			 * @private
			 */
			_toRefresh : function () {
				var me = this;

				me.store.reload ();
			},

			/**
			 * 刷新
			 * @private
			 * @param {number} limit
			 */
			_refreshByLimit : function ( limit ) {
				var me = this;

				me.store.limit = limit;
				me.store.start = 0;
				me.store.reload ();
			},

			/**
			 * 禁用分页按钮
			 * @private
			 */
			_disAble : function () {
				var me = this;
				var currPage = me.store.getCurrentPage();
				var countPage = me.store.getTotalPage();
				if ( countPage === 0 ) {
					countPage = countPage + 1;
				}
				me.pageFirstEl.removeClass ( "page-first-disable" );
				me.pagePrevEl.removeClass ( "page-prev-disable" );
				me.pageNextEl.removeClass ( "page-next-disable" );
				me.pageLastEl.removeClass ( "page-last-disable" );

				if ( me.store.start === 0 ) {
					me.pageFirstEl.addClass ( "page-first-disable" );

					me.pagePrevEl.addClass ( "page-prev-disable" );

				}
				if ( currPage === countPage ) {
					me.pageNextEl.addClass ( "page-next-disable" );

					me.pageLastEl.addClass ( "page-last-disable" );

				}
			},
			/**
			 * @access private
			 * 禁用所有分页按钮
			 *
			 */
			_disableAllButton : function () {
				var me = this;

				me.pageFirstEl.addClass ( "page-first-disable" );
				me.pagePrevEl.addClass ( "page-prev-disable" );
				me.pageNextEl.addClass ( "page-next-disable" );
				me.pageLastEl.addClass ( "page-last-disable" );
			}
		}
	} );
	FAPUI.register ( "pagingBar", FAPUI.PagingBar );

	return FAPUI.PagingBar;
} );
