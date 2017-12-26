/**
 *以下代码演示如何创建一个form
 *单独测试该用例时，需要在formpanel中写明renderTo属性，并制定块元素id或者是直接用document.body
 *
 *

 var formPanel =  new FAPUI.form.FormPanel({
	actionUrl : path + "/uploadController/uploadTask",
    border : false,
    //anchor:[1],
    fileUpload : true,
    submitType : 'form',
    defaultStyle:'margin-top:5px;',
    items : [
		new FAPUI.form.ComboxField({
        	itemId : 'orgid',
        	fieldLabel : '委托单位',
        	labelSplit : ':&nbsp;&nbsp;&nbsp;',
        	allowBlank : false,
        	errorMsg : '委托单位不能为空',
        	labelWidth : 100,
			anchor:'70%',
			position_right : 10,//组件本身的div的宽度微调
			itemStyle : 'padding-left:5px;margin-top:5px;',//样式可以调整组件本身上下左右的距离
        	labelAlign : 'right',
            textField : 'ORGNAME',
            valueField : 'ORGID',
            store:new FAPUI.Store({
				url:path+'/utilController/getTaskOrganinfo',
				baseParams:{clerktype:cType}
			}),
			queryUrl : path + '/comboxQueryController/getTaskOrganQuery',
			listeners : {
				'select' : function(val,text,data,index){

				}
			}
        }),
        new FAPUI.form.ComboxField({
        	itemId : 'bizid',
        	fieldLabel : '业务类型',
        	allowBlank : false,
        	errorMsg : '业务类型不能为空',
        	labelSplit : ':&nbsp;&nbsp;&nbsp;',
        	labelWidth : 100,
			anchor:'70%',
			position_right : 10,//组件本身的div的宽度微调
			itemStyle : 'padding-left:5px;margin-top:5px;',//样式可以调整组件本身上下左右的距离
        	labelAlign : 'right',
            textField : 'BIZNAME',
            valueField : 'BIZID',
            store:new FAPUI.Store({
				url:path+'/utilController/getTaskBizdef'
			}),
			queryUrl : path + '/comboxQueryController/getTaskBizQuery?corpid='+selected,
			listeners : {
				'expand':function(combo){

        		},
        		'select' : function(val,text,data,index){

				}
			}
        }),
        new FAPUI.form.TextField({
			inputType : 'hidden',
			itemId : "bankid",
			anchor:'70%'
    	}),
       new FAPUI.form.TextField({
			inputType : 'hidden',
			itemId : "agtid",
			position_right : 10,//组件本身的div的宽度微调
			itemStyle : 'padding-left:5px;margin-top:5px;',//样式可以调整组件本身上下左右的距离
			anchor:'70%'
    	}),
    	new FAPUI.form.TextField({
			inputType : 'hidden',
			itemId : "acct",
			position_right : 10,//组件本身的div的宽度微调
			itemStyle : 'padding-left:5px;margin-top:5px;',//样式可以调整组件本身上下左右的距离
			anchor:'70%'
    	}),
        new FAPUI.form.AmountField({
        	itemId : 'amount',
        	fieldLabel : '总金额',
        	errorMsg : '总金额不能为空',
        	allowBlank : false,
        	labelSplit : ':&nbsp;&nbsp;&nbsp;',
        	labelWidth : 100,
			anchor:'70%',
			position_right : 10,//组件本身的div的宽度微调
			itemStyle : 'padding-left:5px;margin-top:5px;',//样式可以调整组件本身上下左右的距离
			decimalPrecision : 2,
        	labelAlign : 'right'
        }),
        new FAPUI.form.NumberField({
        	itemId : 'num',
        	fieldLabel : '总笔数',
        	allowBlank : false,
        	errorMsg : '总笔数不能为空',
        	labelSplit : ':&nbsp;&nbsp;&nbsp;',
        	labelWidth : 100,
			anchor:'70%',
        	labelAlign : 'right'
        }),
        new FAPUI.form.NumberField({
        	itemId : 'days',
        	fieldLabel : '回执期限(天)',
        	allowBlank : false,
        	errorMsg : '回执期限必须大于'+expdate,
        	labelSplit : ':&nbsp;&nbsp;&nbsp;',
        	labelWidth : 100,
			anchor:'70%',
			minVal : expdate,
			maxLength : 8,
        	labelAlign : 'right',
            listeners : {
				'blur' : function(){

				}
            }
        }),
        new FAPUI.form.FileField({
            itemId : 'uploadFile',
            id : 'Sourcefilepath',
            fieldLabel : '业务信息文件',
            allowBlank : false,
          	errorMsg : '业务信息文件不能为空',
           	name:"enUploadFile",
			labelAlign : 'right',
			labelSplit : ':&nbsp;&nbsp;&nbsp;',
			labelWidth : 100,
			anchor:'70%'
		}),
		new TextField({
			inputType : 'hidden',
			name : "signature",
			itemId : "signature",
			anchor:'70%'
    	}),
        new FAPUI.form.TextField({
        	itemId : 'sendXml',
        	id : 'sendXml',
            name : 'sendXml',
            inputType : 'hidden'
        })
    ],
    onSuccess:function(ret){

	},
	onFailure:function(ret){

    },
    bbar : {
    	align : 'right',
        items : [{
                type : 'normalButton',
                itemId : 'UpButton',
                text : '上传',
                handler : function(btn, event) {

				}
            }, {
                type : 'normalButton',
                text : '重置',
                handler : function(btn, event) {

                }
            }]
    }
	});

 * 定义FAPUI.form.FormPanel布局组件
 * @class FAPUI.form.FormPanel
 * @extends FAPUI.Panel
 */
