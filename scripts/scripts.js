$(document).ready(function(){

	/* Show playground */
	$("#playground").show();

	/* Initialize HTML mixed mode */
	var mixedMode = {
        name: "htmlmixed",
        scriptTypes: [{matches: /\/x-handlebars-template|\/x-mustache/i,
                       mode: null},
                      {matches: /(text|application)\/(x-)?vb(a|script)/i,
                       mode: "vbscript"}]
    };

	/* Create Codemirror HTML object */
	var htmlbox = document.getElementById("html_box");
	var htmleditor = CodeMirror(function(elt) {
	  htmlbox.parentNode.replaceChild(elt, htmlbox);
	}, 
	{
		// value: htmlDecode(htmlbox.innerHTML),
		lineNumbers: true,
		mode:  mixedMode,
		theme: "material"
	});


	/* Create Codemirror JS object */
	var jsbox = document.getElementById("js_box");
	var jseditor = CodeMirror(function(elt) {
	  jsbox.parentNode.replaceChild(elt, jsbox);
	}, 
	{
		// value: jsbox.innerHTML,
		lineNumbers: true,
		mode:  "javascript",
		theme: "material"
	});


	/* Create Codemirror CSS object */
	var cssbox = document.getElementById("css_box");
	var csseditor = CodeMirror(function(elt) {
	  cssbox.parentNode.replaceChild(elt, cssbox);
	}, 
	{
		// value: cssbox.innerHTML,
		lineNumbers: true,
		mode:  "css",
		theme: "material"
	});


	/* Load file */
/*
	var req = new XMLHttpRequest();
	req.open("GET", "json/demo.txt", true);
	req.overrideMimeType("application/text");
	req.send(null);

	req.onreadystatechange = function(){
		if(req.status === 200 && req.readyState === 4){
			var result = req.response.split("```"); 

			for(i=0; i<result.length; i++){

				if(i === 0){
					result[i] = result[i].slice(0, -2);
				}
				else{
					result[i] = result[i].slice(2, -2);
				}
				console.log(i + " " + result[i]);
			}

			$("header h2").text(result[0]);
			setTimeout(function(){
				htmleditor.getDoc().setValue(result[1]);
				jseditor.getDoc().setValue(result[2]);
				csseditor.getDoc().setValue(result[3]);
				//execute(htmleditor, jseditor, csseditor);
			}, 500);

		}
	}
*/

	/* Setup the Environment */
	changeView(htmleditor, jseditor, csseditor);
	changeTheme($("#themes li:nth-child(2)"), htmleditor, jseditor, csseditor);
	refresh();
	
	/* Show Themes */
	$("#theme_button").on("click", function(){
		if($("#themes").is(":hidden")){
			$("#themes").show();			
		}else{
			$("#themes").hide();
		}
	});

	/* Change Theme */
	$("#themes li").on("click", function(){
		changeTheme(this, htmleditor, jseditor, csseditor);
		refresh();
	});

	/* Toggle View */
	$("#view_button").on("click", function(){
		changeView();
		refresh();
	});

	/* Execute Script */
	$("#run_button").on("click", function(){
		execute(htmleditor, jseditor, csseditor);
	});

	/* Handle Tabs Click */
	$("#tabs ul li").on("click", function(){
		switchtab(this);
		refresh();
	});

	function refresh(){
		htmleditor.refresh();
		jseditor.refresh();
		csseditor.refresh();
	}

	/* Load File */
	$('input[type=file]').on('change', function(){
		loadFile(htmleditor, jseditor, csseditor);
	});

	/* Save File */
	$("#file-download").on('click', function(){
		if($("#savefile").hasClass("show-save-dialog")){
			$("#savefile").removeClass("show-save-dialog");	
		}else{
			$("#savefile").addClass("show-save-dialog");	
		}
	});

	$("#save-button").on('click', function(){
		saveFile(htmleditor, jseditor, csseditor);
	});

	/* Clear red background on file name input box on input */
	$("#file-name").on('input', function(){
		$(this).removeClass("input-alert");	
	});
});


function loadFile(htmleditor, jseditor, csseditor){
	var file = document.getElementById("file-upload").files[0];
	if (file) {
	    var reader = new FileReader();
	    reader.readAsText(file, "UTF-8");
	    reader.onload = function (evt) {
		// console.log(evt.target.result);

		var result = evt.target.result.split("```"); 
			for(i=0; i<result.length; i++){

				if(i === 0){
					result[i] = result[i].slice(0, -1);
				}
				else{
					result[i] = result[i].slice(1, -1);
				}
				console.log(i + " " + result[i]);
			}

				$("header h2").text(result[0]);
				htmleditor.getDoc().setValue(result[1]);
				jseditor.getDoc().setValue(result[2]);
				csseditor.getDoc().setValue(result[3]);
				execute(htmleditor, jseditor, csseditor);
	    }
	    reader.onerror = function (evt) {
	        console.log("error reading file");
	    }
	}
}

