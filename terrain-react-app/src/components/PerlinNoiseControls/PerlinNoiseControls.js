import React, { Component } from 'react';

import without from 'lodash/without';

import Paper from 'material-ui/Paper';
import Switch from 'material-ui/Switch';
import Button from 'material-ui/Button';

import AddCircle from '@material-ui/icons/AddCircle';

import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';

import PerlinNoiseOctave from '../PerlinNoiseOctave/PerlinNoiseOctave';

import './PerlinNoiseControls.css';

class PerlinNoiseControls extends Component {

  state = {
    seaLevelPadding: 5,
    activeInput: false,
    useIslandOptions: false,
    octaves: [
      {
        id: 0,
        xScale: 5,
        yScale: 14,
        xOffset: 0,
        yOffset: 0
      }
    ]
  };

  activeInput = false;

  notifyStateChange = () => {
    this.props.onChange({
      seaLevelPadding: (this.state.seaLevelPadding / 100) * 0.5,
      octaves: this.state.octaves,
      useIslandOptions: this.state.useIslandOptions
    });
  }

  getMaxScaleX = () => {
    let max = 5;

    this.state.octaves.forEach((octave) => {
      if (octave.xScale > max) {
        max = octave.xScale;
      }
    });

    return max;
  };
  getMaxScaleY = () => {
    let max = 5;

    this.state.octaves.forEach((octave) => {
      if (octave.yScale > max) {
        max = octave.yScale;
      }
    });

    return max;
  };

  octaveId = 0;
  getNewOctave = () => {

    this.octaveId++;

    return {
      id: this.octaveId,
      xScale: this.getMaxScaleX() * 1.25,
      ySacle: this.getMaxScaleY() * 1.25,
      xOffset: 0,
      yOffset: 0
    }
  };

  addOctave = () => {
    this.setState({
      octaves: this.state.octaves.concat([this.getNewOctave()])
    });
  };

  onSeaLevelPaddingChange = (newValue) => {
    this.setState({seaLevelPadding: newValue});
  }

  sliderChangeStart (inputKey) {
    this.setState({activeInput: inputKey});
  }

  sliderChangeEnd (inputKey) {
    this.setState({activeInput: false});
    this.notifyStateChange();
  }

  toggleUseIslandOptions (useIslandOptions) {
    this.setState({
      useIslandOptions: useIslandOptions
    });
  }

  onDeleteOctave = (octave) => {
    this.setState({
      octaves: without(this.state.octaves, octave)
    })
  }

  render() {
    return (
        <div className="perlin-noise-controls">

          <Paper className="perlin-noise-controls-octave-controls">

            <h3>Perlin Noise Octaves</h3>

            {
              this.state.octaves.map((octave) => {
                return (
                  <Paper className="perlin-noise-octave-wrapper" key={octave.id}>
                    <PerlinNoiseOctave octave={octave} onDelete={this.onDeleteOctave}></PerlinNoiseOctave>
                  </Paper>
                );
              })
            }

            <Button variant="raised" color="primary" size="large" style={{width: '100%'}} onClick={this.addOctave}>
              Add Octave
              <AddCircle className="icon-right" />
            </Button>

          </Paper>

        </div>
    );
  }
}

export default PerlinNoiseControls;
