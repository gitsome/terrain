import SimplexNoise from "simplex-noise";
import {scaleLinear} from "d3-scale";
import {easeSinIn, easeCubicInOut, easeCircleOut} from "d3-ease";

import ThreeUtils from "../services/ThreeUtils.svc";
import { MapsRestaurant } from "material-ui";


/*============ PRIVATE STATIC VARIABLES AND METHODS ============*/

const PI = Math.PI;
const PI2 = 2 * Math.PI;

const simplexNoise = new SimplexNoise(Math.random());
const getPerlin = (x, y) => {
  return (simplexNoise.noise2D(x,y) + 1.0) / 2;
};

const angleDistanceScale = scaleLinear()
  .domain([0, 0.1, 0.5])
  .range([0, 1, 0, 1]);


/*============ CLASS DEFINITION ============*/

class PerlinNoiseGenerator {

  get = false; // this will be updated when the configs are set or are updated

  octaves = [];

  islandConfigs = {
    seaLevel: 0,
    seaLevelPadding: 0
  };

  getSeaLevelPadding = () => {
    return this.islandConfigs.seaLevelPadding;
  };

  updateGet = () => {

    const SEA_LEVEL_PADDING = this.islandConfigs.seaLevelPadding;
    const SHORE_RADIUS = 0.5 - SEA_LEVEL_PADDING;
    const SEA_LEVEL_PERCENT = this.islandConfigs.seaLevel;

    const CENTRAL_HEIGHT_PERCENT = 0.95;

    const seaLevelScale = scaleLinear()
      .domain([0, SHORE_RADIUS, 1])
      .range([SEA_LEVEL_PERCENT, SEA_LEVEL_PERCENT, 0]);

    const centralHeightScale = scaleLinear()
      .domain([0, 1])
      .range([1, 0]);

    let cachedATan = Math.atan2(0, 1);

    let radianWeight;

    let getBaseNoiseValue = (distanceToCenter) => {
      return seaLevelScale(distanceToCenter);
    };

    let inverseDistancePercent;
    let centralHeightPercent;
    let getMainHeightNoise = (x, y, distanceToCenterPercent) => {

      return getPerlin(x * 2, y * 10);

      if (distanceToCenterPercent <= 1) {
        return getPerlin(x * 5, y * 5) * centralHeightScale(distanceToCenterPercent) * CENTRAL_HEIGHT_PERCENT;
      } else {
        return 0;
      }
    };

    let distanceToCenter;
    let distanceToCenterPercent;

    let cachedXDist;
    let cachedYDist;

    let noiseValue;

    this.get = (x, y) => {

      cachedXDist = (x - 0.5);
      cachedYDist = (y - 0.5);
      distanceToCenter = Math.sqrt(cachedXDist * cachedXDist + cachedYDist * cachedYDist);
      distanceToCenterPercent = distanceToCenter / 0.5;

      noiseValue = getBaseNoiseValue(distanceToCenter);
      noiseValue = noiseValue + getMainHeightNoise(x, y, distanceToCenterPercent);

      return noiseValue;
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
