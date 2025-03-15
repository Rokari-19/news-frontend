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
                <div class="mt-6 flex space-x-4">
                    <button @click="likeNews"
                        class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center">
                        Like: {{ newsItem.likes }}
                    </button>

                    <button @click="dislikeNews"
                        class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 flex items-center">
                        Dislike: {{ newsItem.dislikes }}
                    </button>
                </div>

                <!-- Delete Button -->
                <button @click="confirmDelete" class="mt-6 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
                    Delete News
                </button>
            </div>

            <div v-else class="mt-4 text-red-500">News item not found.</div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div v-if="showDeleteModal" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div class="bg-white p-6 rounded-lg shadow-lg">
                <h2 class="text-lg font-bold">Confirm Deletion</h2>
                <p class="mt-2">Are you sure you want to delete this news item?</p>

                <div class="mt-4 flex space-x-4">
                    <button @click="deleteNews" class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
                        Yes, Delete
                    </button>
                    <button @click="showDeleteModal = false"
                        class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
        <div v-if="newsItem" class="mt-8">
            <h3 class="text-2xl text-gray-300 font-bold">Comments</h3>

            <!-- Comment Form -->
            <form @submit.prevent="submitComment" class="mt-4">
                <textarea v-model="newComment" placeholder="Write your comment..."
                    class="w-full p-2 rounded-md bg-gray-600 text-white"></textarea>
                <button type="submit" class="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                    Submit Comment
                </button>
            </form>

            <!-- Display Comments -->
            <div v-if="comments.length" class="mt-6">
                <div v-for="comment in comments" :key="comment.id" class="bg-gray-600 p-4 rounded-md mt-4">
                    <p class="text-white">{{ comment.comment }}</p>
                    <p class="text-sm text-gray-400 mt-2">Posted on {{ new Date(comment.created_at).toLocaleString() }}
                    </p>
                </div>
            </div>
            <p v-else class="text-gray-400 mt-4">No comments yet.</p>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import { useRoute, useRouter } from "vue-router";

export default {
    data() {
        return {
            newsItem: null,
            loading: true,
            showDeleteModal: false,
            socket: null,
            newComment: '',
            comments: [],
        };
    },
    async created() {
        const route = useRoute();
        const newsId = route.params.id;

        try {
            const [newsResponse, commentsResponse] = await Promise.all([
                axios.get(`/api/v1/news/get/${newsId}/`),
                axios.get(`/api/v1/news/get/${newsId}/comments/`),
            ]);
            this.newsItem = newsResponse.data;
            this.comments = commentsResponse.data.results;
            // console.log(this.comments)
            document.title = this.newsItem.title;
            this.initializeWebSocket(newsId);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            this.loading = false;
        }
    },

    beforeUnmount() {
        if (this.socket) {
            this.socket.close();
        }
    },
    methods: {
        initializeWebSocket(newsId) {
            this.socket = new WebSocket(`ws://localhost:8000/ws/likes_dislikes/${newsId}/`);

            this.socket.onopen = () => {
                console.log('WebSocket connection established.');
            };

            this.socket.onmessage = (event) => {
                const data = JSON.parse(event.data);

                if (data.likes !== undefined) {
                    this.newsItem.likes = data.likes;
                }
                if (data.dislikes !== undefined) {
                    this.newsItem.dislikes = data.dislikes;
                }
                if (data.type === 'comment_added') {
                    this.comments.push(data.comment)
                }
            };

            this.socket.onclose = (event) => {
                console.log('WebSocket connection closed:', event);
            };
        },
        async submitComment() {
            if (!this.newComment.trim()) {
                alert("Comment cannot be empty.");
                return;
            }

            try {
                const response = await axios.post(`/api/v1/comment/${this.newsItem.id}/create/`, {
                    comment: this.newComment,
                    post: this.newsItem.id,
                });

                this.comments.push(response.data);
                this.newComment = '';
            } catch (error) {
                console.error("Error submitting comment:", error);
                alert("Failed to submit comment.");
            }
        },

        async likeNews() {
            try {
                await axios.post(`/api/v1/news/${this.newsItem.id}/like/`).then(response => {
                    // console.log(response.data)

                });

            } catch (error) {
                console.error("Error liking news item:", error);
            }
        },
        async dislikeNews() {
            try {
                await axios.post(`/api/v1/news/${this.newsItem.id}/dislike/`);

            } catch (error) {
                console.error("Error disliking news item:", error);
            }
        },
        confirmDelete() {
            this.showDeleteModal = true;
        },
        async deleteNews() {
            try {
                await axios.delete(`/api/v1/news/get/${this.newsItem.id}/`);
                alert("News item deleted successfully!");
                this.$router.push("/");
            } catch (error) {
                console.error("Error deleting news item:", error);
                alert("Failed to delete news item.");
            }
        },
    },
};
</script>
