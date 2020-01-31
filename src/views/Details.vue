<template>
  <div>
    <v-container>
      <v-row>
        <v-col
            cols="3">
          <v-card
            max-width="350"
            class="store__item-card"
          >
            <v-img
              height="150px"
              tag="v-img"
              contain
              :src="route.imgurl"
            >
            </v-img>
            <v-card-title>{{ route.title }}</v-card-title>
            <v-card-text >
              <p>Цена: {{ route.price }} ₽</p>
              <p>
                <router-link :to="`details/${route.title}`">Страница с описанием товара</router-link>
              </p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
  import items from '../assets/Items'

  export default {
    name: "Details",
    data: () => ({
      items: items,
    }),
    computed: {
      route() {
        const path = this.$route.path.split("/")[2];
        const target = this.items.find(item => item.title === path);
        return target
      }
    }
  }
</script>


<style scoped>

</style>