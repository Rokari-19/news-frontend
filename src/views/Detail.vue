<template>
    <div class="min-h-screen bg-gray-100 p-6">
        <div class="max-w-3xl mx-auto bg-gray-700 shadow-md rounded-lg p-6">
            <router-link to="/" class="text-blue-500 hover:underline">&larr; Back to News</router-link>

            <div v-if="loading" class="mt-4 text-gray-500">Loading...</div>

            <div v-else-if="newsItem" class="mt-4">
                <h2 class="text-3xl text-gray-300 font-bold">{{ newsItem.title }}</h2>
                <p class="text-white mt-2">{{ newsItem.content }}</p>

                <p class="mt-4 text-sm text-gray-500">

                    <span v-for="tag in newsItem.tag" :key="tag.id"
                        class="inline-block bg-blue-200 text-blue-800 px-2 py-1 rounded-md text-xs mx-1">
                        {{ tag.tag_name }}
                    </span>
                </p>

                <!-- Like/Dislike Section -->
                <div class="mt-6 flex space-x-4 object-center">
                    <button @click="likeNews"
                        class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-green-600 flex items-center">
                        Like: {{ newsItem.likes }}
                    </button>

                    <button @click="dislikeNews"
                        class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 flex items-center">
                        Dislike: {{ newsItem.dislikes }}
                    </button>
                </div>

            </div>

            <div v-else class="mt-4 text-red-500">News item not found.</div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import { useRoute } from "vue-router";

export default {
    data() {
        return {
            newsItem: null,
            loading: true,
        };
    },
    async created() {
        const route = useRoute();
        const newsId = route.params.id;

        try {
            const response = await axios.get(`/api/v1/news/get/${newsId}/`);
            this.newsItem = response.data;
            document.title = this.newsItem.title
        } catch (error) {
            console.error("Error fetching news item:", error);
        } finally {
            this.loading = false;
        }
    },
    methods: {
        async likeNews() {
            try {
                const response = await axios.post(`/api/v1/news/${this.newsItem.id}/like/`);
                if (response.data && response.data.likes !== undefined) {
                    this.newsItem.likes = response.data.likes;
                    this.newsItem = { ...this.newsItem }; // Force reactivity
                }
            } catch (error) {
                console.error("Error liking news item:", error);
            }
        },
        async dislikeNews() {
            try {
                const response = await axios.post(`/api/v1/news/${this.newsItem.id}/dislike/`);
                if (response.data && response.data.dislikes !== undefined) {
                    this.newsItem.dislikes = response.data.dislikes;
                    this.newsItem = { ...this.newsItem }; // Force reactivity
                }
            } catch (error) {
                console.error("Error disliking news item:", error);
            }
        }
    }


};
</script>