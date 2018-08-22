import React from 'react';
import { connect } from 'dva';
import { Button,Input,Table,Icon,Tooltip } from 'antd';
import QRcodeRead from '../components/QRcodeRead';

class QRcodeReadCode extends React.Component{
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
  render(){
    return (
      <div>
        <section className="code-box">
          <section className="code-box-demo">
            <div className="qrcodeWrapper">
              <QRcodeRead
                onRemove={this.onRemove}
                readCompletion={this.readCompletion}
              />
            </div>
            <div className="qrcodeTextBox">
              <span>解 析:</span>
              <Tooltip placement="topLeft" title={this.state.qrcodeText}>
                <Input
                  placeholder="show qrcode meaning"
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  value={this.state.qrcodeText}
                />
              </Tooltip>
            </div>
          </section>
          <section className="code-box-meta markdown">
            <div className="code-box-title">
              <a href="#components-button-demo-basic">二维码识别</a>
              <a 
                className="edit-button" 
                href="https://github.com/ant-design/ant-design/edit/master/components/button/demo/basic.md" 
                target="_blank" 
                rel="noopener noreferrer">
                <i className="anticon anticon-edit"></i>
              </a>
            </div>
            <div>
              <p>适合场景：用户上传的图片马上识别其中的信息</p>
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

export default connect()(QRcodeReadCode);
