/**
 *下拉列表,如下创建：
 *
 *
 *
 new FAPUI.form.ComboxField({
	            width:250,
	            renderTo:"ab",
	            valueField:"userId",
	            fieldLabel:"下拉框",
	            textField:"userName",
	            value:"0",
	            editAble : true,
	            allowBlank:false,
	            errorMsg:"不能为空",
				store:new FAPUI.Store({
					url:'<%=path%>/store/storeTest',
					limit:10
				}),
				firstUrl:'<%=path%>/store/first',
				queryUrl : '<%=path%>/store/query',//editAble为true时,该模糊查询url起效
	            listeners:{
	            "expand":function(comb){
	            	alert(comb.id);
	            },
	            "select":function(valeu,text,store,index){
	            	alert(valeu);
	            	alert(text);
	            	alert(store);
	            	alert(index);
	            }
	            }
				})
 *
 *@class FAPUI.form.ComboxField
 *@extends FAPUI.form.TextField
 */
define ( function ( require ) {

	var importcss = "./themes/" + FAPUI.getTheme () + "/css/ui-combobox.css";

	require.async ( importcss );

	require ( "./fapui-textfield" );

	require ( "./fapui-store" );

	FAPUI.define ( "FAPUI.form.ComboxField", {
		extend : "FAPUI.form.TextField",
		props : {
			/**
			 *宽,默认值为140
			 *@property width
			 *@type int
			 */
			width : 140,
			/**
			 *对应Store中表示值的键
			 *@property valueField
			 *@type String
			 */
			valueField : "",
			/**
			 *对应Store中表示显示值的键
			 *@property textField
			 *@type String
			 */
			textField : "",
			/**
			 *数据是否已经加载,默认为false
			 *@property textField
			 *@type Boolean
			 */
			dataLoaded : false,
			/**
			 *是否开启自动完成的功能,默认为false
			 *@property autoComplete
			 *@type Boolean
			 */
			autoComplete : false,
			/**
			 *是否开启远程过滤,默认为false,autoComplete为true是有效,为true时,执行autoComplete操作时,执行的是store的重新加载数据的操作,为false时,执行的是store的filter操作
			 *@property autoComplete
			 *@type Boolean
			 */
			remoteFilter : false,
			/**
			 *下拉列表是否和文本框等宽
			 *@property isEqualWidth
			 *@default true
			 *@type Boolean
			 */
			isEqualWidth : true,

			/**
			 *如果有默认值,渲染后会根据默认值跑到对应后台匹配对应的显示值
			 *@property firstUrl
			 *@type String
			 */
			firstUrl : null,
			/**
			 *editAble为true是起效，该属性是combox输入框请求模糊查询
			 *@property queryUrl
			 *@type String
			 */
			queryUrl : null,

			/**
			 * 是否可以编辑
			 * @property editAble
			 * @type Boolean
			 */
			editAble : true,
			/**
			 * valueField的字段名
			 */
			valueField : "value",

			/**
			 * textField的字段名
			 */
			textField : "text",
			/**
			 *是否在展开下拉框之前重新加载数据
			 *@property triggerLoad
			 *@default false
			 *@type Boolean
			 */
			triggerLoad : false,
			/**
			 *是否可以多选
			 *@property combSelected
			 *@default false
			 *@type Boolean
			 */
			combSelected:false,

			/**
			 * json 数据结果字段名
			 */
			resultField : ""
		},
		override : {

			/**
			 * 初始化配置对象
			 * @private
			 */
			initConfig : function () {

				var me = this;

				me.callParent ();
				this.addEvents ( /**
					 *下拉内容选择时触发
					 *@event select
					 *@param value {String} 值
					 *@param text {String} 显示值
					 *@param data {Store} store属性的值
					 *@param index {int} 对应的索引
					 */
					"select",

					/**
					 *下拉内容展开时触发
					 *@event expand
					 *@param combo {ComboxField} 组件本身
					 */
					"expand", /**
					 *下拉内容收缩时触发
					 *@event collapse
					 *@param combo {ComboxField} 组件本身
					 */
					"collapse" );

				this.tpl = [ "<div class=\"combo-container\" id=\"$${id}\">", "{@if !hideLabel}",
							"{@if fieldLabel!=\"\"}", "<span class=\"field-label\" " ,
							"style=\"width:${labelWidth}px;text-align:${labelAlign};\">$${fieldLabel}{@if !allowBlank}",
							"<span class=\"field-required\">*</span>{@/if}$${labelSplit}</span>",
							"{@else if fieldLabel==\"\"}", "<span class=\"field-label\" " ,
							"style=\"width:${labelWidth}px;text-align:${labelAlign};\"></span>", "{@/if}", "{@/if}",
							"<span class=\"combo\">", "<input class=\"combo-text\" type=\"text\"  name=\"${name}\"/>",
							"<input class=\"combo-value\" type=\"hidden\" name=\"${realName}\"/>",
							"<a class=\"combo-arrow\" href=\"javascript:void(0);\" hidefocus=\"true\"></a>",
							"</span>", "</div>" ].join ( "" );
				this.contentTpl = [ "<ul class=\"item trigger_content_ul\" valueField=\"${valueField}\"  " ,
									"textField=\"${textField}\">", "{@each data as it ,i}",
									"<a style=\"color:black;\"><li index=${i} v=\"${it[valueField]}\">${it[textField]}",
									"</li></a>", "{@/each}", "</ul>" ].join ( "" );
				juicer.set ( "cache", true );
				juicer.set ( "errorhandling", false );
				juicer.set ( "strip", true );
				juicer.set ( "detection", false );
				this.store = this.store || new FAPUI.Store ();
				FAPUI.applyIf ( this.store, {
					url : me.dataUrl,
					params : me.baseParams
				} );
				me.store.on ( "refresh", this._refreshView, this );
				//浏览器类型信息
				me.browser = me._getBrowser ();
			},
			/**
			 * 渲染组件至目标对象
			 * @param {*} el
			 * @private
			 */
			render : function ( el ) {

				var me = this;

				me.callParent ( [ el ] );
			},
			/**
			 * 创建Dom元素
			 * @private
			 */
			createDom : function () {

				var me = this;

				me.contentEl = $ ( "<div class=\"trigger-content\" style=\"height:100px;\"></div>" );
				me.contentEl.appendTo ( $ ( document.body ) );
				me.id = me.id || FAPUI.getId ();

				var tmp = juicer ( this.tpl, me );

				if ( me.data ) {
					me.dataLoaded = true;
					me._refreshView ( null, me.data );
					delete this.store;
				}
				return tmp;
			},
			/**
			 * 设置默认值
			 * @private
			 */
			setDefaultValue : function () {

				var me = this;

				if ( me.value ) {
					me.setValue ( me.value );
				}
			},
			/**
			 * 手动给combox设置值
			 * @param {*} v 格式：显示值##隐藏值
			 */
			setValue : function ( v ) {

				var me = this;

				if ( v === "" ) {
					return;
				}
				v = String ( v );//数字转化为字符,v如果是数字没有split方法就会报错

				var vs = v.split ( "##" );

				if ( vs.length === 2 ) {
					me.callParent ( [ vs[ 0 ] ] );
					me.setRawValue ( vs[ 1 ] );
				} else {
					me.callParent ( [ vs[ 0 ] ] );
					me.findRawValue ( me.value );
				}
			},
			/**
			 * @private
			 */
			contentPosition : function () {

				var me = this;

				if ( me.isEqualWidth ) {
					//下拉列表宽度

					var offset = me.browser.version <= "8.0" ? me.arrowWidth + 3 : me.arrowWidth + 4;

					me.contentEl.width ( me.fieldWidth + offset );
				}

				//定位下拉框
				var docHeight = $ ( window ).height ();//document.documentElement.offsetHeight;
				//下拉左偏移量
				var pos = $ ( "span.combo a.combo-arrow", me.el ).offset ();
				var comboWidth = me.width - me.labelWidth;

				var lf = comboWidth - 17;

				if ( me.browser.version <= "8.0") {
					lf -= 1;
				};

				var input = me._getRawField ();
				var inputHeight = input.height ();
				var top = input.offset ().top;

				var offsetTop = me.browser.version > "7.0"&&me.browser.msie ? pos.top + inputHeight + 2 : pos.top + inputHeight + 2;

				var offsetLeft = pos.left - lf;

				me.contentEl.css ( {
					left : offsetLeft,
					top : offsetTop
				} );

				//下拉列表弹出位置边界控制

				var maxHeight = docHeight - me.contentEl.height () - inputHeight - 5;

				top > maxHeight && me.contentEl.css ( {
					"top" : - me.contentEl.height () + top - 3,
					"border-top" : "1px solid #7EADD9"
				} );
			},

			/**
			 * 绑定右边下拉按钮事件处理
			 * @private
			 */
			bindEvent : function () {

				var me = this;
				var result=[];
				me.callParent ();

				me.contentEl.click ( function ( event ) {

					var cur = $ ( event.target );
					if ( cur.is ( "li" ) ) {
						var value = cur.attr ( "v" );
						var text = cur.html ();

						var index = cur.attr ( "index" );
						if(me.combSelected){

							if(cur.hasClass("selected")){
								cur.removeClass("selected").addClass("remove");
								result.remove(value);
							}else{
								cur.removeClass("remove").addClass("selected");
								result.push(value);
							}

							me.fireEvent ( "select", value, text, me.data, index );
							me.setValue ( result );
						}else{
							me.fireEvent ( "select", value, text, me.data, index );
							me.setValue ( value );
							cur.parent ().parent ().parent ().hide ();
							me.fireEvent ( "collapse", me );

						}
					}


					event.preventDefault ();
				} );
				if ( me.editAble ) {
					/**
					 * 按键响应处理
					 * @private
					 */
					var keyupFn = function () {
						var value = me.getRawValue ();

						if ( me.queryUrl || me.store.url ) {
							var url = me.queryUrl || me.store.url + "/query";
							var params = {
								text : value
							};

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

									var cfg = {};

									cfg.data = data.result;
									cfg.valueField = me.valueField;
									cfg.textField = me.textField;

									var contentTmp = juicer ( me.contentTpl, cfg );

									me.contentEl.html ( contentTmp );
								}
							} );
							me.contentPosition ();
							me.contentEl.show ();
							me.queryFlag = true;//模糊查询标记,如果查询则为true,没有查询则为false
						}
					};

					var task = new FAPUI.DelayedTask ( keyupFn, me );

					$ ( "input.combo-text", me.el ).keyup ( function () {
						task.delay ( 50 );
					} );

				}

				$ ( "span.combo a.combo-arrow", me.el ).click ( function ( event ) {
					if ( me.disabled ) {
						return;
					}
					$ ( this ).parent ().addClass ( "input-onfoucs" );
					if ( me.fireEvent ( "expand", me ) === false ) {
						event.preventDefault ();
						return false;
					}

					if ( me.triggerLoad ) {
						me._loadData ();
					}
					if ( ! me.dataLoaded && me.store ) {//如果数据没有加载,数据源存在的情况下加载数据
						me._loadData ();
					}
					if ( me.contentEl.is ( ":hidden" ) ) {
						me.contentPosition ();
						if ( me.queryFlag ) {//如果查询标记为true,则对contentEL重新加载
							me._refreshView ( null, me.data );
							me.queryFlag = false;
						}
						me.contentEl.show ();
					} else {
						me.contentEl.hide ();
					}
					event.preventDefault ();

				} );

				//关闭下拉列表
				$ ( document ).bind ( "mousedown", function ( event ) {

					var target = $ ( event.target );

					if ( ! target.is ( "div.trigger-content,div.trigger-content *" ) ) {
						me.contentEl && me.contentEl.hide ();
						$ ( "span.combo a.combo-arrow", me.el ).parent ().removeClass ( "input-onfoucs" );
					}
				} );
				if ( ! me.editAble ) {
					me._getRawField ().bind ( "keydown", function ( event ) {
						return false;
					} );

					me._getRawField ().bind ( "keyup", function ( event ) {
						return false;
					} );
				}
			},

			/**
			 * 根据隐藏值,查询显示值
			 * @param {*} v
			 */
			findRawValue : function ( v ) {
				var me = this;
				var value = v;

				var flag = false;//查找标志

				if ( me.data ) {
					$ ( me.data ).each ( function () {

						var that = this;

						if ( that[ me.valueField ] === v ) {
							value = that[ me.textField ];//如果查到则返回
							flag = true;
							return false;
						}
					} );
				}else if ( me.store.data ) {
					$ ( me.store.data ).each ( function () {

						var that = this;

						if ( that[ me.valueField ] === v ) {
							value = that[ me.textField ];//如果查到则返回
							flag = true;
							return false;
						}
					} );
				 }
					if ( ! flag && me.firstUrl ) {
					var url = me.firstUrl;

					var params = {
						"value" : v
					};

					$.post ( url, params, function ( data ) {
						me.setRawValue ( data.text );
					} );
				}
				me.setRawValue ( value );

			},

			/**
			 * 加载本地数据
			 * @param {*} data
			 */
			loadLocalData : function ( data ) {

				var me = this;

				me._refreshView ( null, data );
			},

			/**
			 * 给Combo加载数据
			 * @private
			 */
			_loadData : function () {

				var me = this;

				me.store.load ();
				me.dataLoaded = true;
			},
			/**
			 * 获取Combo存值的对象
			 * @private
			 */
			_getField : function () {
				var me = this;

				var f = $ ( "input.combo-value", me.el );

				return f.length === 0 ? null : f;
			},
			/**
			 * 获取Combo对象
			 * @private
			 */
			_getRawField : function () {
				var me = this;

				var f = $ ( "input.combo-text", me.el );

				return f.length === 0 ? null : f;
			},
			/**
			 * 刷新Combo数据
			 * @private
			 */
			_refreshView : function ( store, data ) {

				var me = this;

				me.data = data || store.data;//如果data与Store同时存在以data的值为准
				me.data = me.data || [];
				if ( me.data.length > 0 ) {

					var cfg = {};

					cfg.data = me.data;
					cfg.valueField = me.valueField;
					cfg.textField = me.textField;

					var contentTmp = juicer ( this.contentTpl, cfg );

					me.contentEl.html ( contentTmp );
				}
			},
			/**
			 * 给Combo重新加载数据
			 * @method reload
			 */
			reload : function () {

				var me = this;

				me.store.reload ();
			},
			/**
			 * 设置Combo宽度
			 * @method setWidth
			 * @param {Nmuber} wid
			 */
			setWidth : function ( wid ) {

				var me = this;

				me.arrowWidth = me.arrowWidth || me.el.children ( "span.combo" ).children ( "a.combo-arrow" ).width ();
				me.fieldWidth = wid - me.arrowWidth;
				if ( ! me.hideLabel ) {
					me.fieldWidth = me.fieldWidth - me.labelWidth;
				}

				var pr = parseInt ( me.el.find ( "input.combo-text" ).css ( "padding-right" ) );

				me.fieldWidth = me.fieldWidth - pr - 3;
				me.el.find ( "input" ).css ( "width", me.fieldWidth );
				this.width = wid;
				this.el.width ( wid-1 );
			},
			/**
			 * 设置Combo的高度
			 * @method setHeight
			 * @param {Nmuber} h
			 */
			setHeight : function ( h ) {

			},
			/**
			 * 设置输入框是否禁用
			 * @method setDisabled
			 * @param {boolean} dised
			 */
			setDisabled : function ( dised ) {

				var me = this;

				if ( dised ) {
					me.disabled = true;
					me._getRawField ().attr ( "disabled", true );
					me.el.find ( "a" ).attr ( "disabled", true );

				} else {
					me.disabled = false;
					me._getRawField ().attr ( "disabled", false );
					me.el.find ( "a" ).attr ( "disabled", false );

				}
			},

			/**
			 * 设置输入框是否为只读
			 * @method setReadOnly
			 * @param {boolean} rOnly
			 */
			setReadOnly : function ( rOnly ) {

				var me = this;

				if ( rOnly ) {
					me.readOnly = true;
					me._getRawField ().attr ( "readOnly", true );
					//me.el.find ( "a" ).attr ( "disabled", true );
				} else {
					me.readOnly = false;
					me._getRawField ().attr ( "readOnly", false );
					//me.el.find ( "a" ).attr ( "disabled", false );
				}
			},
			/**
			 * 获取浏览器类型信息
			 * @private
			 * @return {Object}
			 */
			_getBrowser : function () {
				var _agent = navigator.userAgent.toLowerCase ();
				var _browser = {
					agent : _agent,
					msie : /msie/.test ( _agent ),
					firefox : /mozilla/.test ( _agent ) && ! /(compatible|webkit|chrome)/.test ( _agent ),
					opera : /opera/.test ( _agent ),
					chrome : /chrome/.test ( _agent ),
					safari : /webkit/.test ( _agent ) && ! /chrome/.test ( _agent ),
					version : ( _agent.match ( /.+(?:chrome|firefox|msie|version)[\/: ]([\d.]+)/ ) || [ 0, 0 ] )[ 1 ]

				};

				return _browser;
			},

			/**
			 *
			 */
			onDestroy : function () {

				var me = this;

				me.contentEl.remove ();
				delete me.contentEl;
				me.dataLoaded = false;
				me.callParent ();
			}
		}
	} );
	FAPUI.register ( "combobox", FAPUI.form.ComboxField );

	return FAPUI.form.ComboxField;
} );
