<template>
  <v-container fluid>
    <v-row align="center" justify="center">
      <v-col cols="12">
        <center>
          <v-btn color="secondary" style="width: 100%" @click="simplify">
            {{ this.buttonText }}
          </v-btn>
        </center>
      </v-col>
    </v-row>
    <v-data-iterator
      :items="transactions"
      :search="search"
      :sort-by="sortBy.toLowerCase()"
      sort-desc
    >
      <template v-slot:header>
        <v-toolbar class="mb-1">
          <v-text-field
            v-model="search"
            clearable
            flat
            solo-inverted
            hide-details
            prepend-inner-icon="mdi-magnify"
            label="Search"
          ></v-text-field>
          <template v-if="$vuetify.breakpoint.mdAndUp">
            <v-spacer></v-spacer>
            <v-select
              v-model="sortBy"
              flat
              solo-inverted
              hide-details
              :items="keys"
              prepend-inner-icon="mdi-magnify"
              label="Sort by"
            ></v-select>
          </template>
        </v-toolbar>
      </template>

      <template v-slot:default="props">
        <v-row no-gutters>
          <v-col v-for="tr in props.items" :key="tr.id" cols="12">
            <v-card flat>
              <person-hover
                :tr="tr"
                :members="members"
                :house-id="houseId"
              ></person-hover>
            </v-card>
          </v-col>
        </v-row>
      </template>
    </v-data-iterator>
  </v-container>
</template>

<script>
module.exports = {
  name: "ledger",
  props: ["houseId", "house"],
  components: {
    PersonHover: httpVueLoader("./Ledger/PersonHover.vue"),
  },
  data() {
    return {
      search: "",
      sortBy: "timestamp",
      keys: ["Timestamp", "Amount", "Sender", "Receiver"],
      route: "all",
      transactions: [],
    };
  },
  computed: {
    members: function () {
      return this.house.members;
    },
    buttonText: function () {
      return this.route === "all" ? "simplify" : "all";
    },
  },
  watch: {
    houseId: {
      handler(a, b) {
        this.updateTransactions();
      },
      deep: true,
    },
  },
  methods: {
    updateTransactions() {
      api(
        `/api/house/${this.houseId}/transactions/${this.route}`,
        "GET",
        true,
        null
      ).then((res) => {
        res.json().then((data) => {
          this.transactions = data.transactions;
        });
      });
    },
    simplify() {
      this.route = this.route === "all" ? "simplify" : "all";
      this.updateTransactions();
    },
  },
  mounted() {
    this.updateTransactions();
  },
};
</script>

<style scoped>
</style>