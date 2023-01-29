<template>
  <v-app>
    <v-app-bar app flat color="off" absolute height="80px">
      <v-container fluid>
        <v-row justify="center" align="center" class="navbar content">
          <v-img
            src="./assets/logo.svg"
            max-width="30"
            position="bottom left"
            class="ma-2"
          >
          </v-img>
          <v-toolbar-title class="app-name font-weight-black"
            >iou</v-toolbar-title
          >

          <div class="mx-5"></div>

          <v-hover v-slot="{ hover }">
            <div
              @click="scrollTo('faq')"
              class="nav"
              :class="{ 'nav-hover': hover }"
            >
              FAQ
            </div>
          </v-hover>
          <div class="mx-5"></div>
          <v-hover v-slot="{ hover }">
            <div
              @click="scrollTo('about-us')"
              class="nav"
              :class="{ 'nav-hover': hover }"
            >
              About us
            </div>
          </v-hover>

          <v-spacer></v-spacer>

          <div v-if="!logged_in">
            <v-dialog transition="fade-transition" max-width="600px">
              <template v-slot:activator="{ on, attrs }">
                <v-hover v-slot="{ hover }">
                  <div
                    class="nav"
                    :class="{ 'nav-hover': hover }"
                    v-on="on"
                    v-bind="attrs"
                  >
                    Sign in
                  </div>
                </v-hover>
              </template>
              <login />
            </v-dialog>
          </div>
          <div v-else>
            <v-hover v-slot="{ hover }">
              <div
                @click="$router.push('/dashboard')"
                class="nav"
                :class="{ 'nav-hover': hover }"
              >
                Open dash
              </div>
            </v-hover>
          </div>

          <div class="mx-1"></div>

          <dark-mode-button></dark-mode-button>
        </v-row>
      </v-container>
    </v-app-bar>

    <v-main>
      <div class="content" id="heading">
        <div class="slogan my-4 mt-16">
          <v-row justify="center" no-gutters>
            <v-col>
              <h1 class="slogan-text">Making money</h1>
            </v-col>
            <v-col>
              <ul class="slogan-list">
                <li class="slogan-list-text">
                  <h1 class="blue--text">manageable</h1>
                </li>
                <li class="slogan-list-text">
                  <h1 class="purple--text">agreeable</h1>
                </li>
                <li class="slogan-list-text">
                  <h1 class="yellow--text">predictable</h1>
                </li>
              </ul>
            </v-col>
          </v-row>
        </div>

        <div class="text-center">
          <p>Keep track of your finances anywhere.</p>
          <v-btn
            v-if="!logged_in"
            x-large
            depressed
            color="secondary"
            @click="$router.push('/register')"
            >Try For Free</v-btn
          >
          <v-btn
            v-else
            x-large
            depressed
            color="secondary"
            @click="$router.push('/dashboard')"
            >Open Dashboard</v-btn
          >
        </div>
        <div class="py-16"></div>
      </div>
      <div class="zigzag" id="main-content">
        <div class="py-10"></div>
        <div class="content">
          <h2>For all kinds of people</h2>
          <p class="my-4 small-paragraph">
            Whoever you are, you can be sure that you and your friends' finances
            are managed properly.
          </p>

          <div class="feature-list">
            <v-row>
              <v-col v-for="(card, i) in top_row" cols="3" :key="i">
                <feature-card :title="card.title" :icon="card.icon">
                  {{ card.content }}
                </feature-card>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3">
                <feature-card title="Travellers" icon="mdi-airplane-takeoff">
                  Organising trips with a group of people is usually a hassle.
                  From booking flights and the accommodation, don't let things
                  get needlessly complicated.
                </feature-card>
              </v-col>
              <v-col cols="6">
                <v-row>
                  <v-col cols="6">
                    <feature-card
                      title="Friends"
                      icon="mdi-hand-wave-outline"
                      small
                    ></feature-card>
                    <div style="padding-top: 25px"></div>
                    <feature-card
                      title="Eat-Outers"
                      icon="mdi-silverware-fork-knife"
                      small
                    ></feature-card>
                  </v-col>
                  <v-col cols="6">
                    <feature-card
                      title="Gifters"
                      icon="mdi-gift-outline"
                      small
                    ></feature-card>
                    <div style="padding-top: 25px"></div>
                    <feature-card
                      title="Savers"
                      icon="mdi-finance"
                      small
                    ></feature-card>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </div>
        </div>
        <div class="py-10"></div>
      </div>

      <div class="content" id="faq">
        <div class="py-10"></div>
        <div>
          <h1 class="text-center">Frequently asked questions</h1>
          <div class="my-12"></div>

          <v-divider></v-divider>
          <div v-for="(faq, i) in faqs" :key="i">
            <question :title="faq.question">{{ faq.answer }}</question>
            <v-divider></v-divider>
          </div>
          <v-divider></v-divider>
        </div>
        <div class="py-10"></div>
      </div>

      <div class="content" id="about-us">
        <div class="py-10"></div>
        <div class="text-center">
          <h1>About us</h1>
          <div class="py-4"></div>
          <center>
            <p>
              We are a small group of 1<sup>st</sup> Year students studing at
              <a href="https://www.manchester.ac.uk/"
                >The University of Manchester</a
              >.
            </p>
            <p class="small-paragraph">
              Being new to managing our own money, we collectively decided to
              create something that could help us all out!
            </p>
            <p class="small-paragraph">
              <strong>iou</strong> attemps to solve all of our personal
              financial woes, and we hope it will help you too!
            </p>
          </center>
        </div>
        <div class="py-10"></div>
      </div>

      <!-- made with love -->
      <div class="content text-center" id="mwl">
        <p style="user-select: none">
          Made with
          <v-icon style="color: var(--v-red-base)">mdi-heart</v-icon> by x19
        </p>
      </div>
    </v-main>
  </v-app>
