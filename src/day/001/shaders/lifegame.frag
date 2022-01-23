// "uniform vec2 resolution" is automatically added by GPUComputationRenderer as texture size
uniform vec2 planeSize;
vec2 textureSize = resolution;

bool isInPosCoordRange(in vec2 texCoord) {
  float v = texCoord.x + texCoord.y * textureSize.x;
  return v <= (planeSize.x * planeSize.y);
}

float div(in float a, in float b) {
  return floor(a / b);
}

float modulo(in float a, in float b) {
  return a - floor(a / b) * b;
}

vec2 convertFromTexCoordToPosCoord(in vec2 texCoord) {
  float idx = texCoord.x + texCoord.y * textureSize.x;
  return vec2(modulo(idx, planeSize.x), div(idx, planeSize.x));
}

vec2 convertFromPosCoordToTexCoord(in vec2 posCoord) {
  float idx = posCoord.x + posCoord.y * planeSize.x;
  return vec2(modulo(idx, textureSize.x), div(idx, textureSize.x));
}

int status(in vec2 offset) {
  vec2 posCoord = convertFromTexCoordToPosCoord(floor(gl_FragCoord.xy)) + offset;

  // boundary condition
  posCoord.x = posCoord.x < 0.0 ? planeSize.x - 1.0 : posCoord.x;
  posCoord.x = posCoord.x > planeSize.x ? 0.0 : posCoord.x;
  posCoord.y = posCoord.y < 0.0 ? planeSize.y - 1.0 : posCoord.y;
  posCoord.y = posCoord.y > planeSize.y ? 0.0 : posCoord.y;

  vec2 texCoord = convertFromPosCoordToTexCoord(posCoord) + fract(gl_FragCoord.xy);
  return int(texture2D(textureLifeGame, texCoord / textureSize.xy).x);
}

void main() {
  // checks whether current position is used or not
  if (!isInPosCoordRange(floor(gl_FragCoord.xy))) {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
    return;
  }

  int center = status(vec2(0.0, 0.0));
  int neighbor = 0;
  neighbor += status(vec2(-1.0, 1.0));
  neighbor += status(vec2(0.0, 1.0));
  neighbor += status(vec2(1.0, 1.0));
  neighbor += status(vec2(-1.0, 0.0));
  neighbor += status(vec2(1.0, 0.0));
  neighbor += status(vec2(-1.0, -1.0));
  neighbor += status(vec2(0.0, -1.0));
  neighbor += status(vec2(1.0, -1.0));

  // x == 1 means cell is alive and x == 0 means cell is dead
  gl_FragColor = ((center == 1 && (neighbor == 2 || neighbor == 3)) || (center == 0 && neighbor == 3)) ?
    vec4(1.0, 0.0, 0.0, 0.0) : vec4(0.0);
}