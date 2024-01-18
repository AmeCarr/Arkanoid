//*****************************************************VARIABLES*********************************************************************************

//relevant paths to resources
var program;
var gl;
var canvas;
var baseDir;
var shaderDir;
var modelsDir;

//camera variables
var cx = CX;
var cy = CY;
var cz = CZ;
var elevation = ELEVATION;
var angle = ANGLE;
var lookRadius = LOOK_RADIUS;

//meshes
var ballMesh;
var paddleMesh;
var brickYellowMesh;
var brickOrangeMesh;
var brickRedMesh;
var wallMeshLeft;
var wallMeshRight;
var wallMeshUp;

//meshes list
var allMeshes = [];

//texture variables
var texture;
var image = new Image();

//vertex shader
var positionAttributeLocation;
var normalAttributeLocation;
var uvAttributeLocation;
var matrixLocation;
var normalMatrixPositionHandle;
var vertexMatrixPositionHandle;

//fragment shader
var textureLocation;
var dirLightAlphaHandle;
var dirLightBetaHandle;

var pointLight_xHandle;
var pointLight_yHandle;
var pointLight_zHandle;

var ambientMaterialColorLocation;
var lightTypelocation;
var specularTypeLocation;
var diffuseTypeLocation;
var lightDecayLocation;
var lightTargetLocation;
var lightPositionLocation;
var lightDirectionLocation;
var lightColorLocation;
var ambientLightColorLocation;
var diffuseColorLocation;
var specularShineLocation;
var dToonThLocation;
var sToonThLocation;
var specularColorLocation;

var perspectiveMatrix;
var viewMatrix;
var vaos;

var textScoreHandle;
var gameOverDiv;
var gameOverTextHandle;

var eyePosition;
var eyePositionHandle;
//********************************************************************************************************************************************

function changeLightType(value){
    switch(value){
        case "direct":
            lightType = [1.0, 0.0];
            break;
        case "point":
            lightType = [0.0, 1.0];
            break;
    }
}

function changeDiffuseType(value){
    switch(value){
        case "lambert":
            diffuseType = [1.0, 0.0];
            break;
        case "toon":
            diffuseType = [0.0, 1.0];
            break;
        case "none":
            diffuseType = [0.0, 0.0];
            break;
    }
}

function changeSpecularType(value){
    switch(value){
        case "blinn":
            specularType = [0.0, 1.0, 0.0];
            break;
        case "phong":
            specularType = [1.0, 0.0, 0.0];
            break;
        case "toonP":
            specularType = [1.0, 0.0, 1.0];
            break;
        case "toonB":
            specularType = [0.0, 1.0, 1.0];
            break;
        case "none":
            specularType = [0.0, 0.0, 0.0];
            break;
    }
}



