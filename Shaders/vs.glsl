#version 300 es

in vec3 inPosition;
in vec3 inNormal;
in vec2 in_uv;

uniform mat4 matrix;

void main() {
  gl_positions = matrix * vec4(inPosition, 1.0);
}