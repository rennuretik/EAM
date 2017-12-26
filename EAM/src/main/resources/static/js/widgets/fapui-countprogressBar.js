/**
 * 指定次数内完成的进度条
 * @class FAPUI.CountProgressBar
 * @extend FAPUI.CycleProgressBar
 * 
 */
define(function(require, exports, module){

	require('./fapui-cycleprogressBar');
	
	FAPUI.define('FAPUI.CountProgressBar', {
		extend : 'FAPUI.CycleProgressBar',
		props : {
			/**
			 * 指定次数内完成
			 * @property  count
			 * @type Number
			 * @required
			 * @default 200 
			 */
			count:200,
			/**
			 * 当前执行的次数
			 * @property  currentIndex
			 * @type Number
			 * @required
			 * @default 0 
			 */
			currentIndex:0,
			/**
			 * 处理完成后显示的信息
			 * @property  completeText
			 * @type String
			 * @required
			 * @default 处理完成 
			 */
			completeText:'处理完成'
		},
		override : {
			initConfig:function(){
				this.callParent();
				this.addEvents(
					/**
					 * 更新进度条比例时触发
					 * @event progress
					 * @param comp {Object} ProgressBar组件本身
					 * @param percentage {Number} 当前比例
					 * @param currentIndex {Number} 当时执行的条数
					 * @param count {Number} 总数
					 */
					'progress',
					/**
					 * 执行完成时触发
					 * @event complete
					 * @param comp {Object} 进度条组件本身
					 * @param percentage {Number} 当前比例
					 */
					'complete'
				);
			},
			/**
	         * 开始执行
	         * @method start
			 * @public
			 */
			start:function(){
				var me = this;
				var _p = 100/me.count;
				me._si = setInterval(function(){
					me.currentIndex++;
					var c = _p*me.currentIndex;
					me.updateProgress(c,me.currentIndex,me.count);
					if(c==100){
						me.complete();
					}
				},me.timeStep);				
				me.fireEvent('start',me,me.curPercentage);
			},
			/**
	         * 更新进度条比例
	         * @method updateProgress
			 * @public
			 * @param {Number} percentage(比例0~100)
			 * @param {Number} currentIndex
			 * @param {Number} count
			 */
			updateProgress:function(percentage,currentIndex,count){
				var me = this;
				currentIndex = currentIndex || me.currentIndex;
				count = count || me.count;
				me.curPercentage = percentage;
				var progressBarStatus = me.el.find('.progressBarStatus');
				progressBarStatus.width(me.curPercentage+"%");
				me.fireEvent('progress',me,me.curPercentage,currentIndex,count);
			},
			/**
	         * 完成执行
	         * @method complete
			 * @public
			 */
			complete:function(){
				var me = this;
				clearInterval(me._si);
				delete me._si;
				me.updateProgress(100);
				me.updateProcessText(me.completeText);
				me.fireEvent('complete',me,me.curPercentage);
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
	
	FAPUI.register('countprogressbar',FAPUI.CountProgressBar);

	return FAPUI.CountProgressBar;
});