<template>
    <article>
        <!-- <h2 class="py-2 text-h4 font-weight-bold" id="slurm">Slurm</h2> -->
        <v-row>
            <v-col           
                cols="12"
                md="6"
                lg="4"
            >
                <v-card>
                    <v-card-title class="text-h5">Runtime</v-card-title>         
                    <v-card-text class="d-flex justify-end black--text">
                        <div>
                            <span class="text-h3 mr-2">{{runtime}}</span>
                            <sub class="text-h6 font-weight-light">min</sub>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col           
                cols="12"
                md="6"
                lg="4"
            >
                <v-card>
                    <v-card-title class="text-h5">Running Jobs</v-card-title>           
                    <v-card-text class="d-flex justify-end black--text">
                        <div>
                            <span class="text-h3 mr-2 ">{{jobs.length}}</span>
                            <sub class="text-h6 font-weight-light">job</sub>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col           
                cols="12"
                md="12"
                lg="4"
            >
                <v-card>
                    <v-card-title class=" d-flex justify-space-between">
                        <span class="text-h5">Node State</span>
                        <span class="subtitle-2">
                            <v-chip
                                label
                                x-small
                            >
                                IDLE :
                                {{idle}}
                            </v-chip>
                            <v-chip
                                class="mx-2"
                                color="green lighten-2"
                                label
                                x-small
                            >
                                USE :
                                {{use}}
                            </v-chip>
                            <v-chip
                                color="primary"
                                label
                                x-small
                            >
                                TOTAL :
                                {{total}}
                            </v-chip>
                        </span>
                        </v-card-title>        
                    <v-card-text class="d-flex  black--text">
                        <v-row>
                            <v-col cols="7">
                                <v-progress-linear
                                    v-model="persent"
                                    color="green darken-2"
                                    background-color="grey lighten-2"
                                    rounded
                                    height="48"
                                    dark
                                    reactive
                                    @click.prevent.self
                                />
                            </v-col>
                            <v-col cols="5" class="text-right">
                                <span class="text-h3  mr-2">{{persent}}</span>
                                <sub class="text-h6 font-weight-light">%</sub>
                            </v-col>

                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </article>
</template>

<script>

export default {
    props:{
        runtime:Number,
        jobs:Array,
        idle:Number,
        total:Number,
        use:Number,
        persent:Number,
    },  
}
</script>

<style scoped>
</style>