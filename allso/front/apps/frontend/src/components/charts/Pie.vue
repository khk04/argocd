<script>
// import VueCharts from 'vue-chartjs'
import { Pie,mixins  } from 'vue-chartjs'
const { reactiveProp } = mixins
//https://www.chartjs.org/docs/latest/charts/line.html  옵션
//https://www.chartjs.org/samples/latest/

// let plugin = function(chart) {
//         let width = chart.chart.width;
//         let height = chart.chart.height;
//         let  ctx = chart.chart.ctx;

//         ctx.restore();
//         let fontSize = (height / 114).toFixed(2);
//         ctx.font = fontSize + "em sans-serif";
//         ctx.textBaseline = "middle";

//         let text = 30;
//         let textX = Math.round((width - ctx.measureText(text).width) / 2);
//         let textY = height / 1.75;

//          ctx.fillText(text, textX, textY);
//          ctx.save();
// }

export default {
  extends: Pie, //차트 종류 ex)bar
  mixins: [ reactiveProp] ,
  props:{
    chartdata: {
      type: Object,
      default: null
    },
    percent: {
      type:Number,
      default: 0
    }

  },  
  data () {
    return {
      options: {  
            title: {
                display: true,
                // text: '5분당 데이터'
            },
            legend: {
                    display: false
            },
            responsive: true,
            maintainAspectRatio: false,


        },
    }
  },
  mounted () {
    // this.addPlugin({
    //   id: 'my-plugin',
    //   beforeDraw: this.centerText
    // })
    this.renderChart(this.chartData, this.options )
  },

  methods: {
    //가운데 퍼센트 표시하기 위함 
    centerText(chart){
      let width = chart.chart.width;
      let height = chart.chart.height;
      let  ctx = chart.chart.ctx;

      ctx.restore();
      let fontSize = (height / 114).toFixed(2);
      ctx.font = fontSize + "em sans-serif" ;
      ctx.textBaseline = "middle";

      let text = this.percent+'%';
      let textX = Math.round((width - ctx.measureText(text).width) / 2);
      let textY = height / 1.75;

      ctx.fillText(text, textX, textY);
      ctx.save();
    }
  }

}
</script>
