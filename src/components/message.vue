<template>
  <div class="message">
    <a class="message_profile-pic" href=""></a>
    <a class="message_username" href="">{{user}}</a>
    <span class="message_timestamp">{{time}}</span>
    <span class="message_star"></span>
    <span class="message_content">{{message}}</span>
  </div>
</template>

<script>
  
export default {
  props: ['user', 'time', 'message'],
}

</script>

<style>
  
.message {
  position: relative;
  margin-top: 0.5rem;
  padding: 0.25rem 2rem 0.1rem 3rem;
  min-height: 36px;
}

.message_profile-pic {
  position: absolute;
  left: 0;
  display: block;
  border-radius: 0.2rem;
  width: 36px;
  height: 36px;
  background-image: url(http://findicons.com/icon/download/102283/fh02/300/png);
  background-size: cover;
}

.message_username {
  font-weight: 900;
  padding-right: 0.25rem;
  color: #3d3c40 !important;
  margin-left: 0;
  font-style: normal;
  text-decoration: none;
}

.message_timestamp {
  text-align: left;
  display: inline;
  position: relative;
  top: 0;
  left: 0;
  color: #babbbf;
  font-size: 12px;
  line-height: 1.2rem;
  width: 36px;
  margin-right: 0;
  margin-left: 0;
}

.message_content {
  color: black;
  display: block;
  min-height: 1rem;
}
</style>