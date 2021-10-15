"use strict";

//Allow opening standard link in system default browser
$('a[target=_blank]').on('click', function(){
  require('nw.gui').Shell.openExternal( this.href );
  return false;
});

// Global Level Variables
var userSettings = {};

var values = [];
let gc;
let g;
let s;
let gctex;
let gtex;
let zip;
var index=0;
let startindex;
let currentindex;
let endindex;
var savedFiles = 0;
var space=0;
var fps = 60;
var done = false;
let colorpicker;
let trailslider;
let trailLength=50;
let started=false;
let trailcolor;
let fname;
let pause =false;
let savingindex=0;
let stickindeces=[];
function preload(){
  gc = loadModel('js/gimbalcover.obj',false);
  g = loadModel('js/gimbal.obj',false);
  s = loadModel('js/stick.obj',false);
  gctex = loadImage('js/gimbalcovertex.png');
  gtex = loadImage('js/gimbaltex.png');
  colorpicker = createColorPicker('#ff6666');
  colorpicker.parent("#colorpickercell");
  trailslider = createSlider(0,100,50);
  trailslider.parent("#traillengthcell");
}
function setup(){

  //setFrameRate(20);
  colorMode(RGB);
  let cnv=createCanvas(720, 240,WEBGL);
  cnv.parent("#center");
  ortho();
  zip = new JSZip();
}
let starttime = 0;
function draw(){
  if(!started){
    document.getElementById("traillengthvalue").innerHTML=String(trailslider.value());
    document.getElementById("colorpickervalue").innerHTML=String(colorpicker.color());
  }else{


    if(!pause){
      smooth();
      clear();
    if(space == 0){
      var lengthus = values[startindex][values[startindex].length-1][1]-values[startindex][0][1];
      space = values[startindex].length/((lengthus/1000000.0)*fps);
      //console.log(space);
    }

    let traillength = (fps/30)*trailLength;

    translate(0,0,-100);
    //rotateY(PI/3);
    noStroke();
    directionalLight(255, 255, 255,0,0, 1);
    directionalLight(255, 255, 255,0,0, -1);
    rotateX(PI);
    push();
    translate(-240,0,0);


    scale(4+(2/3));
    texture(gctex);
    model(gc);

    stroke(255,0,0);
    fill(255);
    noFill();
    for(var i = 0; i< space*traillength;i+=fps/6){
      strokeWeight(scaleRangef(i,0,space*traillength,10,1));
      stroke(lerpColor(color(0,0,0),trailcolor,scaleRangef(i,0,space*traillength,1,0)));
      var trailindex=floor(constrain(index-i,0,values[startindex].length-1));
      let length = scaleRangef(i,0,space*traillength,40,20);
      let yaw = scaleRangef(values[startindex][floor(trailindex)][stickindeces[2]],-500,500,0.436,-0.436);
      let thro = scaleRangef(values[startindex][floor(trailindex)][stickindeces[3]],1000,2000,-0.436,0.436);
      if(abs(yaw)<0.05&&abs(thro)<0.05){
        point(sin(yaw)*length,sin(thro)*length,-(cos(thro)*cos(yaw))*length);
      }else{
        line(0,0,0,sin(yaw)*length,sin(thro)*length,-(cos(thro)*cos(yaw))*length);
      }
    }
    noStroke();
    noFill();
    rotateX(scaleRangef(values[startindex][floor(index)][stickindeces[3]],1000,2000,-0.436,0.436));
    texture(gtex);
    model(g);
    rotateY(scaleRangef(values[startindex][floor(index)][stickindeces[2]],-500,500,-0.436,0.436));
    model(s);
    pop();
    translate(240,0,0);
    scale(4+(2/3));
    texture(gctex);
    model(gc);
    stroke(255,0,0);
    fill(255);
    noFill();
    for(var i = 0; i< space*traillength;i+=fps/6){
      strokeWeight(scaleRangef(i,0,space*traillength,10,1));
      stroke(lerpColor(color(0,0,0),trailcolor,scaleRangef(i,0,space*traillength,1,0)));
      var trailindex=floor(constrain(index-i,0,values[startindex].length-1));
      let length = scaleRangef(i,0,space*traillength,40,20);
      let roll = scaleRangef(values[startindex][floor(trailindex)][stickindeces[0]],-500,500,-0.436,0.436);
      let pitch = scaleRangef(values[startindex][floor(trailindex)][stickindeces[1]],-500,500,-0.436,0.436);
      if(abs(roll)<0.05&&abs(pitch)<0.05){
        point(sin(roll)*length,sin(pitch)*length,-(cos(pitch)*cos(roll))*length);
      }else{
        line(0,0,0,sin(roll)*length,sin(pitch)*length,-(cos(pitch)*cos(roll))*length);
      }
    }
    noStroke();
    noFill();
    rotateX(scaleRangef(values[startindex][floor(index)][stickindeces[1]],-500,500,-0.436,0.436));
    texture(gtex);
    model(g);
    rotateY(-scaleRangef(values[startindex][floor(index)][stickindeces[0]],-500,500,-0.436,0.436));
    model(s);
      canvas.toBlob(blob=>{
        zip.file('log_'+savingindex+'.png',blob);
        savingindex++;
      },'image/png');
      index+=space;
    }
    if(index>=values[startindex].length){
      pause = true;
      savedFiles = 0;
      zip.forEach(function(relativePath, file){savedFiles++;});
      if(savedFiles>=floor(index/space)&&savingindex>0){

          document.getElementById("info").innerHTML = "Zipping LOG: "+ startindex+". This might take a while :(";
        zip.generateAsync({type:"blob"}).then(function(content) {
          saveAs(content, fname+"_"+startindex+".zip");
          pause = false;
          if(startindex>=endindex){
            started = false;
            done = true;
            location.reload();
          }else{
            startindex++;
            space=0;
            index=0;
            savingindex=0;
            document.getElementById("info").innerHTML = "Rendering LOG: "+ startindex;
          }
        });
        zip = new JSZip();
        savingindex=0;
      }

        }
      }
      /*if(done == true && started ==false){
      document.getElementById("info").innerHTML = "Zipping the files... This might take a while... :(";
      zip.generateAsync({type:"blob"}).then(function(content) {
      saveAs(content, fname+".zip");
    });
    done = false;
    savedFiles =0;
  }*/

}

