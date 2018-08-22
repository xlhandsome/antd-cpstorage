import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Upload, Icon } from 'antd';
import { message } from "antd/lib/index";
import styles from './QRcodeRead.less';

function getUniqueCode() {
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4";
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
  s[8] = s[13] = s[18] = s[23] = "-";

  var uuid = s.join("");
  return uuid;
}

function utf8ToUtf16(s) {//将utf-8字符串转码为unicode字符串，要不读取的二维码信息包含中文会乱码
  if (!s) {
      return;
  }
  var i, codes, bytes, ret = [], len = s.length;
  for (i = 0; i < len; i++) {
      codes = [];
      codes.push(s.charCodeAt(i));
      if (((codes[0] >> 7) & 0xff) == 0x0) {
          //单字节  0xxxxxxx  
          ret.push(s.charAt(i));
      } else if (((codes[0] >> 5) & 0xff) == 0x6) {
          //双字节  110xxxxx 10xxxxxx  
          codes.push(s.charCodeAt(++i));
          bytes = [];
          bytes.push(codes[0] & 0x1f);
          bytes.push(codes[1] & 0x3f);
          ret.push(String.fromCharCode((bytes[0] << 6) | bytes[1]));
      } else if (((codes[0] >> 4) & 0xff) == 0xe) {
          //三字节  1110xxxx 10xxxxxx 10xxxxxx  
          codes.push(s.charCodeAt(++i));
          codes.push(s.charCodeAt(++i));
          bytes = [];
          bytes.push((codes[0] << 4) | ((codes[1] >> 2) & 0xf));
          bytes.push(((codes[1] & 0x3) << 6) | (codes[2] & 0x3f));
          ret.push(String.fromCharCode((bytes[0] << 8) | bytes[1]));
      }
  }
  return ret.join('');
}
var getObjectURL = function(file){
  var url = null ;
  if (window.createObjectURL!=undefined) { // basic
  url = window.createObjectURL(file) ;
  } else if (window.webkitURL!=undefined) { // webkit or chrome
   url = window.webkitURL.createObjectURL(file) ;
  //  url =  window.URL.createObjectURL(new Blob(file, {type: "application/zip"})) 
  }
   return url ;
}

class ImageUpload extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      previewImage: '',
      fileList: [],
      isNoBar:props.isNoBar || false,
      fileError:false,
    }
  }

  componentDidMount() {
    const value = this.props.value || '';
    let type = value.split(".")[1]
    if (type == 'png' || type == 'jpg' || type == 'jpeg') {
      this.setState({
        fileList: value != '' ? [{
          uid: -1,
          status: 'done',
          url: 'https://zhonglunnet032001.oss-cn-shanghai.aliyuncs.com/' + value
        }] : []
      })
    }
  }

  getSuffix = (filename) => {
    var pos = filename.lastIndexOf('.');
    var suffix = '';
    if (pos != -1) {
      suffix = filename.substring(pos)
    }
    return suffix;
  }

  beforeUpload = (file) => {
    if( this.state.isNoBar ) {
      return;
    }
    const isJPEG = file.type === 'image/jpeg';
    const isGIF = file.type === 'image/gif';
    const isJPG = file.type === 'image/jpg';
    const isPNG = file.type === 'image/png';

    if (!isJPEG && !isGIF && !isJPG && !isPNG) {
      message.error('上传的图片格式不正确!');
    }

    //imageSize 是接受的图片大小限制的传参 单位KB

    if(this.props.imageSize){
      const imageSize = file.size / 1024  <= parseInt(this.props.imageSize);
      if (!imageSize) {
        message.error(`图片大小必须小于${this.props.imageSize}KB!`);

      }

      return (isJPG || isJPEG || isJPG || isPNG) && imageSize;
    }else {
      const isLt20M = file.size / 1024 / 1024 <= 20;
      if (!isLt20M) {
        message.error('图片大小必须小于 20MB!');
      }
      return (isJPG || isJPEG || isJPG || isPNG) && isLt20M;
    }
  }

  handleChange = (info) => {
    const { onChange,readCompletion,onRemove } = this.props;
    var _this = this;
    if( this.state.isNoBar ) {
      message.warning("无码商品不能修改图片");
      return;
    }
    const {
      fileList,
      file,
      file:{ originFileObj = {},status,thumbUrl}
    } = info;
    //imageSize 是接受的图片大小限制的传参 单位KB
    if(fileList.length>0){
      if(this.props.imageSize){
        const imageSize = fileList[0].size / 1024  <= parseInt(this.props.imageSize);
        if (!imageSize) {
          return
        }
      }else {
        const isLt20M = fileList[0].size / 1024 / 1024 <= 20;
        if (!isLt20M) {
          return
        }
      }
    }
    const doneList = fileList.filter(item => item.status === 'done');
    if (onChange && fileList.length === doneList.length) {
      const values = doneList.map(function(item) {
        return item.originFileObj.objName;
      });
      onChange(values.length > 0 ? values[0] : '');
    }
    if( status == 'done' || status == 'error' ){
      window.qrcode.decode(thumbUrl);
      window.qrcode.callback = function(imgMsg){
        imgMsg = utf8ToUtf16(imgMsg);
        if( imgMsg.indexOf('error') > -1 ){
          onRemove();
          // _this.setState({fileList:[]});
          message.error("识别失败,请确认二维码信息是否过期,并重新上传");
          return;
        }
        readCompletion(imgMsg);
      }
    }
    this.setState({
      fileList: [...fileList]
    });
  }


  render() {
    const { fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传图片</div>
      </div>
    );

    return (
      <div className="qrcodeReadBox">
        <Upload
          action="https://jsonplaceholder.typicode.com/posts/"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          beforeUpload={this.beforeUpload}
          onChange={this.handleChange}
          supportServerRender={true}
          onRemove={this.props.onRemove}
          showUploadList={{showPreviewIcon:false,showRemoveIcon:true}}
        >
          {fileList.length >= 1 ? null : uploadButton}
        </Upload>
        <script src="http://localhost:8000/qrcode.js"></script>
      </div>
    );
  }
}

ImageUpload.propTypes = {
  onRemove:PropTypes.func.isRequired, // 移除后回调
	readCompletion:PropTypes.func.isRequired, // 识别后回调
}

export default ImageUpload;
