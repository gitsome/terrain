import React, { Component } from 'react';

import { MuiThemeProvider } from "material-ui/styles";
import { createMuiTheme } from "material-ui/styles";

import Paper from 'material-ui/Paper';
import Switch from 'material-ui/Switch';

import PerlinNoiseGenerator from './classes/PerlinNoiseGenerator.cls';

import PerlinNoiseCanvas from './components/PerlinNoiseCanvas/PerlinNoiseCanvas';
import PerlinNoise3DPreview from './components/PerlinNoise3DPreview/PerlinNoise3DPreview';
import PerlinNoiseOctaveControls from './components/PerlinNoiseOctaveControls/PerlinNoiseOctaveControls';
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
    octaves: [{
      id: -4,
      xScale: 3,
      zScale: 3,
      elevationPercent: 66.5
    },
    {
      id: -3,
      xScale: 8,
      zScale: 8,
      elevationPercent: 30
    },
    {
      id: -2,
      xScale: 27,
      zScale: 27,
      elevationPercent: 3
    },
    {
      id: -1,
      xScale: 45,
      zScale: 45,
      elevationPercent: 1
    }],
    islandConfigs: {
      enabled: false,
      seaLevel: 5,
      shelfPercent: 8,
      seaOpacity: 40
    },
    perlinNoiseGenerator: false,
    useTerrainPerlinNoiseColors: false
  }

  getTransformedIslandConfigs = (iConfigs) => {
    return {
      enabled: iConfigs.enabled,
      seaLevel: iConfigs.seaLevel / 50,
      shelfPercent: iConfigs.shelfPercent / 50,
      seaOpacity: iConfigs.seaOpacity / 100
    };
  };

  onOctavesChanged = (newOctaves) => {
    this.setState({
      octaves: newOctaves,
      perlinNoiseGenerator: new PerlinNoiseGenerator({
        octaves: newOctaves,
        islandConfigs: this.getTransformedIslandConfigs(this.state.islandConfigs)
      })
    });
  };

  onIslandValuesChanged = (newIslandConfigs) => {
    this.setState({
      islandConfigs: newIslandConfigs,
      perlinNoiseGenerator: new PerlinNoiseGenerator({
        octaves: this.state.octaves,
        islandConfigs: this.getTransformedIslandConfigs(newIslandConfigs)
      })
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
                  <PerlinNoiseOctaveControls octaves={this.state.octaves} onChange={this.onOctavesChanged}></PerlinNoiseOctaveControls>
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
                    <PerlinNoiseCanvas perlinNoiseGenerator={this.state.perlinNoiseGenerator} seaLevel={this.state.islandConfigs.seaLevel / 50} useTerrainColors={this.state.useTerrainPerlinNoiseColors}></PerlinNoiseCanvas>
                  </Paper>

                  <Paper className="paper-container">
                    <IslandOptions configs={this.state.islandConfigs} onChange={this.onIslandValuesChanged}></IslandOptions>
                  </Paper>
                </div>

              </div>
            </div>

            <div className="col col-xl-5 col-lg-6">
              <Paper className="paper-container">
                <h3>3D Preview</h3>
                <PerlinNoise3DPreview perlinNoiseGenerator={this.state.perlinNoiseGenerator} seaLevel={this.state.islandConfigs.seaLevel/50} seaOpacity={this.state.islandConfigs.seaOpacity/100}></PerlinNoise3DPreview>
              </Paper>
            </div>

          </div>
        </div>

      </MuiThemeProvider>
    );
  }
}

export default App;
