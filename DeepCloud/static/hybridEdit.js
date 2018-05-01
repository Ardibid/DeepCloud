function loadThumbnails(modelClass) {
    console.log("HybridEdit")
    var note = document.getElementById('guideText');
    var names = document.getElementById('names');
    note.style.display="none";
    names.style.display="none";
    var table = document.getElementById('thumbnailTable');

    while(table.rows.length>0){
        console.log("deleting rows!");
        table.deleteRow(-1);
    }

    var rowSize = 8;
    var colSize = 3;
    for (var i = 0 ; i < colSize ; i ++) {
        var thisRow = table.insertRow(0);
        for (var j = 0 ; j < rowSize ; j ++) {
            var x = thisRow.insertCell(-1);
            var img = document.createElement('img');
            img.setAttribute("class", "thumbnail");
            img.setAttribute("style","width= 100px");
            img.setAttribute("onmouseover", "actLike(this)");
            img.setAttribute("onclick", "gotoEditPage()");
            img.setAttribute("id", (rowSize*i+j).toString());
            var path =  "/static/img/thumbnails/"+modelClass+"/0"+(rowSize*i+j).toString()+".png";
            img.src = path;
            x.appendChild(img);
        }
    }
}


function loadFeatureSliders2(modelClass){
    //modelClass = "chair";
    var req = new XMLHttpRequest();
    req.open('GET', document.location, false);
    req.send(null);
    modelClass = req.responseURL.split('=')[1]
    console.log(req.responseURL, modelClass);
    modelClass= modelClass.split(',')[0]
    itemSelected  = req.responseURL.split('=')[2]
    
    console.log(modelClass, itemSelected)
    var table = document.getElementById('featureSliders');
    var colNum = 4;
    for (var i = 0 ; i < colNum ; i ++) {
        var thisRow = table.insertRow(-1);
        thisRow.setAttribute("width","150px");
        for (var j = 0 ; j < 2 ; j ++) 
        {
            var x = thisRow.insertCell(-1);
            var img = document.createElement('img');
            img.setAttribute("class","gif");
            var path =  "/static/img/gifs/"+modelClass+"/0"+(i*2+j).toString()+".gif";
            img.src = path;
            var gifID = "GIF"+(i*2+j).toString();
            img.setAttribute('id',gifID);
            x.appendChild(img);
        }

        // var thisRow = table.insertRow(-1);
        // thisRow.setAttribute("width","150px");
        // thisRow.setAttribute("height","15px");

        // for (var k = 0 ; k < 2 ; k ++) 
        // {
        // var x = thisRow.insertCell(-1);
        // thisRow.setAttribute("width","150px");
        // var knob = document.createElement('input');
        // knob.setAttribute('type','range');
        // knob.setAttribute('min','-64');
        // knob.setAttribute('max','64');
        // knob.setAttribute('value','0');
        // knob.setAttribute('class','knob');
        // var knobID = "UIknob"+(i*2+k).toString();
        // knob.setAttribute('id',knobID);
        // x.appendChild(knob);
        // knob.addEventListener('input', sendHybridData);
        // }

        var thisRow = table.insertRow(-1);
        
        thisRow.setAttribute("width","150px");

        for (var k = 0 ; k < 2 ; k ++) 
        {
        var x = thisRow.insertCell(-1);
        var slider = document.createElement('input');
        slider.setAttribute('type','range');
        slider.setAttribute('min','-64');
        slider.setAttribute('max','64');
        slider.setAttribute('value','0');
        slider.setAttribute('class','slider');
        var sliderID = "UIslider"+(i*2+k).toString();
        slider.setAttribute('id',sliderID);
        x.appendChild(slider);
        slider.addEventListener('input', sendHybridData);
        }

    }
}

