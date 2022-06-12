const vertex = `
  varying float camVNormal;
    
  void main() {
    vec3 dunno = (modelMatrix * vec4( position, 1.0 )).xyz;
    camVNormal = abs(dot(normalize(dunno - cameraPosition), normal));
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }
`

const fragment = `
  uniform float opacityFactor;
  varying float camVNormal;

  vec3 rgb(int r, int g, int b) {
    return vec3(float(r), float(g), float(b)) / 255.0;
  }

  vec3 colors[5];

  vec3 linearGradient(float factor) {
    int numSections = colors.length() - 1;
    float frac = 1.0 / float(numSections);

    for(int i = 0; i < numSections; i+=1) {
      float minn = frac * float(i);
      float maxx = minn + frac;
      if(factor > minn && factor < maxx) {
        float sectionFactor = (factor - minn) / (maxx - minn);
        return mix(colors[i], colors[i + 1], sectionFactor);
      }
    }
    return vec3(1.0, 0.0, 1.0);
  }

  void main() {
    colors[0] = rgb(0, 0, 226);
    colors[1] = rgb(250, 250, 250);
    colors[2] = rgb(250, 250, 250);
    colors[3] = rgb(250, 250, 250);
    colors[4] = rgb(250, 250, 250);
    
    float alpha = 1.0 - pow(1.0 - (camVNormal * 1.2 - 0.2), 2.0);

    gl_FragColor = vec4(linearGradient(alpha), alpha * opacityFactor);
  }
`

export { vertex, fragment }