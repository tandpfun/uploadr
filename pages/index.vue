<template>
  <div class="text-white">
    <div class="text-center mt-12 max-w-3xl mx-auto">
      <h1 class="font-semibold text-4xl">Uploadr</h1>
      <p class="text-lg mt-1">Quickly upload images to various CDNs</p>
      <select value="none" class="border border-gray-500 rounded-sm p-1 bg-transparent mt-4" @input="selectUploader">
        <option v-for="uploader in Object.entries($store.state.data.uploaders)" :key="uploader[0]" :value="uploader[1]">
          {{ uploader[1] }}
        </option>
      </select>
      <Uploader ref="uploader" />
    </div>
    <BackgroundEffects />
  </div>
</template>

<script>
export default {
  methods: {
    async selectUploader(event) {
      await this.$store.commit('data/selectUploader', event.target.value);
    },
  },
};
</script>
