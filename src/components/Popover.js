import { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './popover.less';
import $ from 'jquery';

class Popover extends Component {
	constructor(props) {
		super(props);
		this.state = {
			popMainShow:false,
			keyName:props.keyName,
			placement:props.placement,
			popContent:props.popContent,
			defaultKey:props.visible && "show" || "",
			defaultVisible:!props.visible,
			linePoint:{},// 画线位置
			canvasStyle:{ // 画布样式
				width:600,
				height:480,
				style:{
			
				}
			}
		}
	}
	/**
	 *
	 *
	 * @function 气泡框默认展示无法关闭的情况下以defaultVisible为显隐条件，并初始化画布信息
	 */
	componentDidMount(){
		if(this.props.visible){
			this.setState({defaultVisible:true},()=>{
				this.debounceFun(this.showContent,"");
			})
		}
	}
	
	/**
	 *
	 *
	 * @param {childrenWrapper|Object} :内容区的dom对象
	 */
	initLineLocation = (childrenWrapper)=>{
		const { linePoint,canvasStyle } = this.state;
		const childWidth = childrenWrapper.width();
		const childHeight = childrenWrapper.height();
		linePoint.left = {
			startX:canvasStyle.width / 2 - childWidth / 2,
			startY:canvasStyle.height /2,
			moveX:canvasStyle.width / 2 - childWidth / 2,
			moveY:canvasStyle.height / 2,
		}

		linePoint.right = {
			startX:canvasStyle.width / 2 + childWidth / 2,
			startY:canvasStyle.height /2,
			moveX:canvasStyle.width / 2 + childWidth / 2,
			moveY:canvasStyle.height / 2,
		}

		linePoint.top = {
			startX:canvasStyle.width / 2 ,
			startY:canvasStyle.height /2 - childHeight / 2,
			moveX:canvasStyle.width / 2 ,
			moveY:canvasStyle.height /2 - childHeight / 2,
		}
		linePoint.bottom = {
			startX:canvasStyle.width / 2 ,
			startY:canvasStyle.height /2 + childHeight / 2,
			moveX:canvasStyle.width / 2 ,
			moveY:canvasStyle.height /2 + childHeight / 2,
		}
	}
	
	/**
	 *
	 *
	 * @function 初始化画布位置以及画线位置
	 */
	getCanvasStyle = ()=>{
		var { canvasStyle } = this.state; 
		const childWidth = $('.childrenWrapper').width();
		const childHeight = $('.childrenWrapper').height();
		if( isNaN(childWidth) ) return;
		const trslateLeft = ( canvasStyle.width - childWidth ) / 2 ;
		const trslateTop = ( canvasStyle.height - childHeight ) / 2 ;
		const trslateLeftPar = 100 * ( trslateLeft / canvasStyle.width );
		const trslateTopPar = 100 * ( trslateTop / canvasStyle.height );
		this.initLineLocation($('.childrenWrapper'));
		canvasStyle.style = {
			transform:`translate(-${trslateLeftPar}%,-${trslateTopPar}%)`
		}
		return canvasStyle
	}
	componentWillReceiveProps(nextProps){
		const { visible } = nextProps;
		if( visible ){
			if( this.moveLine ){
				return;
			}
			this.debounceFun(this.showContent,"");
		}else{
			this.setState({popMainShow:false});
		}
	}
	shouldComponentUpdate(nextProps){
		const { visible } = nextProps;
		if( this.moveLine && visible ) {
			return false;
		}
		return true;
	}
	/**
	 *
	 *
	 * @param {(func,scope)|(Function,String)} :防抖函数触发延迟 1000s
	 */
	debounceFun = (func,scope)=>{
		const p = this.state.placement;
        if( this[p] ) clearTimeout(this[p]);
        this[p] = setTimeout(()=>{
            func.call(this,scope);
        },1000);
	}
	/**
	 *
	 *
	 * @param {(ctx,p)|(Object,String)} 动画逻辑代码 ctx:画布对象 p:气泡框方位
	 */
	drawLine = (ctx,p)=>{
		const linePoint = this.state.linePoint;
		let { startX,startY,moveX,moveY } = linePoint[p];
		function lineTo(){
			ctx.lineTo(linePoint[p].moveX,linePoint[p].moveY);
			ctx.stroke();
		}
		switch(p){
			case 'left':
				if( moveX > startX - 40 ){
					linePoint[p].moveX = moveX - 2;
				}else if( moveX <= startX - 40 && moveY < startY + 40 ){
					linePoint[p].moveX = startX - 40;
					linePoint[p].moveY = moveY + 2;
				}else if( moveY >= startY + 40 && moveX > startX - 80 ){
					linePoint[p].moveX = moveX - 2;
					linePoint[p].moveY = startY + 40;
				}else if( moveX <= startX - 80 ){
					linePoint[p].moveX = startX - 80;
				}
				lineTo();
				if( moveX <= startX - 80 ) return true;
				break;
			case 'top':
				if( moveY > startY - 40 ){
					linePoint[p].moveY = moveY - 2;
				}else if( moveY <= startY - 40 && moveX < startX + 40 ){
					linePoint[p].moveY = startY - 40;
					linePoint[p].moveX = moveX + 2;
				}else if( moveX >= startX + 40 && moveY > startY - 80 ){
					linePoint[p].moveY = moveY - 2;
					linePoint[p].moveX = startX + 40;
				}else if( moveY <= startY - 80 ){
					linePoint[p].moveY = startY - 80;
				}
				lineTo();
				if( moveY <= startY - 80 ) return true;
				break;
			case 'right':
				if( moveX < startX + 40 ){
					linePoint[p].moveX = moveX + 2;
				}else if( moveX >= startX + 40 && moveY < startY + 40 ){
					linePoint[p].moveX = startX + 40;
					linePoint[p].moveY = moveY + 2;
				}else if( moveY >= startY + 40 && moveX < startX + 80 ){
					linePoint[p].moveX = moveX + 2;
					linePoint[p].moveY = startY + 40;
				}else if( moveX >= startX + 80 ){
					linePoint[p].moveX = startX + 80;
				}
				lineTo();
				if( moveX >= startX + 80 ) return true;
				break;
			case 'bottom':
				if( moveY < startY + 40 ){
					linePoint[p].moveY = moveY + 2;
				}else if( moveY >= startY + 40 && moveX < startX + 40 ){
					linePoint[p].moveY = startY + 40;
					linePoint[p].moveX = moveX + 2;
				}else if( moveX >= startX + 40 && moveY < startY + 80 ){
					linePoint[p].moveY = moveY + 2;
					linePoint[p].moveX = startX + 40;
				}else if( moveY >= startY + 80 ){
					linePoint[p].moveY = startY + 80;
				}
				lineTo();
				if( moveY >= startY + 80 ) return true;
				break;			
		}
	}
	/**
	 *
	 *
	 * @param {(ctx,p)|(Object,String)} 画线定时器 ctx:画布对象 p:气泡框方位
	 */
	lineInterval = (ctx,p)=>{
		ctx.strokeStyle = 'rgb(64, 64, 64,0.75)';// 画线颜色
		new Promise((resolve,reject)=>{
			this.moveLine = setInterval(()=>{
				const isOver = this.drawLine(ctx,p);
				if( isOver ){
					clearInterval(this.moveLine);
					this.moveLine = "";
					resolve();
				}
			},2);
		}).then(()=>{
			const visible = this.props.visible;
			if( visible ){
				this.setState({popMainShow:true})
			}
		});
	}
	/**
	 *
	 *
	 * @function 创建画布入口并画线 
	 */
	showContent = ()=>{
		if( !this.props.visible || this.moveLine ){
			return;
		}
		let {placement:p,keyName,linePoint} = this.state;
		let { startX,startY } = linePoint[p];
		for( var key in linePoint ){
			linePoint[key].moveX = linePoint[key].startX;
			linePoint[key].moveY = linePoint[key].startY;
		}
		var canvas = document.getElementById(keyName);
		if( canvas == null ){
			return;
		}
		var ctx = canvas.getContext("2d");
		ctx.beginPath();
		ctx.moveTo(startX, startY);
		this.lineInterval(ctx,p);
	}
	/**
	 *
	 *
	 * @function 气泡框位置 
	 */
	getContentStyle = ()=>{
		var p = this.state.placement;
		const childWidth = $('.childrenWrapper').width();
		const childHeight = $('.childrenWrapper').height();
			
		switch(p){
			case 'left':
				return {
					style:{
						top:childHeight/2 + 40,
						left:-80,
						transform: "translate(-100%,-50%)"
					}
				}
			case 'top':
				return {
					style:{
						left:childWidth/2 + 40,
						top:-80,
						transform: "translate(-50%,-100%)"
					}
				}
			case 'right':
				return {
					style:{
						top:childHeight/2 + 40,
						right:-80,
						transform: "translate(100%,-50%)"
					}
				}	
			case 'bottom':
				return {
					style:{
						left:childWidth/2 + 40,
						bottom:-80,
						transform: "translate(-50%,100%)"
					}
				}
		}
	}
    render() {
		const { popMainShow,keyName,popContent,defaultKey,defaultVisible } = this.state;
		const { visible,} = this.props;
		let isShowCanvas = defaultKey == "show"?defaultVisible:visible; // 气泡默认展示时使用defaultVisible状态显隐
        return (
			<div style={{margin:'0 auto'}}>
				<div className={styles.popWrapper}>
					<div className={styles.popover}>
						{
							isShowCanvas?<canvas id={keyName} className={styles.canvasWrapper} {...this.getCanvasStyle()} />:''
						}
						{
							popMainShow?<div className={`${styles.popMainShow} ant-tooltip-inner `} {...this.getContentStyle()}>
									{ popContent }
								</div>:''
						}
					</div>
					<div className={`${styles.componentWrapper} childrenWrapper`}>
						{this.props.children}
					</div>
				</div>
			</div>
        )
    }
};

Popover.propTypes = {
	keyName:PropTypes.string, // 气泡id
	placement:PropTypes.string.isRequired,// 气泡方向
	visible:PropTypes.bool.isRequired,// 气泡是否显示
	popContent:PropTypes.string,// 气泡框内容
};

export default Popover;