import SimplexNoise from "simplex-noise";
import {scaleLinear} from "d3-scale";
import {easeCubicIn, easeCubicOut, easeCubicInOut, easeCircleOut, easeQuadInOut} from "d3-ease";

import ThreeUtils from "../services/ThreeUtils.svc";
import { MapsRestaurant } from "material-ui";
import { SSL_OP_PKCS1_CHECK_1 } from "constants";


/*============ PRIVATE STATIC VARIABLES AND METHODS ============*/

const PI = Math.PI;
const PI2 = 2 * Math.PI;

const ISLAND_SHELF_MAX_PERLIN_PERCENT = 0.15;

const simplexNoise = new SimplexNoise(Math.random());
const getPerlin = (x, y) => {
  return (simplexNoise.noise2D(x,y) + 1.0) / 2;
};


/*============ CLASS DEFINITION ============*/

class PerlinNoiseGenerator {

  get = false; // this will be updated when the configs are set or are updated

  octaves = [];

  islandConfigs = {
    enabled: false,
    seaLevel: 0,
    shelfPercent: 0
  };

  getShelfPercent = () => {
    return this.islandConfigs.shelfPercent;
  };

  updateGet = () => {

    const SEA_LEVEL_PERCENT = this.islandConfigs.seaLevel || 0.1;
    const LAND_HEIGHT_PERCENT = 1 - SEA_LEVEL_PERCENT;

    const SHELF_PERCENT = this.islandConfigs.shelfPercent || 0.2;
    const LAND_PERCENT = 1 - SHELF_PERCENT;

    const perlinScale = scaleLinear()
      .domain([0, SHELF_PERCENT, 1])
      .range([0, ISLAND_SHELF_MAX_PERLIN_PERCENT, 1]);

    let octavePerlinMethods = {};

    this.octaves.forEach((octave) => {

      let octavePercent = (octave.elevationPercent / 100);

      octavePerlinMethods[octave.id] = (x, y) => {
        return getPerlin(x * octave.xScale, y * octave.zScale) * octavePercent;
      };
    });

    let inverseDistancePercent;
    let centralHeightPercent;
    let octaveIndex;
    let octave;
    let perlinNoiseValue;
    let getNoiseValue = (x, y) => {

      perlinNoiseValue = 0;

      for (octaveIndex = 0; octaveIndex < this.octaves.length; octaveIndex++) {
        octave = this.octaves[octaveIndex];
        perlinNoiseValue = perlinNoiseValue + octavePerlinMethods[octave.id](x, y);
      }

      return perlinNoiseValue;
    };

    let noiseValue;
    let shelfDistancePercent;
    let landDistancePercent;
    let getTerrainHeight = (x, y, distanceToCenterPercent) => {

      if (!this.islandConfigs.enabled) {
        return getNoiseValue(x, y);
      }

      // ocean floor
      if (distanceToCenterPercent > 1) {
        return 0;
      } else {

        noiseValue = getNoiseValue(x, y);

        // island shelf
        if (distanceToCenterPercent > (1 - SHELF_PERCENT)) {
          shelfDistancePercent = (distanceToCenterPercent - (1 - SHELF_PERCENT)) / SHELF_PERCENT;
          return easeCubicInOut(1 - shelfDistancePercent) * SEA_LEVEL_PERCENT + perlinScale(1 - distanceToCenterPercent) * noiseValue * LAND_HEIGHT_PERCENT;
        // island
        } else {
          landDistancePercent = (distanceToCenterPercent - SHELF_PERCENT) / (1 - SHELF_PERCENT);
          return SEA_LEVEL_PERCENT + perlinScale(1 - distanceToCenterPercent) * noiseValue * LAND_HEIGHT_PERCENT;
        }
      }
    };

    // re-use these so we don't have a ton of garbage collection
    let distanceToCenter;
    let distanceToCenterPercent;
    let cachedXDist;
    let cachedYDist;

    this.get = (x, y) => {

      cachedXDist = (x - 0.5);
      cachedYDist = (y - 0.5);
      distanceToCenter = Math.sqrt(cachedXDist * cachedXDist + cachedYDist * cachedYDist);
      distanceToCenterPercent = distanceToCenter / 0.5;

      return getTerrainHeight(x, y, distanceToCenterPercent);
    }
  };

  updateConfigs = (configs) => {
    this.islandConfigs = configs.islandConfigs;
    this.octaves = configs.octaves;
    this.updateGet();
  }

  constructor(configs) {
    this.updateConfigs(configs);
  }
}

export default PerlinNoiseGenerator;
