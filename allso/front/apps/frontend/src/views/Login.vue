<template>
  <section>
    <v-container>
        <v-layout row wrap class="text-xs-center">
          <v-flex>
            <v-card flat class="mx-auto" max-width="800">
              <v-row style="margin-top: 150px">
                <v-col>
                  <v-form style="width: 800px; height: 300px">
                    <div class="mx-3">
                      <v-icon color="black" size="30px">mdi-account</v-icon>
                      Username
                      <div class="mx-1">
                        <v-text-field
                          placeholder="Username"
                          v-model="username"
                          required
                        ></v-text-field>
                      </div>
                    </div>
                    <div class="mx-3">
                      <v-icon color="black" size="30px">mdi-lock</v-icon>
                      Password
                      <div class="mx-1">
                        <v-text-field
                          placeholder="Password"
                          type="password"
                          v-model="password"
                          required
                        ></v-text-field>
                      </div>
                    </div>

                    <v-card-actions>
                      <v-btn
                        color="#2c4f91"
                        dark
                        large
                        block
                        @click="login"
                        >Login</v-btn
                      >
                    </v-card-actions>
                  </v-form>
                </v-col>
              </v-row>
            </v-card>
          </v-flex>
        </v-layout>
  </v-container>
</section>
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex'

export default {
  name: 'Login',

  components: {
  },

  data () {
    return {
      username: null,
      password: null,
    }
  },

  computed: {
    ...mapGetters({
    })
  },

  created() {
  },

  methods:{
    ...mapMutations({
    }),
    ...mapActions({
      auth: 'auth/auth'
    }),
    async login() {
      await this.auth({username: this.username, password: this.password})
      this.username = null
      this.password = null
      await this.$router.push({ path: '/' })
    },
  },

  beforeDestroy () {
  }
}
</script>
<style lang="scss">

</style>