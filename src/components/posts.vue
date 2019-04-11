<template>
  <div class="message-history">
    <Message user="Alice" time="2:54pm" message="test"></Message>
    <Message user="Steve" time="2:57pm" message="Yay it works"></Message>
  </div>
</template>

<script>
  
import Message from './message';

export default {
  components: {
    Message
  }
}

</script>