<template>
  <div>
    <v-avatar :size="avatarSize">
      <img :src="obtieneUrlThumbor" alt="Image" />
    </v-avatar>
  </div>
</template>

<script>
import Thumbor from 'thumbor'
export default {
  name: 'ThumborImage',
  props: {
    imageUrl: {
      type: String,
      default: null,
    },
    width: {
      type: Number,
      default: 100,
    },
    height: {
      type: Number,
      default: 100,
    },
    smartCrop: {
      type: Boolean,
      default: true,
    },
    avatarSize: {
      type: Number,
      default: 30,
    },
  },
  computed: {
    obtieneUrl() {
      let url = 'https://appapi.shuttleexpressmexico.mx/avatars/no-image.png'
      console.log(this.imageUrl)
      if (this.imageUrl) {
        url = this.imageUrl.avatar
      }
      return url
    },
    obtieneUrlThumbor() {
      let thumbor = new Thumbor('S3_4CC4SS_S3CUR1T1', 'https://imagea.shuttleexpressmexico.mx')
      var imagen = '/avatars/no-image.png'
      if (this.imageUrl) {
        imagen = this.imageUrl
      }
      let urlThumbor = thumbor
        .setImagePath(imagen)
        .resize(this.width, this.height)
        .smartCrop(this.smartCrop)
        .buildUrl()
      return urlThumbor
    },
  },
}
</script>
