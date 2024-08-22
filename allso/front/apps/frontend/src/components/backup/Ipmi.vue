<template>
    <article>
        <h2 class="py-2 text-h4 font-weight-bold" id="ipmi">Ipmi</h2>
        <v-row>
            <v-col
                cols="12"
            >
                <h3 class="text-h5 ml-2">Node</h3>
            </v-col>
            <v-col
                v-for="(node, index) in state" 
                :key="index"
                cols="3"
            >
                <v-card
                    class="hidden-xs"
                >
                    <v-card-title class="text-h5 d-flex">{{index + 1}}</v-card-title>         
                    <v-card-text class="d-flex justify-end">
                        <v-switch
                            inset
                            v-model="state[index]"
                            readonly
                        >
                            <template v-slot:label   >
                                <sub 
                                    class="font-weight-bold hidden-sm-and-down"
                                    :class="state[index] ? 'primary--text' : 'grey--text text--lighten-1'">
                                    {{state[index] ? 'ON' : 'OFF' }}
                                </sub>
                            </template>
                        </v-switch>  
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </article>
</template>

<script>

export default {
    props:{
        state:Array,
    },  
}
</script>

<style>

</style>