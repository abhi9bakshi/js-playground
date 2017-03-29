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
		mode: 'text/html',
		extraKeys: {"Ctrl-Space": "autocomplete"}, 
		theme: "material",
        autoCloseTags: true,
        matchTags: true
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
		theme: "material",
		extraKeys: {"Ctrl-Space": "autocomplete"},
		autoCloseBrackets: true,
		matchBrackets: true
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
		extraKeys: {"Ctrl-Space": "autocomplete"}, 
		theme: "material",
		autoCloseBrackets: true,
		matchBrackets: true
	});


	/* Load file asynchronously on request */
	if(window.location.href.split("#")[1]){
		loadFileAJAX(window.location.href.split("#")[1], htmleditor, jseditor, csseditor);
	}
	
	/* Setup the Environment */
	changeView(htmleditor, jseditor, csseditor);
	changeTheme($("#themes li:nth-child(2)"), htmleditor, jseditor, csseditor);
	refresh();
	setFocus(2);

	

	/* ************************ Header Buttons Handler ************************ */
	/* Execute Script */
	$("#run_button").on("click", function(){
		execute(htmleditor, jseditor, csseditor);
	});

	/* Show External Resource */
	$("#external_resource_button").on("click", function(){
		if($("#external_resource").is(":hidden")){
			reset();
			$("#external_resource").show();
			$("#external_resource_input input").focus();	
		}else{
			$("#external_resource").hide();
		}
	});

	/* Add External Resource */
	$("#external_resource_input img").on('click', function(){
		addExternalUri();
	});	
	
	/* Remove External Resource */
	$("#external_resource").on('click','.external_resource_list div', function(){
		removeExternalUri($(this));
	});

	/* Show Themes */
	$("#theme_button").on("click", function(){
		if($("#themes").is(":hidden")){
			reset();
			$("#themes").show();			
		}else{
			$("#themes").hide();
		}
	});

	/* Change Theme */
	$("#themes li").on("click", function(){
		changeTheme(this, htmleditor, jseditor, csseditor);
		refresh();
		setFocus(focus);
	});

	/* Toggle View */
	$("#view_button").on("click", function(){
		var focus = changeView();
		console.log("focus: " + focus);
		refresh();
		setFocus(focus);
	});

	/* Clear Contents */
	$("#clear_button").on("click",function(){
		clearContents();
	});

	/* ************************ Tabs Handler ************************ */
	/* Handle Tabs Click */
	$("#tabs ul li").on("click", function(){
		var focus = switchtab(this);
		refresh();
		setFocus(focus);
	});

	/* Set Tab Active on Focus */
	htmleditor.on('focus', function() {
    	switchtab($("#tabs ul li:nth-child(1)"), 1);
    });
	jseditor.on('focus', function() {
    	switchtab($("#tabs ul li:nth-child(2)"), 1);
    });
	csseditor.on('focus', function() {
    	switchtab($("#tabs ul li:nth-child(3)"), 1);
    });

	
	/* ************************ Footer Buttons Handler ************************ */
	/* Load File */
	$('input[type=file]').on('change', function(){
		loadFile(htmleditor, jseditor, csseditor);
	});

	/* Show Save Dialog */
	$("#file-download").on('click', function(){
		if($("#savefile").hasClass("show-save-dialog")){
			$("#savefile").removeClass("show-save-dialog");	
		}else{
			reset();
			$("#savefile").addClass("show-save-dialog");	
			$("#savefile input").focus();
		}
	});

	/* Save File */
	$("#save-button").on('click', function(){
		saveFile(htmleditor, jseditor, csseditor);
	});

	/* Clear red background on file name input box on input */
	$("#file-name, #external_resource_input input").on('input', function(){
		$(this).removeClass("input-alert");	
	});


