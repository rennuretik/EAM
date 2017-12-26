/**
 **拖拽管理
 *@class FAPUI.DragDrop
 *@extends FAPUI.Observable
 *
 */
define ( function ( require, exports, module ) {

	require ( "./fapui-observable" );

	FAPUI.define ( "FAPUI.DragDrop", {
		extend : "FAPUI.Observable", /**
		 *
		 * @param {Object} c
		 */
		constructor : function ( c ) {
			var me = this;
			var _pCfg = c.listeners ? {
				listeners : c.listeners
			} : {};

			me.callParent ( [ _pCfg ] );	//调用父类
			me.addEvents ( /**
				 *拽的时候触发
				 *@event drag
				 *@param drapdrop {Object} Drapdrop对象
				 *@param event {Event} 事件对象
				 */
				"drag", /**
				 *拖的时候触发
				 *@event drop
				 *@param drapdrop {Object} Drapdrop对象
				 *@param event {Event} 事件对象
				 */
				"drop" );
			delete c.listeners;
			me.el = FAPUI.fly ( c.el );
			delete c.el;
			var options = {//默认值
				/**
				 * 设置触发对象（不设置则使用拖放对象）
				 * @property handlerEl
				 * @type EL
				 */
				handlerEl : "", /**
				 * 是否设置范围限制(为true时下面参数有用,可以是负数),默认值为false
				 * @property limit
				 * @type Boolean
				 *
				 */
				limit : false, /**
				 * 左边限制,默认值为0;
				 * @property mxLeft
				 * @type Number
				 *
				 */
				mxLeft : 0, /**
				 * 右边限制,默认值为9999;
				 * @property mxRight
				 * @type Number
				 *
				 */
				mxRight : 9999, /**
				 * 上边限制,默认值为0;
				 * @property mxTop
				 * @type Number
				 *
				 */
				mxTop : 0, /**
				 * 下边限制,默认值为9999;
				 * @property mxBottom
				 * @type Number
				 *
				 */
				mxBottom : 9999, /**
				 * 指定限制在容器内
				 * @property container
				 * @type String
				 *
				 */
				container : "",

				/**
				 * 是否锁定水平方向拖放,默认值为false
				 * @property lockX
				 * @type Boolean
				 *
				 */
				lockX : false,

				/**
				 * 是否锁定垂直方向拖放,默认值为false
				 * @property lockY
				 * @type Boolean
				 *
				 */
				lockY : false,

				/**
				 * 是否锁定,默认值为false
				 * @property lock
				 * @type Boolean
				 *
				 */
				lock : false
			};

			FAPUI.apply ( me, c, options );

			me._fM = me.move.createDelegate ( this );//mousemove移动时的事件委托,这么做是为了事件绑定的移除
			me._fS = me.stop.createDelegate ( this );//mouseup的事件委托,这么做是为了事件绑定的移除

			me._handleEl = me.handlerEl ? FAPUI.fly ( me.handlerEl ) : me.el;//作用有移动的元素
			this._mxContainer = me.container ? FAPUI.fly ( me.container ) : null;
			if ( this._mxContainer ) {
				me.limit = true;
			}

			me.el.css ( "position", "absolute" );
			me._handleEl.css ( "cursor", "move" );

			if ( $.browser.msie ) {
				$ ( "div", {
					style : "width:100%;height:100%;backgroundColor:#fff;filter:alpha(opacity:0);fontSize:0;"
				} ).appendTo ( me._handleEl );
			}
			me.repair ();//修复位置
			me._handleEl.mousedown ( me.start.createDelegate ( this ) );
		}, override : {
			/**
			 *
			 * @param {*} oEvent
			 */
			start : function ( oEvent ) {
				if ( this.lock ) {
					return;
				}
				this.el.css ( "z-index", FAPUI.zindex ++ );

				this.proxy = this.getProxy ( this.el ).insertAfter ( this.el );
				this.proxy.attr ( "id", FAPUI.getId () );
				this.proxy.css ( "position", "absolute" );
				this.proxy.css ( "z-index", FAPUI.zindex ++ );

				this.repair ();
				//记录鼠标相对拖放对象的位置
				this._x = oEvent.clientX - this.el.get ( 0 ).offsetLeft;
				this._y = oEvent.clientY - this.el.get ( 0 ).offsetTop;
				//记录margin
				this._marginLeft = parseInt ( this.el.get ( 0 ).style.marginLeft ) || 0;
				this._marginTop = parseInt ( this.el.get ( 0 ).style.marginTop ) || 0;

				this._initPosition = {
					x : this.el.get ( 0 ).offsetLeft,
					y : this.el.get ( 0 ).offsetTop,
					w : this.el.get ( 0 ).offsetWidth,
					h : this.el.get ( 0 ).offsetHeight
				};

				//mousemove时移动 mouseup时停止
				$ ( document ).mousemove ( this._fM );
				$ ( document ).mouseup ( this._fS );
				if ( $.browser.msie ) {
					//焦点丢失
					this._handleEl.bind ( "losecapture", this._fS );
					//设置鼠标捕获
					this._handleEl.get ( 0 ).setCapture ();
				} else {
					//焦点丢失
					$ ( window ).bind ( "blur", this._fS );
					//阻止默认动作
					oEvent.preventDefault ();
				}
				;

				this.proxy.show ();
				this.el.hide ();
			},
			/**
			 *
			 * @param {*} oEvent
			 */
			move : function ( oEvent ) {
				if ( this.lock ) {
					return;
				}
				;
				//清除选择
				window.getSelection ? window.getSelection ().removeAllRanges () : document.selection.empty ();

				//设置移动参数
				var iLeft = oEvent.clientX - this._x;
				var iTop = oEvent.clientY - this._y;
				//设置范围限制
				if ( this.limit ) {
					//设置范围参数
					var mxLeft = this.mxLeft;
					var mxRight = this.mxRight;
					var mxTop = this.mxTop;
					var mxBottom = this.mxBottom;
					//如果设置了容器，再修正范围参数
					if ( this._mxContainer ) {
						mxLeft = Math.max ( mxLeft, 0 );
						mxTop = Math.max ( mxTop, 0 );
						mxRight = Math.min ( mxRight, this._mxContainer.get ( 0 ).clientWidth );
						mxBottom = Math.min ( mxBottom, this._mxContainer.get ( 0 ).clientHeight );
					}
					;
					//修正移动参数
					iLeft = Math.max ( Math.min ( iLeft, mxRight - this._initPosition.w ), mxLeft );
					iTop = Math.max ( Math.min ( iTop, mxBottom - this._initPosition.h ), mxTop );
				}
				//设置位置，并修正margin
				//if(!this.lockX){ this.el.css("left",iLeft - this._marginLeft);}
				//if(!this.lockY){ this.el.css("top",iTop - this._marginTop); }
				this._fp = {
					"x" : iLeft - this._marginLeft,
					"y" : iTop - this._marginTop
				};
				if ( ! this.lockX ) {
					this.proxy.css ( "left", this._fp.x );
				}
				if ( ! this.lockY ) {
					this.proxy.css ( "top", this._fp.y );
				}
				this.fireEvent ( "drag", this, oEvent );
			},
			/**
			 *
			 * @param {*} oEvent
			 */
			stop : function ( oEvent ) {
				this.proxy.remove ();
				this.el.show ();
				if ( ! this.lockX ) {
					this.el.css ( "left", this._fp.x );
				}
				if ( ! this.lockY ) {
					this.el.css ( "top", this._fp.y );
				}
				//移除事件
				$ ( document ).unbind ( "mousemove", this._fM );
				$ ( document ).unbind ( "mouseup", this._fS );
				if ( $.browser.msie ) {
					this._handleEl.unbind ( "losecapture", this._fS );
					this._handleEl.get ( 0 ).releaseCapture ();
				} else {
					$ ( window ).unbind ( "blur", this._fS );
				}
				;
				this.fireEvent ( "drop", this, oEvent );
			},
			/**
			 *修复
			 */
			repair : function () {
				if ( this.limit ) {
					//修正错误范围参数
					this.mxRight = Math.max ( this.mxRight, this.mxLeft + this.el.get ( 0 ).offsetWidth );
					this.mxBottom = Math.max ( this.mxBottom, this.mxTop + this.el.get ( 0 ).offsetHeight );
					//如果有容器必须设置position为relative或absolute来相对或绝对定位，并在获取offset之前设置
					! this._mxContainer || this._mxContainer.css ( "position", "relative" );
				}
			},
			/**
			 *
			 * @param {*} el
			 * @returns {*}
			 */
			getProxy : function ( el ) {
				var _el = el.clone ();

				_el.css ( {
					"filter" : "alpha(opacity:30)"
				} );
				return _el;
			}
		}
	} );

	return FAPUI.DragDrop;
} );