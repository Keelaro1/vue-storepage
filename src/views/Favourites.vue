<template>
  <div class="favourites">
    <v-container>
      <h2 v-if="localStorageLength < 1" align="center">Список избранного пуст</h2>
      <div v-else class="wrapper">
        <h2>Список избранного:</h2>
        <v-row class="store__row">
          <v-col
            lg="4"
            v-for="item in items"
            :key="item.title"
          >
            <v-card
              max-width="350"
              class="store__item-card"
            >
              <v-img
                height="150px"
                contain
                :src="item.url"
              >
              </v-img>
              <v-card-title>{{ item.title }}</v-card-title>
              <v-card-text >
                <p>Цена: {{ item.price }} ₽</p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </div>
</template>

<script>
  export default {
    name: "Favourites",
    data: () => ({
      items: [],
      localStorageLength: 0
    }),
    beforeMount() {
      for(let i = 0; i < localStorage.length; i++) {
        if(localStorage.key(i) === 'loglevel:webpack-dev-server') continue;
        this.localStorageLength++;
        this.items.push(JSON.parse(localStorage.getItem(localStorage.key(i))))
      }
    }
  }
</script>

<style scoped>

</style>