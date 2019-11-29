
import  './index.less';
// import styles from './index.less';
import React from "react";
import Draw from "./draw";

export default class Canvas extends React.PureComponent {
  /* 重置功能 */
  reset() {
    Draw.clear();
  }

  /* 导出 */
  exp() {
    let exportImg = Draw.exportImg();
    if(exportImg === -1) {
      return console.log('please draw!');
    }
    this.refs['imgC'].src = exportImg;
  }

  render() {
    return (
      <div className="component-canvas">
        <div className="canvas-wrap" ref='canvas-wrap'></div>
        <div className="button-wrap">
          <span onClick={this.reset}>reset</span>
          <span onClick={this.exp.bind(this)}>export</span>
        </div>
        <img ref="imgC" />
      </div>
    );
  }

  componentDidMount() {
    Draw.init(this.refs['canvas-wrap']);
  }
}