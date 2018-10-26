import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input,Tree,Icon,Radio } from 'antd';
import { message } from "antd/lib/index";
import styles from './treepath.less';;

const TreeNode = Tree.TreeNode;
const Search = Input.Search;
const RadioGroup = Radio.Group;

class TreePath extends PureComponent {
  constructor(props) {
    super(props);
    this.handleSelect = props.handleSelect;
    this.state = {
      visualList:[],
      generateList:this.generateList(props.treeData),
      expandedKeys:props.defaultOpen?this.defaultOpenAll(props.treeData):[],
      searchValue:'',
      autoExpandParent:true
    }
  }
  defaultOpenAll = (treeData)=>{
    const parentKey = [];
    const mapParent = (row)=>{
      row.map(item=>{
        if( item.children ){
          parentKey.push(item.key);
          mapParent(item.children);
        }
      })
    }
    mapParent(treeData);
    return parentKey;
  }
  //将树型数据转成一般排列
  generateList = (list)=>{
    const rowList = [];
    const generateFun = (row)=>{
      for( let i = 0;i<= row.length -1;i++ ){
        const node = row[i];
        const { key,title,children } = node;
        rowList.push({key,title,isHasChild:children?true:false});
        if( children ){
          generateFun(children);
        }
      }
    }
    generateFun(list);
    return rowList;
  }
  //获取当前key的上层key
  getParentKey = (key)=>{
    let parentKey;
    const { treeData } = this.props;
    const mapParent = (row)=>{
      for( let i = 0;i< row.length;i++ ){
        const node = row[i];
        if( node.children ){
          if( node.children.some(item=>item.key == key) ){
            parentKey = node.key;
          }else if( mapParent(node.children) ){
            parentKey = mapParent(node.children);
          }
        }
      }
    }
    mapParent(treeData);
    return parentKey;
  }
  //输入框搜索
  onSearch = (e)=>{
    let value = e.target.value;
    let { generateList,visualList } = this.state;
    let expandedKeys = generateList.map((item,index)=>{
      if( item.title.indexOf(value) > -1 ){
        return this.getParentKey(item.key);
      }
    }).filter(item=>item);
    if( visualList.length ){
      visualList = visualList.sort((a,b)=>{
        if( a.title.indexOf(value) > -1 && b.title.indexOf(value) == -1 ){
          return 1;
        }else if( a.title.indexOf(value) == -1 && b.title.indexOf(value) > -1 ){
          return -1;
        }
        return 0;
      })
    }
    this.setState({
      searchValue:value,
      expandedKeys:[...new Set(expandedKeys)],
      visualList
    })
  }
  //复选框勾选
  onCheck = (checkedKeys) => {
    let { generateList } = this.state;
    let handleSelectList = generateList.filter(item=>new Set(checkedKeys).has(item.key) && !item.isHasChild);
    this.handleSelect([...handleSelectList]);
    this.setState({
      visualList:handleSelectList
    })
  }
  //渲染右侧
  renderVisualList = ()=>{
    let { visualList,generateList } = this.state;
    const removeSelect = (item)=>{
      visualList = visualList.filter(that=>that.key != item.key && this.getParentKey(item.key) != that.key);
      this.handleSelect([...visualList]);
      this.setState({visualList,radioKey:''});
      this.forceUpdate();
    }
    let rightContent = [];
    visualList.map((item,index)=>{
      const { children,title } = item;
      if( !children ){
        let { showTitle,isGet } = this.getShowTitle(title,item,true);
        let line = (
          <div className={styles.selectedLine} key={index}>
            <Icon type="shop" theme="outlined" />
            {showTitle}
            <div onClick={()=>removeSelect(item)} className={styles.closeIcon}>x</div>
          </div>
        )
        if( isGet ){
          rightContent.unshift(line);
        }else{
          rightContent.push(line);
        }
      }
    })
    if( !rightContent.length ){
      rightContent.push(
        <img src="http://localhost:8000/img/shop2.png"/>
      )
    }
    return rightContent;
  }
  getColorStr = (str,index,value)=>{
    const beforeStr = str.substr(0,index);
    const afterStr = str.substr(index + value.length);
    return index > -1 && value?<span>
    <span>{beforeStr}</span>
    <span style={{color:'rgba(248,89,89,1)'}}>{value}</span>
    <span>{afterStr}</span>
    </span>:<span>{str}</span>
  }
  //搜索时字体颜色显示
  getShowTitle = (title='',item,showRight)=>{
    let [
      searchValue,
      checkType,
      index,
      icon
    ] = [
      this.state.searchValue,
      this.props.checkType,
      title.indexOf(this.state.searchValue),
      item.children?<Icon type="user" theme="outlined" />:<Icon type="shop" theme="outlined" />
    ];
    let colorStr = this.getColorStr(title,index,searchValue);
    if( showRight ){
      return { showTitle:<span>{colorStr}</span>,isGet:index > -1 };
    }else if(checkType == 'checkBox'){
      return <span>{icon}{colorStr}</span>;
    }else if(checkType == 'radio'){
      return item.children?<span><Icon type="user" theme="outlined" />{colorStr}</span>:<span><Icon type="shop" theme="outlined" /><Radio value={item.key}>{colorStr}</Radio></span>;
    }
  }
  //渲染左侧
  renderTree = list=>list.map((item,i)=>{
    let { key,children,title } = item;
    let showTitle = this.getShowTitle(title,item);
    if( children ){
      return (<TreeNode title={showTitle} key={key}>
               {
                 this.renderTree(children)
               }
             </TreeNode>);
    }
    return (<TreeNode title={showTitle} key={key}/>);
  })
  //父级节点展开
  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false
    });
  };
  radioCheck = key =>{
    const { generateList } = this.state;
    const visualList = generateList.filter(item=>item.key == key);
    this.handleSelect([...visualList]);
    this.setState({
      visualList,
      radioKey:key
    })
  }
  renderDiff = (DefaultComponet)=>{
    return (Component)=>{
      if( typeof Component == 'function' ){
        const { radioKey } = this.state;
        return  <Component onChange={(e)=>this.radioCheck(e.target.value)} value={radioKey}>
                  <DefaultComponet/>
                </Component>
      }else{
        return  <DefaultComponet/>;
      }
    }
  }
  render() {
    const { visualList,expandedKeys,autoExpandParent } = this.state;
    const { treeData,checkType } = this.props;
    const checkedKeys = visualList.map((item)=>item.key);
    const TreeDom = ()=>{
      return <Tree
        checkable={checkType == 'radio'?false:true}
        onExpand={this.onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        onSelect={this.onSelect}
        onCheck={this.onCheck}
        checkedKeys={checkedKeys}
      >
      {
        this.renderTree(treeData)
      }
      </Tree>
    }
    return (
      <div className={styles.treeWrapper}>
        <div className={styles.treeSelectBox}>
          <div className={styles.searchBox}>
            <Search placeholder="搜索部门" onChange={this.onSearch}/>
          </div>
          <div className={styles.controlBox}>
            {
              checkType == 'radio'?this.renderDiff(TreeDom)(RadioGroup):TreeDom()
            }
          </div>
        </div>
        <div className={styles.treeVisualBox}>
          <h4>已选的门店</h4>
          <div className={styles.selectedBox}>
            {this.renderVisualList()}
          </div>
        </div>
      </div>
    );
  }
}

TreePath.propTypes = {
  treeData:PropTypes.array.isRequired, // 移除后回调
  handleSelect:PropTypes.func.isRequired, // 识别后回调
  defaultOpen:PropTypes.bool,// 是否默认展示所有父节点
  checkType:PropTypes.string.isRequired,// 选择框类型 radio 单选 checkBox 复选
}

export default TreePath;
