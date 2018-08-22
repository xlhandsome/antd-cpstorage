import { PureComponent } from 'react';
import { Button,Modal,Table,Input,Form } from 'antd';
import PropTypes from 'prop-types';
const FormItem = Form.Item;
@Form.create()

class ModalTable extends PureComponent {
	constructor(props) {
		super(props);
		const { getFieldDecorator,getFieldsValue,resetFields } = props.form;
		this.getFieldDecorator = getFieldDecorator;
		this.getFieldsValue = getFieldsValue;
		this.resetFields = resetFields;
		this.state = {
			isInputing:false,
			selectedRowKeys:props.tableConfig.selectedRowKeys || [],
			selectedRows:props.tableConfig.selectedRows || [],
			modalPagination:{
                current:1,
                page:10
            },
		}
	}

	componentWillReceiveProps(nextProps){
		/**
		 * @description  查询输入的时候会触发该方法导致当前点击项丢,用此方法只要是输入的时候就不更新selectedRowKeys
		*/
		const { selectedRowKeys = [],selectedRows = [] } = nextProps.tableConfig;
		let isInputing = this.state.isInputing,searchParams = this.getFieldsValue();
		for( var key in searchParams ){
			if( searchParams[key] !== null ) isInputing = true;
		}
		!isInputing && this.setState({selectedRowKeys,selectedRows});
	}

	/**
	 * @function 关闭弹窗
	*/
	closeModal = ()=>{
		const { closeModal } = this.props;
		this.resetFields();
		this.setState({isInputing:false});
		typeof closeModal == 'function' && closeModal();
	}

	/**
	 * @function 点击确定
	*/
	modalChoose = ()=>{
		const { onChoose } = this.props;
		this.resetFields();
		this.setState({isInputing:false});
		onChoose({
			selectedRowKeys:this.state.selectedRowKeys,
			selectedRows:this.state.selectedRows
		});
	}

	/**
	 * @config 弹窗配置
	*/
	modalConfig = ()=>{
		const { onChoose } = this.props;
		const { title = '',visible = false } = this.props.modalConfig;
		const modalSet = {
			width:'66%',
			title,
			visible,
			onCancel:this.closeModal
		};
		if( typeof onChoose != 'function' ){
			modalSet.footer = [<Button onClick={this.closeModal}>关闭</Button>]
		}else{
			modalSet.footer = [
				<Button onClick={this.closeModal}>取消</Button>,
				<Button onClick={this.modalChoose} type="primary">确定</Button>
			]
		}
		return modalSet;
	}

	/**
	 * @function 翻页事件
	*/
	handleTableChange = (pagination, filters, sorter)=>{
		const { onSearch } = this.props;
        this.setState({
            modalPagination:{
                page:pagination.page,
                current:pagination.current,
                total:pagination.total
            }
		},()=>onSearch(this.getFieldsValue(),this.state.modalPagination));
	}
	
	/**
	 * @config 列表配置
	*/
	tableConfig(mapColumnsFun){
		const { dataSource = [],totalsNum = 0,type = 'checkbox',loading,rowKey } = this.props.tableConfig;
		const { modalPagination,selectedRows,selectedRowKeys } = this.state;
		const _this = this;
        const rowSelection = {
            type,
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectedRowKeys,
					selectedRows,
					isInputing:true
                })
            }
        };
        modalPagination.showTotal = ()=>`共 ${totalsNum} 条`;
		modalPagination.total = totalsNum;
		var that = this;
		return function setColumns(columnsList){
			return {
				columns:mapColumnsFun(columnsList),
				dataSource,
				onChange:_this.handleTableChange,
				rowSelection,
				pagination:modalPagination,
				loading,
				rowKey:function(record){
					return rowKey && record[rowKey] || record.id;
				},
				onRow:(record)=>{
					return {
						onClick: (e) => {
							that.setState({isInputing:true});
							if( type == 'checkbox' ){
								e.currentTarget.getElementsByClassName("ant-checkbox-wrapper")[0].click();
							}else if( type == 'radio' ){
								e.currentTarget.getElementsByClassName("ant-radio-wrapper")[0].click();
							}
						},
					}
				}
			}
		}
	}

	/**
	 * @function 渲染搜索条件
	 */
	renderSearch(){
		const { searchList,onSearch } = this.props;
		const searchComponent =  searchList.map((item,index)=>{
			return  <FormItem label={item.name} key={index}>
						{
							this.getFieldDecorator(item.key,{
								initialValue:null
							})(
								item.component
							)
						}
					</FormItem>
		});
		const { current:page,page:pagesize } = this.state.modalPagination
		searchComponent.push(
			<FormItem>
				<Button
					type="primary"
					htmlType="submit"
					icon="search"
					onClick={()=>onSearch({
						...this.getFieldsValue(),
						page,
						pagesize
					})}
				>
					查询
				</Button>
			</FormItem>
		);
		return searchComponent;
	}

	/**
	 * @function 渲染列表头部
	 */
	mapColumnsFun = (columnsList = [])=>{
        return columnsList.map((item,index)=>{
            const columnsItem = {
                align:'center',
                title:item.name,
                dataIndex:item.key,
                key:item.key
			}
			if( item.name == '序号' ){
				columnsItem.render = function(text,record,cdex){
					return <span>{cdex+1}</span>
				}
			}
            return columnsItem;
        })
	}	

    render() {
		const { columnsList } = this.props.tableConfig;
        return (
            <Modal {...this.modalConfig()}>
				<div>
					<div>
						<Form layout="inline">
							{ this.renderSearch() }
						</Form>	
					</div>
					<div style={{marginTop:'20px'}}>
						<Table
							{ ...this.tableConfig(this.mapColumnsFun)(columnsList) }
							bordered
						/>
					</div>
				</div>
			</Modal>
        )
    }
}

ModalTable.propTypes = {
	modalConfig:PropTypes.object.isRequired, // 弹窗配置
	tableConfig:PropTypes.object.isRequired, // 列表配置
	closeModal:PropTypes.func.isRequired, // 查询回调
	searchList:PropTypes.array,// 查询组件
	onSearch:PropTypes.func, // 查询回调
	onChoose:PropTypes.func, // 确定回调
}
export default ModalTable;