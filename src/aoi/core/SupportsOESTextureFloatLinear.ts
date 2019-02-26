
module aoi {
    export class SupportsOESTextureFloatLinear
    {
        public init(gl:WebGLRenderingContext):void
        {
            function OESTextureFloatLinear() {
            }
            function getExtension(name) 
            {
                return name === 'OES_texture_float_linear'
                ? getOESTextureFloatLinear(this)
                : oldGetExtension.call(this, name);
            }
            function getSupportedExtensions() {
                var extensions = oldGetSupportedExtensions.call(this);
                if (extensions.indexOf('OES_texture_float_linear') === -1) {
                extensions.push('OES_texture_float_linear');
                }
                return extensions;
            }
            function getOESTextureFloatLinear(gl) {
                if (gl.$OES_texture_float_linear$ === void 0) {
                Object.defineProperty(gl, '$OES_texture_float_linear$', {
                    enumerable: false,
                    configurable: false,
                    writable: false,
                    value: new OESTextureFloatLinear()
                });
                }
                return gl.$OES_texture_float_linear$;
            }
            if (!gl || gl.getSupportedExtensions().indexOf('OES_texture_float_linear') !== -1) 
            {
                return;
            }
            if (this.supportsOESTextureFloatLinear(gl)) 
            {
                var oldGetExtension = WebGLRenderingContext.prototype.getExtension;
                var oldGetSupportedExtensions = WebGLRenderingContext.prototype.getSupportedExtensions;
                WebGLRenderingContext.prototype.getExtension = getExtension;
                WebGLRenderingContext.prototype.getSupportedExtensions = getSupportedExtensions;
            }
        }
        
        public supportsOESTextureFloatLinear(gl:WebGLRenderingContext):boolean
        {
            if (!gl.getExtension('OES_texture_float')) 
            {
                return false;
            }
            var framebuffer:WebGLFramebuffer = gl.createFramebuffer();
            var byteTexture:WebGLTexture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, byteTexture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, byteTexture, 0);

            var rgba = [
            2, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0
            ];
            var floatTexture:WebGLTexture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, floatTexture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 2, 2, 0, gl.RGBA, gl.FLOAT, new Float32Array(rgba));

            var program:WebGLProgram = gl.createProgram();
            var vertexShader:WebGLShader = gl.createShader(gl.VERTEX_SHADER);
            var fragmentShader:WebGLShader = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(vertexShader, '\
            attribute vec2 vertex;\
            void main() {\
                gl_Position = vec4(vertex, 0.0, 1.0);\
            }\
            ');
            gl.shaderSource(fragmentShader, '\
            uniform sampler2D texture;\
            void main() {\
                gl_FragColor = texture2D(texture, vec2(0.5));\
            }\
            ');
            gl.compileShader(vertexShader);
            gl.compileShader(fragmentShader);
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);

            var buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0]), gl.STREAM_DRAW);
            gl.enableVertexAttribArray(0);
            gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

            // Render the point and read back the rendered pixel
            var pixel = new Uint8Array(4);
            gl.useProgram(program);
            gl.viewport(0, 0, 1, 1);
            gl.bindTexture(gl.TEXTURE_2D, floatTexture);
            gl.drawArrays(gl.POINTS, 0, 1);
            gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);

            return pixel[0] === 127 || pixel[0] === 128;
        }
    }
}