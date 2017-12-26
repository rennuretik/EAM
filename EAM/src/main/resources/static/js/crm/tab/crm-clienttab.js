/**
 * Created by Administrator on 2016/9/18.
 */
var crmClientTab={};
//获取tab的html模板
crmClientTab.getTabTpl=function(o){
    var tabTpl=["<li id='"+ o.id+"'>",
        "<a style='padding-left: 10px;padding-right: 10px;cursor: pointer;'><span class='glyphicon glyphicon-remove crm-tabs-removeBtn'></span>&nbsp;&nbsp;"+ o.name,
        "</a>",
        "</li>"].join("");
    return tabTpl
};
//增加tab的方法
crmClientTab.addTab=function(o){
    var me=this;
    var arg={name: o.name,id: o.id};
    var html=this.getTabTpl(arg);
    var lis=this.tabs.find("li");
    //控制tab个数不能超过五个;
    if(lis.length<11){
        me.tabs.append(html);
    }else{
        lis.eq(2).remove()&&me.tabs.append(html);
    }
    me.clicked(o.id);
    //选中的tab的单击事件
    me.tabs.find("li").click(function(){
        me.clicked(this.id);
    });
    me.tabs.find("li>a>span").click(function(){
        me.closeTab(jQuery(this).parent().parent().attr("id"));
    })
    this.reRender()
}
//关闭tab
crmClientTab.closeTab=function(id){
    var me=this;
    var tab=this.tabs.find("#"+id);
    if(tab.next().is("li")){
        tab.next().click();
    }else if(tab.prev().is("li")){
        tab.prev().click()
    }
    tab.remove();
    
    jQuery("#"+this.getFrameId(id)).remove();
    this.reRender()


}
//获得frame的id
crmClientTab.getFrameId=function(id){
    return "frame"+id;
}
//判断tab是否存
crmClientTab.isExist=function(id){
    return this.tabs.find("#"+id).size()>0;
}

//
crmClientTab.reRender = function () {
    var aEle = $(this.tabs).find('a')
    var num = aEle.length;
    aEle.each(function () {
        $(this).css({'width': (100 / num) + '%'})
    })
}

//tab是否存在和增加tab方法结合
crmClientTab.add=function(option){
    if(this.isExist(option.id)){
        this.clicked(option.id);
        return false
    }else{
        this.addTab(option);
        this.addFrame(option)
    }
}
//点击tab
crmClientTab.clicked=function(id){
    this.tabs.find("li").removeClass(this.activeClass);
    jQuery("#"+id).addClass(this.activeClass);
    this.loadFrame(id);
}
//增加frame
crmClientTab.addFrame=function(option){
    var url=option.url;
    var id=this.getFrameId(option.id);
    var frameTpl=["<iframe height='100%' width='100%' frameborder='0' id='"+id+"' src='"+url+"'>",
        "</iframe>"].join("");
    this.frame.append(frameTpl);
    this.loadFrame(option.id);
}
//加载frame
crmClientTab.loadFrame=function(id){

    var id=this.getFrameId(id);
    this.frame.find("iframe").hide();
    jQuery("#"+id).show();
}

//构造函数
var ClientTab=function(option){
    //构造函数传入的默认参数
    var defaults={
        tabId:"client-tab",
        frameId:"client-frame",
        activeClass:"client-active"
    };
    var me=this;
    var o=jQuery.extend(defaults,option)
    this.tabs=jQuery("#"+ o.tabId);
    this.frame=jQuery("#"+ o.frameId);
    this.activeClass= o.activeClass;
    this.tabs.find("li").click(function(){
        me.clicked(this.id);
    });
}
jQuery.extend(ClientTab.prototype,crmClientTab)