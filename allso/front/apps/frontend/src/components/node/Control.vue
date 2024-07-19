<template>
    <article>
        <h2 class="py-2 text-h4 font-weight-bold" id="state" >
            Power Control
        </h2>
        <v-container class="grey lighten-5 py-10">
          <v-row
            no-gutters
          >
            <v-col
              v-for="(control , index) in controls"
              :key="index"
              cols="4" class="flex-grow-0 flex-shrink-0 px-13">
              <v-card
                class="mb-10"
              >
                <v-card-text>
                  <v-card-title class="text-h5">
                    {{control.node}}
                    <v-spacer></v-spacer>
                    <v-icon v-if="control.state === 'off'" color="grey">
                        mdi-toggle-switch-off-outline
                    </v-icon>
                    <v-icon v-else-if="control.state === 'on'" color="primary">
                        mdi-toggle-switch-outline
                    </v-icon>
                    <v-icon v-else-if="control.state === 'reset'" color="green">
                        mdi-cog-play-outline
                    </v-icon>
                    <v-icon v-else color="green">
                        mdi-application-cog-outline
                    </v-icon>
                  </v-card-title>

                    <v-divider/>
                            <v-radio-group
                                v-model="states[index]"
                                :disabled="isStorage(control.node)"
                                column
                            >
                                <v-radio
                                    color="primary"
                                    value="on"
                                >
                                    <template v-slot:label>
                                        <div>
                                            <strong>Power On </strong>
                                            <v-icon color="primary">
                                                mdi-toggle-switch-outline
                                            </v-icon>
                                        </div>
                                    </template>
                                </v-radio>

                                <v-radio
                                    color="grey"
                                    value="off"
                                >
                                    <template v-slot:label>
                                        <div>
                                            <strong class="mr-2">Power Off </strong>
                                            <v-icon color="grey">
                                                mdi-toggle-switch-off-outline
                                            </v-icon>
                                        </div>
                                    </template>
                                </v-radio>

                                <v-radio
                                    color="green"
                                    value="reset"
                                >
                                    <template v-slot:label>
                                        <div>                                       
                                            <strong class="mr-2">Hardware Reset </strong>
                                            <v-icon color="green">
                                                mdi-refresh
                                            </v-icon>
                                        </div>
                                    </template>
                                </v-radio>
                                <v-radio
                                    color="green"
                                    value="cycle"
                                >
                                    <template v-slot:label>
                                        <div>
                                            <strong class="mr-2">Software Reset (Cycle)</strong>
                                            <v-icon color="green">
                                                mdi-refresh
                                            </v-icon>
                                        </div>
                                    </template>
                                </v-radio>
                            </v-radio-group>
                            <v-btn tile dark :disabled="isStorage(control.node)" color="orange" block @click="update(node.node ,states[index])">Apply</v-btn>
                </v-card-text>
              </v-card>
            </v-col>
        </v-row>
        </v-container>
       
    </article>
</template>

<script>
import ipmi from '@/services/ipmi'

export default {

    props:{
        nodes:Object,
        controls:Array,
    },  

    data () {
      return {
        states: [ 'on', 'on', 'on', 'on', 'on', 'on', 'on', 'on', 'on', 'on',  ]
      }
    },

    methods:{
        async update(node , state){
            try {
                await ipmi.powerUpdate(node , state)
            
            } catch (e) {
                console.error(e)
            }
        },
        isStorage(name) {
          if(name.indexOf('storage') === -1) {
            return false
          }
          return true
        }
    }

}
</script>

<style>

</style>