function date(){
    $( ".jquery_date" ).datepicker({
        dateFormat: "yy-mm-dd",
        monthNames: [ "一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "12月" ],
        monthNamesShort: [ "一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "12月" ],//选择月份时显示
        dayNamesMin : [ "S", "M", "T", "W", "T", "F", "S" ],
        changeMonth:true,
        changeYear:true,
        showMonthAfterYear:true,
    });
};


function calender(){
    today = new Date();
    var y = today.getFullYear();
    var m = today.getMonth()+1;
    var tYear = y;
    var tMonth = m;
    //日历修改
    var spandex;

    function DayNumOfMonth(Year,Month){
        var dMax = new Date(Year,Month,0);
        return dMax.getDate();
    }

    function getMonthWeek (Year,Month){
        var lastD = DayNumOfMonth(Year,Month);
        var date = new Date(Year,parseInt(Month)-1,lastD), w = date.getDay();
        return Math.ceil(   (lastD + 6 - w) / 7 );
    }

    function getDateDay(Year,Month){
        var dMin = new Date(Year,Month-1,1);
        return dMin.getDay();
    }


    var tabtr = $(".table_calender").children("tbody").find("tr");

    $(function(){
        caChange(tYear,tMonth);
        if(spandex == 1){

        }
    });

    $('.prev').click(function(e){
        e.preventDefault();
        tMonth = tMonth - 1;
        if(tMonth < 1){ tMonth = 12;tYear = tYear-1}
        caChange(tYear,tMonth)
    });

    $('.next').click(function(e){
        e.preventDefault();
        tMonth = tMonth + 1;
        if(tMonth > 12){ tMonth = 1;tYear = tYear+1}
        caChange(tYear,tMonth)
    });

    function caChange(Year,Month){
        var maxDate = DayNumOfMonth(Year,Month);
        var maxWeek = getMonthWeek(Year,Month);
        var startDate = getDateDay(Year,Month);

        var state = tabtr.filter(':lt('+maxWeek+')');
        console.log(state)
        var unit = state.find('td');//
        var sum = maxDate+startDate;

        var prevYear = Year;
        var prevMonth = Month-1;

        if(prevMonth < 1){ prevYear = Year-1}

        var prevMaxDate = DayNumOfMonth(prevYear,prevMonth)
        if(tMonth < 10){
            $('.date-title').text(tYear+'年 '+'0'+tMonth+'月')
        }else{
            $('.date-title').text(tYear+'年 '+tMonth+'月')
        }

        unit.children(".date").text('');
        tabtr.hide();
        state.show();

        for(var i = 1;i<=maxDate;i++){
            var num = i-1+startDate;
            unit.eq(num).children(".date").text(i)
        }

    }

}