seajs.config ( {
	// 指定需要使用的插件
	plugins : [ "text", "shim" ], alias : {
		"jquery" : {
			src : "gallery/jquery/1.7.2/jquery", exports : "jQuery"
		}, "juicer" : {
			src : "gallery/juicer/0.6.5-stable/juicer", exports : "juicer"
		}, "fapui-core" : {
			src : "core/fapui-core", exports : "FAPUI"
		}, "swfupload" : {
			src : "gallery/swfupload/2.0/swfupload", exports : "SWFUpload"
		}, "swfupload_queue" : {
			src : "gallery/swfupload/2.0/swfupload/swfupload.queue"
		}, "swfupload_speed" : {
			src : "gallery/swfupload/2.0/swfupload/swfupload.speed"
		}, "ztree" : {
			src : "gallery/ztree/3.5/ztree.js", exports : "ztree"
		}, "back" : {
			src : "src/common/util/back.js", exports : "back"
		},"short-url" : {
			src : "src/common/util/short-url.js", exports : "ShortURL"
		},"enum-utils" : {
			src : "src/common/util/enum-data.js", exports : "EnumUtils"
		}
	}
} );