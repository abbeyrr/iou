<template>
  <v-container fluid>
    <div class="chat-view">
      <div class="messages" id="chat">
        <div
          class="message"
          v-for="message in messages"
          v-bind:key="message.id"
        >
          <div class="username">{{ message.username }}:</div>
          <div class="newMessage">{{ message.text }}</div>
        </div>
      </div>
      <div class="input-container">
        <v-text-field
          v-on:keyup.enter="sendMessage()"
          append-icon="mdi-send-circle"
          @click:append="sendMessage()"
          type="text"
          v-model="newMessage"
          class="mt-5"
          outlined
          filled
          single-line
          dense
          hide-details
        ></v-text-field>
      </div>
    </div>
  </v-container>
</template>

<script>
const socket = io(`${window.location.origin}`);

module.exports = {
  name: "chat",
  props: ["user", "id"],

  data() {
    return {
      newMessage: "",
      messages: [],
    };
  },
  methods: {
    sendMessage() {
      //  this.newMessage = this.$refs.messageInput.value;
      if (this.newMessage != "") {
        var msg = {
          houseId: this.id,
          username: this.user.firstName,
          text: this.newMessage,
        };
        socket.emit("message", msg);
        socket.emit("chatLogRequest", this.id);
        this.newMessage = "";
      }
    },
    opened() {
      socket.emit("History", this.id);
    },
  },

  created() {
    socket.on("chatLogData", (msgArr) => {
      this.messages = msgArr;
      Vue.nextTick(function () {
        var div = document.getElementById("chat");
        div.scrollTop = div.scrollHeight;
      });
    });
    socket.on("chatLog", (message) => {
      if (message.houseId == this.id) {
        this.messages.push(message);
        Vue.nextTick(function () {
          var div = document.getElementById("chat");
          div.scrollTop = div.scrollHeight;
        });
      }
    });
  },
  watch: {
    id: {
      handler(newVal, oldVal) {
        if (newVal != oldVal) {
          this.opened();
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.opened();
  },
};
</script>

<style lang="css" scoped>
.chat-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 70vh;
  margin: 0 auto;
  padding: 15px;
  box-sizing: border-box;
  box-shadow: 1px 1px 6px 0px rgba(0, 0, 0, 0.15);
}
.messages {
  flex: 1;
  overflow: scroll;
}
.message {
  display: flex;
  border-bottom: 1px solid;
  padding: 10px;
}
.username {
  width: 100px;
  margin-right: 15px;
}
.newMessage {
  flex: 1;
}
.input-container {
  display: flex;
}
input {
  flex: 1;
  height: 35px;
  font-size: 18px;
  box-sizing: border-box;
}
button {
  width: 75px;
  height: 35px;
  box-sizing: border-box;
}
</style>