<template>
  <div class="flex flex-row items-center justify-center my-2 p-2 bg-purple-800 rounded-md cursor-pointer w-80" @click="copyUrl">
    <img :src="url" class="w-12 h-12 ounded-md object-contain" />
    <p :href="url" class="ml-2">{{ url }}</p>
  </div>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      default: '',
    },
  },
  methods: {
    copyUrl() {
      navigator.clipboard.writeText(this.url);

      this.$toast.show({
        type: 'success',
        title: 'Copied!',
        message: 'Image URL copied to clipboard!',
        timeout: 5,
      });
    },
  },
};
</script>
