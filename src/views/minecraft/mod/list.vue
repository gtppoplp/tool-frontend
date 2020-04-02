<template>
  <div class="app-container">
    <div class="filter-container">
      <!--搜索-->
      <el-input
        v-model="listQuery.name"
        placeholder="模型名称"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <!--查询-类型-->
      <el-select
        v-model="listQuery.categoryId"
        placeholder="类型"
        clearable
        style="width: 120px"
        class="filter-item"
      >
        <el-option v-for="item in modeTypeList" :key="item.name" :label="item.name" :value="item.id" />
      </el-select>
      <!--查询-读取lang状态-->
      <el-select
        v-model="listQuery.langStatus"
        placeholder="读取lang状态"
        clearable
        style="width: 150px"
        class="filter-item"
      >
        <el-option v-for="item in langStatusList" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <!--查询-汉化状态-->
      <el-select
        v-model="listQuery.chineseStatus"
        placeholder="汉化状态"
        clearable
        style="width: 150px"
        class="filter-item"
      >
        <el-option v-for="item in chineseStatusList" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <!--查询-应用到游戏状态-->
      <el-select
        v-model="listQuery.enabledStatus"
        placeholder="应用到游戏状态"
        clearable
        style="width: 150px"
        class="filter-item"
      >
        <el-option v-for="item in enabledStatusList" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <!--搜索按钮-->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <!--新增按钮-->
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        添加
      </el-button>
      <!--导出-->
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >
        导出
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="创建时间" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createdTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="模型名称" width="250px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span class="link-type">{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="说明" width="100px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.description }}</span>
        </template>
      </el-table-column>
      <!--读取lang状态-->
      <el-table-column class-name="status-col" label="读取lang状态" width="110px">
        <template slot-scope="{row}">
          <el-tag :type="row.langStatus | langStatusTypeFilter">
            {{ row.langStatus | langStatusFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <!--汉化状态-->
      <el-table-column class-name="status-col" label="汉化状态" width="110px">
        <template slot-scope="{row}">
          <el-tag :type="row.chineseStatus | chineseStatusTypeFilter">
            {{ row.chineseStatus | chineseStatusFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <!--应用到游戏状态-->
      <el-table-column class-name="status-col" label="应用到游戏状态" width="120px">
        <template slot-scope="{row}">
          <el-tag :type="row.enabledStatus | enabledStatusTypeFilter">
            {{ row.enabledStatus | enabledStatusFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="消息操作" align="center" min-width="30px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="success" size="mini" @click="handleLang(row)">
            读取字段
          </el-button>
          <el-button type="success" size="mini" @click="handleChinese(row)">
            汉化
          </el-button>
          <el-button type="success" size="mini" @click="handleEnabled(row)">
            应用到游戏
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="50px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="mini" size="danger" @click="handleUnableChinese(row)">
            无法汉化
          </el-button>
          <el-button type="primary" size="mini" @click="handleLangUpdate(row)">
            编辑lang内容
          </el-button>
          <el-button type="" size="mini" @click="handleLog(row)">
            错误日志
          </el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--编辑lang内容-->
    <el-dialog :visible.sync="dialogLangVisible" title="lang内容">
      <el-table :data="langDataList" border fit highlight-current-row style="width: 200%">
        <el-table-column show-overflow-tooltip prop="field" label="字段" />
        <el-table-column show-overflow-tooltip prop="enLang" label="未翻译" />
        <el-table-column min-width="300px" label="翻译">
          <template slot-scope="{row}">
            <template v-if="row.edit">
              <el-input v-model="row.lang" class="edit-input" size="small" />
              <el-button
                class="cancel-btn"
                size="small"
                icon="el-icon-refresh"
                type="warning"
                @click="cancelEdit(row)"
              >
                取消
              </el-button>
            </template>
            <span v-else>{{ row.lang }}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="isChinese" :formatter="isChineseFilter" label="是否汉化" />
        <!--操作按钮-->
        <el-table-column align="center" label="操作" width="120">
          <template slot-scope="{row}">
            <el-button
              v-if="row.edit"
              type="success"
              size="small"
              icon="el-icon-circle-check-outline"
              @click="confirmEdit(row)"
            >
              提交
            </el-button>
            <el-button
              v-else
              type="primary"
              size="small"
              icon="el-icon-edit"
              @click="row.edit=!row.edit"
            >
              Edit
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogLangVisible = false">关闭</el-button>
      </span>
    </el-dialog>
    <!--日志框体-->
    <el-dialog :visible.sync="dialogLogVisible" title="错误日志">
      <el-table :data="logDataList" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="type" label="日志类型" width="100px" />
        <el-table-column prop="log" label="内容" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogLogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
    <!--添加按钮框体-->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageNum"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="mod"
        label-position="left"
        label-width="120px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="模型名称" prop="name">
          <el-input v-model="mod.name" />
        </el-form-item>
        <el-form-item label="模型类型" prop="name">
          <el-select v-model="mod.categoryId" style="width: 140px" class="filter-item">
            <el-option v-for="item in modeTypeList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="说明">
          <el-input
            v-model="mod.description"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="请输入说明"
          />
        </el-form-item>
        <!--上传文件-->
        <el-form-item label="文件" prop="path">
          <upload-component :before-upload="beforeUpload" :remove-upload="removeUpload" />
          <span v-if=" mod.path !== ''" :autosize="{ minRows: 2, maxRows: 4}">{{ mod.fileName }}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          提交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  minecraftModList,
  minecraftModCreate,
  minecraftModUpdate,
  minecraftModDelete,
  minecraftModCategoryAll,
  minecraftModLang,
  minecraftModChinese,
  minecraftModEnabled,
  minecraftModLogAll,
  minecraftModLangAll,
  minecraftModLangUpdate,
  minecraftModUnableChinese
} from '@/api/minecraft/mod'

import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // 基于EL-分页二级包装件
import UploadComponent from '@/components/Upload/singleFileUpload.vue' // 单文件上传组件

export default {
  name: 'ComplexTable',
  components: { Pagination, UploadComponent },
  directives: { waves },
  filters: {
    langStatusTypeFilter(status) {
      const statusMap = {
        1: 'success',
        2: '',
        3: 'danger',
        0: 'info'
      }
      return statusMap[status]
    },
    chineseStatusTypeFilter(status) {
      const statusMap = {
        1: 'success',
        2: '',
        3: 'danger',
        0: 'info'
      }
      return statusMap[status]
    },
    enabledStatusTypeFilter(status) {
      const statusMap = {
        1: 'success',
        2: '',
        3: 'danger',
        0: 'info'
      }
      return statusMap[status]
    },
    langStatusFilter(status) {
      const statusMap = {
        1: '完成',
        2: '提取中',
        3: '提取失败',
        0: '未提取'
      }
      return statusMap[status]
    },
    chineseStatusFilter(status) {
      const statusMap = {
        1: '已汉化',
        2: '汉化中',
        3: '汉化失败',
        0: '未汉化'
      }
      return statusMap[status]
    },
    enabledStatusFilter(status) {
      const statusMap = {
        1: '已应用',
        2: '应用中',
        3: '应用失败',
        0: '未应用'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      pageNum: 0,
      pageSize: 0,
      totalPage: 0,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        name: undefined,
        categoryId: undefined,
        langStatus: undefined,
        chineseStatus: undefined,
        enabledStatus: undefined
      },
      showReviewer: false,
      /* 模型 */
      mod: {
        id: undefined,
        categoryId: undefined,
        createdTime: undefined,
        name: '',
        description: '',
        isEnabled: true,
        path: '',
        fileName: ''
      },
      /* 模型类型 */
      modeTypeList: [],
      /* lang状态 */
      langStatusList: [
        { label: '完成', key: 1 },
        { label: '提取中', key: 2 },
        { label: '提取失败', key: 3 },
        { label: '未提取', key: 0 }
      ],
      /* 汉化状态 */
      chineseStatusList: [
        { label: '已汉化', key: 1 },
        { label: '汉化中', key: 2 },
        { label: '汉化失败', key: 3 },
        { label: '未汉化', key: 0 }
      ],
      /* 应用到游戏状态 */
      enabledStatusList: [
        { label: '已应用', key: 1 },
        { label: '应用中', key: 2 },
        { label: '应用失败', key: 3 },
        { label: '未应用', key: 0 }
      ],
      /* 编辑添加对话框 */
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改模型',
        create: '创建模型'
      },
      isEnabledOptions: [
        { label: '是', key: true },
        { label: '否', key: false }
      ],
      /* 编辑lang内容对话框 */
      dialogLangVisible: false,
      langDataList: [],
      /* 错误日志对话框 */
      dialogLogVisible: false,
      /* 错误日志内容列表 */
      logDataList: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  /* 初始化页面 */
  created() {
    this.getList()
  },
  methods: {
    /* 获取列表 */
    getList() {
      this.listLoading = true
      minecraftModList(this.listQuery).then(response => {
        this.list = response.data.list
        this.pageNum = response.data.pageNum
        this.pageSize = response.data.pageSize
        this.totalPage = response.data.totalPage
        this.total = response.data.total
        this.listLoading = false
      })
      // 获取类型数据
      minecraftModCategoryAll().then(response => {
        this.modeTypeList = response.data
      })
    },
    /* 搜索过滤器 */
    handleFilter() {
      this.listQuery.pageNum = '1'
      this.getList()
    },
    /* 默认创建数据初始化 */
    resetTemp() {
      this.mod = {
        id: undefined,
        categoryId: undefined,
        createdTime: undefined,
        name: '',
        description: '',
        isEnabled: true,
        path: '',
        fileName: '',
        langStatus: '',
        chineseStatus: '',
        enabledStatus: ''
      }
    },
    /* 创建窗口 */
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      // 获取类型数据
      minecraftModCategoryAll().then(response => {
        this.modeTypeList = response.data
      })
    },
    /* 创建 */
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          minecraftModCreate(this.mod).then(res => {
            this.$notify({
              title: res.message,
              message: res.data,
              type: 'success',
              duration: 2000
            })
            this.dialogFormVisible = false
            this.getList()
          })
        }
      })
    },
    /* 日志内容窗口 */
    handleLog(row) {
      this.dialogLogVisible = true
      this.logDataList = []
      // 获取类型数据
      minecraftModLogAll(row.id).then(response => {
        this.logDataList = response.data
      })
    },
    /* 编辑lang内容窗口 */
    handleLangUpdate(row) {
      this.dialogLangVisible = true
      this.langDataList = []
      // 获取类型数据
      minecraftModLangAll(row.id).then(response => {
        this.langDataList = response.data.map(v => {
          this.$set(v, 'edit', false)
          v.originalLang = v.lang
          return v
        })
      })
    },
    /* 编辑窗口 */
    handleUpdate(row) {
      this.mod.id = row.id
      this.mod.name = row.name
      this.mod.description = row.description
      this.mod.categoryId = row.categoryId
      this.mod.path = row.path
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      // 获取类型数据
      minecraftModCategoryAll().then(response => {
        this.modeTypeList = response.data
      })
    },
    /* 编辑 */
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          minecraftModUpdate(this.mod.id, this.mod).then(res => {
            this.$notify({
              title: res.message,
              message: res.data,
              type: 'success',
              duration: 2000
            })
            return true
          })
        }
      })
    },
    /* lang-取消行内修改 */
    cancelEdit(row) {
      row.lang = row.originalLang
      row.edit = false
      this.$message({
        message: '翻译内容已恢复到原来的值',
        type: 'warning'
      })
    },
    /* lang-内容修改 */
    confirmEdit(row) {
      row.edit = false
      row.originalLang = row.lang
      minecraftModLangUpdate(row.id, row).then(res => {
        this.$notify({
          title: res.message,
          message: res.data,
          type: 'success',
          duration: 2000
        })
        return true
      })
    },
    /* 应用到游戏*/
    handleEnabled(row) {
      minecraftModEnabled(row.id).then(res => {
        this.$notify({
          title: res.message,
          message: res.data,
          type: 'success',
          duration: 2000
        })
        this.dialogFormVisible = false
        this.getList()
      })
    },
    /* 通知汉化*/
    handleChinese(row) {
      minecraftModChinese(row.id).then(res => {
        this.$notify({
          title: res.message,
          message: res.data,
          type: 'success',
          duration: 2000
        })
        this.dialogFormVisible = false
        this.getList()
      })
    },
    /* 通知读取lang*/
    handleLang(row) {
      minecraftModLang(row.id).then(res => {
        this.$notify({
          title: res.message,
          message: res.data,
          type: 'success',
          duration: 2000
        })
        this.dialogFormVisible = false
        this.getList()
      })
    },
    /* 无法汉化*/
    handleUnableChinese(row) {
      minecraftModUnableChinese(row.id).then(res => {
        this.$notify({
          title: res.message,
          message: res.data,
          type: 'success',
          duration: 2000
        })
        this.dialogFormVisible = false
        this.getList()
      })
    },
    /* 删除 */
    handleDelete(row) {
      minecraftModDelete(row.id).then(res => {
        this.$notify({
          title: res.message,
          message: res.data,
          type: 'success',
          duration: 2000
        })
        this.dialogFormVisible = false
        this.getList()
      })
    },
    /* 文件上传 */
    beforeUpload(file, path) {
      console.log(file)
      this.mod.path = path !== '' ? path : ''
      this.mod.fileName = path !== '' ? file.name : ''
      return true
    },
    /* 文件删除 */
    removeUpload() {
      this.mod.path = ''
      this.mod.fileName = ''
      return true
    },
    /* excel 下载*/
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['序号', '创建时间', '模型类型名称', '说明']
        const filterVal = ['id', 'createdTime', 'name', 'description']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '我的世界模型类型文档'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        return v[j]
      }))
    },
    /* 状态转换 */
    isChineseFilter(row, column) {
      if (row.isChinese === true) {
        return '是'
      } else {
        return '否'
      }
    }
  }
}
</script>
