function nearestPowerOf2(n) {
  return 1 << 31 - Math.clz32(n);
}
function convert(){
	var str = document.getElementById("text1").value.replace(/\s{2,}/g, ' ');;
	var name = document.getElementById("name").value;
	var bpm = Math.round(480*(8.0/parseFloat(document.getElementById("length").value)));
	var interval = Math.round(document.getElementById("interval").value);
	if(str == ""||name==""||bpm==""){return;}
	if(bpm<1){document.getElementById("converted").innerHTML="ERROR: BPM HAS TO BE GREATER THAN 0"; return;}
	if(/[h-z]/.test(str)){document.getElementById("converted").innerHTML="ERROR: INVALID INPUT"; return;}
	var converted = name+": d=2,o=2,b="+bpm+": ";
	var splited = str.split(" ");
	for(var i = 0; i<splited.length; i++){
		splited[i] = splited[i].replace("1/","");
	}
	for(var i = 0; i<splited.length; i++){
		var note = splited[i].substring(0,1);
		var octave="";
		var length = "";
		if(splited[i].substring(1,2)=="#"){note+="#";}
		if(note != "P"){
			if(note.length==1){
				octave = splited[i].substring(1,2);
			}else{
				octave = splited[i].substring(2,3);
			}
			i++;
			length=splited[i];
		}else{
			length=splited[i].substring(1,splited[i].length);
			
		}
		converted += length+note.toLowerCase()+octave+", ";
		if(interval!=0){
			var pause = nearestPowerOf2((32.0/interval)*length)*2;
			converted+=Math.min(pause,64)+"p, ";
		}
	}
	converted = converted.substring(0,converted.length-2);
	if (converted.search("undefined")!=-1){
		document.getElementById("converted").innerHTML="ERROR: INVALID INPUT"; return;
	}
	document.getElementById("converted").innerHTML = converted;
}
