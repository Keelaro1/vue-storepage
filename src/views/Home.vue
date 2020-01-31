<template>
  <div class="shop-items">
    <div class="loader" v-if="loading">
      <v-progress-circular
        indeterminate
        color="primary"
        :size="50"
      ></v-progress-circular>
    </div>
    <v-app v-else>
      <v-container>
        <v-row>
          <v-col
            cols="6"
            offset="3"
          >
            <v-text-field
              label="Поиск товара"
              v-model="inputText"
              append-icon="mdi-magnify"
              spellcheck="false"
              @keyup.enter="filterItems"
            >
            </v-text-field>
          </v-col>
          <v-col>
            <div class="showIcons">
              Отображать:
              <v-icon
                class="showIcon"
                @click="showAll"
              >
                mdi-view-list
              </v-icon>
              /
              <v-icon
                class="showIcon"
                @click="showPagination"
              >
                mdi-clipboard-list-outline
              </v-icon>
              <div class="price">
                Сортировать по цене: <br>
                <a class="priceSort" @click="increasingPrice">По возрастанию</a>
                /
                <a class="priceSort" @click="decreasingPrice">По убыванию</a>
              </div>
            </div>
          </v-col>
        </v-row>
        <v-row class="store__row">
          <v-col
            lg="4"
            v-for="item in paginatedData"
            :key="item.title"
          >
            <v-card
              max-width="350"
              class="store__item-card"
            >
              <v-img
                height="150px"
                tag="v-img"
                contain
                :src="item.imgurl"
              >
                <v-icon
                  right
                  class="items__icon-favourite"
                  :class = "item.isFavourited ? 'favourited' : ''"
                  @click="addToFavourite(item.title, item.isFavourited, item.imgurl, item.price)"
                >
                  mdi-heart
                </v-icon>
              </v-img>
              <v-snackbar
                v-model="snackbar"
                :timeout = 1000
              >
                Добавлено в избранное
              </v-snackbar>
              <v-card-title>{{ item.title }}</v-card-title>
              <v-card-text >
                <p>Цена: {{ item.price }} ₽</p>
                <p>
                  <router-link :to="`details/${item.title}`">Страница с описанием товара</router-link>
                </p>
              </v-card-text>
              <v-card-actions class="card__actions">
                <v-btn
                  text
                  @click="addToCart(item)"
                >
                  Добавить в корзину
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <v-btn
        dark
        big
        fixed
        bottom
        right
        fab
        @click="showCart = !showCart"
      >
        <v-icon>mdi-cart</v-icon>
        <div
          class="red--text cart__btn-counter"
          v-if="this.cart.length > 0"
        >
          {{ this.cart.length }}
        </div>
      </v-btn>
      <v-dialog
        v-model="dialog"
        width="500"
      >
        <v-card>
          <v-card-title
            class="headline lighten-2"
            primary-title
          >
            Заказ отправлен
          </v-card-title>
          <v-card-text>
            Заказ {{ counter }} товаров на сумму {{ cartPrice }} ₽ успешно отправлен
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              text
              @click="dialog = false"
            >
              Выход
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <div
        v-show="showCart"
        class="cart-block"
      >
        <v-container>
          <v-row>
            <v-col v-if="cartPrice > 0">
              <h1 class="cart__title">Корзина</h1>
              <v-list
                v-for="(item, i) of cart"
                :key="i"
              >
                <v-list-item class="cart__item">{{ item.title }},
                  <br> Общая сумма за товар: {{ item.price }} ₽
                  <br> Количество: {{ item.count }}
                  <br>
                  <v-icon @click="subItem(item)">mdi-minus-circle-outline</v-icon>
                  <v-icon @click="addItem(item)">mdi-plus-circle-outline</v-icon>
                  <v-icon @click="removeItem(item)">mdi-delete</v-icon>
                </v-list-item>
              </v-list>
              <p class="cart__quantity">Общее количество: {{ counter }}</p>
              <p class="cart__price">Общая стоимость: {{ this.cartPrice }} ₽</p>
              <v-btn @click="sendOrder()" v-if="cartPrice > 0" class="cart__order">Оформить заказ</v-btn>
            </v-col>
            <v-col v-else>
              Пока ничего не добавлено
            </v-col>
          </v-row>
        </v-container>
      </div>
      <v-pagination
        v-model="pageNumber"
        :length="pageCount"
        class="app__pagination"
        v-if="showPagi"
      ></v-pagination>
    </v-app>
  </div>
