/**
 * Created by Wesley on 11/19/15.
 */

var camera, renderer, controls, container, scene;

var control = 'c';

var cube, light, sphere, plane;

var pointLight;

var topWall, botWall, leftWall, rightWall, backWall;

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
        do_control(light, ch);
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

var topWall;

function main()
{
    window.onkeypress = handleKeyPress;

    var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;

    var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 2000;

    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    camera.position.set(0, 75, 160);

    scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(0x222233));
    camera.lookAt(scene.position);
    camera.rotateX(.2);

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
        var sphere = new THREE.Mesh( geometry, material );
        pointLight.add( sphere );

        return pointLight

    }

    pointLight = createLight(0xffffff);
    scene.add(pointLight);




    if ( Detector.webgl )
        renderer = new THREE.WebGLRenderer( {antialias:true} );
    else
        renderer = new THREE.CanvasRenderer();

    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    renderer.setClearColor(0xf0f0f0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;

    container = document.getElementById('ThreeJS');
    container.appendChild(renderer.domElement);

    THREEx.WindowResize(renderer, camera);

    //var planeGeo = new THREE.PlaneGeometry(100.1, 100.1, 0);
    var planeGeo = new THREE.BoxGeometry(100.1, 0.1, 100.1);

    var wallMaterial = new THREE.MeshPhongMaterial({
        color: 0xa0adaf,
        shininess: 10,
        specular: 0x111111,
        shading: THREE.SmoothShading
    });

    //Walls
    //topWall = new THREE.Mesh(planeGeo, new THREE.MeshPhongMaterial({color: 0xaaaaaa}));
    topWall = new THREE.Mesh(planeGeo, wallMaterial);
    topWall.position.y = 100;
    topWall.rotateX(Math.PI / 2);
    topWall.receiveShadow = true;
    scene.add(topWall);

    //backWall = new THREE.Mesh(planeGeo, new THREE.MeshPhongMaterial({color: 0x00ff00}));
    backWall = new THREE.Mesh(planeGeo, wallMaterial);
    backWall.position.z = -50;
    backWall.position.y = 50;
    backWall.receiveShadow = true;
    scene.add(backWall);

    //leftWall = new THREE.Mesh(planeGeo, new THREE.MeshPhongMaterial({color: 0xff0000}));
    leftWall = new THREE.Mesh(planeGeo, wallMaterial);
    leftWall.position.x = -50;
    leftWall.position.y = 50;
    leftWall.receiveShadow = true;
    leftWall.rotateY(Math.PI / 2);
    scene.add(leftWall);

    //rightWall = new THREE.Mesh(planeGeo, new THREE.MeshPhongMaterial({color: 0xff0000}));
    rightWall = new THREE.Mesh(planeGeo, wallMaterial);
    rightWall.position.x = 50;
    rightWall.position.y = 50;
    rightWall.receiveShadow = true;
    rightWall.rotateY(-Math.PI / 2);
    scene.add(rightWall);

    //botWall = new THREE.Mesh(planeGeo, new THREE.MeshPhongMaterial({color: 0xaaaaaa}));
    botWall = new THREE.Mesh(planeGeo, wallMaterial);
    //botWall.position.y = -100;
    botWall.rotateX(-Math.PI / 2);
    botWall.receiveShadow = true;
    scene.add(botWall);


    //var geometry = new THREE.PlaneGeometry( 200, 200 );
    //geometry.rotateX( - Math.PI / 2 );

    var material = new THREE.MeshPhongMaterial( { color: 0xe0e0e0, overdraw: 0.5 } );

    //plane = new THREE.Mesh( geometry, material );
    //scene.add( plane );

    var geo = new THREE.SphereGeometry(2, 30, 30);


    material = new THREE.MeshPhongMaterial({color:0x01efb3});

    sphere = new THREE.Mesh(geo, material);
    sphere.castShadow = true;
    sphere.position.set(0, 5, 0);

    scene.add(sphere);

    var geometryL = new THREE.SphereGeometry( 0.3, 32, 32 );
    var materialL = new THREE.MeshBasicMaterial( { color: 0xffffff } );
    var sphereL = new THREE.Mesh( geometryL, materialL );
    //
    //
    var light2 = new THREE.PointLight(0xffffff, 1, 150);
    light2.castShadow = true;
    light2.shadowCameraNear = 1;
    light2.shadowCameraFar = 150;
    light2.shadowMapWidth = 2048;
    light2.shadowMapHeight = 1024;
    light2.shadoBias = 0.01;
    light2.shadowDarkness = 0.5;
    light2.position.y = 50;
    light2.add(sphereL);
    scene.add(light2);

    //light = new THREE.DirectionalLight(0xffffff, .3);
    //light.castShadow = true;
    //light.shadowCameraVisible = true;
    //light.position.set(0, 10, 0);
    //light.lookAt(sphere);




    //var light = new THREE.AmbientLight();
    //scene.add(light);

    render();
}

function render()
{
    requestAnimationFrame(render);
    animate();
    renderer.render(scene, camera);
}

var directionY = .5;
var directionX = .5;
var directionZ = .5;

//function collision(object1, object2)
//{
//    if(object1.position.y <= object2.position.y)
//    {
//        direction = direction * -1;
//    }
//    else if(object1.position.y <= 0)
//    {
//        direction = direction * -1;
//    }
//}


function animate()
{
    //top.position.y = 10;
    sphere.translateY(directionY);
    //light.translateY(directionY);
    sphere.translateX(directionX);
    //light.translateX(directionX);
    sphere.translateZ(directionZ);
    //light.translateZ(directionZ);

    if(sphere.position.y + 2 >= topWall.position.y || sphere.position.y <= 2)
    {
        directionY *= -1;
    }

    if(sphere.position.x + 2 >= rightWall.position.x || sphere.position.x - 2 <= leftWall.position.x)
    {
        directionX *= -1;
    }

    if(sphere.position.z + 2 >= 50 || sphere.position.z - 2 <= backWall.position.z)
    {
        directionZ *= -1;
    }



    //if(sphere.position.z + 2 >= 50 || sphere.position.z <= backWall.position.z)
    //{
    //    directionZ *= -1;
    //}
    //if(collision(sphere, cube))
    //{
    //    direction = -.1;
    //}
    //sphere.translateY(direction);
}