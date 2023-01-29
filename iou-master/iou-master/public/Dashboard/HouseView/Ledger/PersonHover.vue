<template>
  <p class="transactionText text-center">
    £{{ tr.amount.toFixed(2) }} from
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-hover v-slot="{ hover }">
          <span
            :style="{ color: sender.color }"
            :class="{ 'person-hover': hover }"
            v-bind="attrs"
            v-on="on"
            >{{ sender.name }}</span
          >
        </v-hover>
      </template>
      <span>£{{ sender.balance }}</span>
    </v-tooltip>
    to
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-hover v-slot="{ hover }">
          <span
            :style="{ color: receiver.color }"
            :class="{ 'person-hover': hover }"
            v-bind="attrs"
            v-on="on"
            >{{ receiver.name }}</span
          >
        </v-hover>
      </template>
      <span>£{{ receiver.balance }}</span>
    </v-tooltip>
  </p>
</template>

<script>
module.exports = {
  name: "person-hover",
  props: ["tr", "members", "houseId"],
  data() {
    return {
      sender: {
        id: 0,
        name: "",
        color: "#ffffff",
        balance: "0",
      },
      receiver: {
        id: 0,
        name: "",
        color: "#ffffff",
        balance: "0",
      },
    };
  },
  watch: {
    members: {
      handler(newVal, oldVal) {
        this.updatePerson(this.sender);
        this.updatePerson(this.receiver);
      },
      deep: true,
    },
  },
  methods: {
    updatePerson(person) {
      const raw = this.getPerson(person.id);
      if (raw === undefined) {
        return;
      }
      person.name = raw.name;
      person.color = raw.colour;
      this.getBalance(person);
    },
    getBalance(person) {
      api(
        `/api/house/${this.houseId}/transactions/balance/${person.id}`,
        "GET",
        true,
        null
      ).then((res) => {
        res.json().then((data) => {
          person.balance = data.balance.toFixed(2);
        });
      });
    },
    getPerson(id) {
      return this.members.find((p) => p.id == id);
    },
  },
  mounted() {
    this.sender.id = this.tr.sender;
    this.receiver.id = this.tr.receiver;
    this.updatePerson(this.sender);
    this.updatePerson(this.receiver);
  },
};
</script>

<style scoped>
.transactionText {
  user-select: none;
}

.person-hover {
  text-decoration: underline;
}
</style>