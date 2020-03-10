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

        <el-drawer title="college market" :visible.sync="drawer" :direction="direction">
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
            <p class="logout" @click="openModal" v-if="isAuthenticated">Post</p>
            <transition name="my-modal">
              <div class="my-modal" v-if="modal">
                <div class="form-container">
                  <el-input type="text" v-model="title" placeholder="教科書のタイトルを記入してください" />
                  <el-input type="text" v-model="college" placeholder="大学名を記入してください" />
                  <el-input type="text" v-model="major" placeholder="学部名を記入してください" />
                  <el-input type="text" v-model="price" placeholder="値段を記入してください" />
                  <el-checkbox v-model="cashless">キャッシュレス</el-checkbox>
                  <el-checkbox v-model="cash">現金</el-checkbox>
                  <el-checkbox v-model="other">その他</el-checkbox>
                  <el-input type="text" v-model="content" placeholder="教科書の情報を記入してください" />
                  <el-input type="text" v-model="status" placeholder="商品の状態を記入してください" />
                  <el-checkbox v-model="onsale">出品中</el-checkbox>
                  <el-checkbox v-model="soldout">売り切れ</el-checkbox>

                  <div id="image-container">
                    <div v-if="!image">
                      <input type="file" @change="onFileChange" />
                    </div>
                    <div v-else>
                      <img :src="image" class="postedImage" />
                      <el-button @click="removeImage">Remove</el-button>
                    </div>
                  </div>
                  <el-button @click="addPosts">Post</el-button>
                  <p @click="closeModal" class="my-modal-close">close</p>
                </div>
              </div>
            </transition>
          </div>
        </el-drawer>
      </div>
    </div>
    <div class="app-layout">
      <div class="sidebar">
        <div class="logo-container">
          <div class="logo">
            <img src="@/assets/college-market.png" />
          </div>
        </div>
        <!-- 練習用のchatroomです。消さないでね。 -->
        <!--eslint-disable-->
        <!-- <p v-for="(channel, index) in channels" :key="index">
          <router-link :to="`/channels/${channel.id}`">
            {{
            channel.name
            }}
          </router-link>
        </p>
        <hr />-->
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
          <p class="logout" @click="openModal" v-if="isAuthenticated">Post</p>
          <transition name="my-modal">
            <div class="my-modal" v-if="modal">
              <div class="form-container">
                <el-input type="text" v-model="title" placeholder="教科書のタイトルを記入してください" />
                <el-input type="text" v-model="college" placeholder="大学名を記入してください" />
                <el-input type="text" v-model="major" placeholder="学部名を記入してください" />
                <el-input type="text" v-model="price" placeholder="値段を記入してください" />
                <el-checkbox v-model="cashless">キャッシュレス</el-checkbox>
                <el-checkbox v-model="cash">現金</el-checkbox>
                <el-checkbox v-model="other">その他</el-checkbox>
                <el-input type="text" v-model="content" placeholder="教科書の情報を記入してください" />
                <el-input type="text" v-model="status" placeholder="商品の状態を記入してください" />
                <el-checkbox v-model="onsale">出品中</el-checkbox>
                <el-checkbox v-model="soldout">売り切れ</el-checkbox>

                <div id="image-container">
                  <div v-if="!image">
                    <input type="file" @change="onFileChange" />
                  </div>
                  <div v-else>
                    <img :src="image" class="postedImage" />
                    <el-button @click="removeImage">Remove</el-button>
                  </div>
                </div>
                <el-button @click="addPosts">Post</el-button>
                <p @click="closeModal" class="my-modal-close">close</p>
              </div>
            </div>
          </transition>
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
export default {
  data() {
    return {
      channels: [],
      title: "",
      content: "",
      status: "",
      college: "",
      major: "",
      price: "",
      cashless: false,
      cash: false,
      other: false,
      onsale: false,
      soldout: false,
      file: "",
      image: "",
      modal: false,
      drawer: false,
      direction: "ltr"
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
        })
        .catch(error => {
          window.alert(error);
        });
    },

    openModal() {
      this.modal = true;
    },
    closeModal() {
      this.modal = false;
    },
    onFileChange: function(event) {
      var files = event.target.files || event.dataTransfer.files;
      if (!files.length) {
        return;
      }
      this.createImage(files[0]);
    },
    createImage(file) {
      /*eslint-disable*/
      var image = new Image();
      var reader = new FileReader();
      var vm = this;
      reader.onload = function(event) {
        vm.image = event.target.result;
        //これもthis.imageだよ！
        console.log(vm.image);
      };
      reader.readAsDataURL(file);
      console.log(file);
      console.log(vm.image);
      this.file = file;
    },
    removeImage: function() {
      this.image = "";
    },
    addPosts() {
      let storageRef = firebase
        .storage()
        .ref(`posts/${this.user.displayName}/` + this.file.name);
      storageRef.put(this.file).then(() => {
        let storageRef = firebase
          .storage()
          .ref(`posts/${this.user.displayName}/` + this.file.name);
        storageRef.getDownloadURL().then(url => {
          //getDownloadURLメソッドでstorageから取得している;
          console.log(url);
          console.log(this.image);
          this.url = url;
          //このurlはfirebaseからの画像情報になる;
          window.alert("storageに格納しました");
          db.collection("posts").add({
            title: this.title,
            content: this.content,
            status: this.status,
            college: this.college,
            major: this.major,
            price: this.price,
            cashless: this.cashless,
            cash: this.cash,
            other: this.other,
            onsale: this.onsale,
            soldout: this.soldout,
            image: this.url,
            createdAt: new Date().getTime(),
            user: {
              id: this.user.uid,
              name: this.user.displayName,
              thumbnail: this.user.photoURL
            }
          });
        });
        console.log(this.url);
        window.alert("firestoreに格納しました。これで表示されます");
      });
      this.image = null;
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

.app-layout {
  display: flex;
}
.sidebar {
  width: 300px;
  background: #4a4141;
  height: 200vh;
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
  height: 200vh;
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
  color: #fff;
  z-index: 101;
  cursor: pointer;
  font-size: 24px;
}
.form-container {
  width: 80%;
  height: auto;
  margin: 0 auto;
  background-color: white;
  padding: 50px;
  border-radius: 30px;
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
  }
  .link-container {
    color: #4a4141;
    text-decoration: none;
    text-align: center;
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
    background-color: #4a4141;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
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
  .humberger-container {
    width: 15%;
    text-align: center;
    padding-top: 12.5px;
  }
}
</style>
