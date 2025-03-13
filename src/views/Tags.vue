<template>
    <div class="min-h-screen bg-gray-100 p-6">
      <div class="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 class="text-2xl font-bold mb-4">Tags</h2>
  
        <!-- Search Input -->
        <input
          v-model="searchQuery"
          @input="searchTags"
          placeholder="Search for a tag..."
          class="w-full px-4 py-2 border rounded-md"
        />
  
        <!-- Display Tags -->
        <div class="mt-4 flex flex-wrap gap-2">
          <button
            v-for="tag in displayedTags"
            :key="tag.id"
            @click="filterByTag(tag.tag_name)"
            class="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            {{ tag.tag_name }}
          </button>
        </div>
  
        <!-- Display Filtered News -->
        <div v-if="newsItems.length" class="mt-6">
          <h3 class="text-xl font-semibold">Related to {{ selectedTag }}</h3>
          <div
            v-for="news in newsItems"
            :key="news.id"
            class="p-4 mt-2 border rounded-md shadow-sm bg-gray-50"
          >
            <h4 class="text-lg font-bold">{{ news.title }}</h4>
            <p class="text-gray-600">{{ news.content.substring(0, 100) }}...</p>
            <router-link :to="'/news/' + news.id" class="text-blue-500 hover:underline">
              Read More
            </router-link>
          </div>
        </div>
  
        <div v-else-if="selectedTag" class="mt-6 text-gray-500">
          No news found for "{{ selectedTag }}"
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        tags: [],
        displayedTags: [],
        searchQuery: "",
        newsItems: [],
        selectedTag: null,
      };
    },
    async created() {
      await this.fetchTags();
    },
    methods: {
      async fetchTags() {
        try {
          const response = await axios.get("/api/v1/tag/get/");
          this.tags = response.data;
          this.displayedTags = response.data.results; // Show all tags initially
        } catch (error) {
          console.error("Error fetching tags:", error);
        }
      },
      async searchTags() {
        if (this.searchQuery.trim() === "") {
          this.displayedTags = this.tags; // Reset to all tags if search is empty
          return;
        }
  
        try {
          const response = await axios.get(`/api/v1/tag/search/?search=${this.searchQuery}`);
          this.displayedTags = response.data.results; // Show search results
        } catch (error) {
          console.error("Error searching tags:", error);
        }
      },
      async filterByTag(tagName) {
        this.selectedTag = tagName;
        this.newsItems = [];
  
        try {
          const response = await axios.get(`/api/v1/news/get/?tag=${tagName}`);
          this.newsItems = response.data.results;
        } catch (error) {
          console.error("Error fetching news for tag:", error);
        }
      },
    },
  };
  </script>
  