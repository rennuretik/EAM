
/*
 * Sunyard.com Inc.
 * Copyright (c) 2014-2016 All Rights Reserved.
 */

/***定义FAPUI.Store数据存储对象
 * <p>以下代码将演示如何使用Store对象</p>
 var store = new FAPUI.Store({
		start:20,
		limit:50,
		baseParams:{"name":"whj"},
		//idProperty:"userId",
		listeners:{
			"refresh":function(store){
				store.updateData("0","userName","111");
				alert(store);
			},
			"append":function(store,appendData,appendIndex){
				alert(store);
				alert(appendData);
				alert(appendIndex);
			},
			"beforeupdate":function(store,row,index,id,field,value){
				alert(store);
				alert(row);
				alert(index);
				alert(id);
				alert(field);
				alert(value);
			},
			"afterupdate":function(store,row,index,id,field,value){
				alert(store);
				alert(row);
				alert(index);
				alert(id);
				alert(field);
				alert(value);
			}
		}
	});

 *@class FAPUI.Store
 *@extend FAPUI.Observable
 */

define ( function ( require ) {

	require ( "./fapui-observable" );

	FAPUI.define ( "FAPUI.Store", {
		extend : "FAPUI.Observable",

		/**
		 * 构造方法初始化配置
		 * @constructor
		 */
		constructor : function ( cfg ) {
			var me = this;

			me.callParent ( [ cfg ] );
			FAPUI.apply ( this, cfg || {} );
			me.addEvents ( /**
				 * 加载数据时触发，执行Load和reload方法时触发，若返回false则不会执行Load和reload方法
				 * @event beforerefresh
				 * @param Store {Object} Store组件本身
				 */
				"beforerefresh",

				/**
				 * 加载数据时触发，执行Load和reload方法时触发
				 * @event refresh
				 * @param Store {Object} Store组件本身
				 */
				"refresh",

				/**
				 * 追加数据时触发，即执行appendLoad方法触发
				 * @event append
				 * @param Store {Object} Store组件本身
				 * @param appendData {Object} 新的数据
				 * @param startIndex {Number} 开始索引
				 */
				"append",

				/**
				 * 更新数据之前触发，updataDataAt，updataData方法调，有处理函数返回false时不处理
				 * @event beforeupdate
				 * @param Store {Object} Store组件本身
				 * @param row {Object} 新的数据
				 * @param Index {Number} 索引
				 * @param Id {String}
				 * @param Field {String}
				 * @param value {String}
				 */
				"beforeupdate",

				/**
				 * 更新数据之后触发，updataDataAt，updataData方法调，有处理函数返回false时不处理
				 * @event afterupdate
				 * @param Store {Object} Store组件本身
				 * @param row {Object} 新的数据
				 * @param Index {Number} 索引
				 * @param Id {String}
				 * @param Field {String}
				 * @param value {String}
				 */
				"afterupdate" );
		}, props : {

			/**
			 * 排序方向
			 * @property sortDesc
			 * @type String
			 * @default "asc"
			 */
			sortDesc : "asc",

			/**
			 * 请求参数
			 * @property baseParams
			 * @type Object
			 * @default {}
			 */
			baseParams : {},

			/**
			 * 上次请求的参数
			 * @private
			 * @type Object
			 * @default {}
			 */
			lastOptions : {},

			/**
			 * 全部数据对象\
			 * @property totalData
			 * @type Array
			 * @default []
			 */
			totalData : [],

			/**
			 * 对应的返回后台数据的URL
			 * @property url
			 * @type String
			 * @default ""
			 */
			url : "",

			/**
			 * 数据对象
			 * @private
			 * @type Array
			 * @default []
			 */
			data : [],

			/**
			 * 开始标记
			 * @private
			 * @type Number
			 * @default 0
			 */
			start : 0,

			/**
			 * 允许加载的记录数
			 * @private
			 * @type Number
			 * @default 50
			 */
			limit : 50,

			/**
			 * Id字段对应的字段名
			 * @property idProperty
			 * @type String
			 * @default "_gridRowIndex"
			 */
			idProperty : "_gridRowIndex",

			/**
			 * 排序类型
			 * @property sortType
			 * @type String
			 * @default "local"
			 */
			sortType : "local",

			/**
			 * fap版本,主要用于分页参数时，fap4时采用PagingOrder,fap3时采用PaginationBeanParam
			 * @property fapVersion
			 * @type number
			 * @default 4
			 */
			fapVersion : 4,

			resultField : "",

			count : 0
		}, override : {
			/**
			 *
			 * @param {*} params
			 * @param {string} url
			 */
			refresh : function ( params, url ) {
				var me = this;

				me.start = 0;
				me.load ( url, params );
			},

			/**
			 * 加载数据
			 * 如果不带参数则使用配置项内的url和baseparams
			 * 如果params内参数属性和baseParams有冲突则以params为准
			 * 请求后后把所有的配置放入lastOptions,此操作将替换原数据
			 * @method load
			 * @param {string} url
			 * @param {Object} params
			 */
			load : function ( url, params ) {
				var me = this;

				params = params || {};
				url = url || me.url;
				FAPUI.applyIf ( params, me.baseParams || {} );
				if (me.url) {
					me.loadData ( url, params );
				}
				if (me.data) {
					me.loadLocalData ( me.data );
				}

			},

			/**
			 * 使用lastOptions内的参数进行重新请求数据,此操作将替换原数据
			 * @method reload
			 */
			reload : function () {
				var me = this;
				var url = me.lastOptions.url || me.url;

				delete me.lastOptions.url;
				var params = me.lastOptions || me.baseParams;

				me.loadData ( url, params );
			},

			/**
			 * 加载本地数据对象,填充totalData,data,mapData
			 * @method loadLocalData
			 * @param {Object} data
			 */
			loadLocalData : function ( data ) {
				var me = this;

				me.data = data;
				FAPUI.apply ( me.totalData, data );
				me.count = data.length;
				me._processIdData ();
			},

			/**
			 * 处理主键值数据，提供根据主键值可以直接得到该记录数据
			 * @private
			 */
			_processIdData : function () {
				var me = this;

				var idProperty = me.idProperty;

				if ( idProperty ) {
					me.mapData = me.mapData || {};
					var i = me.start;

					$ ( me.data ).each ( function () {
						var that = this;

						that._gridRowIndex = i ++;
						var key = that[ idProperty ];

						me.mapData[ key ] = that;
					} );
				}
				me.fireEvent ( "refresh", me );
			},

			/**
			 * 筛选数据
			 * 把totalData中的数据通过输入的函数进行筛选,放入data属性中,并返回data
			 * 同步触发beforerefresh,refresh事件
			 * @method filter
			 * @param {Array} fn 参数:每条数据对象,fn返回true,数据加入data
			 */
			filter : function ( fn ) {
				var me = this;

				if ( me.fireEvent ( "beforerefresh", me ) === false ) {
					return;
				}
				var totalData = me.totalData;
				var data = [];

				$ ( totalData ).each ( function () {
					var that = this;

					if ( fn.call ( me, that ) !== false ) {
						data.push ( that );
					}
				} );
				me.data = data;

				me.fireEvent ( "refresh", me );
				return data;
			},

			/**
			 * 加载数据
			 * @private
			 * @param {string} url
			 * @param {Object} params
			 */
			loadData : function ( url, params ) {
				var me = this;

				if ( me.fireEvent ( "beforerefresh", me ) === false ) {
					return;
				}
				FAPUI.apply ( params, me.getPageParams () );
				$.post ( url, params, function ( data ) {
					me._processData ( data );
					me._updateLastOptions ( url, params );
				} );
			},

			/**
			 * 获取分页参数
			 * @returns {*}
			 */
			getPageParams : function () {
				var me = this;

				if ( me.fapVersion >= 4 ) {
					return me._fap4PageParams ();
				}
				return me._fap3PageParams ();
			},

			/**
			 *  fap3版本的分页参数
			 * @returns {{start: *, limit: *}}
			 * @private
			 */
			_fap3PageParams : function () {
				var me = this;

				return {
					"start" : me.start, "limit" : me.limit
				};
			},

			/**
			 * fap4版本的分页参数
			 * @returns {{pageNum: *, pageSize: *}}
			 * @private
			 */
			_fap4PageParams : function () {
				var me = this;

				return {
					"pageNum" : me.getCurrentPage(), "pageSize" : me.limit
				};
			},

			/**
			 * 回调函数处理数据
			 * @param {Object} data
			 * @private
			 */
			_processData : function ( data ) {
				var me = this;
				//处理后台返回的json数据，转换成需要的 封装结果
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
					if ( data.start ) {//griddata
						me._processData3 ( data );
					} else {
						me._processData4 ( data );
					}
				} else {
					if ( data.start ) {//griddata
						me._processError3 ( data );
					} else {//GenericResult
						me._processError4 ( data );
					}
				}
			},

			/**
			 * 处理3.0版本及之前的错误信息
			 * @param {Object} data
			 * @private
			 */
			_processError3 : function ( data ) {
				if ( FAPUI.isObject ( data ) ) {
					data.errorMessage = data.errorMessage || "数据加载失败或数据格式有误";
					alert ( data.errorMessage );
				} else {
					alert ( "数据加载失败或数据格式有误" );
				}

			},

			/**
			 * 处理4.0之后的错误信息
			 * @param {Object} data
			 * @private
			 */
			_processError4 : function ( data ) {
				alert ( data.message || "数据加载失败或数据格式有误" );

			},

			/**
			 * 处理3.x之前的数据，对应后台是GridData对象
			 * @param {Object} data
			 * @private
			 */
			_processData3 : function ( data ) {
				var me = this;

				me.data = data.results;
				FAPUI.apply ( me.totalData, data.results );
				me.count = data.count;
				me._processIdData ();
			},

			/**
			 * 处理4.0之后的数据，对应后台是GenericResult对象
			 * @param {Object} data
			 * @private
			 */
			_processData4 : function ( data ) {
				var me = this;

				me.data = data.result;
				FAPUI.apply ( me.totalData, data.result );
				if(data.pagingTools){
					me.count = data.pagingTools.items || me.data.length || 0;
				}else{
					me.count = me.data.length || 0;
				}

				me._processIdData ();
			},


			/**
			 * 更新查询动作及参数
			 * @private
			 */
			_updateLastOptions : function ( url, params ) {
				var me = this;

				var lastOptions = params;

				FAPUI.apply ( lastOptions, {
					"url" : url
				} );
				me.lastOptions = lastOptions;
			},

			/**
			 * 删除所有的数据并触发refresh事件
			 */
			removeAll : function () {
				var me = this;

				me.fireEvent ( "beforerefresh", me );
				me.totalData = [];
				me.data = [];
				me.fireEvent ( "refresh", me );
			}, /**
			 * 加载数据,如果不带参数则使用配置项内的url和baseparams
			 * 如果params内参数属性和baseParams有冲突则以params为准,此操作将在原数据的基础上追加数据
			 * @method appendLoad
			 * @param {string} url
			 * @param {Object} params
			 */
			appendLoad : function ( url, params ) {
				var me = this;

				params = params || {};
				url = url || me.url;

				FAPUI.applyIf ( params, me.baseParams || {} );
				FAPUI.applyIf ( params, {
					"start" : me.start, "limit" : me.limit
				} );
				$.post ( url, params, function ( data ) {
					me._processAppendData ( data );
				} );
			},

			/**
			 * 回调函数处理附加数据
			 * @param {Object} data
			 * @private
			 */
			_processAppendData : function ( data ) {
				var me = this;
				//处理后台返回的json数据，转换成需要的 封装结果
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
					if ( data.start ) {//griddata
						me._processAppendData3 ( data );
					} else {
						me._processAppendData4 ( data );
					}
				} else {
					if ( data.start ) {//griddata
						me._processError3 ( data );
					} else {//GenericResult
						me._processError4 ( data );
					}
				}
			},

			/**
			 * 处理3.x之前的数据，对应后台是GridData对象
			 * @param {Object} data
			 * @private
			 */
			_processAppendData3 : function ( data ) {
				var me = this;

				me.data = me.data || {};
				var startIndex = me.data.length + 1;

				me.data = me.data.concat ( data.results );
				me.count = data.count;
				me._processIdData ();
				me.fireEvent ( "append", me, data.results, startIndex );
			},

			/**
			 * 处理4.0之后的数据，对应后台是GenericResult对象
			 * @param {Object} data
			 * @private
			 */
			_processAppendData4 : function ( data ) {
				var me = this;

				me.data = me.data || {};
				var startIndex = me.data.length + 1;

				me.data = me.data.concat ( data.result );

				me.count = data.pagingTools.items || me.data.length || 0;

				me._processIdData ();
				me.fireEvent ( "append", me, data.result, startIndex );
			},

			/**
			 * 获取数据,从mapData属性内取数
			 * @method getData
			 * @param {string} id
			 * @return {Object}
			 */
			getData : function ( id ) {
				return this.mapData[ id ];
			},

			/**
			 * 获取数据,从data属性内取数
			 * @method getDataAt
			 * @param {number} index
			 * @return {Object}
			 */
			getDataAt : function ( index ) {
				return this.data[ index ];
			},

			/**
			 * 更新数据,必须同时更新data,mapData属性
			 * @method updateDataAt
			 * @param {number} index
			 * @param {string} field
			 * @param {string} v
			 */
			updateDataAt : function ( index, field, v ) {
				var me = this;
				var o = me.data[ index ];

				if ( ! o ) {
					alert ( FAPUI.lang.OUTOFINDEX.format ( index ) );
					return false;
				}
				if ( me.fireEvent ( "beforeupdate", me, o, index, me.idProperty, field, v ) !== false ) {
					o[ field ] = v;
					me.data[ index ] = o;
					if ( me.mapData ) {
						var id = o[ me.idProperty ];

						me.mapData[ id ] = o;
					}
					me.fireEvent ( "afterupdate", me, o, me.idProperty, index, me.idProperty, field, v );
				}
			},

			/**
			 * 更新数据,必须同时更新data,mapData属性
			 * @method updateData
			 * @param {number} id
			 * @param {string} field
			 * @param {string} v
			 */
			updateData : function ( id, field, v ) {
				var me = this;
				var index = 0;

				$ ( me.data ).each ( function () {
					var that = this;

					if ( that[ me.idProperty ] === id ) {
						return false;
					}
					index ++;
				} );
				var o = me.mapData[ id ];

				if ( ! o ) {
					alert ( FAPUI.lang.NOTFINDBYID.format ( id ) );
					return false;
				}
				if ( me.fireEvent ( "beforeupdate", me, o, index, id, field, v ) !== false ) {
					o[ field ] = v;
					me.mapData[ id ] = o;
					me.fireEvent ( "afterupdate", me, o, index, id, field, v );
				}
			},

			/**
			 * 根据sortType不同进行排序
			 * @method sort
			 * @param {string} field
			 * @param {string} desc
			 */
			sort : function ( field, desc ) {
				var me = this;

				if ( me.sortType === "local" ) {
					me.localSort ( field, desc );
				} else {
					me.remoteSort ( field, desc );
				}
			},

			/**
			 * 本地排序
			 * @private
			 */
			localSort : function ( field, desc ) {
				var me = this;

				me.fireEvent ( "beforerefresh", me );
				desc = desc || me.sortDesc;
				field = field || me.sortField;
				if ( desc === "asc" ) {
					me.data.sort ( function ( a, b ) {
						return a[ field ] > b[ field ] ? 1 : - 1;
					} );
				} else {
					me.data.sort ( function ( a, b ) {
						return a[ field ] < b[ field ] ? 1 : - 1;
					} );
				}
				me._processIdData ();
				me.fireEvent ( "sort", me, field, desc );
			},

			/**
			 * 远程排序
			 * @private
			 */
			remoteSort : function ( field, desc ) {
				var me = this;

				desc = desc || me.sortDesc;
				field = field || me.sortField;
				me.fireEvent ( "sort", me, field, desc );
				me.load ( null, {
					"sort" : field, "dir" : desc
				} );
			},

			/**
			 * 当前页
			 * @return {number}
			 */
			getCurrentPage : function () {
				var me = this;

				return parseInt ( me.start / me.limit ) + 1;
			},

			/**
			 * 获取总页数
			 * @return {number}
			 */
			getTotalPage : function () {
				var me = this;

				return me.count % me.limit === 0 ? me.count / me.limit : parseInt ( me.count / me.limit, 10 ) + 1;
			}
		},

		/**
		 * 下一页移动
		 */
		toNext : function(){
			var me = this;

			me.start = me.start + me.limit;
			me.reload ();
		},

		/**
		 * 移至首页
		 */
		toFirst : function(){
			var me = this;

			me.start =0;
			me.reload ();
		},

		/**
		 * 移至尾页
		 */
		toEnd : function(){
			var me = this;

			me.start = parseInt ( me.count % me.limit === 0 ? me.count / me.limit - 1 :
										me.count / me.limit ) * ( me.limit );
			me.reload ();
		},

		/**
		 * 移至上一页
		 */
		toPrev : function(){
			var me = this;

			me.start = me.start - me.limit < 0 ? 0 : me.start - me.limit;
			me.reload ();
		}
	} );
	FAPUI.register ( "store", FAPUI.Store );
	return FAPUI.Store;
} );
