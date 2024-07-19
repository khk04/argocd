<template>
  <v-card>
  <!-- <div class="console" id="terminal"></div> -->
  <div class="console" :id="id"></div>
  <!-- <v-text-field
    label="message"
    v-model="message"
    @input="updateInput"
    @keydown.enter="submit"
    hide-details="auto"
  ></v-text-field>
  <v-btn class="mt-1" @click="sendMessage">send</v-btn> -->
  </v-card>
</template>

<script>
import { Terminal } from 'xterm';

export default {
  name: 'FaConsole',
  props:{
    terminal: {
      type: Object,
      default: {}
    }
  },
  data () {
    return {
      term: null,
      ws: null,
      message: '',
      save_messages: [''],
      save_messages_index: 0
    }
  },
  computed: {
    id () {
      return 'terminal' + this.terminal.pid
    }
  },
  methods: {
    runRealTerminal () {
      console.log('webSocket is finished')
    },
    errorRealTerminal () {
      console.log('error')
    },
    closeRealTerminal () {
      console.log('close')
    },
    // sendMessage(event) {
    //     this.ws.send(this.message)
    //     this.message = ''
    //     event.preventDefault()
    // },
    // updateInput(event) {
    //   this.message = event;
    // },
    // submit(event) {
    //   this.ws.send(this.message)
    //   this.message = ''
    //   event.preventDefault()
    // }
  },
  created() {
    console.log('CALL created()')
  },
  
  mounted () {
    console.log('CALL mounted()')
    console.log('pid : ' + this.terminal.pid + ' is on ready')
    
    this.term = new Terminal();
    this.term.open(document.getElementById('terminal' + this.terminal.pid));
    // term.resize(80, 47)
    this.term.resize(this.terminal.cols, this.terminal.rows)
    // this.term.write('\x1B[1;3;32molafm@olaf\x1B[0m:\x1B[34m~\x1B[0m$ ')

    this.term.onData((key) => {
      console.log(key.charCodeAt(0))
      if (key.charCodeAt(0) > 127) {
        return
      }
      if (key.charCodeAt(0) == 3) {
        this.ws.send('\x03')
        return
      }
      if (key.charCodeAt(0) == 26) {
        this.ws.send('\x1A')
        return
      }
      if (key.charCodeAt(0) == 24) {
        this.ws.send('\x18')
        return
      }
      if (key.charCodeAt(0) == 2) {
        this.ws.send('\x16')
        return
      }
      if (key.charCodeAt(0) == 27) {
        
        let message_len = this.message.length
        for (var i = 0; i < message_len; i++) {
          this.term.write("\b \b")
        }
        if (this.save_messages_index === this.save_messages.length) {
          this.save_messages_index = 0
        }
        this.message = this.save_messages[this.save_messages_index]
        this.term.write(this.message);

        this.save_messages_index = this.save_messages_index + 1
        return
      }
      if (key.charCodeAt(0) == 127) {
        if (this.message === '' ) return
        this.message = this.message.slice(0, -1)
        this.term.write("\b \b")
        return
      }
      if (key.charCodeAt(0) == 13) {
          console.log(this.save_messages)
          console.log(this.message)

          console.log(this.message)

          if (this.message.length > 0) {
            if(this.save_messages.indexOf(this.message) === -1) {
              this.save_messages.unshift(this.message)  
            } else {
              this.save_messages.splice(this.save_messages.indexOf(this.message), 1)
              this.save_messages.unshift(this.message)
            }
          }

          setTimeout(() => {
            this.term.write("\r")
          }, 200);
          this.ws.send(this.message)
          this.message = ''
          this.save_messages_index = 0
      } else {
        console.log(key.charCodeAt(0))
        this.message = this.message + key
        this.term.write(key);
      }
    })

    console.log('ws://' + this.terminal.wsUrl + '/ws/' + this.terminal.pid)

    this.ws = new WebSocket('wss://' + this.terminal.wsUrl + '/ws/' + this.terminal.pid);


    this.ws.onopen = this.runRealTerminal
    this.ws.onclose = this.closeRealTerminal
    this.ws.onerror = this.errorRealTerminal
    this.term._initialized = true
    console.log('mounted is going on')

    this.ws.onmessage = function(event) {
      // this.term.write('\x1b[2K\r')
      // this.term.write("\n\r")
      this.term.write(event.data)
      // this.term.write('\x1B[1;3;32molaflogin00@olaflogin00\x1B[0m:\x1B[34m~\x1B[0m$ ')
      }.bind(this)

    setTimeout(() => {
      if (this.terminal.pid === 4) {
        this.ws.send('su hpe')
        this.ws.send('clear')
      }
    }, 1000);


  },
  beforeDestroy () {
    this.ws.close()
    this.term.destroy()
  }
}
</script>

<style scoped>
@import '../../../node_modules/xterm/css/xterm.css';
</style>
