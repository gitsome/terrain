import React, { Component } from 'react';

import Switch from 'material-ui/Switch';
import Button from 'material-ui/Button';

import Close from '@material-ui/icons/Close';
import LockOpen from '@material-ui/icons/LockOpen';
import Lock from '@material-ui/icons/Lock';

import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';


import './PerlinNoiseOctave.css';

class PerlinNoiseOctave extends Component {

  state = {
    scaleLocked: true
  };

  xScaleChanged = (newXScale) => {

    const xScale = newXScale;
    let zScale = this.props.octave.zScale;

    if (this.state.scaleLocked) {
      zScale = xScale;
    }

    this.props.onChange({
      id: this.props.octave.id,
      xScale: xScale,
      zScale: zScale,
      elevationPercent: this.props.octave.elevationPercent
    });
  };

  zScaleChanged = (newZScale) => {

    const zScale = newZScale;
    let xScale = this.props.octave.xScale;

    if (this.state.scaleLocked) {
      xScale = zScale;
    }

    this.props.onChange({
      id: this.props.octave.id,
      xScale: xScale,
      zScale: zScale,
      elevationPercent: this.props.octave.elevationPercent
    });
  };

  toggleLock = () => {

    const newLockedState = !this.state.scaleLocked;

    if (newLockedState === true) {

      const xScale = this.props.octave.xScale;

      this.props.onChange({
        id: this.props.octave.id,
        xScale: xScale,
        zScale: xScale,
        elevationPercent: this.props.octave.elevationPercent
      });
    }

    this.setState({
      scaleLocked: newLockedState
    });
  }

  render() {
    return (
      <div className="perlin-noise-octave">

        <Button variant="fab" mini className="perlin-noise-octave-delete" onClick={()=> {this.props.onDelete(this.props.octave)}}>
          <Close/>
        </Button>

        <div className="row">

          <div className="col col-md-4 col-lg-5">
            <div className="perlin-noise-control">
              <label>X Scale</label>
              <Slider min={0} max={100} value={this.props.octave.xScale} onChange={this.xScaleChanged} />
            </div>
          </div>

          <div className="col col-md-4 col-lg-2 text-center">
            <Button variant={this.state.scaleLocked ? 'raised' : 'flat'} size="small" aria-label="lock and unlock x and z scale" onClick={this.toggleLock} className={'perlin-noise-octave-lock ' + (this.state.scaleLocked ? '' : 'perlin-noise-octave-lock-disabled')}>
              {this.state.scaleLocked && (
                <Lock />
              )}
              {!this.state.scaleLocked && (
                <LockOpen />
              )}
            </Button>
          </div>

          <div className="col col-md-4 col-lg-5">
            <div className="perlin-noise-control">
              <label>Z Scale</label>
              <Slider min={0} max={100} value={this.props.octave.zScale} onChange={this.zScaleChanged} />
            </div>
          </div>

        </div>

        <div className="row">

          <div className="col col-sm-12">
            <div className="perlin-noise-control">
              <label>Elevation Percent</label>
              <Slider min={0} max={100} defaultValue={10} />
              <p className="perlin-noise-description">Sum of all octave elevation percentages must equal 100%</p>
            </div>
          </div>

        </div>

      </div>
    );
  }
}

export default PerlinNoiseOctave;