define ( function ( require ) {
	require ( "./fapui-panel" );
	require ( "./fapui-gridlayout" );

	FAPUI.define ( "FAPUI.form.FormPanel", {
		extend : "FAPUI.Panel",
		props : {

			/**
			 * 上工具栏
			 * @property tbar
			 * @type FAPUI.ToolBar
			 * @default null
			 */
			tbar : null,

			/**
			 * 下工具栏
			 * @property bbar
			 * @type FAPUI.ToolBar
			 * @default null
			 */
			bbar : null,

			/**
			 * 面板内容区域自定义html片段
			 * @property html
			 * @type String
			 * @default null
			 */
			html : null,

			/**
			 * 面板边框
			 * @property border
			 * @type boolean
			 * @default false
			 */
			border : false,

			/**
			 * 表单是否上传文件
			 * @property fileUpload
			 * @type boolean
			 * @default false
			 */
			fileUpload : false,
			/**
			 * 表单提交方式
			 * @property submitType
			 * @type String
			 * @default "ajax"
			 */
			submitType : "ajax"
		},
		override : {

			/**
			 * 初始化配置
			 * @private
			 */
			initConfig : function () {
				this.callParent ();
				this.addEvents ( /**
					 * 表单提交成功后触发
					 * @event success
					 * @param {Object} form表单对象本身
					 * @param {Object} data
					 */
					"success",

					/**
					 * 表单提交失败后触发
					 * @event failure
					 * @param {Object} form表单对象本身
					 * @param {Object} data
					 */
					"failure",

					/**
					 * 表单提交错误时触发
					 * @event error
					 * @param {Object} form表单对象本身
					 * @param {XMLHttpRequest} 请求对象
					 * @param textStatus 错误状态
					 * @param errorThrown 抛出的异常
					 */
					"error",

					/**
					 * 调用validate方法后,submit之前执行,如果有处理函数返回false,则不执行提交动作
					 * @event beforeSubmit
					 * @param {Object} form表单对象本身
					 */
					"beforeSubmit" );
				this.formId = this.formId || FAPUI.getId ( "form" );
				this.contenttpl = [ "<div id=\"$${pId}\" class=\"panel-content ${bodyCls}\">",
									"{@if fileUpload}",
									"<form method=\"post\" id=\"",
									this.formId,
									"\"  onsubmit=\"return false\" enctype=\"multipart/form-data\">$${html==null?\"\":html}</form>",
									"{@else}",
									"<form method=\"post\" id=\"",
									this.formId ,
									"\"  onsubmit=\"return false\">",
									"$${html==null?\"\":html}</form>",
									"{@/if}",
									"</div>" ].join ( "" );
				this.formmasktpl = [ "<div class=\"grid-loading-container\" style=\"z-index:9999;\">",
									 "<a href=\"javascript:void(0);\">",
									 "<img class=\"submit\" ", "src=\"" + FAPUI.BLANK_IMG + "\"/></a>",
									 "</div>" ].join ( "" );
				var me = this;

				var cfg = {};

				cfg.items = me.items || [];
				cfg.columns = me.columns || 1;
				cfg.anchor = me.anchor || "100";
				cfg.defaultStyle = me.defaultStyle || "margin-top:5px;";
				cfg.defaultCls = me.defaultCls || "";
				cfg.defaultSet = me.defaultSet || null;
				me.layout = new FAPUI.Layout.GridLayout ( cfg );
			},

			/**
			 * 表单信息校验
			 * @method validate
			 * @return {boolean} true：验证通过，false：验证未通过
			 */
			validate : function () {
				var items = this.layout.items;

				var flag = true;

				$ ( items ).each ( function () {
					if ( this.validate () !== true ) {
						flag = false;
						return false;
					}
				} );
				return flag;
			},

			/**
			 * 重置表单信息
			 * @method reset
			 */
			reset : function () {

				var me = this;

				if ( me.html ) {
					if ( me.contentEl ) {
						me.contentEl.html ( "" );
					}
				} else if ( me.layout.isUI && me.layout.isUI () ) {
					me.layout.reset ();
				}
			},
			/**
			 *
			 */
			afterRender : function () {

				var me = this;

				me._form = me.el.find ( "#" + me.formId );
				this.callParent ();
				me.items = me.layout.items;
			},

			/**
			 * 初始化布局
			 * @private
			 */
			initContentDom : function () {
				var me = this;

				var cfg = {};

				me.pId = FAPUI.getId ();
				cfg.pId = me.pId;
				cfg.bodyCls = me.bodyCls;
				cfg.fileUpload = me.fileUpload;
				me.layout = FAPUI.create ( this.layout );
				cfg.html = this.layout.createDom ();
				return juicer ( me.contenttpl, cfg );
			},

			/**
			 * 回调函数,通讯成功,后台代码正确执行,并且执行是成功的(返回的success=true)
			 * @method onSuccess
			 */
			onSuccess : function ( ret ) {

			},

			/**
			 * 回调函数,通讯成功,后台代码正确执行,并且执行是失败的(返回的success=false)
			 * @method onFailure
			 */
			onFailure : function ( ret ) {

			},

			/**
			 * 回调函数,通讯不成功、返回对象里没有success属性等各种情况
			 * @method onError
			 */
			onError : function ( XMLHttpRequest, textStatus, errorThrown ) {
				console.log( XMLHttpRequest, textStatus, errorThrown );
			},

			/**
			 * 提交表单
			 * @method submit
			 */
			submit : function () {

				var me = this;

				if ( me.validate () !== false ) {
					if ( me.fireEvent ( "beforeSubmit", me ) !== false ) {
						if ( me.submitType === "ajax" ) {
							me._berfroeSubmit ();
							me.onAjax ();
						} else if ( me.submitType === "form" ) {
							me._berfroeSubmit ();
							me.onSubmit ();
						}
					}
				}
			},
			/**
			 * @private
			 */
			_berfroeSubmit : function () {
				var me = this;

				if ( ! me.mask ) {
					me.mask = $ ( juicer ( me.formmasktpl, {} ) );
					me.mask.appendTo ( me.el );
				}
				me.mask.height ( me.mask.parent ().height () );
				me.mask.width ( me.mask.parent ().width () );
				this._locationMask( me.mask );
				me.mask.show ();

			},

			/**
			 * 定位遮罩的位置
			 * @param {Element} mask
			 * @private
			 */
			_locationMask : function ( mask ) {
				if ( mask.parent ().css ( "position" ) === "static" ) {
					mask.parent ().css ( "position", "relative" );
					mask.css ( "top", 0 );
					mask.css ( "left", 0 );
				} else if ( mask.parent ().css ( "position" ) === "relative" ) {
					mask.css ( "top", 0 );
					mask.css ( "left", 0 );
				} else if ( mask.parent ().css ( "position" ) === "absolute" ) {
					var offset = mask.parent ().offset ();

					mask.css ( "top", offset.top );
					mask.css ( "left", offset.left );
				}
			},
			/**
			 * ajax方式提交表单
			 * @private
			 */
			onAjax : function () {

				var me = this;

				$.ajax ( {
					url : me.actionUrl,
					type : "POST",
					dataType : "json",
					cache : false,
					data : me._form.serialize (),
					/**
					 *
					 * @param {*} XMLHttpRequest
					 * @param {*} textStatus
					 * @param {*} errorThrown
					 */
					error : function ( XMLHttpRequest, textStatus, errorThrown ) {
						if ( me.onError ) {
							me.onError ( XMLHttpRequest, textStatus, errorThrown );
						}
						me.fireEvent ( "error", me, XMLHttpRequest, textStatus, errorThrown );
					},
					/**
					 *
					 * @param {*} data
					 * @param {*} textStatus
					 * @param {*} jqXHR
					 */
					success : function ( data, textStatus, jqXHR ) {
						console.log( textStatus, jqXHR );
						if ( data.success ) {
							if ( me.onSuccess ) {
								me.mask.hide ();
								me.onSuccess ( data );
							}
							me.fireEvent ( "success", me, data );
						} else {
							if ( me.onFailure ) {
								me.mask.hide ();
								me.onFailure ( data );
							}
							me.fireEvent ( "failure", me, data );
						}
					}
				} );
			},
			/**
			 * 根据索引获取组件
			 * @method getComponent
			 * @param {number} index 组件的索引或者是组件的itemID
			 */
			getComponent : function ( index ) {

				var me = this;

				if ( FAPUI.isNumber ( index ) ) {
					return me.items[ index ];
				}

				var that;

				$ ( me.items ).each ( function () {
					if ( this.itemId === index ) {
						that = this;
						return false;
					}
				} );
				return that;
			},

			/**
			 * 获取form中表单的值
			 * @private
			 */
			getValues : function () {
				var me = this;
				var oldV = me._form.serializeArray ();

				var values = [];

				$ ( oldV ).each ( function () {
					if ( this.value ) {
						values.push ( this );
					}
				} );
				return values;
			},
			/**
			 * 初始化数据
			 * @param data
			 * @param viewOnly
			 */
			initData : function (data) {
				var me = this;
				for ( var name in data ) {
					var component = me.getComponent(name);
					if (component) {
						component.setValue(data[name ]!=null || data[name ]!=undefined ?data[name ].toString():null);
					}
				}
			},

			/**
			 * 普通方式提交表单
			 * @private
			 */
			onSubmit : function () {
				var me = this;

				if ( me.actionUrl ) {
					me._form.attr ( "action", me.actionUrl );
				}
				var iframeId = "sui_frame_" + new Date ().getTime () ;
				var iframe = $ ( "<iframe id=" + iframeId + " name=" + iframeId + "></iframe>" ).attr ( "src",
					"about:blank" ).css ( {
					position : "absolute",
					top : - 1000,
					left : - 1000
				} );

				me._form.attr ( "target", iframeId );
				var time = 10;

				/**
				 *@method cb
				 */
				var cb = function () {
					iframe.unbind ();
					var iframeBody = $ ( "#" + iframeId ).contents ().find ( "body" );
					var html = iframeBody.html ();

					if ( html === "" ) {
						if ( -- time ) {
							setTimeout ( cb, 100 );
							return;
						}
						return;
					}
					html = me._getContent( iframeBody );
					me._processJson( me, html );
					setTimeout ( function () {
						iframe.unbind ();
						iframe.remove ();
					}, 100 );
				};

				try {
					iframe.appendTo ( "body" );
					iframe.bind ( "load", cb );
					me._form[ 0 ].submit ();
				} finally {
					me._form.removeAttr ( "action" );
					me._form.removeAttr ( "target" );
				}

			},
			/**
			 * 获取form中表单的名称和值
			 * @private
			 */
			getJson:function(){
				var me = this;
				var json={};
				var oldV = me._form.serializeArray ();
				$ ( oldV ).each ( function () {
					if ( json[this.name] ) {
						if( $.isArray(json[this.name])){
							json[this.name ].push(this.value);
						}else{
							json[this.name ]=[json[this.name],this.value];
						}
					}else{
						json[this.name]=this.value;
					}
				});
				return json;
			},

			/**
			 * 获取textarea或者pre中的正文内容
			 * @private
			 * @method _getContent
			 * @param {Element} ele
			 * @returns {*|html|content}
			 */
			_getContent : function ( ele ) {
				var ta = ele.find ( ">textarea" );
				var html;

				if ( ta.length ) {
					html = ta.val ();
				} else {
					var _a = ele.find ( ">pre" );

					if ( _a.length ) {
						html = _a.html ();
					}
				}
				return html;
			},
			/**
			 * 处理Json字符串
			 * @method processJson
			 * @private
			 * @param {Object} cmp
			 * @param {string} jsonStr
			 */
			_processJson : function ( cmp, jsonStr ) {
				try {
					var _json = $.parseJSON ( jsonStr );

					if ( _json.success ) {
						if ( cmp.onSuccess ) {
							cmp.mask.hide ();
							cmp.onSuccess ( _json );
						}
						cmp.fireEvent ( "success", cmp, _json );
					} else {
						if ( cmp.onFailure ) {
							cmp.mask.hide ();
							cmp.onFailure ( _json );
						}
						cmp.fireEvent ( "failure", this, _json );
					}
				} catch ( e ) {
					cmp._processError( cmp, e );
				}
			},
			/**
			 * 处理错误
			 * @private
			 * @method processError
			 * @param {Object} cmp
			 * @param {Error} e
			 */
			_processError : function ( cmp, e ) {
				if ( cmp.onError ) {
					cmp.onError ( null, null, e );
				}
				cmp.fireEvent ( "error", cmp, null, null, e );
			}
		}
	} );
	FAPUI.register ( "from", FAPUI.form.FormPanel );

	return FAPUI.form.FormPanel;

} );
