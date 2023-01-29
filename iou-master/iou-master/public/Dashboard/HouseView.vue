<template>
  <div class="fill-height">
    <v-toolbar flat dense>
      <v-spacer></v-spacer>
      <v-toolbar-title class="non-selectable">{{
        this.house.name
      }}</v-toolbar-title>
      <div class="mx-1"></div>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            small
            icon
            fab
            elevation="0"
            @click="copyToClipboard"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-content-copy</v-icon>
          </v-btn>
        </template>
        <span>Copy House share code</span>
      </v-tooltip>
      <v-spacer></v-spacer>
      <dark-mode-button class="no-background-hover"></dark-mode-button>
      <div class="mx-1"></div>
      <v-dialog v-model="showHouseSettings" max-width="600px">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            class="no-background-hover"
            v-bind="attrs"
            v-on="on"
            small
            fab
            elevation="0"
          >
            <v-icon class="hoverSpin">mdi-cog</v-icon>
          </v-btn>
        </template>
        <house-settings
          :house="house"
          :show="showHouseSettings"
          @close="showHouseSettings = false"
          @updated="getHouseData()"
        />
      </v-dialog>
    </v-toolbar>
    <v-divider></v-divider>

    <div class="fill-height">
      <v-row no-gutters class="fill-height">
        <v-col cols="8">
          <v-container fluid class="fill-height">
            <svg id="bubbles" class="fillup">
              <bubble
                v-for="(b, i) in this.bubbles"
                :key="i"
                :p-id="b.id"
                :position.sync="b.pos"
                :balance="b.balance"
                :color="b.color"
                :visible="b.visible"
                @clicked="
                  payDefaultRecipient = b.id;
                  showPay = true;
                "
              >
                {{ b.name }}
              </bubble>
            </svg>
            <v-overlay :value="overlay">
              <v-progress-circular
                indeterminate
                size="64"
              ></v-progress-circular>
            </v-overlay>
          </v-container>
        </v-col>
        <v-col cols="4">
          <v-card flat>
            <v-tabs grow slider-size="1" color="secondary">
              <v-tab> Chat </v-tab>
              <v-tab-item>
                <chat :id="id" :user="user" />
              </v-tab-item>
              <v-tab> Ledger </v-tab>
              <v-tab-item>
                <ledger ref="ledger" :house-id="id" :house="house" />
              </v-tab-item>
            </v-tabs>
          </v-card>
          <center>
            <v-btn
              class="mt-3"
              x-large
              color="secondary"
              style="width: 100%"
              @click="
                payDefaultRecipient = null;
                showPay = true;
              "
            >
              Pay
            </v-btn>
          </center>
        </v-col>
      </v-row>
    </div>
    <v-snackbar v-model="showCopyConfirm">
      House share code successfully copied!
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="showCopyConfirm = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-dialog v-model="showPay" max-width="800px">
      <pay
        :show="showPay"
        :house-id="id"
        :members="house.members"
        :user="user"
        :pay-default-recipient="payDefaultRecipient"
        @close="showPay = false"
        @payed="
          update();
          if ($refs.ledger) {
            $refs.ledger.updateTransactions();
          }
        "
      />
    </v-dialog>
  </div>
</template>

