import * as THREE from 'three';
import { getCube, getInput } from './utils';

let renderer, scene, camera, cube;
let mouse, raycaster;
let count = 5000;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    const input = getInput()
    input.value = count;
    document.body.appendChild(input);
    const rendererDom = renderer.domElement;
    document.body.appendChild(rendererDom);

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    addCubesToScene(count);

    camera.position.z = 5;

    window.addEventListener("resize", onWindowResize, false);
    rendererDom.addEventListener("mousedown", onMouseDown, false);
    input.addEventListener("change", onCountChange);
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

function onMouseDown(e) {
    e.preventDefault();
    mouse.x = e.clientX / window.innerWidth * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);
    const a = intersects.find(e => e.object.type === "Mesh");
    if (a) {
        const sphere = a.object;
        const color = sphere.material.color.getStyle();
        const connectedLines = sphere.userData.lineNames;
        sphere.parent.children.forEach(l => {
            if (connectedLines.includes(l.name)) {
                l.material.color.setStyle(color);
            }
        })
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onCountChange(e) {
    const c = e.target.valueAsNumber;
    if (c === count)
        return;
    if (c < count) {
        const delNum = count - c;
        for (let i = 0; i < delNum; i++) {
            scene.remove(scene.children[0]);
        }
    }
    else {
        const addNum = c - count;
        addCubesToScene(addNum);
    }
    count = c;
}

function addCubesToScene(c) {
    for (let i = 0; i < c; i++) {
        cube = getCube();

        cube.position.x = Math.random() * 200 - 100;
        cube.position.y = Math.random() * 200 - 100;
        cube.position.z = Math.random() * 200 - 100;

        cube.rotation.x = Math.random() * 2 * Math.PI;
        cube.rotation.y = Math.random() * 2 * Math.PI;
        cube.rotation.z = Math.random() * 2 * Math.PI;

        cube.scale.x = cube.scale.y = cube.scale.z = Math.random() + 0.5;

        scene.add(cube);
    }
}


init();
animate();