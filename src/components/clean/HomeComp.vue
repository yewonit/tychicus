<template>
  <v-container fill-height fluid>
    <v-row>
      <v-spacer></v-spacer>
      <v-col cols="10" sm="7" md="6" lg="4" xl="4">
        <div class="nm" :style="search_bar_sytle">
          <v-container>
            <v-row>
              <v-col cols="1" sm="1" md="1" lg="1" xl="1">
                <v-icon
                  v-if="$vuetify.breakpoint.lgAndUp"
                  x-large
                  color="rgba(0,52,66,1)"
                  class="ma-7 icon-size-xl"
                  >mdi-graphql</v-icon
                >
                <v-icon
                  v-if="$vuetify.breakpoint.md"
                  size="32"
                  color="rgba(0,52,66,1)"
                  class="ma-8 icon-size-xl"
                  >mdi-graphql</v-icon
                >
                <v-icon
                  v-if="$vuetify.breakpoint.sm"
                  size="32"
                  color="rgba(0,52,66,1)"
                  class="ma-7 icon-size-xl"
                  >mdi-graphql</v-icon
                >
                <v-icon
                  v-if="$vuetify.breakpoint.xs"
                  size="25"
                  color="rgba(0,52,66,1)"
                  class="ma-4 icon-size-xl"
                  >mdi-graphql</v-icon
                >
              </v-col>
              <v-col cols="7" sm="8" md="9" lg="9" xl="9" class="pl-7">
                <v-text-field
                  v-if="$vuetify.breakpoint.mdAndUp"
                  class="mt-6 bg-transparent"
                  label="Search "
                  flat
                  solo
                ></v-text-field>
                <v-text-field
                  v-if="$vuetify.breakpoint.sm"
                  class="ml-3 mt-5 bg-transparent"
                  label="Search "
                  flat
                  solo
                ></v-text-field>
                <v-text-field
                  v-if="$vuetify.breakpoint.xs"
                  class="ml-1 mt-1 bg-transparent"
                  label="Search "
                  style="font-size: 14px"
                  flat
                  solo
                ></v-text-field>
              </v-col>
              <v-col
                cols="3"
                sm="2"
                md="2"
                lg="2"
                xl="2"
                class="text-right pr-0"
              >
                <v-btn
                  v-if="$vuetify.breakpoint.mdAndUp"
                  class="mt-3 pr-10"
                  text
                  fab
                  x-large
                >
                  <v-icon color="#5E5E60" dark> mdi-magnify </v-icon>
                </v-btn>

                <v-btn
                  v-if="$vuetify.breakpoint.sm"
                  class="mt-3 pr-0"
                  text
                  fab
                  x-large
                >
                  <v-icon color="#5E5E60" dark> mdi-magnify </v-icon>
                </v-btn>

                <v-btn v-if="$vuetify.breakpoint.xs" text class="pr-0" fab>
                  <v-icon color="#5E5E60" dark> mdi-magnify </v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </div>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "HomeView",
  data() {
    return {
      search: "",
    };
  },
  computed: {
    // 브래이크포인트에 따른 서치바 높이 조절
    search_bar_sytle() {
      switch (this.$vuetify.breakpoint.name) {
        case "sm":
          return "height: 6.0rem; margin-top: -80px;";
        case "md":
          return "height: 6.0rem; margin-top: -105px;";
        case "lg":
          return "height: 6.0rem; margin-top: -120px;";
        case "xl":
          return "height: 6.3rem; margin-top: -120px;";
        default:
          return "height: 3.5rem; margin-top: -50px;";
      }
    },
  },
  methods: {
    filterOnlyCapsText(value, search) {
      return (
        value != null &&
        search != null &&
        typeof value === "string" &&
        value.toString().toLocaleUpperCase().indexOf(search) !== -1
      );
    },
  },
};
</script>

<style>
.v-text-field input {
  font-size: 1.3em;
  line-height: 1.5em;
}

.v-input .v-label {
  font-size: 1.3em;
  line-height: 1.5em;
}
</style>
