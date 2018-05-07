import React, { Component, Fragment } from 'react';

import { MuiThemeProvider } from "material-ui/styles";
import { createMuiTheme } from "material-ui/styles";

import Paper from 'material-ui/Paper';
import Switch from 'material-ui/Switch';
import Slider, { Range } from 'rc-slider';

import PerlinNoiseGenerator from './classes/PerlinNoiseGenerator.cls';

import PerlinNoiseCanvas from './components/PerlinNoiseCanvas/PerlinNoiseCanvas';
import PerlinNoise3DPreview from './components/PerlinNoise3DPreview/PerlinNoise3DPreview';
import PerlinNoiseControls from './components/PerlinNoiseControls/PerlinNoiseControls';
import IslandOptions from "./components/IslandOptions/IslandOptions";

import './App.css';

const theme = createMuiTheme({
  palette: {
      type: 'light',
      primary: { main: "#00ff90" },
      secondary: { main: "#042c4b" }
  }
});


/*============ CLASS DEFINITION ============*/

class App extends Component {

  state = {
    perlinNoiseGenerator: false,
    useTerrainPerlinNoiseColors: false
  }

  constructor (props) {
    super(props);

  }

  onValuesChanged = (newConfigs) => {
    this.setState({
      perlinNoiseGenerator: new PerlinNoiseGenerator(newConfigs)
    });
  };

  onIslandValuesChanged = (newIslandValues) => {
    this.setState({
      perlinNoiseGenerator: new PerlinNoiseGenerator(newIslandValues)
    });
  };

  onUseTerrainPerlinNoiseColorsChanged = (useTerrainPerlinNoiseColors) => {
    this.setState({
      useTerrainPerlinNoiseColors: useTerrainPerlinNoiseColors
    });
  };

  render() {
    return (

      <MuiThemeProvider theme={theme}>
        <header className="container-fluid">

          <div className="row">
            <div className="col">

              <div className="container">
                <div className="row">
                  <div className="col-sm">
                    <h1>Terrain Generation</h1>
                    <h2>Fractals, Memory, and User Experience</h2>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </header>

        <div className="container-fluid">
          <div className="row">

            <div className="col col-xl-7 col-lg-6">
              <div className="row">

                <div className="col col-xl-7 col-lg-12">
                  <PerlinNoiseControls onChange={this.onValuesChanged}></PerlinNoiseControls>
                </div>

                <div className="col col-xl-5 col-lg-12">
                  <Paper className="paper-container">
                    <h3>Perlin Noise
                      <span className="perlin-noise-color-type-wrapper">
                        <span className="perlin-noise-color-type-label">terrain colors</span>
                        <Switch
                          color="primary"
                          checked={this.state.useTerrainPerlinNoiseColors}
                          onChange={(e) => { this.onUseTerrainPerlinNoiseColorsChanged(e.target.checked);}}
                        />
                      </span>
                    </h3>
                    <PerlinNoiseCanvas perlinNoiseGenerator={this.state.perlinNoiseGenerator} useTerrainColors={this.state.useTerrainPerlinNoiseColors}></PerlinNoiseCanvas>
                  </Paper>

                  <Paper className="paper-container">
                    <IslandOptions onChange={this.onIslandValuesChanged}></IslandOptions>
                  </Paper>
                </div>

              </div>
            </div>

            <div className="col col-xl-5 col-lg-6">
              <Paper className="paper-container">
                <h3>3D Preview</h3>
                <PerlinNoise3DPreview perlinNoiseGenerator={this.state.perlinNoiseGenerator}></PerlinNoise3DPreview>
              </Paper>
            </div>

          </div>
        </div>

      </MuiThemeProvider>
    );
  }
}

export default App;
