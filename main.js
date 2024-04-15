import './style.css';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TextureLoader } from 'three';

window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.style.display = 'none';
});
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.y = 4.0; // Set the camera position
camera.position.z = 5.0; // Set the camera position

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

const loader = new GLTFLoader();
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// const controls = new OrbitControls(camera, renderer.domElement);

// Create lights and add them to the scene
const pointLight = new THREE.PointLight(0xffffff, 15000);
pointLight.position.set(5,50,50);
const pointLight2 = new THREE.PointLight(0xffffff, 15000);
pointLight2.position.set(-50,10,1);
scene.add(pointLight,pointLight2);



window.addEventListener('click', onDocumentMouseClick, false);

let icon;
loader.load('./assets/icon_folder/scene.gltf', (gltf) => {
    icon = gltf;
    icon.scene.scale.set(0.006, 0.006, 0.006); // Set the scale of the icon
    icon.scene.position.set(0, 0, 3.4); // Set the position of the icon
    scene.add(icon.scene);
});

function onDocumentMouseClick(event) {
    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);
    for (let i = 0; i < intersects.length; i++) {
        let obj = intersects[i].object;
        while (obj) {
            if (obj === icon.scene) {
                window.open('https://github.com/cachet23/', '_blank');
                return; // Exit the function after opening the link
            }
            obj = obj.parent;
        }
    }
}

let spaceBoi;
loader.load('./assets/space_boi/scene.gltf', (gltf) => {
    spaceBoi = gltf;
    spaceBoi.scene.scale.set(0.6, 0.6, 0.6); // Set the scale of the loaded model
    scene.add(spaceBoi.scene);
});

function moveCamera() {
    const t = document.body.getBoundingClientRect().top;
    const radius = 5.0; // Set the radius of the circle

    const x = radius * Math.sin(t * 0.001); // Calculate the x position on the circle
    const z = radius * Math.cos(t * 0.001); // Calculate the z position on the circle

    camera.position.x = x;
    camera.position.z = z;
    camera.lookAt(scene.position); // Make the camera look at the center of the scene

    if (icon && progress >= 1.0) {
        // Calculate the new position of the icon
        const iconX = 3.4 * Math.sin(t * 0.003); // Half the speed of the camera
        const iconZ = 3.4 * Math.cos(t * 0.003); // Half the speed of the camera

        // Update the position of the icon
        icon.scene.position.x = iconX;
        icon.scene.position.z = iconZ;

        // Rotate the icon around the Y axis
        const axis = new THREE.Vector3(0, 1, 0);
        const angle = Math.PI / 180; // Rotate 1 degree per frame
        icon.scene.rotateOnAxis(axis, angle);
    }
}
document.body.onscroll = moveCamera;
moveCamera();

// Function to add a star to the scene
function addStar(){
    const geometry = new THREE.SphereGeometry(0.025,24,204);
    const material = new THREE.MeshStandardMaterial({color: 0xffffff});
    const star = new THREE.Mesh(geometry, material);
  
    const [x] = Array(2).fill().map(() => THREE.MathUtils.randFloatSpread(35));
    const [y] = Array(2).fill().map(() => THREE.MathUtils.randFloatSpread(70));
    const [z] = Array(1).fill().map(() => THREE.MathUtils.randFloatSpread(25));
    
    star.position.set(x,y,z)
  
    scene.add(star);
}
  
Array(2500).fill().forEach(addStar);



// Define the points for the curve
const points = [
    new THREE.Vector3(0, 40, 0), // Initial position
    new THREE.Vector3(0, 25, 10), // Intermediate position
    new THREE.Vector3(0, 4.0, 5.0) // Target position
];

let progress = 0.0;
// Create the curve
const curve = new THREE.CatmullRomCurve3(points);



// In your animate function, update the camera position based on the curve
function animate() {
    requestAnimationFrame(animate);

    // If the animation is not finished, update the camera position
    if (progress < 1.0) {
        camera.position.copy(curve.getPoint(progress));
        progress += 0.01; // Adjust this value to change the speed of the animation
    } else {
        // Once the animation is finished, call the moveCamera function on scroll
        document.body.onscroll = moveCamera;
        moveCamera();
    }

    renderer.render(scene, camera);
}
animate();