<template>
  <v-hover v-slot="{ hover }">
    <v-card
      :elevation="hover ? 12 : 0"
      tile
      class="feature"
      :class="{ 'feature-hover': hover }"
      width="300px"
      :height="height"
    >
      <v-icon class="card-icon" x-large>{{ icon }}</v-icon>
      <v-card-title>{{ title }}</v-card-title>
      <v-card-text class="main-text" v-if="!small">
        <p><slot></slot></p>
      </v-card-text>
    </v-card>
  </v-hover>
</template>

<script>
module.exports = {
  name: "feature-card",
  props: {
    title: { type: String, required: true },
    icon: { type: String, required: true },
    small: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  computed: {
    height: function () {
      const size = !this.small ? 250 : 112.5;
      return size + "px";
    },
  },
  methods: {},
};
</script>

<style scoped>
.feature {
  user-select: none;
  transition: all 300ms;
}

.main-text {
  word-break: break-word;
  font-size: 0.95rem;
}

.feature-hover {
  transform: scale(1.05);
}

.card-icon {
  padding: 12px 0px 0px 12px;
}

.theme--light.v-icon {
  color: rgb(58, 58, 58);
}

/* special case for the cards, should be light as they "pop" out */
.theme--dark.v-card {
  background-color: var(--v-off-lighten2);
}
</style>