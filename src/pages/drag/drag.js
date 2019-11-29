import { FlowChart, actions} from "@mrblenny/react-flow-chart";
import React from 'react'
import styles from './drag.less';
import { mapValues } from 'lodash'
import { SideBar } from './sideBar';
import { SidebarItem } from './sideBarItem';
import LinkCustom, { LineType } from './link';


class DragFlowChart extends React.Component {
  state = {
    offset: {
      x: 0,
      y: 0
    },
    nodes: {
      node1: {
        id: "node1",
        type: "output-only",
        position: {
          x: 300,
          y: 100
        },
        ports: {
          port1: {
            id: "port1",
            type: "output",
            properties: {
              value: "yes"
            }
          },
          port2: {
            // id: "port2",
            // type: "output",
            // properties: {
            //   value: "no"
            // }
          }
        }
      },
      node2: {
        id: "node2",
        type: "input-output",
        position: {
          x: 300,
          y: 300
        },
        ports: {
          port1: {
            id: "port1",
            type: "input"
          },
          port2: {
            id: "port2",
            type: "output"
          }
        }
      },
    },
    links: {
      link1: {
        id: "link1",
        from: {
          nodeId: "node1",
          portId: "port1"
        },
        to: {
          nodeId: "node2",
          portId: "port1"
        },
      },
    },
    selected: {},
    hovered: {}
  }
  componentDidMount(){
    actions.onLinkStart = function (_a) {
      var linkId = _a.linkId, fromNodeId = _a.fromNodeId, fromPortId = _a.fromPortId;
      return function (chart) {
        chart.links[linkId] = {
          id: linkId,
          from: {
            nodeId: fromNodeId,
            portId: fromPortId,
          },
          to: {},
          lineType:this.state.lineType
        };
        return chart;
      };
    };
  }

  changeLineType = (lineType) => {
    this.setState({lineType})
  }

  render() {
    const stateActions = mapValues(actions, (func) =>
      (...args) => {
        this.setState(func(...args))
      })
    return (
      <div style={{height:document.body.clientHeight}} className={styles.container} >
        <FlowChart
          chart={this.state}
          callbacks={stateActions}
          config={ {
            validateLink: ({ linkId, fromNodeId, fromPortId, toNodeId, toPortId, chart }) => {
              // no links between same type nodes
              if (chart.nodes[fromNodeId].type === chart.nodes[toNodeId].type) {
                alert('forbidden')
                return false
              }
              return true
            },
          } }
          Components={{
            Link: (props) => {
              const { startPos, endPos, link, onLinkClick } = props
              const centerX = startPos.x + (endPos.x - startPos.x) / 2
              const centerY = startPos.y + (endPos.y - startPos.y) / 2
              return (
                <>
                  <LinkCustom {...props} />
                  <div style={{ left: centerX, top: centerY, position: 'absolute' }}>
                    {props.link.properties && props.link.properties.label && (
                      <div className={styles.labelContent}>{props.link.properties && props.link.properties.label}</div>
                    )}
                    <div className={styles.deleteButton}
                      onClick={(e) => {
                        onLinkClick({ linkId: link.id })
                        stateActions.onDeleteKey({})
                        e.stopPropagation()
                      }}
                    >
                      x
              </div>
                  </div>
                </>
              )
            },
          }} />

        <SideBar>
          <div className={styles.tipMessage}>
            Drag and drop these items onto the canvas.
      </div>
          <SidebarItem
            type="top/bottom"
            ports={{
              port1: {
                id: 'port1',
                type: 'top',
                properties: {
                  custom: 'property',
                },
              },
              port2: {
                id: 'port1',
                type: 'bottom',
                properties: {
                  custom: 'property',
                },
              },
            }}
            properties={{
              custom: 'property',
            }}
          />
          <SidebarItem
            type="bottom-only"
            ports={{
              port1: {
                id: 'port1',
                type: 'bottom',
                properties: {
                  custom: 'property',
                },
              },
            }}
          />
          <SidebarItem
            type="left-right"
            ports={{
              port1: {
                id: 'port1',
                type: 'left',
                properties: {
                  custom: 'property',
                },
              },
              port2: {
                id: 'port2',
                type: 'right',
                properties: {
                  custom: 'property',
                },
              },
            }}
          />
          <SidebarItem
            type="all-sides"
            ports={{
              port1: {
                id: 'port1',
                type: 'left',

              },
              port2: {
                id: 'port2',
                type: 'right',
              },
              port3: {
                id: 'port3',
                type: 'top',
              },
              port4: {
                id: 'port4',
                type: 'bottom',
              },
            }}
          />
          <SidebarItem
            type="lots-of-ports"
            ports={{
              port1: {
                id: 'port1',
                type: 'left',

              },
              port2: {
                id: 'port2',
                type: 'right',
              },
              port3: {
                id: 'port3',
                type: 'top',
              },
              port4: {
                id: 'port4',
                type: 'bottom',
              },
              port5: {
                id: 'port5',
                type: 'left',
              },
              port6: {
                id: 'port6',
                type: 'right',
              },
              port7: {
                id: 'port7',
                type: 'top',
              },
              port8: {
                id: 'port8',
                type: 'bottom',
              },
              port9: {
                id: 'port9',
                type: 'left',
              },
              port10: {
                id: 'port10',
                type: 'right',
              },
              port11: {
                id: 'port11',
                type: 'top',
              },
              port12: {
                id: 'port12',
                type: 'bottom',
              },
            }}
          />
          <div className={styles.lineType}>
            <div className={styles.lineBtn} onClick={() => this.changeLineType(LineType.normal)}>实线</div>
            <div className={styles.lineBtn} onClick={() => this.changeLineType(LineType.dash)}>虚线</div>
          </div>
          <br/>
          当前选择:{this.state.lineType===LineType.dash?'虚线':'实线'}
        </SideBar>
      </div>
    )
  };
}
export default DragFlowChart;
