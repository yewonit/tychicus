<template>
  <div>
    <router-view />
    <update-notification />
  </div>
</template>

<script>
import UpdateNotification from "./components/UpdateNotification.vue";

export default {
  name: "App",
  components: {
    UpdateNotification,
  },
  data: () => ({
    //
  }),
  methods: {
    testFunction: () => {},
  },
};
</script>
