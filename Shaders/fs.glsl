#version 300 es

precision mediump float;

in vec3 fsNormal;

out vec4 outColor;

void main() {
  //normalize fsNormal, it might not be in the normalized form coming from the vs
  vec3 nNormal = normalize(fsNormal);

  outColor = vec4(1.0, 0.0, 0.0, 1.0);
}