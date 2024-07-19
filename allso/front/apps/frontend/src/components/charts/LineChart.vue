<script>
import { Line, mixins  } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  extends: Line, //차트 종류 ex)bar
  mixins: [reactiveProp] ,
  
  props:{
    chartdata:Object,
    legend:Boolean,
    title:String,
  },  

  data () {
    return {
      options: {
          title: {
            display: false,
            text: this.title
          },
          scales: {
            yAxes: [{
              ticks: {
                maxTicksLimit: 10,
                beginAtZero: true,
              },
              scaleLabel: {
                  display: true,
                  labelString: 'Load / Process (sec)'
              },
              gridLines: {
                display: true
              }
            }],
            xAxes: [ {
              ticks: {
                // maxTicksLimit: 9,
                beginAtZero: true
              },
              scaleLabel: {
                  display: true,
                  labelString: 'Time'
              },
              gridLines: {
                display: false
              },

            }]
          },
          legend: {
            display: true, /* false = 범례를 숨긴다.  */
            position: 'right',
            labels: {
                fontSize: 12,
                // fontFamily: 'sans-serif',
                fontColor: '#DDDDDD',
                fontStyle: 'bold'
            }
          },
          responsive: true,
          maintainAspectRatio: false,
      }
    }
  },
  mounted () { 
    this.renderChart(this.chartData, this.options)
  },
}
</script>
