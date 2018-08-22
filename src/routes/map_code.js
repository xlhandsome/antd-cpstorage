import React from 'react';
import { connect } from 'dva';
import { Button,Input,Table } from 'antd';
import MapSearch from '../components/MapItem';

class DropDownCode extends React.Component{
    constructor(props){
        super(props);
        this.state = {
      
        }
    }
    MapConfig(){
        const citySource = [
            {
                value: '江苏',
                label: '江苏',
                children: [{
                    value: '苏州',
                    label: '苏州',
                    children: [{
                        value:'姑苏区',
                        label: '姑苏区',
                        code:'320508'
                    }],
                }],
            }, 
            {
                value: '浙江',
                label: '浙江',
                children: [{
                    value: '杭州',
                    label: '杭州',
                    children: [{
                        value: '西湖区',
                        label: '西湖区',
                        code:'330106'
                    }],
                }],
            }, 
            {
                value: '香港特别行政区',
                label: '香港特别行政区',
                children: [{
                    value:'九龙城区',
                    label: '九龙城区',
                    code:'810007'
                }],
            }
        ];
        return {
            citySource,
        }
    }
    render(){
        return (
            <div>
                <section className="code-box">
                <section className="code-box-demo">
                    <MapSearch {...this.MapConfig()}/>
                </section>
                <section className="code-box-meta markdown">
                    <div className="code-box-title">
                    <a href="#components-button-demo-basic">地图</a>
                    <a 
                        className="edit-button" 
                        rel="noopener noreferrer">
                        <i className="anticon anticon-edit"></i>
                    </a>
                    </div>
                    <div>
                    <p>适合场景：地图搜索</p>
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
