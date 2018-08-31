import { Menu, Icon, Switch } from 'antd';
import React from 'react';
import { menuConfig } from '../../public/common/common';
const SubMenu = Menu.SubMenu;

class Sider extends React.Component {
  state = {
    theme: 'light',
    current: '0',
  }
  changeTheme = (value) => {
    this.setState({
      theme: value ? 'dark' : 'light',
    });
  }
  handleClick = (e) => {
    console.log('click ', e);
    this.setState({
      current: e.key,
    });
  }
  mapMenu = ()=>{
    return menuConfig.map((item,index)=>{
      return <Menu.Item key={item.path}>
              <a href={item.path}>{item.name}</a>
             </Menu.Item>
    })
  }
  render() {
    const path = `/${window.location.hash}`;
    console.log(path,"???")
    return (
      <div style={{height:'100%'}}>
        <Switch
          checked={this.state.theme === 'dark'}
          onChange={this.changeTheme}
          checkedChildren="Dark"
          unCheckedChildren="Light"
        />
        <br />
        <br />
        <Menu
          theme={this.state.theme}
          onClick={this.handleClick}
          style={{ width: '100%' }}
          defaultOpenKeys={['sub1']}
          selectedKeys={[path]}
          mode="inline"
        >
          <SubMenu key="sub1" title={<span><Icon type="cloud" /><span>组件</span></span>}>
            { this.mapMenu() }
          </SubMenu>
        </Menu>
      </div>
    );
  }
}
export default Sider;