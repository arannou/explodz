void(
	function(STEP, PERSPECTIVE) {

	function getColour(depth) {
		return COLOURS[depth % (COLOURS.length - 1)]
	}

	function getFaceHTML(topOrBottom, leftOrRight, w, h, rX, rY, c) {
		let common = "transform-origin:" + topOrBottom + " " + leftOrRight +";";
		let visual = " background:" + c + ";";
		let dimensions = " width:" + w + "px; height:" + h + "px;";
		let position = " position:absolute;" + topOrBottom + ":0;" + leftOrRight + ":0;"
		let rotate = " rotateX(" + rX + "deg) rotateY(" + rY + "deg)";
		let transform = "transform:" + rotate +";";
		let div = "<div class='dom3d' style='" + common + visual + dimensions + transform + position +"'></div>";
		return div;
	}


	function traverse(element, depth, offsetLeft, offsetTop) {
		let childNodes = element.childNodes;
		let l = childNodes.length;
		for (let i = 0; i < l; i++) {
			let childNode = childNodes[i];
			if (childNode.nodeType === 1) {
				let facesHTML = "";

				let elementBodyOffsetLeft = offsetLeft;
				let elementBodyOffsetTop = offsetTop;

				if (childNode.offsetParent === element) {
					elementBodyOffsetLeft += element.offsetLeft;
					elementBodyOffsetTop += element.offsetTop;
				}

				traverse(childNode, depth + 1, elementBodyOffsetLeft, elementBodyOffsetTop);

				if (mode == "DISABLED") {
					childNode.style.overflow = 'initial';
					childNode.style.WebkitTransformStyle = 'initial';
					childNode.style.WebkitTransform = 'initial';
				} else {
					childNode.style.WebkitTransformStyle = 'preserve-3d';
					childNode.style.overflow = 'visible';
					childNode.style.WebkitTransform = 'translateZ(' + (STEP + (l - i) * stepDelta).toFixed(3) + 'px)';

					const color = getColour(depth);
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
	}

	function move(e) {
		if (mode !== "DISABLED") {
			let xrel = e.screenX / screen.width;
			let yrel = 1 - (e.screenY / screen.height);
			let xdeg = (yrel * 360 - 180).toFixed(2);
			let ydeg = (xrel * 360 - 180).toFixed(2);
			body.style.WebkitTransform = "rotateX(" + xdeg + "deg) rotateY(" + ydeg + "deg)";
		}
	}

	function mouseup(e) {
		let faces = document.getElementsByClassName("dom3d");

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
		if (event.code == "Escape") {
			mode = "DISABLED";
			traverse(body, 0, 0, 0);

			let faces = document.getElementsByClassName('dom3d');
			for (const f of [...faces]) {
				f.remove();
			}

			document.removeEventListener("keydown", function(e) {stop(e)});
			document.removeEventListener("keydown", function(e) {pause(e)});
			document.removeEventListener("mousemove", function(b) {move(b)});
			document.removeEventListener("mouseup", function() {mouseup()});

			body.style.overflow = 'initial';
			body.style.WebkitTransformStyle = 'initial';
			body.style.WebkitPerspective = 0;
			body.style.transform = 'initial';
		}
	}

	function pause(event) {
		if (event.code == "ShiftLeft") {
			if (mode == "NO_FACES") {
				mode = "DISABLED";
			} else {
				mode = "NO_FACES";
			}
		}
	}

	const stepDelta = 0.001;
	const COLOURS = ["#C33", "#ea4c88", "#663399", "#0066cc", "#669900", "#ffcc33", "#ff9900", "#996633"];

	const body = document.body;
	body.style.overflow = 'visible';
	body.style.WebkitTransformStyle = 'preserve-3d';
	body.style.WebkitPerspective = PERSPECTIVE;

	let xCenter = (window.innerWidth/2).toFixed(2);
	let yCenter = (window.innerHeight/2).toFixed(2);
	body.style.WebkitPerspectiveOrigin = body.style.WebkitTransformOrigin = xCenter + "px " + yCenter +"px";

	let mode = "FACES";
	traverse(body, 0, 0, 0);

	document.addEventListener("mousemove", function(b) {move(b)}, !0);
	document.addEventListener("mouseup", function() {mouseup()}, !0);

	document.addEventListener("keydown", function(e) {stop(e)});
	document.addEventListener("keydown", function(e) {pause(e)});

} (25, 5000));