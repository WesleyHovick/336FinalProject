var camera, scene, renderer;
var sphere;
var wallMaterial;
var light1, light2;
var ground, ceiling;
var backWall, leftWall, rightWall, frontWall;

var directionY = .3;
var directionX = .3;
var directionZ = .3;

var spheres = [];

function init()
{
    initScene();
    initMisc();

    renderer.domElement.addEventListener('mousemove', onDocumentMouseMove, false);

    document.body.appendChild(renderer.domElement);

    render();
}

function onDocumentMouseMove( event )
{
    event.preventDefault();

    var currY = event.clientY - (window.innerHeight / 2);
    var currX = event.clientX - (window.innerWidth / 2);

    var newX = currX / 22;
    var newY = (-currY / 22) + 9.5;

    if(newY < ceiling.position.y - .45 && newY > ground.position.y + .45)
    {
        light.position.y = (-currY / 22) + 9.5;
    }

    if(newX > leftWall.position.x + .45 && newX < rightWall.position.x - .45)
    {
        light.position.x = currX / 22;
    }
}

function initScene() {

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 100 );
    camera.position.set( 0, 10, 45 );

    scene = new THREE.Scene();
    scene.add( new THREE.AmbientLight( 0x222233 ) );

    function createLight( color ) {

        var theLight = new THREE.PointLight( color, 1, 30 );
        theLight.castShadow = true;
        theLight.shadowCameraNear = 1;
        theLight.shadowCameraFar = 30;
        theLight.shadowMapWidth = 2048;
        theLight.shadowMapHeight = 1024;
        theLight.shadowBias = 0.01;
        theLight.shadowDarkness = 0.5;

        var geometry = new THREE.SphereGeometry( 0.3, 32, 32 );
        var material = new THREE.MeshBasicMaterial( { color: color } );
        var sphere1 = new THREE.Mesh( geometry, material );
        theLight.add( sphere1 );

        return theLight
    }

    light = createLight( 0xffffff );
    light.position.y = 2;
    scene.add( light );

    wallMaterial = new THREE.MeshPhongMaterial( {
        color: 0xffffff,
        shininess: 10,
        specular: 0x111111,
        shading: THREE.SmoothShading
    } );

    var torusGeometry =  new THREE.TorusKnotGeometry( 9, .8, 150, 200 );
    torusKnot = new THREE.Mesh( torusGeometry, new THREE.MeshPhongMaterial({
            color: 0xffff00
        }
    ) );
    torusKnot.position.set( 0, 9, 0 );
    torusKnot.castShadow = true;
    torusKnot.receiveShadow = true;
    scene.add( torusKnot );

    var wallGeometry = new THREE.BoxGeometry( 10, 0.15, 10 );

    ground = new THREE.Mesh( wallGeometry, wallMaterial );
    ground.position.set( 0, -5, 0 );
    ground.scale.multiplyScalar( 3 );
    ground.receiveShadow = true;
    scene.add( ground );

    ceiling = new THREE.Mesh( wallGeometry, wallMaterial );
    ceiling.position.set( 0, 24, 0 );
    ceiling.scale.multiplyScalar( 3 );
    ceiling.receiveShadow = true;
    scene.add( ceiling );

    leftWall = new THREE.Mesh( wallGeometry, wallMaterial );
    leftWall.position.set( -14, 10, 0 );
    leftWall.rotation.z = Math.PI / 2;
    leftWall.scale.multiplyScalar( 3 );
    leftWall.receiveShadow = true;
    scene.add( leftWall );

    rightWall = new THREE.Mesh( wallGeometry, wallMaterial );
    rightWall.position.set( 14, 10, 0 );
    rightWall.rotation.z = Math.PI / 2;
    rightWall.scale.multiplyScalar( 3 );
    rightWall.receiveShadow = true;
    scene.add( rightWall );

    backWall = new THREE.Mesh( wallGeometry, wallMaterial );
    backWall.position.set( 0, 10, -14 );
    backWall.rotation.y = Math.PI / 2;
    backWall.rotation.z = Math.PI / 2;
    backWall.scale.multiplyScalar( 3 );
    backWall.receiveShadow = true;
    scene.add( backWall );

    function createSphere(x, y, z)
    {
        var sphere = new THREE.Mesh(new THREE.SphereGeometry(.3, 16, 16), new THREE.MeshPhongMaterial({
            color: 0x0000ff
        }));
        sphere.position.x = x;
        sphere.position.y = y;
        sphere.position.z = z;
        sphere.castShadow = true;
        sphere.receiveShadow = true;

        return sphere;
    }

    for(var i = 0; i < 30; i++)
    {
        var sphere = createSphere(i % 10, i % 10, i % 10);

        var m = 1;
        if(i % 2 == 0)
        {
            m = -1;
        }
        else
        {
            m = 1;
        }

        sphere.directionY = directionY * m;
        sphere.directionX = directionX * m;
        sphere.directionZ = directionZ * m;

        spheres.push(sphere);

        scene.add(sphere);
    }
}

function initMisc() {
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( 0x000000 );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;

    THREEx.WindowResize(renderer, camera);
}

function render()
{
    requestAnimationFrame(render);
    animate();
    renderer.render(scene, camera);
}


function animate()
{
    var time = performance.now() * 0.001;
    time += 10000;

    torusKnot.rotation.y = time * 0.1;
    torusKnot.rotation.z = time * 0.1;

    for(var j = 0; j < spheres.length; j++)
    {
        spheres[j].translateY(spheres[j].directionY);
        spheres[j].translateX(spheres[j].directionX);
        spheres[j].translateZ(spheres[j].directionZ);

        if(spheres[j].position.y + .375 >= ceiling.position.y || spheres[j].position.y - .375 <= ground.position.y )
        {
            spheres[j].directionY *= -1;
        }

        if(spheres[j].position.x + .375 >= rightWall.position.x || spheres[j].position.x - .375 <= leftWall.position.x)
        {
            spheres[j].directionX *= -1;
        }

        if(spheres[j].position.z + .375 >= 10 || spheres[j].position.z - .375 <= backWall.position.z)
        {
            spheres[j].directionZ *= -1;
        }
    }
}