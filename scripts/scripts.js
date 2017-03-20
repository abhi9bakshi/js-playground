$(document).ready(function(){

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
		value: htmlDecode(htmlbox.innerHTML),
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
		value: jsbox.innerHTML,
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
		value: cssbox.innerHTML,
		lineNumbers: true,
		mode:  "css",
		theme: "material"
	});

	/* Toggle View */
	$("#view_button").on("click", function(){
		changeView();		
	});

	/* Execute Script */
	$("#run_button").on("click", function(){
		execute(htmleditor, jseditor, csseditor);
	});
});

function htmlDecode(input){
  var e = document.createElement('div');
  e.innerHTML = input;
  return e.childNodes[0].nodeValue;
}

function execute(htmleditor,jseditor,csseditor){
	$('#result_box').contents().find('html').html("<style>"+csseditor.getValue()+"</style>"+htmleditor.getValue());
	document.getElementById('result_box').contentWindow.eval( jseditor.getValue() );
}

function changeView(){
	// Change to grid
	if($("#view_button i").hasClass("fa-th-large")){
		$(".CodeMirror").each(function(index, element){
			$(this).removeClass("view-two-pane").addClass("view-grid");
		});

		$(".CodeMirror:nth-child(2)").removeClass("two-pane-html").addClass("grid-html");
		$(".CodeMirror:nth-child(3)").removeClass("two-pane-js").addClass("grid-js");
		$(".CodeMirror:nth-child(4)").removeClass("two-pane-css").addClass("grid-css");
		$("#result_box").removeClass("two-pane-result-box").addClass("grid-result-box");
		$("#tabs").hide();

		$("#view_button i").removeClass("fa-th-large").addClass("fa-pause");

		// Show all windows
		$(".CodeMirror:nth-child(2), .CodeMirror:nth-child(3), .CodeMirror:nth-child(4)").show();
	}
	// Change to two pane
	else if($("#view_button i").hasClass("fa-pause")){
		$(".CodeMirror").each(function(){
			$(this).addClass("view-two-pane").removeClass("view-grid");
		});

		$(".CodeMirror:nth-child(2)").addClass("two-pane-html").removeClass("grid-html");
		$(".CodeMirror:nth-child(3)").addClass("two-pane-js").removeClass("grid-js");
		$(".CodeMirror:nth-child(4)").addClass("two-pane-css").removeClass("grid-css");
		$("#result_box").addClass("two-pane-result-box").removeClass("grid-result-box");
		$("#tabs").show();

		$("#view_button i").addClass("fa-th-large").removeClass("fa-pause");

		// Show only active windows
		$(".CodeMirror:nth-child(2), .CodeMirror:nth-child(3), .CodeMirror:nth-child(4)").hide();
		$("#tabs ul li").each(function(index){
			if($(this).hasClass("active-li")){
				var id = index+2;
				$(".CodeMirror:nth-child(" + id + ")").show();
			}
		});

	}
}