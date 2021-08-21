#version 300 es

precision mediump float;

in vec3 inPosition;
in vec3 inNormal;
in vec2 in_uv;

out vec3 fsNormal;
out vec2 fsUV;
out vec3 fs_pos; 

uniform mat4 matrix; //worldViewProjection matrix to draw objects
uniform mat4 nMatrix; //matrix to transform normals
uniform mat4 pMatrix; //matrix to transform positions

void main() {
  fsUV = in_uv;
  fs_pos = (pMatrix * vec4(inPosition, 1.0)).xyz;
  fsNormal = mat3(nMatrix) * inNormal;
  //fsNormal = (nMatrix * vec4(inNormal, 0.0)).xyz;

  gl_Position = matrix * vec4(inPosition, 1.0);
}