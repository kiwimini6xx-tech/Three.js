import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// 1. Setup Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 2. Add Lighting
const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);
const pointLight = new THREE.PointLight(0xffffff, 2);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

// 3. Create the "Dot" (User Marker)
const geometry = new THREE.SphereGeometry(0.1, 32, 32);
const material = new THREE.MeshPhongMaterial({ color: 0xff0000, emissive: 0xff0000 });
const userDot = new THREE.Mesh(geometry, material);
scene.add(userDot); // เพิ่มจุดแดงลงในฉาก

// 4. Load your GLB Model
const loader = new GLTFLoader();
loader.load('https://engai.sut.ac.th/n8n2/webhook/get-model', (gltf) => {
    scene.add(gltf.scene);
    console.log("Model Loaded");
});

camera.position.set(2, 2, 5);
const controls = new OrbitControls(camera, renderer.domElement);

// 5. Function to update position (Animation)
function movePoint(x, y, z) {
    // กำหนดตำแหน่ง Router อ้างอิง (เช่นเดียวกับที่คุยกันครั้งก่อน)
    const routerOffset = { x: 1.5, y: 0.5, z: -1.8 };
    
    // การเปลี่ยนตำแหน่งใน Three.js
    userDot.position.set(
        routerOffset.x + x,
        routerOffset.y + y,
        routerOffset.z + z
    );
}

// 6. Fetch Data from n8n
async function fetchData() {
    try {
        // เปลี่ยนเป็น URL Webhook ที่ส่ง JSON ของคุณ
        const response = await fetch('YOUR_N8N_JSON_WEBHOOK_URL');
        const data = await response.json();
        
        movePoint(data.x, data.y, data.z);
        
        document.getElementById('pos').innerText = `${data.x}, ${data.y}, ${data.z}`;
        document.getElementById('status').innerText = "Online";
    } catch (e) {
        console.log("Waiting for data...");
    }
}

setInterval(fetchData, 1000); // ดึงข้อมูลทุก 1 วินาที

// Render Loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();