/* ************************ Keyboard Events Handler ************************ */
	shortcut.add("ESC",function() {
		reset();
	});
	shortcut.add("ENTER",function() {
		if($("#external_resource_input input").is(":focus")){
	        	addExternalUri();
	        }
	        else if($("#savefile input").is(":focus")){
	        	saveFile(htmleditor, jseditor, csseditor);
        }
	});
	shortcut.add("CTRL+F11",function() {
		execute(htmleditor, jseditor, csseditor);
	});
	shortcut.add("CTRL+1",function() {
		if($("#external_resource").is(":hidden")){
			reset();
			$("#external_resource").show();
			$("#external_resource_input input").focus();	
		}else{
			$("#external_resource").hide();
		}
	});
	shortcut.add("CTRL+2",function() {
		if($("#themes").is(":hidden")){
			reset();
			$("#themes").show();
			$("#themes li:first").hover();			
		}else{
			$("#themes").hide();
		}
	});
	shortcut.add("CTRL+3",function() {
		changeView();
		refresh();
	});	
	shortcut.add("CTRL+4",function() {
		$("#clear_button").trigger("click");
	});	

	shortcut.add("CTRL+S",function() {
		if($("#savefile").hasClass("show-save-dialog")){
			$("#savefile").removeClass("show-save-dialog");	
		}else{
			reset();
			$("#savefile").addClass("show-save-dialog");	
			$("#savefile input").focus();
		}
	});
	shortcut.add("CTRL+O",function() {
		$("#file-upload").trigger("click");
	});
	shortcut.add("F11",function() {
		var get_focus = getFocus();
		if(get_focus === 1){
			$(".CodeMirror:nth-child(1)").addClass("fullscreen");
			refresh();
		}else if(get_focus === 2){
			$(".CodeMirror:nth-child(2)").addClass("fullscreen");	
			refresh();
		}else if(get_focus === 3){
			$(".CodeMirror:nth-child(3)").addClass("fullscreen");	
			refresh();
		}else{
			$("#result_box").addClass("fullscreen");
		}
	});


	/* Reset Dropdowns */
	function reset(){
		$("#external_resource, #themes").hide();
		$("#savefile").removeClass("show-save-dialog");
		$("#result_box, .CodeMirror:nth-child(1), .CodeMirror:nth-child(2), .CodeMirror:nth-child(3)").removeClass("fullscreen");
		$("header h2").focus();
	}

	/* Refresh windows */
	function refresh(){
		htmleditor.refresh();
		jseditor.refresh();
		csseditor.refresh();
	}

	function getFocus(){
		if($(".CodeMirror:nth-child(1)").hasClass("CodeMirror-focused")){
			return 1;
		}
		else if($(".CodeMirror:nth-child(2)").hasClass("CodeMirror-focused")){
			return 2;
		}
		else if($(".CodeMirror:nth-child(3)").hasClass("CodeMirror-focused")){
			return 3;
		}else{
			return 4;
		}
	}

	function setFocus(id){
		if(id === 1){
			htmleditor.focus();
		}else if(id === 2){
			jseditor.focus();
		}else if(id === 3){
			csseditor.focus();
		}else{
			jseditor.focus();
		}
	}
});

function addExternalUri(){
	if($("#external_resource_input input").val()){
		// if($("#external_resource_input input").val().endsWith(".js") || $("#external_resource_input input").val().endsWith(".css")){
			input_uri = $("#external_resource_input input").val();

			$("#external_resource_input").after($("<div class='external_resource_list'>" + 
			"<input type='text' name='External Resource' value='" + input_uri + "'>" + 
			"<div><img src='media/icons/plus.png'></div>" +
			"</div>"));
			$(".external_resource_list_translate").removeClass("external_resource_list_translate");


			this_item = $("#external_resource_input").next("div");
			list_items = $("#external_resource_input").nextAll("div");
			setTimeout(function(){
				this_item.find("img").addClass("external_resource_list_img_added");
				this_item.children("div").addClass("external_resource_list_div_added");
				list_items.addClass("external_resource_list_translate"); 
			}, 50);
			$("#external_resource_input input").val("");
			$("#external_resource_input input").focus();
		// }else{
		// 	$("#external_resource_input input").addClass("input-alert");
		// }
	}else{
		$("#external_resource_input input").addClass("input-alert");
	}
}

