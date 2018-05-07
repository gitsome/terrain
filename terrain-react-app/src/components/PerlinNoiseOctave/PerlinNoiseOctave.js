import React, { Component } from 'react';

import Switch from 'material-ui/Switch';
import Button from 'material-ui/Button';

import Delete from '@material-ui/icons/Delete';
import LockOpen from '@material-ui/icons/LockOpen';
import LockOutline from '@material-ui/icons/LockOutline';

import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';


import './PerlinNoiseOctave.css';

class PerlinNoiseOctave extends Component {

  state = {
    scaleLocked: true
  };

  toggleLock = () => {
    this.setState({
      scaleLocked: !this.state.scaleLocked
    });
  }

  render() {
    return (
      <div className="perlin-noise-octave">

        <div className="row">

          <div className="col col-sm-5">
            <div className="perlin-noise-control">
              <label>X Scale</label>
              <Slider min={0} max={100} defaultValue={50} />
            </div>
          </div>

          <div className="col col-sm-2 text-center">
            <Button variant={this.state.scaleLocked ? 'raised' : 'flat'} aria-label="lock and unlock x and z scale" onClick={this.toggleLock} className={'perlin-noise-octave-lock ' + (this.state.scaleLocked ? '' : 'perlin-noise-octave-lock-disabled')}>
              {this.state.scaleLocked && (
                <LockOutline />
              )}
              {!this.state.scaleLocked && (
                <LockOpen />
              )}
            </Button>
          </div>

          <div className="col col-sm-5">
            <div className="perlin-noise-control">
              <label>Z Scale</label>
              <Slider min={0} max={100} defaultValue={0} />
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

        <div className="row">

          <div className="col col-sm-12 text-right">
            <Button variant="raised" size="large" onClick={()=> {this.props.onDelete(this.props.octave)}}>
              Delete
              <Delete className="icon-right" />
            </Button>
          </div>

        </div>

      </div>
    );
  }
}

export default PerlinNoiseOctave;
