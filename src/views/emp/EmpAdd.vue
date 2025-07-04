<template>
  <el-form :model="form" label-width="120px" size="small">
    <el-row :gutter="24">
      <el-col :span="12">
        <el-form-item label="姓名">
          <el-input v-model="form.ename" placeholder="请输入" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="职位">
          <el-select v-model="form.job" placeholder="==请选择==">
            <el-option label="文员" value="文员" />
            <el-option label="工程师" value="工程师" />
            <el-option label="经理" value="经理" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="24">
      <el-col :span="12">
        <el-form-item label="上级领导">
          <el-select v-model="form.mgr" placeholder="==请选择==">
            <el-option
              v-for="item in mgrOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="入职日期">
          <el-date-picker
            v-model="form.hiredate"
            type="date"
            placeholder="入职日期"
            style="width: 100%"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="24">
      <el-col :span="12">
        <el-form-item label="薪资">
          <el-input v-model="form.sal" placeholder="请输入" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="入职部门">
          <el-select v-model="form.deptno" placeholder="==请选择==">
            <el-option
              v-for="item in deptOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="12"></el-col>
      <el-col :span="12">
        <el-form-item>
          <el-button type="primary" @click="onSubmit">新增</el-button>
          <el-button @click="canceled">取消</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import axios from 'axios'

const $router = useRouter()

//定义表单数据类型
const form = reactive({
  empno: 0,
  ename: '',
  job: '',
  mgr: 0,
  hiredate: '',
  sal: '',
  deptno: 0,
})

//定义表单中下拉框的值为响应式数据
const value = ref('')
const mgrOptions: any = reactive([])
const deptOptions: any = reactive([])

//获取所有员工
const findEmp = () => {
  const response = axios.post('http://localhost:8000/emp/findall', {})
  response.then((res) => {
    const newdata: any = res.data.map((item: any) => ({
      value: item.empno,
      label: item.ename,
    }))
    mgrOptions.splice(0, mgrOptions.length, ...newdata)
    mgrOptions.splice(0, 0, { value: 0, label: '==请选择==' })
    console.log(mgrOptions)
  })
}
findEmp()

//获取所有部门
const findDept = () => {
  const response = axios.post('http://localhost:8000/dept/findall', {})
  response.then((res) => {
    const newdata: any = res.data.map((item: any) => ({
      value: item.deptno,
      label: item.dname,
    }))

    deptOptions.splice(0, deptOptions.length + 1, ...newdata)
    deptOptions.splice(0, 0, { value: 0, label: '==请选择==' })
    console.log(deptOptions)
  })
}
findDept()

//新增员工
const addEmp = (data: any) => {
  return axios.get('http://localhost:8000/emp/add', { params: data })
}

//新增
const onSubmit = () => {
  console.log('submit!')
  console.log('value', form)
  addEmp(form).then((res: any) => {
    console.log('res.data', res.data)
    ElMessage({
      message: '添加成功.',
      type: 'success',
    })
    $router.push('/emp')
  })
}

//取消修改
const canceled = () => {
  $router.push('/emp')
}

</script>
