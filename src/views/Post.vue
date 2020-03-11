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
          ></el-button>
        </div>
        <el-dialog title :visible.sync="dialogVisible" width="70%">
          <p>編集内容を記入してください</p>
          <!-- <el-checkbox v-model="onsale">出品中</el-checkbox>
          <el-checkbox v-model="soldout">売り切れ</el-checkbox>
          <div id="image-container">
            <div v-if="!image">
              <input type="file" @change="onFileChange" />
            </div>
            <div v-else>
              <img :src="image" class="postedImage" />
              <el-button @click="removeImage">Remove</el-button>
            </div>
          </div>-->
          <el-button @click="update(post.id)">更新する</el-button>
        </el-dialog>

        <div class="post-info">
          <img :src="post.image" class="image" />
          <div class="content-block">
            投稿者のコメント
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
          <h1 class="price">¥{{ post.price }}</h1>
          <h1 class="onSale" v-show="post.onsale">販売中</h1>
          <h1 class="soldOut" v-show="post.soldout">売り切れ</h1>
        </div>
        <!--eslint-disable-->
        <div class="chat-maker">
          <el-button
            @click="makeChannels(post.title, post.user.id, post.image)"
            v-show="eraseChat"
          >chat-maker</el-button>
        </div>
      </div>

      <router-link to="/posts">戻る</router-link>
    </div>
  </div>
</template>

<script>
import { db } from "@/firebase";
export default {
  data() {
    return {
      post: [],
      dialogVisible: false,
      updateContent: "",
      eraseElement: null
    };
  },
  computed: {
    userId() {
      return this.$store.state.user.uid;
    }
  },
  methods: {
    openUpdateModal() {
      this.dialogVisible = true;
    },
    update(id) {
      db.collection("posts")
        .doc(id)
        .update({ content: this.updateContent })
        .then(() => {
          alert("メッセージの更新に成功しました");
        });
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
        console.log(docSnapshot.get("content"));
        this.post.push({ id: docSnapshot.id, ...docSnapshot.data() });
        if (this.userId === docSnapshot.data().user.id) {
          this.eraseElement = true;
          this.eraseChat = false;
          console.log(this.eraseElement);
        }
      });
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
  margin-top: 50px;
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
  margin-bottom: 20px;
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
  text-align: center;
}
.onSale {
  color: white;
  text-align: center;
  background-color: #4a4141;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}
.soldOut {
  text-align: center;
  color: #4a4141;
  background-color: white;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}

@media screen and (max-width: 479px) {
  .image {
    width: 100%;
    height: auto;
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
    margin-top: 50px;
  }
}
</style>