<script>
module.exports = {
  components: {
    HouseSettings: httpVueLoader("./HouseView/HouseSettings.vue"),
    Pay: httpVueLoader("./HouseView/Pay.vue"),
    Ledger: httpVueLoader("./HouseView/Ledger.vue"),
    Bubble: httpVueLoader("./HouseView/Bubble.vue"),
    DarkModeButton: httpVueLoader("/DarkModeButton.vue"),
    Chat: httpVueLoader("./HouseView/Chat.vue"),
  },
  name: "house-view",
  props: ["id", "user"],
  data() {
    return {
      lastId: -1,
      house: {},
      bubbles: [],
      overlay: false,

      showHouseSettings: false,
      showPay: false,
      showCopyConfirm: false,

      payDefaultRecipient: null,
    };
  },
  methods: {
    copyToClipboard() {
      navigator.clipboard.writeText(this.id);
      this.showCopyConfirm = true;
    },
    update() {
      api(`/api/house/${this.id}/get`, "GET", true, null).then((res) => {
        res.json().then((data) => {
          this.overlay = true;
          this.house = data;
          const bubbles = document.getElementById("bubbles");
          // try reuse the old bubble positions
          let oldPos = new Map();
          if (this.lastId === this.id) {
            for (const b of this.bubbles) {
              oldPos.set(b.id, b.pos);
            }
          }
          this.bubbles = data.members.map((m) => {
            let pos = oldPos.get(m.id);
            if (pos === undefined) {
              pos = {
                x: Math.random() * (bubbles.clientWidth - 100) + 50,
                y: Math.random() * (bubbles.clientHeight - 100) + 50,
              };
            }
            return {
              id: m.id,
              name: m.name,
              balance: 0,
              visible: false,
              color: "blue",

              radius: 50,
              pos: pos,
              v: { x: 0, y: 0 },
            };
          });

          this.lastId = this.id;

          for (const b of this.bubbles) {
            api(
              `/api/house/${this.id}/transactions/balance/${b.id}`,
              "GET",
              true,
              null
            ).then((res) => {
              res.json().then((data) => {
                const bal = data.balance;
                b.balance = Math.abs(bal);
                b.color = bal > 0 ? "var(--v-green-base)" : "var(--v-red-base)";
                b.visible = true;
                b.radius = Math.min(
                  17 * Math.pow(b.balance, 0.493518) + 50,
                  200
                );
              });
            });
          }

          this.overlay = false;
        });
      });
    },
    moveBubbles() {
      const dt = 16 / 1000; // timestep
      const f = 0.01; // damping
      const massMul = 25_000;

      const world = document.getElementById("bubbles");

      function nsquaredacceleration(bubbles, j, x, y, r) {
        let da = { x: 0, y: 0 };
        for (var i = 0; i < bubbles.length; i++) {
          var b = bubbles[i];
          if (i != j) {
            let xdiff = b.pos.x - x;
            let ydiff = b.pos.y - y;
            let d = Math.sqrt(xdiff * xdiff + ydiff * ydiff);
            let pd = Math.max(d, r + b.radius);

            let accel = (massMul * (b.balance + 10)) / (pd * pd);

            da.x += (accel * xdiff) / pd;
            da.y += (accel * ydiff) / pd;
          }
        }
        return da;
      }

      // CREDIT TO https://github.com/lemmingapex/N-bodyGravitySimulation
      // under MIT license
      function collide(bubbles) {
        for (var j = 0; j < bubbles.length; j++) {
          var p = bubbles[j];
          for (var i = 0; i < bubbles.length; i++) {
            if (i == j) {
              continue;
            }
            var op = bubbles[i];
            // need to normalize these later...
            var xdiff = op.pos.x - p.pos.x;
            var ydiff = op.pos.y - p.pos.y;
            var d = Math.sqrt(xdiff * xdiff + ydiff * ydiff);
            if (d < op.radius + p.radius) {
              // because of the double loop, the code inside this block is one-sided

              // Calculate relative velocity
              var vxdiff = op.v.x - p.v.x;
              var vydiff = op.v.y - p.v.y;

              // Calculate relative velocity in the normal direction
              // deltaV dot N
              var velAlongNormal = vxdiff * (xdiff / d) + vydiff * (ydiff / d);

              // Do not resolve if velocities are separating
              if (velAlongNormal < 0) {
                // restitution, could be per planet
                var e = 0.9;

                // inverse mass is used all over the place...
                var pim = 1.0 / (massMul * (p.balance + 10));
                var opim = 1.0 / (massMul * (op.balance + 10));

                // calculate impulse scalar
                // derived from conservation of momentum and impulse along the collision normal
                // see http://gamedevelopment.tutsplus.com/tutorials/how-to-create-a-custom-2d-physics-engine-the-basics-and-impulse-resolution--gamedev-6331 for details
                var t = (-1.0 * (1.0 + e) * velAlongNormal) / (pim + opim);

                // find impulse
                var impulsex = t * (xdiff / d);
                var impulsey = t * (ydiff / d);

                // find new velocities
                var newpvx = p.v.x - pim * impulsex;
                var newpvy = p.v.y - pim * impulsey;
                p.v.x = newpvx;
                p.v.y = newpvy;

                // positional correction via linear projection due to floating point errors...  Stupid computers
                var penetration = op.radius + p.radius - d;
                var correctionPercentage = 0.25;
                var epsilon = 0.001;
                var correctionx =
                  (Math.max(penetration - epsilon, 0.0) / (pim + opim)) *
                  correctionPercentage *
                  (xdiff / d);
                var correctiony =
                  (Math.max(penetration - epsilon, 0.0) / (pim + opim)) *
                  correctionPercentage *
                  (ydiff / d);
                var newpx = p.pos.x - pim * correctionx;
                p.pos.x = newpx;
                var newpy = p.pos.y - pim * correctiony;
                p.pos.y = newpy;
              }
            }
          }
        }
      }

      function step(bubbles, j, b) {
        var a = nsquaredacceleration(bubbles, j, b.pos.x, b.pos.y, b.radius);
        b.v.x = (1 - f) * b.v.x + a.x * dt;
        b.v.y = (1 - f) * b.v.y + a.y * dt;
        if (b.pos.x - b.radius < 0 || b.pos.x + b.radius > world.clientWidth) {
          b.v.x = -b.v.x;
        } else if (
          b.pos.y - b.radius < 0 ||
          b.pos.y + b.radius > world.clientHeight
        ) {
          b.v.y = -b.v.y;
        }

        b.pos.x += b.v.x * dt;
        b.pos.y += b.v.y * dt;
      }

      for (var i = 0; i < this.bubbles.length; i++) {
        const b = this.bubbles[i];
        step(this.bubbles, i, b);
        collide(this.bubbles);
      }
    },
  },
  watch: {
    id: {
      handler(newVal, oldVal) {
        this.update();
      },
      deep: true,
    },
  },
  mounted() {
    // check that the user is authorised to access this page
    if (!loggedIn()) {
      // if not, send them back to the homepage
      redirect("/");
    }
    this.update();

    setInterval(this.moveBubbles, 16);
  },
};
</script>