function StartRender(){
  if(values.length>0){
    trailLength=trailslider.value();
    trailcolor = colorpicker.color();

    fps=int(document.getElementById("fpsinput").value);


    if(document.getElementById("lognumfrom").value==-1){
      startindex=0;
      endindex = values.length-1;
    }else{
      startindex=min(int(document.getElementById("lognumfrom").value),values.length-1);
      endindex = max(min(int(document.getElementById("lognumto").value),values.length-1),startindex);
    }
    if(isNaN(startindex) || isNaN(endindex) || isNaN(fps)){

      alert("Some values are missing!");
      return;
    }
    document.getElementsByClassName("btn")[0].style.display='none';
    document.getElementsByClassName("btn")[1].style.display='none';
    document.getElementsByClassName("btn")[2].style.display='none';
    console.log(startindex);
    console.log(endindex);
    document.getElementById("lognumfrom").value=startindex;
    document.getElementById("lognumto").value=endindex;
    document.getElementById("info").innerHTML = "Rendering LOG: "+ startindex;
    currentindex =startindex;
    started=true;
  }else{
    alert("No Log loaded!");
  }
}


function BlackboxLogViewer() {


  var

  flightLog, flightLogDataArray,

  currentOffsetCache = {log:null, index:null, video:null, offset:null}


  function selectLog(logIndex) {
    var success = false;

    try {
      if (logIndex === null) {
        for (var i = 0; i < flightLog.getLogCount(); i++) {
          if (flightLog.openLog(i)) {
            success = true;
            currentOffsetCache.index = i;

            var temp = flightLog.getChunksInIndexRange(0,10000000);

            values[i] = [];
            for(var j = 0; j < temp.length; j++){
              values[i] = values[i].concat(temp[j].frames);
            }
            //console.log(flightLog.parser.frameDefs.I.nameToIndex["rcCommand[0]"]);
            stickindeces = [flightLog.parser.frameDefs.I.nameToIndex["rcCommand[0]"],flightLog.parser.frameDefs.I.nameToIndex["rcCommand[1]"],flightLog.parser.frameDefs.I.nameToIndex["rcCommand[2]"],flightLog.parser.frameDefs.I.nameToIndex["rcCommand[3]"]];
            //console.log(stickindeces);
          }
        }
        if (!success) {
          throw "No logs in this file could be parsed successfully";
        }else{
          document.getElementById("info").innerHTML = values.length + " LOGS successfully loaded!";
        }
      } else {

        flightLog.openLog(logIndex);
        currentOffsetCache.index = logIndex;
      }
    } catch (e) {
      alert("Error opening log: " + e);
      currentOffsetCache.index = null;
      return;
    }


    if((flightLog.getSysConfig().looptime             != null) &&
    (flightLog.getSysConfig().frameIntervalPNum   != null) &&
    (flightLog.getSysConfig().frameIntervalPDenom != null) ) {
      userSettings.analyserSampleRate = 1000000 / (flightLog.getSysConfig().looptime * (validate(flightLog.getSysConfig().pid_process_denom,1)) * flightLog.getSysConfig().frameIntervalPDenom / flightLog.getSysConfig().frameIntervalPNum);
    }

    //graph = new FlightLogGrapher(flightLog, activeGraphConfig, canvas, craftCanvas, analyserCanvas, userSettings);

  }

  function loadLogFile(file) {
    fname = file.name;
    document.getElementById("info").innerHTML = "Loading LOG: "+file.name;
    var reader = new FileReader();

    reader.onload = function(e) {
      var bytes = e.target.result;

      var fileContents = String.fromCharCode.apply(null, new Uint8Array(bytes, 0,100));

      if(fileContents.match(/# dump|# diff/i)) { // this is actually a configuration file
        try{

          // Firstly, is this a configuration defaults file
          // (the filename contains the word 'default')

          if( (file.name).match(/default/i) ) {
            configurationDefaults.loadFile(file);
          } else {

            configuration = new Configuration(file, configurationDefaults, showConfigFile); // the configuration class will actually re-open the file as a text object.
            hasConfig = true;
            html.toggleClass("has-config", hasConfig);
          }

        } catch(e) {
          configuration = null;
          hasConfig = false;
        }
        return;
      }

      flightLogDataArray = new Uint8Array(bytes);

      try {
        flightLog = new FlightLog(flightLogDataArray);
      } catch (err) {
        alert("Sorry, an error occured while trying to open this log:\n\n" + err);
        return;
      }

      currentOffsetCache.log      = file.name; // store the name of the loaded log file
      currentOffsetCache.index    = null;      // and clear the index


      setTimeout(function(){$(window).resize();}, 500 ); // refresh the window size;

      selectLog(null);


    };

    reader.readAsArrayBuffer(file);
  }
  $(document).ready(function() {


    $(".file-open").change(function(e) {
      var
      files = e.target.files,
      i;

      for (i = 0; i < files.length; i++) {
        if (files[i].name.match(/\.(BBL|TXT|CFL|BFL|LOG)$/i)) {
          loadLogFile(files[i]);
        }
      }
    });
  });
}
function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
function scaleRangef(x, srcMin, srcMax, destMin, destMax) {
  let a = (destMax - destMin) * (x - srcMin);
  let b = srcMax - srcMin;
  return ((a / b) + destMin);
}
// Boostrap's data API is extremely slow when there are a lot of DOM elements churning, don't use it
$(document).off('.data-api');

window.blackboxLogViewer = new BlackboxLogViewer();
