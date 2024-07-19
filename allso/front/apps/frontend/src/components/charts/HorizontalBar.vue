<script>
// import VueCharts from 'vue-chartjs'
import { HorizontalBar,mixins  } from 'vue-chartjs'
const { reactiveProp } = mixins
//https://www.chartjs.org/docs/latest/charts/line.html  옵션
//https://www.chartjs.org/samples/latest/
export default {
  extends: HorizontalBar, //차트 종류 ex)bar
  mixins: [ reactiveProp] ,
  
  props:{
    chartdata: {
      type: Object,
      default: null
    },
  },  
  data () {
    return {
      options: {
          title: {
            display: true,
            // text: '5분당 데이터'
          },
          scales: {
            yAxes: [{
              ticks: {
                // max: 5,
                // min: 3,
                // maxTicksLimit: 3,
                precision: 1,
                beginAtZero: false,
                scaleShowLabels:false,
              },
              gridLines: {
                display: false
              },
              stacked: true,
            }],
            xAxes: [ {
              gridLines: {
                display: false
              },
              ticks: {
                display: false,
                // maxTicksLimit: 5,
                scaleShowLabels:false,
              },
              stacked: true,
            }]
          },
          legend: {
            display: false, /* false = 범례를 숨긴다.  */
            position: 'bottom',
            // labels: {
            //     fontSize: 12,
            //     // fontFamily: 'sans-serif',
            //     fontColor: '#000000',
            //     fontStyle: 'bold'
            // }
          },
          responsive: true,
          maintainAspectRatio: false
      }
    }
  },
  mounted () {
    // this.addPlugin({
    //   id: 'my-plugin',
    //   beforeDraw: this.yAxisText
    // })
    this.renderChart(this.chartData, this.options )
  },

  methods: {
//https://stackoverflow.com/questions/62442553/align-data-label-right-horizontal-bar-chart-vue-js
      yAxisText(chart){
        var ctx = chart.chart.ctx;
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.font = "14px em sans-serif ";
        ctx.weight = "bold"
        ctx.anchor = 'center'

        var xAxis = chart.scales['x-axis-0'];
        var yAxis = chart.scales["y-axis-0"];
        yAxis.ticks.forEach((v, i) => {
          var value = chart.data.datasets[0].data[i];
          var x = xAxis.getPixelForValue(value) + 22; //22
          var y = yAxis.getPixelForTick(i)-5;         
          ctx.fillText('' + value +'', x, y);
          
        });
      ctx.restore();
      ctx.save();
    }
  }
}
</script>
