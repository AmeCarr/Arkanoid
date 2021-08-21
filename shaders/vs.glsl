#version 300 es

precision mediump float;

in vec3 inPosition;
in vec3 inNormal;

out vec3 fsNormal;

uniform mat4 matrix; //worldViewProjection matrix to draw objects
uniform mat4 nMatrix; //matrix to transform normals


void main() {
  fsNormal = mat3(nMatrix) * inNormal;
  //fsNormal = (nMatrix * vec4(inNormal, 0.0)).xyz;

  gl_Position = matrix * vec4(inPosition, 1.0);
}