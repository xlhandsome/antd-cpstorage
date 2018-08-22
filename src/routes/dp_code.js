import React from 'react';
import { connect } from 'dva';
import { Button,Input,Table } from 'antd';
import DropDownLoad from '../components/DropDownLoad';

class DropDownCode extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      
    }
  }
  dropDownLoadConfig(){
    return {
      loadingSrc:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1534270478179&di=94d5518b3538f0530b61f3c5a4c3316e&imgtype=0&src=http%3A%2F%2Fs6.sinaimg.cn%2Fmw690%2F001mWx81gy6GMysWYCN05%26690',
      visibleHeight:300,
      visibleWidth:400,
      imgAttr:{
        height:200,
        width:180
      },
      imgSources:[
        {name:'美女1',path:'http://i1.umei.cc/uploads/tu/201807/10182/19.jpg'},
				{name:'美女2',path:'http://i1.umei.cc/uploads/tu/201807/10058/777.jpg'},
				{name:'美女3',path:'http://i1.umei.cc/uploads/tu/201806/10009/5420ed3588_7.jpg'},
				{name:'美女4',path:'http://i1.umei.cc/uploads/tu/201611/819/lx0qs13xbag.jpg'},
				{name:'美女5',path:'http://i1.umei.cc/uploads/tu/201801/10404/1673dfabc2.jpg'},
        {name:'美女6',path:'http://i1.umei.cc/uploads/tu/201804/10000/84eff01402.jpg'},
        {name:'美女7',path:'http://i1.umei.cc/uploads/tu/201806/10010/e84da2dbdc.jpg'},
        {name:'美女8',path:'http://i1.umei.cc/uploads/tu/201712/10031/20bc7cbfd4.jpg'},
        {name:'美女9',path:'http://i1.umei.cc/uploads/tu/201712/10063/206791b4ef.jpg'},
        {name:'美女10',path:'http://i1.umei.cc/uploads/tu/201704/9999/rnb19bac5bd4.jpg'},
      ]
    }
  }
  render(){
    return (
      <div>
        <section className="code-box">
          <section className="code-box-demo">
            <DropDownLoad {...this.dropDownLoadConfig()}/>
          </section>
          <section className="code-box-meta markdown">
            <div className="code-box-title">
              <a href="#components-button-demo-basic">下拉加载</a>
              <a 
                className="edit-button" 
                rel="noopener noreferrer">
                <i className="anticon anticon-edit"></i>
              </a>
            </div>
            <div>
              <p>适合场景：下拉加载图片，优化图片加载性能</p>
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

export default connect()(DropDownCode);
