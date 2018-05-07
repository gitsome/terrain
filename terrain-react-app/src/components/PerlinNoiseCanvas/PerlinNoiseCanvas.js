import React, { Component } from 'react';
import {scaleLinear} from "d3-scale";
import * as d3Color from "d3-color";


import './PerlinNoiseCanvas.css';

class PerlinNoiseCanvas extends Component {

  canvasElement = false;
  canvasElementContainer = false;

  updateCanvasDims = () => {
    this.canvasElement.width = this.canvasElementContainer.offsetWidth;
    this.canvasElement.height = this.canvasElementContainer.offsetWidth;
  }

  updateCanvas = () => {

    console.log("updating the canvas", d3Color);

    let colorScale = scaleLinear()
      .domain([0, 0.05, 0.055, 1.0])
      .range(['#042c4b', '#74c0fb', '#007944', 'white']);

    if (!this.props.useTerrainColors) {
      colorScale = scaleLinear()
      .domain([0, 1.0])
      .range(['#000', '#fff']);
    }

    const seaLevelScale = scaleLinear()
        .domain([0, this.props.perlinNoiseGenerator.getSeaLevelPadding(), 1])
        .range([255, 0, 0]);

    const ctx = this.canvasElement.getContext('2d');

    var width = this.canvasElementContainer.offsetWidth;
    var height = width;

    const image = ctx.createImageData(width, height);
    const data = image.data;

    let value;
    let cell;

    var widthPoints = width - 1;
    var heightPoints = height - 1;

    let x,y, color;
    let maxValue = -Infinity;
    let minValue = Infinity;
    for (x = 0; x < width; x++) {
        for (y = 0; y < height; y++) {

            value = this.props.perlinNoiseGenerator.get(x/widthPoints, y/heightPoints);

            color = d3Color.color(colorScale(value));

            value = value * 255;

            cell = (x + y * width) * 4;
            data[cell] = color.r;
            data[cell + 1] = color.g;
            data[cell + 2] = color.b;
            data[cell + 3] = 255; // alpha.
        }
    }

    ctx.fillColor = 'black';
    ctx.fillRect(0, 0, 100, 100);
    ctx.putImageData(image, 0, 0);
  }

  shouldComponentUpdate (newProps, newState) {
    return (newProps.perlinNoiseGenerator !== this.props.perlinNoiseGenerator) || (newProps.useTerrainColors !== this.props.useTerrainColors);
  }

  componentDidUpdate = () => {
    this.updateCanvasDims();

    if (this.props.perlinNoiseGenerator) {
      this.updateCanvas();
    }
  }

  componentDidMount () {
    this.updateCanvasDims();
  }

  render() {

    return (
        <div className="perlin-noise-canvas" ref={(element) => {this.canvasElementContainer = element;}}>
          <canvas ref={(element) => {this.canvasElement = element;}}></canvas>
        </div>
    );
  }
}

export default PerlinNoiseCanvas;
