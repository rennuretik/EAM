(function(global) {
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
			hideTree(stree);
		}
	};

//隐藏下拉树
	global.hideTree =function (stree) {
		$ ( "#"+stree.treeParentId).hide ();
	};

	global.onNodeCreated=function( e, treeId, treeNode){
		if (treeNode.checked) {
			var ztree = $.fn.zTree.getZTreeObj(treeId);
			ztree.reAsyncChildNodes(treeNode, "refresh");
		}
	};
//单击树事件
	global.onClicks = function ( e, treeId, treeNode,fn) {

		var ztree = $.fn.zTree.getZTreeObj ( treeId );
		var nodes = ztree.getSelectedNodes ();
		var stree = searchtree.stree[treeId];
		var val=nodes[ 0 ].name;
		var showIdObj = document.getElementById(stree.showId);
		if("INPUT" === showIdObj.nodeName){

			$ ( showIdObj ).val ( val );
			if(typeof fn === "function"){
				fn();
			}
		} else if("P" === showIdObj.nodeName){
			$ ( showIdObj ).text ( nodes[ 0 ].name );
		}

		$ ( "#"+stree.hideId ).val ( nodes[ 0 ].id );

		hideTree(stree);

	};
//清空输入框的值
	searchtree.clearval=function(){
		$ ( "#"+this.showId ).val ("");
		$ ( "#"+this.hideId ).val ("")
	}
//获取输入框的值
	searchtree.getval=function () {
		return $( "#"+this.showId ).val ();
	}
//获取隐藏输入框的id
	searchtree.gethideId=function () {
		return $ ( "#"+this.hideId ).val ();
	}

//判断是否是父节点
	global.isFather=function (treenode) {
		if(!treenode.isParent){
			return false
		}
		if(!treenode.children||treenode.children.length<1){
			return false
		}
		return true
	}

//复选框选中和非选中事件
	global.onChecks = function ( e, treeId, treeNode, fn) {
		onNodeCreated(e, treeId, treeNode);
		var ztree = $.fn.zTree.getZTreeObj ( treeId );
		var nodes = ztree.getCheckedNodes ();

		var stree = searchtree.stree[treeId];
		var chkval="";
		var chkid="";
		if(nodes.length>0){
			chkval=$( "#"+stree.showId ).val ();
			chkid=$("#"+stree.hideId).val();

		}else{
			chkval="";
			chkid=""
		}
		if(!nodes.children){
			chkval="";
			chkid=""
		}
		for(var i=0;i<nodes.length;i++){
			ztree.expandNode(nodes[i],true,true);
			if(!nodes[i].isParent){
				chkval+=(nodes[i].name+",")
				chkid+=(nodes[i].id+",")
			}

		}


		//获取所有节点
		/*global.getAllChild=function (treenode) {
			if(isFather(treenode)){
				for(var i=0;i<treenode.children.length-1;i++){
					getAllChild(treenode.children[i])
				}
			}else{
				treechild.push(treenode)
			}
		}


		getAllChild(nodes);*/

		var showIdObj = document.getElementById(stree.showId);
		if("INPUT" === showIdObj.nodeName){
			$ ( showIdObj ).val ( chkval.substr(0,chkval.length-1) );
		} else if("P" === showIdObj.nodeName){
			$ ( showIdObj ).text ( chkval );
		} else {

		}

		$ ( "#"+stree.hideId ).val ( chkid.substr(0,chkid.length-1));
		fn.apply(this,arguments)
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
		$("#"+this.treeParentId).hide()
		$.fn.zTree.init ( $ ( "#"+ this.treeId ), this.treeSettings, nodes );
		me._ztree = $.fn.zTree.getZTreeObj ( me.treeId );
		$ ( "#"+this.showId ).bind("blur", {_this : this}, this.deleteId );
		//页面绑定事件
		$ ( "body" ).bind ( "mousedown", {_this : this}, this.onBodyDown );
		$ ( "#"+this.showId).siblings("span").children("button").on("click", function (event) {
			event.preventDefault();
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
					onClick : onClicks,
					onCheck : onChecks,
					onNodeCreated:onNodeCreated

				}
			}
		};
		var opt=jQuery.extend(true, {}, defaults, option);
		_this.treeSettings=opt.treeSettings;
		_this.hideId =opt.hideId;
		_this.showId =opt.showId;
		_this.treeId =opt.treeId;
		_this.treeParentId =opt.treeParentId;
		_this.init(nodes);
		searchtree.stree[_this.treeId] = _this;
	};
	Stree.prototype=searchtree;
	global["Stree"]=Stree;
})(window)

