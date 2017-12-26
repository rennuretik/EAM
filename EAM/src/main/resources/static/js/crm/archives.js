$('.y_checkbox').click(function(){
    $(this).hasClass('y_checkbox_active')?$(this).removeClass('y_checkbox_active'):$(this).addClass('y_checkbox_active');
});

            /*档案上传列表选择*取消*/
$('.xz_tab1').click(function(){
    $(this).hasClass('xz_tab1_active')?$(this).removeClass('xz_tab1_active'):$(this).addClass('xz_tab1_active');
})

$('.tab_xz').click(function(){
    $(this).hasClass('tab_xz_active')?$(this).removeClass('tab_xz_active'):$(this).addClass('tab_xz_active');
})

        /*弹出框关闭*/
$(".guanbi").click(function(){
    $(".win_warp").hide();
})

            /*弹出框内列表下拉*/
$(function () {
    $(".hover_ListCon ul li").click(function(){

        var thisSpan=$(this);
        $(".hover_ListCon ul li ul").prev("a").removeClass("cur1");
        $("ul", this).prev("a").addClass("cur1");
        $(this).children("ul").slideDown(50);
        $(this).siblings().children("ul").slideUp(50);
    })
});


$(function(){
    $('.list_3 .dis_blk').click(function(){
        var thisSpan=$(this);
        $(this).removeClass("cur3");
        $(this).addClass("cur3");
        $(this).children("ul").slideDown(50);
        $(this).siblings().children("ul").slideUp(50);
    })
})


            /* 客户标识选择*/
$('.kh_choose_type>a').click(function(){
    $(this).hasClass('Hp_choose_active')?$(this).removeClass('Hp_choose_active'):$(this).addClass('Hp_choose_active');
});

            /*家庭有无经营选择*/
$('.jY_chooseJT_xx>a').click(function(){
    $(this).hasClass('yx_chooseJT_active')?$(this).removeClass('yx_chooseJT_active'):$(this).addClass('yx_chooseJT_active');
});


$('.con04_yesORno').click(function(){
    $(this).hasClass('con04_active')?$(this).removeClass('con04_active'):$(this).addClass('con04_active');
});
            /*评分卡管理内部下拉*/
//$(function () {
//    $(".cus_dpdn1").click(function(){
//        $(this).hasClass('cus_dpdn1_active')?$(this).removeClass('cus_dpdn1_active'):$(this).addClass('cus_dpdn1_active');
//    })
//});
            /*process-ztree-3.3.5   choose*/
$('.cp_dmChoose').click(function(){
    $(this).hasClass('cp_dmChoose_at')?$(this).removeClass('cp_dmChoose_at'):$(this).addClass('cp_dmChoose_at');
})

$('.cp_dmChoose2').click(function(){
    $(this).hasClass('cp_dmChoose2_at')?$(this).removeClass('cp_dmChoose2_at'):$(this).addClass('cp_dmChoose2_at');
})

$('.cp_dmChoose-b').click(function(){
    $(this).hasClass('cp_dmChoose_at')?$(this).removeClass('cp_dmChoose_at'):$(this).addClass('cp_dmChoose_at');
})

$('.fanwei_mn1>a').click(function(){
    $(this).hasClass('check_active')?$(this).removeClass('check_active'):$(this).addClass('check_active');
})

$(function () {
    $(".fanwei_mn2 ul li").click(function(){

        var thisSpan=$(this);
        $(".fanwei_mn2 ul").prev("li").removeClass("cp_XL_list_at").addClass("cp_XL_list1");
        $("ul", this).prev("li").addClass("cp_XL_list1");
        $(this).children("ul").slideDown(100);
        $(this).siblings().children("ul").slideUp(100);
    })
});



        /*行政区划列表下拉*/
$(function () {
    $(".date_cityList ul .city_list1Con").click(function(){

        var thisSpan=$(this);
        $(".date_cityList ul .city_list1Con ul").prev(".city1_bgimg").removeClass("city1_bgimg_active");
        $("ul", this).prev(".city1_bgimg").addClass("city1_bgimg_active");
        $(this).children("ul").slideDown(50);
        $(this).siblings().children("ul").slideUp(50);
    })
});

$(function () {
    $(".city1_bgimg3").click(function(){

        var thisSpan=$(this);
        $(this).toggleClass("city_list1Con2_b");
        //$(this).addClass("city_list1Con2_b");
        $(this).siblings("ul").slideToggle(50);
        $(this).parents("city_list1Con2").siblings().children("ul").slideUp(50);
    })
});


            /*nav点击*/
$(".menu").click(function(){
    if($(".l_nav_wrap").is(":hidden")){
        $(".l_nav_wrap").show().addClass(".menu_icon");
    }else{
        $(".l_nav_wrap").hide().removeClass(".menu_icon");
    };
});

$(".l_nav_Con").find(".list_tit").children("li").click(function(){
    $(this).addClass("click_active").siblings("li").removeClass("click_active");
    $(".l_nav_Con").find(".l_nav_right").children(".right-list1").eq($(this).index()).show().siblings().hide();
});