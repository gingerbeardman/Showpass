(function () {
	
	safari.self.addEventListener('message', function (evt) {
		if (evt.name == 'settings') {
			processInputs(evt.message);
		}
	}, false);
	
	safari.self.tab.dispatchMessage('passSettings');
	
	function onMouseOverWithModifier(evt) {
		var input = this;
		if (evt.metaKey) {
			input.type = 'text';
		}
		document.addEventListener('keydown', onKeyDown, false);
		document.addEventListener('keyup', onKeyUp, false);
		input.addEventListener('mouseout', function () {
			document.removeEventListener('keydown', onKeyDown, false);
			document.removeEventListener('keyup', onKeyUp, false);
		});
		function onKeyUp(ku) {
			if (ku.keyCode == 91 || ku.keyCode == 93) { input.type = 'password' }
		}
		function onKeyDown(kd) {
			if (kd.keyCode == 91 || kd.keyCode == 93) { input.type = 'text' }
		}
	}
	
	function onMouseOver() {
		this.type = 'text';
	}
	
	function onMouseOut() {
		this.type = 'password';
	}
	
	function onKeyDownInInput(evt) {
		if (evt.keyCode == 91 || evt.keyCode == 93) {
			this.type = 'text';
		}
	}
	
	function onKeyUpInInput(evt) {
		if (evt.keyCode == 91 || evt.keyCode == 93) {
			this.type = 'password';
		}
	}
	
	function processInputs(options) {
		var pwInputs = document.getElementsByTagName('input');
		for (var input, i = 0; i < pwInputs.length; i++) {
			input = pwInputs[i];
			if (input.type == 'password') {
				input.removeEventListener('mouseover', onMouseOverWithModifier, false);
				input.removeEventListener('mouseover', onMouseOver, false);
				input.removeEventListener('mouseout', onMouseOut, false);
				input.removeEventListener('keydown', onKeyDownInInput, false);
				input.removeEventListener('keyup', onKeyUpInInput, false);
				
				if (options.requireModKey) {
					input.addEventListener('mouseover', onMouseOverWithModifier, false);
					input.addEventListener('keydown', onKeyDownInInput, false);
					input.addEventListener('keyup', onKeyUpInInput, false);
				} else {
					input.addEventListener('mouseover', onMouseOver, false);
				}
				input.addEventListener('mouseout', onMouseOut, false);
			}
		}
	}
	
})();
