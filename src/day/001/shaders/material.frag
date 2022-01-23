uniform sampler2D textureLifeGame;
uniform vec2 planeSize;
uniform vec2 textureSize;
varying vec2 vUv;

float div(in float a, in float b) {
  return floor(a / b);
}

float modulo(in float a, in float b) {
  return a - floor(a / b) * b;
}

vec2 convertFromPosCoordToTexCoord(in vec2 posCoord) {
  float idx = posCoord.x + posCoord.y * planeSize.x;
  return vec2(modulo(idx, textureSize.x), div(idx, textureSize.x));
}

void main() {
  vec2 posCoord = vUv * planeSize;
  vec2 texCoord = convertFromPosCoordToTexCoord(floor(posCoord));
  float v = texture2D(textureLifeGame, texCoord / textureSize).x;
  // alive cells are filled with green and dead ones with black
  gl_FragColor = vec4(v > 0.5 ? vec3(0.0, 1.0, 0.0) : vec3(0.0, 0.0, 0.0), 1.0);
}