function removeExternalUri(element){
	element.removeClass("external_resource_list_div_added");
	element.children("img").removeClass("external_resource_list_img_added");
	element.parent().slideUp(500, function() { $(this).remove(); } );
}

function loadFileAJAX(file, htmleditor, jseditor, csseditor){
	var req = new XMLHttpRequest();
	req.open("GET", file, true);
	req.overrideMimeType("application/text");
	req.send(null);

	req.onreadystatechange = function(){
		if(req.status === 200 && req.readyState === 4){
			var result = req.response.split("```"); 

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
				setResource(result[1]);
				htmleditor.getDoc().setValue(result[2]);
				jseditor.getDoc().setValue(result[3]);
				csseditor.getDoc().setValue(result[4]);
				execute(htmleditor, jseditor, csseditor);
		}
	}
}

function loadFile(htmleditor, jseditor, csseditor){
	var file = document.getElementById("file-upload").files[0];
	if (file) {
	    var reader = new FileReader();
	    reader.readAsText(file, "UTF-8");
	    reader.onload = function (evt) {

		var result = evt.target.result.split("```"); 
			for(i=0; i<result.length; i++){

				if(i === 0){
					result[i] = result[i].slice(0, -1);
				}
				else{
					result[i] = result[i].slice(1, -1);
				}
				// console.log(i + " " + result[i]);
			}
			$("header h2").text(result[0]);
			setResource(result[1]);
			htmleditor.getDoc().setValue(result[2]);
			jseditor.getDoc().setValue(result[3]);
			csseditor.getDoc().setValue(result[4]);
			execute(htmleditor, jseditor, csseditor);
	    }
	    reader.onerror = function (evt) {
	        console.log("error reading file");
	    }
	}
}

function setResource(resources){
	$('#external_resource_input').nextAll('div').remove();
	
	if(resources !== ""){	
		var resource = resources.split("\n"); 
		for(i=0; i<resource.length; i++){
			$("#external_resource_input").after($("<div class='external_resource_list external_resource_list_translate'>" + 
			"<input type='text' name='External Resource' value='" + resource[i] + "'>" + 
			"<div class='external_resource_list_div_added'><img class='external_resource_list_img_added' src='media/icons/plus.png'></div>" +
			"</div>"));
			// console.log(i + " " + resource[i]);
		}
	}
}

