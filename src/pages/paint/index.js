
import './index.less';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import holder from '../../assets/yay.jpg'

export default class Graffiti extends Component {
  state = {
    canvas: null,	//存储画布DOM对象
    ctx: null,		//存储Context2d对象
    isPress: false,	//判断鼠标或者手指是否按下去
    urlStack: [],	//图片路径栈，用于存储当完成down->move->up一系列事件后画布的状态以便于撤销和向前
    index: 0,		//图片路径栈的指针,指针越小画布状态越新，越大画布状态越旧
    isImg: true,		//判断是否为图片状态，true则渲染画布用于涂鸦，false则渲染保存为图片的画布避免涂鸦编辑
    imgUrl: '',		//记录初始传入的图片url或者保存涂鸦结束后的图片url以便于涂鸦时的再次渲染
    flag: false,		//一个标记，用于控制涂鸦开始后的初始化，避免componentDidUpdate函数循环。
    isFirstDraw: true,	//一个标记用于记录是否为第一次涂鸦，来便于图片路径栈的记录
    strokeColor: 'black',   //画笔颜色
    lineWidth: 5,   //画笔大小
  }
  componentWillMount(){
    let { imgUrl } = this.props
    if (!imgUrl) {
      imgUrl = holder;
    }
    this.setState({
      imgUrl
    });
  }

