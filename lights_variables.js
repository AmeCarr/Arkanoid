
// directional light
var directionalLightAlpha;
var directionalLightBeta;
var directionalLightDirection;

//point light
var pointLight_x;
var pointLight_y;
var pointLight_z;
//*************************************************************************************************************
//direct or point light
var lightType;

//0,0 --> none 
//1,0--> lambert
//0,1 -->toon
var diffuseType;

//specular type
var specularType;

var ambientMaterialColor = [1.0 , 1.0, 1.0]; //white by default

var lightDecay = 0.5;
var lightTarget = 1.0;

var lightPosition = [0.0 , 0.0 , 0.0]; // the position of the point light

var lightDirection = [-1.0, 1.0, 1.0]; // the direction of the direct light

var specularColor = [0.4, 0.4, 0.4];

var diffuseColor = [0.6, 0.6, 0.6];

var specShine = 0.7;

var DToonTh = 0.8;

var SToonTh = 0.2;

var lightColor = [1.0, 1.0, 1.0];