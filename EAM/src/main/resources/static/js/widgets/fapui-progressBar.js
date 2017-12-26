/**
 * 基本进度条
 * @class FAPUI.ProgressBar
 * @extend FAPUI.Component
 *
 */
define ( function ( require, exports, module ) {

	var importcss = "./themes/" + FAPUI.getTheme () + "/css/ui-progressBar.css"

	require.async ( importcss );

	require ( "./fapui-component" );

	FAPUI.define ( "FAPUI.ProgressBar", {
		extend : "FAPUI.Component",
		props : {
			/**
			 * 进度条上显示文本
			 * @property  progressText
			 * @type String
			 * @required
			 * @default ''
			 */
			progressText : "",
			/**
			 * 当前显示比例,范围:0~100
			 * @property  curPercentage
			 * @type Number
			 * @default 0
			 */
			curPercentage : 0
		},
		override : {
			initConfig : function () {
				var me = this;
				this.callParent ();
				this.initCfg = {};
				FAPUI.apply ( this.initCfg, this );
				this.addEvents ( //'start',
					//'complete',
					/**
					 * 更新进度条比例时触发
					 * @event progress
					 * @param comp {Object} ProgressBar组件本身
					 * @param percentage {Number} 当前比例
					 */
					"progress" );
				me.id = me.id || FAPUI.getId ();
				this.tpl = [ "<div id=\"" + me.id + "\" class=\"progressBar\" >", "<div class=\"progressBarStatus\">&nbsp;</div>", "<div class=\"progressBarText\">${progressText}</div>", "</div>" ].join ( "" );
			},
			render : function ( el ) {
				this.callParent ( [ el ] );
			},
			createDom : function () {
				var me = this;
				var tmp = juicer ( me.tpl, me.initCfg );
				return tmp;
			},
			initSize : function () {
				var me = this;
				if ( me.width ) {
					me.setWidth ( me.width );
				}
				if ( me.height ) {
					me.setHeight ( me.height );
				}
			},
			/**
			 * 事件绑定
			 */
			bindEvent : function () {
				var me = this;
				me.el = me.el || $ ( "#" + me.id );
				if ( me.curPercentage > 0 )
					me.updateProgress ( me.curPercentage );
				me.initSize ();
			},

			/**
			 * 更新进度条比例
			 * @method updateProgress
			 * @public
			 * @param {Number} percentage(比例0~100)
			 */
			updateProgress : function ( percentage ) {
				var me = this;
				me.curPercentage = percentage;
				var progressBarStatus = me.el.find ( ".progressBarStatus" );
				progressBarStatus.width ( me.curPercentage + "%" );
				me.fireEvent ( "progress", me, me.curPercentage );
			},
			/**
			 * 更新显示信息
			 * @method updateProcessText
			 * @public
			 * @param {String} text 显示文本
			 */
			updateProcessText : function ( text ) {
				var me = this;
				me.progressText = text;
				var progressBarText = me.el.find ( ".progressBarText" );
				progressBarText.html ( text );
			},
			/**
			 * 重置进度条为初始状态
			 * @method resetStatus
			 * @public
			 */
			resetStatus : function () {
				var me = this;
				me.updateProgress ( me.initCfg.curPercentage );
				me.updateProcessText ( me.initCfg.progressText );
			}
		}
	} );

	FAPUI.register ( "progressbar", FAPUI.ProgressBar );

	return FAPUI.ProgressBar;
} );
