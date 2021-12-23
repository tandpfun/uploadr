export const state = () => ({
  uploaders: {
    imgur: 'i.imgur.com',
  },
  selectedUploader: 'imgur',
});

export const actions = {};

export const mutations = {
  selectUploader(state, uploader) {
    state.selectUploader = uploader;
  },
};
