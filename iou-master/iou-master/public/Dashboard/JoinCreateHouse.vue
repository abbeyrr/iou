<template>
  <v-card class="pa-5 pt-2 pb-10">
    <v-card-title class="pa-0">
      <v-spacer></v-spacer>
      <v-btn icon @click="$emit('close')">
        <v-icon> mdi-close-thick </v-icon>
      </v-btn>
    </v-card-title>

    <v-row>
      <v-col cols="6">
        <v-card-title>
          <span class="title-text"><b>Join House</b></span>
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="houseId"
            class="mt-5"
            label="House ID"
            required
            outlined
            filled
            single-line
          ></v-text-field>
          <v-text-field
            v-model="housePass"
            class="mt-2"
            label="House Password"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPassword ? 'text' : 'password'"
            @click:append="showPassword = !showPassword"
            autocomplete="new-password"
            required
            outlined
            filled
            single-line
          ></v-text-field>
          <v-spacer></v-spacer>
        </v-card-text>
      </v-col>
      <v-divider vertical></v-divider>
      <v-col cols="6">
        <v-card-title>
          <span class="title-text"><b>Create House</b></span>
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="houseName"
            class="mt-5"
            label="House Name"
            required
            outlined
            filled
            single-line
          ></v-text-field>
          <v-text-field
            v-model="housePass2"
            class="mt-2"
            label="House Password"
            :append-icon="showPassword2 ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPassword2 ? 'text' : 'password'"
            @click:append="showPassword2 = !showPassword2"
            autocomplete="new-password"
            required
            outlined
            filled
            single-line
          ></v-text-field>
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-btn class="mt-2" :color="colour" v-on="on">
                House Colour
              </v-btn>
            </template>
            <v-color-picker v-model="colour" mode="hexa"></v-color-picker>
          </v-menu>
        </v-card-text>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn large @click="joinHouse()"> Join </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-col>
      <v-divider vertical></v-divider>
      <v-col cols="6">
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn large @click="createHouse()"> Create </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-col>
    </v-row>
    <v-snackbar multi-line color="red" v-model="showError">
      {{ error }}
    </v-snackbar>
  </v-card>
</template>

<script>
module.exports = {
  name: "join-create-house",
  props: ["show"],
  data() {
    return {
      houseId: "",
      housePass: "",

      houseName: "",
      colour: "#757575",
      housePass2: "",

      showPassword: false,
      showPassword2: false,

      showError: false,
      error: "",
    };
  },
  methods: {
    joinHouse() {
      this.showError = false;

      api("/api/house/join", "POST", true, {
        houseId: this.houseId,
        housePass: this.housePass,
      }).then((res) => {
        if (res.status == 200) {
          res.json().then((data) => {
            this.$emit("close");
            this.$emit("done");
          });
        } else {
          res.json().then((data) => {
            this.error = data.err;
            this.showError = true;
          });
        }
      });
    },
    createHouse() {
      this.showError = false;

      api("/api/house/create", "POST", true, {
        houseName: this.houseName,
        houseColor: this.colour,
        housePass: this.housePass2,
      }).then((res) => {
        if (res.status == 200) {
          res.json().then((data) => {
            this.$emit("close");
            this.$emit("done");
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
      this.houseId = "";
      this.housePass = "";

      this.houseName = "";
      this.colour = "#757575";
      this.housePass2 = "";
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
