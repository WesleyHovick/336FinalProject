var camera, scene, renderer;
var sphere;
var wallMaterial;
var light1, light2;
var ground, ceiling;
var backWall, leftWall, rightWall, frontWall;
var torusKnot;

var controls;

var directionY = .1;
var directionX = .1;
var directionZ = .1;

var spheres = [];

var controlsEnabled = false;

var material;
var start;

function init()
{
    start = Date.now();

    initScene();
    initMisc();

    controls = new PointerControls(light);

    document.body.appendChild(renderer.domElement);

    //Credit: http://threejs.org/examples/misc_controls_pointerlock.html
    //------------
    var blocker = document.getElementById( 'blocker' );
    var instructions = document.getElementById( 'instructions' );

    var havePointerLock = 'pointerLockElement' in document
                       || 'mozPointerLockElement' in document
                       || 'webkitPointerLockElement' in document;

    if ( havePointerLock ) {

        var element = document.body;

        var pointerlockchange = function ( event ) {

            if ( document.pointerLockElement === element ||
                 document.mozPointerLockElement === element ||
                 document.webkitPointerLockElement === element ) {

                controlsEnabled = true;
                controls.enabled = true;

                blocker.style.display = 'none';

            } else {

                controls.enabled = false;
                controlsEnabled = false;

                blocker.style.display = '-webkit-box';
                blocker.style.display = '-moz-box';
                blocker.style.display = 'box';

                instructions.style.display = '';
            }
        };

        var pointerlockerror = function ( event ) {

            instructions.style.display = '';

        };

        document.addEventListener( 'pointerlockchange', pointerlockchange, false );
        document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
        document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

        document.addEventListener( 'pointerlockerror', pointerlockerror, false );
        document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
        document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

        instructions.addEventListener( 'click', function ( event ) {

            instructions.style.display = 'none';

            element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

            if ( /Firefox/i.test( navigator.userAgent ) ) {

                var fullscreenchange = function ( event ) {

                    if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {

                        document.removeEventListener( 'fullscreenchange', fullscreenchange );
                        document.removeEventListener( 'mozfullscreenchange', fullscreenchange );

                        element.requestPointerLock();
                    }

                };

                document.addEventListener( 'fullscreenchange', fullscreenchange, false );
                document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );

                element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

                element.requestFullscreen();

            } else {

                element.requestPointerLock();

            }

        }, false );

    } else {

        instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
    }
    //----------------
    //End Credit

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

        //poisitioned at edges to look better right against walls
        var secondLight = new THREE.PointLight( color, 0.5, 30 );
        var thirdLight = new THREE.PointLight( color, 0.5, 30 );
        var fourthLight = new THREE.PointLight( color, 0.5, 30 );
        var fifthLight = new THREE.PointLight( color, 0.5, 30 );

        var geometry = new THREE.SphereGeometry( 0.3, 32, 32 );
        //var material = new THREE.MeshBasicMaterial( { color: color } );
        //var sphere1 = new THREE.Mesh( geometry, material );
        theLight.add( mesh );

        material = new THREE.ShaderMaterial({
            uniforms : {
                tExplosion: {
                    type: "t",
                    value: THREE.ImageUtils.loadTexture( 'explosiontexture.png' )
                },
                time: {
                    type: "f",
                    value: 0.0
                }
            },

            vertexShader : document.getElementById('vertexShader').textContent,
            fragmentShader : document.getElementById('fragmentShader').textContent
        });

        var mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(2, 6), material);

        //var material = new THREE.MeshBasicMaterial( { color: color } );
        //var sphere1 = new THREE.Mesh( geometry, material );
        secondLight.position.y = -2;
        thirdLight.position.x = 2;
        fourthLight.position.x = -2;
        fifthLight.position.y = 2;

        //theLight.add(secondLight);
        //theLight.add(thirdLight);
        //theLight.add(fourthLight);
        //theLight.add(fifthLight);
        theLight.add( mesh );

        return theLight
    }

    light = createLight( 0xffe1b3 );
    //light.position.y = 2;
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
    torusKnot.position.set( -1, 9, 0 );
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

    for(var i = 0; i < 15; i++)
    {
        var sphere = createSphere(Math.floor(Math.random() * 28) - 17,
                                  Math.floor(Math.random() * 29) - 7,
                                  i % 10);

        var m = i % 2 == 0 ? -1 : 1;

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
    material.uniforms[ 'time' ].value = .00015 * ( Date.now() - start );
    requestAnimationFrame(render);
    animate();
    renderer.render(scene, camera);
}

PointerControls = function (givenObject)
{
    var onMouseMove = function (event)
    {
        var movementX = event.movementX || event.mozMovementX || 0;
        var movementY = -event.movementY || -event.mozMovementY || 0;

        var value_dampener = 20;

        if(controlsEnabled)
        {
            var newY = givenObject.position.y + (movementY / value_dampener);
            var newX = givenObject.position.x + (movementX / value_dampener);

            if(newX > leftWall.position.x + 2 && newX < rightWall.position.x - 2)
            {
                givenObject.translateX(movementX / value_dampener);
            }

            if(newY < ceiling.position.y - 2 && newY > ground.position.y + 2)
            {
                givenObject.translateY(movementY / value_dampener);
            }
        }
    }

    document.addEventListener('mousemove', onMouseMove, false);
}

function animate()
{
    var time = performance.now() * 0.001;
    time += 10000;

    torusKnot.rotation.x = time * 0.1;

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