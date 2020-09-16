<template>
    <div style="position: relative;height: 100%;">
        <div ref="chartRef" style="height: 100%;margin: 0 auto;"></div>
        <div class="noData" style="color: #c23531" v-if="!chartOption || !chartOption.response || chartOption.response.length === 0">{{$t('message.common.noData')}}</div>
    </div>
</template>

<script>
/* 国际化 */
import i18n from '@/i18n/i18n'
let echarts = require("echarts/lib/echarts");
require("echarts/lib/chart/scatter");
require("echarts/lib/chart/pie");
require("echarts/lib/component/title");
require("echarts/lib/component/tooltip");
require("echarts/lib/component/calendar");
require("echarts/lib/component/grid");
require("echarts/lib/component/legend");
require("echarts/lib/component/dataZoom");
require("echarts/lib/component/toolbox");
import { format, numberFormat } from "@/util/util.js";
import router from "@/router";

export default {
    name: "calendarPieChart",
    components: {},
    props: {
        chartOption: {
            type: Object
        },
        reload: {
            type: Number
        },
        selectTime:{
            type: String
		},
		selectParam: {
            type: Object
        },
    },
    watch: {
        chartOption: function() {   // 之前是watch reload,用的时候又没有传入reload..
            this.getChartData();
        },
        selectTime: function() {
            this.getChartData();
        },
    },
    data() {
        return {
            chartId: "pieChart",
            chart: "",
            cellSize:[120, 120],
            pieRadius:40,
            isLanguageEN: localStorage.getItem("internationalization") == 'en' ?true:false,
        };
    },
    beforeDestroy: function() {
        window.onresize = null;
    },
    mounted() {
        this.$nextTick(() => {
            this.getChartData();
        });
    },
    methods: {
        getChartData() {
            let _this = this;
            _this.chart = echarts.init(_this.$refs.chartRef);
            // _this.chart = echarts.init(document.getElementById(_this.chartId));

            let legendData = _this.getLegendData();
            let scatterData = _this.getVirtulData();

            console.log("legendData....", legendData);

            let option = {
                tooltip : {},
                legend: {
                    data: legendData,
                    bottom: 20
                },
                calendar: {
                    top: 'middle',
                    left: 'center',
                    orient: 'vertical',
                    cellSize: _this.cellSize,
                    yearLabel: {
                        show: false,
                        textStyle: {
                            fontSize: 30
                        }
                    },
                    dayLabel: {
                        margin: 20,
                        firstDay: 1,
                        nameMap: _this.isLanguageEN?"en":"cn",
                        //nameMap: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
                    },
                    monthLabel: {
                        show: true,
                        margin: 10,
                        nameMap: _this.isLanguageEN?"en":"cn",
                    },
                    yearLabel: {
                        show: true,
                        margin: 50
                    },
                    range: [_this.selectTime]
                },
                series: [{
                    id: 'label',
                    type: 'scatter',
                    coordinateSystem: 'calendar',
                    symbolSize: 1,
                    label: {
                        normal: {
                            show: true,
                            formatter: function (params) {
                                return echarts.format.formatTime('dd', params.value[0]);
                            },
                            offset: [-_this.cellSize[0] / 2 + 10, -_this.cellSize[1] / 2 + 10],
                            textStyle: {
                                color: '#000',
                                fontSize: 14
                            }
                        }
                    },
                    data: scatterData
                }]
            };
            
            _this.chart.setOption(option, true);
            setTimeout(function () {
                _this.chart.setOption({
                    series: _this.getPieSeries(scatterData, _this.chart)
                });
            }, 200);
            window.onresize = () => {
                echarts.init(_this.$refs.chartRef).resize();
                _this.chart.setOption({
                    series: _this.getPieSeries(scatterData, _this.chart)
                });
			};
			// 处理点击事件并且跳转到相应的页面
			_this.chart.on('click', function (params) {
				console.log("selectTime....",_this.selectTime);
				console.log("selectParam....",_this.selectParam);
				console.log("params....",params);
				let reqParams = _this.getBusSearchReqParams(params);
				if (params.data.value>0) {
					router.push({
                            path: '/businessSearch',
                            query:{params:reqParams},
                        });
				}
				
			});
		},
		//获取业务查询条件参数
		getBusSearchReqParams(params){
			let reqParam = {};
			//获取进出口类型 1：进口 2：出口
			reqParam.activeIndex = 1; 
			//获取查询时间
				let selectDateStr = this.selectTime +"-"+params.seriesIndex.toString().padStart(2, '0');
					// 转换日期格式
				let newSelectDateStr = selectDateStr.replace(/-/g, '/'); // "2010/08/01";
					// 创建日期对象
				let selectDate = new Date(newSelectDateStr);
					//获取后一天时间
				selectDate.setTime(selectDate.getTime()+1*24*60*60*1000);
				let year = selectDate.getFullYear();
				let month = selectDate.getMonth()+1;
				let day = selectDate.getDate();
				month = month.toString().padStart(2, '0')
				day = day.toString().padStart(2, '0')
				let endDateStr = year+"-"+month+"-"+day;
			//查询时间
			reqParam.dateModel = [selectDateStr,endDateStr];
			//获取查询订单状态
			if (params.name == "操作中" || params.name == "In Operation") {
				reqParam.orderStatus = 30;//未完成
			}else{
				reqParam.orderStatus = 20;//已完成
			}
			if (!this.isNullData(this.selectParam.filtrateKey)) {
				reqParam.filtrateKey = this.selectParam.filtrateKey;
				reqParam.filtrateValue = this.selectParam.filtrateValue;
			}
			
			console.log("reqParam....",reqParam);

			return reqParam;
			
		},

        //获取底部legend数据显示
        getLegendData() {
            let _this = this;
            let legendObj = _this.chartOption.legend;

            let legend = [];
            for (let key in legendObj) {
                legend.push(legendObj[key]);
            }

            return legend;
        },
 
        /**
         * 根据yyyy-mm或yyyy-mm-dd格式时间字符串获取前后当前月的时间yyyy-mm-01
         * @param getMonthType 获取月份类型 -1：“前一月时间”，0：“当前月时间”，1：“后一月时间”
         */
        getNextMonthStr(dateStr, getMonthType){
            if(this.isNullData(dateStr)){
                return "";
            }

            let startArr = dateStr.split('-');
            let startDate = "";
            if(startArr.length == 2){ // yyyy-mm
                startDate = dateStr+"-01";
            }else if(startArr.length == 3){ //yyyy-mm-dd
                startDate = startArr[0]+"-"+startArr[1]+"-01";
            }

            if(getMonthType == 0){
                return startDate;
            } else if(getMonthType == -1){
                let choiceDateStr = startDate.replace(/-/g, '/');  //转化为时间格式
                let choiceDateTime = new Date(choiceDateStr).getTime(); //转化为时间戳

                //选中时间的一个月前
                const minTime = new Date(choiceDateTime).setMonth(new Date(choiceDateTime).getMonth() - 1);

                return format(minTime,"yyyy-MM-dd");
            } else if(getMonthType == 1){
                let choiceDateStr = startDate.replace(/-/g, '/');  //转化为时间格式
                let choiceDateTime = new Date(choiceDateStr).getTime();//转化为时间戳

                //选中时间的一个月后
                const maxTime = new Date(choiceDateTime).setMonth(new Date(choiceDateTime).getMonth() + 1);

                return format(maxTime,"yyyy-MM-dd");
            } else {
                return startDate;
            }
        },
        //获取日历每个月显示的时间数据
        getVirtulData() {
            let _this = this;
            let startDate = _this.getNextMonthStr(_this.selectTime,0);
            let endDate = _this.getNextMonthStr(_this.selectTime,1);
            console.log("startDate.....",startDate);
            console.log("endDate.....",endDate);
            var date = +echarts.number.parseDate(startDate);
            var end = +echarts.number.parseDate(endDate);
            var dayTime = 3600 * 24 * 1000;
            var data = [];
            for (var time = date; time < end; time += dayTime) {
                data.push([
                    echarts.format.formatTime('yyyy-MM-dd', time),
                    Math.floor(Math.random() * 10000)
                ]);
            }
            return data;
        },
        //获取每个饼状图显示数据
        getPieData(index){
            let _this = this;
            let legendObj = _this.chartOption.legend;
            let resValueArr = _this.chartOption.response;

            if(index < resValueArr.length){
                let resValue = resValueArr[index];
                let dayValue = resValue.t;

                let isShow0 = true;

                //处理选中时间
                let startArr = _this.selectTime.split('-');
                let startDate = "";
                if(startArr.length == 2){ // yyyy-mm
                    startDate = _this.selectTime+"-01";
                }else if(startArr.length == 3){ //yyyy-mm-dd
                    startDate = _this.selectTime;
                }
                let selectDateStr = startDate.replace(/-/g, '/');  //转化为时间格式
                let selectDate = new Date(selectDateStr); //转化为日期
                let selectYear = selectDate.getFullYear(); //获取当前年(1-31)
                let selectMonth = selectDate.getMonth(); //获取当前月(1-31)
                let selectDay = selectDate.getDate(); //获取当前日(1-31)

                let currentDate = new Date();
                let currentYear = currentDate.getFullYear(); //获取当前年(1-31)
                let currentMonth = currentDate.getMonth(); //获取当前月(1-31)
                let currentDay = currentDate.getDate(); //获取当前日(1-31)

                if(selectYear > currentYear){
                    isShow0 = false;
                }else if(selectYear == currentYear){
                    if(selectMonth > currentMonth){
                        isShow0 = false;
                    }else if (selectMonth == currentMonth){
                        if(currentDay <= dayValue){
                            isShow0 = false;
                        }
                    }
                }

                let pieData = [];
                for (let key in legendObj) {
                    pieData.push({name:legendObj[key], value: _this.isNullData(resValue[key])?(isShow0==true?'0':''):resValue[key] });
                }
                return pieData;
            }else{
                return [];
            }
        },
        //获取所有饼状图的显示数据
        getPieSeries(scatterData, chart) {
            let _this = this;
            return echarts.util.map(scatterData, function (item, index) {
                var center = chart.convertToPixel('calendar', item);
                // console.log("index.....",index);
                return {
                    id: index + 'pie',
                    type: 'pie',
                    center: center,
                    color: ['#ff6666', '#f9a94f', '#5786b0'],
                    label: {
                        normal: {
                            formatter: '{c}',
                            position: 'inside'
                        }
                    },
                    radius: _this.pieRadius,
                    data: _this.getPieData(index),
                };
            });
        },

        getPieSeriesUpdate(scatterData, chart) {
            return echarts.util.map(scatterData, function (item, index) {
                var center = chart.convertToPixel('calendar', item);
                return {
                    id: index + 'pie',
                    center: center
                };
            });
        }
    }
};
</script>

<style scoped>
.noData {
    position: absolute;
    display: inline-block;
    top: 50%;
    left: 46%;
}
</style>
