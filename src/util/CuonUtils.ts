module aoi
{
    export class CuonUtils {
        static createProgram(gl:WebGLRenderingContext, vshader:string, fshader:string):WebGLProgram {
            var vertexShader:WebGLShader = CuonUtils.loadShader(gl, gl.VERTEX_SHADER, vshader);
            var fragmentShader:WebGLShader = CuonUtils.loadShader(gl, gl.FRAGMENT_SHADER, fshader);
            if (!vertexShader || !fragmentShader) {
                return null;
            }
            var program:WebGLProgram = gl.createProgram();
            if (!program) {
                return null;
            }
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);
            var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
            if (!linked) {
                var error = gl.getProgramInfoLog(program);
                console.log('Failed to link program: ' + error);
                gl.deleteProgram(program);
                gl.deleteShader(fragmentShader);
                gl.deleteShader(vertexShader);
                return null;
            }
            return program;
        }

        static loadShader(gl:WebGLRenderingContext, type:number, source:string):WebGLShader {
            var shader = gl.createShader(type);
            if (shader == null) {
                console.log('unable to create shader');
                return null;
            }
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
            if (!compiled) {
                var error:string = gl.getShaderInfoLog(shader);
                console.log("source:"+source);
                console.log('Failed to compile shader: ' + error);
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        }

        static getWebGLContext(canvas:HTMLCanvasElement, opt_attribs):WebGLRenderingContext {
            var context = CuonUtils.create3DContext(canvas, opt_attribs);
            return context;
        }

        static create3DContext(canvas:HTMLCanvasElement, opt_attribs):WebGLRenderingContext {
            var names:Array<string> = ["webgl2","webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
            var context:WebGLRenderingContext = null;
            for (var ii:number = 0; ii < names.length; ++ii) {
                try {
                    context = canvas.getContext(names[ii], opt_attribs) as WebGLRenderingContext;
                } catch (e) {
                }
                if (context) {
                    break;
                }
            }
            return context;
        }
    }
}