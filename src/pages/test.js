
// import styles from './test.css';
import { Button } from 'antd';
import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import DragFlowChart from './drag/drag';

class Test extends React.Component {

  savePdf = () => {
    // const a = document.getElementById("bbb");
    html2canvas(this.refs.pdf, {
      dpi: window.devicePixelRatio,
      useCORS: true,
      height:document.body.scrollHeight
    }).then(canvas => {
      let contentWidth = canvas.width;
      let contentHeight = canvas.height;
      let pageHeight = contentWidth / 592.28 * 841.89;
      let leftHeight = contentHeight;
      let position = 100;
      let imgWidth = 560.28;
      let imgHeight = 560.28 / contentWidth * contentHeight;
      let pageData = canvas.toDataURL('image/jpeg', 1.0);
      let pdf = new jsPDF('', 'pt', 'a4');
      if (leftHeight < pageHeight) {
        pdf.addImage(pageData, 'JPEG', 26, 100, imgWidth, imgHeight);
      } else {
        while (leftHeight > 0) {
          pdf.addImage(pageData, 'JPEG', 26, position, imgWidth, imgHeight);
          // 如果pdf为两页且内容有重合需要更改下面的560.28数值
          position -= 560;
          if (leftHeight > 0) {
            pdf.addPage();
          }
        }
      }
      pdf.save("creat.pdf");
    })
  }
  render() {
    return <div ref="pdf">
      <Button onClick={this.savePdf}>Save</Button>
      <DragFlowChart />
    </div>;
  };
}
export default Test;
