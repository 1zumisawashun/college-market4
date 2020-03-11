import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    messages: [
      {
        title: null,
        college: null
      }
    ]
  },
  getters: {
    isAuthenticated(state) {
      return !!state.user;
    },
    getStateMessege: state => state.messages
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
    mutateMessege(state, payload) {
      state.messages = payload;
    }
    // addFavorite(state, payload) {
    //   state.item = payload;
    //   console.log(payload);
    // }
  },
  actions: {
    setUser(context, user) {
      context.commit("setUser", user);
    },
    commitMessege(store, payload) {
      return store.commit("mutateMessege", payload);
    }
  }
});
