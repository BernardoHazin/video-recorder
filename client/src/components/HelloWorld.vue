<template>
  <div>
    <video style="width: 200px;" ref="player" controls autoplay></video>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  /* eslint-disable no-console */
  data () {
    return {
      shouldStop: false,
      mediaRecorder: {}
    }
  },
  mounted () {
    navigator.mediaDevices.getUserMedia({ audio: false, video: true })
      .then(this.handleSuccess)
    setInterval(() => {
      this.mediaRecorder.requestData()
    }, 5000)
  },
  methods: {
    handleSuccess: function (stream) {
      this.$refs.player.srcObject = stream
      const recordedChunks = []
      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm'
      })
      this.mediaRecorder.ondataavailable = function (e) {
        if (e.data.size > 0) {
          const chunk = []
          chunk.push(e.data)
          // console.log(e.data)
          const file = new Blob(chunk)
          const formData = new FormData()
          formData.append('chunk', file)
          axios.post('http://localhost:3000', formData)
            .then((res) => console.log('response', res.data))
          // console.log('file', file)
        }
      }
      this.mediaRecorder.onstop = function () {
        const file = new Blob(recordedChunks)
        const formData = new FormData()
        formData.append('chunk', file)
        axios.post('http://localhost:3000', formData)
          .then((res) => console.log('response', res.data))
        console.log('file', file)
      }
      this.mediaRecorder.start()
    },
    sendChunk () {
      console.log('sendChunk')
      this.mediaRecorder.stop()
      this.mediaRecorder.start()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
