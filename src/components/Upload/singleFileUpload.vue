
<template>
  <div>
    <input ref="upload-input" class="upload-input" type="file" @change="handleClick">
    <div class="drop">
      <el-button :loading="loading" style="margin-left:16px;" size="mini" type="primary" @click="handleUpload">
        上传
        <i class="el-icon-upload el-icon-right" />
      </el-button>
      <el-button style="margin-left:16px;" size="mini" type="primary" icon="el-icon-delete" @click="removeUpload" />
      <el-progress :stroke-width="16" :percentage="progressPercent" />
    </div>
  </div>
</template>

<script>
import {
  upload
} from '@/api/component/file'
export default {
  props: {
    beforeUpload: Function, // eslint-disable-line
    removeUpload: Function, // eslint-disable-line
  },
  data() {
    return {
      loading: false,
      progressPercent: 0
    }
  },
  methods: {
    /* 处理上传 */
    handleUpload() {
      this.$refs['upload-input'].click()
    },
    /* 上传检查 */
    handleClick(e) {
      const files = e.target.files
      const rawFile = files[0] // 只接受一个文件
      if (!rawFile) return
      const data = new FormData()
      data.append('file', rawFile)
      this.$refs['upload-input'].value = null // 修复不能选择同一个Excel
      // 上传动作条
      const config = {
        onUploadProgress: progressEvent => {
          // progressEvent.loaded:已上传文件大小
          // progressEvent.total:被上传文件的总大小
          this.progressPercent = Number((progressEvent.loaded / progressEvent.total * 100).toFixed(2))
        }
      }

      upload(data, config).then(res => {
        if (res.code === 200) {
          this.$notify({
            title: res.message,
            message: res.message,
            type: 'success',
            duration: 2000
          })
          // 传递给函数
          this.beforeUpload(rawFile, res.data.path)
          return true
        }
      }).catch(res => {
        console.log(res)
        this.beforeUpload(rawFile, '')
      })
      return false
    }
  }
}
</script>

<style scoped>
.upload-input{
  display: none;
  z-index: -9999;
}
.drop{
  margin: 0 auto;
  font-size: 24px;
  border-radius: 5px;
  color: #bbb;
  position: relative;
}
</style>
