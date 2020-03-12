<template>
  <div class="all-container">
    <div class="header">
      <div class="search-bar">
        <p>欲しい本を探そう</p>
        <!-- eslint-disable -->
        <el-input v-model="keyword" placeholder="大学名" clearable></el-input>
        <el-input v-model="keyword2" placeholder="タイトル名" clearable></el-input>
      </div>
    </div>
    <div class="posts-container">
      <div class="card l-card" v-for="(post, index) in this.itemsFiltered" :key="index">
        <div class="image-block l-thumbnail">
          <figure class="thumbnail-wrapper">
            <img :src="post.image" class="image" />
          </figure>
          <router-link :to="`posts/${post.id}`">
            <span class="more-text">Read More</span>
          </router-link>
        </div>
        <div class="content-block text-content">
          <div class="content">{{ post.title }}</div>
          <div class="posted-user">
            <router-link :to="`/users/${post.user.id}`" class="username">
              <img :src="post.user.thumbnail" class="thumbnail" />
            </router-link>
            <div class="college">{{ post.college }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);
import { db } from "@/firebase";
export default {
  data() {
    return {
      title: "",
      content: "",
      status: "",
      college: "",
      major: "",
      price: "",
      condition: "",
      onSale: false,
      soldOut: "",

      currentDate: new Date(),
      posts: [],
      file: "",
      image: "",
      modal: false,

      keyword: "",
      keyword2: ""
    };
  },
  methods: {},
  computed: {
    user() {
      return this.$store.state.user;
    },
    itemsFiltered() {
      var posts = [];
      for (var i in this.posts) {
        var post = this.posts[i];
        if (
          String(post.college).indexOf(this.keyword) !== -1 &&
          String(post.title).indexOf(this.keyword2) !== -1
        ) {
          posts.push(post);
        }
      }

      return posts;
    }
  },
  mounted() {
    db.collection("posts")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          this.posts.push({ id: doc.id, ...doc.data() });
          console.log(doc.data());
          console.log(doc.id);
        });
      });
    console.log(this.status);
  }
};
</script>

<style scoped>
.header {
  width: 100%;
  height: 300px;
  background-image: url("../assets/header.jpg");
  object-fit: cover;
  position: relative;
}

/* 透過した黒を上から重ねるイメージ */
.header::before {
  background-color: rgba(0, 0, 0, 0.4);
  /* 自由に位置指定 */
  position: absolute;
  width: 100%;
  height: 300px;
  content: " ";
}
.search-bar {
  padding-left: 20%;
  width: 60%;
  margin: 0 auto;
  padding-top: 50px;
  text-align: center;
  position: absolute;
}
p {
  color: white;
  font-weight: bold;
  font-size: 25px;
}

.image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 10px 10px 0 0;
}

.thumbnail {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
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
  margin-top: 1%;
}

.card {
  width: 31%;
  height: auto;
  margin: 1%;
  background-color: white;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  border-radius: 10px;
}
.content-block {
  padding: 10px;
}
.content {
  width: 100%;
  height: auto;
  margin-top: 0;
  font-weight: bold;
  font-size: 20px;
}
.college {
  color: #9e9e9e;
  padding-top: 15px;
}
.posted-user {
  display: flex;
  flex-wrap: wrap;
}
.l-thumbnail {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: auto;
}
.thumbnail-wrapper {
  display: block;
  margin: 0;
  padding: 0;
}
.thumbnail-wrapper::after {
  transition: 0.3s;
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  transform: translateY(-100%);
  display: block;
  width: 100%;
  height: 100%;
  background: lightgreen;
  opacity: 0.8;
}
.thumbnail-wrapper img {
  display: block;
  max-width: 100%;
}
.more-text {
  transition: 0.5s;
  transition: opacity 0.5s, transform 0.8s;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -80%);
  display: inline-block;
  padding: 6px 12px 8px;
  color: #fff;
  font-size: 14px;
  border: 1px solid #fff;
  opacity: 0;
}
.l-card:hover .thumbnail-wrapper::after {
  transform: translateY(0);
}
.l-card:hover .more-text {
  transform: translate(-50%, -50%);
  opacity: 1;
}

@media screen and (max-width: 479px) {
  .posts-container {
    overflow: hidden;
  }
  .image {
    width: 100%;
    height: 125px;
    object-fit: cover;
    border-radius: 10px 10px 0 0;
  }
  .card {
    width: 48%;
    height: auto;
  }

  .content {
    height: 60px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
  .thumbnail {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    margin-right: 10px;
  }
  .college {
    color: #9e9e9e;
    padding-top: 5px;
  }
  .search-bar {
    width: 80%;
    padding-left: 10%;
    padding-top: 30px;
    text-align: center;
  }
}
</style>
