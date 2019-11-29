import React from 'react'
import { generateCurvePath } from '@mrblenny/react-flow-chart'

export const LineType={
  normal:'1',
  dash:'2',
}

const LinkCustom =  (props)=> {
  const { config, link, startPos, endPos, onLinkMouseEnter, onLinkMouseLeave, onLinkClick, isHovered, isSelected ,circleColor = "cornflowerblue"} = props
  const {lineColor = "cornflowerblue",lineType = LineType.normal}=link||{}
  const points = generateCurvePath(startPos, endPos);
  return (React.createElement("svg", { style: { overflow: 'visible', position: 'absolute', cursor: 'pointer', left: 0, right: 0 } },
    React.createElement("circle", { r: "4", cx: startPos.x, cy: startPos.y, fill: circleColor }),
    React.createElement("path", { d: points, stroke: lineColor,strokeDasharray:lineType==LineType.dash?"10 5":undefined, strokeWidth: "3", fill: "none" }),
    React.createElement("path", {
      d: points, stroke: lineColor,strokeWidth: "20", fill: "none", strokeLinecap: "round", strokeOpacity: (isHovered || isSelected) ? 0.1 : 0, onMouseEnter: function () { return onLinkMouseEnter({ config: config, linkId: link.id }); }, onMouseLeave: function () { return onLinkMouseLeave({ config: config, linkId: link.id }); }, onClick: function (e) {
        onLinkClick({ config: config, linkId: link.id });
        e.stopPropagation();
      }
    }),
    React.createElement("circle", { r: "4", cx: endPos.x, cy: endPos.y, fill: circleColor })));
};
export default LinkCustom;
