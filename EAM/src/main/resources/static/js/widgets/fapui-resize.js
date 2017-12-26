/**
 *定义FAPUI.Resize组件拖动处理
 *@class FAPUI.Resize
 *@extend FAPUI.Observable
 */

define ( function ( require, exports, module ) {

	require ( "./fapui-observable" );

	FAPUI.define ( "FAPUI.Resize", {
		extend : "FAPUI.Observable",

		/**
		 * 构造方法初始化
		 * @constructor
		 */
		constructor : function ( c ) {
			var me = this;
			var _pCfg = c.listeners ? {
				listeners : c.listeners
			} : {};

			me.callParent ( [ _pCfg ] );	//调用父类
			me.addEvents ( "resize" );
			delete c.listeners;
			me.el = FAPUI.fly ( c.el );
			delete c.el;
			var options = {//默认值

				/**
				 * 是否设置范围限制(为true时下面mx参数有用)
				 * @property max
				 * @type boolean
				 * @default false
				 */
				max : false,

				/**
				 * 容器对象,即对象只能在该容器范围改变大小
				 * @property container
				 * @type String
				 * @default ""
				 */
				container : "",

				/**
				 * 左边限制,只有在max为true时
				 * @property mxLeft
				 * @type Number
				 * @default 0
				 */
				mxLeft : 0,

				/**
				 * 右边限制,只有在max为true时
				 * @property mxRight
				 * @type Number
				 * @default 9999
				 */
				mxRight : 9999,

				/**
				 * 上边限制,只有在max为true时
				 * @property mxTop
				 * @type Number
				 * @default 0
				 */
				mxTop : 0,

				/**
				 * 下边限制,只有在max为true时
				 * @property mxBottom
				 * @type Number
				 * @default 9999
				 */
				mxBottom : 9999,

				/**
				 * 是否最小宽高限制(为true时下面min参数有用)
				 * @property min
				 * @type boolean
				 * @default false
				 */
				min : false,

				/**
				 * 最小宽度,只有在min为true时
				 * @property minWidth
				 * @type Number
				 * @default 50
				 */
				minWidth : 50,

				/**
				 * 最小高度,只有在min为true时
				 * @property minHeight
				 * @type Number
				 * @default 50
				 */
				minHeight : 50,

				/**
				 * 是否按比例缩放
				 * @property scale
				 * @type boolean
				 * @default false
				 */
				scale : false,

				/**
				 * 缩放比例(宽/高)
				 * @property ratio
				 * @type Number
				 * @default 0
				 */
				ratio : 0,

				/**
				 * 是否自动创建缩放的操作句柄
				 * @property createHandler
				 * @type boolean
				 * @default true
				 */
				createHandler : true
			};

			FAPUI.apply ( me, c, options );
			this.initStatus ();
			if ( this.createHandler ) {
				this.initHandler ();
			}
		}, override : {

			/**
			 * 初始化拖动对象的参数
			 * @private
			 */
			initStatus : function () {
				this._styleWidth = this._styleHeight = this._styleLeft = this._styleTop = 0;//样式参数
				this._sideRight = this._sideDown = this._sideLeft = this._sideUp = 0;//坐标参数
				this._fixLeft = this._fixTop = 0;//定位参数
				this._scaleLeft = this._scaleTop = 0;//定位坐标
				/**
				 *
				 * @private
				 */
				this._mxSet = function () {};//范围设置程序
				this._mxRightWidth = this._mxDownHeight = this._mxUpHeight = this._mxLeftWidth = 0;//范围参数
				this._mxScaleWidth = this._mxScaleHeight = 0;//比例范围参数
				/**
				 *
				 * @private
				 */
				this._fun = function () {};//缩放执行程序

				//获取边框宽度
				this._borderX = ( parseInt ( this.el.css ( "border-left-width" ) ) ||
					0 ) + ( parseInt ( this.el.css ( "border-right-width" ) ) || 0 );
				this._borderY = ( parseInt ( this.el.css ( "border-top-width" ) ) ||
					0 ) + ( parseInt ( this.el.css ( "border-bottom-width" ) ) || 0 );
				//事件对象(用于绑定移除事件)
				this._fR = this.resize.createDelegate ( this );
				this._fS = this.stop.createDelegate ( this );
				this._fE = this.end.createDelegate ( this );

				//范围限制
				this.max = this.max;
				this._mxContainer = this.container ? FAPUI.fly ( this.container ) : null;
				this.mxLeft = Math.round ( this.mxLeft );
				this.mxRight = Math.round ( this.mxRight );
				this.mxTop = Math.round ( this.mxTop );
				this.mxBottom = Math.round ( this.mxBottom );
				//宽高限制
				this.min = this.min;
				this.minWidth = Math.round ( this.minWidth );
				this.minHeight = Math.round ( this.minHeight );
				//按比例缩放
				this.scale = this.scale;
				this.ratio = Math.max ( this.ratio, 0 );

				//this.el.css("postion","absolute");
				! this._mxContainer || this._mxContainer.css ( "position", "relative" );

			},

			/**
			 * 初始化要改变大小的句柄
			 * @private
			 */
			initHandler : function () {
				if ( this.el.children ( "div.resize-handler" ).size () === 0 ) {
					this.el.prepend ( "<div class=\"resize-handler rRight\" />" +
					"<div class=\"resize-handler rLeft\" />" +
					"<div class=\"resize-handler rUp\" />" +
					"<div class=\"resize-handler rDown\" />" +
					"<div class=\"resize-handler rRightDown\" />" +
					"<div class=\"resize-handler rLeftDown\" />" +
					"<div class=\"resize-handler rRightUp\" />" +
					"<div class=\"resize-handler rLeftUp\" />" );
				}
				this.set ( this.el.children ( "div.rRight" ), "right" );
				this.set ( this.el.children ( "div.rLeft" ), "left" );
				this.set ( this.el.children ( "div.rUp" ), "up" );
				this.set ( this.el.children ( "div.rDown" ), "down" );
				this.set ( this.el.children ( "div.rRightDown" ), "right-down" );
				this.set ( this.el.children ( "div.rLeftDown" ), "left-down" );
				this.set ( this.el.children ( "div.rRightUp" ), "right-up" );
				this.set ( this.el.children ( "div.rLeftUp" ), "left-up" );
			},

			/**
			 * 设置触发对象
			 * @method set
			 * @param {Object} resize 要改变大小的对象
			 * @param {string} side 要改变大小的方向
			 */
			set : function ( resize, side ) {

				var resize = FAPUI.fly ( resize );
				var fun;

				if ( ! resize || resize.size () === 0 ) {
					return;
				}
				// 根据方向设置
				switch ( side.toLowerCase () ) {
					case "up" : {
						fun = this.Up;
						break;
					}
					case "down" : {
						fun = this.Down;
						break;
					}
					case "left" : {
						fun = this.Left;
						break;
					}
					case "right" : {
						fun = this.Right;
						break;
					}
					case "left-up" : {
						fun = this.LeftUp;
						break;
					}
					case "right-up" : {
						fun = this.RightUp;
						break;
					}
					case "left-down" : {
						fun = this.LeftDown;
						break;
					}
					case "right-down" : {
						break;
					}
					default : {
						fun = this.RightDown;
					}
				}
				;
				//设置触发对象
				resize.mousedown ( this.start.createDelegate ( this, [ fun ], true ) );
			},

			/**
			 * 开始改变大小
			 * @private
			 */
			start : function ( e, fun, touch ) {
				//防止冒泡(跟拖放配合时设置)
				e.stopPropagation ? e.stopPropagation () : ( e.cancelBubble = true );
				//设置执行程序
				this._fun = fun;
				var _obj = this.el.get ( 0 );
				//样式参数值
				this._styleWidth = _obj.clientWidth;
				this._styleHeight = _obj.clientHeight;
				this._styleLeft = $ ( _obj ).offset ().left;//_obj.offsetLeft;
				this._styleTop = $ ( _obj ).offset ().top;

				this._initPosition = {
					x : this._styleLeft, y : this._styleTop, w : this._styleWidth, h : this._styleHeight
				};
				this._finalPosition = {
					x : this._styleLeft, y : this._styleTop, w : this._styleWidth, h : this._styleHeight
				};

				if ( ! this.proxy ) {
					this.proxy = this.getProxy ( this.el );
					//!!this.proxy.attr("id") ||
					this.proxy.attr ( "id", FAPUI.getId () );
					this.proxy.insertAfter ( this.el );
					this.proxy.css ( "position", "absolute" );
				}
				this.proxy.show ();
				//alert(this.proxy.get(0).clientWidth = 100);
				//this.proxy.get(0).clientWidth = this._styleWidth;
				//this.proxy.get(0).clientHeight = this._styleHeight;
				//this.proxy.get(0).offsetLeft = this._styleLeft;
				//this.proxy.get(0).offsetTop = this._styleTop;
				this.proxy.width ( this._styleWidth );
				this.proxy.height ( this._styleHeight );
				this.proxy.offset ( {
					"left" : this._styleLeft,
					"top" : this._styleTop
				} );

				//四条边定位坐标
				this._sideLeft = e.clientX - this._styleWidth;
				this._sideRight = e.clientX + this._styleWidth;
				this._sideUp = e.clientY - this._styleHeight;
				this._sideDown = e.clientY + this._styleHeight;
				//top和left定位参数
				this._fixLeft = this._styleLeft + this._styleWidth;
				this._fixTop = this._styleTop + this._styleHeight;
				//缩放比例
				if ( this.scale ) {
					//设置比例
					this.ratio = Math.max ( this.Ratio, 0 ) || this._styleWidth / this._styleHeight;
					//left和top的定位坐标
					this._scaleLeft = this._styleLeft + this._styleWidth / 2;
					this._scaleTop = this._styleTop + this._styleHeight / 2;
				}
				;
				//范围限制
				if ( this.max ) {
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
					//根据最小值再修正
					mxRight = Math.max ( mxRight, mxLeft + ( this.min ? this.minWidth : 0 ) + this._borderX );
					mxBottom = Math.max ( mxBottom, mxTop + ( this.min ? this.minHeight : 0 ) + this._borderY );
					/**
					 * 由于转向时要重新设置所以写成function形式
					 * @private
					 */
					this._mxSet = function () {
						this._mxRightWidth = mxRight - this._styleLeft - this._borderX;
						this._mxDownHeight = mxBottom - this._styleTop - this._borderY;
						this._mxUpHeight = Math.max ( this._fixTop - mxTop, this.min ? this.minHeight : 0 );
						this._mxLeftWidth = Math.max ( this._fixLeft - mxLeft, this.min ? this.minWidth : 0 );
					};
					this._mxSet ();
					//有缩放比例下的范围限制
					if ( this.scale ) {
						this._mxScaleWidth = Math.min ( this._scaleLeft - mxLeft,
								mxRight - this._scaleLeft - this._borderX ) * 2;
						this._mxScaleHeight = Math.min ( this._scaleTop - mxTop,
								mxBottom - this._scaleTop - this._borderY ) * 2;
					}
					;
				}
				;
				//mousemove时缩放 mouseup时停止
				$ ( document ).mousemove ( this._fR );
				$ ( document ).mouseup ( this._fS );
				if ( $.browser.msie ) {
					this.el.bind ( "losecapture", this._fE );
					_obj.setCapture ();
				} else {
					$ ( window ).blur ( this._fE );
					e.preventDefault ();
				}

			},

			/**
			 * 缩放
			 * @private
			 */
			resize : function ( e ) {
				//清除选择
				window.getSelection ? window.getSelection ().removeAllRanges () : document.selection.empty ();
				//执行缩放程序
				this._fun ( e );
				this._finalPosition = {
					x : this._styleLeft, y : this._styleTop, w : this._styleWidth, h : this._styleHeight
				};

				if ( this.proxy ) {
					this.proxy.css ( {
						width : this._styleWidth + "px",
						height : this._styleHeight + "px",
						top : this._styleTop + "px",
						left : this._styleLeft + "px"
					} );
				} else {
					this.el.css ( {
						width : this._styleWidth + "px",
						height : this._styleHeight + "px",
						top : this._styleTop + "px",
						left : this._styleLeft + "px"
					} );
				}

			},

			/**
			 * 向上缩放
			 * @private
			 */
			Up : function ( e ) {
				this.RepairY ( this._sideDown - e.clientY, this._mxUpHeight );
				this.RepairTop ();
				this.TurnDown ( this.Down );
			},

			/**
			 * 向下缩放
			 * @private
			 */
			Down : function ( e ) {
				this.RepairY ( e.clientY - this._sideUp, this._mxDownHeight );
				this.TurnUp ( this.Up );
			},

			/**
			 * 向右缩放
			 * @private
			 */
			Right : function ( e ) {
				this.RepairX ( e.clientX - this._sideLeft, this._mxRightWidth );
				this.TurnLeft ( this.Left );
			},

			/**
			 * 向左缩放
			 * @private
			 */
			Left : function ( e ) {
				this.RepairX ( this._sideRight - e.clientX, this._mxLeftWidth );
				this.RepairLeft ();
				this.TurnRight ( this.Right );
			},

			/**
			 * 向右下缩放
			 * @private
			 */
			RightDown : function ( e ) {
				this.RepairAngle ( e.clientX - this._sideLeft, this._mxRightWidth, e.clientY - this._sideUp,
					this._mxDownHeight );
				this.TurnLeft ( this.LeftDown ) || this.scale || this.TurnUp ( this.RightUp );
			},

			/**
			 * 向右上缩放
			 * @private
			 */
			RightUp : function ( e ) {
				this.RepairAngle ( e.clientX - this._sideLeft, this._mxRightWidth, this._sideDown - e.clientY,
					this._mxUpHeight );
				this.RepairTop ();
				this.TurnLeft ( this.LeftUp ) || this.scale || this.TurnDown ( this.RightDown );
			},

			/**
			 * 向左下缩放
			 * @private
			 */
			LeftDown : function ( e ) {
				this.RepairAngle ( this._sideRight - e.clientX, this._mxLeftWidth, e.clientY - this._sideUp,
					this._mxDownHeight );
				this.RepairLeft ();
				this.TurnRight ( this.RightDown ) || this.scale || this.TurnUp ( this.LeftUp );
			},

			/**
			 * 向左上缩放
			 * @private
			 */
			LeftUp : function ( e ) {
				this.RepairAngle ( this._sideRight - e.clientX, this._mxLeftWidth, this._sideDown - e.clientY,
					this._mxUpHeight );
				this.RepairTop ();
				this.RepairLeft ();
				this.TurnRight ( this.RightUp ) || this.scale || this.TurnDown ( this.LeftDown );
			},

			/**
			 * 修正水平方向
			 * @private
			 */
			RepairX : function ( iWidth, mxWidth ) {
				iWidth = this.RepairWidth ( iWidth, mxWidth );
				if ( this.scale ) {
					var iHeight = this.RepairScaleHeight ( iWidth );

					if ( this.Max && iHeight > this._mxScaleHeight ) {
						iHeight = this._mxScaleHeight;
						iWidth = this.RepairScaleWidth ( iHeight );
					} else if ( this.Min && iHeight < this.minHeight ) {
						var tWidth = this.RepairScaleWidth ( this.minHeight );

						if ( tWidth < mxWidth ) {
							iHeight = this.minHeight;
							iWidth = tWidth;
						}
					}
					this._styleHeight = iHeight;
					this._styleTop = this._scaleTop - iHeight / 2;
				}
				this._styleWidth = iWidth;
			},

			/**
			 * 修正垂直方向
			 * @private
			 */
			RepairY : function ( iHeight, mxHeight ) {
				iHeight = this.RepairHeight ( iHeight, mxHeight );
				if ( this.scale ) {
					var iWidth = this.RepairScaleWidth ( iHeight );

					if ( this.Max && iWidth > this._mxScaleWidth ) {
						iWidth = this._mxScaleWidth;
						iHeight = this.RepairScaleHeight ( iWidth );
					} else if ( this.Min && iWidth < this.minWidth ) {
						var tHeight = this.RepairScaleHeight ( this.minWidth );

						if ( tHeight < mxHeight ) {
							iWidth = this.minWidth;
							iHeight = tHeight;
						}
					}
					this._styleWidth = iWidth;
					this._styleLeft = this._scaleLeft - iWidth / 2;
				}
				this._styleHeight = iHeight;
			},

			/**
			 * 修正对角方向
			 * @private
			 */
			RepairAngle : function ( iWidth, mxWidth, iHeight, mxHeight ) {
				iWidth = this.RepairWidth ( iWidth, mxWidth );
				if ( this.scale ) {
					iHeight = this.RepairScaleHeight ( iWidth );
					if ( this.Max && iHeight > mxHeight ) {
						iHeight = mxHeight;
						iWidth = this.RepairScaleWidth ( iHeight );
					} else if ( this.Min && iHeight < this.minHeight ) {
						var tWidth = this.RepairScaleWidth ( this.minHeight );

						if ( tWidth < mxWidth ) {
							iHeight = this.minHeight;
							iWidth = tWidth;
						}
					}
				} else {
					iHeight = this.RepairHeight ( iHeight, mxHeight );
				}
				this._styleWidth = iWidth;
				this._styleHeight = iHeight;
			},

			/**
			 * 修正顶部
			 * @private
			 */
			RepairTop : function () {
				this._styleTop = this._fixTop - this._styleHeight;
			},

			/**
			 * 修正左边
			 * @private
			 */
			RepairLeft : function () {
				this._styleLeft = this._fixLeft - this._styleWidth;
			}, /**
			 * 修正高度
			 * @private
			 */
			RepairHeight : function ( iHeight, mxHeight ) {
				iHeight = Math.min ( this.max ? mxHeight : iHeight, iHeight );
				iHeight = Math.max ( this.min ? this.minHeight : iHeight, iHeight, 0 );
				return iHeight;
			},

			/**
			 * 修正宽度
			 * @private
			 */
			RepairWidth : function ( iWidth, mxWidth ) {
				iWidth = Math.min ( this.max ? mxWidth : iWidth, iWidth );
				iWidth = Math.max ( this.min ? this.minWidth : iWidth, iWidth, 0 );
				return iWidth;
			},

			/**
			 * 修正比例高度
			 * @private
			 */
			RepairScaleHeight : function ( iWidth ) {
				return Math.max ( Math.round ( ( iWidth + this._borderX ) / this.Ratio - this._borderY ), 0 );
			},

			/**
			 * 修正比例宽度
			 * @private
			 */
			RepairScaleWidth : function ( iHeight ) {
				return Math.max ( Math.round ( ( iHeight + this._borderY ) * this.Ratio - this._borderX ), 0 );
			},

			/**
			 * 转右
			 * @private
			 */
			TurnRight : function ( fun ) {
				if ( ! ( this.Min || this._styleWidth ) ) {
					this._fun = fun;
					this._sideLeft = this._sideRight;
					this.max && this._mxSet ();
					return true;
				}
			},

			/**
			 * 转左
			 * @private
			 */
			TurnLeft : function ( fun ) {
				if ( ! ( this.min || this._styleWidth ) ) {
					this._fun = fun;
					this._sideRight = this._sideLeft;
					this._fixLeft = this._styleLeft;
					this.max && this._mxSet ();
					return true;
				}
			},

			/**
			 * 转上
			 * @private
			 */
			TurnUp : function ( fun ) {
				if ( ! ( this.min || this._styleHeight ) ) {
					this._fun = fun;
					this._sideDown = this._sideUp;
					this._fixTop = this._styleTop;
					this.max && this._mxSet ();
					return true;
				}
			},

			/**
			 * 转下
			 * @private
			 */
			TurnDown : function ( fun ) {
				if ( ! ( this.min || this._styleHeight ) ) {
					this._fun = fun;
					this._sideUp = this._sideDown;
					this.max && this._mxSet ();
					return true;
				}
			},

			/**
			 * 停止缩放
			 * @private
			 */
			stop : function ( e ) {
				if ( this.proxy ) {
					this.proxy.width ( 0 );
					this.proxy.height ( 0 );
				}
				if ( ( this._finalPosition.w - this._initPosition.w > 3 ||
					this._finalPosition.w - this._initPosition.w < - 3 ) ||
					( this._finalPosition.h - this._initPosition.h > 3 ||
					this._finalPosition.h - this._initPosition.h < - 3 ) ) {
					//if((this._initPosition.x + this._finalPosition.w) < FAPUI.getViewSize().width){
					this.el.css ( {
						width : this._finalPosition.w + "px",
						height : this._finalPosition.h + "px",
						top : this._finalPosition.y + "px",
						left : this._finalPosition.x + "px"
					} );
					this.el.width ( this._finalPosition.w );
					this.el.height ( this._finalPosition.h );

					this.fireEvent ( "resize", this, this._initPosition, this._finalPosition );
					// }
				}
				$ ( document ).unbind ( "mousemove", this._fR );
				$ ( document ).unbind ( "mouseup", this._fS );
				if ( $.browser.msie ) {
					this.el.unbind ( "losecapture", this._fE );
					this.el.get ( 0 ).releaseCapture ();
				} else {
					$ ( window ).unbind ( "blur", this._fE );
				}
				e.stopPropagation ();
				e.preventDefault ();
			},

			/**
			 * 结束缩放
			 * @private
			 */
			end : function () {
				if ( this.proxy ) {
					this.proxy.hide ();
				}
				this.el.css ( {
					width : this._finalPosition.w + "px",
					height : this._finalPosition.h + "px",
					top : this._finalPosition.y + "px",
					left : this._finalPosition.x + "px"
				} );
				this.fireEvent ( "resize", this, this._initPosition, this._finalPosition );
				$ ( document ).unbind ( "mousemove", this._fR );
				$ ( document ).unbind ( "mouseup", this._fS );
				if ( $.browser.msie ) {
					this.el.unbind ( "losecapture", this._fE );
					this.el.get ( 0 ).releaseCapture ();
				} else {
					$ ( window ).unbind ( "blur", this._fE );
				}
			},

			/**
			 * 获取目标代理对象
			 * @method getProxy
			 */
			getProxy : function ( el ) {
				var proxy = $ ( "<div></div>" );

				proxy.css ( {
					"position" : "absolute", "border" : "1px dashed #99BBE8"
				} );
				return proxy;
			}
		}
	} );

	return FAPUI.Resize;
} );