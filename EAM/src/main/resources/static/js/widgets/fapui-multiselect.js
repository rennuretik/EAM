/**
 * 以下代码展示如何创建MultiselectField
 *
 *
 *
 *
 var multi = new FAPUI.form.MultiSelectField({
			renderTo:document.body,
			width:450,
			height:300,
			lTitle:'未选择',
			rTitle:'已选择',
			displayName:'displayName',
			realName:'realName',
			fieldLabel:'多选框:',
			data:[{
				value:'1',
				text:'测试数据一'
			},{
				value:'2',
				text:'测试数据二'
			},{
				value:'3',
				text:'测试数据三'
			},{
				value:'4',
				text:'测试数据四'
			},{
				value:'5',
				text:'测试数据五'
			},{
				value:'6',
				text:'测试数据六'
			},{
				value:'7',
				text:'测试数据七'
			},{
				value:'8',
				text:'测试数据八'
			},{
				value:'9',
				text:'测试数据九'
			},{
				value:'10',
				text:'测试数据十'
			}],
			dataUrl:dataUrl,
			value:'1,3,5',
			lazyLoad:false,
			buttons:[{
            	cls:'top',
            	tips:'移动到顶部'
            },{
            	cls:'up',
            	tips:'向上移动'
            },{
            	cls:'right',
            	tips:'向右移动'
            },{
            	cls:'rightAll',
            	tips:'向右全移动'
            },{
            	cls:'left',
            	tips:'向左移动'
            },{
            	cls:'leftAll',
            	tips:'向左全移动'
            },{
            	cls:'down',
            	tips:'向下移动'
            },{
            	cls:'bottom',
            	tips:'移动到底部'
            }],
			listeners:{
				change:function(o,oldvalue,newvalue){
					alert(o.lTitle);
					alert("原始值为："+oldvalue+"---->"+"新值为："+newvalue);
				}
			}
		});
 $("#save").click(function(){
			alert("value:"+multi.getValue()+"-------->"+"text:"+multi.getRawValue());
		});
 $("#setVal").click(function(){
			multi.setValue("2,4,7");

			alert(multi.getValue());
		});
 $("#reset").click(function(){
			multi.reset();
		});
 $("#load").click(function(){
			multi.reloadData();
		});
 *@class FAPUI.form.MultiSelectField
 *@extends FAPUI.form.TextField
 *
 */
