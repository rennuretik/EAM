/**
 * UI组件
 * @module widgets
 */

/**
 * FAPUI基类,所有fapui组件都继承于本类
 * @class FAPUI.Base
 */
define ( function ( require ) {

	FAPUI.BLANK_IMG = seajs.dir + "../widgets/themes/" + FAPUI.getTheme () + "/s.gif";

	require ( "fapui-core" );

	FAPUI.define ( "FAPUI.Base", {

		/**
		 * 给成员属性或方法定义别名
		 * @method alias
		 * @param {string} ori - 原函数名
		 * @param {string} alias - 别名
		 */
		alias : function ( ori, alias ) {
			this[ alias ] = this[ ori ];
		},

		/**
		 * 获取父类
		 * @method getParentClass
		 * @return {Class}
		 */
		getParentClass : function () {
			return this.parentClass;
		},

		/**
		 * 获取父类名称
		 * @method getParentClassName
		 * @return {string}
		 */
		getParentClassName : function () {
			return this.parentClassName;
		},

		/**
		 *
		 * 获取继承链,类名之间用-->分隔
		 * @method inheritanceChain
		 * @return {string}
		 */
		inheritanceChain : function () {
			var chain = [ this.className ];
			var that = this;
			var pn = that.parentClassName;

			that = that.parentClass;

			while ( pn && that ) {//增加that的判断
				chain.push ( pn );
				pn = that.prototype.parentClassName;
				that = that.prototype.parentClass;
			}
			return chain.join ( "-->" );
		},

		/**
		 * 调用父方法,如果多级承继后方法都被覆盖，则会执行最顶层的方法
		 * @method callParent
		 * @param {Object|Array} args
		 * @private
		 */
		callParent : function ( args ) {
			var method = this.callParent.caller;

			if ( method.$owner ) {//fapui定义的
				var fn = method.$owner.superclass[ method.$methodName ] || method;

				if ( args ) {
					return fn.apply ( this, args );
				} else {
					return fn.apply ( this );
				}
			} else {
				if ( method.superclass.constructor ) {
					method.superclass.constructor.apply ( this, args );
				}
			}

		},

		/**
		 * 删除Dom元素
		 * @method removeDom
		 * @param {HTMLElement|string} node - 待删除的节点(节点id)
		 */
		removeDom : function ( node ) {
			var item = $ ( node );
			var clearItem = $ ( "#clear-use-memory" );

			if ( clearItem.length === 0 ) {
				$ ( "<div/>" ).hide ().attr ( "id", "clear-use-memory" ).appendTo ( "body" );
				clearItem = $ ( "#clear-use-memory" );
			}
			item.appendTo ( clearItem );
			item.remove ();
			clearItem[ 0 ].innerHTML = "";
			item = null;
			node = null;
		},

		/**
		 * 获取对象,参见享元模式
		 * @method fly
		 * @private
		 * @param {HTMLElement|string|Object} el - 一个dom节点参数，如果是字符串作应为组件的id
		 * return {object} jquery对象
		 */
		fly : function ( el ) {
			if ( FAPUI.isString ( el ) ) {
				return $ ( "#" + el );
			} else if ( el.tagName ) {
				return $ ( el );
			} else {
				return el;
			}
		},

		/**
		 * 获取当前主题
		 * @method getTheme
		 * @returns {string}
		 */
		getTheme : function () {
			return FAPUI.getTheme ();
		}
	} );
	return FAPUI.Base;
} );
