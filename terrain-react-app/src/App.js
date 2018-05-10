import React, { Component } from 'react';

import { MuiThemeProvider } from "material-ui/styles";
import { createMuiTheme } from "material-ui/styles";

import Paper from 'material-ui/Paper';
import Switch from 'material-ui/Switch';
import Button from 'material-ui/Button';

import Link from '@material-ui/icons/Link';
import ThumbUp from '@material-ui/icons/ThumbUp';

import copy from 'copy-to-clipboard';
import qs from 'qs';

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
    currentURLCopied: false,
    seed: Math.random(),
    octaves: [{
      id: -1,
      xScale: 3,
      zScale: 3,
      elevationPercent: 100
    }],
    islandConfigs: {
      enabled: false,
      seaLevel: 16,
      shelfPercent: 16,
      seaOpacity: 40
    },
    perlinNoiseGenerator: false,
    useTerrainPerlinNoiseColors: false
  }

  getTransformedIslandConfigs = (iConfigs) => {
    return {
      enabled: iConfigs.enabled,
      seaLevel: iConfigs.seaLevel / 100,
      shelfPercent: iConfigs.shelfPercent / 100,
      seaOpacity: iConfigs.seaOpacity / 100
    };
  };

  onOctavesChanged = (newOctaves) => {
    this.setState({
      currentURLCopied: false,
      octaves: newOctaves,
      perlinNoiseGenerator: new PerlinNoiseGenerator({
        seed: this.state.seed,
        octaves: newOctaves,
        islandConfigs: this.getTransformedIslandConfigs(this.state.islandConfigs)
      })
    });
  };

  onIslandValuesChanged = (newIslandConfigs) => {
    this.setState({
      currentURLCopied: false,
      islandConfigs: newIslandConfigs,
      perlinNoiseGenerator: new PerlinNoiseGenerator({
        seed: this.state.seed,
        octaves: this.state.octaves,
        islandConfigs: this.getTransformedIslandConfigs(newIslandConfigs)
      })
    });
  };

  onUseTerrainPerlinNoiseColorsChanged = (useTerrainPerlinNoiseColors) => {
    this.setState({
      currentURLCopied: false,
      useTerrainPerlinNoiseColors: useTerrainPerlinNoiseColors
    });
  };

  copyURL = () => {

    const savedConfigs = {
      seed: this.state.seed,
      octaves: this.state.octaves,
      islandConfigs: this.state.islandConfigs,
      useTerrainPerlinNoiseColors: this.state.useTerrainPerlinNoiseColors
    };

    copy(window.location.origin + window.location.pathname + '?configs=' + encodeURIComponent(JSON.stringify(savedConfigs)));

    this.setState({
      currentURLCopied: true
    });
  };

  componentDidMount () {

    // if there are query params, use those to override the initial state
    const params = qs.parse(window.location.search.slice(1));

    if (params.configs) {

      const parsedParams = JSON.parse(params.configs);

      // re-hydrate the perlinNoiseGenerator
      parsedParams.perlinNoiseGenerator = new PerlinNoiseGenerator({
        seed: parsedParams.seed,
        octaves: parsedParams.octaves,
        islandConfigs: this.getTransformedIslandConfigs(parsedParams.islandConfigs)
      })

      this.setState(parsedParams);
    }
  }

  render() {
    return (

      <MuiThemeProvider theme={theme}>

        <div className="header-container">
          <header className="container-fluid">

            <div className="row">

              <div className="col col-sm-12 text-left">
                <h1>Interactive Terrain Generation</h1>
                <h2>From the article: <a href="https://medium.com/p/76f93da23601" target="_blank" rel="noopener noreferrer">How to Make Mountains With Perlin Noise</a></h2>
              </div>

            </div>
          </header>
        </div>

        <div className="container-fluid">
          <div className="row">


            <div className="col-xl-5 col-md-6 order-2">
              <Paper className="paper-container">
                <h3>3D Preview</h3>
                <PerlinNoise3DPreview perlinNoiseGenerator={this.state.perlinNoiseGenerator} seaLevel={this.state.islandConfigs.seaLevel/100} seaOpacity={this.state.islandConfigs.seaOpacity/100}></PerlinNoise3DPreview>
              </Paper>
            </div>

            <div className="col-xl-7 col-md-6 order-1">
              <div className="row">

                <div className="col-xl-5 col-sm-12">

                  <Paper className="paper-container">
                    <Button variant="fab" color={this.state.currentURLCopied ? 'default' : 'primary'} className="share-link" onClick={this.copyURL}>
                      {this.state.currentURLCopied && (
                        <ThumbUp></ThumbUp>
                      )}
                      {!this.state.currentURLCopied && (
                        <Link></Link>
                      )}
                    </Button>

                    {this.state.currentURLCopied && (
                      <span className="share-link-text">URL copied to clipboard!</span>
                    )}
                    {!this.state.currentURLCopied && (
                      <span className="share-link-text">Press to save your work.</span>
                    )}
                  </Paper>

                  <Paper className="paper-container">
                    <h3>Perlin Noise
                      <span className="perlin-noise-color-type-wrapper">
                        <span className="perlin-noise-color-type-label">color</span>
                        <Switch
                          color="primary"
                          checked={this.state.useTerrainPerlinNoiseColors}
                          onChange={(e) => { this.onUseTerrainPerlinNoiseColorsChanged(e.target.checked);}}
                        />
                      </span>
                    </h3>
                    <PerlinNoiseCanvas perlinNoiseGenerator={this.state.perlinNoiseGenerator} seaLevel={this.state.islandConfigs.seaLevel / 100} useTerrainColors={this.state.useTerrainPerlinNoiseColors}></PerlinNoiseCanvas>
                  </Paper>

                  <IslandOptions configs={this.state.islandConfigs} onChange={this.onIslandValuesChanged}></IslandOptions>

                </div>

                <div className="col-xl-7 col-sm-12">
                  <PerlinNoiseOctaveControls octaves={this.state.octaves} onChange={this.onOctavesChanged}></PerlinNoiseOctaveControls>
                </div>

              </div>
            </div>



          </div>
        </div>

      </MuiThemeProvider>
    );
  }
}

export default App;
