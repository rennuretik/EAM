function placeHolder(parent){
    var oSpan=parent.find('.prompt');
    var oInp=parent.find('.placeHolder_input');
    oInp.val("");
    oSpan.click(function(){
        $(this).hide();
        oInp.focus();
    });
    oInp.focusin(function(){
        oSpan.hide();
    });
    oInp.blur(function(){
        if (oInp.val().length == 0) {
            oSpan.show();
        };
    });
};