//PEDRO//WAS//HERE//////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function sendHybridData(){
    console.log("sendHybridData");

    // var req = new XMLHttpRequest();
    // req.open('GET', document.location, false);
    // req.send(null);
    // dataUrl = req.responseURL.split('?')[1]
    // selection = dataUrl.split(',')
    // console.log(selection);

    all = [(data.length -1).toString()];
    for (var i = 0 ; i < data.length; i ++){
        all.push(data[i].toString());
    }
    for (var i = 0 ; i < data.length -1 ; i ++){
        var sliderVal = 0.5+$('#UIslider'+i.toString()).val()/128;
        //think about multiplication
        all.push(parseFloat(sliderVal).toString());
    }
    message = "Hybrid message: {" + all.toString() + "}";
    $("#dataSent").text(message);
    sendWeights(all);
}

function sendWeights(msg) 
    {       
        var particleSystem = scene.getObjectByName('particleSystem');
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function()
        {
            if(xhttp.readyState == 4 && xhttp.status == 200)
            {
                // we store the xhttp response from python in a variable
                var data = xhttp.responseText;
                var pointClouds = []
                //[allPointClouds --> eachPointCloud --> eachPoint --> x,y,z]
                var allPointClouds = data.split("|");

                for (var i = 0 ; i < allPointClouds.length ; i ++){
                    var eachPointCloud = allPointClouds[i].split(";");
                    var pointCloud = []

                    for (var j = 0 ; j < eachPointCloud.length ; j ++){
                        //console.log(j);
                        var eachPoint = eachPointCloud[j].split(",");
                        //var cord = eachPointCloud[i]; THIS WAS A BUG
                        //var pt = [parseFloat(eachPoint[0]),parseFloat(eachPoint[1]),parseFloat(eachPoint[2])];
                        //pointCloud.push(pt);

                        // //method 2
                        var sizeFactor = 25;
                        particleSystem.geometry.vertices[j].x = sizeFactor*parseFloat(eachPoint[0]);
                        particleSystem.geometry.vertices[j].z = -sizeFactor*parseFloat(eachPoint[1]);
                        particleSystem.geometry.vertices[j].y = sizeFactor*parseFloat(eachPoint[2]);
                        //console.log("loading x", parseFloat(eachPoint[0]));
                        // }
                    }
                    //pointClouds.push(pointCloud);
                }
                
                particleSystem.geometry.verticesNeedUpdate = true;
                //updatePC(pointClouds);
            }
        }
        sendParameters = "?data0="+(msg[0]).toString();
        //?data0=3&data1=chair&data2=2...
        for (var i = 1 ; i <msg.length; i ++){
            sendParameters = sendParameters + "&data"+(i).toString()+"="+ msg[i].toString();
        }
        console.log(sendParameters);
        console.log(0);
        console.log("/hybrid2PC/"+sendParameters);
        xhttp.open("GET", "/hybrid2PC/"+sendParameters,true);
        xhttp.send();
    }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function initCanvas(){
    console.log("init canvas");
    //var container = document.getElementById('canvas');
    //document.body.appendChild( container );
    ////////////////////////////// 
    // Canvas Setup
    ////////////////////////////// 
    // setup GUI
    bgColor = 0x000000;
    particleColor = 0x888888


    // basic setup for the scene
    var scene = new THREE.Scene();
    scene.background = new THREE.Color( bgColor );


    //PEDRO//WAS//HERE//////////////////////////////////////////////////////////////////
    //add particle system
    //
    var particleGeo = new THREE.Geometry();
    var particleMat = new THREE.PointsMaterial({
        color: particleColor,
        size: 5,
        blending: THREE.AdditiveBlending,
        map: new THREE.TextureLoader().load('/static/img/particle.jpg'),
        transparent: true,
        sizeAttenuation: false,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    
    var particleCount = 2048
    ;
    var particleDistance = 100;

    for (var i=0; i<particleCount; i++) {
        var particle = new THREE.Vector3(0, 0, 0);
        particleGeo.vertices.push(particle);
    }

    var particleSystem = new THREE.Points(
        particleGeo,
        particleMat
    );
    particleSystem.name = 'particleSystem';
    scene.add(particleSystem);

    //setup camera
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 1,1000);
    var position = 10;
    camera.position.x = position;
    camera.position.y = position;
    camera.position.z = position;

    // adjusting the camera perspective AND RATIO
    var tanFOV = Math.tan( ( ( Math.PI / 180 ) * camera.fov / 2 ) );
    var windowHeight = window.innerHeight ;

    var table = document.getElementById("canvas")

    // var canvasWidth = table.offsetWidth/2; // window.innerWidth * 0.8 ;
    // var canvasHeight = table.offsetHeigth/2; //window.innerHeight * 0.7;
    var canvasWidth =  window.innerWidth * 0.85 ;
    var canvasHeight = window.innerHeight * 0.6;
    camera.aspect = canvasWidth/canvasHeight;

    // adjust the FOV
    camera.fov = ( 360 / Math.PI ) * Math.atan( tanFOV * (canvasWidth / canvasHeight ) );
    camera.updateProjectionMatrix();

    // getting rendering ready!
    var renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.shadowMap.enabled = true;
    renderer.setSize (canvasWidth, canvasHeight);
    renderer.setClearColor ('rgb(120,120,120)');
    document.getElementById("canvas").appendChild(renderer.domElement);
    // import geometries here
    // here!

    // add the camera control
    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.target = new THREE.Vector3(0, 1.4, 0);

    update(renderer, scene, camera, controls);
    //simpleFunction();
    return [scene,camera];
}


// function rotateCamera(){
//     cameraAangle = $('#UIknob10').val();
//     console.log(cameraAangle);
//     camera.rotation.y=cameraAangle;
//     camera.position.set(20*Math.sin(cameraAangle),20,20*Math.cos(cameraAangle));
// }


function update(renderer, scene, camera,controls)
{

    renderer.render(
        scene,
        camera
    );

    controls.update();

//PEDRO//WAS//HERE//////////////////////////////////////////////////////////////////
    var particleSystem = scene.getObjectByName('particleSystem');
    particleSystem.geometry.verticesNeedUpdate = true;
//PEDRO//WAS//HERE//////////////////////////////////////////////////////////////////

    requestAnimationFrame(function (){
        update(renderer,scene,camera, controls);
    } );
}

////////////////////////////////////////////////////////////////////
// PointCloud functions
////////////////////////////////////////////////////////////////////

function fastLoadPC(){
    var startTime = new Date();
    for (var i=0; i < 2 ; i ++){
        loadPC();
    }

}

function loadPC(){
    //console.log("loading one PC");
    // it communicates with python through XMLHttp
    // the next 5 lines are always the same
    var particleSystem = scene.getObjectByName('particleSystem');
    var xhttp = new XMLHttpRequest();
    // this loop protects us from assynchronous errors
    xhttp.onreadystatechange = function()
    {
        if(xhttp.readyState == 4 && xhttp.status == 200)
        {
            // we store the xhttp response from python in a variable
            var data = xhttp.responseText;
            var pointClouds = []
            //[allPointClouds --> eachPointCloud --> eachPoint --> x,y,z]
            var allPointClouds = data.split("|");

            for (var i = 0 ; i < allPointClouds.length ; i ++){
                var eachPointCloud = allPointClouds[i].split(";");
                var pointCloud = []

                for (var j = 0 ; j < eachPointCloud.length ; j ++){
                    //console.log(j);
                    var eachPoint = eachPointCloud[j].split(",");
                    //var cord = eachPointCloud[i]; THIS WAS A BUG
                    //var pt = [parseFloat(eachPoint[0]),parseFloat(eachPoint[1]),parseFloat(eachPoint[2])];
                    //pointCloud.push(pt);

                    // //method 2
                    particleSystem.geometry.vertices[j].x = parseFloat(eachPoint[0]);
                    particleSystem.geometry.vertices[j].y = parseFloat(eachPoint[1]);
                    particleSystem.geometry.vertices[j].z = parseFloat(eachPoint[2]);
                    //console.log("loading x", parseFloat(eachPoint[0]));
                    // }
                }
                //pointClouds.push(pointCloud);
            }
            
            particleSystem.geometry.verticesNeedUpdate = true;
            //updatePC(pointClouds);
        }
    }
    // just add the name of function from appName\views.py: loadPoints for example
    xhttp.open("GET", "/randomPC/",true);
    xhttp.send();
}

function loadPCs(){
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
            var pointClouds = []
            var allPointClouds = data.split("|");
            var tempPCs = [];
            for (var i = 0 ; i < allPointClouds.length ; i ++){
                var tempPC = []
                var eachPointCloud = allPointClouds[i].split(";");
                for (var j = 0 ; j < eachPointCloud.length ; j ++){
                    var eachPoint = eachPointCloud[j].split(",");
                    tempPC.push(new THREE.Vector3(eachPoint[0]),parseFloat(eachPoint[1]),parseFloat(eachPoint[2]));
                }
                tempPCs.push(tempPC);
            }
            animatePC(tempPCs);
        }

    }
    // just add the name of function from appName\views.py: loadPoints for example
    xhttp.open("GET", "/randomPC/",true);
    xhttp.send();
}

