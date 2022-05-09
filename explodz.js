void(
	function(STEP, PERSPECTIVE) {
	var COLOURS = ["#C33", "#ea4c88", "#663399", "#0066cc", "#669900", "#ffcc33", "#ff9900", "#996633"];
	
	function getColour(depth) {
		return COLOURS[depth % (COLOURS.length - 1)]
	}

	function getFaceHTML(topOrBottom, leftOrRight, w, h, rX, rY, c) {
		var common = "transform-origin:" + topOrBottom + " " + leftOrRight +";";
		var visual = " background:" + c + ";";
		var dimensions = " width:" + w + "px; height:" + h + "px;";
        var position = " position:absolute;" + topOrBottom + ":0;" + leftOrRight + ":0;"
		var rotate = " rotateX(" + rX + "deg) rotateY(" + rY + "deg)";
		var transform = "transform:" + rotate +";";
		var div = "<div class='dom3d' style='" + common + visual + dimensions + transform + position +"'></div>";
		return div;
	}

	var stepDelta = 0.001;
	function traverse(element, depth, offsetLeft, offsetTop) {
		var childNodes = element.childNodes, l = childNodes.length;
		for (var i = 0; i < l; i++) {
			var childNode = childNodes[i];
			if (childNode.nodeType === 1) {
                facesHTML = "";
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
                color = getColour(depth);
				// top
                facesHTML += getFaceHTML("top", "left",
						childNode.offsetWidth, STEP, 270, 0, color);
				// right
				facesHTML += getFaceHTML("top", "right",
						childNode.offsetHeight, STEP, 270, 90, color);
				// bottom
				facesHTML += getFaceHTML("bottom", "left",
						childNode.offsetWidth, STEP, 90, 0, color);
				// left
				facesHTML += getFaceHTML("top", "left",
						childNode.offsetHeight, STEP, 270, 270, color);
                childNode.insertAdjacentHTML('beforeend', facesHTML);
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

	var mode = "FACES";
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
        faces = document.getElementsByClassName("dom3d");

		switch (mode) {
		case "NO_FACES":
			mode = "FACES";
            for (let f of faces) {
                f.style.display = "";
            }
			break;
		case "FACES":
			mode = "NO_FACES";
            for (let f of faces) {
                f.style.display = "none";
            }
			break;
		}
	}

	function stop(event) {
		var key = event.code;
		if (key=="Escape") {
			mode = "DISABLED";
			r = false;
			traverse(body, 0, 0, 0);
            faces = document.getElementsByClassName("dom3d");
            for (let f of faces) {
			    body.removeChild(f);
            }
			document.removeEventListener("keydown", function(e) {stop(e)});
			document.removeEventListener("keyup", function(e) {pause(e)});
			document.removeEventListener("mousemove", function(b) {move(b)});
			document.removeEventListener("mouseup", function() {mouseup()});
		}
	}

	function pause(event) {
		var key = event.code;
		if (key=="ShiftLeft") {
            if (mode == "NO_FACES") {
                mode = "DISABLED";
			    r = false;
            } else {
                mode = "NO_FACES";
                r = true;
            }
		}
	}

	document.addEventListener("mousemove", function(b) {move(b)}, !0);
	document.addEventListener("mouseup", function() {mouseup()}, !0);

	document.addEventListener("keydown", function(e) {stop(e)});
	document.addEventListener("keydown", function(e) {pause(e)});

} (25, 5000));