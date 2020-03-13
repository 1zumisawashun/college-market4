<template>
  <div>
    <div class="header">
      <div class="drower-container">
        <div class="humberger-container">
          <div id="humberger" @click="drawer = true">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>

        <!--eslint-disable-->
        <el-drawer :visible.sync="drawer" :direction="direction" size="40%">
          <div class="link-container">
            <p>
              <router-link to="/posts">Home Page</router-link>
            </p>
            <p v-if="isAuthenticated" class="logout" v-on:click="logout">Log Out</p>
            <p class="logout" v-else v-on:click="login">Log In</p>
            <p>
              <router-link :to="`/users/${userId}`" v-if="isAuthenticated">My Page</router-link>
            </p>
            <p>
              <router-link to="/channels" v-if="isAuthenticated">Chat Room</router-link>
            </p>

            <PostForm />
          </div>
        </el-drawer>
      </div>
      <div class="logoname-container">
        <img src="@/assets/logoname.png" class="logoname" />
      </div>
    </div>
    <div class="app-layout">
      <div class="sidebar">
        <div class="logo-container">
          <div class="logo">
            <img src="@/assets/college-market.png" />
          </div>
        </div>

        <div class="link-container">
          <p>
            <router-link to="/posts">Home Page</router-link>
          </p>
          <p v-if="isAuthenticated" class="logout" v-on:click="logout">Log Out</p>
          <p class="logout" v-else v-on:click="login">Log In</p>
          <p>
            <router-link :to="`/users/${userId}`" v-if="isAuthenticated" class="myPage">My Page</router-link>
          </p>
          <p>
            <router-link to="/channels" v-if="isAuthenticated" class="myPage">Chat Room</router-link>
          </p>
          <!-- <p class="logout" @click="openModal" v-if="isAuthenticated">Post</p>
          <transition name="my-modal">
            <div class="my-modal" v-if="modal">
          <div class="form-container">-->
          <PostForm />
          <!-- <el-button @click="addPosts">Post</el-button>
              </div>
              <p @click="closeModal" class="my-modal-close">close</p>
            </div>
          </transition>-->
        </div>
      </div>
      <div class="main-content">
        <router-view :key="$route.fullPath" />
      </div>
    </div>
  </div>
</template>

<script>
import { db, firebase } from "@/firebase";
import { mapActions } from "vuex";
import PostForm from "@/components/PostForm.vue";
export default {
  components: {
    PostForm
  },
  data() {
    return {
      channels: [],
      // title: "",
      // content: "",
      // status: "",
      // college: "",
      // major: "",
      // price: "",
      // cashless: false,
      // cash: false,
      // other: false,
      // onsale: false,
      // soldout: false,
      // file: "",
      // image: "",
      modal: false,
      drawer: false,
      direction: "ltr",
      booktitle: []
    };
  },
  mounted() {
    db.collection("channels")
      .where("title", "==", "test")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          this.channels.push({ id: doc.id, ...doc.data() });
          console.log(doc.data().id);
        });
      });
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setUser(user);
      }
    });
  },

  methods: {
    ...mapActions(["setUser"]),
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.setUser(null);
          window.alert("ログアウトに成功しました");
        })
        .catch(e => {
          window.alert("ログアウトに失敗しました");
          console.log(e);
        });
    },
    login() {
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(result => {
          if (result.user.email.match(/ac.jp/)) {
            db.collection("users").add({
              id: result.user.uid,
              name: result.user.displayName,
              thumbnail: result.user.photoURL,
              email: result.user.email
            });
            const user = result.user;
            console.log(provider);
            this.setUser(user);
            console.log(result); //resultの中にログインuser情報を保持している。多分引数だからresult関係なしに持ってこれる奴や
            console.log(this.$store.state.user);
            console.log(user);
            this.dialogVisible = false;
          } else {
            firebase
              .auth()
              .signOut()
              .then(() => {
                this.setUser(null);
                window.alert("大学ドメインでログインしてください");
              });
          }
        })
        .catch(error => {
          window.alert("error");
          console.log(error);
        });
    }
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
    userId() {
      return this.$store.state.user.uid;
    },
    user() {
      return this.$store.state.user;
    }
  }
};
</script>

<style>
html,
body {
  margin: 0px;
  padding: 0px;
}
.logo-container {
  width: 100%;
  height: auto;
}
.logo {
  width: 70%;
  margin: 0 auto;
}
.logo img {
  width: 100%;
  height: auto;
  border-radius: 15px;
}
.logoname-container {
  display: none;
}
.app-layout {
  display: flex;
}
.sidebar {
  width: 300px;
  background: #4a4141;
  height: auto;
  padding: 20px;
}
.sidebar a {
  color: white;
  padding-top: 4px;
  text-decoration: none;
  cursor: pointer;
}

.main-content {
  width: 100%;
  /* ここを変更 */
  background: #f1f1f1;
  min-height: 100vh;
  height: auto;
}

.logout {
  /* position: absolute;
  bottom: 10px; */
  cursor: pointer;
  color: white;
}
.link-container {
  text-align: center;
}

.postedImage {
  width: 100px;
  height: auto;
}
/* modalの要素 */
.my-modal-enter-active,
.my-modal-leave-active {
  transform: translate(0px, 0px);
  transition: transform 500ms cubic-bezier(0, 0, 0.2, 1) 0ms;
}
.my-modal-enter,
.my-modal-leave-to {
  transform: translateX(100vw) translateX(0px);
}
.my-modal {
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100vw;
  height: 100vh;
}
.my-modal-close {
  position: fixed;
  top: 0;
  right: 20px;
  color: white;
  z-index: 101;
  cursor: pointer;
  font-size: 24px;
}
.form-container {
  width: 80%;
  height: auto;
  margin: 0 auto;
  background-color: white;
  padding: 30px;
  border-radius: 10px;
}
.drower-container {
  display: none;
}

@media screen and (max-width: 479px) {
  .sidebar {
    display: none;
  }

  .drower-container {
    display: block;
    margin-left: 5%;
  }
  .humberger-container {
    width: 15%;
    text-align: center;
    padding-top: 12.5px;
  }
  .logoname {
    padding-top: 13px;
    width: 250px;
    height: 50px;
    object-fit: cover;
  }
  .logoname-container {
    width: 100%;
    height: auto;
    text-align: right;
    display: block;
  }
  .link-container a,
  .link-container p {
    color: #4a4141;
    text-decoration: none;
    text-align: center;
    font-weight: bold;
    font-size: 20px;
  }
  .logout {
    cursor: pointer;
    color: #4a4141;
  }
  .sidebar a {
    color: #4a4141;
    padding-top: 4px;
    text-decoration: none;
    cursor: pointer;
  }
  .header {
    width: 100%;
    height: 50px;
    display: flex;
    background-color: #4a4141;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  }
  .my-modal-close {
    position: fixed;
    top: 15px;
    right: 15px;
    color: white;
    z-index: 101;
    cursor: pointer;
    font-size: 24px;
  }

  /* ドロワーアイコンの要素 */
  #humberger {
    position: relative;
    height: 24px;
    width: 24px;
    display: inline-block;
    box-sizing: border-box;
  }
  #humberger div {
    position: absolute;
    left: 0;
    height: 4px;
    width: 24px;
    background-color: white;
    border-radius: 2px;
    display: inline-block;
    box-sizing: border-box;
  }
  #humberger div:nth-of-type(1) {
    top: 0;
  }
  #humberger div:nth-of-type(2) {
    top: 10px;
  }
  #humberger div:nth-of-type(3) {
    bottom: 0;
  }
}
</style>
