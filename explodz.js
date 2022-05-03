void(function(STEP, PERSPECTIVE) {
	var COLOURS = ["#C33", "#ea4c88", "#663399", "#0066cc", "#669900", "#ffcc33", "#ff9900", "#996633"];
	
	function getColour(depth) {
		return COLOURS[depth % (COLOURS.length - 1)]
	}

	function getFaceHTML(x, y, z, w, h, r, c) {
		var common = "position:absolute;-webkit-transform-origin: 0 0 0;";
		var visual = "background:" + c + ";";
		var dimensions = "width:" + w + "px; height:" + h + "px;";
		var translate = "translate3d(" + x + "px," + y + "px," + z + "px)";
		var rotate = "rotateX(" + 270 + "deg) rotateY(" + r + "deg)";
		var transform = "-webkit-transform:" + translate + rotate + ";"; 
		var div = "<div style='" + common + visual + dimensions + transform + "'></div>";
		return div;
	}

	var stepDelta = 0.001, facesHTML = "";
	function traverse(element, depth, offsetLeft, offsetTop) {
		var childNodes = element.childNodes, l = childNodes.length;
		for (var i = 0; i < l; i++) {
			var childNode = childNodes[i];
			if (childNode.nodeType === 1) {
				if (mode == "DISABLED") {
					childNode.style.overflow = 'initial';
					childNode.style.WebkitTransformStyle = 'initial';
					childNode.style.WebkitTransform = 'initial';
				} else {
					childNode.style.WebkitTransformStyle = 'preserve-3d';
					childNode.style.overflow = 'visible';
					childNode.style.WebkitTransform = 'translateZ(' + (STEP + (l - i) * stepDelta).toFixed(3) + 'px)';
				}


				var elementBodyOffsetLeft = offsetLeft,
					elementBodyOffsetTop = offsetTop;

				if (childNode.offsetParent === element) {
					elementBodyOffsetLeft += element.offsetLeft;
					elementBodyOffsetTop += element.offsetTop;
				}

				traverse(childNode, depth + 1, elementBodyOffsetLeft, elementBodyOffsetTop);

				// top
				facesHTML += getFaceHTML(elementBodyOffsetLeft + childNode.offsetLeft, 
						elementBodyOffsetTop + childNode.offsetTop, (depth + 1) * STEP,
						childNode.offsetWidth, STEP, 0, getColour(depth));
				// right
				facesHTML += getFaceHTML(elementBodyOffsetLeft + childNode.offsetLeft + childNode.offsetWidth, 
						elementBodyOffsetTop + childNode.offsetTop, (depth + 1) * STEP,
						childNode.offsetHeight, STEP, 270, getColour(depth));
				// bottom
				facesHTML += getFaceHTML(elementBodyOffsetLeft + childNode.offsetLeft, 
						elementBodyOffsetTop + childNode.offsetTop + childNode.offsetHeight, (depth + 1) * STEP,
						childNode.offsetWidth, STEP, 0, getColour(depth));
				// left
				facesHTML += getFaceHTML(elementBodyOffsetLeft + childNode.offsetLeft, 
						elementBodyOffsetTop + childNode.offsetTop, (depth + 1) * STEP,
						childNode.offsetHeight, STEP, 270, getColour(depth));
			}
		}
	}

	var body = document.body;
	body.style.overflow = 'visible';
	body.style.WebkitTransformStyle = 'preserve-3d';
	body.style.WebkitPerspective = PERSPECTIVE;

	var xCenter = (window.innerWidth/2).toFixed(2);
	var yCenter = (window.innerHeight/2).toFixed(2);
	body.style.WebkitPerspectiveOrigin = body.style.WebkitTransformOrigin = xCenter + "px " + yCenter +"px";

	traverse(body, 0, 0, 0);

	var faces = document.createElement("DIV");
	faces.style.display = "none";
	faces.style.position = "absolute";
	faces.style.top = 0;
	faces.innerHTML = facesHTML;
	body.appendChild(faces);

	var mode = "NO_FACES";
	function move(e) {
		if (mode !== "DISABLED") {
			var xrel = e.screenX / screen.width;
			var yrel = 1 - (e.screenY / screen.height);
			var xdeg = (yrel * 360 - 180).toFixed(2);
			var ydeg = (xrel * 360 - 180).toFixed(2);
			body.style.WebkitTransform = "rotateX(" + xdeg + "deg) rotateY(" + ydeg + "deg)";
		}
	}

	function mouseup(e) {
		switch (mode) {
		case "NO_FACES":
			mode = "FACES";
			faces.style.display = "";
			break;
		case "FACES":
			mode = "NO_FACES";
			faces.style.display = "none";
			break;
		}
	}

	function stop(event) {
		var key = event.code;
		console.log(key)
		if (key=="Escape") {
			mode = "DISABLED";
			r= false;
			traverse(d, 0, 0, 0);
			body.removeChild(f);
			body.style = w;
			document.removeEventListener("keydown", function(e) {stop(e)});
			document.removeEventListener("keyup", function(e) {pause(e)});
			document.removeEventListener("mousemove", function(b) {move(b)});
			document.removeEventListener("mouseup", function() {mouseup()});
		}
		if (key=="ShiftLeft") {
			mode = "DISABLED";
			r= false;
		}
	}

	function pause(event) {
		var key = event.code;
		if (key=="ShiftLeft") {
			mode = "NO_FACES";
			r = true;
		}
	}

	document.addEventListener("mousemove", function(b) {move(b)}, !0);
	document.addEventListener("mouseup", function() {mouseup()}, !0);

	document.addEventListener("keydown", function(e) {stop(e)});
	document.addEventListener("keyup", function(e) {pause(e)});

} (25, 5000));