<template v-slot: extension>
  <v-card>
    <v-card-title>
      <span class="title-text">Pay</span>
    </v-card-title>
    <v-card-text>
      <v-form ref="form">
        <v-container>
          <v-row>
            <v-col>
              <v-select
                v-model="recipient"
                :items="selectMembers"
                :rules="recipientRules"
                label="Recipient"
                required
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model="amount"
                label="Amount"
                prefix="£"
                :rules="amountRules"
                required
                outlined
                filled
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="$emit('close')"> Close </v-btn>
      <v-btn @click="pay()"> Pay </v-btn>
    </v-card-actions>
    <v-snackbar multi-line color="red" v-model="showError">
      {{ error }}
    </v-snackbar>
  </v-card>
</template>


<script>
module.exports = {
  name: "pay",
  props: ["show", "houseId", "members", "user", "payDefaultRecipient"],
  data() {
    return {
      selectMembers: [],

      recipient: null,
      amount: "0.00",

      showError: false,
      error: "",

      recipientRules: [(v) => !!v || "Recipient is required"],

      amountRules: [
        (v) => !!v || "Amount is required",
        (v) =>
          /^\d+\.\d\d$/.test(v) ||
          "Amount must be a number with 2 deicmal places",
      ],
    };
  },
  methods: {
    pay() {
      if (this.$refs.form.validate()) {
        this.showError = false;

        api(`/api/house/${this.houseId}/transactions/pay`, "POST", true, {
          recipient: this.recipient,
          amount: parseFloat(this.amount),
        }).then((res) => {
          if (res.status == 200) {
            res.json().then((data) => {
              this.$emit("payed");
              this.$emit("close");
            });
          } else {
            res.json().then((data) => {
              this.error = data.err;
              this.showError = true;
            });
          }
        });
      }
    },
    opened() {
      this.recipient = this.payDefaultRecipient;
      this.amount = "0.00";
      this.selectMembers = this.members
        .filter((member) => member.id != this.user.id)
        .map((member) => {
          return { value: member.id, text: member.name };
        });
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