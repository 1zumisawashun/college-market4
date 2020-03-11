<template>
  <div>
    <PostForm />
    <div class="card" id="card-visitors">
      <div class="header">
        <router-link to="/posts" class="indicator"></router-link>
        <img src="@/assets/logo.png" class="content" />
      </div>

      <div class="info">
        <p>
          Total Visitors of the
          <br />Public Website
        </p>
        <p class="counter">
          30
          <span class="unit">VIS</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import PostForm from "@/components/PostForm";
export default {
  components: {
    PostForm
  }
};
</script>

<style scoped>
* {
  z-index: 0;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

body {
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: #212121;
  background-color: #212121;
}

.indicator {
  cursor: pointer;
}

.card {
  background-color: #ffffff;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  border-radius: 5px;
}

.card#card-visitors {
  position: relative;
  width: 300px;
  height: 400px;
  margin: calc((100vh - 400px) / 2) auto;
}

.card#card-visitors .header {
  width: 100%;
  height: 60%;
  background-color: #e91e63;
}

/* これが詳細画面へのアクセス */
.indicator {
  position: absolute;
  z-index: 1;
  width: 50px;
  height: 50px;
  top: calc(60% - 25px);
  right: 20px;
  margin: 0;
  border-radius: 100%;
  background-color: #ff9800;
}

.card#card-visitors .header .content {
  position: relative;
  width: 100%;
  height: 100%;
}

.card#card-visitors .header .content > * {
  color: #ffffff;
  font-weight: 500;
}

.card#card-visitors .header .content .title {
  margin-top: 15px;
  font-size: 25px;
  line-height: 30px;
  text-align: center;
}

.card#card-visitors .header .content .date {
  width: 100%;
  opacity: 0.5;
  text-align: center;
}

.card#card-visitors .info {
  width: calc(100% - 40px);
  height: calc(40% - 80px);
  padding: 40px 20px;
  color: #9e9e9e;
}

.card#card-visitors .info .counter {
  margin-top: 8px;
  color: #212121;
  font-size: 45px;
  font-weight: 400;
  line-height: 40px;
}

.card#card-visitors .info .counter .unit {
  font-size: 15px;
}
</style>
