/**
 * 以下代码展示如何使用Messageer
 *
 *
 *
 $("#show").click(function(){
  			Messager.show({
  			  	title:"添加节点信息",
  			  	titleIconCls:"icon-save",
  			  	msg:"Message will be closed after 4 seconds.",
  			  	showType:"show"
  			});
  		});

 $("#slide").click(function(){
			Messager.show({
	    		title:"添加节点信息",
	    		titleIconCls:"icon-save",
	    		msg:"Message will be closed after 5 seconds.",
	    		timeout:5000,
	    		showType:"slide"
	    	});
		});

 $("#fade").click(function(){
			Messager.show({
				title:"添加节点信息",
	    		titleIconCls:"icon-save",
	    		msg:"Message never be closed .",
	    		timeout:0,
	    		showType:"fade"
	    	});
		});

 $("#alert").click(function(){
			Messager.alert("信息","Here is a message!","",function(){alert("alert");});
		});

 $("#error").click(function(){
			Messager.alert("错误信息","Here is a error message!","error",function(){alert("error");});
		});

 $("#info").click(function(){
			Messager.alert("提示信息","Here is a info message!","info");
		});

 $("#question").click(function(){
			Messager.alert("询问信息","Here is a question message!","question");
		});

 $("#warning").click(function(){
			Messager.alert("警告信息","Here is a warning message!","warning");
		});

 $("#confirm").click(function(){
			Messager.confirm("确认信息","Are you confirm this?",function(r){if(r)alert(r);});
		});

 $("#prompt").click(function(){
			Messager.prompt("输入信息","Please enter something!",function(r){if(r)alert(r);});
		});


 *@class FAPUI.Messager
 *@extends FAPUI.Component
 */
