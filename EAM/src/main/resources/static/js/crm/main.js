$(function () {
	$("#bulletin_datepicker").load(contextPath+"/index/bulletin-datepicker");
	$("#follow-custom").load(contextPath+"/index/follow-custom");
	$("#org-grade").load(contextPath+"/index/org-grade");
	$("#deposit-loan-balance-report").load(contextPath+"/index/deposit-loan-balance-report");
	$("#labour-emulation-report").load(contextPath+"/index/labour-emulation-report");
	$("#big-custom-follow").load(contextPath+"/index/big-custom-follow");

	var isFirstLogin = $("#isFirstLogin").val();
	if(isFirstLogin==="true") {
		$("#cancelRePwdBtn").hide();
		$("#cancelRePwd").hide();
		$("#revpass").modal({
			keyboard:false,
			show:true,
			backdrop:false
		})
	}

})