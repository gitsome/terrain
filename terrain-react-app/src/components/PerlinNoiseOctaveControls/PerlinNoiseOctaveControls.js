import React, { Component } from 'react';

import without from 'lodash/without';

import Paper from 'material-ui/Paper';
import Switch from 'material-ui/Switch';
import Button from 'material-ui/Button';

import AddCircle from '@material-ui/icons/AddCircle';

import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';

import PerlinNoiseOctave from '../PerlinNoiseOctave/PerlinNoiseOctave';

import './PerlinNoiseOctaveControls.css';

class PerlinNoiseOctaveControls extends Component {

  notifyChange = (newOctaves) => {
    this.props.onChange(newOctaves);
  }

  getMaxScaleX = () => {
    let max = 5;

    this.props.octaves.forEach((octave) => {
      if (octave.xScale > max) {
        max = octave.xScale;
      }
    });

    return max;
  };
  getMaxScaleZ = () => {
    let max = 5;

    this.props.octaves.forEach((octave) => {
      if (octave.zScale > max) {
        max = octave.zScale;
      }
    });

    return max;
  };

  octaveId = 0;
  getNewOctave = () => {

    this.octaveId++;

    return {
      id: this.octaveId,
      xScale: Math.min(this.getMaxScaleX() * 2.5, 100),
      zScale: Math.min(this.getMaxScaleZ() * 2.5, 100),
      elevationPercent: 10
    }
  };

  addOctave = () => {

    const newOctave = this.getNewOctave();
    const newOctaves = this.props.octaves.concat([newOctave]);

    this.adjustOctaveElevationPercentages(newOctave, newOctaves);

    this.notifyChange(newOctaves);
  };

  // all elevationPercentages should add up to 1
  adjustOctaveElevationPercentages = (fixedOctave, octaves) => {

    // if there is only one octave then it must be 100 percent
    if (octaves.length === 1) {
      fixedOctave.elevationPercent = 100;
      return;
    }

    const remainingPercent = 100 - fixedOctave.elevationPercent;
    const totalOtherOctavePercent = octaves.reduce((memo, octave) => {
      if (octave.id !== fixedOctave.id) {
        return memo + octave.elevationPercent;
      } else {
        return memo;
      }
    }, 0);

    // if we don't have any wiggle room, then scale down the other octaves based on their percent
    if (totalOtherOctavePercent > remainingPercent) {

      const amountToReduce = totalOtherOctavePercent - remainingPercent;

      octaves.forEach((octave) => {
        if (octave !== fixedOctave) {
          octave.elevationPercent = octave.elevationPercent - amountToReduce * (octave.elevationPercent / totalOtherOctavePercent);
        }
      });

    } else if (totalOtherOctavePercent < remainingPercent) {

      const amountToIncrease = remainingPercent - totalOtherOctavePercent;

      octaves.forEach((octave) => {

        if (octave.id !== fixedOctave.id) {
          if (totalOtherOctavePercent > 0) {
            octave.elevationPercent = octave.elevationPercent + amountToIncrease * (octave.elevationPercent / totalOtherOctavePercent);
          } else {
            octave.elevationPercent = octave.elevationPercent + amountToIncrease * (1 / (octaves.length - 1));
          }
        }
      });
    }
  };

  resetElevationPercentages = (octaves) => {
    if (octaves.length) {
      this.adjustOctaveElevationPercentages(octaves[0], octaves);
    }
  };

  onOctaveChanged = (octaveChanges) => {

    const changedOctave = this.props.octaves.find((octave) => {
      return octave.id === octaveChanges.id;
    });

    if (changedOctave) {

      changedOctave.xScale = octaveChanges.xScale;
      changedOctave.zScale = octaveChanges.zScale;
      changedOctave.elevationPercent = octaveChanges.elevationPercent;

      this.adjustOctaveElevationPercentages(changedOctave, this.props.octaves);

      this.notifyChange(this.props.octaves.slice(0));
    }
  };

  onDeleteOctave = (octave) => {

    const newOctaves = without(this.props.octaves, octave);

    this.resetElevationPercentages(newOctaves);

    this.notifyChange(newOctaves);
  };

  componentDidMount = () => {
    this.resetElevationPercentages(this.props.octaves);
    this.notifyChange(this.props.octaves.slice(0));
  };

  render() {
    return (
        <div className="perlin-noise-octave-controls">

          <Paper className="perlin-noise-octave-controls-container">

            <h3>Perlin Noise Octaves</h3>

            {
              this.props.octaves.map((octave) => {
                return (
                  <Paper className="perlin-noise-octave-wrapper" key={octave.id}>
                    <PerlinNoiseOctave octave={octave} onDelete={this.onDeleteOctave} onChange={this.onOctaveChanged}></PerlinNoiseOctave>
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

export default PerlinNoiseOctaveControls;
