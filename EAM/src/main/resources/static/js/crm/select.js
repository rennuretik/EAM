$(function(){

    dSelect($('.dSelect1'));
    dSelect($('.dSelect2'));

    function dSelect(se){
        var ulList=se.find('.d_SelectList') || se.find('.d_SelectList2');
        var inSelect=se.find('.d_inSelect');
        var pDown=se.find('.d_posDown');
        var cHide=se.find('.d_hideCha');

        mClick(inSelect);
        mClick(pDown);
        mClick(cHide);

        function mClick(obj){
            obj.click(function(){
                var ulList=$(this).siblings('.d_SelectList') || $(this).siblings('.d_SelectList2');
                if (ulList.css("display") == "none") {
                    ulList.slideDown("fast");
                } else {
                    ulList.slideUp("fast");
                }
                return false;
            });
        };
        ulList.children('li').mouseenter(function(){
            $(this).addClass('active').siblings().removeClass('active');
        });
        ulList.find('.d_click').click(function(){
            inSelect.focus();
            var txt=$(this).text();
            $(this).parents(".d_select").find(".d_inSelect").val(txt);
            ulList.slideUp("fast");
            return false;
        });
        $(document).click(function(){
            ulList.slideUp("fast");
        });
    };


    /*query-1*/
    $('.xin01').click(function(){
        $(this).hasClass('xin01_active')?$(this).removeClass('xin01_active'):$(this).addClass('xin01_active');
    });

    $('.choose-h1').click(function(){
        $(this).hasClass('a_cho0se_active')?$(this).removeClass('a_cho0se_active'):$(this).addClass('a_cho0se_active');
    });

    $('.choseK').click(function(){
        $(this).hasClass('choseK_active')?$(this).removeClass('choseK_active'):$(this).addClass('choseK_active');
    });


    /*弹出页面关闭*/
    $(".guanbi").click(function(){
        $(".win_warp").hide();
    })


    /*CRM导航*/

    var li = $('.user-nav li');
    li.click(function(){
        $(this).addClass('nav-list01').siblings().removeClass('nav-list01');
    });

    /*sys-nav*/
    var li = $('.user-nav2 li');
    li.click(function(){
        $(this).addClass('nav-list02').siblings().removeClass('nav-list02');
    });

    /*sys-nav*/
    var li = $('.user-nav3 li');
    li.click(function(){
        $(this).addClass('nav-list03').siblings().removeClass('nav-list03');
    });

    var li = $('.user-nav3 .list-width');
    li.click(function(){
        $(this).addClass('list-width').siblings().removeClass('nav-list03');
    });

    var li = $('.user-nav4 li');
    li.click(function(){
        $(this).addClass('nav-list03').siblings().removeClass('nav-list03');
    });



    /*登录页*/
    $('.logChose').click(function(){
        $(this).hasClass('pas_active')?$(this).removeClass('pas_active'):$(this).addClass('pas_active');
    });

    /*system左侧列表*/
    $(".sys-left ul li").click(function(){
        var thisSpan=$(this);
        $(".sys-left ul li ul").prev("a").removeClass("list-rIcon_active");
        $("ul",this).prev("a").addClass("list-rIcon_active");
        $(this).children("ul").slideDown(500);
        $(this).siblings().children("ul").slideUp(500);
    })

    /*sys-right  多选*/
    $('.chos-sys').click(function(){
        $(this).hasClass('mul-chooseAT')?$(this).removeClass('mul-chooseAT'):$(this).addClass('mul-chooseAT');
    });

    $('.tL-td01-choose').click(function(){
        $(this).hasClass('tL-td01-choose-AT')?$(this).removeClass('tL-td01-choose-AT'):$(this).addClass('tL-td01-choose-AT');
    });

    $('.adm-Hchoose').click(function(){
        $(this).hasClass('adm-Hchoose-at')?$(this).removeClass('adm-Hchoose-at'):$(this).addClass('adm-Hchoose-at');
    });

    $('.zy-chose').click(function(){
        $(this).hasClass('zy-xzAT')?$(this).removeClass('zy-xzAT'):$(this).addClass('zy-xzAT');
    });

    $('.jg-chs').click(function(){
        $(this).hasClass('insti-AT')?$(this).removeClass('insti-AT'):$(this).addClass('insti-AT');
    });


})