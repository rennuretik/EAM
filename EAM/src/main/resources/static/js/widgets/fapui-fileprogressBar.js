/**
 * 文件上传进度条
 * @class FAPUI.FileProgressBar
 * @extend FAPUI.ProgressBar
 *
 */
define ( function ( require, exports, module ) {

	var importcss = "./themes/" + FAPUI.getTheme () + "/css/ui-progressBar.css"
	require.async ( importcss );

	require ( "./fapui-progressBar" );

	FAPUI.define ( "FAPUI.FileProgressBar", {
		extend : "FAPUI.ProgressBar",
		props : {
			/**
			 * 文件名
			 * @property  fileName
			 * @type String
			 * @required
			 * @default ''
			 */
			fileName : "",
			/**
			 * 文件大小,单位byte
			 * @property  fileSize
			 * @type Number
			 * @required
			 * @default 0
			 */
			fileSize : 0,
			/**
			 * 上传速度,单位bps
			 * @property  speed
			 * @type Number
			 * @required
			 * @default 0
			 */
			speed : 0,
			/**
			 * 当前上传比例
			 * @property  curPercentage
			 * @type Number
			 * @required
			 * @default 0
			 */
			curPercentage : 0
		},
		override : {
			initConfig : function () {
				this.callParent ();
				this.initCfg = {};
				FAPUI.apply ( this.initCfg, this );
				FAPUI.apply ( this.initCfg, this._convertSize ( this.fileSize ) );
				FAPUI.apply ( this.initCfg, this._convertSpeed ( this.speed ) );

				this.addEvents ( /**
					 * 开始执行时触发
					 * @event start
					 * @param comp {Object} ProgressBar组件本身
					 * @param percentage {Number} 当前比例
					 */
					"start", /**
					 * 结束时触发
					 * @event complete
					 * @param comp {Object} ProgressBar组件本身
					 * @param percentage {Number} 当前比例
					 */
					"complete", /**
					 * 错误时触发
					 * @event error
					 * @param comp {Object} ProgressBar组件本身
					 * @param percentage {Number} 当前比例
					 */
					"error" );
				this.tpl = [ "<div class=\"progressBarStatus\">&nbsp;</div>", "<div class=\"progressBarText\">", "<div class=\"fileName\">${fileName}</div>", "<div class=\"fileSize\">${_fileSize}${_sizeUnit}</div>", "<div class=\"fileSpeed\">${_speed}${_speedUnit}</div>", "<a class=\"progressBar-btn-cancel\"></a>", "</div>" ].join ( "" );
			},
			/**
			 * 事件绑定
			 */
			bindEvent : function () {
				var me = this;
				var cancelEl = me.el.find ( ".progressBar-btn-cancel" );
				cancelEl.click ( function () {
					me.destroy ();
				} );
			},
			/**
			 * 大小转换 字节转换成 Kb/Mb/Gb
			 * @method _convertSize
			 * @private
			 * @param size    源大小 byte
			 * @returns
			 */
			_convertSize : function ( size ) {
				if ( size > 1073741824 ) {
					return {
						_fileSize : Math.roundEx ( size / 1073741824, 2 ),
						_sizeUnit : "GB"
					};
				} else if ( size > 1048576 ) {
					return {
						_fileSize : Math.roundEx ( size / 1048576, 2 ),
						_sizeUnit : "MB"
					};
				} else if ( size > 1024 ) {
					return {
						_fileSize : Math.roundEx ( size / 1024, 2 ),
						_sizeUnit : "KB"
					};
				} else {
					return {
						_fileSize : size,
						_sizeUnit : "bytes"
					};
				}
			},
			/**
			 * 速度转换 速度转换成 Kbs/Mbs/Gbs
			 * @method _convertSpeed
			 * @private
			 * @param speed    源速度 bs
			 * @returns
			 */
			_convertSpeed : function ( speed ) {
				if ( speed > 1073741824 ) {
					return {
						_speed : Math.roundEx ( speed / 1073741824, 2 ),
						_speedUnit : "Gbps"
					};
				} else if ( speed > 1048576 ) {
					return {
						_speed : Math.roundEx ( speed / 1048576, 2 ),
						_speedUnit : "Mbps"
					};
				} else if ( speed > 1024 ) {
					return {
						_speed : Math.roundEx ( speed / 1024, 2 ),
						_speedUnit : "Kbps"
					};
				} else {
					return {
						_speed : speed,
						_speedUnit : "bps"
					};
				}
			},
			/**
			 * 更新文件名
			 * @method updateFileName
			 * @public
			 * @param fileName {String} 文件名
			 */
			updateFileName : function ( fileName ) {
				var me = this;
				me.fileName = fileName;
				var fileNameEl = me.el.find ( ".fileName" );
				fileNameEl.html ( fileName );
			},
			/**
			 * 更新文件大小
			 * @method updateFileSize
			 * @param fileSize {Number}
			 */
			updateFileSize : function ( fileSize ) {
				var me = this;
				me.fileSize = fileSize || 0;
				var fileSizeEl = me.el.find ( ".fileSize" );
				var o = me._convertSize ( me.fileSize );
				fileSizeEl.html ( o._fileSize + o._sizeUnit );
			},
			/**
			 * 更新速度
			 * @method updateFileSpeed
			 * @param speed {Number} 速度
			 */
			updateFileSpeed : function ( speed ) {
				var me = this;
				me.speed = speed || 0;
				var fileSpeedEl = me.el.find ( ".fileSpeed" );
				var o = me._convertSpeed ( me.speed );
				fileSpeedEl.html ( o._speed + o._speedUnit );
			},
			/**
			 * 更新进度条
			 * @method updateProgress
			 * @param percentage {Number} 值0~100
			 */
			updateProgress : function ( percentage ) {
				var me = this;
				me.curPercentage = percentage || 0;
				var progressBarStatus = me.el.find ( ".progressBarStatus" );
				progressBarStatus.width ( me.curPercentage + "%" );
				progressBarStatus.removeClass ( "error" );
				//console.log(percentage);
				me.fireEvent ( "progress", me, me.curPercentage );
			},
			updateProcessText : function ( text ) {
				/*				var me = this;
				 me.progressText = text;
				 var progressBarText = me.el.find('.progressBarText');
				 progressBarText.html(text);*/
			},
			/**
			 * 重置进度条状态
			 * @method resetStatus
			 */
			resetStatus : function () {
				var me = this;
				me.updateProgress ( me.initCfg.curPercentage );
				me.updateFileName ( me.initCfg.fileName );
				me.updateFileSize ( me.initCfg.fileSize );
				me.updateFileSpeed ( me.initCfg.speed );
			},
			/**
			 * 完成进度条
			 * @method complete
			 *
			 */
			complete : function () {
				var me = this;
				me.updateProgress ( 100 );
				me.fireEvent ( "complete", me, me.curPercentage );
			},
			/**
			 * 使进度条显示错误样式
			 * @method error
			 */
			error : function () {
				var me = this;
				var progressBarStatus = me.el.find ( ".progressBarStatus" );
				me.updateProgress ( 100 );
				progressBarStatus.addClass ( "error" );
				me.fireEvent ( "error", me );
			}
		}
	} );

	FAPUI.register ( "fileprogressbar", FAPUI.FileProgressBar );

	return FAPUI.FileProgressBar;
} );
