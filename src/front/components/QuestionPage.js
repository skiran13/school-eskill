import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import History from './history';
import Queries from './queries';
import Attempted from './attempted';
import {
  Sidebar,
  Segment,
  Button,
  Menu,
  Image,
  Container,
  Table,
  Icon,
  Header,
  Input,
  Grid,
  Dropdown,
  Pagination,
  Modal,
  GridRow,
  Card,
  GridColumn,
} from 'semantic-ui-react';
import history from './history';
import { localPoint } from '@vx/event';
import { Pie } from '@vx/shape';
import { Group } from '@vx/group';
import { pubpath } from '../enpoint';
import { withTooltip, Tooltip } from '@vx/tooltip';
import _ from 'lodash';

const white = '#888888';
const black = '#000000';

const usage = (d) => d.usage;

class QuestionPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      modalVisible: false,
      filter: props.categories,
    };
    this.logout = this.logout.bind(this);
    this.emit = this.emit.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleTooltip = this.handleTooltip.bind(this);
  }
  handleTooltip({ event, da }) {
    const { showTooltip } = this.props;
    const { x, y } = localPoint(event);

    showTooltip({
      tooltipData: { ...da },
      tooltipLeft: x,
      tooltipTop: y,
    });
  }
  handleClick() {
    this.setState({ visible: !this.state.visible });
  }

  logout() {
    this.props.logout();
  }
  componentDidMount() {}
  emit(name, obj) {
    this.props.emit(name, obj);
  }
  reset(e, cat, top) {
    e.preventDefault();
    this.emit('reset', { topic: top, cat: cat });
  }
  render() {
    let width = 600;

    let height = 600;
    let margin = { top: 10, bottom: 10, right: 10, left: 10 };
    let {
      md: det,
      topics,
      categories,
      hideTooltip,
      qs,
      cat,
      topic,
      width: w,
    } = this.props;
    let data = [];
    let allcomplete = false;
    let actualcat = cat.replace(/[+]/g, ' ');
    let actualtop = topic.replace(/[+]/g, ' ');
    if (qs[actualcat] != undefined) {
      data = qs[actualcat][actualtop].q.map((k, i) => {
        return {
          label: k.n,
          usage: 1,
          name: `Question ${i}`,
          state: k.a,
          ind: i,
        };
      });
      if (data.filter((k) => k.state == 1 || k.state == 2).length == 100) {
        allcomplete = true;
      }
    }

    const radius = Math.min(width, height) / 2;
    const centerY = height / 2;
    const centerX = width / 2;

    if (w > 768) {
      return (
        <div>
          <Segment
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
            }}
            inverted={this.props.dark}
          >
            <svg height={height} width={width}>
              <Group top={centerY - margin.top} left={centerX}>
                <Pie
                  data={data}
                  pieValue={usage}
                  outerRadius={radius - radius / 3}
                  innerRadius={radius - radius / 6}
                  cornerRadius={0}
                  padAngle={0}
                >
                  {(pie) => {
                    return pie.arcs.map((arc, i) => {
                      const opacity = 1;
                      const [centroidX, centroidY] = pie.path.centroid(arc);
                      const { startAngle, endAngle } = arc;
                      const hasSpaceForLabel = endAngle - startAngle >= 0.1;
                      return (
                        <g key={`browser-${arc.data.label}-${i}`}>
                          <a
                            href={`/question/${this.props.cat}/${topic}/${arc.data.ind}`}
                            onClick={(e) => {
                              e.preventDefault();
                              history.push(
                                `${pubpath}/question/${this.props.cat}/${this.props.topic}/${arc.data.ind}`
                              );
                            }}
                          >
                            <path
                              d={pie.path(arc)}
                              fill={
                                arc.data.state == 0
                                  ? '#676d2d'
                                  : arc.data.state == 1
                                  ? '#ff3434'
                                  : arc.data.state == 2
                                  ? '#80e560'
                                  : '#ffe500'
                              }
                              stroke={this.props.dark ? '#1b1c1d' : '#fff'}
                              strokeLinecap='square'
                              strokeLinejoin='bevel'
                              fillOpacity={opacity}
                              onMouseMove={(event) =>
                                this.handleTooltip({
                                  event,
                                  da: {
                                    content: arc.data.name,
                                    bgc:
                                      arc.data.state == 0
                                        ? 'red'
                                        : arc.data.state == 1
                                        ? 'yellow'
                                        : '#80e560',
                                    color:
                                      arc.data.state == 0 ? 'white' : 'black',
                                  },
                                })
                              }
                              onMouseLeave={(event) => hideTooltip()}
                            />
                          </a>
                        </g>
                      );
                    });
                  }}
                </Pie>
              </Group>
              <Group
                top={centerY - margin.top}
                left={centerX}
                width={200}
                height={40}
              >
                <text textAnchor='middle' className='center-label'>
                  {actualtop}
                </text>
              </Group>
              {allcomplete ? (
                <a
                  className='link-label'
                  href='reset'
                  onClick={(e) => this.reset(e, actualcat, actualtop)}
                >
                  <Group
                    top={centerY + margin.top + 20}
                    left={centerX}
                    width={200}
                    height={40}
                    fill={'white'}
                  >
                    <text
                      textAnchor='middle'
                      className='center-label'
                      style={{ border: '1px solid #000' }}
                    >
                      {'Reset'}
                    </text>
                  </Group>
                </a>
              ) : null}
            </svg>
          </Segment>
        </div>
      );
    } else {
      return (
        <div>
          <Segment basic>
            {data.map((k) => (
              <Segment
                inverted={this.props.dark}
                onClick={(e) => {
                  e.preventDefault();
                  history.push(
                    `${pubpath}/question/${this.props.cat}/${topic}/${k.ind}`
                  );
                }}
                style={{
                  color:
                    k.state == 0
                      ? '#676d2d'
                      : k.state == 1
                      ? '#ff3434'
                      : k.state == 2
                      ? '#80e560'
                      : '#ffe500',
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexDriection: 'row',
                }}
                className='question'
              >
                <Header
                  as='h3'
                  style={{
                    color:
                      k.state == 0
                        ? '#676d2d'
                        : k.state == 1
                        ? '#ff3434'
                        : k.state == 2
                        ? '#80e560'
                        : '#ffe500',
                  }}
                  className='question-name'
                >
                  {k.name}
                </Header>
                <Icon name='angle right' />
              </Segment>
            ))}
          </Segment>
        </div>
      );
    }
  }
}

export default withTooltip(QuestionPage);
