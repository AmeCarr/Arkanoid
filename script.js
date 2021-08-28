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

var perspectiveMatrix;
var vaos;

//********************************************************************************************************************************************
function main(){
  gl.clearColor(0.85, 0.85, 0.85, 1.0); //flipper --> 0.85, 0.85, 0.85, 1.0
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);

  
  // get texture, send in buffer
    texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    image.src = baseDir + "textures/16colors_palette.png";
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

  perspectiveMatrix = utils.MakePerspective(45, gl.canvas.width / gl.canvas.height, 1, 100 );
  //perspectiveMatrix = utils.MakeOrthogonal(gl.canvas.width/45, gl.canvas.width / gl.canvas.height, 1, 100);
  //perspectiveMatrix = utils.MakePerspective(90, gl.canvas.width / gl.canvas.height, 0.1, 100 );
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
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 


    //TODO************************************************************
    //update game state, animations
    updateGameState();

    updateMatrices();
    //*************************************************************************
    
    cz = lookRadius * Math.cos(utils.degToRad(-angle)) * Math.cos(utils.degToRad(-elevation));
    cx = lookRadius * Math.sin(utils.degToRad(-angle)) * Math.cos(utils.degToRad(-elevation));
    cy = lookRadius * Math.sin(utils.degToRad(-elevation)); 
    var viewMatrix = utils.MakeView(cx, cy, cz, elevation, angle);//TODO

    //pass uniforms to fs here TODO

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

    initializeGame();    
    main ();

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
      //ball: 2x2x2
      //paddle: 1 altezza 2 spessore 6 lunghezza
      //brick: 1 altezza 2 spessore 4 lunghezza
      //wall lateral: 35 altezza 2 spessore 2 lunghezza
      //wall upper: 2 altezza 2 spessore 63 lunghezza

      ballMesh = await utils.loadMesh((modelsDir + "ball_whiteSkin.obj"));
      paddleMesh = await utils.loadMesh((modelsDir + "paddle_blueSkin.obj"));
      wallMeshLeft = await utils.loadMesh((modelsDir + "wall_lateral_brownSkin.obj"));
      wallMeshRight = await utils.loadMesh((modelsDir + "wall_lateral_brownSkin.obj"));
      wallMeshUp = await utils.loadMesh((modelsDir + "wall_upper_brownSkin.obj"))

      allMeshes = [ballMesh,paddleMesh, wallMeshLeft, wallMeshRight, wallMeshUp];

      // load bricks
      for(let i = 0; i < 13; i++)
          allMeshes.push(await utils.loadMesh(modelsDir + "brick_yellowSkin.obj"))
      for(let i = 0; i < 13; i++)
          allMeshes.push(await utils.loadMesh(modelsDir + "brick_orangeSkin.obj"))
      for(let i = 0; i < 13; i++)
          allMeshes.push(await utils.loadMesh(modelsDir + "brick_redSkin.obj"))
    }

}

window.onload = init;