define ( function ( require, exports, module ) {
	var importcss = "./themes/" + FAPUI.getTheme () + "/css/ui-messager.css";

	require.async ( importcss );
	require ( "./fapui-window" );
	require ( "./fapui-component" );
	FAPUI.define ( "FAPUI.Messager", {
		extend : "FAPUI.Component",

		props : {
			_cfg : {
				/**
				 *messager组件宽度 默认为250
				 *@property width
				 *@type int
				 */
				width : 350, /**
				 *messager组件高度 默认为130
				 *@property height
				 *@type int
				 */
				height : 130,

				/**
				 *msg 对话框内容信息 默认为""
				 *@property msg
				 *@type String
				 */
				msg : "", /**
				 *title组件标题 默认为My Title
				 *@property title
				 *@type String
				 */
				title : "My Title",

				/**
				 *messager组件是否可以有最小化按钮 默认为false
				 *@property minimizable
				 *@type Boolean
				 */
				minimizable : false,

				/**
				 *messager组件是否可以有最大化按钮 默认为false
				 *@property maximizable
				 *@type Boolean
				 */
				maximizable : false,

				/**
				 *messager组件是否可以有关闭按钮 默认为true
				 *@property closeable
				 *@type Boolean
				 */
				closeable : true,

				/**
				 *messager组件是否可以改变大小 默认为false
				 *@property resizable
				 *@type Boolean
				 */
				resizable : false, /**
				 *messager组件是否可以关闭 默认为true
				 *@property closed
				 *@type Boolean
				 */
				closed : true,

				/**
				 *messager组件是否可以折叠 默认为false
				 *@property collapsable
				 *@type Boolean
				 */
				collapsable : false,

				/**
				 *messager组件是否为模态 默认为true
				 *@property modal
				 *@type Boolean
				 */
				modal : true
			}
		}, override : {
			/**
			 * initConfig
			 */
			initConfig : function () {
				var me = this;

				me.callParent ();
			}, /**
			 * 在屏幕右下方显示一个250*100的弹出框
			 * 默认弹出方式为"slide"
			 * 默认弹出速度为600毫秒
			 * 默认4秒后自动关闭（若鼠标停留在弹出框上时，则不会关闭）
			 *@method show
			 *@param options {Object} 配置项
			 {
					showType:"slide",
					showSpeed:600,
					height:100,
					minimizable : false,
					maximizable : false,
					draggable : false,
					resizable : false,
					collapsable : false,
					modal:false,
					timeout:4000
				}
			 */
			show : function ( options ) {
				var me = this;
				var cfg = {
					showType : "slide",
					showSpeed : 600,
					height : 100,
					minimizable : false,
					maximizable : false,
					draggable : false,
					resizable : false,
					collapsable : false,
					modal : false,
					timeout : 4000
				};

				cfg = FAPUI.apply ( {}, cfg, me._cfg );
				cfg = FAPUI.apply ( {}, options || {}, cfg );
				cfg.html = options.msg || me._cfg.msg;
				var window = new FAPUI.Window ( cfg );

				window.open ();
				window.showWindow ( cfg.showSpeed );
				window.bodyEl.children ( "div.panel-content" ).css ( "overflow", "auto" );
				me._showType ( cfg, window );
				window.el.css ( {
					top : "", left : "", bottom : 0, right : 0
				} );
			},
			/**
			 * @access private
			 * 显示弹出框处理
			 *
			 */
			_showType : function ( opts, window ) {
				var me = this;

				window.hide ();
				switch ( opts.showType ) {
					case null : {
						window.el.show ();
						break;
					}
					case "slide" : {
						window.el.slideDown ( opts.showSpeed );
						break;
					}
					case "fade" : {
						window.el.fadeIn ( opts.showSpeed );
						break;
					}
					case "show" : {
						window.el.show ( opts.showSpeed );
						break;
					}
				}
				var timer = null;

				if ( opts.timeout > 0 ) {
					timer = setTimeout ( function () {
						me._hideType ( opts, window );
					}, opts.timeout );
				}
				window.el.hover ( function () {
					if ( timer ) {
						clearTimeout ( timer );
					}
				}, function () {
					if ( opts.timeout > 0 ) {
						timer = setTimeout ( function () {
							me._hideType ( opts, window );
						}, opts.timeout );
					}
				} );
			},
			/**
			 * @access private
			 * 关闭弹出框处理
			 *
			 */
			_hideType : function ( opts, window ) {
				var me = this;

				switch ( opts.showType ) {
					case null : {
						window.el.hide ();
						break;
					}
					case "slide" : {
						window.el.slideUp ( opts.showSpeed );
						break;
					}

					case "fade" : {
						window.el.fadeOut ( opts.showSpeed );
						break;
					}

					case "show" : {
						window.el.hide ( opts.showSpeed );
						break;
					}

				}
				setTimeout ( function () {
					window.close ();
				}, opts.timeout );
			}, /**
			 * 弹出一个模态对话框，只有一个确定按钮
			 * 默认没有图标
			 * @method alert
			 * @param {String} title 对话框标题
			 * @param {String} msg 对话框内容信息
			 * @param {String} icon 对话框图标 其值: error,question,info,warning.
			 * @param {Function} fn 对话框关闭时的回调函数
			 * @param {Int} width 对话框的宽度
			 * @param {Int} height 对话框的高度
			 */
			alert : function ( title, msg, icon, fn, width, height ) {
				var me = this;
				var window = null;
				var reg = /function\(.*?\)\{.*?\}/;
				var options = {
					title : title, msg : msg, width : width ||
					me._cfg.width, height : height || me._cfg.height
				};

				options = FAPUI.apply ( {}, options, me._cfg );
				var content = "<div class=\"messager-body\">" + options.msg + "</div>";

				switch ( icon ) {
					case "error" : {
						content = "<div class=\"messager-body messager-icon messager-error\"></div>" +
							content;
						break;
					}
					case "info" : {
						content = "<div class=\"messager-body messager-icon messager-info\"></div>" +
							content;
						break;
					}

					case "question" : {
						content = "<div class=\"messager-body messager-icon messager-question\"></div>" +
							content;
						break;
					}

					case "warning" : {
						content = "<div class=\"messager-body messager-icon messager-warning\"></div>" +
							content;
						break;
					}

				}
				content += "<div style=\"clear:both;\"/>";
				options.html = content;
				options.bbar = new FAPUI.ToolBar ( {
					align : "center", showBg : false, items : [ {
						ctype : "button", type : "linkButton", text : "确定",
						/**
						 *
						 * @returns {boolean}
						 */
						handler : function () {
							window && window.close ( true );
							/*if(fn&&reg.test(fn)){*/
							if ( fn ) {
								fn ();
								return false;
							} else {
								return false;
							}
						}
					} ]
				} );
				window = new FAPUI.Window ( options );
				window.open ();
			},

			/**
			 * 弹出一个确认对话框
			 * 显示一个question图标
			 * 一个确定按钮，一个取消按钮
			 * @method confirm
			 * @param {string} title 对话框标题
			 * @param {string} msg 对话框内容信息
			 * @param {Function} fn 对话框关闭时的回调函数，返回true或false
			 * @param {number} width 对话框的宽度
			 * @param {number} height 对话框的高度
			 */
			confirm : function ( title, msg, fn, width, height ) {
				var me = this;
				var window = null;
				var reg = /function\(.*?\)\{.*?\}/;
				var options = {
					title : title, msg : msg, width : width ||
					me._cfg.width, height : height || me._cfg.height
				};

				options = FAPUI.apply ( {}, options, me._cfg );
				var content = "<div class=\"messager-body\">" + options.msg + "</div>";

				content = "<div class=\"messager-body messager-icon messager-question\"></div>" + content;
				content += "<div style=\"clear:both;\"/>";
				options.html = content;
				options.bbar = new FAPUI.ToolBar ( {
					align : "center", showBg : false, items : [ {
						type : "linkButton", text : "确定",
						/**
						 *
						 * @returns {boolean}
						 */
						handler : function () {
							window && window.close ( true );
							/*if(fn&&reg.test(fn)){*/
							if ( fn ) {
								fn ( true );
								return false;
							} else {
								return false;
							}
						}
					}, {
						type : "linkButton", text : "取消",
						/**
						 *
						 * @returns {boolean}
						 */
						handler : function () {
							window && window.close ( true );
							/*if(fn&&reg.test(fn)){*/
							if ( fn ) {
								fn ( false );
								return false;
							} else {
								return false;
							}
						}
					} ]
				} );
				window = new FAPUI.Window ( options );
				window.open ();
			}, /**
			 * 弹出以一个可输入信息的对话框
			 * 显示一个info图标
			 * 一个确定按钮，一个取消按钮
			 *@method prompt
			 * @param {String} title 对话框标题
			 * @param {String} msg 对话框内容提示信息
			 * @param {Function} fn 对话框关闭时的回调函数，点击确定时返回文本框所输入的值，点击取消时无返回值
			 * @param {Int} width 对话框的宽度
			 * @param {Int} height对话框的高度
			 */
			prompt : function ( title, msg, fn, width, height ) {
				var me = this;
				var window = null;
				var reg = /function\(.*?\)\{.*?\}/;
				var options = {
					title : title, msg : msg, width : width ||
					me._cfg.width, height : height || me._cfg.height
				};

				options = FAPUI.apply ( {}, options, me._cfg );
				var content = "<div class=\"messager-body messager-icon messager-info\"></div>" +
					"<div class=\"messager-body\" style=\"margin-top:6px;\">" +
					options.msg + "</div>" + "<input class=\"messager-input\" type=\"text\"/>" +
					"<div style=\"clear:both;\"/>";

				options.html = content;
				options.bbar = new FAPUI.ToolBar ( {
					align : "center", showBg : false, items : [ {
						type : "linkButton", text : "确定",
						/**
						 *
						 * @returns {boolean}
						 */
						handler : function () {
							var val = ( window && window ).contentEl.children ( "input.messager-input" ).val ();

							window && window.close ( true );
							/*if(fn&&reg.test(fn)){*/
							if ( fn ) {
								fn ( val );
								return false;
							} else {
								return false;
							}
						}
					}, {
						type : "linkButton", text : "取消",
						/**
						 *
						 * @returns {boolean}
						 */
						handler : function () {
							window && window.close ( true );
							/*if(fn&&reg.test(fn)){*/
							if ( fn ) {
								fn ();
								return false;
							} else {
								return false;
							}
						}
					} ]
				} );
				window = new FAPUI.Window ( options );
				window.open ();
				window.contentEl.children ( "input.messager-input" ).focus ();
			}
		}

	} );
	FAPUI.register ( "messager", FAPUI.Messager );

	Messager = new FAPUI.Messager ();

	return Messager;
} );
