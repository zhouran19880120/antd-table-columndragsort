# antd-table-columndragsort
ant-design的Table组件列拖动排序
  
  [![image](https://img.shields.io/badge/npm-1.0.1-green.svg)](https://www.npmjs.com/package/antd-table-columndragsort)
  
  
  
  
简介
--------
此插件适用于[React](https://react.docschina.org/)，前端UI框架为[Ant-Design](https://ant-design.gitee.io/index-cn)，可实现[Table](https://ant-design.gitee.io/components/table-cn/)组件列拖动排序，并存储在浏览器localStorage里。
  
安装
--------
```
npm install -s antd-table-columndragsort
```

使用方法
--------
#### 1. 引用插件
```
import moveColumn from 'antd-table-columndragsort'
```
  
  
  
#### 2. 仿照[Form](https://ant-design.gitee.io/components/form-cn/)组件的Form.create方法，包裹一层moveColumn({options})。例如：
```
export default withRouter(connect(mapStateToProps, mapDispatchToProps, undefined, {
	withRef: true
})(moveColumn({
	columns,
	listName: 'thisPage'
})(Form.create()(MyPage))));
```
也可使用ES7装饰器。
  
**options设置：**
  
  
|参数名|值|
|:----|:----|
|columns|与antd的Table里的columns参数格式相同|
|listName|（可选）任意字符串。如需把列顺序存入到localStorage中，则配置此项。注意同项目下各个页面此值不能相同|
  
  
  经过moveColumn包裹的组件将自带this.props.moveColumn方法。
    
    
    
    
    
#### 3. 仿照[Form](https://ant-design.gitee.io/components/form-cn/)组件的getFieldDecorator使用方法，在页面的Table组件外套一层tableFieldDecorator({options})方法。例如：
```javascript
{this.props.moveColumn.tableFieldDecorator({
  render: {
    edit: (text, record, index) => {
      return (<span className="control_btn">
        {this.props.permission['update'] && <span onClick={()=>this.editUser(record)}>编辑</span>}
        {this.props.permission['delete'] && <span onClick={()=>this.deleteUser(record.id)}>删除</span>}
        </span>);
    }
  }
})(<Table
  dataSource={this.props.userList.result}
  pagination={false}
  rowKey="id"
  loading={this.props.loading}
/>)}
```
  
   
   
**options设置：**
  
  
|参数名|值|
|:----|:----|
|render|如果render里不会用到this.props，则无需在此处设置，直接写到moveColumn的options里即可。如果在render里需要读取this.props，则按照dataIndex分类书写render方法（详见示例）|
  
  你无需再在Table组件里设置columns参数。
    
     
     
 #### 4. 此时表格列头部即可左右拖动。



