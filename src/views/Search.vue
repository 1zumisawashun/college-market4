<template>
  <div>
    <p>search画面です</p>
    <p>大学名を記入してください</p>
    <p>
      <input type="text" v-model="search" placeholder="検索" />
      <button @click="searchButton">search</button>
    </p>
    <div class="all-container">
      <div class="posts-container">
        <el-card class="card" v-for="(post, index) in result" :key="index">
          <div class="image-block">
            <img :src="post.image" class="image" />
          </div>
          <div class="content-block">
            <strong>{{ post.title }}</strong>
            <router-link :to="`posts/${post.id}`">show</router-link>
            <br />
            {{ post.content }}
            <br />
            <div class="postedUser">
              <img :src="post.user.thumbnail" class="thumbnail" />
              <router-link :to="`/users/${post.user.id}`" class="username">
                {{
                post.user.name
                }}
              </router-link>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "@/firebase";
export default {
  data() {
    return {
      search: "",
      result: []
    };
  },
  methods: {
    searchButton() {
      console.log(this.search);
      db.collection("posts")
        .where("college", "==", this.search)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            this.result.push({ id: doc.id, ...doc.data() });
            console.log(doc.data());
          });
        });
    }
  }
};
</script>

<style scoped>
.image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.thumbnail {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  margin-right: 10px;
}
.postedImage {
  width: 100px;
  height: auto;
}

.all-container {
  width: 100%;
  height: auto;
}
.posts-container {
  width: 100%;
  height: auto;
  flex-wrap: wrap;
  display: flex;
}
.card {
  width: 47%;
  height: auto;
  margin: 1%;
}
</style>
