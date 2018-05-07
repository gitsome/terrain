import React, { Component } from 'react';
import PerlinNoise3D from '../../classes/PerlinNoise3D.cls';

import './PerlinNoise3DPreview.css';
class PerlinNoise3DPreview extends Component {

  canvasElement = false;
  canvasElementContainer = false;

  perlinNoisePreview = false;

  updateCanvasDims = () => {
    this.canvasElement.width = this.canvasElementContainer.offsetWidth;
    this.canvasElement.height = this.canvasElementContainer.offsetWidth;
  }

  shouldComponentUpdate (newProps, newState) {
    return newProps.perlinNoiseGenerator !== this.props.perlinNoiseGenerator;
  }

  componentDidUpdate = () => {
    this.updateCanvasDims();
    this.perlineNoise3D.update(this.props.perlinNoiseGenerator.get);
  }

  componentDidMount () {

    this.updateCanvasDims();

    this.perlineNoise3D = new PerlinNoise3D({
      canvas: this.canvasElement,
      points: 400
    });
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
