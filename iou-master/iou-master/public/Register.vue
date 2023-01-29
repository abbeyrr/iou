<template>
  <v-app>
    <v-card
      class="mx-auto my-16"
      justify="center"
      align="center"
      min-width="700"
      min-height="850"
      :elevation="10"
      rounded="lg"
    >
      <h1 class="header"><center>IOU</center></h1>
      <v-img src="./assets/logo.svg" max-height="150" max-width="150"></v-img>
      <h2><center>Making Money Manageable</center></h2>
      <p class="signup"><center>Sign Up for IOU below</center></p>
      <v-form ref="form">
        <v-container>
          <v-divider> </v-divider>
          <v-row justify="center">
            <v-col md="4">
              <v-text-field
                v-model="firstName"
                :rules="nameRules"
                :counter="64"
                align="center"
                label="First Name"
                class="centered-input"
                required
                outlined
                filled
                single-line
              ></v-text-field>
            </v-col>
            <v-col md="4">
              <v-text-field
                v-model="lastName"
                :rules="nameRules"
                :counter="64"
                label="Last Name"
                class="centered-input"
                required
                outlined
                filled
                single-line
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-col md="8">
              <v-text-field
                v-model="email"
                :rules="emailRules"
                :counter="256"
                label="Email"
                required
                outlined
                filled
                single-line
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-col md="8">
              <v-text-field
                v-model="password"
                :rules="passwordRules"
                :counter="64"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPassword ? 'text' : 'password'"
                @click:append="showPassword = !showPassword"
                label="Password"
                required
                outlined
                filled
                single-line
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
        <v-row align="center" justify="center">
          <v-btn
            class="black--text"
            color="primary"
            value="Register"
            elevation="3"
            x-large
            depressed
            tile
            @click="register()"
            >REGISTER</v-btn
          >
        </v-row>
      </v-form>
      <v-snackbar multi-line color="red" v-model="showError">
        {{ error }}
      </v-snackbar>
    </v-card>
  </v-app>
</template>


<script>
module.exports = {
  data() {
    return {
      firstName: "",
      lastName: "",
      email: "",
      password: "",

      showError: false,
      error: "",

      showPassword: false,

      nameRules: [
        (v) => !!v || "Name is required",
        (v) => v.length <= 64 || "Name must be 64 characters or less",
        (v) =>
          /^[A-Z\-" "]+$/i.test(v) ||
          "Name must only contain letters, hyphens, or spaces",
      ],

      emailRules: [
        (v) => !!v || "Email is required",
        (v) => v.length <= 256 || "Email must be 256 characters or less",
        (v) => /^.+@.+$/.test(v) || "Email must be valid",
      ],

      passwordRules: [
        (v) => !!v || "Password is required",
        (v) => v.length <= 64 || "Password must be 64 characters or less",
        (v) =>
          /(?=.*[A-Z])/.test(v) || "Password must contain an upper case letter",
        (v) =>
          /(?=.*[a-z])/.test(v) || "Password must contain a lower case letter",
        (v) => /(?=.*[0-9])/.test(v) || "Password must contain a number",
      ],
    };
  },
  methods: {
    register() {
      if (this.$refs.form.validate()) {
        this.showError = false;

        api("/api/user/register", "POST", false, {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          password: this.password,
        }).then((res) => {
          if (res.status == 200) {
            redirect("/"); // Redirect to home page
          } else {
            res.json().then((data) => {
              this.error = data.err;
              this.showError = true;
            });
          }
        });
      }
    },
  },
  mounted() {
    this.applyTheme();
  },
};
</script>

<style scoped>
.header {
  padding: 20px;
}

.centered-input {
  padding-top: 50px;
  text-align: center;
}

.signup {
  color: #d3d3d3;
}
</style>
