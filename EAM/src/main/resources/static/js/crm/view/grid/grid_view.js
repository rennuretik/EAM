$(function () {

    var path = $("#path").val();

    lineChart();
    pieChart();
    columnChart();

    var analysisData = getAnalysisData(  );

    /**
     * 加载金融分析数据
     * @param date 当前选择的日期
     */
    function getAnalysisData(date) {
        var params = {
            divisionCode : $("#area").val(),
            lastEtlAcgDt : date
        };
        $.post(path + "/view/grid/region/analysis/data", params, function (result) {
            return result?result:"";
        });
    }

    /*日期插件使用*/
    $("#crm-datepicker").datepicker({
        language: "zh-CN",
        todayHight: true,
        format: "yyyy/mm/dd"
    })
    //标签页切换
    $('#selTab a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    })
    //滚动条使用
    $('.notabs-window').niceScroll();
//        echarts折线图使用
    function lineChart() {
        var myChart = echarts.init(document.getElementById('assetAnly'));
        var option1 = {
            title: {
                text: '各类存款余额增减分析（单位：万元）'
            },
            calculable: true,
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: ['年初数', '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: '去年存款',
                    type: 'line',
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                textStyle: {
                                    color: '#800080'
                                }
                            }
                        }
                    },
                    data: [400, 600, 900, 800, 700, 450, 600, 432, 789, 321, 543, 876, 1000],
                    /*markPoint : {
                     data : [
                     {type : 'max', name: '最大值'},
                     {type : 'min', name: '最小值'}
                     ]
                     },*/
                    markLine: {
                        data: [
                            {type: 'average', name: '平均值'}
                        ]
                    }
                }
            ]
        };
        myChart.setOption(option1);
        myChart.showLoading({
            text: '正在努力加载中...'
        })
        setTimeout(function () {
            myChart.hideLoading();
        }, 6000)

    }


    //echarts饼图使用
    function pieChart() {
        //人口性别占比分析
        var sexAnly = echarts.init(document.getElementById('sex-anly'));

        sex = {
            title: {
                text: '人口性别占比分析',
                x: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x: 'left',
                data: ['女性', '男性']
            },
            calculable: true,
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data: [
                        {value: 335, name: '女性'},
                        {value: 888, name: '男性'}
                    ]
                }
            ]
        };
        sexAnly.setOption(sex);

        //各年龄段人口数占比分析
        var ageAnly = echarts.init(document.getElementById('age-anly'));

        age = {
            title: {
                text: '各年龄段人口数占比分析',
                x: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x: 'left',
                data: ['65岁以上', '51-65岁', '26-50岁', '16-25岁', '0-15岁']
            },
            calculable: true,
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data: [
                        {value: 61, name: '65岁以上'},
                        {value: 188, name: '51-65岁'},
                        {value: 194, name: '26-50岁'},
                        {value: 180, name: '16-25岁'},
                        {value: 123, name: '0-15岁'}
                    ]
                }
            ]
        };
        ageAnly.setOption(age);


    }

    //echarts柱状图使用
    function columnChart() {
        var myChart = echarts.init(document.getElementById('otherAnly'));
        option = {
            title: {
                text: '星级客户增减情况分析（单位：人）',
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['年初数', '当前数'],
                x: '80%'
            },
            calculable: true,
            xAxis: [
                {
                    type: 'category',
                    data: ['一星', '二星', '三星', '四星', '五星']
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: '年初数',
                    type: 'bar',
                    data: [25.6, 76.7, 90, 100.2, 32.6],
                    /*markPoint : {
                     data : [
                     {type : 'max', name: '最大值'},
                     {type : 'min', name: '最小值'}
                     ]
                     },*/
                    markLine: {
                        data: [
                            {type: 'average', name: '平均值'}
                        ]
                    },
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                textStyle: {
                                    color: '#800080'
                                }
                            }
                        }
                    }
                },
                {
                    name: '当前数',
                    type: 'bar',
                    data: [70.7, 175.6, 182.2, 48.7, 18.8],
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                textStyle: {
                                    color: 'black'
                                }
                            }
                        }
                    },
//                markPoint : {
//                    data : [
//                        {name : '年最高', value : 182.2, xAxis: 7, yAxis: 183, symbolSize:18},
//                        {name : '年最低', value : 2.3, xAxis: 11, yAxis: 3}
//                    ]
//                },
                    markLine: {
                        data: [
                            {type: 'average', name: '平均值'}
                        ]
                    }
                }
            ]
        };
        myChart.setOption(option);
    }

})
