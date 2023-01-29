<template>
  <a
    @mousedown="mDown"
    @mouseup="mUp"
    @mouseenter="mEnter"
    @mouseleave="mLeave"
    @mousemove="mMove"
  >
    <circle
      v-if="visible"
      :r="radius"
      :fill="this.color"
      :cx="this.position.x"
      :cy="this.position.y"
      :stroke="accent"
      stroke-width="2"
    ></circle>
    <text
      v-if="visible"
      class="bubble-text"
      text-anchor="middle"
      :fill="accent"
      :font-size="radius / 70 + 'em'"
      :transform="transform"
    >
      <slot></slot>
    </text>
  </a>
</template>

<script>
module.exports = {
  name: "bubble",
  props: ["pId", "position", "balance", "color", "visible"],
  data() {
    return {
      clicks: 0,
      moveable: false,
      down: false,
    };
  },
  methods: {
    mDown(e) {
      this.down = true;
      this.clicks += 1;
      if (this.clicks > 1) {
        // double clicked!
        this.moveable = false;
        this.$emit("clicked", {});
      }
    },
    mUp(e) {
      this.down = false;
      setTimeout(() => {
        this.clicks = 0;
      }, 333);
    },
    mEnter(e) {
      this.moveable = true;
    },
    mLeave(e) {
      this.moveable = false;
      this.down = false;
      this.clicks = 0;
      document.body.style.cursor = "default";
    },
    mMove(e) {
      e.preventDefault();
      if (this.moveable && this.down) {
        this.position.x += e.movementX;
        this.position.y += e.movementY;
        this.$emit("update:position", this.position);
      }
    },
  },
  computed: {
    radius: function () {
      const x = Math.abs(this.balance);
      return Math.min(17 * Math.pow(x, 0.493518) + 50, 200);
    },
    transform: function () {
      return "translate(" + this.position.x + "," + this.position.y + ")";
    },
    accent: function () {
      if (this.$vuetify.theme.dark) {
        return "white";
      } else {
        return "black";
      }
    },
  },
};
</script>

<style scoped>
.bubble-text {
  user-select: none;
  overflow: hidden;
}

a {
  cursor: grab;
}
</style>
