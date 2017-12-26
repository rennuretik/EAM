/**
 * 指定时间内完成的进度条
 * @class FAPUI.TimeProgressBar
 * @extends FAPUI.CycleProgressBar
 *
 */
define ( function ( require, exports, module ) {

	require ( "./fapui-cycleprogressBar" );

	FAPUI.define ( "FAPUI.TimeProgressBar", {
		extend : "FAPUI.CycleProgressBar", props : {
			/**
			 * 指定时间内完成 单位ms
			 * @property  time
			 * @type Number
			 * @default 1000
			 */
			time : 1000, /**
			 * 处理完成后显示的信息
			 * @property  completeText
			 * @type String
			 * @default 处理完成
			 */
			completeText : "处理完成"
		}, override : {
			/**
			 * initConfig
			 */
			initConfig : function () {
				this.callParent ();
				this.addEvents ( /**
					 * 执行完成时触发
					 * @event complete
					 * @param comp {Object} 进度条组件本身
					 * @param percentage {Number} 当前比例
					 */
					"complete" );
			}, /**
			 * 开始执行
			 * @method start
			 * @public
			 */
			start : function () {
				var me = this;
				var count = 100 % me.percentageStep == 0 ? 100 / me.percentageStep : 100 / me.percentageStep + 1;
				var timeStep = me.time % count == 0 ? me.time / count : me.time / count + 1;

				me._si = setInterval ( function () {
					var c = me.curPercentage + me.percentageStep;

					c = c >= 100 ? 100 : c;
					me.updateProgress ( c );
					if ( c == 100 ) {
						me.complete ();
					}
				}, timeStep );
				me.fireEvent ( "start", me, me.curPercentage );
			}, /**
			 * 完成执行
			 * @method complete
			 * @public
			 */
			complete : function () {
				var me = this;

				clearInterval ( me._si );
				delete me._si;
				me.updateProgress ( 100 );
				me.updateProcessText ( me.completeText );
				me.fireEvent ( "complete", me, me.curPercentage );
			}, /**
			 * 结束执行
			 * @method stop
			 * @public
			 */
			stop : function () {
				var me = this;

				clearInterval ( me._si );
				delete me._si;
				me.fireEvent ( "stop", me, me.curPercentage );
			}
		}
	} );

	FAPUI.register ( "timeprogressbar", FAPUI.TimeProgressBar );

	return FAPUI.TimeProgressBar;
} );