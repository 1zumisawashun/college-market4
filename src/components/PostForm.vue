<template>
  <div>
    <p class="logout" @click="openModal" v-if="isAuthenticated">Post</p>
    <transition name="my-modal">
      <div class="my-modal" v-if="modal">
        <div class="form-container">
          <!--eslint-disable-->
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
          <div @click="closeModal" class="my-modal-close">close</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { db, firebase } from "@/firebase";
export default {
  data() {
    return {
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
  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
    userId() {
      return this.$store.state.user.uid;
    },
    user() {
      return this.$store.state.user;
    },
    computedGetState() {
      return this.$store.getters.getStateMessege;
    }
  },

  methods: {
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
    openModal() {
      this.modal = true;
    },
    closeModal() {
      this.modal = false;
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
  }
};
</script>

<style>
</style>
