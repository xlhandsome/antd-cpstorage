import React from 'react';
import { connect } from 'dva';
import { Button,Card } from 'antd';
import Popover from '../components/Popover';

class PopoverCode extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      visible:false
    }
  }
  controlPop = (value)=>{
    this.setState({visible:value});
  }
  render(){
    return (
      <div>
        <section className="code-box">
          <section className="code-box-demo">
            <div className="qrcodeWrapper" style={{margin:'0 auto',display:'block'}}>
              <Card
                style={{width:'200px'}}
                title="这里是头部的介绍"
              >
                <Popover
                  popContent="内容区不能超过80字"
                  visible={true}
                  keyName="headerPopover"
                  placement="left"
                >
                  <div>内容区</div>
                </Popover>
              </Card>
            </div>
          </section>
          <section className="code-box-meta markdown">
            <div className="code-box-title">
              <a href="#components-button-demo-basic">线条气泡</a>
              <a 
                className="edit-button" 
                href="https://github.com/ant-design/ant-design/edit/master/components/button/demo/basic.md" 
                target="_blank" 
                rel="noopener noreferrer">
                <i className="anticon anticon-edit"></i>
              </a>
            </div>
            <div>
              <p>适合场景：线条气泡展示</p>
              <p>提供上、下、左、右四种方向,以及默认展示和开关展示</p>
            </div>
          </section>
        </section>
      </div>
    );
  }
}

export default connect()(PopoverCode);