function main(){
  gl.clearColor(0.306, 0.659, 0.871, 1.0); //flipper --> 0.85, 0.85, 0.85, 1.0
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);


  lightType = [1.0, 0.0]; // direct light by deafult
  diffuseType = [1.0, 0.0]; // Lambert diffuse by deafult
  specularType = [0.0, 1.0, 0.0]; // Blinn specular by deafult
  
  // get texture, send in buffer
    texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    image.src = baseDir + "textures/Red_palette.png";
    image.onload = function () {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.generateMipmap(gl.TEXTURE_2D);
    };

  //vertex shader 
  positionAttributeLocation = gl.getAttribLocation(program, "inPosition");
  normalAttributeLocation = gl.getAttribLocation(program, "inNormal");
  uvAttributeLocation = gl.getAttribLocation(program, "in_uv");
  
  matrixLocation = gl.getUniformLocation(program, "matrix");
  normalMatrixPositionHandle = gl.getUniformLocation(program, "nMatrix");
  vertexMatrixPositionHandle = gl.getUniformLocation(program, "pMatrix");
  
  textureLocation = gl.getUniformLocation(program, "in_texture");

  //fragment shader

  lightTypelocation = gl.getUniformLocation(program, 'uLightType');
  specularTypeLocation = gl.getUniformLocation(program, 'uSpecularType');
  diffuseTypeLocation = gl.getUniformLocation(program, 'uDiffuseType');

  ambientMaterialColorLocation = gl.getUniformLocation(program, 'uColor');

  lightDecayLocation = gl.getUniformLocation(program, 'uLightDecay');
  lightTargetLocation = gl.getUniformLocation(program, 'uLightTarget');

  lightPositionLocation = gl.getUniformLocation(program, 'uLightPosition');
  lightDirectionLocation = gl.getUniformLocation(program, 'uLightDirection');
  lightColorLocation = gl.getUniformLocation(program, 'uLightColor');
  ambientLightColorLocation = gl.getUniformLocation(program, 'uAmbientLightColor');
    
  diffuseColorLocation = gl.getUniformLocation(program, 'uDiffuseColor');
  specularShineLocation = gl.getUniformLocation(program, 'uSpecShine');
  dToonThLocation = gl.getUniformLocation(program, 'uDToonTh');
  sToonThLocation = gl.getUniformLocation(program, 'uSToonTh');

  specularColorLocation = gl.getUniformLocation(program, 'uSpecularColor');

  eyePositionHandle = gl.getUniformLocation(program, "uEye");
  //*******************************************************************************************************************************************+
  
  perspectiveMatrix = utils.MakePerspective(45, gl.canvas.width / gl.canvas.height, 1, 100 );
  //perspectiveMatrix = utils.MakeOrthogonal(gl.canvas.width/45, gl.canvas.width / gl.canvas.height, 1, 100);

  vaos = new Array(allMeshes.length);

  function addMeshToScene(i) {
    let mesh = allMeshes[i];
    let vao = gl.createVertexArray();
    vaos[i] = vao;
    gl.bindVertexArray(vao);

    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.vertices), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    var uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.textures), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(uvAttributeLocation);
    gl.vertexAttribPointer(uvAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    var normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.vertexNormals), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(normalAttributeLocation);
    gl.vertexAttribPointer(normalAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mesh.indices), gl.STATIC_DRAW);
  }

  for (let i in allMeshes)
    addMeshToScene(i);


  function drawScene(){
    // clear scene in flipper
    gl.clearColor(0.306, 0.659, 0.871, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 

    //update game state, animations
    updateGameState();
    updateMatrices();    
    

    cz = lookRadius * Math.cos(utils.degToRad(-angle)) * Math.cos(utils.degToRad(-elevation));
    cx = lookRadius * Math.sin(utils.degToRad(-angle)) * Math.cos(utils.degToRad(-elevation));
    cy = lookRadius * Math.sin(utils.degToRad(-elevation)); 
    viewMatrix = utils.MakeView(cx, cy, cz, elevation, angle);

    eyePosition = [cx, cy, cz];

    //get directional light directions
    directionalLightAlpha = utils.degToRad(dirLightAlphaHandle.value); 
    directionalLightBeta = utils.degToRad(dirLightBetaHandle.value);
    directionalLightDirection = [Math.sin(directionalLightAlpha) * Math.cos(directionalLightBeta),
                       Math.cos(directionalLightAlpha),
                       Math.sin(directionalLightAlpha) * Math.sin(directionalLightBeta)];
    /*Math.sin(directionalLightAlpha) * Math.cos(directionalLightBeta),
                       Math.cos(directionalLightAlpha),
                       Math.sin(directionalLightAlpha) * Math.sin(directionalLightBeta)*/

    /*-Math.cos(directionalLightAlpha) * Math.cos(directionalLightBeta),
                                  -Math.sin(directionalLightAlpha),
                                  -Math.cos(directionalLightAlpha) * Math.sin(directionalLightBeta)*/

    pointLight_x = (pointLight_xHandle.value);
    pointLight_y = (pointLight_yHandle.value);
    pointLight_z = (pointLight_zHandle.value);
    lightPosition = [pointLight_x, pointLight_y, pointLight_z];

    //pass uniforms to fs here
    gl.uniform2fv(lightTypelocation, lightType);

    gl.uniform3fv(specularTypeLocation, specularType);
    gl.uniform2fv(diffuseTypeLocation, diffuseType);
    gl.uniform3fv(ambientMaterialColorLocation, ambientMaterialColor);

    gl.uniform1f(lightDecayLocation, lightDecay);
    gl.uniform1f(lightTargetLocation, lightTarget);

    gl.uniform3fv(lightPositionLocation, lightPosition);
    gl.uniform3fv(lightDirectionLocation, directionalLightDirection);  //lightDirection
    gl.uniform3fv(lightColorLocation, lightColor);

    var col = document.getElementById("ambientLightColor").value.substring(1,7);
    var R = parseInt(col.substring(0,2) ,16) / 255;
    var G = parseInt(col.substring(2,4) ,16) / 255;
    var B = parseInt(col.substring(4,6) ,16) / 255;
    gl.uniform3f(ambientLightColorLocation, R,G,B);

    gl.uniform3fv(diffuseColorLocation, diffuseColor);
    gl.uniform1f(specularShineLocation, specShine);
    gl.uniform1f(dToonThLocation, DToonTh);
    gl.uniform1f(sToonThLocation, SToonTh);

    gl.uniform3fv(specularColorLocation, specularColor);

    gl.uniform3fv(eyePositionHandle, eyePosition);
    //****************************************************************************************************************************************

    // add each mesh / object with its world matrix
    for (var i = 0; i < allMeshes.length; i++) {
      var worldMatrix = currentMatricesList[i];
      var worldViewMatrix = utils.multiplyMatrices(viewMatrix, worldMatrix);
      var projectionMatrix = utils.multiplyMatrices(perspectiveMatrix, worldViewMatrix);  //WVP 

      // matrix to transform normals in world shading space, used by the Vertex Shader
      var normalTransformationMatrix = utils.invertMatrix(utils.transposeMatrix(worldMatrix)); 

      gl.uniformMatrix4fv(matrixLocation, gl.FALSE, utils.transposeMatrix(projectionMatrix));
      gl.uniformMatrix4fv(vertexMatrixPositionHandle, gl.FALSE, utils.transposeMatrix(worldMatrix));
      gl.uniformMatrix4fv(normalMatrixPositionHandle, gl.FALSE, utils.transposeMatrix(normalTransformationMatrix));
      
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(textureLocation, 0);


      gl.bindVertexArray(vaos[i]);
      gl.drawElements(gl.TRIANGLES, allMeshes[i].indices.length, gl.UNSIGNED_SHORT, 0);
    }
    
    window.requestAnimationFrame(drawScene);


  }

  drawScene();
}

