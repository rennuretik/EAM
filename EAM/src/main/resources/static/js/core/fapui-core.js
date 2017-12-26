/*
 * Sunyard.com Inc.
 * Copyright (c) 2010-2015 All Rights Reserved.
 */

/**
 * 模块及工具类
 * @module coren
 */
	//匿名函数(闭包)，参数为global,并立即执行，实际传入参数为window
( function ( global ) {

	/**
	 * 当前版本
	 * @type {string}
	 * @public
	 * @static
	 */
	var version = "4.1.0";

	/**
	 * 可显示的assii码的正则表达式
	 * @property escaperule
	 * @type {RegExp}
	 */
	var escaperule = /["\\\x00-\x1f\x7f-\x9f]/g;

	/**
	 * 特殊字符的正则表达式映射表
	 * @property meta
	 * @type {Object}
	 */
	var meta = {
		"\b" : "\\b",
		"\t" : "\\t",
		"\n" : "\\n",
		"\f" : "\\f",
		"\r" : "\\r",
		"\"" : "\\\"",
		"\\" : "\\\\"
	};

	/**
	 * 方法用来判断某个对象是否含有指定的自身属性【对hasOwnProperty函数的别名】
	 * @property hasOwn
	 * @type {Function}
	 */
	var hasOwn = Object.prototype.hasOwnProperty;
	/**
	 * 定义class类型
	 * @property class2type
	 * @type {{}}
	 */
	var class2type = {};

	/**
	 * FAPUI变量
	 * @class FAPUI
	 * @type {Object}
	 */
	var FAPUI = global.FAPUI || {};

	/**
	 * fapuid版本
	 * @type {*|string}
	 */
	FAPUI.version = FAPUI.version || version;

	/**
	 * 组件ID全局序号种子
	 * @property seed
	 * @static
	 * @type {number}
	 */
	var seed = 1;

	/**
	 * 定义提示、警告消息模板
	 * @property lang
	 * @static
	 * @readonly
	 * @type {Object}
	 */
	FAPUI.lang = {
		OUTOFINDEX : "找不到索引为:{0},所对应的记录",
		NOTFINDBYID : "找不到ID为:{0},所对应的记录",
		ERROR_LENGTH_MSG : "输入的长度为{0},限制的长度为{1}~{2}",
		ERROR_NUMBER_MSG : "输入的数字为{0},限制的区间为{1}~{2},{3}位小数",
		ERROR_AMOUNT_MSG : "输入的的金额{0},限制的区间为{1}~{2},{3}位小数",
		ERROR_RADIO_MSG : "选择项必须选择一个",
		ERROR_CHECK_MSG : "选择项不能为空"
	};

	/**
	 * 截取数组
	 * @method toArray
	 * @param {Array} fromArray 【必须】源数组或字符串
	 * @param {number} start 【可选】 规定从何处开始选取。如果是负数，那么它规定从数组尾部开始算起的位置。也就是说，
	 *        -1 指最后一个元素
	 *        -2 指倒数第二个元素，以此类推。
	 * @param {number} end 【可选】规定从何处结束选取。
	 *        该参数是数组片断结束处的数组下标。如果没有指定该参数，那么切分的数组包含从 start
	 *        到数组结束的所有元素。如果这个参数是负数，那么它规定的是从数组尾部开始算起的元素。
	 * @param {Array} res 【禁用,可选】 目标数组，无用处
	 * @returns {Array}
	 */
	FAPUI.toArray = function ( fromArray, start, end, res ) {
		res = [];
		for ( var x = 0, len = fromArray.length; x < len; x ++ ) {
			res.push ( fromArray[ x ] );
		}
		return res.slice ( start || 0, end || res.length );
	};

	/**
	 * 组件编号（id）生成器，由生成规如：前缀_seed+1，如果前缀未定义，默认为cmd
	 * @method getId
	 * @param {string} prefix 【可选】自定义前缀
	 * @returns {string}
	 */
	FAPUI.getId = function ( prefix ) {
		prefix = ( prefix || "cmd" ) + "_";
		return prefix + seed ++;
	};

	/**
	 * 封装了JSON.stringify的接口用于适配使用，根据不同的对象类型进行一定的json封装
	 * @method toJSON
	 * @type {JSON.stringify} json对象
	 * @param {Object} o
	 * @return {JSON|string}
	 */
	FAPUI.toJSON = typeof JSON === "object" && JSON.stringify ? JSON.stringify : function ( o ) {
		if ( o === null ) {
			return "null";
		}

		var pairs;
		var k;
		var name;
		var val;
		var type = FAPUI.type ( o );

		if ( type === "undefined" ) {
			return undefined;
		}

		// Also covers instantiated Number and Boolean objects,
		// which are typeof 'object' but thanks to $.type, we
		// catch them here. I don't know whether it is right
		// or wrong that instantiated primitives are not
		// exported to JSON as an {"object":..}.
		// We choose this path because that's what the browsers did.
		if ( type === "number" || type === "boolean" ) {
			return String ( o );
		}
		if ( type === "string" ) {
			return FAPUI.quoteString ( o );
		}
		if ( typeof o.toJSON === "function" ) {
			return FAPUI.toJSON ( o.toJSON () );
		}
		//日期封装成国际标准的字符格式
		if ( type === "date" ) {
			var month = o.getUTCMonth () + 1;
			var day = o.getUTCDate ();
			var year = o.getUTCFullYear ();
			var hours = o.getUTCHours ();
			var minutes = o.getUTCMinutes ();
			var seconds = o.getUTCSeconds ();
			var milli = o.getUTCMilliseconds ();

			if ( month < 10 ) {
				month = "0" + month;
			}
			if ( day < 10 ) {
				day = "0" + day;
			}
			if ( hours < 10 ) {
				hours = "0" + hours;
			}
			if ( minutes < 10 ) {
				minutes = "0" + minutes;
			}
			if ( seconds < 10 ) {
				seconds = "0" + seconds;
			}
			if ( milli < 100 ) {
				milli = "0" + milli;
			}
			if ( milli < 10 ) {
				milli = "0" + milli;
			}
			return "\"" + year + "-" + month + "-" + day + "T" + hours + ":" + minutes + ":" + seconds + "." + milli + "Z\"";
		}
		pairs = [];
		if ( FAPUI.isArray ( o ) ) {
			for ( k = 0; k < o.length; k ++ ) {
				pairs.push ( FAPUI.toJSON ( o[ k ] ) || "null" );
			}
			return "[" + pairs.join ( "," ) + "]";
		}

		// Any other object (plain object, RegExp, ..)
		// Need to do typeof instead of $.type, because we also
		// want to catch non-plain objects.
		if ( typeof o === "object" ) {
			for ( k in o ) {
				// Only include own properties,
				// Filter out inherited prototypes
				if ( hasOwn.call ( o, k ) ) {
					// Keys must be numerical or string. Skip others
					type = typeof k;
					if ( type === "number" ) {
						name = "\"" + k + "\"";
					} else if ( type === "string" ) {
						name = FAPUI.quoteString ( k );
					} else {
						continue;
					}
					type = typeof o[ k ];

					// Invalid values like these return undefined
					// from toJSON, however those object members
					// shouldn't be included in the JSON string at all.
					if ( type !== "function" && type !== "undefined" ) {
						val = FAPUI.toJSON ( o[ k ] );
						pairs.push ( name + ":" + val );
					}
				}
			}
			return "{" + pairs.join ( "," ) + "}";
		}
	};

	/**
	 * 智能转义字符串.
	 * 主要用于toJSON方法.
	 * 例如:
	 *
	 *    jQuery.quoteString('apple')
	 *
	 * "apple"
	 *
	 *    FAPUI.quoteString('"Where are we going?", she asked.')
	 *
	 * "\"Where are we going?\", she asked."
	 *
	 * @method quoteString
	 * @param {string} str 待转换的字符串
	 * @return {string}
	 *
	 */
	FAPUI.quoteString = function ( str ) {
		if ( str.match ( escaperule ) ) {
			return "\"" + str.replace ( escaperule, function ( a ) {
					var c = meta[ a ];

					if ( typeof c === "string" ) {
						return c;
					}
					c = a.charCodeAt ();
					return "\\u00" + Math.floor ( c / 16 ).toString ( 16 ) + ( c % 16 ).toString ( 16 );
				} ) + "\"";
		}
		return "\"" + str + "\"";
	};

	/**
	 * 获取对象类型
	 * @method type
	 * @param {Object} obj 检查的对象
	 * @returns {string}
	 */
	FAPUI.type = function ( obj ) {
		return obj == null ? String ( obj ) : class2type[ toString.call ( obj ) ] || "object";
	};

	/**
	 * 共享元模式，获取dom组件对象，这里实际以jQuery方式获取
	 * @method fly
	 * @param {string|HtemlElement|Object} el
	 * @returns {*}
	 */
	FAPUI.fly = function ( el ) {
		if ( FAPUI.isString ( el ) ) {
			return $ ( "#" + el );
		} else if ( el.tagName ) {
			return $ ( el );
		} else {
			return el;
		}
	};

	/**
	 * 组件管理容器
	 * @property CmpMgr
	 * @static
	 * @type {{}}
	 */
	FAPUI.CmpMgr = {};

	/**
	 * 注册组件
	 * @method register
	 * @param {string} t 组件key
	 * @param {Object} c 组件
	 */
	FAPUI.register = function ( t, c ) {
		FAPUI.CmpMgr[ t ] = c;
	};

	/**
	 * 组件实例容器
	 * @property Instances
	 * @type {{}}
	 */
	FAPUI.Instances = {};

	/**
	 * 注册实例
	 * @method registerInstance
	 * @param {Object} o 实例对象
	 */
	FAPUI.registerInstance = function ( o ) {
		if ( o.id ) {
			FAPUI.Instances[ o.id ] = o;
		}
	};

	/**
	 * 注销实例
	 * @method unregisterInstance
	 * @param {Object} o 待注销的实例
	 */
	FAPUI.unregisterInstance = function ( o ) {
		if ( o.id ) {
			delete FAPUI.Instances[ o.id ];
		}
	};

	/**
	 * 获取实例
	 * @method getInstance
	 * @param {string} id 【必须】 实例id
	 * @returns {*}
	 */
	FAPUI.getInstance = function ( id ) {
		return FAPUI.Instances[ id ];
	};

	/**
	 * 创建组件
	 * @method create
	 * @param {Config} cfg 构造函数的基础配置，如果cfgn已是ui组件则直接返回，如果是定义的ctype已注册的组件类型，实例该组件对象，否则实例Panel对象
	 * @returns {*} ui组件
	 */
	FAPUI.create = function ( cfg ) {
		if ( cfg.isUI && cfg.isUI () ) {
			return cfg;
		} else if ( cfg.ctype ) {
			return new FAPUI.CmpMgr[ cfg.ctype ] ( cfg );
		} else {
			return new FAPUI.Panel ( cfg );
		}
	};

	/**
	 * 获取视图宽、高对象
	 * @method getViewSize
	 * @returns {Object} 返回对象结构如：{width: number, height: number}
	 */
	FAPUI.getViewSize = function () {
		var winWidth = 0;
		var winHeight = 0;

		if ( window.innerWidth ) {
			winWidth = window.innerWidth;
		} else if ( document.body && document.body.clientWidth ) {
			winWidth = document.body.clientWidth;
		}
		//获取窗口高度
		if ( window.innerHeight ) {
			winHeight = window.innerHeight;
		} else if ( document.body && document.body.clientHeight ) {
			winHeight = document.body.clientHeight;
		}
		//通过深入Document内部对body进行检测，获取窗口大小
		if ( document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth ) {
			winHeight = document.documentElement.clientHeight;
		//> winHeight ? document.documentElement.clientHeight : winHeight;
			winWidth = document.documentElement.clientWidth;
		//> winWidth ? document.documentElement.clientWidth : winWidth;
		}
		return {
			width : winWidth,
			height : winHeight
		};
	};

	/**
	 * 获取父窗口
	 * @method getParent
	 * @returns {document}
	 */
	FAPUI.getParent = function () {
		try {
			return window.top.document || window.opener.document || window.top.frames[ 0 ].document || window.dialogArguments.document;
		} catch (e) {//本地文件打开页面时的安全问题
			return document;
		}
	};

	/**
	 * 根据主题名称获取保存在cookie中的主题,如果为空返回默认值"default"
	 * @method getCookie
	 * @param {string} tagName 【可选】
	 * @returns {string}
	 */
	FAPUI.getCookie = function ( tagName ) {
		var start = 0;
		var end = 0;

		if ( document.cookie.length > 0 ) {
			start = document.cookie.indexOf ( tagName + "=" );
			if ( start !== - 1 ) {
				start = start + tagName.length + 1;
				end = document.cookie.indexOf ( ";", start );
				if ( end === - 1 ) {
					end = document.cookie.length;
				}
				return unescape ( document.cookie.substring ( start, end ) );//反编码即为解码
			}
		}
		return "default";
	};

	/**
	 * 将选择的主题样式采用tagName=value;的格式保存到cookie中
	 * @method setCookie
	 * @param  {string} tagName
	 * @param  {string} value
	 */
	FAPUI.setCookie = function ( tagName, value ) {
		document.cookie = tagName + "=" + escape ( value ) + ";";//用escape对数据进行编码，避免编码问题的出现；
	};

	/**
	 * 获取当前主题
	 * 如果有父窗口，取父窗口的主题
	 * 如果没有父窗口，取cookie的主题
	 * 如果没有cookie则默认为default
	 * @method getTheme
	 * @returns {string}
	 */
	FAPUI.getTheme = function () {
		var win = FAPUI.getParent ();

		if ( win && win.FAPUI && win.FAPUI.THEME ) {
			return win.FAPUI.THEME;
		}
		return FAPUI.getCookie ( "fapui-theme" );
	};

	/**
	 * 设置主题
	 * @method setTheme
	 * @param {string} theme
	 */
	FAPUI.setTheme = function ( theme ) {
		if ( this.THEME === theme ) {
			return;
		}
		//处理link
		var links = $ ( "link" );

		$ ( links ).each ( function () {
			var linkHref = this.href || "";

			this.href = linkHref.replace ( FAPUI.THEME, theme );
		} );

		//处理所有子窗体
		var ifs = this.getIframes ( document );

		$ ( ifs ).each ( function () {
			if ( this.contentWindow || this.contentWindow.FAPUI ) {
				//调用子窗体的设置主题
				this.contentWindow.FAPUI.setTheme ( theme );
			}
		} );
		this.THEME = theme;
		this.setCookie ( "fapui-theme", theme );
	};

	/**
	 * 获取窗口的iframe对象数组
	 * @method getIframes
	 * @param {document} doc 输入窗口
	 * @returns {Array}
	 */
	FAPUI.getIframes = function ( doc ) {
		return $ ( "iframe", doc );
	};

	/**
	 * 初始化主题
	 * @property THEME
	 * @static
	 */
	FAPUI.THEME = FAPUI.getTheme ();

	/**
	 * 空白图（占位用）的url
	 * @property BLANK_IMG
	 * @static
	 */
	FAPUI.BLANK_IMG = "../themes/" + FAPUI.THEME + "/s.gif";

	/**
	 * z-index的初始化值
	 * @property zindex
	 * @static
	 */
	FAPUI.zindex = 10000;

	/**
	 * 应用路径，要求在页面加载的时候被始化进去
	 * @type {string}
	 */
	FAPUI.CONTEXT_PATH = global.path || "";

	/**
	 * 合并对象，如有默认值，选合并默认值，合并是c的属性会覆盖o的默性
	 * @method apply
	 * @param {*} o 被合并的目标对象
	 * @param {*} c 被合拼的对象
	 * @param {*} defaults 默认值
	 * @returns {*} 合并后的对象
	 */
	FAPUI.apply = function ( o, c, defaults ) {
		if ( defaults ) {
			FAPUI.apply ( o, defaults );
		}
		if ( o && c && typeof c === "object" ) {
			for ( var p in c ) {
				o[ p ] = c[ p ];
				if ( typeof o[ p ] === "function" ) {
					o[ p ].$methodName = p;
				}
			}

		}
		return o;
	};

	/**
	 * 有条件合并,同apply,只合并c中的属性在o在不存在的
	 * @method applyIf
	 * @param {*} o 被合并的目标对象
	 * @param {*} c 被合指的对象
	 * @param {*} defaults 默认值
	 * @returns {*} 合并后的对象
	 */
	FAPUI.applyIf = function ( o, c, defaults ) {
		if ( defaults ) {
			FAPUI.applyIf ( o, defaults );
		}
		if ( o && c && typeof c === "object" ) {
			for ( var p in c ) {
				o[ p ] = o[ p ] || c[ p ];
			}
		}
		return o;
	};

	/**
	 * 覆盖类，被覆盖的方法上被定义$methodName方法名，$owner指定被覆盖目标类原方法
	 * @method override
	 * @param {class} origclass 被覆盖目标类
	 * @param {class} overrides 用来覆盖的类
	 */
	FAPUI.override = function ( origclass, overrides ) {
		if ( overrides ) {
			var p = origclass.prototype;

			for ( var k in overrides ) {
				p[ k ] = overrides[ k ];
				if ( typeof p[ k ] === "function" ) {
					p[ k ].$methodName = k;
					p[ k ].$owner = origclass;
				}

			}
		}
	};

	/**
	 * 覆盖类，同override，区别是本方法只合并目标类方法名不存在的方法
	 * @method overrideIf
	 * @param {class} origclass 被覆盖目标类
	 * @param {class} overrides 用来覆盖的类
	 */
	FAPUI.overrideIf = function ( origclass, overrides ) {
		if ( overrides ) {
			var p = origclass.prototype;

			for ( var k in overrides ) {
				if ( p[ k ] ) {
					continue;
				}
				p[ k ] = overrides[ k ];
				if ( typeof p[ k ] === "function" ) {
					p[ k ].$methodName = k;
					p[ k ].$owner = origclass;
				}
			}
		}
	};

	/**
	 * 判断是否为ie6
	 * @method isIE6
	 * @returns {boolean}
	 */
	FAPUI.isIE6 = function () {
		return window.ActiveXObject && ! window.XMLHttpRequest;
	};

	/**
	 * 定义延时任务类，构造函数
	 * @class FAPUI.DelayedTask
	 * @constructor
	 * @param {Function} fn  执行的方法（任务的目标操作）
	 * @param {Object} scope 范围域（上下文环境）
	 * @param {Object|Array} args 方法参数列表
	 * @constructor
	 */
	FAPUI.DelayedTask = function ( fn, scope, args ) {
		var me = this;
		var id;
		/**
		 * 调用任务的目标方法
		 * @method call
		 */
		me.call = function () {
			//取消周期性执行（只执行一次）
			clearInterval ( id );
			id = null;
			fn.apply ( scope, args || [] );
		};

		/**
		 * 延时执行
		 * @method delay
		 * @param {number} delay 延时间隔时间
		 * @param {Function} newFn 新的方法（目标方法），如为空则为构造函数定义的目标方法
		 * @param {Object} newScope 新的范围域，如为空则为构造函数定义的范围域
		 * @param {Object|Array} newArgs 新的参数列表，如为空则为构告函烽的参数列表
		 */
		me.delay = function ( delay, newFn, newScope, newArgs ) {
			//先取消原来的任务
			me.cancel ();
			fn = newFn || fn;
			scope = newScope || scope;
			args = newArgs || args;
			//定义delay毫秒后执行调用call,最终执行fn方法
			id = setInterval ( me.call, delay );
		};

		/**
		 * 取消延时任务
		 */
		me.cancel = function () {
			if ( id ) {
				//取消周期性执行
				clearInterval ( id );
				id = null;
			}
		};
	};

	/**
	 * 定义匿名函数，参数为String,扩展String类
	 * @class String
	 */

	( function ( String ) {
		//所有空格的正则表达式
		var trimRegex = /^[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+|[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+$/g;
		var formatRe = /\{(\d+)\}/g;

		//扩展String方法，format,capitalize,trim,ellipsis,byteLen
		FAPUI.override ( String, {
			/**
			 * 字符串格式化，this为String,
			 * 如：'输入的长度为{0},限制的长度为{1}~{2}'.format(10,4,8) 执行本方法后，
			 *        结果为：输入的长度为10,限制的长度为4~8
			 * @method format
			 * @returns {string}
			 */
			format : function () {
				var args = FAPUI.toArray ( arguments, 0 );

				return this.replace ( formatRe, function ( m, i ) {
					return args[ i ];
				} );
			},
			/**
			 * 字符串首字母大写
			 * @method capitalize
			 * @returns {string}
			 */
			capitalize : function () {
				return this.charAt ( 0 ).toUpperCase () + this.substr ( 1 );
			},

			/**
			 * 字符串首字母小写
			 * @method uncapitalize
			 * @returns {string}
			 */
			uncapitalize : function () {
				return this.charAt ( 0 ).toLowerCase () + this.substr ( 1 );
			},

			/**
			 * 函数从字符串的两端删除空白字符和其他预定义字符
			 * @method trim
			 * @returns {string}
			 */
			trim : function () {
				return this.replace ( trimRegex, "" );
			},

			/**
			 *  截取过长字符，增加省略号
			 *  @method ellipsis
			 * @param {number} len 截取长度
			 * @param {boolean} word 是否按词截取
			 * @returns {string}
			 */
			ellipsis : function ( len, word ) {
				var that = this;

				if ( that.length > len ) {
					if ( word ) {
						var vs = that.substr ( 0, len - 2 );
						var index = Math.max ( vs.lastIndexOf ( " " ), vs.lastIndexOf ( "." ), vs.lastIndexOf ( "!" ),
							vs.lastIndexOf ( "?" ) );

						if ( index !== - 1 && index >= len - 15 ) {
							return vs.substr ( 0, index ) + "...";
						}
					}
					return that.substr ( 0, len - 3 ) + "...";
				}
				return that;
			},

			/**
			 * 字符串的字节长度
			 * @method byteLen
			 * @returns {*}
			 */
			byteLen : function () {
				return this.length + ( this.match ( /[^\x00-\xff]/g ) || "" ).length;
			}
		} );
	} ) ( String );

	/**
	 * 扩展数组方法,indexOf,exist,copy,contains,insertAt,removeAt,remove,each
	 * @class Array
	 */
	FAPUI.apply ( Array.prototype, {
		/**
		 * 获取目标对象的索引值
		 * @method indexOf
		 * @param {*} item 查找目标对象
		 * @returns {number} 索引
		 */
		indexOf : function ( item ) {
			for ( var i = 0; i < this.length; i ++ ) {
				if ( item === this[ i ] ) {
					return i;
				}
			}
			return - 1;
		},

		/**
		 * 判断是否存在目标对象
		 * @method
		 * @param {*} item
		 * @returns {boolean}
		 */
		exist : function ( item ) {
			return this.indexOf ( item ) !== - 1;
		},

		/**
		 * 复制数组
		 * @method copy
		 * @returns {Array}
		 */
		copy : function () {
			return this.concat ();
		},

		/**
		 * 同@see exist
		 * @method contains
		 * @param {*} obj
		 * @returns {boolean}
		 */
		contains : function ( obj ) {
			return this.indexOf ( obj ) !== - 1;
		},

		/**
		 * 插入对象到指定位置
		 * @method insertAt
		 * @param {*} obj
		 * @param {number} i
		 */
		insertAt : function ( obj, i ) {
			this.splice ( i, 0, obj );
		},

		/**
		 * 在obj对象位置前插入obj2
		 * @method insertBefore
		 * @param {*} obj
		 * @param {*} obj2
		 */
		insertBefore : function ( obj, obj2 ) {
			var i = this.indexOf ( obj2 );

			if ( i === - 1 ) {
				this.push ( obj );
			} else {
				this.splice ( i, 0, obj );
			}
		},

		/**
		 * 删除指定位置对象
		 * @method removeAt
		 * @param {number} i
		 */
		removeAt : function ( i ) {
			//如果当前组长度为0，或者i>数组长度时，忽略操作
			if ( this.length === 0 || i > this.length ) {
				return;
			}
			this.splice ( i, 1 );
		},

		/**
		 * 删除指定对象
		 * @method remove
		 * @param {*} obj
		 */
		remove : function ( obj ) {
			var i = this.indexOf ( obj );

			if ( i !== - 1 ) {
				this.splice ( i, 1 );
			}
		},

		/**
		 * 遍历当前数组
		 * @method each
		 * @param {Function} fn
		 * @param {Object} scope
		 */
		each : function ( fn, scope ) {
			var len = this.length;

			if ( typeof fn !== "function" ) {
				throw new TypeError ();
			}
			for ( var i = 0; i < len; i ++ ) {
				if ( i in this ) {
					fn.call ( scope || this, this[ i ], i, this );
				}

			}
		}
	} );

	/**
	 * 扩展Function的函数，createInterceptor，createCallback，createDelegate，defer
	 * @class Function
	 */
	FAPUI.apply ( Function.prototype, {
		/**
		 * 在当前方法上增加拦截器，执行时先执行在当前函数拦截（aop）的fcn方法，只有fcn返回true时，再执行当前方法
		 * @method createInterceptor
		 * @param {Function} fcn aop切入方法
		 * @param {Object} scope 范围域（上下文）
		 * @returns {Function}
		 */
		createInterceptor : function ( fcn, scope ) {
			var that = this;

			return $.isFunction ( fcn ) ? function () {
				var me = this;
				var args = arguments;

				fcn.target = me;
				fcn.method = that;
				return fcn.apply ( scope || me || window, args ) === false ? null : that.apply ( me || window, args );
			} : that;
		},
		/**
		 * 创建回调函数
		 * @method createCallback
		 * @returns {Function}
		 */
		createCallback : function ( /*args...*/ ) {
			// make args available, in function below
			var args = arguments;
			var me = this;

			return function () {
				return me.apply ( window, args );
			};
		},

		/**
		 * 创建代理函数
		 * @method createDelegate
		 * @param {Object} obj
		 * @param {Array} args
		 * @param {boolean|number} appendArgs 其它类型的参数会被忽略掉
		 * @returns {Function}
		 */
		createDelegate : function ( obj, args, appendArgs ) {
			var me = this;

			return function () {
				var callArgs = args || arguments;

				if ( appendArgs === true ) {
					callArgs = Array.prototype.slice.call ( arguments, 0 );
					callArgs = callArgs.concat ( args );
				} else if ( $.isNumeric ( appendArgs ) ) {
					callArgs = Array.prototype.slice.call ( arguments, 0 ); // copy arguments first
					var applyArgs = [ appendArgs, 0 ].concat ( args );// create method call params

					Array.prototype.splice.apply ( callArgs, applyArgs ); // splice them in
				}
				return me.apply ( obj || window, callArgs );
			};
		},

		/**
		 * 延时执行
		 * @method defer
		 * @param {number} millis
		 * @param {Object} obj
		 * @param {Array} args
		 * @param {boolean|number} appendArgs 其它类型的参数会被忽略掉
		 * @returns {number}
		 */
		defer : function ( millis, obj, args, appendArgs ) {
			var fn = this.createDelegate ( obj, args, appendArgs );

			if ( millis > 0 ) {
				return setTimeout ( fn, millis );
			}
			fn ();
			return 0;
		}
	} );

	/**
	 * 定义匿名函数，并立即执行，传入参数为FAPUI
	 */
	( function ( FAPUI ) {
		/**
		 * 对象原型
		 * @property objectPrototype
		 * @type {Object|Function}
		 */
		var objectPrototype = Object.prototype;

		/**
		 * toString方法
		 * @property toString
		 * @type {Function}
		 */
		var toString = objectPrototype.toString;

		/**
		 * 对象构造函数（默认构造函数）
		 * @property oc
		 * @type {Function}
		 */
		var oc = objectPrototype.constructor;

		/**
		 * 空方法
		 * @property F
		 * @constructor
		 */
		var F = function () {
		};

		/**
		 * 创建名字空间
		 * @method _namespace
		 * @param {Array<string>} ns 名字空间的字符串数组
		 * @returns {Object} 名字空间
		 * @private
		 */
		var _namespace = function ( ns ) {
			var len = ns.length;
			var i = 1;
			var current = window[ ns[ 0 ] ];

			if ( current === undefined ) {
				current = window[ ns[ 0 ] ] = {};
			}
			for ( ; i < len; i ++ ) {
				current = current[ ns[ i ] ] = current[ ns[ i ] ] || {};
			}
			return current;
		};

		/**
		 *扩展FAPUI,扩展方法有chain，extend，define，namespace，isClass...等等
		 */

		FAPUI.apply ( FAPUI, {
			/**
			 * 方法链
			 * @method chain
			 * @param  {Object} o
			 * @returns {F}
			 */
			chain : function ( o ) {
				F.prototype = o;
				var result = new F ();

				F.prototype = null;
				return result;
			},
			/**
			 * 扩展
			 * @method extend
			 */
			extend : ( function () {
				/**
				 * 目标对象copy给io
				 * @method io
				 * @param {Object} o 目标对象
				 */
				var io = function ( o ) {
					if ( o ) {
						for ( var m in o ) {
							this[ m ] = o[ m ];
						}
					}
				};

				/**
				 * 获取指定类的父类（函数）
				 * @method superclass
				 * @param {Function} sp 指定类（函数）
				 * @returns {Function}
				 */
				var superclass = function ( sp ) {
					/**
					 * 获取方法调用者父类
					 * @method s
					 * @returns {*}
					 */
					var s = function () {
						return arguments.callee.superclass;
					};

					s.superclass = sp;
					return s;
				};

				return function ( sb, sp, overrides ) {
					//如果父类存在
					if ( typeof sp === "object" ) {
						overrides = sp;
						sp = sb;
						sb = overrides.constructor === oc ? function () {
							sp.apply ( this, arguments );
						} : overrides.constructor;

					}
					/**
					 * 子类原型
					 * @property sbp
					 * @type {Function|Object}
					 */
					var sbp;

					/**
					 * 父类原型
					 * @property spp
					 * @type {Function|Object}
					 */
					var spp = sp.prototype;

					sbp = sb.prototype = FAPUI.chain ( spp );
					sbp.constructor = sb;
					//子类的superclass定义上父类的原型
					sb.superclass = spp;
					if ( spp.constructor === oc ) {
						spp.constructor = sp;
					}
					/**
					 * 子类的覆盖方法，将o的属性覆盖子类
					 * @method override
					 * @param {*} o 用于覆盖的对象
					 */
					sb.override = function ( o ) {
						FAPUI.override ( sb, o );
					};

					/**
					 * 子类原型的覆盖方法，定义为io
					 * @type {Function}
					 */
					sbp.override = io;
					//overrides 覆盖sb
					FAPUI.override ( sb, overrides );
					/**
					 * 子类的扩展方法
					 * @method  extend
					 * @param {*} o
					 * @returns {*}
					 */
					sb.extend = function ( o ) {
						return FAPUI.extend ( sb, o );
					};
					//sb.$isClass = true;
					//定义子类的supperclass,supper
					sbp.superclass = sbp.supper = superclass ( ( function () {
						return spp;
					} ) () );
					return sb;
				};
			} ) (),
			/**
			 * 定义类，用法如下：
			 * FAPUI.define("",{
             *      "extend":"",
             *      "statics":{},
             *      "props":{},
             *      "override":{}
             *      });
			 * @method define
			 * @param {string} className 定义的类名
			 * @param {config} d 定义类的配置情况
			 */
			define : function ( className, d ) {
				var sb;

				if ( ! FAPUI.isString ( className ) || FAPUI.isDefined ( window[ className ] ) ) {
					return;
				}
				var or = d.override;
				var sp = FAPUI.isFunction ( d.extend ) ? d.extend :
					FAPUI.isString ( d.extend ) && FAPUI.isDefined ( window[ d.extend ] ) ? window[ d.extend ] :
						function () {};
				var props = d.props;
				var statics = d.statics;
				var ns = className.split ( "." );
				var pLen = ns.length;

				delete d.override;
				delete d.extend;
				delete d.props;
				delete d.statics;

				d.className = className;
				d.parentClass = sp;
				d.parentClassName = sp.prototype.className;
				sb = FAPUI.extend ( sp, d );
				//设置类标志
				sb.$isClass = true;
				if ( pLen > 1 ) {
					//将定义的类sb在全局中定义如下：com.sunyard.fapui.Sample
					window[ className ] = _namespace ( ns.slice ( 0, pLen - 1 ) )[ ns[ pLen - 1 ] ] = sb;
				} else {
					window[ ns[ 0 ] ] = sb;
				}
				if ( props ) {
					FAPUI.override ( sb, props );
					//将属性增加对应的getter,setter方法
					for ( var k in props ) {
						var getter = "get" + k.capitalize ();
						var setter = "set" + k.capitalize ();
						var o = {};

						o[ getter ] = ( function ( p ) {
							return function () {
								return this[ p ];
							};
						} ) ( k );
						o[ setter ] = ( function ( p ) {
							return function ( v ) {
								return this[ p ] = v;
							};
						} ) ( k );
						FAPUI.overrideIf ( sb, o );
					}
				}
				//覆盖属性
				if ( or ) {
					FAPUI.override ( sb, or );
				}
				for ( var k in statics ) {
					sb[ k ] = statics[ k ];
				}

			},
			/**
			 * 命名空间
			 * @method namespace
			 * @returns {*}
			 */
			namespace : function () {
				var len1 = arguments.length;
				var i = 0; //len2,
				var main;
				var ns; //sub,
				var current;

				for ( ; i < len1; ++ i ) {
					main = arguments[ i ];
					ns = arguments[ i ].split ( "." );
					//复用_namespace
					current = _namespace ( ns );
				}
				return current;
			},
			/**
			 * 判断目标对象是不为类
			 * @method isClass
			 * @param {*} c 目标对象
			 * @returns {boolean}
			 */
			isClass : function ( c ) {
				return FAPUI.isFunction ( c ) && c.$isClass === true;
			},
			/**
			 * 检查是不是为空，当null,undefined,数组长度为0时，返回ture，如果不允许空格时，""也认为是空，返回true
			 * @method isEmpty
			 * @param {*} v 检查对象
			 * @param {boolean} allowBlank 是否允许字符串为空格
			 * @returns {boolean}
			 */
			isEmpty : function ( v, allowBlank ) {
				return v === null || v === undefined || FAPUI.isArray ( v ) && ! v.length || allowBlank ? false :
				v === "";
			},
			/**
			 * 判断是否为数组
			 * @method isArray
			 * @param {*} v
			 * @returns {boolean}
			 */
			isArray : function ( v ) {
				return toString.apply ( v ) === "[object Array]";
			},

			/**
			 * 判断是否为日期
			 * @method isDate
			 * @param {*} v
			 * @returns {boolean}
			 */
			isDate : function ( v ) {
				return toString.apply ( v ) === "[object Date]";
			},

			/**
			 * 判断是否为对象
			 *  @method isObject
			 * @param {*} v
			 * @returns {boolean}
			 */
			isObject : function ( v ) {
				return v && Object.prototype.toString.call ( v ) === "[object Object]";
			},

			/**
			 * 判断是否为基础数据类型
			 * @method isPrimitive
			 * @param {*} v
			 * @returns {boolean}
			 */
			isPrimitive : function ( v ) {
				return FAPUI.isString ( v ) || FAPUI.isNumber ( v ) || FAPUI.isBoolean ( v );
			},
			/**
			 * 判断是否为函数
			 * @method isFunction
			 * @param {*} v
			 * @returns {boolean}
			 */
			isFunction : function ( v ) {
				return toString.apply ( v ) === "[object Function]";
			},

			/**
			 * 判断是否为数字
			 * @method isNumber
			 * @param {*} v
			 * @returns {boolean}
			 */
			isNumber : function ( v ) {
				return typeof v === "number" && isFinite ( v );
			},

			/**
			 * 判断是否是字符串
			 * @method isString
			 * @param {*} v
			 * @returns {boolean}
			 */
			isString : function ( v ) {
				return typeof v === "string";
			},

			/**
			 * 判断是否是布尔值
			 * @method isBoolean
			 * @param {*} v
			 * @returns {boolean}
			 */
			isBoolean : function ( v ) {
				return typeof v === "boolean";
			},

			/**
			 * 判断是否是dom节点
			 * @method isDomEl
			 * @param {*} v
			 * @returns {boolean}
			 */
			isDomEl : function ( v ) {
				return v ? v.tagName !== undefined : false;
			},

			/**
			 * 判断值是否已定义
			 * @method isDefined
			 * @param {*} v
			 * @returns {boolean}
			 */
			isDefined : function ( v ) {
				return typeof v !== "undefined";
			},

			/**
			 * 遍历数组
			 * @method each
			 * @param {Array} array
			 * @param {Function} fn
			 * @param {Object} scope
			 * @returns {number}
			 */
			each : function ( array, fn, scope ) {
				if ( fn ) {
					for ( var i = 0, len = array.length; i < len; i ++ ) {
						if ( fn.call ( scope || array[ i ], array[ i ], i, array ) === false ) {
							return i;
						}
					}
				}
			},

			/**
			 * 获取对象类型
			 * @method type
			 * @param {*} obj
			 * @returns {string}
			 */
			type : function ( obj ) {
				return obj == null ? String ( obj ) : class2type[ toString.call ( obj ) ] || "object";
			},
			/**
			 * 获取窗体的宽与高
			 * @method bodysize
			 * @returns {Array} 0位置是宽度，1位置是高度
			 */
			bodysize : function () {
				var _h = parent.document.documentElement.clientHeight;
				var _h2 = parent.document.body.clientHeight;

				_h = _h > _h2 ? _h : _h2;
				return [ document.body.clientWidth, _h ];
			}
		} );

	} ) ( FAPUI );

	//定义全局变量的FAPUI
	global.FAPUI = global.FAPUI || FAPUI;

	//主要的对象映射类型
	"Boolean Number String Function Array Date RegExp Object".split ( " " ).each ( function ( name ) {
		class2type[ "[object " + name + "]" ] = name.toLowerCase ();
	} );


	/**
	 * 扩展Math
	 * @class Math
	 */

	FAPUI.apply ( Math, {
		/**
		 * 指定位数四舍五入。
		 * @method roundEx
		 * @param {number} n 被操作的数值
		 * @param {number} f 指定位数
		 * @returns {number}
		 */
		roundEx : function ( n, f ) {
			var p = Math.pow ( 10, f );

			return Math.round ( n * p ) / p;
		}
	} );


	//处理ie上的console未定义的问题
	if ( ! window.console || ! console.firebug ) {
		var names = [ "log", "debug", "info", "warn", "error", "assert", "dir", "dirxml", "group", "groupEnd", "time", "timeEnd", "count", "trace", "profile", "profileEnd" ];

		window.console = {};
		for ( var i = 0; i < names.length; ++ i ) {
			window.console[ names[ i ] ] = function () {}
		}
	}

} ) ( window );