function saveFile(htmleditor, jseditor, csseditor){
	if($("#file-name").val()){
		var filename = $("#file-name").val();
		$("#savefile").removeClass("show-save-dialog");	

		$("header h2").text(filename);
		var newfile = filename + "\n```\n" + getResource("plain") + "\n```\n" + htmleditor.getValue() + "\n```\n" + jseditor.getValue() + "\n```\n" + csseditor.getValue() + "\n";
		var blob = new Blob([newfile], {type: "text/plain;charset=utf-8"});
		saveAs(blob, filename + ".txt");
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
	
	var resource = getResource("with_tags");

	var iframe = document.createElement('iframe');
	iframe.id = "result_iframe";

	//console.log("css: " + csseditor.getValue());

	content = 
'<!doctype html>' + 
'<html lang="en">' +
	'<head>' + 
		'<meta charset = "utf-8">' + 
		resource + 
	'</head>' +
	'<body>' +
		htmleditor.getValue() +
	'</body>' +

	'<style>' + 
		csseditor.getValue() + 
	'</style>' +
	'<scr' + 'ipt>' + 
		jseditor.getValue() + 
	'</scr' + 'ipt>' + 
'</html>'

	iframe.src = 'data:text/html;charset=utf-8,' + encodeURIComponent(content);
	myIframe = $('#result_box').empty().append( iframe );
}

function getResource(type){
	var resources = [];
	
	$($(".external_resource_list input").get().reverse()).each(function(index){
		resources.push($(this).val());
	});

	if(type == "with_tags"){
		for(var i = 0; i< resources.length; i++){
			// if(resources[i].slice(resources[i].length - 3, resources[i].length) === ".js"){
			if(resources[i].toLowerCase().indexOf("js") >= 0){
				resources[i] = "<scr" + "ipt src='" + resources[i] + "'></scr" + "ipt>";
			// }else if(resources[i].slice(resources[i].length - 4,resources[i].length) === ".css"){
			}else if(resources[i].toLowerCase().indexOf("css") >= 0){
				resources[i] = "<link rel='stylesheet' href='" + resources[i] + "'>"
			}
		}
	}

	var resource = resources.join();
	var resource = resource.replace(/,/g, "\n");

	return resource;
}

function changeView(){
	var id = undefined;
	// Change to grid
	if($("#view_button i").hasClass("fa-th-large")){
		$(".CodeMirror").each(function(index, element){
			$(this).removeClass("view-two-pane").addClass("view-grid");
		});

		$(".CodeMirror:nth-child(1)").removeClass("two-pane-html").addClass("grid-html");
		$(".CodeMirror:nth-child(2)").removeClass("two-pane-js").addClass("grid-js");
		$(".CodeMirror:nth-child(3)").removeClass("two-pane-css").addClass("grid-css");
		$("#result_box").removeClass("two-pane-result-box").addClass("grid-result-box");
		
		$("#view_button i").removeClass("fa-th-large").addClass("fa-pause");
		$("#tabs").hide();

		// Show all windows
		$(".CodeMirror:nth-child(1), .CodeMirror:nth-child(2), .CodeMirror:nth-child(3)").show();

		// Return ID of active window to set focus
		$("#tabs ul li").each(function(index){
			if($(this).hasClass("active-li")){
				id = index+1;
				console.log("innerfocus: " + id);
			}
		});
	}
	// Change to two pane
	else if($("#view_button i").hasClass("fa-pause")){
		$(".CodeMirror").each(function(){
			$(this).addClass("view-two-pane").removeClass("view-grid");
		});

		$(".CodeMirror:nth-child(1)").addClass("two-pane-html").removeClass("grid-html");
		$(".CodeMirror:nth-child(2)").addClass("two-pane-js").removeClass("grid-js");
		$(".CodeMirror:nth-child(3)").addClass("two-pane-css").removeClass("grid-css");
		$("#result_box").addClass("two-pane-result-box").removeClass("grid-result-box");
		$("#tabs").show();

		$("#view_button i").addClass("fa-th-large").removeClass("fa-pause");

		// Show only active windows
		$(".CodeMirror:nth-child(1), .CodeMirror:nth-child(2), .CodeMirror:nth-child(3)").hide();
		$("#tabs ul li").each(function(index){
			if($(this).hasClass("active-li")){
				id = index+1;
				$(".CodeMirror:nth-child(" + id + ")").show();
			}
		});
	}
	return id;
}

function clearContents(){
	var result = confirm("Are you sure you wish to clear everything? Any unsaved changes will be lost.");
	if (result) {
		setResource("https://code.jquery.com/jquery-3.2.1.min.js");
		htmleditor.getDoc().setValue("");
		jseditor.getDoc().setValue("");
		csseditor.getDoc().setValue("");
		$('#result_box').empty();
		$("header h2").text("JS Playground");
	}
}

function switchtab(element, show){
	if(!$(element).hasClass("active-li")){
		//Set active class
		$("#tabs ul li").each(function(){
			$(this).removeClass("active-li");
		});
		$(element).addClass("active-li");
		if(!show){
			$(".CodeMirror:nth-child(1), .CodeMirror:nth-child(2), .CodeMirror:nth-child(3)").hide();
		}
		// Switch active window
		var id = $(element).index() + 1;
		$(".CodeMirror:nth-child(" + id + ")").show();
		return id;
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