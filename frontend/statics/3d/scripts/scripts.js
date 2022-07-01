scene = new THREE.Scene();

camera = new THREE.PerspectiveCamera(110, window.innerWidth / (window.innerHeight), 12.9, 3000);
camera.position.z = 150;
camera.position.y = 300;
camera.position.x = 300;

renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor( 0xB6BCB9, 1);
document.body.appendChild(renderer.domElement);

controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;

keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 1.0);
keyLight.position.set(-100, 1000, 100);
scene.add(keyLight);

fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.75);
fillLight.position.set(100, 0, 100);
scene.add(fillLight);

backLight = new THREE.DirectionalLight(0xffffff, 1.0);
backLight.position.set(100, 0, -100).normalize();
scene.add(backLight);

mtlLoader = new THREE.MTLLoader();
// mtlLoader.setTexturePath('/statics/3d');
mtlLoader.load('/statics/3d/Material.mtl', function (materials) {

    materials.preload();

    objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.load('/statics/3d/Render.obj', function (object) {

        scene.add(object);
        object.position.y -= 240;

    });

});

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
};

animate();