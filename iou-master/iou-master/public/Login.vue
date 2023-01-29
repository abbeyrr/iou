<template>
  <v-card elevation="8">
    <h1 class="header">
      <center><b>Welcome back!</b></center>
    </h1>
    <v-divider> </v-divider>
    <v-container>
      <v-row justify="center" dense>
        <v-col md="6">
          <v-text-field
            class="mt-5"
            v-model="email"
            label="Email"
            required
            outlined
            filled
            single-line
          ></v-text-field>
          <v-text-field
            v-model="password"
            label="Password"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPassword ? 'text' : 'password'"
            @click:append="showPassword = !showPassword"
            required
            outlined
            filled
            single-line
          ></v-text-field>
          <v-hover v-slot="{ hover }">
            <div
              @click="$router.push('/register')"
              class="nav"
              :class="{ 'nav-hover': hover }"
            >
              <p>Register</p>
            </div>
          </v-hover>
          <v-row align="center" justify="center">
            <v-btn
              class="mb-8"
              depressed
              color="secondary"
              elevation="3"
              x-large
              @click="login()"
              >login</v-btn
            >
          </v-row>
        </v-col>
      </v-row>
    </v-container>
    <v-alert v-model="showError" type="error" dismissible>
      {{ error }}
    </v-alert>
  </v-card>
</template>


<script>
module.exports = {
  name: "login",
  data() {
    return {
      email: "",
      password: "",

      showError: false,
      error: "",

      showPassword: false,
    };
  },
  methods: {
    login() {
      this.showError = false;

      api("/api/auth", "POST", false, {
        email: this.email,
        password: this.password,
      }).then((res) => {
        if (res.status == 200) {
          res.json().then((data) => {
            window.localStorage.setItem("refreshToken", data.refreshToken);
            window.localStorage.setItem("token", data.token);
            redirect("/dashboard");
          });
        } else {
          res.json().then((data) => {
            this.error = data.err;
            this.showError = true;
          });
        }
      });
    },
  },
};
</script>

<style scoped>
.header {
  padding-top: 25px;
}
</style>
