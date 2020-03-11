<template>
  <div class="post-container">
    <div class="post-block">
      <div v-for="(post, index) in post" :key="index">
        <div class="title-container">
          <span class="title">{{ post.title }}</span>

          <el-button
            type="primary"
            icon="el-icon-edit"
            circle
            @click="openUpdateModal"
            v-show="eraseElement"
            style="padding:10px;"
          ></el-button>
        </div>
        <el-dialog title :visible.sync="dialogVisible" width="70%">
          <p>編集内容を記入してください</p>
          <!-- <PostForm /> -->
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
          </div>
          <el-button @click="update(post.id)">更新する</el-button>
        </el-dialog>

        <div class="post-info">
          <img :src="post.image" class="image" />
          <div class="content-block">
            投稿者のコメント
            <hr />
            <p>{{ post.content }}</p>
          </div>
        </div>
        <table>
          <tr>
            <th>大学</th>
            <td>{{ post.college }}</td>
          </tr>
          <tr>
            <th>学部</th>
            <td>{{ post.major }}</td>
          </tr>
          <tr>
            <th>商品状態</th>
            <td>{{ post.status }}</td>
          </tr>
          <tr>
            <th>支払方法</th>
            <td v-show="post.cashless">キャッシュレス</td>
            <td v-show="post.cash">現金</td>
            <td v-show="post.other">その他</td>
          </tr>
        </table>

        <div class="price-container">
          <div class="price">¥{{ post.price }}</div>
          <div class="onSale" v-show="post.onsale">販売中</div>
          <div class="soldOut" v-show="post.soldout">売り切れ</div>
        </div>
        <!--eslint-disable-->
        <div class="chat-maker">
          <el-button
            @click="makeChannels(post.title, post.user.id, post.image)"
            v-show="eraseChat"
            type="primary"
          >交渉する</el-button>
        </div>
      </div>
      <router-link to="/posts">戻る</router-link>
    </div>
  </div>
</template>

<script>
import { db, firebase } from "@/firebase";
// import PostForm from "@/components/PostForm.vue";
export default {
  components: {
    // PostForm
  },
  data() {
    return {
      post: [],
      dialogVisible: false,
      updateContent: "",
      eraseElement: false,
      eraseChat: true,
      eraseChat2: true,

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
      image: ""
    };
  },
  computed: {
    userId() {
      return this.$store.state.user.uid;
    },
    user() {
      return this.$store.state.user;
    }
  },
  methods: {
    openUpdateModal() {
      this.dialogVisible = true;
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
    update(id) {
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
          db.collection("posts")
            .doc(id)
            .update({
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
    },
    makeChannels(title, postedUserId, image) {
      console.log("makeChannels");
      db.collection("channels").add({
        name: title,
        postedUser: postedUserId,
        currentUser: this.userId,
        createdAt: new Date().getTime(),
        thumbnail: image
      });
      window.alert("chat-maker");
    }
  },
  mounted() {
    const postsId = this.$route.params.id;
    db.collection("posts")
      .doc(postsId)
      .get()
      .then(docSnapshot => {
        console.log(docSnapshot.data().user.id);
        console.log(docSnapshot.id);
        console.log(this.user);
        this.post.push({ id: docSnapshot.id, ...docSnapshot.data() });
        if (this.user.uid === docSnapshot.data().user.id) {
          //もしcurrentUserとpostedUserが同じだったら、下の要素が発動
          this.eraseElement = true;
          //編集ボタンが出現する
          this.eraseChat = false;
          //chat-makerが消える
          console.log(this.eraseElement);
        }
      });
    if (this.user === null) {
      this.eraseChat = false;
      console.log(this.user);
      console.log("ログインしていないユーザー画面を表示しています");
    }
  }
};
</script>

<style scoped>
.post-container {
  width: 100%;
  height: auto;
}
.post-block {
  width: 70%;
  height: auto;
  margin: 0 auto;
  margin-top: 20px;
}
.post-info {
  display: flex;
}
/* イメージ写真とコメントのボックス */
.content-block {
  width: 65%;
  height: auto;
  margin: 0 0 0 5%;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  border-radius: 10px;
  padding: 10px;
  background-color: white;
}
.image {
  width: 30%;
  height: auto;
}
/* 本のタイトル */
.title-container {
  width: 100%;
  height: auto;
  font-weight: bold;
  font-size: 40px;
  margin-bottom: 10px;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}

/* これは各テーブルの間に敷かれている線 */
table tr {
  border-bottom: solid 1px lightgray;
}

table tr:last-child {
  border-bottom: none;
}

table th {
  position: relative;
  text-align: left;
  width: 30%;
  background-color: #4a4141;
  color: white;
  text-align: center;
  padding: 10px 0;
}

table th:after {
  display: block;
  content: "";
  width: 0px;
  height: 0px;
  position: absolute;
  top: calc(50% - 10px);
  right: -10px;
  border-left: 10px solid #4a4141;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
}

table td {
  text-align: left;
  width: 70%;
  text-align: center;
  background-color: white;
  padding: 10px 0;
}
.price-container {
  width: 100%;
  height: auto;
  margin-top: 10px;
}
.price {
  font-size: 30px;
  text-align: center;
  font-weight: bold;
  margin-bottom: 10px;
}
.onSale {
  color: white;
  text-align: center;
  background-color: #4a4141;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  font-weight: bold;
  font-size: 30px;
  margin-bottom: 10px;
}
.soldOut {
  text-align: center;
  color: #4a4141;
  background-color: white;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  font-weight: bold;
  font-size: 30px;
  margin-bottom: 10px;
}
.chat-maker {
  margin-bottom: 10px;
}

@media screen and (max-width: 479px) {
  .image {
    width: 100%;
    height: 500px;
    object-fit: cover;
  }
  .post-info {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
  }
  .content-block {
    width: 100%;
    margin: 0;
  }
  .post-block {
    width: 90%;
    height: auto;
    margin: 0 auto;
    margin-top: 10px;
  }
  .title-container {
    width: 100%;
    height: auto;
    font-size: 30px;
    text-align: justify;
  }
}
</style>
