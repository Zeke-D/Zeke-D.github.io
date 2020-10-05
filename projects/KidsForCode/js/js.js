function code(s){
	return s.split("").reverse().join("");
}

function rot(s, z){
	x = "";
	for(var i in s.split("")){
		x += String.fromCharCode((s.charCodeAt(i)-97+z)+97);
	}
	return x;
}

function encrypt(s, i){
	return rot(code(s), i);
}

function decrypt(s, i){
	return code(rot(s, -i));
}

window.onload = function(){
	document.getElementById("mail").href = "mailto:"+decrypt("qsg2pmeqkDihsgvsjwhmo", 4)+"?subject=Contact%20Questions";
	document.getElementById("map").src = decrypt("mwrz893iqevj3qsg2vhpmyfteq33>txxl", 4);
}

$(function() {
  $('a[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
  });
});