</template>

<script>
module.exports = {
  components: {
    Login: httpVueLoader("/Login.vue"),
    DarkModeButton: httpVueLoader("/DarkModeButton.vue"),
    FeatureCard: httpVueLoader("/Homepage/FeatureCard.vue"),
    Question: httpVueLoader("/Homepage/Question.vue"),
  },
  data() {
    return {
      logged_in: false,
      top_row: [
        {
          title: "Students",
          icon: "mdi-school-outline",
          content:
            "Looking after money is hard with no experience. Allow your mind to focus on other things, like studies, instead.",
        },
        {
          title: "Partners",
          icon: "mdi-cards-heart-outline",
          content:
            "Sharing (almost) everything can be daunting at times, lighten then load for both of you a little.",
        },
        {
          title: "Housemates",
          icon: "mdi-home-outline",
          content:
            "Houses can get busy when sharing one with 8 people. Simplify your housing experience, offload the money sharing troubles.",
        },
      ],
      faqs: [
        {
          question: "Why should I use iou?",
          answer:
            "Great question! If you find managing your spending with others hard, or simply want a nice interface to casually keep track of who owes what, this is for you.",
        },
        {
          question: "Does iou use my actual money?",
          answer:
            "No, we don't deal with real money. Instead you can simplify the large list of transactions between you and your friends into only a couple. Making sure everyone is evened up asap.",
        },
      ],
    };
  },
  methods: {
    scrollTo(id) {
      document.getElementById(id).scrollIntoView({ behavior: "smooth" });
    },
  },
  mounted() {
    this.applyTheme();
    this.logged_in = loggedIn();
    console.log(`          __
     w  c(..)o
      \\__(-)
          /\\
         /(_)__
the      w /|  )
x19       | \\ (__
monke    m  m`);
  },
};
</script>

<style scoped>
.navbar {
  position: relative;
  box-sizing: border-box;
}

.v-main {
  background-color: var(--v-off-base);
  font-size: 1.2rem;
}

.content {
  margin: auto;
  padding-left: 4rem;
  padding-right: 4rem;
}

@media screen and (min-width: 81rem) {
  .content {
    max-width: 85rem;
    padding: 0px;
  }
}

@media screen and (min-width: 48rem) {
  .content {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}

.zigzag {
  background-color: var(--v-off-darken1);
}

/* special case zigzag, make lighter to "pop" out */
.theme--dark .zigzag {
  background-color: var(--v-off-lighten1);
}

.nav-hover {
  cursor: pointer;
  text-decoration: underline;
}

.app-name {
  user-select: none;
  font-size: 1.75rem;
}

.slogan {
  user-select: none;
  font-size: 2em;
  overflow: hidden;
  height: 3em;
}

.slogan-text {
  text-align: right;
  margin: 0;
}

.slogan-list {
  margin-top: 0;
  text-align: left;
  list-style: none;

  animation-name: change;
  animation-duration: 12s;
  animation-iteration-count: infinite;
  animation-timing-function: cubic-bezier(0.54, 0, 0.14, 0.99);
}

.slogan-list-text {
  margin: 0;
}

.small-paragraph {
  inline-size: 35rem;
  overflow-wrap: break-word;
}

.v-application a {
  text-decoration: none;
  color: var(--v-secondary-base);
}

.v-application a:hover {
  text-decoration: underline;
  color: var(--v-secondary-base);
}

@keyframes change {
  8%,
  92% {
    transform: translate3d(0, 0, 0);
  }
  24%,
  71% {
    transform: translate3d(0, -33.3333%, 0);
  }
  49%,
  51% {
    transform: translate3d(0, -66.6666%, 0);
  }
}
</style>
