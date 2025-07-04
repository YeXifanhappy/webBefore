<template>
  <div class="empBox">
    <div class="head">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="姓名">
          <el-input v-model="searchForm.ename" placeholder="姓名" clearable />
        </el-form-item>
        <el-form-item label="职位">
          <el-select v-model="searchForm.job" placeholder="职位" clearable>
            <el-option label="文员" value="文员" />
            <el-option label="工程师" value="工程师" />
            <el-option label="经理" value="经理" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="findEmp">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addEmp">添加</el-button>
        </el-form-item>
      </el-form>
    </div>
    <hr />
    <el-table
      ref="multipleTableRef"
      :data="tableData"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      size="small"
    >
      <el-table-column type="selection" width="40" />
      <el-table-column prop="empno" label="员工编号" width="100" />
      <el-table-column prop="ename" label="员工姓名" />
      <el-table-column prop="job" label="职位" />
      <el-table-column prop="manager.ename" label="上级经理" />
      <el-table-column prop="hiredate" label="入职日期" :formatter="formatDate" />
      <el-table-column prop="sal" label="薪资" />
      <el-table-column prop="dept.dname" label="部门" />
      <el-table-column label="操作" width="140">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="updateEmp(scope.row)">修改</el-button>
          <el-button link type="primary" size="small" @click="deleteEmp(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="bottom">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        small
        background
        layout="total, prev, pager, next"
        :total="total"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, watch } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from "element-plus";
const $router = useRouter()

//定义分页
const total = ref(0)
const currentPage = ref(1)
const pageSize = 8

const searchForm = reactive({
  ename: '',
  job: '',
  pageSize: 0,
  pageNum: 0,
})
interface Emp {
  empno: number
  ename: string
  job: string
  mgr: number
  hiredate: Date
  sal: number
  deptno: number
}

const tableData = ref<Emp[]>([])
const findEmp = () => {
  searchForm.pageSize = pageSize
  searchForm.pageNum = currentPage.value
  const response = axios.get('http://localhost:8000/emp/findbyconditionwithallbypage', { params: searchForm })
  response.then((res) => {
    console.log(res.data)
    total.value = res.data.total
    tableData.value = res.data.list
  })
}
const addEmp = () => {
  $router.push('/emp/add')
}
const updateEmp = (row: Emp) => {
  console.log("点击编辑按钮", row.empno);
  $router.push({ path: "/emp/update", query: { empno: row.empno } });
}
const deleteEmp = (row: Emp) => {
  console.log("row", row.empno);
  currentPage.value = 1
  ElMessageBox.confirm("确定要删除该员工吗?", "Warning", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      const response = axios.get('http://localhost:8000/emp/delete', { params: { empno: row.empno } })
      response.then((res) => {
        console.log(res.data);
        findEmp();
      });
      ElMessage({
        type: "success",
        message: "删除成功",
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "删除失败",
      });
    });
}

// 处理当前页码改变
const handleCurrentChange = (page: any) => {
  currentPage.value = page
  searchForm.pageNum = page
  console.log('currentPage', currentPage)
}

watch(currentPage, () => {
  findEmp()
})

//复选框
const handleSelectionChange = () => {}

// 日期转换
const formatDate = (row: Emp, column: any, cellValue: any, index: number) => {
  const date = new Date(row.hiredate)
  return date.toLocaleDateString()
}
</script>

<style>
.demo-form-inline .el-input {
  --el-input-width: 220px;
}

.demo-form-inline .el-select {
  --el-select-width: 220px;
}
</style>
