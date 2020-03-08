<template>
  <div class="app-container">
    <div class="filter-container">
      <!--搜索-->
      <el-input
        v-model="listQuery.name"
        placeholder="类型名称"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
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
      <el-table-column
        label="序号"
        prop="id"
        align="center"
        width="200px"
      >
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createdTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型名称" width="150px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="说明" min-width="50px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

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
        :model="modCategory"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="类型名称" prop="name">
          <el-input v-model="modCategory.name" />
        </el-form-item>
        <el-form-item label="说明">
          <el-input
            v-model="modCategory.description"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="请输入说明"
          />
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
  minecraftModCategoryList,
  minecraftModCategoryCreate,
  minecraftModCategoryUpdate,
  minecraftModCategoryDelete
} from '@/api/minecraft/modCategory'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // 基于EL-分页二级包装件

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
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
        name: undefined
      },
      showReviewer: false,
      modCategory: {
        id: undefined,
        createdTime: undefined,
        name: '',
        description: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改模型类型',
        create: '创建模型类型'
      },
      pvData: [],
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
      minecraftModCategoryList(this.listQuery).then(response => {
        this.list = response.data.list
        this.pageNum = response.data.pageNum
        this.pageSize = response.data.pageSize
        this.totalPage = response.data.totalPage
        this.total = response.data.total
        this.listLoading = false
      })
    },
    /* 搜索过滤器 */
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    /* 默认创建数据初始化 */
    resetTemp() {
      this.modCategory = {
        id: undefined,
        name: '',
        description: ''
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
    },
    /* 创建 */
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          minecraftModCategoryCreate(this.modCategory).then(res => {
            if (res.code === 200) {
              this.$notify({
                title: res.message,
                message: res.data,
                type: 'success',
                duration: 2000
              })
              this.dialogFormVisible = false
              this.getList()
            }
          }).catch(res => {
            console.log(res)
          })
        }
      })
    },
    /* 编辑窗口 */
    handleUpdate(row) {
      this.modCategory.id = row.id
      this.modCategory.name = row.name
      this.modCategory.description = row.description
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    /* 编辑 */
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          minecraftModCategoryUpdate(this.modCategory.id, this.modCategory).then(res => {
            if (res.code === 200) {
              this.$notify({
                title: res.message,
                message: res.data,
                type: 'success',
                duration: 2000
              })
              this.dialogFormVisible = false
              this.getList()
            }
          }).catch(res => {
            console.log(res)
          })
        }
      })
    },
    /* 删除 */
    handleDelete(row) {
      minecraftModCategoryDelete(row.id).then(res => {
        if (res.code === 200) {
          this.$notify({
            title: res.message,
            message: res.data,
            type: 'success',
            duration: 2000
          })
          this.dialogFormVisible = false
          this.getList()
        }
      }).catch(res => {
        console.log(res)
      })
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
    }
  }
}
</script>
