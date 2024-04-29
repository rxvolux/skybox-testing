const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
const deg2rad = deg => (deg * Math.PI) / 180.0;
var canvas = document.getElementById("renderCanvas");

var startRenderLoop = function (engine, canvas) {
    engine.runRenderLoop(function () {
        if (sceneToRender && sceneToRender.activeCamera) {
            sceneToRender.render();
        }
    });
}

var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = function() { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true,  disableWebGL2Support: false}); };
var createScene = function () {
    var scene = new BABYLON.Scene(engine);
    window.camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 0, 0), scene);
    /*really real estate mouse movement*/ var mouse = {}; document.onmousemove = (event) => { mouse.x = (event.clientX - canvas.getBoundingClientRect().x) * 100 / canvas.width; mouse.y = (event.clientY - canvas.getBoundingClientRect().y) * 100 / canvas.height;};
        
    var light = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(-1, 1, 0), scene);
    light.diffuse = new BABYLON.Color3(1, 0, 0);
    
    // the box of the sky
    var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1000.0}, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    // Replace the texture in the line below
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("skybox/skybox", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;    
        
    //rotate real
    var rot = {x: 0, y: 0}
    scene.onBeforeRenderObservable.add(() => {
        if(mouse.x > 50) { rot.x += 0.0000001;} else { rot.x -= 0.0000001;}
        if(mouse.y > 50) { rot.y += 0.0000001;} else { rot.y -= 0.0000001;}
        rot.x = clamp(rot.x, -0.0001, 0.0001); rot.y = clamp(rot.y, -0.0001, 0.0001);
        camera.rotation._y += rot.x; camera.rotation._x += rot.y;
        camera.rotation._x = clamp(camera.rotation._x, deg2rad(-85), deg2rad(85));
    }); 
    
    return scene;
};
                window.initFunction = async function() {
                    
                    
                    
                    var asyncEngineCreation = async function() {
                        try {
                        return createDefaultEngine();
                        } catch(e) {
                        console.log("the available createEngine function failed. Creating the default engine instead");
                        return createDefaultEngine();
                        }
                    }

                    window.engine = await asyncEngineCreation();
        if (!engine) throw 'engine should not be null.';
        startRenderLoop(engine, canvas);
        window.scene = createScene();};
        initFunction().then(() => {sceneToRender = scene                    
        });

        // Resize
        window.addEventListener("resize", function () {
            engine.resize();
        });