<template>
  <div class="user-container">
    <!--eslint-disable-->
    <el-tabs v-model="activeName" @tab-click="handleClick" class="tab-container">
      <el-tab-pane label="PROFILE" name="first">
        <div v-for="(user, index) in users" :key="index">
          <p>{{ user.name }}さんのマイページ</p>
          <img :src="user.thumbnail" class="thumbnail" />
        </div>
      </el-tab-pane>
      <el-tab-pane label="ONSALE" name="second">
        <div class="posts-container">
          <div class="card l-card" v-for="(post, index) in onsales" :key="index">
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
      </el-tab-pane>
      <el-tab-pane label="SOLDOUT" name="third">
        <div class="posts-container">
          <div class="card l-card" v-for="(post, index) in soldouts" :key="index">
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
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { db } from "@/firebase";
export default {
  data() {
    return {
      users: [],
      name: "",
      onsales: [],
      eraseElement: true,
      activeName: "first",
      soldouts: []
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    }
  },
  mounted() {
    db.collection("users")
      .where("id", "==", this.$route.params.id)
      .limit(1)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          this.users.push(doc.data());
          console.log(doc.data());
          console.log(this.users);
        });
      });
    db.collection("posts")
      .where("user.id", "==", this.$route.params.id)
      .where("onsale", "==", true)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          this.onsales.push({ id: doc.id, ...doc.data() });
          console.log(doc.data().title);
          console.log(this.posts);
          console.log(doc.data().id);
        });
      });

    if (this.$route.params.id === this.user.uid) {
      this.eraseElement = false;
    }
    db.collection("posts")
      .where("user.id", "==", this.$route.params.id)
      .where("soldout", "==", true)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          this.soldouts.push({ id: doc.id, ...doc.data() });
        });
      });
  }
};
</script>

<style scoped>
.user-container {
  width: 100%;
  height: auto;
  margin-top: 5%;
}

.tab-container {
  width: 90%;
  margin: 0 auto;
  height: auto;
  background-color: white;
  padding: 10px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  border-radius: 10px;
}
.user-posted {
  width: 80%;
  height: auto;
  margin: auto;
  margin: 10px;
  background-color: aliceblue;
  border-radius: 10px;
}
.image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.posts-container {
  width: 100%;
  height: auto;
  flex-wrap: wrap;
  display: flex;
}
/* カードの要素 */
.thumbnail {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
}
/* ここのborder-radiusで写真を丸くしている */
.image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 10px 10px 0 0;
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
.posted-user {
  display: flex;
  flex-wrap: wrap;
}
.college {
  color: #9e9e9e;
  padding-top: 10px;
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
  .image {
    width: 100%;
    height: 125px;
    object-fit: cover;
    border-radius: 10px 10px 0 0;
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
}
</style>
