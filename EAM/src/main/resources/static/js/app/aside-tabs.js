$(function () {
	$('#tab-content').on('click', '.pack-up', packUpSlideToggle);

	$(window).on('scroll', scrollFixed);

	$(document).on('click','.views-ul a', function () {
		var id = $(this).attr('href').slice(1);
		var offSetTop = $('div#'+id).offset().top;
		$('html,body').animate({scrollTop: offSetTop - '136'});
	})

	// 侧边栏收缩展开
	function packUpSlideToggle() {
		var scrollTop = $(window).scrollTop();
		var aside = $(this).parents('.views-aside');
		var content = $(this).parents('.client-views').find('.views-content');
		var toggle = $(this).attr('data-toggle');
		if( scrollTop >= 80 ){
			if(toggle === 'true'){
				aside.animate({'left':'-173px'});
				content.animate({'padding-left':'20px'});
				$(this).removeClass('glyphicon-menu-left').addClass('glyphicon-menu-right');
				$(this).attr({'data-toggle':'false'});
			}else {
				aside.animate({'left':'10px'});
				content.animate({'padding-left':'220px'});
				$(this).removeClass('glyphicon-menu-right').addClass('glyphicon-menu-left');
				$(this).attr({'data-toggle':'true'});
			}
		}else {
			if(toggle === 'true'){
				aside.animate({'left':'-183px'});
				content.animate({'padding-left':'20px'});
				$(this).removeClass('glyphicon-menu-left').addClass('glyphicon-menu-right');
				$(this).attr('data-toggle','false');
			}else {
				aside.animate({'left':'0'});
				content.animate({'padding-left':'220px'});
				$(this).removeClass('glyphicon-menu-right').addClass('glyphicon-menu-left');
				$(this).attr({'data-toggle':'true'});
			}
		}
	}
// 窗口滚动置顶
	function scrollFixed() {
		var scrollTop = $(window).scrollTop();
		if(scrollTop >= 80){
			$('.tabs-items').css({'position':'fixed', 'height':'50px', 'padding-top':'20px', 'top':'0','z-index':'9997'});
			$('.client-name').css({'position':'fixed','top':'50px','z-index':'9997', 'padding-top':'10px','right':'10px','left':'10px'});
			$('.client-tabs>ul').css({'position':'fixed','z-index':'9997', 'top':'90px','right':'10px','left':'10px'});
			$('.client-info').css({'padding-top':'73px'});

			$('.pack-up').each(function () {
				if($(this).attr('data-toggle') === 'true'){
					$(this).parents('.views-aside').css({'position':'fixed','top':'135px','left':'10px'})
				}else {
					$(this).parents('.views-aside').css({'position':'fixed','top':'135px','left':'-173px'});
				}
			});
		}else {
			$('.tabs-items').css({'position':'relative','height':'30px', 'padding-top':'0',  'top':'0','z-index':'1'});
			$('.client-name').css({'position':'relative','top':'0','z-index':'1', 'padding-top':'0','right':'0','left':'0'});
			$('.client-tabs>ul').css({'position':'relative','z-index':'1', 'top':'0','right':'0','left':'0'});
			$('.client-info').css({'padding-top':'0'});


			$('.pack-up').each(function () {
				if($(this).attr('data-toggle') === 'true'){
					$(this).parents('.views-aside').css({'position':'absolute','top':'0','left':'0'})
				}else {
					$(this).parents('.views-aside').css({'position':'absolute','top':'0','left':'-183px'})
				}
			});
		}
	};
})
