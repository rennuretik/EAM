//返回值为undefined转换为空
function undefined2Empty(str){
    var returnVal = str;
    if(typeof(str)=="undefined"){
        returnVal = "";
    }
    return returnVal;
}