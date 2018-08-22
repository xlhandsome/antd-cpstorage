import { PureComponent } from 'react';
import { Input,Cascader } from 'antd';
import { Map } from "react-amap";
import PropTypes from 'prop-types';
/**
 * @example 传入高德地图的标记层
 */
class UImaker extends PureComponent{
    constructor(props){
        super(props);
        this.state = {
            map:props.__map__
        }
    }
    render(){
        const { map } = this.state;
        const that = this;
        return (
            <div>
                {
                    window.AMapUI.loadUI(
                        ["overlay/SimpleMarker", "misc/PoiPicker"],
                        (SimpleMarker, PoiPicker) => {
                            var poiPicker = new PoiPicker({
                                input: "searchInput",
                                city: that.props.cityCode,
                                placeSearchOptions: {
                                    map: map,
                                    pageSize: 5,
                                    citylimit: true
                                },
                                searchResultsContainer: "searchResults"
                            });
                            poiPicker.on("poiPicked", function(poiResult) {
                                var source = poiResult.source,
                                poi = poiResult.item;
                                if (source !== "search") {
                                    poiPicker.searchByKeyword(poi.name);
                                } else {
                                    console.log("poi", poi);
                                }  
                            });
                            poiPicker.onCityReady(function(value) {
                                poiPicker.searchByKeyword();
                            });
                    })
                }
            </div>
        )
    }
}

/**
 * @example 地图&城市选择框实例
 */
class MapSearch extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            cityName:props.defaultctName || "姑苏区",
            cityCode:props.defaultctCode || "320508",
            defaultCitys:props.defaultCitys || ['江苏','苏州','姑苏区'],
            isShowMap:true
        }
    }
    onSelectCity = (e,selectedOptions)=>{
        const lastSelect = [...selectedOptions].pop() || {};
        this.setState({
            isShowMap:false,
            cityName:lastSelect.label,
            cityCode:lastSelect.code
        },()=>this.setState({isShowMap:true}));
    }
    pluginConfig = ()=>{
        return [
            "Scale",
            {
                name: "ToolBar",
                options: {
                    visible: true,
                    position: "LT",
                    liteStyle: false
                }
            }
        ];  
    }
    render() {
        const { cityCode,cityName,isShowMap,defaultCitys } = this.state;
        const { citySource } = this.props;

        return (
            <div>
                <Cascader
                    defaultValue={defaultCitys}
                    style={{marginBottom:'30px'}}
                    options={citySource}
                    showSearch={true}
                    onChange={this.onSelectCity}
                    placeholder="省 / 市 / 区"
                />
                {isShowMap?<div className="pr" style={{ width: "100%", height: 400}}>
                    <Map // center={this.state.position}
                        city={cityName}
                        zoom={13}
                        plugins={this.pluginConfig}
                    >
                        <UImaker cityCode={cityCode}/>
                    </Map>
                    <div className="pa r8 t10 w200 h360 oh" >
                        <Input id="searchInput" placeholder="搜索地址或关键字" />
                        <div
                            id="searchResults"
                            style={{ height: "360px", overflow: "auto" }}
                        />
                    </div>
                </div>:''}
            </div>
        );
    }
}

MapSearch.propTypes = {
	defaultctName:PropTypes.string, // 默认城市名称
	defaultctCode:PropTypes.string, // 默认城市编码
	defaultCitys:PropTypes.array, // 默认省市区
	citySource:PropTypes.array.isRequired // 城市列表
}

export default MapSearch;