async function init(){
    setupCanvas();
    setUpMouseControls();

    await loadShaders();
    await loadMeshes();

    textScoreHandle = document.getElementById("text");
    gameOverTextHandle = document.getElementById("gameOver");
    gameOverDiv = document.getElementById("gameOverDiv");

    dirLightAlphaHandle = document.getElementById("dirLightAlpha");
    dirLightBetaHandle = document.getElementById("dirLightBeta");

    pointLight_xHandle = document.getElementById("positionX");
    pointLight_zHandle = document.getElementById("positionY");
    pointLight_yHandle = document.getElementById("positionZ");

    initializeGame();    
    main();

    // prepare canvas and body styles
    function setupCanvas(){
      canvas = document.getElementById("canvas");
      gl = canvas.getContext("webgl2");

      if (!gl) {
        document.write("GL context not opened");
        return;
      }
      utils.resizeCanvasToDisplaySize(canvas);
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    }

    //load shaders
    async function loadShaders() {
      // initialize resource paths
      var path = window.location.pathname;
      var page = path.split("/").pop();
      baseDir = window.location.href.replace(page, '');

      shaderDir = baseDir + "shaders/";
      modelsDir = baseDir + "models/";

       //load vertex and fragment shaders from file
      await utils.loadFiles([shaderDir + 'vs.glsl', shaderDir + 'fs.glsl'], function (shaderText) {
        var vertexShader = utils.createShader(gl, gl.VERTEX_SHADER, shaderText[0]);
        var fragmentShader = utils.createShader(gl, gl.FRAGMENT_SHADER, shaderText[1]);
        program = utils.createProgram(gl, vertexShader, fragmentShader);
      });

      gl.useProgram(program);
    }

    async function loadMeshes(){

      //ball
      ballMesh = await utils.loadMesh((modelsDir + "red_palette/ball_white.obj"));
      //paddle
      paddleMesh = await utils.loadMesh((modelsDir + "red_palette/normal_red_1.obj"));
      //left wall
      wallMeshLeft = await utils.loadMesh((modelsDir + "red_palette/dark_red.obj"));
      //right wall
      wallMeshRight = await utils.loadMesh((modelsDir + "red_palette/dark_red.obj"));
      //upper wall
      wallMeshUp = await utils.loadMesh((modelsDir + "red_palette/dark_red.obj"));

      allMeshes = [ballMesh,paddleMesh, wallMeshRight, wallMeshLeft, wallMeshUp];


      //two bottom lines
      for(let i = 0; i < 10; i++){
        allMeshes.push(await utils.loadMesh(modelsDir + "red_palette/darkest.obj"));
      }
      for(let i = 0; i < 10; i++){
        allMeshes.push(await utils.loadMesh(modelsDir + "red_palette/darkest.obj"));
      }

      // load bricks CG
      for(let i = 0; i < 9; i++){
        allMeshes.push(await utils.loadMesh(modelsDir + "red_palette/very_light_grey.obj"));
      }
      for(let i = 0; i < 3; i++){
        allMeshes.push(await utils.loadMesh(modelsDir + "red_palette/light_grey.obj"));
      }
      for(let i = 0; i < 5; i++){
        allMeshes.push(await utils.loadMesh(modelsDir + "red_palette/grey.obj"));
      }
      for(let i = 0; i < 2; i++){
        allMeshes.push(await utils.loadMesh(modelsDir + "red_palette/light_grey.obj"));
      }
      //bottom
      for(let i = 0; i < 9; i++){
        allMeshes.push(await utils.loadMesh(modelsDir + "red_palette/very_light_grey.obj"));
      }


      //2 upper lines
      for(let i = 0; i < 10; i++){
        allMeshes.push(await utils.loadMesh(modelsDir + "red_palette/darkest.obj"));
      }
      for(let i = 0; i < 10; i++){
        allMeshes.push(await utils.loadMesh(modelsDir + "red_palette/darkest.obj"));
      }
    }
}

window.onload = init;

function updateScreenText(){
    textScoreHandle.innerHTML = 
        '        Score   : ' + currentScore + '<br>\n' +
        '        Lives   : ' +  currentLives + '<br>';


    if(hasGameEnded)
    {
        gameOverDiv.style = "display: block"
        gameOverTextHandle.innerHTML =
            '        Game Over ' + '<br>\n' +
            '        Score   : ' + currentScore + '<br>\n' +
            '        Press enter to restart';
    }
    else
    {
        gameOverDiv.style = "display: none"
    }
}

