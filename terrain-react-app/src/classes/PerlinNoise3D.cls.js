import * as THREE from 'three';
import ThreeUtils from "../services/ThreeUtils.svc";

import * as OrbitControlsClass from "three-orbit-controls";


/*============ PRIVATE STATIC VARIABLES AND METHODS ============*/

const OrbitControls = OrbitControlsClass(THREE);

const MAX_HEIGHT = 7000;
const MAX_WIDTH = 32768;


/*============ CLASS DEFINITION ============*/

class PerlinNoise3D {

    canvas = false;

    getHeight = false;
    seaLevel = 0.1;
    seaOpacity = 0.4;

    points = 500;
    pointsMinusOne = this.points - 1;

    scene = false;
    camera = false;
    renderer = false;
    controls = false;

    terrainMesh = false;
    oceanMesh = false;

    initializeRenderer = () => {

        let canvasWidth = this.canvas.width;
        let canvasHeight = this.canvas.height;

        this.scene = new THREE.Scene({fixedTimeStep: 1 / 60});
        this.scene.background = new THREE.Color( 0xa6d8ff );

        this.camera = new THREE.PerspectiveCamera(60, canvasWidth / canvasHeight, 10, MAX_WIDTH * 4);
        this.camera.rotation.order = "YXZ";

        this.renderer = new THREE.WebGLRenderer({canvas: this.canvas, antialias: true, alpha: true});
        this.renderer.setSize(canvasWidth, canvasHeight);

        this.camera.position.x = 59;
        this.camera.position.z = 27713;
        this.camera.position.y = 32425;

        this.scene.updateMatrixWorld();
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableZoom = true;

        // ambient light
        var ambientLight = new THREE.AmbientLight(0x999999); // soft white light
        this.scene.add(ambientLight);

        // directional light
        var directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
        directionalLight.position.set(1, 2, -2);
        this.scene.add(directionalLight);

        // the actual terrain mesh
        const geometry = new THREE.PlaneBufferGeometry(MAX_WIDTH, MAX_WIDTH, this.points - 1, this.points - 1);
        const material = new THREE.MeshPhongMaterial({
            color: 0x007944,
            specular: 0xFFFFFF,
            shininess: 5,
            shading: THREE.SmoothShading
        });

        this.terrainMesh = new THREE.Mesh(geometry, material);
        this.terrainMesh.rotation.x = -Math.PI / 2;

        this.scene.add(this.terrainMesh);

        // ocean floor
        var oceanFloorGeometry = new THREE.PlaneGeometry(MAX_WIDTH * 2, MAX_WIDTH * 2, 10, 10);
        var oceanFloorMaterial = new THREE.MeshPhongMaterial({
            color: 0x007944,
            specular: 0xFFFFFF,
            shininess: 5
        });

        let oceanFloorPlane = new THREE.Mesh(oceanFloorGeometry, oceanFloorMaterial);
        oceanFloorPlane.rotation.x = -Math.PI / 2;
        this.scene.add(oceanFloorPlane);

        // water
        var waterGeometry = new THREE.PlaneGeometry(MAX_WIDTH * 2, MAX_WIDTH * 2, 10, 10);
        var waterMaterial = new THREE.MeshPhongMaterial({
            color: 0x74c0fb,
            specular: 0x666666,
            shininess: 40,
            opacity: 1.0,
            transparent: true
        });

        this.oceanMesh = new THREE.Mesh(waterGeometry, waterMaterial);
        this.oceanMesh.rotation.x = -Math.PI / 2;
        this.oceanMesh.position.y = MAX_HEIGHT * 0.01;
        this.oceanMesh.material.opacity = this.seaOpacity;

        this.scene.add(this.oceanMesh);
    };

    updateScene = () => {

        let vertices = this.terrainMesh.geometry.attributes.position.array;

        // //set height of vertices
        for (var i = 0; i < this.points; i++) {
            for (var j = 0; j < this.points; j++) {
                vertices[(j + this.points * i) * 3 + 0] = vertices[(j + this.points * i) * 3 + 0];
                vertices[(j + this.points * i) * 3 + 1] = vertices[(j + this.points * i) * 3 + 1];
                vertices[(j + this.points * i) * 3 + 2] = this.getHeight(j/(this.points - 1), (i/(this.points - 1))) * MAX_HEIGHT;
            }
        }

        this.terrainMesh.geometry.computeVertexNormals();
        this.terrainMesh.geometry.attributes.position.needsUpdate = true;

        this.oceanMesh.position.y = Math.max(MAX_HEIGHT * this.seaLevel, MAX_HEIGHT * 0.01);
        this.oceanMesh.__dirtyPosition = true;

        this.oceanMesh.material.opacity = this.seaOpacity;
    };

    startLoop = () => {
        requestAnimationFrame(this.startLoop);
        this.renderer.render(this.scene, this.camera);
    };

    constructor (options) {

        this.canvas = options.canvas;
        this.points = options.points || 400;
        this.seaLevel = options.seaLevel || 0.1;
        this.seaOpacity = options.seaOpacity || 1.0;

        this.initializeRenderer();
        this.startLoop();
    }

    update = (newPerlinGetFunction, seaOpacity, seaLevel) => {

        this.seaLevel = seaLevel;
        this.seaOpacity = seaOpacity;
        this.getHeight = newPerlinGetFunction;

        this.updateScene();
    };

}

export default PerlinNoise3D;