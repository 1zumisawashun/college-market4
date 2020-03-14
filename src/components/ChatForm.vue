<template>
  <div class="input-container">
    <!--eslint-disable-->
    <el-input type="textarea" v-model="text" v-on:keydown.enter="addMessage" />
    <div class="label-container">
      <div id="image-container">
        <div v-if="!image">
          <div class="button-container" style="display:flex;">
            <div>
              <label @click="addMessage" class="upload-img-btn">send</label>
            </div>
            <div>
              <label class="upload-img-btn">
                upload
                <input type="file" @change="onFileChange" style="display:none" />
              </label>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="label-container">
            <div>
              <label @click="addMessage" class="upload-img-btn">send</label>
            </div>
            <div>
              <label class="upload-img-btn">
                upload
                <input type="file" @change="onFileChange" style="display:none" />
              </label>
            </div>
            <div>
              <label @click="removeImage" class="upload-img-btn">Remove</label>
            </div>
          </div>
          <img :src="image" class="image" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db, firebase } from "@/firebase";
import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);
import { mapActions } from "vuex";

export default {
  methods: {
    ...mapActions(["setUser"]), //これがdispatchに当たる省略記法
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
      this.file = "";
    },
    addMessage(event) {
      if (this.keyDownedForJPComversion(event)) {
        return;
      }
      console.log(this.file);
      if (this.file) {
        let storageRef = firebase
          .storage()
          .ref(`images/${this.user.displayName}/` + this.file.name);
        storageRef.put(this.file).then(() => {
          let storageRef = firebase
            .storage()
            .ref(`images/${this.user.displayName}/` + this.file.name);
          storageRef
            .getDownloadURL()
            .then(url => {
              //getDownloadURLメソッドでstorageから取得している
              console.log(url);
              console.log(this.image);
              this.url = url;
              //このurlはfirebaseからの画像情報になる
              window.alert("storageに格納しました");
              const channelId = this.$route.params.id;
              db.collection("channels")
                .doc(channelId)
                .collection("messages")
                .add({
                  text: this.text,
                  image: this.url,
                  createdAt: new Date().getTime(),
                  user: {
                    id: this.user.uid,
                    name: this.user.displayName,
                    thumbnail: this.user.photoURL
                  }
                });
            })
            .then(() => {
              console.log(this.url);
              window.alert("firestoreに格納しました");
              this.url = null;
              this.text = null;
              this.image = null;
              this.file = null;
            });
        });
      } else {
        const channelId = this.$route.params.id;
        db.collection("channels")
          .doc(channelId)
          .collection("messages")
          .add({
            text: this.text,
            createdAt: new Date().getTime(),
            user: {
              id: this.user.uid,
              name: this.user.displayName,
              thumbnail: this.user.photoURL
            }
          })
          .then(() => {
            console.log(this.url);
            window.alert("テキストのみを出力します");
            this.text = null;
          });
      }
    },

    keyDownedForJPComversion(event) {
      const codeForConversion = 229;
      return event.keyCode === codeForConversion;
    }
  },
  data() {
    return {
      dialogVisible: false,
      text: null,
      image: "", //event.target.result→すごく長い文字列が格納されている
      file: "", //写真の情報が格納されている
      url: null //storageの情報が格納されている
    };
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
    user() {
      return this.$store.state.user;
    }
  }
};
</script>

<style scoped>
.input-container {
  width: 100%;
  height: auto;
}

#image-container {
  display: flex;
  flex-wrap: wrap;
}
.label-container {
  display: flex;
}

img {
  width: 70%;
  cursor: pointer;
}
.image {
  width: 150px;
  height: auto;
}
.upload-img-btn {
  margin: 0 0 0 2px;
  padding: 12px 20px;
  border-radius: 4px;
  max-width: 50px;
  font-size: 14px;
  text-align: center;
  display: block;
  background-color: white;
  color: black;
  box-shadow: 0 2px 4px rgba(146, 146, 146, 0.8);
  cursor: pointer;
}
</style>
