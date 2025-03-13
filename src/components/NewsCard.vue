<template>

    <router-link :to="'/news/' + item.id" class="block max-w-sm mx-2 my-2 p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
        
        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {{ item.title }}
        </h5>
        <p class="lead text-white text-lg">Likes: {{ item.likes }}</p>
        <p class="lead text-white text-lg">Dis-Likes: {{ item.dislikes }}</p>
        <p v-for="tag in item.tag" :key="tag.id" class="font-normal text-gray-700 dark:text-gray-400">
            {{ tag.tag_name }}
        </p>
        
    </router-link>

</template>
<script>
export default {
    name: 'NewsCard',
    props: {
        item: Object
    },
}
</script>
