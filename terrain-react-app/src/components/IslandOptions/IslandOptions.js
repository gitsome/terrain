import React, { Component, Fragment } from 'react';

import Switch from 'material-ui/Switch';

import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';


import './IslandOptions.css';
class IslandOptions extends Component {

  state = {
    seaLevel: 0,
    seaLevelOpacity: 1.0,
    seaLevelPadding: 5,
    useIslandOptions: true
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

  notifyStateChange = () => {
    this.props.onChange({
      seaLevelPadding: (this.state.seaLevelPadding / 100) * 0.5,
      seaLevel: (this.state.seaLevel / 100),
      seaLevelOpacity: (this.state.seaLevelOpacity / 100),
      useIslandOptions: this.state.useIslandOptions
    });
  }

  toggleUseIslandOptions (useIslandOptions) {
    this.setState({
      useIslandOptions: useIslandOptions
    });
  }

  render() {
    return (
      <Fragment>

        <h3>Apply Island Settings
          <Switch
            color="primary"
            checked={this.state.useIslandOptions}
            onChange={(e) => { this.toggleUseIslandOptions(e.target.checked);}}
          />
        </h3>

        {this.state.useIslandOptions && (
          <div className="island-options-active">

            <div className="perlin-noise-control">
              <label>Sea Level</label>
              <Slider min={0} max={100} defaultValue={5} />
            </div>

            <div className={"perlin-noise-control " + (this.state.activeInput === "seaLevelPadding" ? "perlin-noise-control-active" : "")}>
              <label>Sea Opacity</label>
              <Slider min={0} max={100} value={100}/>
            </div>

            <div className={"perlin-noise-control " + (this.state.activeInput === "seaLevelPadding" ? "perlin-noise-control-active" : "")}>
              <label>Sea Level Padding</label>
              <Slider min={0} max={50} value={this.state.seaLevelPadding} onChange={this.onSeaLevelPaddingChange} onBeforeChange={() => {this.sliderChangeStart('seaLevelPadding')}} onAfterChange={() => {this.sliderChangeEnd('seaLevelPadding')}}/>
              <p className="perlin-noise-description">Space between edge of map and island that will be underwater</p>
            </div>

          </div>
        )}

      </Fragment>
    );
  }
}

export default IslandOptions;

