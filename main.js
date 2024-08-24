import './style.css';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TextureLoader } from 'three';

window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.style.display = 'none';
});
window.addEventListener('click', onDocumentMouseClick, false);
window.addEventListener('click', () => {
    if (sphereBall) {
        // Increase the y velocity to lift the ball
        velocity.y += 0.1;
    }
});
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});
const loader = new GLTFLoader();
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
// const controls = new OrbitControls(camera, renderer.domElement);
// Create lights and add them to the scene
const pointLight2 = new THREE.PointLight(0xffffff, 15000);
const pointLight = new THREE.PointLight(0xffffff, 15000);

pointLight.position.set(5,50,50);
pointLight2.position.set(-50,10,1);
camera.position.y = 4.0; // Set the camera position
camera.position.z = 5.0; // Set the camera position
scene.add(pointLight,pointLight2);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

let spaceBoi;
loader.load('./assets/space_boi/scene.gltf', (gltf) => {
    spaceBoi = gltf;
    spaceBoi.scene.scale.set(0.6, 0.6, 0.6); // Set the scale of the loaded model
    scene.add(spaceBoi.scene);
});

let icon;
loader.load('./assets/icon_folder/scene.gltf', (gltf) => {
icon = gltf;
icon.scene.scale.set(0.006, 0.006, 0.006); // Set the scale of the icon
    icon.scene.position.set(0, 0, 3.4); // Set the position of the icon
    scene.add(icon.scene);
});
// loading a sphere like ball
let sphereBall;
loader.load('./assets/temari_ball_2/scene.gltf', (gltf) => {
    sphereBall = gltf;
    sphereBall.scene.scale.set(0.29, 0.29, 0.29); // Set the scale of the icon
    sphereBall.scene.position.set(0.3, 6, 1.7); // Set the position of the icon
    scene.add(sphereBall.scene);
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

/**
 * Moves the camera around a circular path and updates the position of an icon.
 */
function moveCamera() {
    const t = document.body.getBoundingClientRect().top;
    const radius = 5.0; // Set the radius of the circle

    const x = radius * Math.sin(t * 0.001); // Calculate the x position on the circle
    const z = radius * Math.cos(t * 0.001); // Calculate the z position on the circle

    camera.position.x = x;
    camera.position.z = z;
    camera.lookAt(scene.position); // Make the camera look at the center of the scene
}
function moveIcon() {
    if (icon && progress >= 1.0) {
        const t = document.body.getBoundingClientRect().top;
        // Calculate the new position of the icon
        const iconX = 3.4 * Math.sin(t * -0.003); // Half the speed of the camera
        const iconZ = 3.4 * Math.cos(t * -0.003); // Half the speed of the camera

        // Update the position of the icon
        icon.scene.position.x = iconX;
        icon.scene.position.z = iconZ;

        // Rotate the icon around the Y axis
        const axis = new THREE.Vector3(0, 1, 0);
        const angle = Math.PI / 360; // Rotate 1 degree per frame
        icon.scene.rotateOnAxis(axis, angle);
    }
}

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

let velocity = new THREE.Vector3(0, 0, 0); // Initial velocity
const gravity = new THREE.Vector3(0, -0.005, 0); // Gravity force
const bounce = 0.8; // Bounce factor
const friction = 0.99; // Friction factor
const maxHeight = 2.0; // Maximum height of the bounce
const rotationAxis = new THREE.Vector3(0, 0, 1);
function moveSphereBall() {
    if (sphereBall) {
        const t = Date.now() * 0.001; // Use the current time to calculate the position

        // Calculate the new position of the sphereBall
        const sphereBallX = 1.7 * Math.sin(t);
        const sphereBallZ = 1.7 * Math.cos(t);

        // Update the position of the sphereBall
        sphereBall.scene.position.x = sphereBallX;
        sphereBall.scene.position.z = sphereBallZ;

        // Update the velocity based on gravity
        velocity.add(gravity);

        // Update the y position based on the velocity
        sphereBall.scene.position.y += velocity.y;

        // If the sphereBall hits the ground, make it bounce and apply friction
        if (sphereBall.scene.position.y < 0.6) {
            sphereBall.scene.position.y = 0.6;
            velocity.y *= -bounce;
            velocity.multiplyScalar(friction);
        }

        // Scale the sphereBall based on its height
        const scale = 0.29 + (maxHeight - sphereBall.scene.position.y) * 0.05;
        sphereBall.scene.scale.set(scale, scale, scale);

        // Rotate the sphereBall
        const rotationSpeed = 0.066; // Adjust this value to change the speed of the rotation
        sphereBall.scene.rotateOnAxis(rotationAxis, rotationSpeed);
    }
}

// Define the points for the curve that the camera will follow
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
        document.body.onscroll = moveSphereBall;
        moveSphereBall();
        progress += 0.01; // Adjust this value to change the speed of the animation
    } else {
        // Once the animation is finished, call the moveCamera function on scroll
        document.body.onscroll = moveCamera;
        document.body.onscroll = moveIcon;
        document.body.onscroll = moveSphereBall;
        moveCamera();
        moveSphereBall();
        moveIcon();
    }

    renderer.render(scene, camera);
}
moveCamera();
animate();