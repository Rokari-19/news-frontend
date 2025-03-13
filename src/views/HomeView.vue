<template>
  <section>
    <h1 class="text-2xl font-semibold"> Your News, All in one Place</h1>
  </section>
  <div class="grid md:grid-cols-4 grid-cols-none gap-0">
    <NewsCard v-for="item in newsItems" v-bind:key="item.id" v-bind:item="item" />
  </div>

</template>

<script>
import axios from 'axios';
import NewsCard from '@/components/NewsCard.vue';

export default {
  name: 'HomeView',
  data() {
    return {
      newsItems: [],
      currentPage: 1,
      isLoading: false, 
    };
  },
  components: {
    NewsCard,
  },
  mounted() {
    document.title = 'Home | News App';
    this.getNewsItem();
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    getNewsItem() {
      if (this.isLoading) return;
      this.isLoading = true;
      axios
        .get(`api/v1/news/get/?page=${this.currentPage}`)
        .then(response => {
          this.newsItems = [...this.newsItems, ...response.data.results];
          this.currentPage += 1;
          // console.log(this.newsItems)
        })
        .catch(error => {
          console.error(error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    handleScroll() {
      const bottomOfWindow =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight;
      if (bottomOfWindow) {
        // console.log(bottomOfWindow)
        // console.log(this.currentPage)
        this.getNewsItem();
      }
    },
  },
};
</script>
