<template>
  <div>
    <v-app-bar
      color="deep-purple accent-4"
      dense
      dark
    >
      <v-toolbar-title>
        <router-link to="/">Store Page</router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn to="/" exact>
          <v-icon>mdi-home</v-icon>
          <span class="nav-text">Главная</span>
        </v-btn>
        <v-btn to="/favourites">
          <v-icon>mdi-heart</v-icon>
          <span class="nav-text">Избранное</span>
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>
  </div>
</template>

<script>
  export default {
    name: "Navbar"
  }
</script>

<style scoped>

</style>