<template>
  <v-btn
    v-if="!$vuetify.theme.dark"
    small
    elevation="0"
    fab
    @click="toggleDarkMode"
  >
    <v-icon>mdi-lightbulb</v-icon>
  </v-btn>
  <v-btn v-else small elevation="0" fab @click="toggleDarkMode">
    <v-icon color="primary">mdi-lightbulb</v-icon>
  </v-btn>
</template>

<script>
module.exports = {
  name: "dark-mode-button",
  props: [],
  data() {
    return {};
  },
  methods: {
    toggleDarkMode() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      localStorage.setItem("dark_theme", this.$vuetify.theme.dark.toString());
    },
  },
};
</script>
