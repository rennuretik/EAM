var searchtree={};
searchtree.stree = [];
searchtree.proShow =function () {
	//设定ztree 展示div 的位置，展示方式
	$ ( "#"+this.treeParentId ).show ();

	//获取选中的节点，将树节点激活
	var ztree = $.fn.zTree.getZTreeObj ( this.treeId );
	ztree.showNodes ( ztree.getNodes () );

	//获取隐藏值
	var hideStr = $ ( "#"+this.hideId ).val ();

	var temArr = hideStr.split(",");

	ztree.checkAllNodes(false);
	ztree.cancelSelectedNode (false );
	for(var i=0; i<temArr.length; i++){
		var node = ztree.getNodeByParam("id", temArr[i], null);
		if(node){
			if(this.treeSettings.check){
				this.treeSettings.check.enable ? ztree.checkNode ( node, true, true ) : ztree.selectNode ( node );
			} else {
				ztree.selectNode ( node );
			}
		}
	}
};

//判断是否隐藏树
searchtree.onBodyDown =function( event ) {
	var stree = event.data._this;
	var eve = event || arguments.callee.caller.arguments[ 0 ];
	//如果点击的地方不在树上，就隐藏树
	if ( ! (eve.target.id == stree.treeParentId || $ ( eve.target ).parents ( "#"+stree.treeParentId ).length > 0) ) {
		hideTree (stree);
	}
};

//隐藏下拉树
hideTree =function (stree) {
	$ ( "#"+stree.treeParentId).hide ();
};

//单击树事件
searchtree.onClicks = function ( e, treeId, treeNode,fn) {

	var ztree = $.fn.zTree.getZTreeObj ( treeId );
	var nodes = ztree.getSelectedNodes ();
	var stree = searchtree.stree[treeId];

	var showIdObj = document.getElementById(stree.showId);
	if("INPUT" === showIdObj.nodeName){
		$ ( showIdObj ).val ( nodes[ 0 ].name );
		if(typeof fu === "function"){
			fn();
		}
	} else if("P" === showIdObj.nodeName){
		$ ( showIdObj ).text ( nodes[ 0 ].name );
	} else {

	}

	$ ( "#"+stree.hideId ).val ( nodes[ 0 ].id );

	hideTree (stree);
	
};

//复选框选中和非选中事件
searchtree.onChecks = function ( e, treeId, treeNode, checkFlage) {
	var ztree = $.fn.zTree.getZTreeObj ( treeId );
	var nodes = ztree.getCheckedNodes ();
	var stree = searchtree.stree[treeId];

	var ids = "", names = "";
	for(var i=0; i<nodes.length; i++){
		var data = nodes[i];
		ids += data.id;
		names += data.name;
		if(i != nodes.length -1){
			ids += ",";
			names += ",";
		}
	}

	var showIdObj = document.getElementById(stree.showId);
	if("INPUT" === showIdObj.nodeName){
		$ ( showIdObj ).val ( names );
	} else if("P" === showIdObj.nodeName){
		$ ( showIdObj ).text ( names );
	} else {

	}

	$ ( "#"+stree.hideId ).val ( ids );
};

//删除隐藏值
searchtree.deleteId=function(eve) {
	var orgName = "";
	var stree = eve.data._this;
	var ztree = $.fn.zTree.getZTreeObj ( stree.treeId );
	var showIdObj = document.getElementById(stree.showId);
	if("INPUT" === showIdObj.nodeName){
		orgName = $ ( showIdObj ).val ();
	} else if("P" === showIdObj.nodeName){
		orgName = $ ( showIdObj).text ();
	} else {

	}
	if ( orgName ) {
		var ns = ztree.getNodesByParam ( "name", orgName, null );
		if ( ns.length != 0 ) {
			$ ( "#"+stree.hideId ).val ( ns[ 0 ].id );
		} else {
			$ ( "#"+stree.hideId ).val ( orgName );
		}
	} else {
		$ ( "#"+stree.hideId ).val ( "" );
	}
};
//初始化
searchtree.init=function(nodes){
	var me=this;
	$.fn.zTree.init ( $ ( "#"+ this.treeId ), this.treeSettings, nodes );
	me._ztree = $.fn.zTree.getZTreeObj ( me.treeId );
	$ ( "#"+this.showId ).bind("blur", {_this : this}, this.deleteId );
	//页面绑定事件
	$ ( "body" ).bind ( "mousedown", {_this : this}, this.onBodyDown );
	$(".tree-btn").on("click", function () {
		me.proShow();
	});
};

var Stree=function(option, nodes){
	var _this = this;
	var defaults={
		treeId : "tree",
		treeParentId : "treeContent",
		hideId : "orgId",
		showId : "orgName",
		//tree的默认设置
		treeSettings:{
			view : {
				dblClickEpand : false,
				showLine : false
			},
			data : {
				simpeData : {
					enable : true
				}
			},
			callback : {
				onClick : _this.onClicks,
				onCheck : _this.onChecks
			}
		}
	};
	var opt=jQuery.extend(true, {}, defaults, option);
	// console.log(o);
	_this.treeSettings=opt.treeSettings;
	_this.hideId =opt.hideId;
	_this.showId =opt.showId;
	_this.treeId =opt.treeId;
	_this.treeParentId =opt.treeParentId;
	_this.init(nodes);
	searchtree.stree[_this.treeId] = _this;
};
Stree.prototype=searchtree;