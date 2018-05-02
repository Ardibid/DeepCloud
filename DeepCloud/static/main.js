////////////////////////////////////////////////////////////////////
// Init Functions
////////////////////////////////////////////////////////////////////

function init(){
    ////////////////////////////// 
    // Canvas Setup
    ////////////////////////////// 
    // setup GUI
    gui = new dat.GUI();
    moveRobot = gui.addFolder('sample list');

    // basic setup for the scene
    var scene = new THREE.Scene();

    // making geometries in the scene
    var plane = getPlane(60);
    plane.name = 'plane01';
    plane.position.y = -10;
    plane.rotation.x = -Math.PI/2;
    scene.add(plane);

    //add lighting
    var light0 = getPointLight(1.4);
    light0.position.y = 3;
    light0.position.x=-3;
    
    var light1 = getPointLight(1);
    light1.position.y = 1.6;
    light1.position.x= 3;

    scene.add(light0);
    scene.add(light1);

    //setup camera
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 1,1000);
    camera.position.x = 3;
    camera.position.y = 1.7;
    camera.position.z = 3;

    // adjusting the camera perspective AND RATIO
    var tanFOV = Math.tan( ( ( Math.PI / 180 ) * camera.fov / 2 ) );
    var windowHeight = window.innerHeight;
    var canvasWidth = window.innerWidth/1.5;
    var canvasHeight = window.innerHeight;
    camera.aspect = canvasWidth/canvasHeight;

    // adjust the FOV
    camera.fov = ( 360 / Math.PI ) * Math.atan( tanFOV * (canvasWidth / canvasHeight ) );
    camera.updateProjectionMatrix();

    // getting rendering ready!
    var renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.shadowMap.enabled = true;
    renderer.setSize (canvasWidth, canvasHeight);
    renderer.setClearColor ('rgb(120,120,120)');
    document.getElementById("pointViewer").appendChild(renderer.domElement);
    // import geometries here
    // here!

    // add the camera control
    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.target = new THREE.Vector3(0, 1.4, 0);

    update(renderer, scene, camera, controls);
    //simpleFunction();
    return scene;
}


////////////////////////////////////////////////////////////////////
// GUI Functions
////////////////////////////////////////////////////////////////////
// something! 

////////////////////////////////////////////////////////////////////
// PointCloud functions
////////////////////////////////////////////////////////////////////
function readPointData(){
    // it communicates with python through XMLHttp
    // the next 5 lines are always the same
    var xhttp = new XMLHttpRequest();
    // this loop protects us from assynchronous errors
    xhttp.onreadystatechange = function()
    {
        if(xhttp.readyState == 4 && xhttp.status == 200)
        {
            // we store the xhttp response from python in a variable
            var data = xhttp.responseText;
            // console.log("from urls:",data)
        }
    }
    // just add the name of function from appName\views.py: loadPoints for example
    xhttp.open("GET", "/bareBone/",true);
    xhttp.send();
}


////////////////////////////////////////////////////////////////////
// Template functions
////////////////////////////////////////////////////////////////////
// bare bon
function bareBone(){
    // console.log("WORKING");
    // it communicates with python through XMLHttp
    // the next 5 lines are always the same
    var xhttp = new XMLHttpRequest();
    // this loop protects us from assynchronous errors
    xhttp.onreadystatechange = function()
    {
        var startTime, endTime;
        if(xhttp.readyState == 4 && xhttp.status == 200)
        {
            // we store the xhttp response from python in a variable
            var data = xhttp.responseText;
            // now we should process it from a json string
            // data is seperated first by ; and then by ,
            startTime = new Date();
            var pointClouds = []
            //[allPointClouds --> eachPointCloud --> eachPoint --> x,y,z]
            var allPointClouds = data.split("|");

            for (var i = 0 ; i < allPointClouds.length ; i ++){
                var eachPointCloud = allPointClouds[i].split(";");
                var pointCloud = []

                for (var j = 0 ; j < eachPointCloud.length ; j ++){
                    var eachPoint = eachPointCloud[i].split(",");

                    var cord = eachPointCloud[i];
                    var pt = [parseFloat(cord[0]),parseFloat(cord[1]),parseFloat(cord[2])];
                    pointCloud.push(pt);
                }
                pointClouds.push(pointCloud);

            }
            endTime = new Date();
            var timeDiff = endTime - startTime; 
            // console.log(timeDiff + " ms");
            // console.log()
        }
    }
    // just add the name of function from appName\views.py: loadPoints for example
    xhttp.open("GET", "/bareBone/",true);
    xhttp.send();
}

