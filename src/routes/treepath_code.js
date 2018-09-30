import React from 'react';
import { connect } from 'dva';
import { Button,Input,Table,Icon,Tooltip } from 'antd';
import TreePath from '../components/TreePath';

class TreePathCode extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      qrcodeText:''
    }
  }
  onRemove = ()=>{
    this.setState({qrcodeText:''});
  }
  readCompletion = (value)=>{
    this.setState({qrcodeText:value})
  }
  handleSelect = (value)=>{
    console.log(value,"???")
    this.setState({test:value});
  }
  render(){
    const treeData = [
      {
        title:'用户一',
        key:'user1',
        children:[
          {
            title:"香樟园",
            key:'a1'
          },
          {
            title:"秋天不回来",
            key:'a2'
          },
          {
            title:"香水有毒",
            key:'a3'
          },
        ]
      },
      {
        title:'用户二',
        key:'user2',
        children:[
          {
            title:"缘分一道桥",
            key:'b1'
          },
          {
            title:"也不想认输",
            key:'b2'
          },
        ]
      },
      {
        title:'用户三',
        key:'user3',
        children:[
          {
            title:"哈哈",
            key:'c1'
          },
          {
            title:"哈哈哈",
            key:'c2'
          },
        ]
      },
      {
        title:'用户x',
        key:'user4',
        children:[
          {
            title:"流放之路",
            key:'d1'
          },
          {
            title:"红警",
            key:'d2'
          },
          {
            title:"超级赛亚人",
            key:'d3'
          },
        ]
      },
    ]
    return (
      <div>
        <section className="code-box">
          <section className="code-box-demo">
            <TreePath treeData={treeData} handleSelect={this.handleSelect} defaultOpen={true} checkType="checkBox"/>
          </section>
          <section className="code-box-meta markdown">
            <div className="code-box-title">
              <a href="#components-button-demo-basic">树形穿梭框</a>
              <a 
                className="edit-button" 
                href="https://github.com/ant-design/ant-design/edit/master/components/button/demo/basic.md" 
                target="_blank" 
                rel="noopener noreferrer">
                <i className="anticon anticon-edit"></i>
              </a>
            </div>
            <div>
              <p>适合场景：点击左侧树形结构穿梭到右处</p>
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

export default connect()(TreePathCode);
