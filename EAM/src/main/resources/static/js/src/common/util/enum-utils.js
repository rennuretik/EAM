/**
 * 枚举数据列表
 * 枚举列表获取方式 EnumUtils.枚举名称.data
 * 枚举中文获取方式 EnumUtils.枚举名称.getText(key值)
 * 单个枚举获取方式 EnumUtils.枚举名称.ENUM[枚举Name]
 * Created by qianbobo on 2016/4/8.
 */
seajs.use("jquery",function(){
	( function ( global ) {
		$ ( function () {

			var EnumUtils = {
				View:new Enum("com.zjrcu.mcs.core.agent.enums.View"),
				Facility:new Enum("com.zjrcu.mcs.core.agent.enums.Facility"),
				Screen:new Enum("com.zjrcu.mcs.core.agent.enums.Screen")
			};
			function Enum( clazz ){
				this.clazz = clazz;
				this.data = [];
				this.ENUM = {};
				this.init = function(){
					var e = this.ENUM;
					for(var i=0;i<this.data.length;i++){
						e[this.data[i ].name]={
							value : this.data[i ].value,
							text : this.data[i ].text,
							mixText : function(){
								return this.value + "##" + this.text;
							}
						};
					}
					/*this.data.forEach(function(obj){
						e[obj.name] = {
							value : obj.value,
							text : obj.text,
							mixText : function(){
								return this.value + "##" + this.text;
							}
						};
					});*/
				};
				this.getText = function(value){
					if( typeof (value) == "undefined" || value==null ) {
						return "";
					}
					var result;
					this.data.forEach(function(obj){
						if( obj.value==value ){
							result = obj.text;
							return;
						}
						if(obj.name== value){
							result = obj.text;
							return;
						}
					});
					return result;
				}
			};

			var classes = [];
			for(var name in EnumUtils){
				classes.push ( EnumUtils[name].clazz );
			}
			$.ajax ( {
				url : FAPUI.CONTEXT_PATH + "/mcsenum",
				dataType : "json",
				type : "post",
				traditional : true,
				async : false,
				data : {
					classes : classes
				},
				success : function ( result ) {
					if(!result.success)
						return;
					for(var name in EnumUtils){
						EnumUtils[name].data = result.result[0][EnumUtils[name].clazz];
						EnumUtils[name].init(EnumUtils[name].data);
					}
				},
				error : function ( result ) {
				}
			} );
			global.EnumUtils = EnumUtils;
		});
	} ) ( window );
});


