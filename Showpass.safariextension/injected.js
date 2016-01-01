(function () {
    
    var options;
    
    safari.self.addEventListener('message', handleMessage, false);
    safari.self.tab.dispatchMessage('passSettings');
    
    function handleMessage(evt) {
        if (evt.name != 'settings')
            return;
        
        options = evt.message;
        
        var pwInputs = document.querySelectorAll('input[type="password"]');
        [].slice.call(pwInputs).forEach(processInput);
        
        var observer = new MutationObserver(mutationCallback);
        
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });
        
        setTimeout(observer.disconnect.bind(observer), 9999);
    }
    
    function mutationCallback(mutations) {
        mutations.forEach(function (mutation) {
            var addedNodes = mutation.addedNodes;
            if (addedNodes.length) {
                [].slice.call(addedNodes).forEach(function (node) {
                    if (!node.querySelector) 
                        return;
                    var pi = node.querySelector('input[type="password"]');
                    if (pi) {
                        processInput(pi);
                    }
                });
            }
        });
    }
    
    function processInput(input) {
        input.removeEventListener('mouseover', onMouseOverWithModifier);
        input.removeEventListener('mouseover', onMouseOver);
        input.removeEventListener('mouseout', onMouseOut);
        input.removeEventListener('keydown', onKeyDownInInput);
        input.removeEventListener('keyup', onKeyUpInInput);
        
        if (options.requireModKey) {
            input.addEventListener('mouseover', onMouseOverWithModifier);
            input.addEventListener('keydown', onKeyDownInInput);
            input.addEventListener('keyup', onKeyUpInInput);
        } else {
            input.addEventListener('mouseover', onMouseOver);
        }
        input.addEventListener('mouseout', onMouseOut);
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
    
    function onMouseOver() {
        this.type = 'text';
    }
    
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
    
    function onMouseOut() {
        this.type = 'password';
    }
    
})();
