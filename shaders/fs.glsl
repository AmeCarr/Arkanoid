#version 300 es

precision mediump float;

in vec3 fsNormal;
in vec3 fs_pos;
in vec2 fsUV;

out vec4 outColor;

void main() {
  //normalize fsNormal, it might not be in the normalized form coming from the vs
  vec3 nNormal = normalize(fsNormal);

  outColor = vec4(1.0, 0.0, 0.0, 1.0);
}