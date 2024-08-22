<template>
    <article>
        <h2 class="py-2 text-h4 font-weight-bold" id="state" >
            Power Control
        </h2>

        <v-card height="100%" class="relative">
            <v-card-title class="text-h5">Node</v-card-title>    
            <v-card-text>
                <v-expansion-panels>
                    <v-expansion-panel 
                        v-for="(node , index) in nodes"
                        :key="node.id"
                    >
                        <v-expansion-panel-header disable-icon-rotate>
                            {{node.title}}
                            <template v-slot:actions>

                                <v-icon v-if="node.state === 'off'" color="grey">
                                    mdi-toggle-switch-off-outline
                                </v-icon>
                                <v-icon v-else-if="node.state === 'on'" color="primary">
                                    mdi-toggle-switch-outline
                                </v-icon>
                                <v-icon v-else-if="node.state === 'reset'" color="green">
                                    mdi-cog-play-outline
                                </v-icon>
                                <v-icon v-else color="green">
                                    mdi-application-cog-outline
                                </v-icon>
                            </template>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-divider/>
                            <v-radio-group
                                v-model="states[index]"
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

                            <v-btn tile dark color="orange" block @click="update(node.id ,states[index])">Apply</v-btn>

                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-card-text>
        </v-card>
        
    </article>
</template>

<script>
import ipmi from '@/services/ipmi'

export default {
    props:{
        nodes:Array,
        states:Array
    },  

    methods:{
        async update(node , state){

            // let password = prompt("Password");
            
            // if(process.env.VUE_APP_PASSWORD !== password) alert('Password Mismatch') //.env 파일에 명시

            console.log(node)
            console.log(state)

            try {
                await ipmi.powerUpdate(node , state)
            
            } catch (e) {
                console.error(e)
            }
        }
    }

}
</script>

<style>

</style>