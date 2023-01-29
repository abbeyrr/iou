<template>
  <v-app>
    <v-navigation-drawer
      permanent
      mini-variant
      mini-variant-width="72"
      app
      class="nav-draw"
    >
      <template v-slot:prepend>
        <v-hover v-slot="{ hover }">
          <div class="app-title text-center" @click="$router.push('/')">
            <h2
              class="app-name font-weight-black"
              :class="{ 'title-hover': hover }"
            >
              iou
            </h2>
          </div>
        </v-hover>

        <center>
          <v-dialog
            v-model="showJoinCreateHouse"
            transition="fade-transition"
            max-width="800px"
          >
            <template v-slot:activator="{ on: onDialog, attrs: attrsDialog }">
              <v-tooltip right>
                <template
                  v-slot:activator="{ on: onTooltip, attrs: attrsTooltip }"
                >
                  <v-btn
                    icon
                    large
                    v-bind="{ ...attrsDialog, ...attrsTooltip }"
                    v-on="{ ...onDialog, ...onTooltip }"
                  >
                    <v-icon x-large color="blue">
                      mdi-plus-circle-outline
                    </v-icon>
                  </v-btn>
                </template>
                <span>Join or create new house</span>
              </v-tooltip>
            </template>
            <join-create-house
              :show="showJoinCreateHouse"
              @close="showJoinCreateHouse = false"
              @done="getUserData()"
            />
          </v-dialog>
        </center>
      </template>

      <v-virtual-scroll
        :items="houses"
        :item-height="52"
        style="scrollbar-width: thin"
      >
        <template v-slot:default="{ item }">
          <v-list-item>
            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <v-list-item-avatar class="mx-0">
                  <v-btn
                    icon
                    fab
                    v-bind="attrs"
                    v-on="on"
                    @click="houseId = item.id"
                  >
                    <v-icon x-large :color="item.colour">
                      mdi-home-circle
                    </v-icon>
                  </v-btn>
                </v-list-item-avatar>
              </template>
              <span>{{ item.name }}</span>
            </v-tooltip>
          </v-list-item>
        </template>
      </v-virtual-scroll>

      <template v-slot:append>
        <center>
          <v-menu offset-x>
            <template v-slot:activator="{ on: menu, attrs }">
              <v-tooltip right>
                <template v-slot:activator="{ on: tooltip }">
                  <v-btn
                    icon
                    fab
                    :color="user.colour"
                    v-bind="attrs"
                    v-on="{ ...tooltip, ...menu }"
                  >
                    <v-icon x-large> mdi-account </v-icon>
                  </v-btn>
                </template>
                <span>My Profile</span>
              </v-tooltip>
            </template>
            <v-list>
              <v-dialog v-model="showUserSettings" max-width="600px">
                <template v-slot:activator="{ on, attrs }">
                  <v-list-item v-bind="attrs" v-on="on" link>
                    <v-list-item-icon>
                      <v-icon>mdi-cog</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Settings</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </template>
                <user-settings
                  :user="user"
                  :show="showUserSettings"
                  @close="showUserSettings = false"
                  @updated="
                    getUserData();
                    $refs.houseView.getHouseData();
                  "
                />
              </v-dialog>

              <v-list-item link class="red--text" @click="logout()">
                <v-list-item-icon>
                  <v-icon color="red">mdi-logout</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Logout</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
        </center>
      </template>
    </v-navigation-drawer>

    <v-main>
      <div v-if="houseId" class="fill-height" style="overflow: hidden">
        <house-view :id="houseId" :user="user" ref="houseView" />
      </div>
      <div v-else>
        <welcome-page @show-join-create-house="showJoinCreateHouse = true" />
      </div>
    </v-main>
  </v-app>
</template>

<script>
module.exports = {
  components: {
    HouseView: httpVueLoader("/Dashboard/HouseView.vue"),
    UserSettings: httpVueLoader("/Dashboard/UserSettings.vue"),
    JoinCreateHouse: httpVueLoader("/Dashboard/JoinCreateHouse.vue"),
    WelcomePage: httpVueLoader("/Dashboard/WelcomePage.vue"),
  },
  data() {
    return {
      user: {},
      houseId: null,
      houses: [],

      showUserSettings: false,
      showJoinCreateHouse: false,
    };
  },
  methods: {
    logout() {
      // Remove all tokens
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("refreshToken");
      redirect("/"); // Redirect to homepage
    },
    getUserData() {
      api("/api/user/get", "GET", true, null).then((res) => {
        res.json().then((data) => {
          this.user = data.user;
          this.houses = data.houses;
        });
      });
    },
  },
  mounted() {
    this.getUserData();
    this.applyTheme();
  },
};
</script>

<style scoped>
.v-main {
  background-color: var(--v-off-base);
}

.nav-draw {
  background-color: var(--v-off-lighten1);
}

.v-navigation-drawer__content {
  scrollbar-width: thin;
}

.app-title {
  height: 48px;
}

.title-hover {
  cursor: pointer;
  text-decoration: underline;
}

.app-name {
  user-select: none;
  font-size: 1.75rem;
}
</style>