</template>

<script>
  import items from '../assets/Items'

  export default {
    name: "HomeItems",
    data: () => ({
      showCart: false,
      items: items,
      favourites: [],
      cart: [],
      cartPrice: 0,
      inputText: '',
      counter: 0,
      dialog: false,
      pageNumber: 1,
      pageSize: 6,
      snackbar: false,
      loading: true,
      showPagi: true
    }),
    computed: {
      pageCount(){
        const itemsLength = this.items.length;
        const pageSize = this.pageSize;
        return Math.ceil(itemsLength / pageSize);
      },
      paginatedData(){
        const start = (this.pageNumber - 1) * this.pageSize;
        const end = start + this.pageSize;
        return this.items.slice(start, end);
      }
    },
    beforeMount() {
      this.items.forEach(item => {
        for(let i = 0; i < localStorage.length; i++) {
          if(localStorage.key(i) === item.title) {
            item.isFavourited = true
          }
        }
      });
      setTimeout(() => this.loading = false, 700)
    },
    methods: {
      pagePrep() {
        this.pageNumber = 1;
        this.loading = true;
        setTimeout(() => this.loading = false, 300);
      },
      showAll() {
        this.pagePrep();
        this.pageSize = this.items.length;
        this.showPagi = false;
      },
      showPagination() {
        this.pagePrep();
        this.pageSize = 6;
        this.showPagi = true;
      },
      increasingPrice() {
        this.items = this.items.sort((a,b) => a.price - b.price);
        this.pagePrep();
      },
      decreasingPrice() {
        this.items = this.items.sort((a,b) => b.price - a.price);
        this.pagePrep();
      },
      addToCart(value) {
        this.counter++;
        let target = this.items.find(item => item.title === value.title);
        let item = {title: target.title, price: target.price, count: target.count};
        for (let i = 0; i < this.cart.length; i++) {
          if (target.title === this.cart[i].title) {
            this.cart[i].count++;
            this.cart[i].price += target.price;
            this.cartPrice += target.price;
            return
          }
        }
        item.count++;
        this.cartPrice += item.price;
        this.cart.push(item)
      },
      addItem(value) {
        let target = this.items.find(item => item.title === value.title);
        for (let i = 0; i < this.cart.length; i++) {
          if(target.title === this.cart[i].title) {
            this.cart[i].count++;
            this.cart[i].price += target.price;
            this.cartPrice += target.price;
            this.counter += 1;
          }
        }
      },
      subItem(value) {
        let target = this.items.find(item => item.title === value.title);
        for (let i = 0; i < this.cart.length; i++) {
          if(target.title === this.cart[i].title) {
            this.counter -= 1;
            this.cart[i].price -= target.price;
            this.cartPrice -= target.price;
            this.cart[i].count--;
            if(this.cart[i].count === 0) {
              this.removeItem(this.cart[i]);
              return
            }
          }
        }
      },
      removeItem(value) {
        let target = this.items.find(item => item.title === value.title);
        for (let i = 0; i < this.cart.length; i++) {
          if(target.title === this.cart[i].title) {
            this.cartPrice -= target.price * this.cart[i].count;
            this.counter -= this.cart[i].count;
            this.cart.splice(i, 1);
          }
        }
      },
      addToFavourite(title, isFav, url, price) {
        let target = this.items.find(item => item.title === title);
        target.isFavourited = !target.isFavourited;
        if(target.isFavourited) {
          this.favourites.push(title);
          localStorage.setItem(title, JSON.stringify({title, isFav, url, price}));
          this.snackbar = true;
        } else {
          for(let i = 0; i < localStorage.length; i++) {
            if(localStorage.key(i) === title) {
              localStorage.removeItem(title);
              return false;
            }
          }
        }
      },

      filterItems() {
        this.items = items;
        this.items = this.items.filter((item) => {
          return item.title.toLowerCase().includes(this.inputText.toLowerCase())
        });
      },
      sendOrder() {
        this.dialog = true;
      }
    }
  }
</script>

<style scoped>
  .favourited {
    color: orange;
  }
</style>