  componentDidMount() {
    //如果有传入图片路径则初始化路径
    this.handleDraw()
  }
  componentDidUpdate() { //REACT生命周期函数，当state变化时触发该函数
    //只有当点击涂鸦按钮时让flag标记为真，避免循环初始化画布
    if (this.state.flag) {
      //找到canvas的真实DOM,以及创建context2d对象
      let canvas = ReactDOM.findDOMNode(this.refs.canvas);
      let ctx = canvas.getContext('2d');
      ctx.lineWidth = this.state.lineWidth;
      let url = this.state.imgUrl;
      let urlStack = [canvas.toDataURL()];
      if (url) {
        if (this.state.isFirstDraw) {//如果第一次运行且有图片路径传入则加载图片
          let img = new Image();
          img.src = url;
          img.onload = () => {
            //将图片载入进画布
            ctx.drawImage(img, img.width / 2 + 20, 0);
            //将画布的初始状态存入栈内
            urlStack[0] = canvas.toDataURL();
          };
        } else {
          //如果不是第一次传入则直接加载保存的图片进画布即可
          this.loadImage(url, ctx)
          urlStack = this.state.urlStack;
        }
      }
      //画布绑定电脑鼠标事件
      canvas.onmousedown = (e) => this.handleMouseDown(e);
      canvas.onmousemove = (e) => this.handleMouseMove(e);
      canvas.onmouseup = (e) => this.handleMouseUp(e);
      //画布绑定手机触摸事件
      canvas.ontouchstart = (e) => this.handleMouseDown(e);
      canvas.ontouchmove = (e) => this.handleMouseMove(e);
      canvas.ontouchend = (e) => this.handleMouseUp(e);
      this.setState({
        flag: false,  //让flag变为false初始化完成，当改变state不执行本if语句
        canvas: canvas,
        ctx: ctx,
        isPress: false,
        urlStack: urlStack,
        isFirstDraw: false, //将是否为第一次改为false
      });
    }
  }
  handleMouseDown(e) { //当按下画布时
    let xy = this.getPosition(e);
    let ctx = this.state.ctx;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.imageSmoothingEnabled = true;
    ctx.beginPath();
    ctx.moveTo(xy.posX, xy.poxY);
    this.setState({
      isPress: true
    });
  }
  handleMouseMove(e) { //当在画布上移动时
    e.preventDefault();
    //当isPress为假则不执行
    if (!this.state.isPress) return;
    let ctx = this.state.ctx;
    let xy = this.getPosition(e);
    //如果起始点不为空则连线
    ctx.lineTo(xy.posX, xy.posY);
    ctx.stroke();
  }
  handleMouseUp(e) {	//当松开画布时
    e.preventDefault();
    if (!this.state.isPress) return;
    let [urlStack, canvas, index] = [this.state.urlStack, this.state.canvas, this.state.index];
    //松开画布时删去比画布当前状态更加新的状态，用于防止当撤销后再涂鸦时栈记录着之前已经撤销的状态
    if (index !== urlStack.length) urlStack.splice(0, index);
    //将状态的图片url传入图片路径栈的队首
    urlStack.unshift(canvas.toDataURL());
    this.setState({
      isPress: false,
      urlStack: urlStack,
      index: 0
    });
  }
  handleControl(e) {	//当按下撤销或者前进按钮时
    let [index, urlStack] = [this.state.index, this.state.urlStack];
    let key = e.currentTarget.getAttribute('data-key');
    //如是撤回键按下则让栈指针变大，让画布状态变旧当指针到达栈最底部时不再变大，前进键则相反
    key == 'back' ?
      (index == urlStack.length - 1 ? index = index : index++) :
      (index == 0 ? index = index : index--);
    this.setState({
      index: index
    });
    let url = urlStack[index];
    //读取状态图片
    this.loadImage(url, this.state.ctx);
  }
  handleColorChange(e) {	//当点击颜色按钮时
    //用了事件冒泡读取颜色ul内的子元素的颜色值
    let color = e.target.getAttribute('data-color');
    if (!color) return;
    //改变画笔颜色
    this.state.ctx.strokeStyle = color;
    this.setState({
      strokeColor: color
    });
  }
  handleWidthChange(e) {
    let value = e.target.getAttribute('data-value');
    if (!value) return;
    this.state.ctx.lineWidth = value;
    this.setState({
      lineWidth: value
    });
  }
  handleClear() { //清除画布
    let [width, height] = [300, 300];
    if (this.props.width) width = this.props.width;
    if (this.props.height) height = this.props.height;
    this.state.ctx.clearRect(0, 0, width, height);
    this.state.urlStack.unshift(this.state.canvas.toDataURL());
  }
  handleSave(e) { //当点击保存取消画布变为图片
    let url = this.state.canvas.toDataURL();
    this.setState({
      imgUrl: url,
      isImg: true,
    });
  }
  handleDraw(e) {	//当点击涂鸦按钮时，flag设为true初始化画布
    this.setState({
      isImg: false,
      flag: true
    });
  }
  handleCancel() { //当点击取消画布
    this.setState({
      isImg: true,
    });
  }
  loadImage(url, ctx) { //读取图片的方法
    if (!ctx) return;
    let [width, height] = [300, 300];
    if (this.props.width) width = this.props.width;
    if (this.props.height) height = this.props.height;
    let img = new Image();
    img.src = url;
    //当图片加载完画布在加载图片
    img.onload = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0);
    };
  }
  getPosition(e) { //获得在画布移动时的位置
    let posX, posY;
    if (e.type.indexOf('Touch') >= 0) {	//touch事件的获取方法
      posX = e.touches[0].pageX;
      posY = e.touches[0].pageY;
    } else {		//鼠标事件的获取方法
      posX = e.offsetX + e.target.offsetLeft;
      posY = e.offsetY + e.target.offsetTop;
    }
    //返回位置对象
    return {
      posX: posX,
      posY: posY
    };
  }
  render() {
    const color = ["black", "white", "green", "blue", "red","gray","purple","yellow"];
    const lineWidth = [2, 4, 6, 8, 10];
    const { width, height } = this.props
    return (
      <div className="graffiti" style={{ width: width, height: height }}>
        {
          this.state.isImg ? (
            <div>
              <img src={this.state.imgUrl} />
              <button onClick={(e) => this.handleDraw(e)} className='graffiti-draw'>涂鸦</button>
            </div>
          ) : (
              <div>
                <canvas width={width} height={height} ref="canvas" ></canvas>
                <ul onClick={(e) => this.handleColorChange(e)} className='stroke-colors'>
                  {
                    color.map((item) => {
                      return this.state.strokeColor == item ?
                        <li style={{ backgroundColor: item }} data-color={item}
                          className='color-current' key={item}></li> :
                        <li style={{ backgroundColor: item }} data-color={item} key={item}></li>
                    })
                  }
                </ul>
                <ul onClick={(e) => this.handleWidthChange(e)} className='stroke-width'>
                  {
                    lineWidth.map((item) => {
                      return this.state.lineWidth == item ?
                        <li style={{ width: item * 3 + 'px', height: item * 3 + 'px' }} data-value={item}
                          className='width-current' key={item}></li> :
                        <li style={{ width: item * 3 + 'px', height: item * 3 + 'px' }} data-value={item} key={item}></li>
                    })
                  }
                </ul>
                <ul className='graffiti-control'>
                  <li onClick={(e) => this.handleControl(e)} data-key='back' title='撤回'></li>
                  <li onClick={(e) => this.handleControl(e)} data-key='next' title='前进'></li>
                  <li onClick={(e) => this.handleSave(e)} title='保存为图片'></li>
                  <li onClick={(e) => this.handleClear(e)} title='清空'></li>
                  <li onClick={() => this.handleCancel()} title='取消'></li>
                </ul>
              </div>
            )
        }
      </div>
    )
  }
}

Graffiti.defaultProps = {
  width: document.body.clientWidth,
  height: document.body.clientHeight,
};

Graffiti.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  imgUrl: PropTypes.string
}