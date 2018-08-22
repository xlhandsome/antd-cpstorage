import { PureComponent } from 'react';
import { Modal,Table,Input,Form,Card  } from 'antd';
import PropTypes from 'prop-types';
import styles from './dropdownload.less';
const FormItem = Form.Item;
@Form.create()

class DropDownLoad extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			lastTop:0,
			maxTop:0,
			imgIndex:this.getMaxNumsOnRow() * this.getMaxNumsOnCol() + 1,// 初始阈值
		}
		console.log(this.getMaxNumsOnRow() * this.getMaxNumsOnCol() + 1,"???")
	}
	scrollHandler = this.handleScroll.bind(this);
	componentDidMount() {
		var srcollWrapper = document.getElementsByClassName('srcollWrapper')[0]; 
		this.bindEventListener(srcollWrapper,'scroll');
	}
	/**
	 * @config 初始化滑动区域
	*/
	configScrollArea(){
		const { visibleWidth,visibleHeight } = this.props;
		return {
			style:{
				width:visibleWidth,
				height:visibleHeight
			}
		}
	}
	/**
	 * @param {dom,key|Object,String} * dom:需要添加监听事件的dom元素 key:所监听的事件
	*/
	bindEventListener = (dom,key)=>{
		dom.addEventListener(key, this.scrollHandler);
	}
	// 获取初始时图片放置的最少数量
	getMaxNumsOnCol = ()=>{
		const { visibleHeight,imgAttr:{height:i_height} } = this.props;
		return Math.ceil(visibleHeight / ( i_height + 30 ));// 最大高度除图片高度加自身外边距
	}
	// 获取行数最大图片数量: 阈值基数
	getMaxNumsOnRow = ()=>{
		const { visibleWidth,imgSources,imgAttr:{width:i_width} } = this.props;
		const imgNum = imgSources.length; // 图片个数
		return Math.floor(visibleWidth / ( i_width + 40 )); // 最大宽度除图片宽度加自身内边距
	}
	/**
	 * @param {nextTop|Number} * nextTop:当前滑动条距顶部距离
	*/
	_handleScroll = (nextTop)=> {
		const { imgAttr:{height:i_height} } = this.props;
		const { lastTop,maxTop,imgIndex } = this.state;
		const topDiff = nextTop - lastTop;
		// 当滑动距离超过图片自身高度 + 20偏移值 && 当前滑动属于最新的最大滑动（考虑用户移上去又滑下来）
		if( topDiff > (i_height + 20) && nextTop >= maxTop ){
			const maxRowNums = this.getMaxNumsOnRow();
			this.setState({imgIndex:imgIndex + maxRowNums,maxTop:nextTop,lastTop:nextTop});
		}
	}
	/**
	 * @param {event|Object} * event:触发滑动的dom元素本身
	*/
	handleScroll(event) {
		let scrollTop = event.srcElement.scrollTop;
		this._handleScroll(scrollTop);
	}
	/**
	 * @function 图片渲染
	*/
	createImg = ()=>{
		const { imgIndex } = this.state;
		const { imgSources,imgAttr:{width:i_width,height:i_height} } = this.props;
		return imgSources.map((item,index)=>{
			const src = item.path;
			// 根据阈值进行渲染
			if( index + 1 <= imgIndex ){
				return	<div className={styles.cardBox} key={index}>
							<Card
								key={index}
								hoverable
								style={{ width: i_width,height:i_height }}
								cover={<img alt="example" src={src} />}
							>
							</Card>
						</div>
			}else{
				return '';
			}
		})
		
	}
	
    render() {
		
        return (
           <div className="srcollWrapper" {...this.configScrollArea()}>
				{ this.createImg() }
		   </div>
        )
    }
}

DropDownLoad.propTypes = {
	visibleWidth:PropTypes.number.isRequired, // 可视区域宽度
	visibleHeight:PropTypes.number.isRequired,// 可视区域高度
	imgAttr:PropTypes.objectOf(PropTypes.number).isRequired, // 图片的宽高
	imgSources:PropTypes.array.isRequired,// 图片路径集合
}
export default DropDownLoad;