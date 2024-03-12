const vertexShaderSource = `#version 300 es
in vec4 a_position;
in vec3 a_normal;
in vec3 a_tangent;
in vec2 a_texcoord;
in vec4 a_color;

uniform mat4 u_projection;
uniform mat4 u_view;
uniform mat4 u_world;
uniform vec3 u_viewWorldPosition;
uniform vec3 u_lightsPositions[5];

out vec3 v_tangent;
out vec3 v_surfaceToView;
out vec2 v_texcoord;
out vec4 v_color;
out vec3 v_normal;
out vec3 v_surfaceToLight[5];


void main() {
  vec4 worldPosition = u_world * a_position;
  gl_Position = u_projection * u_view * worldPosition;

  vec3 surfaceWorldPosition = (u_world * a_position).xyz;
  v_surfaceToView = u_viewWorldPosition - surfaceWorldPosition;

  for (int i = 0; i < 5; i++) {
    v_surfaceToLight[i] = u_lightsPositions[i] - surfaceWorldPosition;
  }

  mat3 normalMat = mat3(u_world);
  v_normal = normalize(normalMat * a_normal);
  v_tangent = normalize(normalMat * a_tangent);

  v_texcoord = a_texcoord;
  v_color = a_color;
}
`;

const fragmentShaderSource = `#version 300 es
  precision highp float;

  in vec3 v_normal;
  in vec3 v_surfaceToLight[5];
  in vec3 v_tangent;
  in vec3 v_surfaceToView;
  in vec2 v_texcoord;
  in vec4 v_color;
  
  uniform vec3 diffuse;
  uniform sampler2D diffuseMap;
  uniform vec3 ambient;
  uniform vec3 emissive;
  uniform vec3 specular;
  uniform sampler2D specularMap;
  uniform float shininess;
  uniform sampler2D normalMap;
  uniform float opacity;
  uniform vec3 u_lightDirection;
  uniform vec3 u_ambientLight;
  uniform float shading;
  
  uniform vec3 u_lightsColors[5];

  out vec4 outColor;

  void main () {
    vec3 normal = normalize(v_normal) * ( float( gl_FrontFacing ) * 2.0 - 1.0 );
    vec3 tangent = normalize(v_tangent) * ( float( gl_FrontFacing ) * 2.0 - 1.0 );
    vec3 bitangent = normalize(cross(normal, tangent));

    mat3 tbn = mat3(tangent, bitangent, normal);
    normal = texture(normalMap, v_texcoord).rgb * 2. - 1.;
    normal = normalize(tbn * normal);

    vec4 totalLight = vec4(0.0);
    vec3 surfaceToViewDirection = normalize(v_surfaceToView);
    
    for (int i = 0; i < 5; i++) {
      vec3 surfaceToLightDirection = normalize(v_surfaceToLight[i]);
      vec3 halfVector = normalize(surfaceToLightDirection + surfaceToViewDirection);

      float fakeLight = dot(surfaceToLightDirection, normal);
      float specularLight = clamp(dot(normal, halfVector), 0.0, 1.0);
      vec4 specularMapColor = texture(specularMap, v_texcoord);
      vec3 effectiveSpecular = specular * specularMapColor.rgb;

      vec4 diffuseMapColor = texture(diffuseMap, v_texcoord);
      vec3 effectiveDiffuse = diffuse * diffuseMapColor.rgb * v_color.rgb;
      float effectiveOpacity = opacity * diffuseMapColor.a * v_color.a;

      totalLight += vec4(
          emissive + ambient * u_ambientLight +
          effectiveDiffuse * fakeLight +
          effectiveSpecular * pow(specularLight, shininess),
          effectiveOpacity);
    };
    outColor = totalLight;
  }
  `;

const modelsAvailable = [
	'Barrel',
	'Chest',
	'Spinningwheel',
	'Clock'
];

const initializeWorld = () => {
	const canvas = document.querySelector('#canvas');
	const gl = canvas.getContext('webgl2');
	if (!gl) {
		return;
	}
	twgl.setAttributePrefix('a_');
	const meshProgramInfo = twgl.createProgramInfo(gl, [vertexShaderSource, fragmentShaderSource,]);

	return {
		gl,
		meshProgramInfo,
	};
};
