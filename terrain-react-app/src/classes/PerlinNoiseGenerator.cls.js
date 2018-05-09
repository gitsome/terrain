import SimplexNoise from "simplex-noise";
import {scaleLinear} from "d3-scale";
import {easeSinInOut} from "d3-ease";


/*============ PRIVATE STATIC VARIABLES AND METHODS ============*/

const ISLAND_SHELF_MAX_PERLIN_PERCENT = 0.15;


/*============ CLASS DEFINITION ============*/

class PerlinNoiseGenerator {

  get = false; // this will be updated when the configs are set or are updated

  seed = false;

  getPerlin = false;

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

    const perlinLinearScale = scaleLinear()
      .domain([0, SHELF_PERCENT, 1])
      .range([0, ISLAND_SHELF_MAX_PERLIN_PERCENT, 1]);

    const perlinScale = (percent) => {
      return perlinLinearScale(easeSinInOut(percent));
    };


    let octavePerlinMethods = {};

    this.octaves.forEach((octave) => {

      let octavePercent = (octave.elevationPercent / 100);

      octavePerlinMethods[octave.id] = (x, y) => {
        return this.getPerlin(x * octave.xScale, y * octave.zScale) * octavePercent;
      };
    });

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
          return easeSinInOut(1 - shelfDistancePercent) * SEA_LEVEL_PERCENT + perlinScale(1 - distanceToCenterPercent) * noiseValue * LAND_HEIGHT_PERCENT;
        // island
        } else {
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

    this.seed = configs.seed || Math.random();

    const simplexNoise = new SimplexNoise(this.seed);
    this.getPerlin = (x, y) => {
      return (simplexNoise.noise2D(x,y) + 1.0) / 2; // normalize to between 0 and 1
    };

    this.updateGet();
  }

  constructor(configs) {
    this.updateConfigs(configs);
  }
}

export default PerlinNoiseGenerator;