function loadFeatureSliders(){
    console.log("loadFeatureSliders");

    // modelClass ="chair";
    var table = document.getElementById('featureSliders');
    var colNum = data.length-1;
    for (var i = 0 ; i < colNum ; i ++) {
        var thisRow = table.insertRow(-1);
        thisRow.setAttribute("width","150px");

        var x = thisRow.insertCell(-1);
        var img = document.createElement('img');
        img.setAttribute("class","thumbnail");
        img.setAttribute("style","width:150px; opacity:1");

        var path =  "/static/img/thumbnails/"+modelClass+"/0"+data[i+1]+".png";
        console.log(path);
        img.src = path;
        var gifID = "GIF"+(i).toString();
        img.setAttribute('id',gifID);
        x.appendChild(img);
        


        var thisRow = table.insertRow(-1);
        thisRow.setAttribute("width","150px");


        var x = thisRow.insertCell(-1);
        var slider = document.createElement('input');
        slider.setAttribute('type','range');
        slider.setAttribute('min','-64');
        slider.setAttribute('max','64');
        slider.setAttribute('value','0');
        slider.setAttribute('class','slider');
        var sliderID = "UIslider"+(i).toString();
        slider.setAttribute('id',sliderID);
        slider.addEventListener('input', sendHybridData);
        x.appendChild(slider);
    }

}


