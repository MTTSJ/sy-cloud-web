## 表单操作

### 定义赋值

this.form.setFieldsValue({ driverClass: res.data })

### 获取字典数据

sysDictTypeDropDown() {
sysDictTypeDropDown({ code: 'dbType' }).then(res => {
this.dbTypeItems = res.data
})
},
