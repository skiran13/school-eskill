import React, { Component } from 'react';
import History from './history';
import { Sidebar, Segment, Menu, Icon, Header } from 'semantic-ui-react';
import history from './history';
import { Pie } from '@vx/shape';
import { Group } from '@vx/group';

import { withTooltip, Tooltip } from '@vx/tooltip';
import _ from 'lodash';
import { localPoint } from '@vx/event';
import { scaleLinear } from '@vx/scale';
import { RectClipPath } from '@vx/clip-path';
import { voronoi, VoronoiPolygon } from '@vx/voronoi';
import {
  GradientOrangeRed,
  GradientPinkBlue,
  GradientTealBlue,
  GradientDarkgreenGreen,
  LinearGradient,
} from '@vx/gradient';

const usage = (d) => d.usage;
const neighborRadius = 75;

const extent = (data, value) => [
  Math.min(...data.map(value)),
  Math.max(...data.map(value)),
];

class StudentDashboard extends React.Component {
  static getUpdatedState(props) {
    let width = 600;
    let flag = false;
    let height = 600;
    let data = props.qs.map((k, i) => {
      return {
        label: k.n,
        usage: 1,
        name: `Question ${k.n}`,
        state: k.a,
        ind: i,
        x: k.x,
        y: k.y,
        id: k.mid,
      };
    });
    let margin = { top: 0, bottom: 0, right: 0, left: 0 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = scaleLinear({
      domain: extent(data, (d) => d.x),
      range: [0, innerWidth],
    });

    const yScale = scaleLinear({
      domain: extent(data, (d) => d.y),
      range: [innerHeight, 0],
    });

    const voronoiDiagram = voronoi({
      x: (d) => xScale(d.x),
      y: (d) => yScale(d.y),
      width: innerWidth,
      height: innerHeight,
    })(data);

    return {
      selected: null,
      selectedNeighbors: null,
      xScale,
      yScale,
      voronoiDiagram,
      innerWidth,
      innerHeight,
    };
  }
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);

    this.state = {
      visible: false,
      modalVisible: false,
      filter: props.categories,
      ...StudentDashboard.getUpdatedState(props),
    };
    this.logout = this.logout.bind(this);
    this.emit = this.emit.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleTooltip = this.handleTooltip.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    this.setState(StudentDashboard.getUpdatedState(nextProps));
  }

  handleMouseMove(event) {
    const { voronoiDiagram } = this.state;
    const { x, y } = localPoint(this.svg, event);
    const closest = voronoiDiagram.find(x, y, neighborRadius);
    if (closest) {
      const neighbors = {};
      const cell = voronoiDiagram.cells[closest.index];
      cell.halfedges.forEach((index) => {
        const edge = voronoiDiagram.edges[index];
        const { left, right } = edge;
        if (left && left !== closest) neighbors[left.data.id] = true;
        else if (right && right !== closest) neighbors[right.data.id] = true;
      });
      this.setState({ selected: closest, neighbors });
    }
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
  componentDidMount() {
    setTimeout(() => {
      this.setState(
        ...this.state,
        ...StudentDashboard.getUpdatedState(this.props)
      );
    }, 2000);
  }
  emit(name, obj) {
    this.props.emit(name, obj);
  }
  render() {
    let width = 600;

    let height = 600;

    let margin = { top: 0, bottom: 0, right: 0, left: 0 };
    let {
      md: det,
      topics,
      categories,
      hideTooltip,
      tooltipData,
      tooltipTop,
      tooltipLeft,
      events,
      q,
    } = this.props;
    const {
      voronoiDiagram,
      innerWidth,
      innerHeight,
      xScale,
      yScale,
      selected,
      neighbors,
    } = this.state;

    const polygons = voronoiDiagram.polygons();

    let tl = _.toArray(topics).length;
    const radius = Math.min(width, height) / 2;
    const centerY = height / 2;
    const centerX = width / 2;

    let cl = _.toArray(categories).length;

    return (
      <div>
        <Segment
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <svg
            width={width}
            height={height}
            ref={(ref) => {
              this.svg = ref;
            }}
          >
            <GradientOrangeRed id='voronoi_orange_red' />
            <LinearGradient from='#00ff21' to='#358937' id='voronoi_green' />
            <LinearGradient from='#ffc1c1' to='#ff0000' id='voronoi_red' />
            <LinearGradient from='#007bff' to='#2c00bc' id='voronoi_purple' />
            <LinearGradient
              from='rgba(255,255,255,0.5)'
              to='rgba(255,255,255,0.1)'
              id='voronoi_pink_red'
            />
            <rect
              fill='url(#voronoi_purple)'
              width={innerWidth}
              height={innerHeight}
              rx={14}
            />
            <RectClipPath
              id='voronoi_clip'
              width={innerWidth}
              height={innerHeight}
              rx={14}
            />
            <Group
              top={margin.top}
              left={margin.left}
              clipPath='url(#voronoi_clip)'
              onMouseMove={this.handleMouseMove}
              onMouseLeave={() => {
                this.setState({ selected: null, neighbors: null });
              }}
            >
              {polygons.map((polygon, ind) => (
                <a
                  href={`/question/${polygon.data.ind}`}
                  key={`polygon-${ind}`}
                  onClick={(e) => {
                    e.preventDefault();
                    history.push(`/question/${polygon.data.ind}`);
                  }}
                >
                  <VoronoiPolygon
                    polygon={polygon}
                    stroke='#ffffff'
                    strokeWidth={1}
                    fill={
                      selected && polygon.data.id === selected.data.id
                        ? 'url(#voronoi_pink_red)'
                        : polygon.data.state == 0
                        ? 'url(#voronoi_purple)'
                        : polygon.data.state == 1
                        ? 'url(#voronoi_red)'
                        : polygon.data.state == 2
                        ? 'url(#voronoi_green)'
                        : 'url(#voronoi_orange_red)'
                    }
                    fillOpacity={1}
                  />
                </a>
              ))}
            </Group>
          </svg>
          {tooltipData && (
            <div>
              <Tooltip
                top={tooltipTop - 18}
                left={tooltipLeft + 12}
                style={{
                  backgroundColor: tooltipData.bgc,
                  color: tooltipData.color,
                }}
              >
                {`${tooltipData.content}`}
              </Tooltip>
            </div>
          )}
        </Segment>
      </div>
    );
  }
}

export default withTooltip(StudentDashboard);