<style>
.house-title {
  height: 48px;
  background-color: var(--v-off-lighten1);
}

.fillup {
  width: 100%;
  height: 100%;
}

.non-selectable {
  user-select: none;
}

.no-background-hover::before {
  background-color: transparent !important;
}

.hoverSpin {
  -webkit-animation-name: spin;
  -webkit-animation-duration: 4000ms;
  -webkit-animation-iteration-count: infinite;
  -webkit-animation-timing-function: linear;
  -webkit-animation-play-state: paused;
  -moz-animation-name: spin;
  -moz-animation-duration: 4000ms;
  -moz-animation-iteration-count: infinite;
  -moz-animation-timing-function: linear;
  -moz-animation-play-state: paused;
  -ms-animation-name: spin;
  -ms-animation-duration: 4000ms;
  -ms-animation-iteration-count: infinite;
  -ms-animation-timing-function: linear;
  -ms-animation-play-state: paused;

  animation-name: spin;
  animation-duration: 4000ms;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  animation-play-state: paused;
}
.hoverSpin:hover {
  -webkit-animation-play-state: running;
  -moz-animation-play-state: running;
  -ms-animation-play-state: running;

  animation-play-state: running;
}
@-ms-keyframes spin {
  from {
    -ms-transform: rotate(0deg);
  }
  to {
    -ms-transform: rotate(360deg);
  }
}
@-moz-keyframes spin {
  from {
    -moz-transform: rotate(0deg);
  }
  to {
    -moz-transform: rotate(360deg);
  }
}
@-webkit-keyframes spin {
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
  }
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
