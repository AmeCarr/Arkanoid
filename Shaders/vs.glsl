#version 300 es

precision mediump float;

in vec3 inPosition;
in vec3 inNormal;

uniform mat4 matrix; //worldViewProjection matrix to draw objects
uniform mat4 nMatrix; //matrix to transform normals

out vec3 fsNormal;

void main() {
  fsNormal = mat3(nMatrix) * inNormal;

  gl_Position = matrix * vec4(inPosition, 1.0);
}