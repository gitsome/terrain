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
    points = 500;

    scene = false;
    camera = false;
    renderer = false;
    controls = false;

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
    };

    getPertebation = () => {
        return (Math.random() - 0.5) * 5;
    };

    updateHeightMapMesh = () => {

        const pointsMinusOne = this.points - 1;

        const geometry = new THREE.PlaneBufferGeometry(MAX_WIDTH, MAX_WIDTH, pointsMinusOne, pointsMinusOne);
        const material = new THREE.MeshPhongMaterial({
            color: 0x007944,
            specular: 0xFFFFFF,
            shininess: 5,
            shading: THREE.FlatShading
        });

        let plane = new THREE.Mesh(geometry, material);
        plane.rotation.x = -Math.PI / 2;

        let vertices = plane.geometry.attributes.position.array;

        // //set height of vertices
        for (var i = 0; i < this.points; i++) {
            for (var j = 0; j < this.points; j++) {
                 vertices[(j + this.points * i) * 3 + 0] = vertices[(j + this.points * i) * 3 + 0];
                 vertices[(j + this.points * i) * 3 + 1] = vertices[(j + this.points * i) * 3 + 1];
                 vertices[(j + this.points * i) * 3 + 2] = this.getHeight(j/(pointsMinusOne), (i/pointsMinusOne)) * MAX_HEIGHT + this.getPertebation();
            }
        }

        plane.geometry.computeVertexNormals();

        this.scene.add(plane);

        var oceanFloorGeometry = new THREE.PlaneGeometry(MAX_WIDTH * 2, MAX_WIDTH * 2, 10, 10);
        var oceanFloorMaterial = new THREE.MeshPhongMaterial({
            color: 0x007944,
            specular: 0xFFFFFF,
            shininess: 5
        });

        let oceanFloorPlane = new THREE.Mesh(oceanFloorGeometry, oceanFloorMaterial);
        oceanFloorPlane.rotation.x = -Math.PI / 2;
        this.scene.add(oceanFloorPlane);

        var waterGeometry = new THREE.PlaneGeometry(MAX_WIDTH * 2, MAX_WIDTH * 2, 10, 10);
        var waterMaterial = new THREE.MeshPhongMaterial({
            color: 0x74c0fb,
            specular: 0x666666,
            shininess: 40,
            opacity: 1.0,
            transparent: true
        });

        let waterPlane = new THREE.Mesh(waterGeometry, waterMaterial);
        waterPlane.rotation.x = -Math.PI / 2;
        waterPlane.position.y = MAX_HEIGHT * 0.05;

        this.scene.add(waterPlane);
    };

    startLoop = () => {
        requestAnimationFrame(this.startLoop);
        this.renderer.render(this.scene, this.camera);
    };

    constructor (options) {

        this.canvas = options.canvas;
        this.points = options.points || 500;

        this.initializeRenderer();
        this.startLoop();
    }

    update = (newPerlinGetFunction) => {
        this.getHeight = newPerlinGetFunction;
        this.updateHeightMapMesh();
    };

}

export default PerlinNoise3D;