//*****************************************************VARIABLES*********************************************************************************

//relevant paths to resources
var program;
var gl;
var canvas;

var baseDir;
var shaderDir;
var modelsDir;

//meshes
var ballMesh;
var paddleMesh;
var blockMesh;
var WallMesh;

//meshes list
var allMeshes = null;

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
var textureHandle;

//********************************************************************************************************************************************
function main(){
  gl.clearColor(1.0, 1.0, 1.0, 1.0); //flipper --> 0.85, 0.85, 0.85, 1.0
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


  positionAttributeLocation = gl.getAttribLocation(program, "inPosition");
  normalAttributeLocation = gl.getAttribLocation(program, "inNormal");
  uvAttributeLocation = gl.getAttribLocation(program, "in_uv");
  
  matrixLocation = gl.getUniformLocation(program, "matrix");
  normalMatrixPositionHandle = gl.getUniformLocation(program, "nMatrix");
  vertexMatrixPositionHandle = gl.getUniformLocation(program, "pMatrix");
  
  textureHandle = gl.getUniformLocation(program, "in_texture");

  var perspectiveMatrix = utils.MakePerspective(90, gl.canvas.width / gl.canvas.height, 0.1, 100.0);
  var vaos = new Array(allMeshes.length);

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
    
    var viewMatrix = utils.MakeView(0.0, 0.0, 2.0, 0.0, 0.0);
    var worldMatrix = utils.MakeWorld(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0);
    
    //pass uniforms to fs here

    // add each mesh / object with its world matrix
    for (var i = 0; i < allMeshes.length; i++) {
      var worldViewMatrix = utils.multiplyMatrices(viewMatrix, worldMatrix);
      var projectionMatrix = utils.multiplyMatrices(perspectiveMatrix, worldViewMatrix);  

      // matrix to transform normals in world shading space, used by the Vertex Shader
      var normalTransformationMatrix = utils.invertMatrix(utils.transposeMatrix(worldMatrix)); 

      gl.uniformMatrix4fv(matrixLocation, gl.FALSE, utils.transposeMatrix(projectionMatrix));
      gl.uniformMatrix4fv(vertexMatrixPositionHandle, gl.FALSE, utils.transposeMatrix(worldMatrix));
      gl.uniformMatrix4fv(normalMatrixPositionHandle, gl.FALSE, utils.transposeMatrix(normalTransformationMatrix));
      
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(textureHandle, 0);


      gl.bindVertexArray(vaos[i]);
      gl.drawElements(gl.TRIANGLES, allMeshes[i].indices.length, gl.UNSIGNED_SHORT, 0);
    }
    
    window.requestAnimationFrame(drawScene);


  }

  drawScene();
}

async function init(){
    setupCanvas();
    await loadShaders();
    await loadMeshes();
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
      ballMesh = await utils.loadMesh((modelsDir + "whiteBall.obj"));
    
      allMeshes = [ballMesh];
    }

    //if utils.loadMesh not working
    async function loadMesh(path){
      let str = await utils.get_objstr(path);
      let mesh = new OBJ.Mesh(str);

      return mesh;
    }

}

window.onload = init;



