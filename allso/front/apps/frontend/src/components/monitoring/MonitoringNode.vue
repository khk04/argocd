<template>
  <v-card>
    <v-list 
        subheader
        two-line
        dense
    >
      <v-list-item >
          <v-list-item-content>
              <v-list-item-title v-text="node1.node"></v-list-item-title>
              <v-list-item-subtitle v-text="'STATE : '+node1.state"></v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-avatar :class="stateColor(node1.state)"/>
      </v-list-item>
      <v-divider/>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title v-text="node2.node"></v-list-item-title>
          <v-list-item-subtitle v-text="'STATE : '+node2.state"></v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-avatar :class="stateColor(node2.state)"/>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
  export default {
    props:{
        node1: Object,
        node2: Object,
    },  
    
    methods:{
        stateColor(state){
        let style = ""
        
            switch( state ) {
                case 'IDLE':
                    style ="grey lighten-2"
                break;
                case 'ALLOCATED':
                    style ="primary"
                break;
                case 'DOWN':
                    style ="red"
                break;
                case 'DOWN*':
                    style ="red"
                break;
                case 'None':
                    style ="white"
                break;
                default:
                    style ="yellow"
                break;
            }
            return style
        }
    }
}
</script>

<style>

</style>