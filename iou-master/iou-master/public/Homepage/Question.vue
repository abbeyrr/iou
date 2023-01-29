<template>
  <v-row no-gutters>
    <v-col cols="12">
      <v-row
        @click.stop="clicked"
        v-click-outside="clickedOutside"
        no-gutters
        justify="center"
        align="center"
        class="pa-8 tlt"
        :class="{ clicked: selected }"
      >
        <h4>{{ title }}</h4>
        <v-spacer></v-spacer>
        <v-icon :class="{ rotate: showAnswer }">mdi-chevron-down</v-icon>
      </v-row>
      <div class="ml-8" v-if="showAnswer">
        <div class="mt-4"></div>
        <p><slot></slot></p>
      </div>
    </v-col>
  </v-row>
</template>

<script>
module.exports = {
  name: "question",
  props: {
    title: { type: String, required: true },
  },
  data() {
    return {
      showAnswer: false,
      selected: false,
    };
  },
  methods: {
    clicked() {
      this.showAnswer = !this.showAnswer; // toggle showing the answer
      this.selected = true;
    },
    clickedOutside() {
      this.selected = false;
    },
  },
};
</script>

<style scoped>
.col {
  padding: 0px;
}

.rotate {
  transition-duration: 500ms;
  transform: rotate(180deg);
}

.clicked {
  outline: 2px dashed var(--v-secondary-base);
  border-radius: 10px;
}

.tlt {
  cursor: pointer;
  user-select: none;
}
</style>