function animatePC(tempPCs){
    var particleSystem = scene.getObjectByName('particleSystem');
    var i = 0;
    var id = setInterval(frame, 50 / tempPCs.length);

    function frame(){
        if (i < tempPCs.length){
            particleSystem.geometry.vertices = tempPCs[i];
            particleSystem.geometry.verticesNeedUpdate = true;
            i++;
        }
        else{
            clearInterval(id);
        }
    }
}

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
            console.log("from urls:",data)
        }
    }
    // just add the name of function from appName\views.py: loadPoints for example
    xhttp.open("GET", "/bareBone/",true);
    xhttp.send();
}



setTimeout(function(){
        img = document.getElementById("guideImage0")
        img.style.top = "200%";
        img.style.opacity = "0";
         },demoTime); 

setTimeout(function(){
        img = document.getElementById("guideImage1")
        img.style.bottom = "-70%";
        img.style.opacity = "1";

         },longDemoTime);


setTimeout(function(){
        // fastLoadPC();
        all = [(data.length -1).toString()];
        for (var i = 0 ; i < data.length; i ++){
            all.push(data[i].toString());
        }
        for (var i = 0 ; i < data.length -1 ; i ++){
            var sliderVal = 0;
            //think about multiplication
            all.push(parseFloat(sliderVal).toString());
        }
        message = "Hybrid message: {" + all.toString() + "}";
        $("#dataSent").text(message);
        sendWeights(all);
         },loadingTime);


function loadModelbyID(){
    var params = {};
    var param_array = window.location.href.split('?')[1].split('&');
    
}

var refreshTime = 40
var lastTrigger = 0;
var rawData = window.location.search.substr(1);
var data = rawData.split(",");
var modelClass = data[0]
var demoTime = 2500;
var longDemoTime = demoTime*5;
var loadingTime = demoTime+500;
var camera;
console.log("0) initializing scene");
var scene;

[scene,camera] = initCanvas();
console.log("1) scene has a value");
console.log(scene.toString());