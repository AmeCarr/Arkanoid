//relevant paths to resources
var program;
var baseDir;
var shaderDir;
var modelsDir;

//MESHES
var ballMesh;

var allMeshes;

function main(){
  gl.clearColor(0.85, 0.85, 0.85, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST); 

  var positionAttributeLocation = gl.getAttribLocation(program, "inPosition");
  var normalAttributeLocation = gl.getAttribLocation(program, "inNormal");
  var uvAttributeLocation = gl.getAttribLocation(program, "in_uv");
  
  var matrixLocation = gl.getUniformLocation(program, "matrix");
  


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
    // clear scene
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 
    
    var viewMatrix = utils.MakeView(2.0, 0.0, 0.0, 0.0, 0.0);
    var worldMatrix = utils.MakeWorld(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0);
    

    // add each mesh / object with its world matrix
    for (var i = 0; i < allMeshes.length; i++) {
      var worldViewMatrix = utils.multiplyMatrices(viewMatrix, worldMatrix);
      var projectionMatrix = utils.multiplyMatrices(perspectiveMatrix, worldViewMatrix);  

      // matrix to transform normals, used by the Vertex Shader
      //var normalTransformationMatrix = utils.invertMatrix(utils.transposeMatrix(worldViewMatrix));

      gl.uniformMatrix4fv(matrixLocation, gl.FALSE, utils.transposeMatrix(projectionMatrix));
      //gl.uniformMatrix4fv(normalMatrixPositionHandle, gl.FALSE, utils.transposeMatrix(normalTransformationMatrix));
      
      //gl.uniformMatrix4fv(worldViewMatrixPositionHandle, gl.FALSE, utils.transposeMatrix(worldViewMatrix));
      

      gl.bindVertexArray(vaos[i]);
      gl.drawElements(gl.TRIANGLES, allMeshes[i].indices.length, gl.UNSIGNED_SHORT, 0);
    }
    
    window.requestAnimationFrame(drawScene);


  }

  drawScene();
}

async function init(){
  setupCanvas();
  loadShaders();
  await loadMeshes();
  main ();


// prepare canvas and body styles
  function setupCanvas(){
    var canvas = document.getElementById("canvas");
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
    console.log(baseDir);

    shaderDir = baseDir + "shaders/";
    
    modelsDir = baseDir + "models/";

    // load vertex and fragment shaders from file
    await utils.loadFiles([shaderDir + 'vs.glsl', shaderDir + 'fs.glsl'], function (shaderText) {
      var vertexShader = utils.createShader(gl, gl.VERTEX_SHADER, shaderText[0]);
      var fragmentShader = utils.createShader(gl, gl.FRAGMENT_SHADER, shaderText[1]);
      program = utils.createProgram(gl, vertexShader, fragmentShader);

    });
    gl.useProgram(program);
  }

  async function loadMeshes(){
    ballMesh = await utils.loadMesh(modelsDir + "ball.obj");
  
    allMeshes = [ballMesh];
  }

}

window.onload = init;



