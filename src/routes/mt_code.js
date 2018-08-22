import React from 'react';
import { connect } from 'dva';
import { Button,Input,Table } from 'antd';
import ModalTable from '../components/ModalTable';
import {UnControlled as CodeMirror} from 'react-codemirror2';


const columnsEx = [{name:'货号',key:'commoditycode'},{name:'商品名称',key:'commodityname'},{name:'商品规格',key:'spec'},{name:'商品单位',key:'unitname'},{name:'售价',key:'saleprice'},{name:'商品库存',key:'storage'}];
class ModalTableCode extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      isOpen:false,
      tableSelectRows:[],
      tableSelectKeys:[],
      showCode:false
    }
  }
  openModal = ()=>{
    this.setState({isOpen:true})
  }
  renderModalConfig(){
    const { tableSelectRows,tableSelectKeys } = this.state;
    return {
        tableConfig:{
            rowKey:'commoditycode',// 模态框内列表key
            selectedRowKeys:tableSelectKeys,// 列表已选key
            selectedRows:tableSelectRows,// 列表已选行
            dataSource:[
              {commoditycode:'zz',customername:'许',key:'abb'},
              {commoditycode:'wmmmww',customername:'11',key:'ccc'}
            ],// 内部列表datasouce
            totalsNum:1,// 总数
            type:'checkbox',// 按钮类型
            loading:false,// 加载loading
            columnsList:columnsEx // 头配置项
        },
        modalConfig:{
            title:"选择商品",// 模态框标题
            visible:this.state.isOpen,// 模态框开关
        },
        searchList:[
            {
                name:'商品',
                key:'keyword', // 搜索条件
                component:<Input/>
            }
        ],
        onSearch:(value)=>console.log(value),// 查询回调
        closeModal:()=>this.setState({isOpen:false}),// 关闭方法
        onChoose:(value)=>{ // 提交回调
            this.setState({isOpen:false});
            const newOrderRows = [];
            const { selectedRows,selectedRowKeys } = value; 
            selectedRowKeys.map((key,i)=>{
                selectedRows.map((item,j)=>{
                    if( key == item.commoditycode ) newOrderRows.push(item);
                })
            })
            this.setState({tableSelectRows:newOrderRows,tableSelectKeys:selectedRowKeys});
        },
    }
  }
  createMarkup =()=> {
    return {__html: '<div>12321321321321313</div>'};
  }
  tableConfig = ()=>{
      const { tableSelectRows } = this.state; 
      const mapColumnsFun = (columnsList = [])=>{
        return columnsList.map((item,index)=>{
            const columnsItem = {
                align:'center',
                title:item.name,
                width:90,
                dataIndex:item.key || index,
                key:item.key || index
            }
            return columnsItem;
        })
      }
      return {
        columns:mapColumnsFun(columnsEx),
        dataSource:tableSelectRows,
        pagination:false,
        scroll:{x:true},
      }
  }
  isShowCode = ()=>{
    this.setState({showCode:!this.state.showCode});
  }
  render(){
    return (
      <div>
        <section className="code-box">
          <ModalTable {...this.renderModalConfig()}/>
          <section className="code-box-demo">
            <Button type="primary" onClick={this.openModal}>打开列表弹框</Button>
            <Table { ...this.tableConfig() } style={{marginTop:20}}/>
          </section>
          <section className="code-box-meta markdown">
            <div className="code-box-title">
              <a href="#components-button-demo-basic">列表模态框</a>
              <a 
                className="edit-button" 
                href="https://github.com/ant-design/ant-design/edit/master/components/button/demo/basic.md" 
                target="_blank" 
                rel="noopener noreferrer">
                <i className="anticon anticon-edit"></i>
              </a>
            </div>
            <div>
              <p>适合场景：点击模态框选中某些行,并渲染到外部界面</p>
            </div>
            <span className="code-expand-icon" onClick={this.isShowCode}>
              <img alt="expand code" src="https://gw.alipayobjects.com/zos/rmsportal/wSAkBuJFbdxsosKKpqyq.svg" 
              className="code-expand-icon-hide"/>
              <img alt="expand code" src="https://gw.alipayobjects.com/zos/rmsportal/OpROPHYqWmrMDBFMZtKF.svg" className="code-expand-icon-show"/>
            </span>
          </section>
          {this.state.showCode?<section>
            {/* <div dangerouslySetInnerHTML={this.createMarkup()} class="codeWrapper"></div> */}
          </section>:''}
        </section>
      </div>
    );
  }
}

export default connect()(ModalTableCode);
