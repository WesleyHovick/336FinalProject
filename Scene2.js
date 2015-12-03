var camera, scene, renderer;
var sphere;
var wallMaterial;
var light1, light2;
var ground, ceiling;
var backWall, leftWall, rightWall, frontWall;

var controls;

var directionY = .3;
var directionX = .3;
var directionZ = .3;

var spheres = [];

var control = 'c';

function getChar(event) {
    if(event.which == null) {
        return String.fromCharCode(event.keyCode)
    }
    else if(event.which != 0 && event.charCode != 0) {
        return String.fromCharCode(event.which)
    }
    else {
        return null
    }
}

function handleKeyPress(event)
{
    var ch = getChar(event);

    if(control == 'c')
    {
        do_control(camera, ch);
        return;
    }
    else if(control == 'o')
    {
        do_control(leftWall, ch);
        return;
    }
}


function do_control(c, ch) {
    var q, q2;

    switch(ch)
    {
        case 'p':
            if(control == 'c')
                control = 'o';
            else
                control = 'c';
            break;
        case 'w':
            c.translateZ(-5);
            break;
        case 's':
            c.translateZ(5);
            break;
        case 'a':
            c.translateX(-5);
            break;
        case 'd':
            c.translateX(5);
            break;
        case 'i':
            c.rotateX(.1);
            break;
        case 'k':
            c.rotateX(-.1);
            break;
        case 'j':
            q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 5 * Math.PI / 180);
            q2 = new THREE.Quaternion().copy(c.quaternion);
            c.quaternion.copy(q).multiply(q2);
            return true;
            break;
        case 'l':
            q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -5 * Math.PI / 180);
            q2 = new THREE.Quaternion().copy(c.quaternion);
            c.quaternion.copy(q).multiply(q2);
            return true;
            break;
    }
}

function init()
{
    initScene();
    initMisc();

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.85;
    controls.enableZoom = true;
    controls.target.set(0, 8, 0);

    document.body.appendChild(renderer.domElement);

    render();
}

function initScene() {
    window.onkeypress = handleKeyPress;

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.set( 0, 10, 40 );

    scene = new THREE.Scene();
    scene.add( new THREE.AmbientLight( 0x222233 ) );

    function createLight( color ) {

        var pointLight = new THREE.PointLight( color, 1, 30 );
        pointLight.castShadow = true;
        pointLight.shadowCameraNear = 1;
        pointLight.shadowCameraFar = 30;
        // pointLight.shadowCameraVisible = true;
        pointLight.shadowMapWidth = 2048;
        pointLight.shadowMapHeight = 1024;
        pointLight.shadowBias = 0.01;
        pointLight.shadowDarkness = 0.5;

        var geometry = new THREE.SphereGeometry( 0.3, 32, 32 );
        var material = new THREE.MeshBasicMaterial( { color: color } );
        var sphere1 = new THREE.Mesh( geometry, material );
        pointLight.add( sphere1 );

        return pointLight

    }

    //light1 = createLight( 0xffffff );
    //light1.position.y = 8;
    //sphere.position.z = 7;
    //scene.add( light1 );

    light2 = createLight( 0xff0000 );
    light2.position.y = 2;
    scene.add( light2 );

    wallMaterial = new THREE.MeshPhongMaterial( {
        color: 0xffffff,
        shininess: 10,
        specular: 0x111111,
        shading: THREE.SmoothShading
    } );

    var torusGeometry =  new THREE.TorusKnotGeometry( 10, .3, 150, 200 );
    torusKnot = new THREE.Mesh( torusGeometry, new THREE.MeshPhongMaterial({
            color: 0x00ff00
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

    //sphere = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 32), wallMaterial);
    //sphere.position.y = 5;
    //sphere.castShadow = true;
    //sphere.receiveShadow = true;
    //scene.add(sphere);

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

    //light1.position.x = Math.sin( time ) * 9;
    //light1.position.y = Math.sin( time * 1.1 ) * 9 + 5;
    //light1.position.z = Math.sin( time * 1.2 ) * 9;

    light2.position.x = -Math.sin( time ) * 9;
    light2.position.y = -Math.sin( time * 1.1 ) * 9 + 5;
    light2.position.z = -Math.sin( time * 1.2 ) * 9;

    time += 10000;

    //torusKnot.rotation.y = time * 0.1;
    //torusKnot.rotation.z = time * 0.1;

    for(var j = 0; j < spheres.length; j++)
    {

        spheres[j].translateY(spheres[j].directionY);
        //spheres[j].translateX(spheres[j].directionX);
        //spheres[j].translateZ(spheres[j].directionZ);

        if(spheres[j].position.y + .375 >= ceiling.position.y || spheres[j].position.y - .375 <= ground.position.y )
        {
            spheres[j].directionY *= -1;
        }

        //if(spheres[j].position.x + .375 >= rightWall.position.x || spheres[j].position.x - .375 <= leftWall.position.x)
        //{
        //    spheres[j].directionX *= -1;
        //}

        //if(spheres[j].position.z + .375 >= 10 || spheres[j].position.z - .375 <= backWall.position.z)
        //{
        //    spheres[j].directionZ *= -1;
        //}

    }
}