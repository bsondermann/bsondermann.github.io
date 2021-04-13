function convert(){
	var str = document.getElementById("text1").value;
	var converted = document.getElementById("name").value+": d=1,o=1,b="+document.getElementById("bpm").value+": ";
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
	document.getElementById("converted").innerHTML = converted;
}