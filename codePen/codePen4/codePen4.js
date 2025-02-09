const vertexShaderSrc = `
    attribute vec2 aPosition;
    varying vec2 vUv;
    void main() {
      vUv = aPosition * 0.5 + 0.5;
      gl_Position = vec4(aPosition, 0.0, 1.0);
    }
  `;

const fragmentShaderSrc = `
    precision highp float;
    uniform float uTime;
    uniform vec2 uResolution;
    uniform float uIsColorOn;
    varying vec2 vUv;

    //added click interactivity
    uniform vec2 uMouse;
    uniform float uClickTime;
    uniform vec2 uClickPosition;

    vec2 fn(vec2 uv, float t) {
      float x = uv.x;
      float y = uv.y;
      float sx = sin(x * 2.0);
      float sy = sin(y * 2.0);
      float xx = x * x;
      float yy = y * y;
      float xOut = sin(t + cos(sx) + t) + (sin(xx * yy) + sin(t / (yy + 0.1) / 3.0) / 64.0);
      float yOut = tan((xx + yy) - sin(x)) / 32.0 + tan(cos(sy + t));
      return clamp(vec2(xOut, yOut), -10.0, 10.0);
    }

    void main() {
      vec2 uv = vUv * 8.0 - 4.0;
      uv.y *= uResolution.y / uResolution.x;
      float t = sin(uTime / 16.0) * 8.0;

      //add ripple effect on click
      float timeSinceClick = uClickTime;
      vec2 clickPos = (uClickPosition * 2.0 - 1.0) * vec2(8.0);
      clickPos.y *= uResolution.y/uResolution.x;

      float distanceToClick = length(uv-clickPos);
      float rippleWave = sin(distanceToClick * 4.0 - timeSinceClick * 8.0) * exp(-timeSinceClick * 2.0);

      vec2 result = fn(uv, t);
      float dist = length(result) + rippleWave * 0.5;

      //CLAMP
      dist = clamp(dist, -2.0, 2.0);

      float G = 0.5 - 0.5 * sin((dist) * t);
      float R = sin(t * (G - 1.5));
      float B = cos(dist * t);
      float K = 0.5 + 0.5 * sin(sqrt(abs(dist)) * t + rippleWave);

      R = clamp((R + 3.0) / 2.0 - 0.5, 0.0, 1.0);
      G = clamp((G + 3.0) / 4.0, 0.0, 1.0);
      B = clamp(sqrt((B + 1.0) / 4.0), 0.0, 1.0);

      vec3 mixed = mix(vec3(K), vec3(R, G, B), uIsColorOn);
      gl_FragColor = vec4(mixed, 1.0);
    }
  `;

const canvas = document.querySelector("canvas");
const gl = canvas.getContext("webgl");

const createShader = (type, source) => {
	const shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		console.error(gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
		return null;
	}
	return shader;
};

const program = gl.createProgram();
const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSrc);
const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSrc);

gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
	console.error(gl.getProgramInfoLog(program));
	gl.deleteProgram(program);
}

const aPosition = gl.getAttribLocation(program, "aPosition");
const uTime = gl.getUniformLocation(program, "uTime");
const uResolution = gl.getUniformLocation(program, "uResolution");
const uIsColorOn = gl.getUniformLocation(program, "uIsColorOn");

//for click interactivity
const uMouse = gl.getUniformLocation(program, "uMouse");
const uClickTime = gl.getUniformLocation(program, "uClickTime");
const uClickPosition = gl.getUniformLocation(program, "uClickPosition");

let lastClickTime = 0;
canvas.addEventListener("mousemove", (event) => {
    const x = event.clientX/canvas.width;
    const y = 1.0 - (event.clientY/canvas.height);
    gl.uniform2f(uMouse, x, y);
});

let currentTime = 0;
canvas.addEventListener("click", (event) => {
    lastClickTime = currentTime;
    const x = event.clientX/canvas.width;
    const y = 1.0 - (event.clientY/canvas.height);
    gl.uniform2f(uClickPosition, x, y);
});
//end added code

const quadVertices = new Float32Array([
	-1,
	-1,
	1,
	-1,
	-1,
	1,
	-1,
	1,
	1,
	-1,
	1,
	1
]);

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW);

gl.viewport(0, 0, canvas.width, canvas.height);
gl.useProgram(program);
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.enableVertexAttribArray(aPosition);
gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

let colorMode = 1;

window.addEventListener("keydown", (event) => {
	if (event.code === "Space") {
		colorMode = (colorMode + 1) % 3;
	}
});

const resizeCanvas = () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
};

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const render = (time) => {
	time *= 0.001;
    currentTime = time;
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.uniform1f(uTime, time);
	gl.uniform2f(uResolution, canvas.width, canvas.height);
	let colorValue =
		colorMode === 0 ? 0 : colorMode === 1 ? 1 : (1 + Math.sin(time / 3)) / 2;
	gl.uniform1f(uIsColorOn, colorValue);
    //for clicking interactivity
    gl.uniform1f(uClickTime, time - lastClickTime);
    //end added code
	gl.drawArrays(gl.TRIANGLES, 0, 6);
	requestAnimationFrame(render);
};

requestAnimationFrame(render);
