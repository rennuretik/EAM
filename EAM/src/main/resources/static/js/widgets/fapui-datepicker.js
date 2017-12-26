/**
 *定义日期FAPUI.Datepicker组件
 *<p>以下代码将演示如何使用Datepicker组件

 new FAPUI.Datepicker({
		renderTo:document.body,
		multiSelected:true,
		initDate:new Date(2012,10-1,28),
		showTime:true,
		//selectDates:[new Date(2012,10-1,20),new Date(2012,10-1,10),new Date(2012,10-1,8),new Date(2012,10-1,2)],
		disableDays:[1,2,3,4,5,6,7,20,21,22,24,31,28],
		minDate:new Date(2012,10-1,20),
		maxDate:new Date(2013,2-1,26)
	});

 *@class FAPUI.Datepicker
 *@extend FAPUI.Component
 */

define ( function ( require, exports, module ) {

	var importcss = "./themes/" + FAPUI.getTheme () + "/css/ui-datepicker.css";

	require.async ( importcss );

	require ( "./fapui-component" );

	require ( "./fapui-date" );

	FAPUI.define ( "FAPUI.Datepicker", {
		extend : "FAPUI.Component",
		props : {

			/**
			 * 是否可多选
			 * @property multiSelected
			 * @type boolean
			 * @default false
			 */
			multiSelected : false,

			/**
			 * 选择的日期
			 * @property selectDates
			 * @type Array
			 * @default []
			 */
			selectDates : [],

			/**
			 * 不可用的日期
			 * @property disableDays
			 * @type Array
			 * @default []
			 */
			disableDays : [],

			/**
			 * 是否显示时分秒
			 * @property showTime
			 * @type boolean
			 * @default false
			 */
			showTime : true,

			/**
			 * 用户指定的当前日期输入框的最小日期
			 * @property minDate
			 * @type Date
			 * @default null
			 */
			minDate : null,

			/**
			 * 用户指定的当前日期输入框的最大日期
			 * @property maxDate
			 * @type Date
			 * @default null
			 */
			maxDate : null
		},
		override : {

			/**
			 * 初始化配置对象
			 * @private
			 */
			initConfig : function () {
				this.callParent ();
				this.addEvents ( "beforeSelectYear", "selectYear", "beforeSelectMonth", "selectMonth",
					"beforeSelectDay", "selectDay", "beforeSelectHour", "selectHour", "beforeSelectMinute",
					"selectMinute", "beforeSelectSecond", "selectSecond", "clear", "close", "confirm", "today" );
				this.tpl = [
					"<div class=\"datepicker-header\">",
					"<a class=\"yearprev\" href=\"javascript:void(0);\" hidefocus=\"true\"></a>",
					"<a class=\"prev\" href=\"javascript:void(0);\" hidefocus=\"true\"></a>",
					"<input class=\"yminput year datepicker-select-input-year\" type=\"text\" ",
					"readonly=\"true\" value=\"${cYear}\"/>",
					"<div class=\"ymtrigger datepicker-select-button-year\"></div>",
					"<div class=\"datepicker-common datepicker-year\" >",
					"<ul class=\"item\">",
					"{@each yArray as y }",
					"<li>${y}</li>", "{@/each}", "</ul>", "</div>",
					"<input class=\"yminput month datepicker-select-input-month\"",
					" type=\"text\" readonly=\"true\" value=\"${cMonth}\"/>",
					"<div class=\"ymtrigger ", "datepicker-select-button-month\"></div>",
					"<div class=\"datepicker-common datepicker-month\">",
					"<ul class=\"item\">", "{@each mArray as m }", "<li>${m}</li>", "{@/each}", "</ul>", "</div>",
					"<a class=\"next\" href=\"javascript:void(0);\" hidefocus=\"true\"></a>",
					"<a class=\"yearnext\" href=\"javascript:void(0);\" hidefocus=\"true\"></a>", "</div>",
					"<div class=\"datepicker-body\">", "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\">",
					"<thead>", "{@each wArray as w}", "<th>${w}</th>", "{@/each}", "</thead>", "<tbody>",
					"<tr><td/><td/><td/><td/><td/><td/><td/></tr>", "<tr><td/><td/><td/><td/><td/><td/><td/></tr>",
					"<tr><td/><td/><td/><td/><td/><td/><td/></tr>", "<tr><td/><td/><td/><td/><td/><td/><td/></tr>",
					"<tr><td/><td/><td/><td/><td/><td/><td/></tr>", "<tr><td/><td/><td/><td/><td/><td/><td/></tr>",
					"</tbody>", "<tfoot>", "{@if showTime===true}", "<tr>", "<td colspan=7>",
					"<div class=\"datepicker-footer\">",
					"<input class=\"hour mdsinput datepicker-select-input-hour\" type=\"text\" ",
					"readonly=\"true\" value=\"${cHour}\" />",
					"<div class=\"mdstrigger datepicker-select-button-hour\"></div>",
					"<div class=\"hms h\">${hn}</div>",
					"<div class=\"datepicker-common datepicker-hour\">", "<ul class=\"item\">", "{@each hArray as h}",
					"<li>${h}</li>", "{@/each}", "</ul>", "</div>",
					"<input class=\"minutes mdsinput datepicker-select-input-minutes\" ",
					"type=\"text\" readonly=\"true\" value=\"${cMinute}\" />",
					"<div class=\"mdstrigger datepicker-select-button-minutes\"></div>",
					"<div class=\"hms m\">${mn}</div>", "<div class=\"datepicker-common datepicker-minutes\">",
					"<ul class=\"item\">", "{@each MArray as M}", "<li>${M}</li>", "{@/each}", "</ul>", "</div>",
					"<input class=\"seconds mdsinput datepicker-select-input-seconds\" type=\"text\" ",
					"readonly=\"true\" value=\"${cSecond}\" />", "<div class=\"mdstrigger datepicker-",
					"select-button-seconds\"></div>", "<div class=\"hms s\">${sn}</div>",
					"<div class=\"datepicker-common datepicker-seconds\">", "<ul class=\"item\">",
					"{@each sArray as s}", "<li>${s}</li>", "{@/each}", "</ul>", "</div>", "</div>", "</td>",
					"</tr>", "{@/if}", "<tr>", "<td colspan=\"7\" class=\"buttons\">",
					"<div class=\"datepicker-buttons\">",
					"<a href=\"javascript:void(0);\" class=\"clear-btn\"  hidefocus=\"true\"><span>${clear}",
					"</span></a>", "<span class=\"separator\"></span>",
					"<a href=\"javascript:void(0);\" class=\"confirm-btn\" hidefocus=\"true\"><span>${cf}",
					"</span></a>", "<span class=\"separator\"></span>",
					"<a href=\"javascript:void(0);\" class=\"today-btn\"  hidefocus=\"true\">",
					"<span>${today}</span></a>", "<span class=\"separator\"></span>",
					"<a href=\"javascript:void(0);\" class=\"close-btn\"  hidefocus=\"true\">",
					"<span>${clo}</span></a>", "</div>", "</td>", "</tr>", "</tfoot>",
					"</table>", "</div>"
				].join ( "" );
			},

			/**
			 * 渲染组件至目标容器
			 * @private
			 * @param {Object} el 目标容器
			 */
			render : function ( el ) {

				var me = this;

				me.callParent ( [ el ] );
				/*				me.initDate = me.initDate||new Date();
				 var initData = me._getInitData(me.initDate);
				 var tmp = juicer(me.tpl,initData);
				 me.el.append(tmp);
				 me._updateState(date);*/

			},
			/**
			 *
			 */
			createDom : function () {

				var me = this;

				me.id = me.id || FAPUI.getId ();
				me.initDate = me.initDate || new Date ();
				var initData = me._getInitData ( me.initDate );

				var html = [];

				html.push ( "<div class=\"datepicker-container\" id=\"" + me.id + "\">" );

				var tmp = juicer ( me.tpl, initData );

				html.push ( tmp );
				html.push ( "</div>" );
				return html.join ( "" );
			},
			/**
			 * 事件初使化
			 * @private
			 */
			bindEvent : function () {

				var me = this;

				me.el = me.el || $ ( "#" + me.id );
				me._updateState ( me.initDate );
				me.el.find ( "a.prev" ).click ( me._toPrevMonth.createDelegate ( me ) );
				me.el.find ( "a.next" ).click ( me._toNextMonth.createDelegate ( me ) );
				me.el.find ( "a.yearprev" ).click ( me._toPrevYear.createDelegate ( me ) );
				me.el.find ( "a.yearnext" ).click ( me._toNextYear.createDelegate ( me ) );

				me.el.find ( "div.datepicker-select-button-year,input.year" ).click ( me._onYearTrigger.createDelegate ( me ) );
				me.el.find ( "div.datepicker-year ul.item li" ).click ( function () {
					var oYear = Number ( me.el.find ( "input.year" ).val () );

					var year = Number ( $ ( this ).html () );

					if ( me.fireEvent ( "beforeSelectYear", me, oYear, year ) !== false ) {
						me._onSelectYear ( year );
						$ ( this ).addClass ( "item-selected" );
						$ ( this ).siblings ().removeClass ( "item-selected" );
						$ ( this ).parent ().parent ().hide ();
						me.fireEvent ( "selectYear", me, oYear, year );
					}
				} ).hover ( function () {
					$ ( this ).addClass ( "item-hover" );
					$ ( this ).siblings ().removeClass ( "item-hover" );
				}, function () {
					$ ( this ).removeClass ( "item-hover" );
				} );
				me.el.find ( "div.datepicker-select-button-month,input.month" ).click (
					me._onMonthTrigger.createDelegate ( me )
				);
				me.el.find ( "div.datepicker-month ul.item li" ).click ( function () {
					var oMonth = Number ( me.el.find ( "input.month" ).val () );

					var month = Number ( $ ( this ).html () );

					if ( me.fireEvent ( "beforeSelectMonth", me, oMonth, month ) !== false ) {
						me._onSelectMonth ( month );
						$ ( this ).addClass ( "item-selected" );
						$ ( this ).siblings ().removeClass ( "item-selected" );
						$ ( this ).parent ().parent ().hide ();
						me.fireEvent ( "selectMonth", me, oMonth, month );
					}
				} );

				me.el.find ( "div.datepicker-select-button-hour,input.hour" ).click ( me._onHourTrigger.createDelegate ( me ) );
				me.el.find ( "div.datepicker-hour ul.item li" ).click ( function () {
					var oHour = Number ( me.el.find ( "input.hour" ).val () );

					var hour = Number ( $ ( this ).html () );

					if ( me.fireEvent ( "beforeSelectHour", me, oHour, hour ) !== false ) {
						me._onSelectHour ( hour );
						$ ( this ).addClass ( "item-selected" );
						$ ( this ).siblings ().removeClass ( "item-selected" );
						$ ( this ).parent ().parent ().hide ();
						me.fireEvent ( "selectHour", me, oHour, hour );
					}
				} );

				me.el.find ( "div.datepicker-select-button-minutes,input.minutes" ).click (
					me._onMinutesTrigger.createDelegate ( me )
				);
				me.el.find ( "div.datepicker-minutes ul.item li" ).click ( function () {
					var oMinute = Number ( me.el.find ( "input.minutes" ).val () );

					var minute = Number ( $ ( this ).html () );

					if ( me.fireEvent ( "beforeSelectMinute", me, oMinute, minute ) !== false ) {
						me._onSelectMinutes ( minute );
						$ ( this ).addClass ( "item-selected" );
						$ ( this ).siblings ().removeClass ( "item-selected" );
						$ ( this ).parent ().parent ().hide ();
						me.fireEvent ( "selectMinute", me, oMinute, minute );
					}
				} );

				me.el.find ( "div.datepicker-select-button-seconds,input.seconds" ).click ( me._onSecondsTrigger.createDelegate ( me ) );
				me.el.find ( "div.datepicker-seconds ul.item li" ).click ( function () {
					var oSecond = Number ( me.el.find ( "input.seconds" ).val () );

					var second = Number ( $ ( this ).html () );

					if ( me.fireEvent ( "beforeSelectSecond", me, oSecond, second ) !== false ) {
						me._onSelectSeconds ( second );
						$ ( this ).addClass ( "item-selected" );
						$ ( this ).siblings ().removeClass ( "item-selected" );
						$ ( this ).parent ().parent ().hide ();
						me.fireEvent ( "selectSecond", me, oSecond, second );
					}
				} );

				var tds = me.el.find ( "div.datepicker-body tbody td" );

				tds.click ( function ( event ) {
					if ( ! $ ( this ).hasClass ( "special" ) ) {
						var oDays = me.selectDates.copy ();

						var day = Number ( $ ( this ).text () );

						if ( me.fireEvent ( "beforeSelectDay", me, oDays, me._createSelectDate ( day ) ) !== false ) {
							if ( ! me.multiSelected && event.ctrlKey || event.shiftKey ) {
								tds.removeClass ( "selected" );
								me.selectDates = [];
							}
							$ ( this ).addClass ( "selected" );
							$ ( this ).siblings().removeClass ( "selected" );
							$ ( this ).parents().siblings ().children().removeClass ( "selected" );
							me._onSelectDay ( day );
							me.fireEvent ( "selectDay", me, oDays, me._createSelectDate ( day ) );
							oDays = null;
						}

					}
				} ).hover ( function () {
					$ ( this ).addClass ( "hover" );
				}, function () {
					$ ( this ).removeClass ( "hover" );
				} );

				me.el.find ( "div.datepicker-buttons a.clear-btn" ).click ( function () {
					me.fireEvent ( "clear", me );
					me.el.hide ();
				} );
				me.el.find ( "div.datepicker-buttons a.confirm-btn" ).click ( function () {
					me.fireEvent ( "confirm", me );
					me.el.hide ();
				} );
				me.el.find ( "div.datepicker-buttons a.close-btn" ).click ( function () {
					me.fireEvent ( "close", me );
					me.el.hide ();
				} );
				me.el.find ( "div.datepicker-buttons a.today-btn" ).click ( function () {
					me.fireEvent ( "today", me );
					me._updateState ( new Date () );
					me.el.hide ();
				} );
			},
			/**
			 * 点击上一月按钮
			 * @private
			 */
			_toPrevMonth : function () {

				var me = this;

				if ( me.minDate && Date.maxDateTime ( me.cYear, me.cMonth - 1 ) < me.minDate ) {
					return;
				}
				if ( me.cMonth - 1 === 0 ) {
					me.cMonth = 12;
					me.cYear --;
					me._updateYearState ();
				} else {
					me.cMonth --;
					me._updateMonthState ();
				}
			},

			/**
			 * 点击下一月按钮
			 * @private
			 */
			_toNextMonth : function () {

				var me = this;

				if ( me.minDate && Date.minDateTime ( me.cYear, me.cMonth + 1 ) > me.maxDate ) {
					return;
				}
				if ( me.cMonth + 1 > 12 ) {
					me.cMonth = 1;
					me.cYear ++;
					me._updateYearState ();
				} else {
					me.cMonth ++;
					me._updateMonthState ();
				}
			},
			/**
			 * 点击上一年按钮
			 * @private
			 */
			_toPrevYear : function () {

				var me = this;

				if ( me.minDate && Date.maxDateTime ( me.cYear, me.cMonth - 1 ) < me.minDate ) {
					return;
				}

					me.cYear --;
					me._updateYearState ();
			},
			/**
			 * 点击下一月年按钮
			 * @private
			 */
			_toNextYear : function () {

				var me = this;

				if ( me.minDate && Date.minDateTime ( me.cYear, me.cMonth + 1 ) > me.maxDate ) {
					return;
				}

					me.cYear ++;
					me._updateYearState ();
			},
			/**
			 * 年份下拉框按钮
			 * @private
			 */
			_onYearTrigger : function () {

				var me = this;

				this._hideSelect ( [ "month", "hour", "minutes", "seconds" ] );

				var list = me.el.find ( "div.datepicker-year" );
				if ( list.is ( ":hidden" ) ) {
					list.show ();
				} else {
					list.hide ();
				}
			},
			/**
			 * 月份下拉框按钮
			 * @private
			 */
			_onMonthTrigger : function () {

				var me = this;

				this._hideSelect ( [ "year", "hour", "minutes", "seconds" ] );

				var list = me.el.find ( "div.datepicker-month" );

				if ( list.is ( ":hidden" ) ) {
					list.show ();
				} else {
					list.hide ();
				}
			},
			/**
			 * 小时下拉按钮
			 * @private
			 */
			_onHourTrigger : function () {

				var me = this;

				this._hideSelect ( [ "year", "month", "minutes", "seconds" ] );

				var list = me.el.find ( "div.datepicker-hour" );

				if ( list.is ( ":hidden" ) ) {
					list.show ();
				} else {
					list.hide ();
				}
			},
			/**
			 * 分钟下拉按钮
			 * @private
			 */
			_onMinutesTrigger : function () {

				var me = this;

				this._hideSelect ( [ "year", "month", "hour", "seconds" ] );

				var list = me.el.find ( "div.datepicker-minutes" );

				if ( list.is ( ":hidden" ) ) {
					list.show ();
				} else {
					list.hide ();
				}
			},
			/**
			 * 秒下拉按钮
			 * @private
			 */
			_onSecondsTrigger : function () {

				var me = this;

				this._hideSelect ( [ "year", "month", "hour", "minutes" ] );

				var list = me.el.find ( "div.datepicker-seconds" );

				if ( list.is ( ":hidden" ) ) {
					list.show ();
				} else {
					list.hide ();
				}
			},
			/**
			 * 年份选择
			 * @private
			 * @param {*} y 年份
			 */
			_onSelectYear : function ( y ) {

				var me = this;

				if ( me.minDate && Date.maxDateTime ( y,
						me.cMonth ) < me.minDate || me.maxDate && Date.minDateTime ( y,
						me.cMonth ) > me.maxDate ) {
					return;
				}
				me.cYear = y;
				me._updateYearState ();
			},
			/**
			 * 月份选择
			 * @private
			 * @param {*} m 月份
			 */
			_onSelectMonth : function ( m ) {

				var me = this;

				if ( me.minDate && Date.maxDateTime ( me.cYear,
						m ) < me.minDate || me.maxDate && Date.minDateTime ( me.cYear, m ) > me.maxDate ) {
					return;
				}
				me.cMonth = m;
				me._updateMonthState ();
			},
			/**
			 * 日期选择
			 * @private
			 */
			_onSelectDay : function ( d ) {

				var me = this;

				me.cDay = d;
				me.selectDates.push ( me._createSelectDate ( d ) );
			},
			/**
			 * 小时选择
			 * @private
			 * @param {*} h 小时
			 */
			_onSelectHour : function ( h ) {

				var me = this;

				me.cHour = h;
				me._updateHourState ();
			},
			/**
			 * 分钟选择
			 * @private
			 * @param {*} m 分钟
			 */
			_onSelectMinutes : function ( m ) {

				var me = this;

				me.cMinute = m;
				me._updateMinuteState ();
			},

			/**
			 * 秒选择
			 * @private
			 * @param {*} s 秒
			 */
			_onSelectSeconds : function ( s ) {

				var me = this;

				me.cSecond = s;
				me._updateSecondState ();
			},
			/**
			 * 模板的初始数据
			 * @private
			 * @param {*} date    日期时间
			 * @returns {*}
			 */
			_getInitData : function ( date ) {
				var me=this;
				var now = date;
				var cYear = now.getFullYear ();	//当前年份
				var cMonth = now.getMonth () + 1;	//当前月份
				var cDay = now.getDate ();
				var cHour = now.getHours ();
				var cMinute = now.getMinutes ();
				var cSecond = now.getSeconds ();
				var sY=me.minDate?me.minDate.getFullYear ():cYear-100;
				var eY = me.maxDate?me.maxDate.getFullYear ()+1:cYear+100;	//结束年份
				var yArray = [];
				var mArray = [ "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12" ];
				var wArray = [ "日", "一", "二", "三", "四", "五", "六" ];
				var hn = "时";
				var mn = "分";
				var sn = "秒";
				var hArray = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23 ];

				var MArray = [];
				var sArray = [];

				for ( var i = sY; i < eY; i ++ ) {
					yArray.push ( i );
				}
				for ( var i = 0; i < 60; i ++ ) {
					MArray.push ( i );
					sArray.push ( i );
				}
				var clear = "清理";
				var today = "今天";
				var confirm = "确定";

				var close = "关闭";

				return {
					"cYear" : cYear,
					"cMonth" : cMonth < 10 ? "0" + cMonth : cMonth,
					"cDay" : cDay,
					"cHour" : cHour,
					"cMinute" : cMinute,
					"cSecond" : cSecond,
					"yArray" : yArray,
					"mArray" : mArray,
					"wArray" : wArray,
					"hArray" : hArray,
					"MArray" : MArray,
					"sArray" : sArray,
					"hn" : hn,
					"mn" : mn,
					"sn" : sn,
					"clear" : clear,
					"today" : today,
					"cf" : confirm,
					"showTime" : this.showTime,
					"clo" : close
				};
			},
			/**
			 * 指定年月的天数信息,共42天,如果有包含前月后几天,后月前几天的信息
			 * @private
			 * @param {*} y        年
			 * @param {*} M        月
			 * @param {*}d        日
			 * @returns {Array}
			 */
			_getDayArray : function ( y, M, d ) {
				var me = this;
				var now = new Date ();
				var cYear = now.getFullYear ();	//当前年份
				var cMonth = now.getMonth () + 1;	//当前月份
				var cDay = now.getDate ();	//当前日期

				var minDay = 1;
				var maxDay = Date.maxDay ( y, M );
				var lastMonthMaxDay = Date.maxDay ( M - 1 > 0 ? y : y - 1, M - 1 > 0 ? M - 1 : 12 );

				var dArray = [];

				var minWeekIndex = new Date ( y, M - 1, minDay ).getDay ();

				for ( var i = 1; i <= minWeekIndex; i ++ ) {
					dArray.push ( {
						"day" : lastMonthMaxDay - minWeekIndex + i,
						"clazz" : "special"
					} );
				}
				for ( var i = minDay; i <= maxDay; i ++ ) {
					dArray.push ( {
						"day" : i,
						"clazz" : me._getDayClass ( y, M, i ) +
						cYear === y && cMonth === M && cDay === i ? " today" : ""
					} );
				}

				var i = 1;

				while ( dArray.length <= 42 ) {
					dArray[ dArray.length ] = {
						"day" : i ++,
						"clazz" : "special"
					};
				}
				return dArray;
			},
			/**
			 * 获取日期的样式,special为无效,disableDays、minDate、maxDate属性的判断
			 * @private
			 * @param {*} y    年
			 * @param {*} M    月
			 * @param {*} d    日
			 * @returns {string}
			 */
			_getDayClass : function ( y, M, d ) {
				var me = this;

				var date = new Date ( y, M - 1, d );

				if ( me.minDate ) {
					if ( date < me.minDate ) {
						return "special";
					}
				}
				if ( me.maxDate ) {
					if ( date > me.maxDate ) {
						return "special";
					}
				}
				if ( me.disableDays.exist ( d ) ) {
					return "special";
				}
				if ( me.initDate && me.initDate.getTime () === date.getTime () ) {
					return "selected";
				}
				for ( var i = 0; i < me.selectDates.length; i ++ ) {
					if ( date.getTime () === me.selectDates[ i ].getTime () ) {
						return "selected";
					}
				}
				return "";
			},

			/**
			 * 更新当前的状态
			 * @private
			 * @param {Date} date
			 */
			_updateState : function ( date ) {

				var me = this;

				me.cYear = date.getFullYear ();	//当前年份
				me.cMonth = date.getMonth () + 1;	//当前月份
				me.cDay = date.getDate ();
				me.cHour = date.getHours ();
				me.cMinute = date.getMinutes ();
				me.cSecond = date.getSeconds ();
				me._updateYearState ();
				me._updateTimeState ();
			},
			/**
			 * 更新年份状态,同步更新月,日
			 * @private
			 */
			_updateYearState : function () {

				var me = this;

				me.el.find ( "input.year" ).val ( me.cYear );
				me._updateMonthState ();
			},
			/**
			 * 更新月份状态,同步更新日
			 * @private
			 */
			_updateMonthState : function () {

				var me = this;

				me.el.find ( "input.month" ).val ( me.cMonth < 10 ? "0" + me.cMonth : me.cMonth );
				me._updateDayState ();
			},
			/**
			 * 更新日状态
			 * @private
			 */
			_updateDayState : function () {
				var me = this;

				var dArray = me._getDayArray ( me.cYear, me.cMonth, me.cDay );

				me._updateDayContent ( dArray );
			},
			/**
			 * 更新时间状态
			 * @private
			 */
			_updateTimeState : function () {

				var me = this;

				me._updateHourState ();
				me._updateMinuteState ();
				me._updateSecondState ();
			},
			/**
			 * 更新小时状态
			 * @private
			 */
			_updateHourState : function () {

				var me = this;

				me.el.find ( "input.hour" ).val ( me.cHour < 10 ? "0" + me.cHour : me.cHour );
			},
			/**
			 * 更新分钟状态
			 * @private
			 */
			_updateMinuteState : function () {

				var me = this;

				me.el.find ( "input.minutes" ).val ( me.cMinute < 10 ? "0" + me.cMinute : me.cMinute );
			},
			/**
			 * 更新秒状态
			 * @private
			 */
			_updateSecondState : function () {

				var me = this;

				me.el.find ( "input.seconds" ).val ( me.cSecond < 10 ? "0" + me.cSecond : me.cSecond );
			},
			/**
			 * 更新dom中的日期信息
			 * @private
			 * @param {*} dArray
			 */
			_updateDayContent : function ( dArray ) {
				var me = this;

				var domTds = me.el.find ( "tbody" ).find ( "td" );

				for ( var i = 0; i < domTds.size (); i ++ ) {
					var td = $ ( domTds.get ( i ) );

					var v = dArray[ i ];

					td.removeClass ();
					td.html ( v.day );
					if ( v.clazz ) {
						td.addClass ( v.clazz );
					}
				}
			},

			/**
			 * 创建选择的日期
			 * @private
			 */
			_createSelectDate : function ( d ) {

				var me = this;

				return new Date ( me.cYear, me.cMonth - 1, d, me.cHour, me.cMinute, me.cSecond );
			},

			/**
			 * 设置日期输入框的最小日期
			 * @method setMinDate
			 * @param {Date} d
			 */
			setMinDate : function ( d ) {

				var me = this;

				me.minDate = d;
				me._updateYearState ();
				me._updateTimeState ();
			},

			/**
			 * 设置日期输入框的最大日期
			 * @method setMaxDate
			 * @param {Date} d
			 */
			setMaxDate : function ( d ) {

				var me = this;

				me.maxDate = d;
				me._updateYearState ();
				me._updateTimeState ();
			},

			/**
			 * 获取当前日期时间
			 * @method getCurrentDate
			 * @return {Date} date
			 */
			getCurrentDate : function () {

				var me = this;

				return new Date ( me.cYear, me.cMonth - 1, me.cDay, me.cHour, me.cMinute, me.cSecond );
			},

			/**
			 * 显示日期面板
			 * @method show
			 */
			show : function () {
				this.el.show ();
			},

			/**
			 * 隐藏日期面板
			 * @method hide
			 */
			hide : function () {
				this._hideSelect ( [ "year", "month", "hour", "minutes", "seconds" ] );
				this.el.hide ();
			},

			/**
			 * 是否可见
			 * @private
			 * @return {boolean}
			 */
			isVisiable : function () {
				return this.el.css ( "display" ) !== "none";
			},

			/**
			 * 设置控件相对于某一元素的位置
			 * @method setPosition
			 * @param {number} x
			 * @param {number} y
			 */
			setPosition : function ( x, y ) {
				this.el.offset ( {
					"left" : x,
					"top" : y
				} );
			},

			/**
			 * 创建基础DOM元素
			 * @private
			 */
			createBaseDom : function () {
				return $ ( "</div>" );
			},

			/**
			 * 获取日期面板的高度
			 * @method getHeight
			 * @returns {number} height
			 */
			getHeight : function () {
				return this.el.height ();
			},

			/**
			 * 隐藏指定的下拉列表
			 * @private
			 * @param {Array} list
			 */
			_hideSelect : function ( list ) {

				var me = this;

				if ( FAPUI.isArray ( list ) ) {

					$ ( list ).each ( function () {

						var that = this;

						me.el.find ( "div.datepicker-" + that ).hide ();
					} );
				}
			}
		}
	} );

	return FAPUI.Datepicker;
} );
