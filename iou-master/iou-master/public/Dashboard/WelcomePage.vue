<template>
  <div class="content">
    <v-card v-if="!hide" flat class="my-16 welcome" color="off">
      <v-row>
        <v-col cols="6">
          <v-row class="my-1 non-selectable">
            <v-img
              src="/assets/logo.svg"
              max-width="52"
              position="bottom left"
              class="ma-2"
            >
            </v-img>
            <h1 class="font-weight-black">iou</h1>
          </v-row>
          <h2 class="non-selectable">Making money manageable</h2>
          <div class="my-6"></div>
          <h3>Start</h3>
          <p>
            Join or create a new House by clicking the
            <v-icon
              x-large
              color="blue"
              @click="$emit('show-join-create-house')"
            >
              mdi-plus-circle-outline
            </v-icon>
            icon.
          </p>
          <p>Invite friends to your house with the code.</p>
          <p>Let <strong>iou</strong> keep track of your money.</p>
          <div class="my-16"></div>
          <h3>Tips</h3>
          <p>
            The higher your balance, the larger pull your bubble has on others.
          </p>
          <p>Double click on a bubble to send that person some money.</p>
          <p>You can also press the Pay button in the bottom right.</p>
          <div class="my-4"></div>
          <p>
            Invite your friends using the House share code from the top bar.
          </p>
        </v-col>
        <v-col cols="6">
          <dark-mode-button
            style="float: right"
            class="no-background-hover"
          ></dark-mode-button>
        </v-col>
      </v-row>
      <v-footer app bottom fixed inset color="off">
        <v-row justify="center" align="center">
          <v-col cols="12" sm="4">
            <v-checkbox
              v-model="showWelcome"
              @click="toggleShow"
              color="secondary"
              label="Show welcome screen on startup"
            ></v-checkbox>
          </v-col>
        </v-row>
      </v-footer>
    </v-card>
  </div>
</template>

<script>
module.exports = {
  components: {
    DarkModeButton: httpVueLoader("/DarkModeButton.vue"),
  },
  name: "welcome-page",
  props: [],
  data() {
    return {
      showWelcome: true,
      hide: false,
    };
  },
  methods: {
    toggleShow() {
      localStorage.setItem("hide_welcome", !this.showWelcome);
    },
  },
  mounted() {
    const hide = localStorage.getItem("hide_welcome");
    if (hide) {
      this.hide = hide === "true";
    }
  },
};
</script>

<style scoped>
p {
  margin-bottom: 6px;
  line-height: 40px;
}

.welcome {
  font-size: 1.2rem;
}

.non-selectable {
  user-select: none;
}

.content {
  margin: auto;
  padding-left: 4rem;
  padding-right: 4rem;
}

@media screen and (min-width: 81rem) {
  .content {
    max-width: 85rem;
    padding: 0px;
  }
}

@media screen and (min-width: 48rem) {
  .content {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}
</style>