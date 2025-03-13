<template>
    <div class="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
      <div class="max-w-3xl w-full bg-white shadow-md rounded-lg p-6">
        <h2 class="text-2xl font-bold mb-4">Create a News Post</h2>
  
        <form @submit.prevent="createNews">
          <!-- Title Input -->
          <label class="block mb-2 font-medium">Title:</label>
          <input v-model="title" type="text" required class="w-full px-4 py-2 border rounded-md mb-4" />
  
          <!-- Content Input -->
          <label class="block mb-2 font-medium">Content:</label>
          <textarea v-model="content" required class="w-full px-4 py-2 border rounded-md mb-4"></textarea>
  
          <!-- Tags Selection -->
          <label class="block mb-2 font-medium">Tags:</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="tag in availableTags"
              :key="tag.tag_name"
              @click.prevent="toggleTag(tag.tag_name)"
              :class="{
                'bg-blue-500 text-white': selectedTags.includes(tag.tag_name),
                'bg-gray-200 text-gray-700': !selectedTags.includes(tag.tag_name)
              }"
              class="px-3 py-1 rounded-md"
            >
              {{ tag.tag_name }}
            </button>
          </div>
  
          <!-- Submit Button -->
          <button type="submit" class="mt-4 w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
            Post
          </button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        title: "",
        content: "",
        availableTags: [],
        selectedTags: []
      };
    },
    async created() {
      await this.fetchTags();
    },
    methods: {
      async fetchTags() {
        try {
          const response = await axios.get("/api/v1/tag/get/");
          this.availableTags = response.data.results;
        } catch (error) {
          console.error("Error fetching tags:", error);
        }
      },
      toggleTag(tagName) {
        if (this.selectedTags.includes(tagName)) {
          this.selectedTags = this.selectedTags.filter(tag => tag !== tagName);
        } else {
          this.selectedTags.push(tagName);
        }
      },
      async createNews() {
        try {
          const response = await axios.post("/api/v1/news/create/", {
            title: this.title,
            content: this.content,
            tag: this.selectedTags
          });
  
          alert("News item created successfully!");
          this.title = "";
          this.content = "";
          this.selectedTags = [];
        } catch (error) {
          console.error("Error creating news item:", error);
          alert("Failed to create news item.");
        }
      }
    }
  };
  </script>
  