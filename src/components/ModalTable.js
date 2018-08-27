import { PureComponent } from 'react';
import { Button,Modal,Table,Form } from 'antd';
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
		const { onChoose } = this.props;
		this.resetAllState();
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
			maskClosable:false,
			onCancel:this.closeModal
		};
		if( typeof onChoose != 'function' ){
			modalSet.footer = [<Button onClick={this.closeModal}>关闭</Button>]
		}else{
			modalSet.footer = [
				<Button onClick={this.closeModal} key="cancel">取消</Button>,
				<Button onClick={this.modalChoose} type="primary" key="confirm">确定</Button>
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
		},()=>{
			const { formValue,modalPagination } = this.state;
			const { current,page } = modalPagination;
			onSearch({...formValue,page:current,pagesize:page});
		})
	}
	
	/**
	 * @config 列表配置
	*/
	tableConfig(mapColumnsFun){
		const { dataSource = [],totalsNum = 0,type = 'checkbox',loading,rowKey } = this.props.tableConfig;
		const { modalPagination,selectedRowKeys,selectedRows } = this.state;
		const _this = this;
		const checkHandle = (record,selected,index)=>{
            for( var item of dataSource ){
                if( record[rowKey]== item[rowKey] ){
                    item.icCheck = selected;
                }
            }
            if( selected ){
                let isHad = false;
                selectedRowKeys.map((item,index)=>{
                    if( item == record[rowKey]  ) isHad = true;
                })
                if( !isHad ){
                    selectedRowKeys.push(record[rowKey]);
                    selectedRows.push(record);
                }
            }else{
                selectedRowKeys.map((item,index)=>{
                    if( item == record[rowKey] ) selectedRowKeys.remove(index);
                })
                selectedRows.map((item,index)=>{
                    if( item[rowKey] == record[rowKey]  ) selectedRows.remove(index);
                })
			}
			this.setState({
				selectedRowKeys,
				selectedRows,
				isInputing:true
			});
			this.forceUpdate();
		}
		const rowSelection_checkBox = {
			type,
            selectedRowKeys,
            onSelect:checkHandle,
            onSelectAll:(selected, selectedRowsNull, changeRows)=>{
                for( var item of dataSource ){
                    item.icCheck = selected;
                }
                const selectComb = selectAll(selected,changeRows,selectedRowKeys,selectedRows,rowKey);
				this.setState({
					selectedRowKeys:selectComb[0],
					selectedRows:selectComb[1],
					isInputing:true
				});
				this.forceUpdate()
            }
		};
		const rowSelection_radio = {
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
			if( dataSource && dataSource.length && type != "radio" ){
				that.makeSign(dataSource);
			}
			return {
				size:"middle",
				columns:mapColumnsFun(columnsList),
				dataSource,
				onChange:_this.handleTableChange,
				rowSelection:type == "radio"?rowSelection_radio:rowSelection_checkBox,
				pagination:modalPagination,
				loading,
				rowKey:function(record){
					return rowKey && record[rowKey] || record.id;
				},
				onRow:(record)=>{
					return {
						onClick:(e)=>{
							if( type == 'radio' ){
								e.currentTarget.getElementsByClassName("ant-radio-wrapper")[0].click();
							}else{
								record.icCheck = !record.icCheck;
								checkHandle(record,record.icCheck);
							}
						}
					}
				}
			}
		}
	}
	/**
     * @function   根据selectRowKeys给列表数据打上选择标志.
     * 1.每一次查询调getShopGuideList接口时都要将新得到的列表数据打上标记.
     * 2.每一次改变selectedRowKeys时也需要打上标记.
     */
    makeSign(dataSource){
        const { selectedRowKeys } = this.state;
        const { rowKey } = this.props.tableConfig;
        for( var item of dataSource ){
			let isHas = false;
			const isHasKey = (pl)=>{
				if( pl == item[rowKey] ){
                    item.icCheck = true;
                    isHas = true;
                }
			}
			arrayEnum(isHasKey)(selectedRowKeys);
            if( !isHas ) item.icCheck = false;
        };
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
		const { page:pagesize } = this.state.modalPagination
		searchComponent.push(
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
						})
					}}
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
			};
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
};

ModalTable.propTypes = {
	modalConfig:PropTypes.object.isRequired, // 弹窗配置
	tableConfig:PropTypes.object.isRequired, // 列表配置
	closeModal:PropTypes.func.isRequired, // 查询回调
	searchList:PropTypes.array,// 查询组件
	onSearch:PropTypes.func, // 查询回调
	onChoose:PropTypes.func, // 确定回调
};


/**

 * @param {function|mapFun}  	数组遍历
 * @param {function|filterFun}  数组筛选
 */
function arrayEnum(mapFun,filterFun){
    if( typeof filterFun != 'function' ){
        filterFun = () => true;
    };
    if( typeof mapFun != 'function' ){
        mapFun = item => item;
    };
    return function(array = []){
        return array.filter(filterFun).map(mapFun);
    };
}
/**
 *
 *
 * @param {boolean|selected}  是否勾选全选,antd组件返回
 * @param {array|changeRows}  当前页改变的rows,antd组件返回
 * @param {array|selectedRowKeys}  目前为止选中的key数组
 * @param {array|selectedRows}  目前为止选中的row数组
 * @param {string|[keyName='commoditycode']}  列表的key
 * 
 */
function selectAll(selected, changeRows, selectedRowKeys, selectedRows,keyName = 'commoditycode') {
    if (selected) {
        // 勾选当前页时，筛选出不是重复的数据
        const filterFun = (item)=>{
            let isHad = false;
            for ( var value of selectedRowKeys ) {
                if (item[keyName] == value)
                    isHad = true;
            }
            return !isHad;
        };
        const mapFun = (item)=>{
            selectedRowKeys.push(item[keyName]);
            selectedRows.push(item);
        };
        arrayEnum(mapFun,filterFun)(changeRows);
    } else {
        // 取消勾选当前页时，筛选出除'取消勾选页'的其他所有数据
        const filterKeysFun = (item)=>{
            let isHad = false;
            let mapFun = (row)=>{
                if( row[keyName] == item ) isHad = true;
            };
            arrayEnum(mapFun)(changeRows);
            return !isHad;
        }
        const filterRowsFun = (item)=>{
            let isHad = false;
            let mapFun = (row)=>{
                if( row[keyName] == item[keyName] ) isHad = true;
            };
            arrayEnum(mapFun)(changeRows);
            return !isHad;
        }
        selectedRowKeys = arrayEnum(null,filterKeysFun)(selectedRowKeys);
        selectedRows = arrayEnum(null,filterRowsFun)(selectedRows);
    }
    return [selectedRowKeys, selectedRows];
}

export default ModalTable;