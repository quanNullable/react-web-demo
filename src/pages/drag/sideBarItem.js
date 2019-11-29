import  React from 'react'
import styles from './drag.less';
import {  REACT_FLOW_CHART }   from "@mrblenny/react-flow-chart";

export const SidebarItem = ({ type, ports, properties }) => {
  return (
    <div className={styles.sidbarItem}
      draggable={true}
      onDragStart={ (event) => {
        event.dataTransfer.setData(REACT_FLOW_CHART, JSON.stringify({ type, ports, properties }))
      } }
    >
      {type}
    </div>
  )
}