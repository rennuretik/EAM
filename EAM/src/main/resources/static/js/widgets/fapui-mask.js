/**
*@class FAPUI.Mask
 *@author szx
 *
 *用法如下
 *var mask = new FAPUI.Mask({
 *	target : formPanel,
 *		msg : '我是遮罩'
 *	});
 *  显示遮罩
 *  mask.show();
 *  //隐藏遮罩
 *  mask.hide();
 */
define(function(require, exports, module){
	var importcss = "./themes/" + FAPUI.getTheme () + "/css/ui-mask.css"
	require.async(importcss);

	require ( "./fapui-component" );

	FAPUI.define ( "FAPUI.Mask", {
		extend : "FAPUI.Component",
		props : {
		   /**
			* mask id
			* @property  maskId
			* @type String
			* @default '' 
			*/
		   maskId : "",
			/**
			 * msg 遮罩信息
			 * @property  msg
			 * @type String
			 * @default "请稍后......"
			 */
			msg : "请稍后......",
			/**
			 * target 遮罩显示的目标区域（容器面板）
			 * @property  target
			 * @default null
			 */
			target : null,
			/**
			 * 是否显示过标志
			 * @private
			 * @property  showFlag
			 * @default false
			 */
			showFlag : false
		},
		override : {
			/**
			 * 初始化配置项
			 * @private 
			 */
			initConfig : function() {
				var me = this;
				me.callParent();
			},
			/**
			 * 显示mask
			 * @method show
			 * @property msg mask显示时显示的提示信息
			 * @property target mask要遮罩的对象
			 */
			show : function(msg,target) {
				var me = this;
				me.showFlag = true;
				var target = target || me.target;
				
				if(!me.mask){
					me.createMask(target);
				}
				
				var mg = msg || me.msg;
				me.msgDiv.html(mg);
				
				me.mask.show();
				me.msgDiv.show();
				
				me.mask.css({"z-index" : FAPUI.zindex ++});
				me.msgDiv.css({"z-index":FAPUI.zindex ++});
				
				var a = setInterval(function(){
					if(me.showFlag){
						me.mask.css({
							"top" : target.el.offset().top,
							"left" : target.el.offset().left,
							"width" : target.el.outerWidth(true),
							"height" : target.el.outerHeight(true)
						});
						me.msgDiv.css({
							"top":target.el.offset().top+me.mask.height()/2,
							"left":target.el.offset().left+me.mask.width()/2 - 60
						});
					}else{
						clearInterval(a);
					}
				}, 100);
			},
			/**
			 * 隐藏mask
			 * @method close
			 */
			hide:function(){
				var me = this;
				if(me.mask){
					me.showFlag = false;
					me.mask.hide();
					me.msgDiv.hide();
				}
			},
			/**
			 * 销毁组件
			 * 重写父类的onDestroy方法
			 * @private 
			 */
			onDestroy:function(){
				var me = this;
				me.mask && me.mask.remove() && (delete me.mask);
				me.callParent();
			},
			/**
			 * 创建模态遮罩层
			 * @private
			 */
			createMask : function(tg) {
				var me = this;
				me.target = tg || me.target;
				me.maskId = me.maskId || FAPUI.getId();
				me.mask = $ ( '<div class="ui-mask" oncontextmenu="return false" id=\""+me.maskId+"\"></div>' );
				me.msgDiv = $ ( "<div class=\"ui-mask-msg\" id=\"msgDiv\">\"+me.msg+\"</div>" )
				me.mask.appendTo($(document.body));
				me.msgDiv.appendTo($(document.body));
				var target = me.target;
				me.msgDiv = $("#msgDiv",me.mask.el);
				
				me.mask.css({
					"top" : target.el.offset().top,
					"left" : target.el.offset().left,
					"width" : target.el.outerWidth(true),
					"height" : target.el.outerHeight(true),
					"z-index" : FAPUI.zindex ++
				});
				
				me.msgDiv.css({
					"top":target.el.offset().top+me.mask.height()/2,
					"left":target.el.offset().left+me.mask.width()/2 - 60,
					"z-index":FAPUI.zindex ++
				});
			}
		}
	});
	FAPUI.register ( "mask", FAPUI.Mask );
	
	return FAPUI.Mask;
});