document.onkeydown = check;
function check(e) {
	var code;
	if (!e) var e = window.event;
	if (e.keyCode) code = e.keyCode;
	else if (e.which) code = e.which;
//		   	alert(event.keyCode);
	if (((event.keyCode == 8) &&                                                    //BackSpace
			((event.srcElement.type != "text" &&
			event.srcElement.type != "textarea" &&
			event.srcElement.type != "password") ||
			event.srcElement.readOnly == true)) ||
			((event.ctrlKey) && ((event.keyCode == 78) || (event.keyCode == 82)) )) {                                                   //F5
		event.keyCode = 0;
		event.returnValue = false;
	}
	return true;
};