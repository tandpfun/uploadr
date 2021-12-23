<template>
  <div>
    <p class="text-center mt-4">paste or drag any image or <button class="text-purple-500 cursor-pointer" @click="selectorInput.click()">click here</button> to open dialog</p>
    <div class="flex flex-col items-center mt-2">
      <ImageLog v-for="url in imagesUploaded" :key="url" :url="url" />
    </div>
    <transition name="fade">
      <div class="absolute top-0 left-0 w-full h-full z-10 backdrop-filter backdrop-blur-sm flex items-center justify-center flex-col" v-if="uploading">
        <Loading class="w-12 text-white" />
        <h2 class="text-lg font-bold">Uploading</h2>
        <p>press <span class="text-purple-500">esc</span> to cancel</p>
      </div>
      <div v-else-if="showDropzone" class="absolute top-0 left-0 w-full h-full z-10 backdrop-filter backdrop-blur-sm flex items-center justify-center flex-col">
        <h2 class="text-lg font-bold">Drop Images Here</h2>
      </div>
    </transition>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      uploading: false,
      showDropzone: false,
      selectorInput: null,
      cancelTokenSource: null,
      imagesUploaded: [],
    };
  },
  mounted() {
    // Handle pastes
    document.onpaste = (event) => {
      const items = (event.clipboardData || event.originalEvent.clipboardData).items;
      const itemArray = [...items];
      const item = itemArray.find((i) => i.kind === 'file' && i.type.startsWith('image/'));
      if (item) {
        const blob = item.getAsFile();
        this.upload(blob);
      }
    };

    // Handle drag and drop
    let lastTarget = null;
    window.addEventListener('dragover', (event) => {
      event.preventDefault();
    });

    window.addEventListener('dragenter', (event) => {
      lastTarget = event.target;

      this.showDropzone = true;
    });

    window.addEventListener('dragleave', (event) => {
      event.preventDefault();
      if (event.target === lastTarget || event.target === document) {
        this.showDropzone = false;
      }
    });

    window.addEventListener('drop', this.onDrop);

    // Handle file selector
    this.selectorInput = document.createElement('input');
    this.selectorInput.type = 'file';
    this.selectorInput.accept = 'image/*';
    this.selectorInput.onchange = (event) => {
      const itemArray = [...event.target.files];
      console.log(itemArray);
      const item = itemArray.find((i) => i.type.startsWith('image/'));
      if (item) this.upload(item);
    };

    // Handle upload cancels
    window.addEventListener('keyup', (event) => {
      if (event.key === 'Escape') {
        this.cancelTokenSource.cancel('userCancel');
        this.uploading = false;
      }
    });
  },
  methods: {
    async upload(data) {
      this.uploading = true;

      const formData = new FormData();
      formData.append('image', data);

      const selectedUploader = this.$store.state.data.selectedUploader;

      let imageUrl;
      if (selectedUploader === 'imgur') imageUrl = await this.uploadImgur(formData);

      if (imageUrl === true) return (this.uploading = false);

      if (!imageUrl) {
        this.uploading = false;
        return this.$toast.show({
          type: 'danger',
          title: 'Error',
          message: 'Failed to upload image. Check console for details.',
          timeout: 5,
        });
      }

      navigator.clipboard.writeText(imageUrl);

      this.$toast.show({
        type: 'success',
        title: 'Success!',
        message: 'Image URL copied to clipboard!',
        timeout: 5,
      });

      this.imagesUploaded.push(imageUrl);

      this.uploading = false;
    },
    async uploadImgur(formData) {
      this.cancelTokenSource = axios.CancelToken.source();

      const uploadImage = await axios({
        method: 'POST',
        url: 'https://api.imgur.com/3/image',
        headers: {
          Authorization: 'Client-ID 63ed31625cb60f9',
          'Content-Type': 'multipart/form-data',
        },
        cancelToken: this.cancelTokenSource.token,
        data: formData,
      }).catch((err) => (err?.message === 'userCancel' ? true : null));

      if (!uploadImage) return null;
      else if (uploadImage === true) return true;
      else return uploadImage.data.data.link;
    },
    onDrop(event) {
      console.log('a');
      event.preventDefault();
      event.stopPropagation();

      this.showDropzone = false;

      const files = event.dataTransfer.files;

      const itemArray = [...files];
      const item = itemArray.find((i) => i.type.startsWith('image/'));
      if (item) this.upload(item);
    },
  },
};
</script>
