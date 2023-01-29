<template>
  <v-card>
    <v-card-title>
      <span class="title-text">House Settings</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col>
            <v-text-field
              v-model="name"
              label="Change House Name"
              required
              outlined
              filled
            ></v-text-field>
            <v-text-field
              v-model="password"
              label="Change Password"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPassword ? 'text' : 'password'"
              @click:append="showPassword = !showPassword"
              autocomplete="new-password"
              required
              outlined
              filled
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <v-menu offset-y>
              <template v-slot:activator="{ on }">
                <v-btn :color="colour" v-on="on"> House Colour </v-btn>
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
      <v-btn @click="updateHouse()"> Save </v-btn>
    </v-card-actions>
    <v-snackbar multi-line color="red" v-model="showError">
      {{ error }}
    </v-snackbar>
  </v-card>
</template>

<script>
module.exports = {
  name: "house-settings",
  props: ["house", "show"],
  data() {
    return {
      colour: "#757575",
      password: "",
      name: "",

      showPassword: false,

      showError: false,
      error: "",
    };
  },
  methods: {
    updateHouse() {
      api(`/api/house/${this.house.id}/update`, "POST", true, {
        colour: this.colour,
        password: this.password,
        name: this.name,
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
      this.colour = this.house.colour == "" ? "#757575" : this.house.colour;
      this.password = this.house.password;
      this.name = this.house.name;
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