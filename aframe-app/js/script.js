// Converts from radians to degrees.
var radiansToDegrees = function(radians) {
    return radians * 180 / Math.PI;
};

var showcheckoutmenu = function() {
    console.log("show menu");
    var menu = document.getElementById('checkoutmenu');
    menu.setAttribute('visible','true');
};

AFRAME.registerComponent('auto-enter-vr', {
  init: function () {
    this.el.sceneEl.enterVR();
  }
});

AFRAME.registerComponent('product', {
    schema: {
        on: {default: 'click'},
        toggle: {type: 'boolean', default: false},
        productName: {type: 'string', default: ''},
        specs: {type: 'string', default: ''},
        texture: {default: 'earth.jpg'},
    },
    init: function() {
        var data = this.data;
        var el = this.el;
        var guiItem = el.getAttribute("gui-item");
        console.log("in button, guiItem: "+JSON.stringify(guiItem));
        var guiInteractable = el.getAttribute("gui-interactable");
        console.log("in button, guiInteractable: "+JSON.stringify(guiInteractable));
        var toggleState = this.toggleState = data.toggle;

        this.vector = new THREE.Vector3();
        console.log("in gui-button init, data: "+JSON.stringify(data));

        var base = document.createElement("a-entity");
        base.setAttribute('geometry', 'primitive: sphere; radius:0.17;');
        base.setAttribute('material', 'color:white; shader: flat; src: url(assets/' + data.texture + ');');
        base.setAttribute('position', '0 0 0');
        el.appendChild(base);
        this.base = base;

        var panel = document.createElement("a-entity");
        panel.setAttribute('geometry', 'primitive: plane; width:0.45; height:0.3;');
        panel.setAttribute('material', 'color: #000000; shader: flat; opacity:0.25;');
        panel.setAttribute('position', '0 0.3 0');
        panel.setAttribute('visible', 'false');
        el.appendChild(panel);
        this.panel = panel;


        var productName = document.createElement("a-text");
        productName.setAttribute('material', 'color: #fff; shader: flat; opacity:0.25;');
        productName.setAttribute('position', '0 0.04 0');
        productName.setAttribute('scale', '0.4 0.4 0.4');
        productName.setAttribute('text', 'value' , data.productName);
        productName.setAttribute('text', 'align' , 'center');
        panel.appendChild(productName);

        var specs = document.createElement("a-text");
        specs.setAttribute('material', 'color: #fff; shader: flat; opacity:0.25;');
        specs.setAttribute('position', '0 -0.04 0');
        specs.setAttribute('scale', '0.2 0.2 0.2');
        specs.setAttribute('text', 'value' , data.specs);
        specs.setAttribute('text', 'align' , 'center');
        panel.appendChild(specs);


        el.addEventListener('mouseenter', function () {
            el.setAttribute('material', 'color', '#333');
            panel.setAttribute('visible', 'true');
        });

        el.addEventListener('mouseleave', function () {
            if (!(data.toggle)) {
                el.setAttribute('material', 'color', "#fff");
                panel.setAttribute('visible', 'false');
            }
        });

        el.addEventListener(data.on, function (evt) {            
            if (!(data.toggle)) { // if not toggling flashing active state
            }else{
            }
            var clickActionFunctionName = guiInteractable.clickAction;
            console.log("in button, clickActionFunctionName: "+clickActionFunctionName);
            // find object
            var clickActionFunction = window[clickActionFunctionName];
            //console.log("clickActionFunction: "+clickActionFunction);
            // is object a function?
            if (typeof clickActionFunction === "function") clickActionFunction();
        });

    },
    tick: function(t) { //  orient towards camera

        var self = this;
        var target = self.el.sceneEl.camera;
        var object3D = self.el.object3D;

        // make sure camera is set
        if (target) {
            target.updateMatrixWorld();
            this.vector.setFromMatrixPosition(target.matrixWorld);
            if (object3D.parent) {
                object3D.parent.updateMatrixWorld();
                object3D.parent.worldToLocal(this.vector);

            }
            //    return object3D.lookAt(this.vector); ignore camera pitch
            return object3D.lookAt(new THREE.Vector3(this.vector.x, object3D.position.y, this.vector.z));
        }
    },
    update: function (oldData) {
        console.log("In button update, toggle: "+this.toggleState);
    },
    setActiveState: function (activeState) {
        console.log("in setActiveState function");
        this.data.toggle = this.toggleState = activeState;
        if (!activeState) {
            console.log('state toggle off');
        } else {
            console.log('state toggle on');
        }
    }
});



AFRAME.registerComponent('shopping', {
    schema: {
        pitch: { type: 'number', default: 0 }, // max: Math.PI/2, min: - Math.PI/2  
    },
    init: function() {
        var newPos = this.newPos = new THREE.Vector3();
        var orientationVisible = false;
        var data = this.data;
        var _this = this;
        //single camera
        this.cameraEl = cameraEl = document.querySelector('a-entity[camera]');
        if (!this.cameraEl) {
            this.cameraEl = document.querySelector('a-camera');
        };

        this.cameraEl.addEventListener('componentchanged', function(evt) {
            if (evt.detail.name === 'rotation') {
                if (this.object3D.getWorldRotation().x <= data.pitch) {
                    if (!orientationVisible) {
                        orientationVisible = true;
                    }
                } else {
                    if (orientationVisible) {
                        orientationVisible = false;
                    }
                }
            }
        });


    },

    tick: function() {
        this.newPos.setFromMatrixPosition(this.cameraEl.object3D.matrixWorld);
        this.el.setAttribute('position', this.newPos.x + ' 0 ' + this.newPos.z);
        var newRot = this.cameraEl.object3D.getWorldRotation();
        this.el.setAttribute("rotation", "0 " + radiansToDegrees(newRot.y) + " 0");
    }
});


