/**
 * UploadField上传组件
 *
 *
 *
 *
 define(function(require) {
	require("jquery");
	require("widgets/fapui-uploadfield");
	$ ( function () {
	var f = new FAPUI.form.UploadField ( {
		upload_url : path + "/uploadController/swfupload",
		file_post_name : "file",
		debug : true,
		width : 600,
		renderTo : "uploadfield"
	} );

	$ ( "#uploadbtn" ).click ( function () {
		f.startUpload ();
	   } );
    } );
} );
 *
 * @class FAPUI.form.UploadField
 * @extend FAPUI.Component
 */

define ( function ( require, exports, module ) {

	var importcss = "./themes/" + FAPUI.getTheme () + "/css/ui-button.css";

	require.async ( importcss );

	require ( "swfupload" );
	require ( "swfupload_queue" );
	require ( "swfupload_speed" );
	require ( "./fapui-component" );
	var FPB = require ( "./fapui-fileprogressBar" );

	FAPUI.define ( "FAPUI.form.UploadField", {

		extend : "FAPUI.Component",

		props : {

			/**
			 * 上传地址
			 * @property  upload_url
			 * @type String
			 * @default null
			 */
			upload_url : null,

			/**
			 * 后台接收所必须的name属性
			 * @property  file_post_name
			 * @type String
			 * @default 'swfile'
			 */
			file_post_name : "swfile",
			/**
			 * post_params定义了一些键/值对，允许在上传每个文件时候捎带地post给服务器。
			 * 这个属性可以用一个js数组对象来赋值。键/值对必须是纯字符串或者数字。（可用js的 typeof（）函数检测）
			 *
			 * @property  post_params
			 * @type Object
			 * @default {}
			 */
			post_params : {},
			/**
			 * 该属性可选值为true和false，设置post_params是否以GET方式发送。如果为false，那么则以POST形式发送
			 *
			 * @property  use_query_string
			 * @type Boolean
			 * @default false
			 */
			use_query_string : false,
			/**
			 * preserve_relative_urls可选值为boolean变量。指示SWFUpload是否将相对URL转换成绝对URL。如果设置为true，那么不会转换。默认为false。即自动转换。
			 *
			 * @property  preserve_relative_urls
			 * @type Boolean
			 * @default false
			 */
			preserve_relative_urls : false,
			/**
			 * 该属性可选值为true和false。
			 * 如果设置为true，当文件对象发生uploadError时（除开fileQueue错误和FILE_CANCELLED错误），该文件对象会被重新插入到文件上传队列的前端，而不是被丢弃。
			 * 如果需要，重新入队的文件可以被再次上传。如果要从上传队列中删除该文件对象，那么必须使用cancelUpload方法。
			 * 跟上传失败关联的所有事件同样会被一一触发，因此将上传失败的文件重新入队可能会和Queue Plugin造成冲突（或者是自动上传整个文件队列的自定义代码）。
			 * 如果代码中调用了startUpload方法自动进行下一个文件的上传，同时也没有采取任何措施让上传失败的文件退出上传队列，
			 * 那么这个重新入队的上传失败的文件又会开始上传，然后又会失败，重新入队，重新上传...，进入了无止境的循环。
			 *
			 * @property  requeue_on_error
			 * @type Boolean
			 * @default false
			 */
			requeue_on_error : false,
			/**
			 * 该数组可自定义触发success事件的HTTP状态值。200的状态值始终会触发success，并且只有200的状态会提供serverData。
			 * 当接受一个200以外的HTTP状态值时，服务端不需要返回内容。
			 *
			 * @property  http_success
			 * @type Array
			 * @default []
			 */
			http_success : [],

			/**
			 * assume_success_timeout设定SWFUpload将等待多少秒来检测服务器响应，超时将强制触发上传成功 （uploadSuccess）事件。
			 * 这个属性是为了在 Flash Player的bug下正常工作。避免长时间的等待服务器响应，同时解决flash player在mac操作系统下无法使服务器返回内容的bug。
			 * flash在最后一个uploadProgress事件被触发30秒后将忽略服务器的响应而强制触发上传成功事件。
			 * 如果assume_success_timeout被设置为0，将禁用这个特性。 SWFUpload将长时间等待 Flash Player来触发 uploadSuccess事件.
			 *
			 * @property  assume_success_timeout
			 * @type Number
			 * @default 0
			 */
			assume_success_timeout : 0,

			/**
			 * 设置文件选择对话框的文件类型过滤规则，该属性接收的是以分号分隔的文件类型扩展名，例如“ *.jpg;*.gif”，则只允许用户在文件选择对话框中可见并可选jpg和gif类型的文件。
			 * 默认接收所有类型的文件。
			 * 提醒：该设置只是针对客户端浏览器的过滤，对服务端的文件处理中的文件类型过滤没有任何限制，如果你需要做严格的文件过滤，那么服务端同样需要程序检测。
			 *
			 * @property  file_types
			 * @type String
			 * @default *.*
			 */
			file_types : "*.*",

			/**
			 * 设置文件选择对话框中显示给用户的文件描述。
			 *
			 * @property  file_types_description
			 * @type String
			 * @default 全部文件
			 */
			file_types_description : "全部文件",

			/**
			 * 设置文件选择对话框的文件大小过滤规则，该属性可接收一个带单位的数值，可用的单位有B,KB,MB,GB。如果忽略了单位，那么默认使用KB。特殊值0表示文件大小无限制。
			 * 提醒：该设置只对客户端的浏览器有效，对服务端的文件处理没有任何限制，如果你需要做严格文件过滤，那么服务端同样需要程序处理。
			 *
			 * @property  file_size_limit
			 * @type String|Number
			 * @default 0
			 */
			file_size_limit : 0,

			/**
			 * 设置SWFUpload实例允许上传的最多文件数量，同时也是设置对象中file_queue_limit属性的上限。
			 * 一旦用户已经上传成功或者添加文件到队列达到上最大数量，那么就不能继续添加文件了。
			 * 特殊值0表示允许上传的数量无限制。
			 * 只有上传成功（上传触发了uploadSuccess事件）的文件才会在上传数量限制中记数。
			 * 使用setStats方法可以修改成功上传的文件数量。
			 * 注意：该值不能跨页面使用，当页面刷新以后该值也被重置。
			 * 严格的文件上传数量限制应该由服务端来检测、管理。
			 *
			 * @property  file_upload_limit
			 * @type Number
			 * @default 0
			 */
			file_upload_limit : 0,

			/**
			 * 设置文件上传队列中等待文件的最大数量限制。
			 * 当一个文件被成功上传，出错，或者被退出上传时，如果文件队列中文件数量还没有达到上限，那么可以继续添加新的文件入队，以顶替该文件在文件上传队列中的位置。
			 * 如果允许上传的文件上限（file_upload_limit）或者剩余的允许文件上传数量小于文件队列上限（file_queue_limit），那么该值将采用这个更小的值。
			 *
			 * @property  file_queue_limit
			 * @type Number
			 * @default 0
			 */
			file_queue_limit : 0,

			/**
			 * 该布尔值设置是否在Flash URL后添加一个随机值，用来防止浏览器缓存了该SWF影片。
			 * 这是为了解决一些基于IE-engine的浏览器上的出现一个BUG。
			 *
			 * 提醒：SWFUpload是直接在flash_url后添加了一个swfuploadrnd的随机参数。如果你给定的flash_url中已经存在了GET类型的参数，那么就会出现两个问号连接符导致错误。
			 *
			 * @property  prevent_swf_caching
			 * @type Boolean
			 * @default true
			 */
			prevent_swf_caching : true,

			/**
			 * 该值是布尔类型，设置debug事件是否被触发。
			 *
			 * 注意：SWFUpload代码中是将此变量和字符串true做的恒等判断，因此它只认定true为DEBUG模式开启，
			 * 如果设置为1，虽然JS认定是开启模式，并且在初始化完毕后会有生成Debug Console，但后续操作中FLASH不会输出调试信息。
			 *
			 * @property  debug
			 * @type Boolean
			 * @default false
			 */
			debug : false,

			/**
			 * 该布尔值设置Flash Button是否是禁用状态。当它处于禁用状态的时候，点击不会执行任何操作。
			 *
			 * @property  debug
			 * @type Boolean
			 * @default false
			 */
			button_disabled : false,

			/**
			 * 上传按钮文本
			 *
			 * @property  button_text
			 * @type String
			 * @default 选择文件
			 */
			button_text : "选择文件",

			/**
			 * 多文件上传时,是否连续执行
			 *
			 * @property  autoContinue
			 * @type Boolean
			 * @default true
			 */
			autoContinue : true,

			/**
			 * 选择完文件后是否自动开始上传
			 *
			 * @property  autoStart
			 * @type Boolean
			 * @default false
			 */
			autoStart : false,

			/**
			 * 输入框是否禁用
			 * @property  disabled
			 * @type boolean
			 * @default false
			 */
			disabled : false,

			/**
			 * @private
			 * @type boolean
			 * @default true
			 */
			isField : true
		},

		override : {

			/**
			 * 初始化配置项
			 * @private
			 */
			initConfig : function () {
				var me = this;

				me.callParent ();

				me.addEvents ( /**
					 * 此事件在selectFile或者selectFiles调用后，文件选择对话框显示之前触发。
					 * 只能同时存在一个文件对话框。但是，这个事件处理函数将不被执行，直到文件选择对话框被关闭
					 *
					 * @event fileDialogStart
					 * @param comp {Object} UploadField组件本身
					 *
					 */
					"fileDialogStart",

					/**
					 * 当选择好文件，文件选择对话框关闭消失时，如果选择的文件成功加入待上传队列，那么针对每个成功加入的文件都会触发一次该事件（N个文件成功加入队列，就触发N次此事件）。
					 * @event fileQueued
					 * @param comp {Object} UploadField组件本身
					 * @param file {Object} 选择的文件
					 */
					"fileQueued",

					/**
					 * 当选择文件对话框关闭时，如果选择的文件加入到上传队列中失败，那么针对每个出错的文件都会触发一次该事件(此事件和fileQueued事件是二选一触发，文件添加到队列只有两种可能，成功和失败)。
					 * 文件入队出错的原因可能有：1.超过了上传大小限制，2.文件为零字节，3.超过文件队列数量限制，4.允许外的无效文件类型。
					 * message所含的内容如下：
					 * 1.超过了上传大小限制：message=File size exceeds allowed limit.
					 * 2.文件为零字节：message=File is zero bytes and cannot be uploaded.
					 * 3.超过文件队列数量限制：message=int（指你设定的队列大小限制数）
					 * 4.允许外的无效文件类型：message=File is not an allowed file type.
					 *
					 * 具体的出错原因可由error code参数来获取，error code的类型可以查看SWFUpload.QUEUE_ERROR中的定义。
					 * 注意：如果选择入队的文件数量超出了设置中的数量限制，那么所有文件都不入队，此事件只触发一次。
					 * 如果没有超出数目限制，那么会对每个文件进行文件类型和大小的检测，对于不通过的文件触发此事件，通过的文件成功入队。
					 *
					 * @event fileQueueError
					 * @param comp {Object} UploadField组件本身
					 * @param file {Object} 选择的文件
					 * @param errorcode {String} 错误码
					 * @param message {Object} 错误信息
					 */
					"fileQueueError",

					/**
					 * 当选择文件对话框关闭，并且所有选择文件已经处理完成（加入上传队列成功或者失败）时，此事件被触发
					 * 注意：如果你希望文件在选择以后自动上传，那么在这个事件中调用this.startUpload() 是一个不错的选择。
					 * 如果需要更严格的判断，在调用上传之前，可以对入队文件的个数做一个判断，如果大于0，那么可以开始上传。
					 *
					 * @event fileDialogComplete
					 * @param comp {Object} UploadField组件本身
					 * @param fs {Number} 本次选择的文件数
					 * @param fq {Number} 本次选择并进入上传队列的文件数
					 * @param tfq {Number} 上传队列中的文件数
					 */
					"fileDialogComplete",

					/**
					 * 在文件开始向服务端上传之前触发uploadStart事件，这个事件处理函数可以完成上传前的最后验证以及其他你需要的操作，例如添加、修改、删除post数据等。
					 * 在完成最后的操作以后，如果函数返回false，那么这个上传不会被启动，如果返回true或者无返回，那么将正式启动上传。
					 * @event uploadStart
					 * @param comp {Object} UploadField组件本身
					 * @param file {Object} 上传的文件
					 *
					 */
					"uploadStart", /**
					 * uploadProgress事件由flash控件定时触发
					 * 注意: 在Linux下，Flash Player只在整个文件上传完毕以后才触发一次该事件，官方指出这是Linux Flash Player的一个bug，目前SWFpload库无法解决。
					 * @event uploadProgress
					 * @param comp {Object} UploadField组件本身
					 * @param file {Object} 上传的文件
					 * @param bc {Number} 已上传的字节数
					 * @param tb {Number} 总字节数
					 *
					 */
					"uploadProgress", /**
					 * 无论什么时候，只要上传被终止或者没有成功完成，那么uploadError事件都将被触发。
					 * code参数表示了当前错误的类型，更具体的错误类型可以参见SWFUpload.UPLOAD_ERROR中的定义。
					 * Message参数表示的是错误的描述。
					 * File参数表示的是上传失败的文件对象。
					 *
					 * 例如，我们请求一个服务端的一个不存在的文件处理页面，那么error code会是-200，message会是404。
					 * 停止、退出、uploadStart返回false、HTTP错误、IO错误、文件上传数目超过限制等，都将触发该事件，
					 *
					 * 注意：此时文件上传的周期还没有结束，不能在这里开始下一个文件的上传。
					 *
					 * @event uploadError
					 * @param comp {Object} UploadField组件本身
					 * @param file {Object} 上传的文件
					 * @param code {String} 错误码
					 * @param message {String} 错误信息
					 *
					 */
					"uploadError", /**
					 * 当文件上传的处理已经完成（这里的完成只是指向目标处理程序发送完了Files信息，只管发，不管是否成功接收），并且服务端返回了200的HTTP状态时，触发uploadSuccess事件。
					 * data指的是服务器发出的一些数据（比如你自己echo出的）而response是服务器自己发出的HTTP状态码
					 * 由于一些Flash Player的bug，HTTP状态码可能不会被获取到，从而导致uploadSuccess事件不能被触发。
					 * 由于这个原因，2.50版在设置对象中增加了一个新属性assume_success_timeout 用来设置是否超过了等待接收HTTP状态码的最长时间，超过即触发
					 * uploadSuccess。在这种情况下，（received response）参数会无效。 设置对象中的 http_success
					 * 允许设置在HTTP状态码为非200的其他值时也触发uploadSuccess事件。
					 *
					 * 注意：
					 *    data是服务端处理程序返回的数据。
					 *    此时文件上传的周期还没有结束，不能在这里开始下一个文件的上传。
					 *    在window平台下，那么服务端的处理程序在处理完文件存储以后，必须返回一个非空值，否则此事件不会被触发，随后的uploadComplete事件也无法执行。
					 * @event uploadSuccess
					 * @param comp {Object} UploadField组件本身
					 * @param file {Object} 上传的文件
					 * @param data {String} 已上传的字节数
					 * @param response {String} 总字节数
					 *
					 */
					"uploadSuccess", /**
					 * 当上传队列中的一个文件完成了一个上传周期，无论是成功(uoloadSuccess触发)还是失败(uploadError触发)，
					 * uploadComplete事件都会被触发，这也标志着一个文件的上传完成，可以进行下一个文件的上传了。

					 * 如果要下个文件自动上传，那么在这个时候调用startUpload()或者设置autoContinue属性为true,来启动下一个文件的上传是不错的选择。

					 * 注意：当在进行多文件上传的时候，中途用cancelUpload取消了正在上传的文件，或者用stopUpload停止了正在上传的文件，
					 * 那么在uploadComplete中就要很小心的使用startUpload()，
					 * 因为在上述情况下，uploadError和uploadComplete会顺序执行，
					 * 因此虽然停止了当前文件的上传，但会立即进行下一个文件的上传，你可能会觉得这很奇怪，但事实上程序并没有错。
					 * 如果你希望终止整个队列的自动上传，那么你需要做额外的程序处理了。
					 *
					 * @event uploadComplete
					 * @param comp {Object} UploadField组件本身
					 * @param file {Object} 上传的文件
					 *
					 */
					"uploadComplete", /**
					 * 如果debug setting设置为true，那么页面底部会自动添加一个textArea，
					 * 如果此debug事件没有被重写，那么SWFUpload库和Flash都会调用此事件来在页面底部的输出框中添加debug信息供调试使用。
					 *
					 * @event debug
					 * @param comp {Object} UploadField组件本身
					 * @param message {String}    调试信息
					 *
					 */
					"debug" );
				me.id = me.id || FAPUI.getId ();
				me.button_placeholder_id = FAPUI.getId ();
				me.progress_placeholder_id = FAPUI.getId ();
				me.tpl = [ "<div id=${id}>", "<a href=\"javascript:void(0);\" class=\"button-btn\" " + "style=height:24px;>", "<span class=\"button-btn-left\">", "<span id=\"", me.button_placeholder_id, "\" class=\"button-btn-text\"></span>", "</span>", "</a>", "<div id=\"", me.progress_placeholder_id, "\"></div>", "</div>" ].join ( "" );
			},

			/**
			 * 渲染组件
			 * @method render
			 * @private
			 * @param {*} el 目标容器对象
			 */
			render : function ( el ) {
				var me = this;

				me.callParent ( [ el ] );
			},

			/**
			 *
			 */
			bindEvent : function () {
				var me = this;

				me.el = me.el || $ ( "#" + me.id );
				me._createSwfUpload ();
				me.setDisabled ( me.disabled );
				if ( me.width ) {
					me.setWidth ( me.width );
				}
			},

			/**
			 * 创建DOM元素
			 * @method createDom
			 * @private
			 */
			createDom : function () {
				var me = this;

				return juicer ( me.tpl, me );
			},
			/**
			 * 创建SWFUpload上传组件
			 * @method _createSwfUpload
			 * @private
			 * @returns    {Object} SWFUpload上传组件
			 */
			_createSwfUpload : function () {
				var me = this;

				if ( ! me.swfu ) {
					me.swfu = new SWFUpload ( {
						flash_url : seajs.dir + "../lib/swfupload/swfupload.swf",
						upload_url : me.upload_url,
						file_post_name : me.file_post_name,
						post_params : me.post_params,
						use_query_string : me.use_query_string,
						preserve_relative_urls : me.preserve_relative_urls,
						requeue_on_error : me.requeue_on_error,
						http_success : me.http_success,
						assume_success_timeout : me.assume_success_timeout,
						file_types : me.file_types,
						file_types_description : me.file_types_description,
						file_size_limit : me.file_size_limit,
						file_upload_limit : me.file_upload_limit,
						file_queue_limit : me.file_queue_limit,
						prevent_swf_caching : me.prevent_swf_caching,
						debug : me.debug,
						button_disabled : me.disabled && me.button_disabled,
						button_text : me.button_text,
						button_width : 60,
						button_height : 20,
						button_cursor : SWFUpload.CURSOR.HAND,
						button_window_mode : SWFUpload.WINDOW_MODE.TRANSPARENT,
						button_placeholder_id : me.button_placeholder_id,
						/**
						 *
						 */
						file_dialog_start_handler : function () {
							me.fireEvent ( "fileDialogStart", me );
						},

						/**
						 *
						 * @param {*} file
						 */
						file_queued_handler : function ( file ) {
							var id = file.id;
							var name = file.name;
							var me = this;

							new FPB ( {
								renderTo : me.progress_placeholder_id,
								fileName : name,
								fileSize : file.size,
								id : id, //width:800,
								listeners : {
									/**
									 *
									 */
									destroy : function () {
										u.cancelUpload ( id );
									}
								}
							} );
							me.fireEvent ( "fileQueued", me, file );
						},
						/**
						 *
						 * @param {*} file
						 * @param {*} code
						 * @param {*} message
						 */
						file_queue_error_handler : function ( file, code, message ) {
							me.fireEvent ( "fileQueued", me, file, code, message );
						},
						/**
						 *
						 * @param {*} fs
						 * @param {*} fq
						 * @param {*} tfq
						 */
						file_dialog_complete_handler : function ( fs, fq, tfq ) {
							me.fireEvent ( "fileDialogComplete", me, fs, fq, tfq );
							if ( me.autoStart ) {
								this.startUpload ();
							}
						},
						/**
						 *
						 * @param {*} file
						 */
						upload_start_handler : function ( file ) {
							if ( false == me.fireEvent ( "uploadStart", me, file ) ) {
								return false;
							} else {
								var id = file.id;
								var fpb = FAPUI.getInstance ( id );

								fpb.updateFileSpeed ( file.currentSpeed );
								fpb.updateProgress ( file.percentUploaded );
							}
						},
						/**
						 *
						 * @param {*} file
						 * @param {*} bc
						 * @param {*} tb
						 */
						upload_progress_handler : function ( file, bc, tb ) {
							var id = file.id;
							var fpb = FAPUI.getInstance ( id );
							//console.log([bc,tb,file.currentSpeed,file.percentUploaded].join(";"));
							fpb.updateFileSpeed ( file.currentSpeed );
							//fpb.updateProgress(file.percentUploaded);
							fpb.updateProgress ( bc / tb * 100 );
							me.fireEvent ( "uploadProgress", me, file, bc, tb );
						},
						/**
						 *
						 * @param {*} file
						 * @param {*} serverdata
						 * @param {*} response
						 */
						upload_success_handler : function ( file, serverdata, response ) {
							var id = file.id;
							var fpb = FAPUI.getInstance ( id );

							if ( fpb ) {
								fpb.updateFileSpeed ( file.averageSpeed );
								fpb.complete ();
							}
							me.fireEvent ( "uploadSuccess", me, file, serverdata, response );
						},
						/**
						 *
						 * @param {*} file
						 * @param {*} code
						 * @param {*} message
						 */
						upload_error_handler : function ( file, code, message ) {
							var id = file.id;
							var fpb = FAPUI.getInstance ( id );

							if ( fpb ) {
								fpb.error ();
							}
							me.fireEvent ( "uploadError", me, file, code, message );
						},
						/**
						 *
						 * @param {*} file
						 */
						upload_complete_handler : function ( file ) {
							me.fireEvent ( "uploadComplete", me, file );
							if ( me.autoContinue ) {
								this.startUpload ();
							}
						},
						/**
						 *
						 * @param {*} message
						 */
						debug_handler : function ( message ) {
							me.fireEvent ( "debug", me, message );
						}
					} );
				}
				return me.swfu;
			},
			/**
			 * 接收file_id来上传文件。
			 * 如果不传给它file_id值，那么将默认上传待上传队列的第一个文件
			 * @method startUpload
			 * @public
			 * @param {*} file_id 文件ID
			 */
			startUpload : function ( file_id ) {
				this.swfu.startUpload ( file_id );
			},
			/**
			 *
			 * 接收file_id 参数来移除一个文件的上传.这个文件会被移除出待上传队列 .
			 * 如果不给它file_id，默认上传队列中的第一个文件将会被取消.
			 * 可选参数trigger_error_event如果被设置为false，uploadError事件将不会被触发.
			 * @method cancelUpload
			 * @public
			 * @param {*} file_id
			 * @param {*} trigger_error_event
			 */
			cancelUpload : function ( file_id, trigger_error_event ) {
				this.swfu.cancelUpload ( file_id, trigger_error_event );
			},

			/**
			 *
			 * 停止当前正在上传的文件，并且把它还原到待上传队列中。（和移除不同，就是取消这个文件的上传，但不会移除出上传队列）
			 * 调用stopUpload时，如果有正在上传的文件，uploadError事件会被触发；如果此时没有正在上传文件，那么不会发生任何操作，也不会触发任何事件。
			 * @method stopUpload
			 * @public
			 */
			stopUpload : function () {
				this.swfu.stopUpload ();
			},
			/**
			 *
			 * 将之前曾经入队的文件重新加入等待上传队列
			 * 如果文件没有找到，或者正在被上传，会返回false
			 * 注意：被重新入队的文件不会被再一次检查文件大小，队列大小，总上传个数或其他限制，只会把文件添加到队列中，如果这个文件引用仍然存在
			 * @method requeueUpload
			 * @param {*} p 文件id|文件索引
			 * @returns {boolean}
			 */
			requeueUpload : function ( p ) {
				return this.swfu.requeueUpload ( p );
			},
			/**
			 * 返回状态对象
			 * @method getStats
			 * @returns {Object}
			 */
			getStats : function () {
				return this.swfu.getStats ();
			},
			/**
			 * 设置或修改状态对象（ Stats Object) . 如果你在上传完毕后改变上传成功数，上传失败数，你可以使用此方法
			 * @method setStats
			 * @param {*} p
			 */
			setStats : function ( p ) {
				this.swfu.setStats ( p );
			},

			/**
			 * 通过接收file id (某个文件对象的id) 或者 file index (某个文件对象的index属性)，返回在队列中的文件对象.
			 * 当给getFile传递一个file_id,只有在队列中的文件才可能被获取，如果找不到文件，将返回null
			 * 当给getFile传递一个index，所有尝试入队的（包括哪些入队时产生了错误的文件）将可能被获取。如果index索引超出范围，会返回null
			 *
			 * @method getFile
			 * @param {*} p file_id|index
			 * @return {Object}
			 */
			getFile : function ( p ) {
				return this.swfu.getFile ( p );
			},

			/**
			 * 用来从等待上传队列中返回单个文件对象。 具体是通过接收file id (某个文件对象的id) 或者 file index (某个文件对象的index属性)，返回在队列中的文件对象.index
			 * 索引从0开始计算.
			 * 当给 getQueueFile传递一个file_id,只有在等待上传队列中的文件才可能被获取，如果找不到文件，将返回null
			 * 当给 getQueueFile传递一个index，只有在等待上传队列中的文件才可以被获取 例如: getQueueFile(0) 返回一个在等待上传队列首部的文件对象.
			 * 如果调用了startUpload函数，它将在当前上传文件上传完毕后被上传。
			 * （注意：getFile是获取文件队列中的文件。包括已上传的，错误的，等待上传的队列。而getQueueFile只获取等待上传队列中的文件）
			 *
			 * @method getQueueFile
			 * @param {*} p file_id|index
			 * @return {Object}
			 */
			getQueueFile : function ( p ) {
				return this.swfu.getQueueFile ( p );
			},

			/**
			 * 添加一个键/值对，在每个的文件被上传时以POST方式捎带发送
			 * 它对应着post_params设置中的相同键值对。如果post_params中已经存在该值，那么实际上会被覆盖。
			 *
			 * @method addPostParam
			 * @param {string} k 健
			 * @param {string} v 值
			 */
			addPostParam : function ( k, v ) {
				this.swfu.addPostParam ( k, v );
			},

			/**
			 * 移除一个键/值对，这个键值对之前将在每个的文件被上传时以POST方式捎带发送
			 * 它对应着post_params设置中的相同键值对。如果post_params中已经存在该值，那么实际上会被移除。
			 * @method removePostParam
			 * @param {string} k 健
			 *
			 */
			removePostParam : function ( k ) {
				this.swfu.removePostParam ( k );
			},
			/**
			 * 为指定file_id的某一文件对象添加一个POST键/值对，如果添加的name属性已经存在，那么原值会被覆盖。
			 * 如果需要给所有文件对象添加POST值，那么可以使用设置中的post_params属性。
			 *
			 * @method addFileParam
			 * @param {string} file_id 文件ID
			 * @param {string} k 健
			 * @param {string} v 值
			 *
			 */
			addFileParam : function ( file_id, k, v ) {
				return this.swfu.addFileParam ( file_id, k, v );
			},
			/**
			 * 删除由addFileParam添加的POST值对.
			 * 如果POST设置中没有此属性，那么返回false
			 * @method removeFileParam
			 * @public
			 * @param {string} file_id 文件ID
			 * @param {string} k 健
			 *
			 */
			removeFileParam : function ( file_id, k ) {
				return this.swfu.removeFileParam ( file_id, k );
			},
			/**
			 * 动态修改设置中的upload_url属性。
			 * @method
			 * @public
			 * @param {string} url
			 */
			setUploadURL : function ( url ) {
				this.upload_url = url;
				this.swfu.setUploadURL ( url );
			},
			/**
			 * 动态修改post_params，以前的属性全部被覆盖。param_object必须是一个JavaScript的基本对象，所有属性和值都必须是字符串类型。
			 * @method setPostParams
			 * @public
			 * @param {Object} param_object
			 */
			setPostParams : function ( param_object ) {
				this.param_object = param_object;
				this.swfu.setPostParams ( param_object );
			},
			/**
			 * 动态修改设置中的file_types 和 file_types_description，两个参数都是必须的
			 * @method setFileTypes
			 * @public
			 * @param {string} types
			 * @param {string} description
			 */
			setFileTypes : function ( types, description ) {
				this.file_types = types;
				this.file_types_description = description;
				this.swfu.setFileTypes ( types, description );
			},
			/**
			 * 动态修改设置中的file_size_limit，此修改针对之后的文件大小过滤有效。file_size_limit参数接收一个单位，有效的单位有B、KB、MB、GB，默认单位是KB。
			 * 例如: 2147483648 B, 2097152, 2097152KB, 2048 MB, 2 GB
			 * @method setFileSizeLimit
			 * @public
			 * @param {int|string} file_size_limit
			 */
			setFileSizeLimit : function ( file_size_limit ) {
				this.file_size_limit = file_size_limit;
				this.swfu.setFileSizeLimit ( file_size_limit );
			},
			/**
			 * 动态修改设置中的file_upload_limit，特殊值0表示无限制。
			 * 提醒：这里限制的是一个SWFUpload实例控制上传成功的文件总数。
			 * @method setFileUploadLimit
			 * @public
			 * @param {int} file_upload_limit
			 */
			setFileUploadLimit : function ( file_upload_limit ) {
				this.file_upload_limit = file_upload_limit;
				this.swfu.setFileUploadLimit ( file_upload_limit );
			},
			/**
			 * 动态修改设置中的file_queue_limit，特殊值0表示无限制。
			 * 提醒：这里限制的是文件上传队列中（入队检测通过的文件会添加到上传队列等待上传）允许排队的文件总数。.
			 * @method setFileQueueLimit
			 * @public
			 * @param {int} file_queue_limit
			 */
			setFileQueueLimit : function ( file_queue_limit ) {
				this.file_queue_limit = file_queue_limit;
				this.swfu.setFileQueueLimit ( file_queue_limit );
			},
			/**
			 * 动态修改设置中的file_post_name，注意在Linux环境下，FlashPlayer是忽略此设置的。
			 * @method setFilePostName
			 * @public
			 * @param {string} file_post_name
			 */
			setFilePostName : function ( file_post_name ) {
				this.file_post_name = file_post_name;
				this.swfu.setFilePostName ( file_post_name );
			},
			/**
			 * 动态修改设置中的use_query_string，设置为true的时候，SWFUpload以GET形式发送数据，如果为false，那么就以POST发送数据。
			 * @method setUseQueryString
			 * @public
			 * @param {string} use_query_string
			 */
			setUseQueryString : function ( use_query_string ) {
				this.use_query_string = use_query_string;
				this.swfu.setUseQueryString ( use_query_string );
			},
			/**
			 * 动态启动/禁止 debug输出，debug_enabled参数是一个布尔值。
			 * @method setDebugEnabled
			 * @public
			 * @param {boolean} debug_enabled
			 */
			setDebugEnabled : function ( debug_enabled ) {
				this.debug = debug_enabled;
				this.swfu.setDebugEnabled ( debug_enabled );
			},
			/**
			 * 设置显示文本
			 * @method setButtonText
			 * @public
			 * @param {string} button_text
			 */
			setButtonText : function ( button_text ) {
				this.button_text = button_text;
				this.swfu.setButtonText ( button_text );
			},
			/**
			 * 设置按钮有效状态
			 * @method setButtonDisabled
			 * @public
			 * @param {boolean} button_disabled
			 */
			setButtonDisabled : function ( button_disabled ) {
				this.button_disabled = button_disabled;
				this.swfu.setButtonDisabled ( button_disabled || this.disabled );
			},

			/**
			 * 设置输入框是否禁用
			 * @method setDisabled
			 * @param {boolean} dised
			 */
			setDisabled : function ( dised ) {
				var me = this;

				me.disabled = dised;
				//me.setButtonDisabled(me.disabled);
			},
			/**
			 *

			 */
			onDestroy : function () {
				this.swfu.destroy ();
				this.callParent ();

			}
		}
	} );
	FAPUI.register ( "uploadfield", FAPUI.form.UploadField );

	return FAPUI.form.UploadField;

} );
