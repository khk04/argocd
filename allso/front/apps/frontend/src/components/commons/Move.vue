<template>
    <v-fab-transition>
        <v-btn 
            v-show="!hidden"
            bottom 
            right 
            fab 
            fixed 
            dark 
            color="orange darken-1"
            @click="toTop" 
            small
        >
            <v-icon dark>mdi-chevron-up</v-icon>
        </v-btn>
    </v-fab-transition>
</template>


<script>
export default {
    data () {
        return {
            hidden:true 
        }
    },

    mounted(){
        this.scroll();  //window 위치를 체크
    },

    
    methods: {

        toTop(){ //최상단으로 이동
            document.body.scrollTop = 0
            document.documentElement.scrollTop = 0
        },

        scroll() {  
            window.onscroll = () => {
                window.pageYOffset >= 25 ? this.hidden = false : this.hidden = true  //스크롤 위치가 25 일경우 보이게 함
            }
        }
    },
}
</script>

