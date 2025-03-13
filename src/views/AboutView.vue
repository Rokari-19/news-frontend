<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 class="text-2xl font-bold mb-4">Search News</h2>


      <div class="flex items-center space-x-2">
        <input type="text" v-model="searchQuery" placeholder="Search news..."
          class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          @keyup.enter="fetchNews" />
        <button @click="fetchNews" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          Search
        </button>
      </div>


      <div v-if="newsItems.length > 0" class="mt-6">
        <h3 class="text-xl font-semibold mb-2">Results:</h3>
        <div v-for="news in newsItems" :key="news.id" class="bg-gray-50 p-4 mb-3 rounded-lg shadow-sm">
          <h4 class="text-lg font-bold">{{ news.title }}</h4>
          <p class="text-gray-700">{{ news.content }}</p>
          <p class="mt-2 text-sm text-gray-500">

            <span v-for="tag in news.tag" :key="tag.id"
              class="inline-block bg-blue-200 text-blue-800 px-2 py-1 rounded-md text-xs mx-1">
              {{ tag.tag_name }}
            </span>
          </p>
          <router-link :to="'/news/' + news.id" class="text-blue-500 hover:underline">
            Read More
          </router-link>
        </div>
      </div>


      <div v-else-if="searchQuery && !loading" class="mt-6 text-gray-500">
        No news items found.
      </div>


      <div v-if="loading" class="mt-6 text-blue-500">
        Loading...
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      searchQuery: "",
      newsItems: [],
      loading: false,
    };
  },
  mounted() {
    document.title = 'Search'
  },
  methods: {
    async fetchNews() {
      if (!this.searchQuery) return;

      this.loading = true;
      try {
        const response = await axios.get(`api/v1/news/search/?search=${this.searchQuery}`);
        this.newsItems = response.data.results;
        console.log(this.newsItems)
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
