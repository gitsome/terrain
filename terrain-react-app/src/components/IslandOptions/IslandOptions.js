import React, { Component, Fragment } from 'react';

import Switch from 'material-ui/Switch';
import Paper from 'material-ui/Paper';

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';


import './IslandOptions.css';
class IslandOptions extends Component {

  onShelfPercentChange = (newShelfPercent) => {
    this.props.onChange({
      enabled: this.props.configs.enabled,
      seaLevel: this.props.configs.seaLevel,
      shelfPercent: newShelfPercent,
      seaOpacity: this.props.configs.seaOpacity
    });
  };

  onSeaLevelChanged = (newSeaLevel) => {
    this.props.onChange({
      enabled: this.props.configs.enabled,
      seaLevel: newSeaLevel,
      shelfPercent: this.props.configs.shelfPercent,
      seaOpacity: this.props.configs.seaOpacity
    });
  };

  onSeaOpacityChanged = (newSeaOpacity) => {
    this.props.onChange({
      enabled: this.props.configs.enabled,
      seaLevel: this.props.configs.seaLevel,
      shelfPercent: this.props.configs.shelfPercent,
      seaOpacity: newSeaOpacity
    });
  };

  toggleUseIslandOptions () {
    this.props.onChange({
      enabled: !this.props.configs.enabled,
      seaLevel: this.props.configs.seaLevel,
      shelfPercent: this.props.configs.shelfPercent,
      seaOpacity: this.props.configs.seaOpacity
    });
  }

  render() {
    return (
      <Fragment>

        <Paper className="paper-container">
          <h3 className="mb-0">Apply Island Shape
            <Switch
              color="primary"
              checked={this.props.configs.enabled}
              onChange={(e) => { this.toggleUseIslandOptions(e.target.checked);}}
            />
          </h3>

          {this.props.configs.enabled && (
            <div className="island-options-active mt-3">

              <div className="perlin-noise-control mb-0">
                <label>Sea Level Padding</label>
                <Slider min={0} max={25} value={this.props.configs.shelfPercent} onChange={this.onShelfPercentChange}/>
                <p className="perlin-noise-description">Space between edge of map and island that will be underwater</p>
              </div>

            </div>
          )}
        </Paper>

        <Paper className="paper-container">
          <h3 className="mb-0">Sea Options</h3>

          <div className="perlin-noise-control mt-3">
            <label>Sea Level</label>
            <Slider min={0} max={50} value={this.props.configs.seaLevel} onChange={this.onSeaLevelChanged}/>
          </div>

          <div className="perlin-noise-control mb-0">
            <label>Sea Opacity</label>
            <Slider min={0} max={100} value={this.props.configs.seaOpacity} onChange={this.onSeaOpacityChanged}/>
          </div>
        </Paper>

      </Fragment>
    );
  }
}

export default IslandOptions;

