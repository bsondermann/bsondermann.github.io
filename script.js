function convert(){
	var str = document.getElementById("text1").value;
	var name = document.getElementById("name").value;
	var bpm = document.getElementById("bpm").value;
	if(str == ""||name==""||bpm==""){return;}
	if(bpm<1){document.getElementById("converted").innerHTML="ERROR: BPM HAS TO BE GREATER THAN 0"; return;}
	if(/[h-z]/.test(str)){document.getElementById("converted").innerHTML="ERROR: INVALID INPUT"; return;}
	var converted = name+": d=1,o=1,b="+bpm+": ";
	var splited = str.split(" ");
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
			length = splited[i].substring(1,2);
		}
		converted += length+note.toLowerCase()+octave+", "
	}
	converted = converted.substring(0,converted.length-2);
	if (converted.search("undefined")!=-1){
		document.getElementById("converted").innerHTML="ERROR: INVALID INPUT"; return;
	}
	document.getElementById("converted").innerHTML = converted;
}