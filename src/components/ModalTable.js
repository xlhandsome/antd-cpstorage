import { PureComponent } from 'react';
import { Button,Modal,Table,Form,message } from 'antd';
import PropTypes from 'prop-types';
const FormItem = Form.Item;

class ModalTable extends PureComponent {
	constructor(props) {
		super(props);
		const { getFieldDecorator,getFieldsValue,resetFields } = props.form;
		this.getFieldDecorator = getFieldDecorator;
		this.getFieldsValue = getFieldsValue;
		this.resetFields = resetFields;
		this.state = {
			isInputing:false,
			selectedRowKeys:[...props.tableConfig.selectedRowKeys] || [],
			selectedRows:[...props.tableConfig.selectedRows] || [],
			formValue:{

			},
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
		!isInputing && this.setState({selectedRowKeys:[...selectedRowKeys],selectedRows:[...selectedRows]});
	}

	/**
	 * @function 关闭弹窗
	*/
	closeModal = ()=>{
		const { closeModal } = this.props;
		this.resetAllState();
		typeof closeModal == 'function' && closeModal();
	}

	/**
	 * @function 关闭时重置所有状态
	*/
	resetAllState = ()=>{
		this.resetFields();
		this.setState({
			isInputing:false,
			modalPagination:{
				current:1,
                page:10
			},
			formValue:{

			},
		});
	}

	/**
	 * @function 点击确定
	*/
	modalChoose = ()=>{
		const { onChoose,requiredMsg,isCover,tableConfig:{dataSource = [],type = 'checkbox',rowKey} } = this.props;
		let { selectedRows,selectedRowKeys } = this.state;

		if( requiredMsg && !selectedRows.length ){
			message.error(requiredMsg); 
			return;
		}
		this.resetAllState();
		if( isCover && type == 'radio' ){
			selectedRows = dataSource.filter(item=>item[rowKey] == selectedRowKeys[0]);
		}
		onChoose({
			selectedRowKeys:[...selectedRowKeys],
			selectedRows:[...selectedRows]
		});
	}

	/**
	 * @function 弹窗配置
	*/
	modalConfig = ()=>{
		const { onChoose } = this.props;
		const { title = '',visible = false } = this.props.modalConfig;
		const modalSet = {
			width:800,
			title,
			visible,
			maskClosable:false,
			onOk: this.modalChoose,
			onCancel:this.closeModal,
			className: "ModalX",
		};
		if( typeof onChoose != 'function' ){
			modalSet.footer = [<Button key="footer" onClick={this.closeModal}>关闭</Button>];
		};
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
		},()=>{
			const { formValue,modalPagination } = this.state;
			const { current,page } = modalPagination;
			onSearch({...formValue,page:current,pagesize:page});
		})
	}
	
	/**
	 * @param {mapColumnsFun|Fuction} :列表配置  mapColumnsFun:遍历表头方法
	*/
	tableConfig(mapColumnsFun){
		const { dataSource = [],totalsNum = 0,type = 'checkbox',loading,rowKey,hidePagination,footerSource = [] } = this.props.tableConfig;
		const { modalPagination,selectedRowKeys,selectedRows } = this.state;
		const _this = this;
		const selectChange = (selectedKeysNow, selectedRowsNow)=>{
			const newRows = [...selectedRows,...selectedRowsNow];
			const filterRows = [];
			newRows.map(item=>{
				if( !new Set(filterRows.map(item=>item[rowKey])).has(item[rowKey]) && new Set(selectedKeysNow).has(item[rowKey]) ){
					filterRows.push(item);
				}
			});
			this.setState({
				selectedRows:filterRows,
				selectedRowKeys:selectedKeysNow,
				isInputing:true
			});
			this.forceUpdate();
		};
		const rowSelection_checkBox = {
			type,
			selectedRowKeys,
			onChange:selectChange,
		};
		const rowSelection_radio = {
            type,
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows,test) => {
                this.setState({
                    selectedRowKeys,
					selectedRows,
					isInputing:true
				});
            }
        };
        modalPagination.showTotal = ()=>`共 ${totalsNum} 条`;
		modalPagination.total = totalsNum;
		const isShow = dataSource.length == 0 ? { display: "none" } : { display: "block" };
      
		return function setColumns(columnsList){
			return {
				size:"middle",
				columns:mapColumnsFun(columnsList,footerSource.length),
				dataSource,
				onChange:_this.handleTableChange,
				rowSelection:type == 'null'?null:type == "radio"?rowSelection_radio:rowSelection_checkBox,
				pagination:hidePagination?false:modalPagination,
				loading,
				rowKey:function(record){
					return rowKey && record[rowKey] || record.id;
				},
				onRow:()=>{
					return {
						onClick:(e)=>{
							if( type == 'radio' ){
								e.currentTarget.getElementsByClassName("ant-radio-wrapper")[0].click();
							}else{
								e.currentTarget.getElementsByClassName("ant-checkbox-wrapper")[0].click();
							}
						}
					}
				},
				footer:footerSource.length && dataSource.length?() => {
					return (
					  	<Table
							showHeader={false}
							columns={columnsList.map(item=>{
								const columnsItem = {
									align:'center',
									title:item.name,
									dataIndex:item.key,
									key:item.keykey,
									width:90
								};
								return columnsItem;
							})}	
							dataSource={footerSource}
							rowKey={record => record[rowKey] || record.id}
							pagination={false}
							style={isShow}
						/>
					);
				}:null
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
		const { page:pagesize } = this.state.modalPagination;
		searchComponent.length && searchComponent.push(
			<FormItem key="last">
				<Button
					type="primary"
					htmlType="submit"
					icon="search"
					onClick={()=>{
						this.setState({
							modalPagination:{
								...this.state.modalPagination,
								current:1
							},
							formValue:{
								...this.getFieldsValue()
							}
						});
						onSearch({
							...this.getFieldsValue(),
							page:1,
							pagesize
						});
					}}
				>
					查询
				</Button>
			</FormItem>
		);
		return searchComponent;
	}

	/**
	 * @param {columnsList|Array} :渲染列表头部 columnsList:表头数组
	 */
	mapColumnsFun = (columnsList = [],fixWidth)=>{
        return columnsList.map((item,index)=>{
            const columnsItem = {
                align:'center',
                title:item.name,
                dataIndex:item.key,
                key:item.keykey,
			};
			if( fixWidth ) {
				columnsItem.width = 90;
			}
			if( item.name == '序号' ){
				columnsItem.render = function(text,record,cdex){
					return <span>{cdex+1}</span>
				}
			};
            return columnsItem;
        })
	}	

    render() {
		const { searchList } = this.props;
		const { columnsList } = this.props.tableConfig;
        return (
            <Modal {...this.modalConfig()}>
				<div>
					<div>
						<Form layout="inline">
							{ this.renderSearch() }
						</Form>	
					</div>
					<div className={searchList.length && "mt20"}>
						<div className="tablelist bgcf"> {/*如果table用了scroll属性, 这里再加个scrollTable的样式, 用于解决table内容换行问题*/}
                            <Table
							{ ...this.tableConfig(this.mapColumnsFun)(columnsList) }
						/>
                        </div>
					</div>
				</div>
			</Modal>
        )
    }
};

ModalTable.propTypes = {
	modalConfig:PropTypes.object.isRequired, // 弹窗配置
	tableConfig:PropTypes.object.isRequired, // 列表配置
	closeModal:PropTypes.func.isRequired, // 查询回调
	searchList:PropTypes.array,// 查询组件
	onSearch:PropTypes.func, // 查询回调
	onChoose:PropTypes.func, // 确定回调
};

export default Form.create()(ModalTable);