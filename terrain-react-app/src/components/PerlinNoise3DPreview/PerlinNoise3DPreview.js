import React, { Component } from 'react';
import PerlinNoise3D from '../../classes/PerlinNoise3D.cls';

import debounce from "lodash/debounce";

import './PerlinNoise3DPreview.css';
class PerlinNoise3DPreview extends Component {

  canvasElement = false;
  canvasElementContainer = false;

  perlinNoisePreview = false;

  updateCanvasDims = () => {
    this.canvasElement.width = this.canvasElementContainer.offsetWidth;
    this.canvasElement.height = this.canvasElementContainer.offsetWidth;
  }

  componentDidUpdate = () => {
    this.debounced_update();
  }

  componentDidMount () {

    this.updateCanvasDims();

    this.perlineNoise3D = new PerlinNoise3D({
      canvas: this.canvasElement,
      points: 400,
      seaLevel: this.props.seaLevel,
      seaOpacity: this.props.seaOpacity
    });
  }

  constructor (props) {
    super(props);

    this.debounced_update = debounce(() => {
      this.updateCanvasDims();
      this.perlineNoise3D.update(this.props.perlinNoiseGenerator.get, this.props.seaOpacity, this.props.seaLevel);
    }, 500);
  }

  render() {

    return (
      <div className="perlin-noise-3d-preview" ref={(element) => {this.canvasElementContainer = element;}}>
        <canvas ref={(element) => {this.canvasElement = element;}}></canvas>
      </div>
    );
  }
}

export default PerlinNoise3DPreview;
