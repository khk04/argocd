<script>
// import VueCharts from 'vue-chartjs'
import { Doughnut,mixins  } from 'vue-chartjs'
const { reactiveProp } = mixins

//https://ayoteralab.tistory.com/entry/Vuejs-16-use-doughnut-chart-with-label-plugin 차트 옵션
export default {
  extends: Doughnut, //차트 종류 ex)bar
  mixins: [ reactiveProp] ,
  props:{
    chartdata:{},
    title:''
  },  
  data () {
    return {
      options: {  
            title: {
              display: false,
              text: this.title
            },
            legend: {
              display: true,
              position: 'bottom',
            },
            responsive: true, 
            maintainAspectRatio: false, 
            rotation: -1.0 * Math.PI, //도넛 차트 방향 설정
            circumference: Math.PI, //Math.PI(원주율)
        },
    }
  },
  mounted () {
    
    // 가운데 퍼센트를 추가하기위함
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
      let ctx = chart.chart.ctx;

      ctx.restore();
      let fontSize = (height / 114).toFixed(2);
      ctx.font = fontSize + "em sans-serif" ;
      ctx.textBaseline = "middle";

      let text = 0+'%';
      let textX = Math.round((width - ctx.measureText(text).width) / 2);
      let textY = height / 1.3;

      ctx.fillText(text, textX, textY);
      ctx.save();
    }
  }

}
</script>
