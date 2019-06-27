import React ,{Fragment}from 'react';
import {Drawer,Button,Icon,Checkbox,Upload} from 'dtd-loose'

import {check_showModal,check_update,check_resetData,check_export,check_importData} from 'umi'

class CheckListWrap extends React.Component{
 state={
    visible:false,
    data:[],
    prevCheckList:{}
  }


  prevCheckList={}
  currentCheckList={}

onCloseCreateDrawer=()=>{
    this.setState({
        visible:false
    })
}


togglerContent=()=>{
  const {visible} = this.state
  if(visible){
    this.setState({
      visible:false
  })
  }else{
    check_showModal(this.updateData)
  }
   
}

updateData=(data)=>{
  let reducerList = []
  if (data) {
    this.prevCheckList = data
    const { checkList } = data;
    reducerList = Object.keys(checkList)
    .map(v => {
      const items = Object.keys(checkList[v]).map(item => ({
        label: item,
        value: checkList[v][item],
      }));
      return { tag: v, items };
    })
    .filter(item => item.items.length > 0);
    // 获取当前路由的checkList并展示
  }
  this.setState({visible:true,data:reducerList})
}
 
check_onCheckChange =(e,{key,label})=>{
  const {path,checkList:nextCheckList} = this.prevCheckList
  nextCheckList[key][label] = !!e.target.checked;
  check_update({ path, checkList: nextCheckList});
}


  style={
    position: "absolute",
    top: "240px",
    right: "800px",
    zIndex: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "48px",
    height: "48px",
    fontSize: "16px",
    textAlign: "center",
    background:"red",
    borderRadius: "4px 0 0 4px",
    cursor: "pointer",
    pointerEvents: "auto",
  }

  iconStyle={
    color: '#fff',
    fontSize: 20,
  }

  bodyStyle={
    paddingBottom:"50px"
  }

  footerStyle={
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderTop: '1px solid #e8e8e8',
    padding: '10px 16px',
    textAlign: 'right',
    left: 0,
    background: '#fff',
    borderRadius: '0 0 4px 4px',
  }

  btnStyle={
    marginLeft:"10px"
  }

  render(){
   const {visible,data} = this.state
   
     return (<Fragment>
         <Drawer
         handler={
          <div 
            style={this.style} 
            onClick={this.togglerContent}>
            <Icon type={visible?"close":"check-circle"} 
                 style={this.iconStyle}/>
           
          </div>
        }
          title="checkList一览"
          placement="right"
          width={800}
          maskClosable={false}
          onClose={this.onCloseCreateDrawer}
          visible={visible}
          destroyOnClose
        >
        <div style={this.bodyStyle}>
        {data.length>0 ?data.map(v => (
            <div key={v.tag}>
              <h4>{v.tag}</h4>
              {v.items.map(item => (
                <Checkbox
                  onChange={e =>
                    this.check_onCheckChange(e, {
                      key: v.tag,
                      label: item.label,
                    })
                  }
                  key={item.label}
                  defaultChecked={item.value}
                >
                  {item.label}
                </Checkbox>
              ))}
            </div>
          )):'暂未添加checkList'}
        </div>
         <div
            style={this.footerStyle}
          >
             <Upload 
             beforeUpload={(file)=>check_importData(file,this.onCloseCreateDrawer)}
             showUploadList={false}
             >
          <Button type="secondary">
            导入
          </Button>
          </Upload>
            <Button style={this.btnStyle} onClick={check_export} type="primary">
              导出
            </Button>
            {/* <Button onClick={()=>check_resetData(this.onCloseCreateDrawer)} type="secondary">
              删除数据
            </Button> */}
          </div>
        </Drawer>
        
      {this.props.children}
    </Fragment>);
  }
}
export default CheckListWrap;
