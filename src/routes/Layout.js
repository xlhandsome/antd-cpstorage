import React from 'react';
import styles from './Layout.less';
import SiderComponent from '../components/Sider';
import { Layout } from 'antd';

const { Content } = Layout;

class Layouts extends React.Component{
  constructor(props){
    super(props)
  }
  render(){
    return (
      <div className={styles.box}>
          <div className={styles.left}>
            <SiderComponent/>
          </div>
          <div className={styles.right}>
            <Content>
              {this.props.children}
            </Content>
          </div>
      </div>
    );
  }
}

export default Layouts;
