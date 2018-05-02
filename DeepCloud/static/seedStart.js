function loadClass() {
    document.getElementById("myDropdown").classList.toggle("show");
}


function gotoEditPage(message){
    
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function()
    {
        if(xhttp.readyState == 4 && xhttp.status == 200)
        {
            // we store the xhttp response in a variable and print it
            var data = xhttp.responseText;
            // console.log(data);
        }
    };

    var sendParameters = "?data0="+selectedClass.toString()+",data1="+singleSelectIndex.toString();
    // just add the url for the function, it should be in urls.py
    // the function itself is from appName\views.py
    xhttp.open("GET", "/loadModelByName/"+sendParameters,true);
    xhttp.send();

    message = selectedClass.toString();
    document.location.href = "/seedEdit/"+sendParameters;
}


function startMix(message){
	message = selection.toString();
    document.location.href = "/hybridEdit/?"+message;
}

function actLike(element){
    //console.log(element);
}

var selectedClass;
var singleSelectIndex;
function loadThumbnails(modelClass) {
    document.getElementById("myDropdown").classList.toggle("show");
    selectedClass = modelClass;
    var note = document.getElementById('guideText');
    var names = document.getElementById('names');
    note.style.display="none";
    names.style.display="none";
    var table = document.getElementById('thumbnailTable');

    while(table.rows.length>0){
        // console.log("deleting rows!");
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
            img.setAttribute("onclick", "registerSingleClick(this)");
            img.setAttribute("id", (rowSize*i+j).toString());
            var path =  "/static/img/thumbnails/"+modelClass+"/0"+(rowSize*i+j).toString()+".png";
            img.src = path;
            // console.log(path)
            x.appendChild(img);
        }
    }
}

function loadThumbnailsMultipleChoise(modelClass) {
    document.getElementById("myDropdown").classList.toggle("show");	
    selection.push(modelClass);
    var note = document.getElementById('guideText');
    var names = document.getElementById('names');
    note.style.display="none";
    names.style.display="none";
    var table = document.getElementById('thumbnailTable');

    while(table.rows.length>0){
        // console.log("deleting rows!");
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
            img.setAttribute("style","opacity: 0.5");
            img.setAttribute("onmouseover", "actLike(this)");
            ////////////////////////////////PEDRO WAS HERE//////////////////////////////////////////
            index = (rowSize*i+j).toString();
            //COL AND ROW ARE INVERTED...
            ////////////////////////////////////////////////////////////////////////////////////////
            img.setAttribute("onclick", "registerClick(this)");
            img.setAttribute("id", index);
            ////////////////////////////////PEDRO WAS HERE//////////////////////////////////////////
            var path =  "/static/img/thumbnails/"+modelClass+"/0"+index.toString()+".png";
            //COL AND ROW ARE INVERTED...
            ////////////////////////////////////////////////////////////////////////////////////////
            img.src = path;
            x.appendChild(img);
        }
    }
}

var selection = []

function registerSingleClick(element){
    singleSelectIndex = element.id;
    gotoEditPage();

}

function registerClick(element){
    // console.log("registerclick");
   
   if (selection.indexOf(element.id) >= 0){
        selection.pop(element.id);
        element.setAttribute("style", "opacity:.5");
    }
    else if (selection.length < 5) {
        selection.push(element.id);
        element.setAttribute("style", "opacity:1");
    }
    // else{
    //     startMix(selection);
    //     // window.alert("Maximum number of selected images is 4. Please, deselect one of the images before selecting a new one");
    // }
    if (selection.length == 4){
        startMix(selection);
    }
    // console.log(selection);
}

