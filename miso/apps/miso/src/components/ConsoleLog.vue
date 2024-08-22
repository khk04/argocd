<template>
  <v-card class="text-left pl-2 py-2" color="black">
    <div class="full-height-element" id="terminal"></div>
  </v-card>
</template>

<script>
import { Terminal } from "xterm";
// import { mapGetters } from "vuex";

export default {
  name: "ConsoleLog",
  props: {
    // terminal: {
    //   type: Object,
    //   default: {},
    // },
    // runImage: {
    //   type: String,
    //   default: "",
    // },
  },
  data() {
    return {
      term: null,
      intervalId: null,
      checkLog: "",
      checkImage: "",
      addLog: "",
      // message: "",
    };
  },
  computed: {
    // ...mapGetters({
    //   log: "kafka/log",
    // }),
    log() {
      return this.$store.state.kafka.log;
    },
  },
  methods: {
    clearTerminal() {
      this.checkLog = "";
      this.term.clear();
    },
    compareStrings(str1, str2) {
      let result = "";
      const minLength = Math.min(str1.length, str2.length);

      for (let i = 0; i < minLength; i++) {
        if (str1[i] !== str2[i]) {
          result += str2[i]; // or str1[i], depending on which string you want to show differences from
        }
      }

      if (str1.length > minLength) {
        result += str1.slice(minLength);
      } else if (str2.length > minLength) {
        result += str2.slice(minLength);
      }

      return result;
    },
    terminalHeight() {
      const windowHeight = Math.floor(
        (window.innerHeight ||
          document.documentElement.clientHeight ||
          document.body.clientHeight) / 19
      );
      return windowHeight;
    },
    terminalWidth() {
      const windowWidth = Math.floor(
        (window.innerWidth ||
          document.documentElement.clientWidth ||
          document.body.clientWidth) / 14
      );
      return windowWidth;
    },
  },

  created() {
    console.log("CALL created()");
  },
  mounted() {
    this.term = new Terminal();
    this.term.open(document.getElementById("terminal"));
    let terminalHeight = this.terminalHeight();
    let terminalWidth = this.terminalWidth();
    this.term.resize(terminalWidth, terminalHeight);
    // this.term.write("\x1B[1;3;32mubuntu@ksskor\x1B[0m:\x1B[34m~\x1B[0m$ ");
    this.intervalId = setInterval(() => {
      // if (this.runImage !== this.checkImage) {
      // this.checkImage = this.runImage;
      // console.log("this.term.clear();");
      // this.term.clear();
      // }

      if (this.log === this.checkLog) {
        // console.log(this.log);
      } else {
        let terminalHeight = this.terminalHeight();
        let terminalWidth = this.terminalWidth();
        this.term.resize(terminalWidth, terminalHeight);
        // this.clearTerminal();
        // this.term.write(this.log);
        this.addLog = this.compareStrings(this.checkLog, this.log);
        this.term.write(this.addLog);
        // this.term.write("\r\n");
        this.checkLog = this.log;
      }
    }, 1000);
  },
  beforeUnmount() {
    clearInterval(this.intervalId);
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "../../node_modules/xterm/css/xterm.css";
.full-height-element {
  height: calc(100vh - 112px);
}
</style>
