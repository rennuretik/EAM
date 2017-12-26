/**
 * 循环进度条
 * @class FAPUI.CycleProgressBar
 * @extend FAPUI.ProgressBar
 * 
 */
define(function(require, exports, module){

	require('./fapui-progressBar');
	
	FAPUI.define('FAPUI.CycleProgressBar', {
		extend : 'FAPUI.ProgressBar',
		props : {
			/**
			 * 百分比步进
			 * @property  percentageStep
			 * @type Number
			 * @required
			 * @default 5 
			 */
			percentageStep:5,
			/**
			 * 时间步进,单位ms
			 * @property  timeStep
			 * @type Number
			 * @required
			 * @default 200 
			 */
			timeStep:200
		},
		override : {
			initConfig:function(){
				this.callParent();
				this.addEvents(
					/**
					 * 开始执行时触发
					 * @event start
					 * @param comp {Object} 进度条组件本身
					 * @param percentage {Number} 当前比例
					 */
					'start',
					/**
					 * 执行结束时触发
					 * @event stop
					 * @param comp {Object} 进度条组件本身
					 * @param percentage {Number} 当前比例
					 */
					'stop'
				);
			},
			/**
	         * 开始执行
	         * @method start
			 * @public
			 */
			start:function(){
				var me = this;
				me._si = setInterval(function(){
					var c = me.curPercentage+me.percentageStep;
					c = c >100 ? 0 : c;
					me.updateProgress(c);
				},me.timeStep);
				
				me.fireEvent('start',me,me.curPercentage);
			},
			/**
	         * 结束执行
	         * @method stop
			 * @public
			 */
			stop:function(){
				var me = this;
				clearInterval(me._si);
				delete me._si;
				me.fireEvent('stop',me,me.curPercentage);
			}
		}
	});
	
	FAPUI.register('cycleprogressbar',FAPUI.CycleProgressBar);

	return FAPUI.CycleProgressBar;
});