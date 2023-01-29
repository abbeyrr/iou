<template>
  <v-card>
    <v-card-title>
      <span class="title-text">User Settings</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <v-menu offset-y>
              <template v-slot:activator="{ on }">
                <v-btn :color="colour" v-on="on"> User Colour </v-btn>
              </template>
              <v-color-picker v-model="colour" mode="hexa"></v-color-picker>
            </v-menu>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="$emit('close')"> Close </v-btn>
      <v-btn @click="updateUser()"> Save </v-btn>
    </v-card-actions>
    <v-snackbar multi-line color="red" v-model="showError">
      {{ error }}
    </v-snackbar>
  </v-card>
</template>

<script>
module.exports = {
  name: "user-settings",
  props: ["user", "show"],
  data() {
    return {
      colour: "#757575",

      showError: false,
      error: "",
    };
  },
  methods: {
    updateUser() {
      api("/api/user/update", "POST", true, {
        id: this.user.id,
        colour: this.colour,
      }).then((res) => {
        if (res.status == 200) {
          res.json().then((data) => {
            this.$emit("updated");
            this.$emit("close");
          });
        } else {
          res.json().then((data) => {
            this.error = data.err;
            this.showError = true;
          });
        }
      });
    },
    opened() {
      this.colour = this.user.colour == "" ? "#757575" : this.user.colour;
    },
  },
  watch: {
    show: {
      handler(newVal, oldVal) {
        if (newVal == true) {
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

<style scoped>
.title-text {
  font-size: 2rem;
}
</style>