function initGenerator(){
    // console.log("initGenerator");
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function()
    {
        var startTime, endTime;
        startTime = new Date();
        if(xhttp.readyState == 4 && xhttp.status == 200)
        {
            var data = xhttp.responseText;
            // console.log(data)
            endTime = new Date();
            var timeDiff = endTime - startTime; 
            // console.log(timeDiff + " ms");
        }

        
    }
    // just add the name of function from appName\views.py: loadPoints for example
    xhttp.open("GET", "/bareBone/",true);
    xhttp.send();
}

function quickPt(){
    //console.log("quickly generating a point");
    // it communicates with python through XMLHttp
    // the next 5 lines are always the same
    for (var u = 0; u < 100 ; u ++){
        var startTime, endTime;
        var xhttp = new XMLHttpRequest();
        // this loop protects us from assynchronous errors
        xhttp.onreadystatechange = function()
        {
            if(xhttp.readyState == 4 && xhttp.status == 200)
            {
                // we store the xhttp response from python in a variable
                var data = xhttp.responseText;
                // now we should process it from a json string
                // data is seperated first by ; and then by ,
                startTime = new Date();
                var pointClouds = []
                //[allPointClouds --> eachPointCloud --> eachPoint --> x,y,z]
                var allPointClouds = data.split("|");

                for (var i = 0 ; i < allPointClouds.length ; i ++){
                    var eachPointCloud = allPointClouds[i].split(";");
                    var pointCloud = []

                    for (var j = 0 ; j < eachPointCloud.length ; j ++){
                        var eachPoint = eachPointCloud[i].split(",");

                        var cord = eachPointCloud[i];
                        var pt = [parseFloat(cord[0]),parseFloat(cord[1]),parseFloat(cord[2])];
                        pointCloud.push(pt);
                    }
                    pointClouds.push(pointCloud);

                }
                endTime = new Date();
                var timeDiff = endTime - startTime; 
                console.log(timeDiff + " ms");
                console.log()
            }
        }
        // just add the name of function from appName\views.py: loadPoints for example
        xhttp.open("GET", "/quickPt/",true);
        xhttp.send();
    }
}
// template function to recieve data from python function
function templateFunctionReceive(){
    // it communicates with python through XMLHttp
    // the next 5 lines are always the same
    var xhttp = new XMLHttpRequest();
    // this loop protects us from assynchronous errors
    xhttp.onreadystatechange = function()
    {
        if(xhttp.readyState == 4 && xhttp.status == 200)
        {
            // we store the xhttp response from python in a variable
            var data = xhttp.responseText;
            // now we should process it from a json string
            // data is seperated first by ; and then by ,
            var rawData = data.split(";");
            var data = rawData[0];
            var dataAsList = data.split(",")
            // data is string, not a number
            // now we convert data to float
            dataZero = parseFloat(dataAsList[0]);
            dataOne  = parseFloat(dataAsList[1]);
            dataTwo  = parseFloat(dataAsList[2]);
            data = [dataZero, dataOne, dataTwo];
            // send a message on console
            console.log("from urls:",data)
        }
    }
    // just add the name of function from appName\views.py: loadPoints for example
    xhttp.open("GET", "/templatePyFunctionSend/",true);
    xhttp.send();
}

// template function to send data to python function
function templateFunctionSend() 
    {
        var dataZero = 0;
        var dataOne = 1;
        var dataTwo = 2;

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function()
        {
            if(xhttp.readyState == 4 && xhttp.status == 200)
            {
                // we store the xhttp response in a variable and print it
                var data = xhttp.responseText;
                console.log(data);
            }
        };
        var sendParameters = "?data0="+dataZero.toString()+"&data1="+dataOne.toString()+"&data2="+dataTwo.toString();
        // just add the url for the function, it should be in urls.py
        // the function itself is from appName\views.py
        xhttp.open("GET", "/templatePyFunctionReceive/"+sendParameters,true);
        xhttp.send();
    }

////////////////////////////////////////////////////////////////////
// Geometries Constructors
////////////////////////////////////////////////////////////////////

function getPlane (w) {
    var geometry = new THREE.PlaneGeometry(w,w);
    // var material = new THREE.MeshBasicMaterial({
    //     color : 0x222222
    // });
    var material = new THREE.MeshPhongMaterial({
        color: 'rgb(25,25,25)'
        }
    )
    var mesh = new THREE.Mesh(
        geometry,
        material
    );
    mesh.receiveShadow = true;
    return mesh;}

function getPointLight(intensity){
    var light = new THREE.PointLight(0xFFFFFF, intensity);
    light.castShadows = true;
    return light;}


////////////////////////////////////////////////////////////////////
// Scene/animation Functions
////////////////////////////////////////////////////////////////////

// now we can see scene properties in the console
var scene = init();

function animateItNow(){
    console.log("ANIMATE IT!")
    animateIt = !animateIt;
}

function update(renderer, scene, camera,controls)
{
    renderer.render(
        scene,
        camera
    );

    controls.update();

    requestAnimationFrame(function (){
        update(renderer,scene,camera, controls);
    } );
}


