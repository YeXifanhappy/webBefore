<template>
  <div>
    <h1>TestAxiosView</h1>
    <button @click="getData">Get Data</button>
    <p>{{ data }}</p>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'TestAxiosView',
  data() {
    return {
      data: '',
    }
  },
  methods: {
    async getData() {
      const response = await axios.get('http://localhost:8888/ajax_server_war_exploded/user?id=12345')
      this.data = response.data
    },
  },
}
</script>