AFRAME.registerComponent('checkout', {
    schema: {
        pitch: { type: 'number', default: 0 }, // max: Math.PI/2, min: - Math.PI/2  
    },
    init: function() {
        var newPos = this.newPos = new THREE.Vector3();
        var orientationVisible = false;
        var data = this.data;
        var _this = this;

        _this.hide();
        //single camera
        this.cameraEl = cameraEl = document.querySelector('a-entity[camera]');
        if (!this.cameraEl) {
            this.cameraEl = document.querySelector('a-camera');
        };

        this.cameraEl.addEventListener('componentchanged', function(evt) {
            if (evt.detail.name === 'rotation') {
                if (this.object3D.getWorldRotation().x <= data.pitch) {
                    if (!orientationVisible) {
                        _this.show();
                        orientationVisible = true;
                    }
                } else {
                    if (orientationVisible) {
                        _this.hide();
                        orientationVisible = false;
                    }
                }
            }
        });

        //  adding ring
        var icon = document.createElement("a-gui-icon-button");
        icon.setAttribute('height', `0.75`);
        icon.setAttribute('onclick', `showcheckoutmenu`);
        icon.setAttribute('icon', `cash`);
        icon.setAttribute('position', `0 0.65 -0.65`);
        icon.setAttribute('scale', `0.2 0.2 0.2`);
        icon.setAttribute('rotation', `-70 0 0`);
        this.el.appendChild(icon);
        this.icon = icon;
    },

    show: function() {
        this.el.setAttribute('scale', '1 1 1');
    },

    hide: function() {
        this.el.setAttribute('scale', '0.03 0.03 0.03');
    },

    tick: function() {
        this.newPos.setFromMatrixPosition(this.cameraEl.object3D.matrixWorld);
        this.el.setAttribute('position', this.newPos.x + ' 0 ' + this.newPos.z);
        var newRot = this.cameraEl.object3D.getWorldRotation();
        this.el.setAttribute("rotation", "0 " + radiansToDegrees(newRot.y) + " 0");
    }

});


AFRAME.registerComponent('checkoutmenu', {
    init: function() {
        var newPos = this.newPos = new THREE.Vector3();
        var data = this.data;
        var _this = this;

        //  adding ring
        var icon = document.createElement("a-gui-icon-button");
        icon.setAttribute('height', `0.75`);
        icon.setAttribute('onclick', `increment_slide`);
        icon.setAttribute('icon', `arrow-right-b`);
        icon.setAttribute('position', `0 1.15 -1.15`);
        icon.setAttribute('scale', `0.2 0.2 0.2`);
        icon.setAttribute('rotation', `0 0 0`);
        this.el.appendChild(icon);
        this.icon = icon;

        //single camera
        this.cameraEl = cameraEl = document.querySelector('a-entity[camera]');
        if (!this.cameraEl) {
            this.cameraEl = document.querySelector('a-camera');
        
            this.yaxis = new THREE.Vector3(0, 1, 0);
            this.zaxis = new THREE.Vector3(0, 0, 1);

            this.pivot = new THREE.Object3D();
            this.el.object3D.position.set(this.data.xoffset, '1.6', '-1');

            this.el.sceneEl.object3D.add(this.pivot);
            this.pivot.add(this.el.object3D);
        };
    },
    eventHandler: function(evt) {

        if (this.el.getAttribute('visible') === false) {

            var direction = this.zaxis.clone();
            direction.applyQuaternion(this.cameraEl.object3D.quaternion);
            var ycomponent = this.yaxis.clone().multiplyScalar(direction.dot(this.yaxis));
            direction.sub(ycomponent);
            direction.normalize();

            this.pivot.quaternion.setFromUnitVectors(this.zaxis, direction);

            var xposition = this.cameraEl.object3D.getWorldPosition().x;
            var yposition = (Math.round(this.cameraEl.object3D.getWorldPosition().y * 100) / 100);
            var zposition = this.cameraEl.object3D.getWorldPosition().z;

            if(this.initHeight === yposition && this.initHeight !== 0){
                yposition = 0
            }else{
                yposition = yposition - this.initHeight;
            }

            this.pivot.position.set(xposition, yposition, zposition);

            this.el.setAttribute('scale', '1 1 1');             
            this.el.setAttribute('visible', true);


        } else if (this.el.getAttribute('visible') === true) {

            this.el.setAttribute('scale', '0.00001 0.00001 0.00001');
            this.el.setAttribute('visible', false);
        }

    },

    show: function() {
//        this.el.setAttribute('scale', '1 1 1');
    },

    hide: function() {
//        this.el.setAttribute('scale', '0.03 0.03 0.03');
    }

});
