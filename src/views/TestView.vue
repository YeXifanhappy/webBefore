<template>
  <div class="deviceBox">
    <h4>设备管理</h4>
    <div class="head">
      <el-select
        v-model="value"
        placeholder="==请选择设备名称=="
        size="small"
        @change="handleChange"
      >
        <el-option key="全部" label="全部" value="全部" />
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <div class="headRight">
        <div class="block">
          <img src="/src/assets/001.png" alt="" /><span>导入</span>
        </div>
        <div class="block">
          <img src="/src/assets/002.png" alt="" /> <span>导出</span>
        </div>
        <div class="block">
          <img src="/src/assets/003.png" alt="" /> <span>打印</span>
        </div>
        <div class="block" @click="addFn">
          <img src="/src/assets/004.png" alt="" /> <span>添加设备</span>
        </div>
      </div>
    </div>
    <el-table
      ref="multipleTableRef"
      :data="tableData"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      size="small"
    >
      <el-table-column type="selection" width="40" />
      <el-table-column prop="deviceName" label="设备名称" width="100" />
      <el-table-column prop="deviceId" label="设备编号" />
      <el-table-column prop="deviceLocation" label="存放位置" />
      <el-table-column prop="deviceBrank" label="设备品牌" />
      <el-table-column prop="purchaseYear" label="购置年份" />
      <el-table-column prop="deviceCayegory" label="设备分类" />
      <el-table-column prop="deviceState" label="设备状态" />
      <el-table-column prop="devicePerson" label="设备管理员" />
      <el-table-column label="操作" width="140">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="editFn(scope.row)"
            >编辑</el-button
          >
          <el-button
            link
            type="primary"
            size="small"
            @click="deleteFn(scope.row)"
            >删除</el-button
          >
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
import { ref, reactive, watch } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  getDeviceTypeApi,
  getDeviceListApi,
  delDeviceApi,
  getDeviceListApi2,
} from "@/api/device";
const $router = useRouter();

let value = ref("");
let options: any = reactive([]);
//获取分类列表
const getDeviceType = () => {
  getDeviceTypeApi().then((res: any) => {
    let newdata: any = res.data.map((item: any) => ({
      value: item.name,
      label: item.name,
    }));
    options.splice(0, options.length, ...newdata);
    console.log(options);
    value.value = "";
  });
};
getDeviceType();

//获取列表数据
interface User {
  deviceId: string;
  deviceName: string;
  deviceLocation: string;
  deviceOrigin: string;
  purchaseYear: string;
  deviceCayegory: string;
  deviceState: string;
  devicePerson: string;
  activationdate: string;
  deviceBrank: string;
}
//定义分页
let total = ref(0);
const currentPage = ref(1);
const pageSize = 8;

//定义表格数据为响应式数据
let tableData: User[] = reactive([]);
const getDeviceList = () => {
  getDeviceListApi().then((res: any) => {
    total.value = res.data.length;
    const start = (currentPage.value - 1) * pageSize;
    const end = start + pageSize;
    const current = res.data.slice(start, end);
    tableData.splice(0, tableData.length, ...current);
  });
};
getDeviceList();

// 处理当前页码改变
const handleCurrentChange = (page: any) => {
  currentPage.value = page;
  console.log("pageSize", pageSize);
};

watch(currentPage, () => {
  getDeviceList();
});

//复选框
const handleSelectionChange = () => {};

//点击下拉框
const handleChange = (selectedValue: any) => {
  value.value = selectedValue;
  getDeviceListApi2({ deviceName: value.value }).then((res: any) => {
    tableData.splice(0, options.length, ...res.data);
  });
  if (value.value === "全部") {
    getDeviceList();
  }
};

//新增设备
const addFn = () => {
  $router.push("/Device/AddDevice");
};
//删除设备
const deleteFn = (row: any) => {
  console.log("row", row.id);
  ElMessageBox.confirm("确定要删除该设备吗?", "Warning", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      delDeviceApi(row.id).then((res: any) => {
        console.log(res.data);
        getDeviceList();
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
};
//编辑
const editFn = (row: any) => {
  console.log("点击编辑按钮", row.id);
  $router.push({ path: "/Device/EditDevice", query: { id: row.id } });
};
</script>

<style lang="less" scoped>
.deviceBox {
  width: 100%;
  height: 100%;
  padding: 10px;

  h4 {
    font-weight: 400;
  }

  .head {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .headRight {
      display: flex;
      align-items: center;

      .block {
        padding: 0 10px;
        font-size: 14px;

        img {
          vertical-align: middle;
        }
      }
    }
  }

  .el-select {
    margin-top: 20px;
  }

  .el-table {
    margin-top: 20px;
  }
  .bottom {
    margin-top: 20px;
  }
}
</style>