function saveFile(htmleditor, jseditor, csseditor){
	if($("#file-name").val()){
			$("#savefile").removeClass("show-save-dialog");	

			var newfile = $("#file-name").val() + "\n```\n" + htmleditor.getValue() + "\n```\n" + jseditor.getValue() + "\n```\n" + csseditor.getValue() + "\n";
			var blob = new Blob([newfile], {type: "text/plain;charset=utf-8"});
			saveAs(blob, $("#file-name").val() + ".txt");
		}
		else{
			$("#file-name").addClass("input-alert");	
		}
}

function htmlDecode(input){
  var e = document.createElement('div');
  e.innerHTML = input;
  return e.childNodes[0].nodeValue;
}

function execute(htmleditor,jseditor,csseditor){
	myIframe = $('#result_box');
	myIframe.contents().find('html').html("<style>"+csseditor.getValue()+"</style>"+htmleditor.getValue());
	setTimeout(function(){
		document.getElementById('result_box').contentWindow.eval( jseditor.getValue() );
	}, 3000);
	
}

function changeView(){
	// Change to grid
	if($("#view_button i").hasClass("fa-th-large")){
		$(".CodeMirror").each(function(index, element){
			$(this).removeClass("view-two-pane").addClass("view-grid");
		});

		$(".CodeMirror:nth-child(3)").removeClass("two-pane-html").addClass("grid-html");
		$(".CodeMirror:nth-child(4)").removeClass("two-pane-js").addClass("grid-js");
		$(".CodeMirror:nth-child(5)").removeClass("two-pane-css").addClass("grid-css");
		$("#result_box").removeClass("two-pane-result-box").addClass("grid-result-box");
		$("#tabs").hide();

		$("#view_button i").removeClass("fa-th-large").addClass("fa-pause");

		// Show all windows
		$(".CodeMirror:nth-child(3), .CodeMirror:nth-child(4), .CodeMirror:nth-child(5)").show();
	}
	// Change to two pane
	else if($("#view_button i").hasClass("fa-pause")){
		$(".CodeMirror").each(function(){
			$(this).addClass("view-two-pane").removeClass("view-grid");
		});

		$(".CodeMirror:nth-child(3)").addClass("two-pane-html").removeClass("grid-html");
		$(".CodeMirror:nth-child(4)").addClass("two-pane-js").removeClass("grid-js");
		$(".CodeMirror:nth-child(5)").addClass("two-pane-css").removeClass("grid-css");
		$("#result_box").addClass("two-pane-result-box").removeClass("grid-result-box");
		$("#tabs").show();

		$("#view_button i").addClass("fa-th-large").removeClass("fa-pause");

		// Show only active windows
		$(".CodeMirror:nth-child(3), .CodeMirror:nth-child(4), .CodeMirror:nth-child(5)").hide();
		$("#tabs ul li").each(function(index){
			if($(this).hasClass("active-li")){
				var id = index+3;
				$(".CodeMirror:nth-child(" + id + ")").show();
			}
		});
	}
}

function switchtab(element){
	if(!$(element).hasClass("active-li")){
		//Set active class
		$("#tabs ul li").each(function(){
			$(this).removeClass("active-li");
		});
		$(element).addClass("active-li");
		// Switch active window
		$(".CodeMirror:nth-child(3), .CodeMirror:nth-child(4), .CodeMirror:nth-child(5)").hide();
		var id = $(element).index() + 3;
		$(".CodeMirror:nth-child(" + id + ")").show();
	}
}

function changeTheme(element, htmleditor, jseditor, csseditor){
	if($(element).index() === 0){
			htmleditor.setOption("theme", "eclipse");
			jseditor.setOption("theme", "eclipse");
			csseditor.setOption("theme", "eclipse");

			$("#tabs").addClass("eclipse").removeClass("material").removeClass("monokai");
		}
		else if($(element).index() === 1){
			htmleditor.setOption("theme", "material");
			jseditor.setOption("theme", "material");
			csseditor.setOption("theme", "material");

			$("#tabs").removeClass("eclipse").addClass("material").removeClass("monokai");
		}
		else if($(element).index() === 2){
			htmleditor.setOption("theme", "monokai");
			jseditor.setOption("theme", "monokai");
			csseditor.setOption("theme", "monokai");

			$("#tabs").removeClass("eclipse").removeClass("material").addClass("monokai");
		}
		$("#themes").hide();
}