 /**
 * 定义FAPUI.Observable所有组件的基类
 * @class FAPUI.Observable
 * @extends FAPUI.Base
 */

define ( function ( require ) {

	require ( "./fapui-base" );

	( function () {

		var EACH = FAPUI.each;
		var	TRUE = true;
		var	FALSE = false;

		/**
		 * 创建目标对象
		 * @private
		 * @param {Object} h
		 * @param {Object} o
		 * @param {Object} scope
		 */
		var createTargeted = function ( h, o, scope ) {
			return function () {
				if ( o.target === arguments[ 0 ] ) {
					h.apply ( scope, Array.prototype.slice.call ( arguments, 0 ) );
				}
			};
		};

		/**
		 * 创建缓冲对象
		 * @private
		 * @param {Object} h
		 * @param {Object} o
		 * @param {Object} l
		 * @param {Object} scope
		 */
		var createBuffered = function ( h, o, l, scope ) {
			l.task = new FAPUI.DelayedTask ();
			return function () {
				l.task.delay ( o.buffer, h, scope, Array.prototype.slice.call ( arguments, 0 ) );
			};
		};

		/**
		 * createSingle
		 * @private
		 * @param {Object} h
		 * @param {Object} e
		 * @param {Fun} fn
		 * @param {Object} scope
		 */
		var createSingle = function ( h, e, fn, scope ) {
			return function () {
				e.removeListener ( fn, scope );
				return h.apply ( scope, arguments );
			};
		};

		/**
		 * createDelayed
		 * @private
		 * @param {Object} h
		 * @param {Object} o
		 * @param {Object} l
		 * @param {Object} scope
		 */
		var createDelayed = function ( h, o, l, scope ) {
			return function () {
				var task = new FAPUI.DelayedTask ();
				var	args = Array.prototype.slice.call ( arguments, 0 );

				if ( ! l.tasks ) {
					l.tasks = [];
				}
				l.tasks.push ( task );
				task.delay ( o.delay || 10, function () {
					l.tasks.remove ( task );
					h.apply ( scope, args );
				}, scope );
			};
		};

		/**
		 * 事件对象
		 * @private
		 * @param {Object}obj
		 * @param {string}name
		 */
		FAPUI.Event = function ( obj, name ) {
			this.name = name;
			this.obj = obj;
			this.listeners = [];
		};
		FAPUI.Event.prototype = {
			/**
			 * 添加事件监听器
			 * @method addListener
			 * @param {Fun} fn 函数
			 * @param {Object} scope 作用域
			 * @param {Object} options 选项参数
			 */
			addListener : function ( fn, scope, options ) {
				var me = this;
				var	l;

				scope = scope || me.obj;
				if ( ! me.isListening ( fn, scope ) ) {
					l = me.createListener ( fn, scope, options );
					if ( me.firing ) { // 如果事件触发正在进行,则不打扰正在执行的数组,重新创建数组
						me.listeners = me.listeners.slice ( 0 );
					}
					me.listeners.push ( l );
				}
			},
			/**
			 * 创建事件监听器
			 * @private
			 * @param {Fun} fn 函数
			 * @param {Object} scope 作用域
			 * @param {Object} o 选项参数
			 */
			createListener : function ( fn, scope, o ) {
				o = o || {};
				scope = scope || this.obj;
				var l = {
					fn : fn,
					scope : scope,
					options : o
				};

				var h = fn;

				if ( o.target ) {
					h = createTargeted ( h, o, scope );
				}
				if ( o.delay ) {
					h = createDelayed ( h, o, l, scope );
				}
				if ( o.single ) {
					h = createSingle ( h, this, fn, scope );
				}
				if ( o.buffer ) {
					h = createBuffered ( h, o, l, scope );
				}
				l.fireFn = h;
				return l;
			},
			/**
			 * 查找事件监听器
			 * @private
			 * @param {Fun} fn 函数
			 * @param {Object} scope 作用域
			 */
			findListener : function ( fn, scope ) {
				var list = this.listeners;
				var	i = list.length;
				var	l;

				scope = scope || this.obj;
				while ( i -- ) {
					l = list[ i ];
					if ( l ) {
						if ( l.fn === fn && l.scope === scope ) {
							return i;
						}
					}
				}
				return - 1;
			},
			/**
			 * 该函数是否在监听
			 * @private
			 * @param {Fun} fn 函数
			 * @param {Object} scope 作用域
			 */
			isListening : function ( fn, scope ) {
				return this.findListener ( fn, scope ) !== - 1;
			},
			/**
			 * 移除监听函数
			 * @method removeListener
			 * @param {Fun} fn 函数
			 * @param {Object} scope 作用域
			 */
			removeListener : function ( fn, scope ) {
				var index;
				var	l;
				var	k;
				var	me = this;
				var	ret = FALSE;

				if ( ( index = me.findListener ( fn, scope ) ) !== - 1 ) {
					if ( me.firing ) {
						me.listeners = me.listeners.slice ( 0 );
					}
					l = me.listeners[ index ];
					if ( l.task ) {
						l.task.cancel ();
						delete l.task;
					}
					k = l.tasks && l.tasks.length;
					if ( k ) {
						while ( k -- ) {
							l.tasks[ k ].cancel ();
						}
						delete l.tasks;
					}
					me.listeners.splice ( index, 1 );
					ret = TRUE;
				}
				return ret;
			},
			/**
			 * 移除所有监听函数
			 * @private
			 */
			clearListeners : function () {
				var me = this;
				var	l = me.listeners;
				var	i = l.length;

				while ( i -- ) {
					me.removeListener ( l[ i ].fn, l[ i ].scope );
				}
			},
			/**
			 * 触发该事件
			 * @private
			 */
			fire : function () {
				var me = this;
				var listeners = me.listeners;
				var	len = listeners.length;
				var i = 0;
				var	l;

				if ( len > 0 ) {
					me.firing = TRUE;
					var args = Array.prototype.slice.call ( arguments, 0 );

					for ( ; i < len; i ++ ) {
						l = listeners[ i ];
						if ( l && l.fireFn.apply ( l.scope || me.obj || window, args ) === FALSE ) {
							return me.firing = FALSE;
						}
					}
				}
				me.firing = FALSE;
				return TRUE;
			}
		};

		FAPUI.define ( "FAPUI.Observable", {
			extend : "FAPUI.Base",

			/**
			 * 构造方法
			 * @constructor
			 */
			constructor : function ( cfg ) {
				this.callParent ( [ cfg ] );
				FAPUI.apply ( this, cfg || {} );
				//FAPUI.Base.constructor.apply(this,arguments);
				var me = this;

				var e = me.events;

				me.events = e || {};
				this.alias ( "addListener", "on" );
				this.alias ( "removeListener", "un" );

				if ( me.listeners ) {
					me.on ( me.listeners );
					delete me.listeners;

					/*var scope = me.listeners.scope || this;
					 delete me.listeners.scope;
					 for(var k in this.listeners){
					 var o = this.listeners[k];
					 this.on(k,o.fn||o,o.scope||scope);
					 }*/
				}
			},
			override : {

				/**
				 * 过滤
				 * @private
				 * @type String
				 */
				filterOptRe : /^(?:scope|delay|buffer|single)$/,

				/**
				 * 触发事件
				 * @private
				 */
				fireEvent : function () {
					var a = Array.prototype.slice.call ( arguments, 0 );
					var ename = a[ 0 ].toLowerCase ();
					var me = this;
					var ret = TRUE;
					var ce = me.events[ ename ];
					var cc;
					var q;
					var c;

					if ( me.eventsSuspended === TRUE ) {
						if ( q = me.eventQueue ) {
							q.push ( a );
						}
					} else if ( typeof ce === "object" ) {
						if ( ce.bubble ) {
							if ( ce.fire.apply ( ce, a.slice ( 1 ) ) === FALSE ) {
								return FALSE;
							}
							c = me.getBubbleTarget && me.getBubbleTarget ();
							if ( c && c.enableBubble ) {
								cc = c.events[ ename ];
								if ( ! cc || typeof cc !== "object" || ! cc.bubble ) {
									c.enableBubble ( ename );
								}
								return c.fireEvent.apply ( c, a );
							}
						} else {
							a.shift ();
							ret = ce.fire.apply ( ce, a );
						}
					}
					return ret;
				},

				/**
				 * 添加事件
				 * @method addListener
				 * @param {string} eventName - 事件名
				 * @param {Fun} fn
				 * @param {Object} scope
				 * @param {Object} o
				 */
				addListener : function ( eventName, fn, scope, o ) {
					var me = this;
					var e;
					var oe;
					var ce;

					if ( typeof eventName === "object" ) {
						o = eventName;
						for ( e in o ) {
							if ( o.hasOwnProperty ( e ) ) {
								oe = o[ e ];
								if ( ! me.filterOptRe.test ( e ) ) {
									me.addListener ( e, oe.fn || oe, oe.scope || o.scope,
										oe.fn ? oe : o );
								}
							}

						}
					} else {
						eventName = eventName.toLowerCase ();
						ce = me.events[ eventName ] || TRUE;
						if ( typeof ce === "boolean" ) {
							me.events[ eventName ] = ce = new FAPUI.Event ( me, eventName );
						}
						ce.addListener ( fn, scope, typeof o === "object" ? o : {} );
					}
				},

				/**
				 * 移除事件
				 * @method removeListener
				 * @param {string} eventName - 事件名
				 * @param {Fun} fn
				 * @param {Object} scope
				 */
				removeListener : function ( eventName, fn, scope ) {
					var ce = this.events[ eventName.toLowerCase () ];

					if ( typeof ce === "object" ) {
						ce.removeListener ( fn, scope );
					}
				},

				/**
				 * 移除所有事件处理函数
				 * @private
				 */
				purgeListeners : function () {
					var events = this.events;
					var evt;
					var key;

					for ( key in events ) {
						if ( events.hasOwnProperty ( key ) ) {
							evt = events[ key ];
							if ( typeof evt === "object" ) {
								evt.clearListeners ();
							}
						}

					}
				},

				/**
				 * 添加事件
				 * @method addEvents
				 * @param {string} o
				 */
				addEvents : function ( o ) {
					var me = this;

					me.events = me.events || {};
					if ( typeof o === "string" ) {
						var a = arguments;
						var i = a.length;

						while ( i -- ) {
							me.events[ a[ i ] ] = me.events[ a[ i ] ] || TRUE;
						}
					} else {
						FAPUI.applyIf ( me.events, o );
					}
				},

				/**
				 * 指定事件是否有处理函数
				 * @method hasListener
				 * @param {string} eventName -事件名
				 */
				hasListener : function ( eventName ) {
					var e = this.events[ eventName.toLowerCase () ];

					return typeof e === "object" && e.listeners.length > 0;
				},

				/**
				 * 暂停事件触发
				 * @method suspendEvents
				 * @param {Object} queueSuspended - 事件
				 */
				suspendEvents : function ( queueSuspended ) {
					this.eventsSuspended = TRUE;
					if ( queueSuspended && ! this.eventQueue ) {
						this.eventQueue = [];
					}
				},

				/**
				 * 恢复事件处理
				 * @private
				 */
				resumeEvents : function () {
					var me = this;
					var queued = me.eventQueue || [];

					me.eventsSuspended = FALSE;
					delete me.eventQueue;
					EACH ( queued, function ( e ) {
						me.fireEvent.apply ( me, e );
					} );
				}
			}
		} );

	} ) ();

	return FAPUI.Observable;

} );