define ( function ( require, exports, module ) {

	var importcss = "./themes/" + FAPUI.getTheme () + "/css/ui-multiselect.css";

	require.async ( importcss );

	require ( "./fapui-textfield" );

	/**
	 *
	 * @param {*} index
	 */
	Array.prototype.remove = function ( index ) {
		if ( isNaN ( index ) || index > this.length ) {
			return false;
		}
		for ( var i = 0, n = 0; i < this.length; i ++ ) {
			if ( this[ i ] != this[ index ] ) {
				this[ n ++ ] = this[ i ];
			}
		}
		this.length -= 1;
	};
	/**
	 * 定义多选组件
	 * @author wzj
	 */
	FAPUI.define ( "FAPUI.form.MultiSelectField", {
		extend : "FAPUI.form.TextField",

		props : {
			/**
			 *多选组件宽度
			 *@property width
			 *@type int
			 */
			width : 450,

			/**
			 *多选组件高度
			 *@property width
			 *@type int
			 */
			height : 200,
			/**
			 *左边标题
			 *@property lTitle
			 *@type String
			 */
			lTitle : "Available",
			/**
			 *右边标题
			 *@property rTitle
			 *@type String
			 */
			rTitle : "Selected",

			/**
			 *多选组件文本标签
			 *@property fieldLabel
			 *@type String
			 */
			fieldLabel : "",
			/**
			 * 输入框文本标签对齐方式
			 * @property  labelAlign
			 * @type String
			 * @default 'right'
			 */
			labelAlign : "right",
			/**
			 * 输入框文本标签是否隐藏
			 * @property  hideLabel
			 * @type boolean
			 * @default false
			 */
			hideLabel : false,
			/**
			 *多选组件文本标签分隔符
			 *@property fieldLabel
			 *@type String
			 */
			labelSplit : "",
			/**
			 *多选组件是否允许为空
			 *@property allowBlank
			 *@type boolean
			 */
			allowBlank : true,
			/**
			 *文本描述的宽度
			 *@property labelWidth
			 *@type number
			 */
			labelWidth : 40,
			/**
			 *默认值或选择后的值
			 *@property value
			 *@type String
			 */
			value : "",

			/**
			 *默认为true,是否延迟加载数据
			 *@property lazyLoad
			 *@type Boolean
			 */
			lazyLoad : true,

			/**
			 *选择的值的分隔符,默认值为：','
			 *@property separator
			 *@type String
			 */
			separator : ",",

			/**
			 * json 数据结果字段名
			 */
			resultField : "",

			/**
			 *多选组件数据集
			 *@property data
			 *@type array
			 */
			data : null,
			fromData : [],
			toData : [],
			/**
			 *置顶，上移，左移，左全移，右移，右全移，下移，置底按钮
			 *@property buttons
			 *@type array
			 */
			buttons : [ {
				cls : "top",
				tips : "移动到顶部"
			}, {
				cls : "up",
				tips : "向上移动"
			}, {
				cls : "right",
				tips : "向右移动"
			}, {
				cls : "rightAll",
				tips : "向右全移动"
			}, {
				cls : "left",
				tips : "向左移动"
			}, {
				cls : "leftAll",
				tips : "向左全移动"
			}, {
				cls : "down",
				tips : "向下移动"
			}, {
				cls : "bottom",
				tips : "移动到底部"
			} ]
		},
		/**
		 * 覆写父类的方法
		 *@private
		 */
		override : {
			/**
			 * @private
			 */
			initConfig : function () {
				this.callParent ();
				//添加事件
				this.addEvents ( "change" );
				this.wraptpl = [ "<div id=\"$${id}\" class=\"multiselect-wrap\">",
								"<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tbody>", "<tr>",
								"{@if !hideLabel}", "{@if fieldLabel!=\"\"}",
								"<td class=\"label\" style=\"width:$${labelWidth}px;align:${labelAlign};\">" ,
								"<span  class=\"field-label\" style=\"width:$${labelWidth/2}" ,
								"px;text-align:${labelAlign};\">${fieldLabel}{@if !allowBlank}" ,
								"<span class=\"field-required\">*</span>{@/if}$${labelSplit}" ,
								"</span></td>", "{@else if fieldLabel==\"\"}",
								"<td class=\"label\" style=\"width:$${labelWidth}px;align:${labelAlign};\">" ,
								"<span  class=\"field-label\" style=\"width:$${labelWidth/2}" ,
								"px;text-align:${labelAlign};\"></span></td>", "{@/if}", "{@/if}", "<td>",
								"<div class=\"fromselector\">", "<span class=\"title\" height=\"12px\">${lTitle}" ,
								"</span>", "<span class=\"line\" style=\"width:5px;\"></span>",
								"<span class=\"line\" style=\"right:0;\"></span>",
								"<div class=\"multi-list\">", "<ul class=\"multi-item\" " ,
								"style =\"height:${height}px\" id=\"from\"></ul>", "</div>", "</div>", "</td>",
								 "<td class=\"buttons\" width=\"10px\">",
								 "{@each buttons as it,k}",
								 "<img class=\"${it.cls}\" title=\"${it.tips}\" ",
								 "src=\"" + FAPUI.BLANK_IMG + "\" move=\"move-${it.cls}\"/>", "{@/each}", "</td>",
								 "<td>",
								"<div class=\"toselector\">", "<span class=\"title\">${rTitle}</span>",
								"<span class=\"line\" style=\"width:5px;\"></span>", "<span class=\"line\" " ,
								"style=\"right:0;\"></span>", "<div class=\"multi-list\">",
								"<input class=\"display-value\" type=\"hidden\" name=\"${displayName}\"/>",
								"<input class=\"real-value\" type=\"hidden\" name=\"${realName}\"/>",
								 "<ul class=\"multi-item\" " ,
								 "style =\"height:${height}px\" id=\"to\"></ul>",
								"</div>", "</div>", "</td>", "</tr></tbody>", "</table>", "</div>" ].join ( "" );
				this.itemtpl = [ "{@each data as it, k}", "<li id=\"${it.id}\" index=\"${k}\" v=\"${it.value}" ,
								"\" onselectstart=\"return false\">${it.text}</li>", "{@/each}" ].join ( "" );
				juicer.set ( "cache", true );
				juicer.set ( "errorhandling", false );
				juicer.set ( "strip", true );
				juicer.set ( "detection", false );
			},
			/**
			 * @private
			 */
			render : function ( el ) {
				this.callParent ( [ el ] );
			},
			/**
			 * 创建dom
			 */
			createDom : function () {

				var me = this;

				me.id = me.id || FAPUI.getId ();

				var wrapTmp = juicer ( this.wraptpl, me );

				return wrapTmp;
			},
			/**
			 * 绑定事件
			 */
			bindEvent : function () {

				var me = this;

				me.el = me.el || $ ( "#" + me.id );
				me.afterRender ();
			},
			/**
			 * @private
			 */
			afterRender : function () {
				this._loadData ();
				this._btnClickEvent ();
			},
			/**
			 * 首次加载数据
			 * @access private
			 */
			_loadData : function () {

				var me = this;

				if ( me.data ) {
					$ ( me.data ).each ( function () {

						var me = this;

						me.id = FAPUI.getId ( "item" );
					} );
					me._refreshToView ();
					me._refreshFromView ();
					me.setDefaultValue ();
				} else if ( me.dataUrl ) {
					if ( me.lazyLoad === false ) {
						me.reloadData ();
					}
				}
			},
			/**
			 * 向左移动
			 * @access private
			 */
			_moveLeft : function ( val ) {
				var me = this;

				var removeData = [];

				if ( ! FAPUI.isString ( val ) ) {
					val = val.toString ();
				}
				if ( val != "" ) {

					var values = val.split ( me.separator );

					for ( var i = 0; i < values.length; i ++ ) {
						for ( var j = 0; j < me.toData.length; j ++ ) {
							if ( values[ i ] == me.toData[ j ].value ) {
								removeData.push ( me.toData[ j ] );
								me.toData.remove ( j );
								break;
							}
						}
					}
					me._renderToSelector ( {
						data : me.toData
					} );
					me.fromData = me.fromData.concat ( removeData );
					me._renderFromSelector ( {
						data : me.fromData
					} );
				}
				me.fireEvent ( "change", me, me.oldValue, me.getValue () );
				me._updateText ();
				me.oldValue = me.getValue ();
			},
			/**
			 * 向左全移
			 * @access private
			 */
			_moveLeftAll : function () {

				var me = this;

				me.fromData = me.fromData.concat ( me.toData );
				me._renderFromSelector ( {
					data : me.fromData
				} );
				me.toData = [];
				me._renderToSelector ( {
					data : me.toData
				} );
				me.fireEvent ( "change", me, me.oldValue, me.getValue () );
				me._updateText ();
				me.oldValue = me.getValue ();
			},
			/**
			 * 向右移动
			 * @access private
			 */
			_moveRight : function ( val ) {
				var me = this;

				var data = [];

				if ( ! FAPUI.isString ( val ) ) {
					val = val.toString ();
				}
				if ( val != "" ) {

					var values = val.split ( me.separator );

					for ( var i = 0; i < values.length; i ++ ) {
						data.push ( me._toJSON ( values[ i ] ) );
						for ( var j = 0; j < me.fromData.length; j ++ ) {
							if ( me.fromData[ j ].value == values[ i ] ) {
								me.fromData.remove ( j );
								break;
							}
						}
					}
					me.toData = me.toData.concat ( data );
					me._renderToSelector ( {
						data : me.toData
					} );
					me._renderFromSelector ( {
						data : me.fromData
					} );
				}
				me.fireEvent ( "change", me, me.oldValue, me.getValue () );
				me._updateText ();
				me.oldValue = me.getValue ();
			},
			/**
			 * 向右全移
			 * @access private
			 */
			_moveRightAll : function () {

				var me = this;

				me.toData = me.toData.concat ( me.fromData );
				me._renderToSelector ( {
					data : me.toData
				} );
				me.fromData = [];
				me._renderFromSelector ( {
					data : me.fromData
				} );
				me._updateValue ();
				me.fireEvent ( "change", me, me.oldValue, me.getValue () );
				me._updateText ();
				me.oldValue = me.getValue ();
			},
			/**
			 * 移动到顶部
			 * @access private
			 * @param {*} selItems 要移动的条目
			 */
			_moveTop : function ( selItems ) {

				var me = this;
				var expr = "";
				var parent = null;

				$ ( selItems ).each ( function () {
					parent = $ ( this ).parent ();
					expr += "#" + $ ( this ).attr ( "id" ) + ",";
				} );

				var id = expr.slice ( 0, ( expr.length - 1 ) );

				$ ( id ).prependTo ( parent );
				me._updateData ();
				me._updateValue ();
				me._updateText ();
				me.fireEvent ( "change", me, me.oldValue, me.getValue () );
				me.oldValue = me.getValue ();
			},
			/**
			 * 向上移动
			 * @access private
			 * @param {*} selItems 要移动的条目
			 */
			_moveUp : function ( selItems ) {

				var me = this;

				$ ( selItems ).each ( function () {
					//若要移动的条目不是第一个，则向上移动

					var firstId = $ ( this ).prev ( "li" ).attr ( "id" );

					if ( firstId != undefined ) {
						$ ( this ).insertBefore ( $ ( this ).prev ( "li:not(\".selected\")" ) );
					}
				} );
				me._updateData ();
				me._updateValue ();
				me._updateText ();
				me.fireEvent ( "change", me, me.oldValue, me.getValue () );
				me.oldValue = me.getValue ();
			},
			/**
			 * 移动到底部
			 * @access private
			 * @param {*} selItems 要移动的条目
			 */
			_moveBottom : function ( selItems ) {

				var me = this;
				var expr = "";
				var parent = null;

				$ ( selItems ).each ( function () {
					parent = $ ( this ).parent ();
					expr += "#" + $ ( this ).attr ( "id" ) + ",";
				} );

				var id = expr.slice ( 0, ( expr.length - 1 ) );

				$ ( id ).appendTo ( parent );
				me._updateData ();
				me._updateValue ();
				me._updateText ();
				me.fireEvent ( "change", me, me.oldValue, me.getValue () );
				me.oldValue = me.getValue ();
			},
			/**
			 * 向下移动
			 * @access private
			 * @param {*} selItems 要移动的条目
			 */
			_moveDown : function ( selItems ) {

				var length = selItems.length - 1;
				var me = this;

				;
				for ( var i = length; i >= 0; i -- ) {
					//当前要移动的条目对象
					var cur = $ ( selItems[ i ] );
					//若要移动的条目不是最后一个，则向下移动

					var lastId = cur.next ( "li" ).attr ( "id" );

					if ( lastId != undefined ) {
						cur.insertAfter ( cur.next ( "li:not(\".selected\")" ) );
					}
				}
				me._updateData ();
				me._updateValue ();
				me._updateText ();
				me.fireEvent ( "change", me, me.oldValue, me.getValue () );
				me.oldValue = me.getValue ();
			},
			/**
			 * @access private
			 * 上下左右按钮点击事件处理
			 */
			_btnClickEvent : function () {
				var me = this;
				var fromVal = [];
				var toVal = [];
				var btns = this.el.find ( "table" ).find ( "td.buttons" ).find ( "img" );
				var cur;
				var selFormItems;
				var selToItems;
				var move;
				var fVal;

				var tVal;

				btns.click ( function () {
					cur = $ ( this );
					selFromItems = me.el.find ( "ul#from" ).find ( "li.selected" );
					selToItems = me.el.find ( "ul#to" ).find ( "li.selected" );
					move = cur.attr ( "move" );
					if ( move != "move-leftAll" && move != "move-rightAll" ) {
						if ( selFromItems.length == 0 && selToItems.length == 0 ) {
							return false;
						}
					}
					fromVal = [];
					$ ( selFromItems ).each ( function () {
						fromVal.push ( $ ( this ).attr ( "v" ) );
					} );
					toVal = [];
					$ ( selToItems ).each ( function () {
						toVal.push ( $ ( this ).attr ( "v" ) );
					} );
					fVal = fromVal.join ( me.separator );
					tVal = toVal.join ( me.separator );
					if ( move ) {
						switch ( move ) {
							case "move-top": {//移动到顶部
								me._moveTop ( selToItems );
								break;
							}
							case "move-up": {//向上移动
								me._moveUp ( selToItems );
								break;
							}
							case "move-left": {//向左移动
								me._moveLeft ( tVal );
								break;
							}
							case "move-leftAll": {//向左全移
								me._moveLeftAll ();
								break;
							}
							case "move-right": {//向右移动
								me._moveRight ( fVal );
								break;
							}
							case "move-rightAll": {//向右全移
								me._moveRightAll ();
								break;
							}
							case "move-down": {//向下移动
								me._moveDown ( selToItems );
								break;
							}
							case "move-bottom": {//移动到底部
								me._moveBottom ( selToItems );
								break;
							}
						}
					}
				} );
			},
			/**
			 * @access private
			 * 为选择列表事件处理
			 */
			_fromClickEvent : function () {
				var me = this;
				var indexs = [];

				var items = me.el.find ( "ul#from" ).find ( "li" );

				$ ( items ).hover ( function () {
					$ ( this ).addClass ( "hover" );
				}, function () {
					$ ( this ).removeClass ( "hover" );
				} ).click ( function ( event ) {

					var evt = event || window.event;

					$ ( this ).addClass ( "selected" );

					var index = $ ( this ).attr ( "index" );

					indexs.push ( index );
					if ( ! evt.ctrlKey ) {
						$ ( this ).siblings ().removeClass ( "selected" );
					}
					if ( evt.shiftKey ) {
						me._shiftSelect ( indexs, items );
					}
				} ).dblclick ( function ( event ) {
					me._moveRight ( $ ( this ).attr ( "v" ) );
					event.stopPropagation ();
				} );
			},
			/**
			 * @access private
			 * 已选择列表事件处理
			 */
			_toClickEvent : function () {
				var me = this;
				var indexs = [];

				var items = me.el.find ( "ul#to" ).find ( "li" );

				$ ( items ).hover ( function () {
					$ ( this ).addClass ( "hover" );
				}, function () {
					$ ( this ).removeClass ( "hover" );
				} ).click ( function ( event ) {
					var evt = event || window.event;

					var index = $ ( this ).attr ( "index" );

					$ ( this ).addClass ( "selected" );
					indexs.push ( index );
					if ( ! evt.ctrlKey ) {
						$ ( this ).siblings ().removeClass ( "selected" );
					}
					if ( evt.shiftKey ) {
						me._shiftSelect ( indexs, items );
					}
					indexs = [];
				} ).dblclick ( function ( event ) {
					me._moveLeft ( $ ( this ).attr ( "v" ) );
					event.stopPropagation ();
				} );
			},
			/**
			 * @access private
			 * 按住shift键多选
			 * @param {*} indexs
			 * @param {*} items
			 */
			_shiftSelect : function ( indexs, items ) {
				var me = this;

				var selections = [];

				if ( indexs.length > 1 ) {

					var firstIndex = indexs[ 0 ];
					var lastIndex = indexs[ 1 ];

					if ( firstIndex < lastIndex ) {
						$ ( items ).each ( function () {
							var cur = $ ( this );

							var curIndex = cur.attr ( "index" );

							if ( curIndex >= firstIndex && curIndex < lastIndex ) {
								cur.addClass ( "selected" );
							}
						} );
					} else {
						$ ( items ).each ( function () {
							var cur = $ ( this );

							var curIndex = cur.attr ( "index" );

							if ( curIndex > lastIndex && curIndex <= firstIndex ) {
								cur.addClass ( "selected" );
							}
						} );
					}
				}
				indexs = [];
			},
			/**
			 * @access private
			 * 刷新未选择列表
			 */
			_refreshFromView : function () {
				var me = this;

				var cfg = me._parseFromData ();

				me._renderFromSelector ( cfg );
			},
			/**
			 * @access private
			 * 刷新已选择列表
			 * @param {*} val
			 */
			_refreshToView : function ( val ) {
				var me = this;

				var cfg = me._parseToData ( val );

				me._renderToSelector ( cfg );
			},
			/**
			 * @access private
			 * 未选择列表数据处理
			 */
			_parseFromData : function () {

				var me = this;
				var copyData = [];

				if ( me.data ) {
					copyData = me.data.concat ();
					for ( var i = 0; i < me.toData.length; i ++ ) {

						var cur = me.toData[ i ];

						for ( var j = 0; j < copyData.length; j ++ ) {

							var curr = copyData[ j ];

							if ( cur.value == curr.value ) {
								copyData.remove ( j );
								break;
							}
						}
					}
				}
				me.fromData = copyData.concat ();
				return {
					data : copyData
				};
			},
			/**
			 * 已选择列表数据处理
			 * @private
			 * @param {*} val
			 */
			_parseToData : function ( val ) {
				var me = this;

				var data = [];
				var defaultData = [];
				var newData = [];
				var totalData = [];

				if ( me.value && me.value != "" ) {
					defaultData = me.value.split ( me.separator );
				}
				if ( val && val != "" ) {
					if ( ! FAPUI.isString ( val ) ) {
						val = val.toString ();
					}
					newData = val.split ( me.separator );
				}
				totalData = defaultData.concat ( newData );
				for ( var i = 0; i < totalData.length; i ++ ) {
					if ( me._toJSON ( totalData[ i ] ) ) {
						data.push ( me._toJSON ( totalData[ i ] ) );
					} else {
						break;
					}

				}
				me.toData = data.concat ();
				return {
					data : data
				};
			},
			/**
			 * JSON数据处理
			 * @private
			 * @param {*} val
			 */
			_toJSON : function ( val ) {

				var me = this;
				var cfg = {};

				if ( me.data ) {
					$ ( me.data ).each ( function () {

						var me = this;

						if ( me.value == val ) {
							cfg.value = val;
							cfg.text = me.text;
							cfg.id = me.id;
							return cfg;
						}
					} );
					return cfg;
				} else {
					return null;
				}
			},
			/**
			 * @access private
			 * 计算大小
			 */
			_computeSize : function () {

				var wrap = this.el.find ( "table" );

				wrap.css ( "width", this.el.parent ().width () - 10 );
				this.el.css ( "width", this.width );
				this.el.css ( "height", this.height );
				wrap.find ( "td.label" ).css ( "width", this.labelWidth );
				wrap.find ( "td.buttons" ).css ( "width", 20 );
				var fromselector = wrap.find ( "div.fromselector" );
				var toselector = wrap.find ( "div.toselector" );

				var w = Math.floor ( ( this.width - 24 - this.labelWidth ) / 2 );

				fromselector.css ( "width", w );
				toselector.css ( "width", w );
				fromselector.find ( ".multi-item" ).css ( "width", w );
				toselector.find ( ".multi-item" ).css ( "width", w );
				var fromW = fromselector.find ( "span:first" ).outerWidth ();
				var toW = toselector.find ( "span:first" ).outerWidth ();

				var fromNewW = w - fromW - 10;
				var toNewW = w - toW - 10;

				fromselector.find ( "span:last" ).css ( "width", fromNewW );
				toselector.find ( "span:last" ).css ( "width", toNewW );
			},
			/**
			 * 渲染未选择列表
			 * @private
			 * @param {*} cfg
			 */
			_renderFromSelector : function ( cfg ) {
				var me = this;
				var fromTmp = juicer ( me.itemtpl, cfg );

				var listWrap = me.el.find ( "table" ).find ( "ul#from" );

				listWrap.html ( fromTmp );
				me._fromClickEvent ();
			},
			/**
			 * 渲染已选择列表
			 * @private
			 * @param {*} cfg
			 */
			_renderToSelector : function ( cfg ) {
				var me = this;
				var toTmp = juicer ( me.itemtpl, cfg );

				var listWrap = me.el.find ( "table" ).find ( "ul#to" );

				listWrap.html ( toTmp );
				me._updateValue ();
				me._toClickEvent ();
			},
			/**
			 * 设置默认值
			 * @method setDefaultValue
			 */
			setDefaultValue : function () {

				var me = this;

				me._updateText ();
				me.oldValue = me._getField ().val ();
			},
			/**
			 * @access private
			 * 更新显示值
			 */
			_updateText : function () {
				var me = this;

				var oldText = [];

				$ ( me.toData ).each ( function () {
					oldText.push ( this.text );
				} );

				var v = oldText.join ( me.separator );

				me._getRawField ().val ( v );
			},
			/**
			 * @access private
			 * 更新值
			 */
			_updateValue : function () {
				var me = this;

				var newValue = [];

				$ ( me.toData ).each ( function () {
					newValue.push ( this.value );
				} );

				var val = newValue.join ( me.separator );

				me._getField ().val ( val );
			},
			/**
			 * @access private
			 * 更新已选择的数据
			 */
			_updateData : function () {

				var me = this;

				me.toData = [];

				var selItems = me.el.find ( "div.toselector" ).find ( "ul#to" ).find ( "li" );

				$ ( selItems ).each ( function () {

					var cur = $ ( this );
					var cfg = {};

					cfg.id = cur.attr ( "id" );
					cfg.value = cur.attr ( "v" );
					cfg.text = cur.text ();
					me.toData.push ( cfg );
				} );
			},
			/**
			 * 加载数据
			 *@method reloadData
			 * @param url {String} 请求地址
			 * @param params {Object} 请求参数
			 */
			reloadData : function ( url, params ) {
				var me = this;
				var url = url || me.dataUrl;

				var params = params || me.baseParams || {};

				$.post ( url, params, function ( data ) {
					var fields = [] ;
					if (me.resultField ) {
						if ( me.resultField.indexOf(".") >= 0) {
							fields = me.resultField.split(".");
						} else {
							fields.push(me.resultField);
						}
					}
					if (fields) {
						for (var i = 0; i < fields.length; i++) {
							data = data[fields[i].trim()]
						}
					}
					if ( data.success ) {
						me.data = data.result;
						$ ( me.data ).each ( function () {
							var me = this;

							me.id = FAPUI.getId ( "item" );
						} );
						me._refreshToView ();
						me._refreshFromView ();
						me.setDefaultValue ();

						if ( data.checked ) {
							var setValueFlag = window.setTimeout ( function () {
								me.setValue ( data.checked );
								window.clearTimeout ( setValueFlag );
							}, 100 );
						}
					}
				} );
			},
			/**
			 * 设置多选组件的宽度
			 * @method setWidth
			 * @param {int} w 目标宽度
			 *
			 */
			setWidth : function ( w ) {
				this.width = w;
				this._computeSize ();
			},
			/**
			 * 获取多选组件的宽度
			 * @method getWidth
			 * @return {int}
			 */
			getWidth : function () {
				return this.width;
			},
			/**
			 * 设置多选组件的高度
			 * @method setHeight
			 * @param {int} h 目标高度
			 */
			setHeight : function ( h ) {
				this.height = h;
				this._computeSize ();
			},
			/**
			 * 获取多选组件的高度
			 *@method getHeight
			 * @return {int}
			 */
			getHeight : function () {
				return this.height;
			},
			/**
			 * 多选组件设置值
			 *@method setValue
			 * @param value {String} 目标值
			 */
			setValue : function ( values ) {
				this._refreshToView ( values );
				this._refreshFromView ();
				this._updateText ();
				this.fireEvent ( "change", this, this.oldValue, this.getValue () );
				this.oldValue = this._getField ().val ();
			},
			/**
			 * 恢复到初始状态
			 *@method reset
			 */
			reset : function () {
				this._refreshToView ();
				this._refreshFromView ();
				this._updateText ();
			},
			/**
			 * 获取显示的值
			 *@method getRawValue
			 * @return {String}
			 */
			getRawValue : function () {
				return this._getRawField ().val ();
			},
			/**
			 * 获取输入框的值
			 *@method getValue
			 * @return {String}
			 */
			getValue : function () {
				return this._getField ().val ();
			},
			/**
			 * 获取存放值的文本框
			 * @private
			 */
			_getField : function () {
				return this.el.find ( "table" ).find ( "input.real-value" );
			},
			/**
			 * 获取存放显示值的文本框
			 * @private
			 */
			_getRawField : function () {
				return this.el.find ( "table" ).find ( "input.display-value" );
			}
		},
		/**
		 * 设置输入框是否可见
		 * @method showLabel
		 * @param {boolean} hide
		 */
		showLabel : function ( hide ) {
			var me = this;

			var label = this.el.find ( "table" ).find ( ".field-label" );

			if ( hide ) {
				label.hide ();
			} else {
				label.show ();
			}
			me.hideLabel = hide;
		},

		/**
		 * 设置输入框分隔符标签
		 * @method setFieldLabel
		 * @param {string} label
		 */
		setFieldLabel : function ( label ) {

			var me = this;

			me.fieldLabel = label;

			var label = this.el.find ( "table" ).find ( ".field-label" );

			if ( label == "" ) {
				label.html ( "" );
			} else {
				label.html ( label );
			}
		},
		/**
		 * 设置输入框标签宽度
		 * @method setLabelWidth
		 * @param {number} width 标签宽度
		 */
		setLabelWidth : function ( width ) {

			var me = this;

			me.labelWidth = width;
			this.el.find ( "table" ).find ( ".field-label" ).css ( "width", width );
			this.el.find ( "table" ).find ( ".label" ).css ( "width", width );
			me.setWidth ( me.width );
		},
		/**
		 * 获取输入框文本标签的宽度
		 * @method getLabelWidth
		 * @returns {number}
		 */
		getLabelWidth : function () {

			var me = this;

			return me.labelWidth;
		}
	} );
	FAPUI.register ( "multiSelectField", FAPUI.form.MultiSelectField );

	return FAPUI.form.MultiSelectField;
} );
