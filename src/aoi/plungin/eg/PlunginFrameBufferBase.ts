module aoi {
    export class PlunginFrameBufferBase extends PlunginMainBase {
        constructor(precision:number = 2) {
            super(precision);
            this._key = "fbb";
            this.type = PlunginDefine.FRAMEOBJEC_BASE;
            this.limitNum = 1;
            this.txtIndex = 0;
            this._replaceType = PlunginDefine.REPLACE_MAIN;
            this._replaceWeight = 3;
        }
        public active(gl:WebGLRenderingContext, subGeo:ISubGeometry, target:IRenderable, camera:ICamera, program:WebGLProgram, renderType:number):void {
            super.active(gl, subGeo, target, camera, program, renderType);
            
        }
        public updateCode():void {
            this._vertexCode.push(new OpenGlCodeVo(0, this, this.genVertexCode1));

            this._fragmentCode.push(new OpenGlCodeVo(0, this, this.genFramentCode1));
            this._fragmentCode.push(new OpenGlCodeVo(30000, this, this.genFramentCode2));
            this._fragmentCode.push(new OpenGlCodeVo(50000, this, this.genFramentCode3));
            this._fragmentCode.push(new OpenGlCodeVo(90000, this, this.genFramentCode_normal));
        }
        private genVertexCode1():string
        {
            let str:string = "";
            str += "varying vec2 v_TexCoord;\n";
            str += "void main() {\n";
            str += "v_TexCoord = gl_Vertex.xy * 0.5 + 0.5;\n";
            str += "gl_Position = vec4(gl_Vertex.xyz, 1.0);\n";
            str += "}\n";
            return str;
        }
        private genFramentCode2():string {
            var str:string = 'varying vec2 v_TexCoord;\n' +
                'uniform sampler2D u_Sampler;\n';
            return str;
        }
        private genFramentCode3():string {
            var str:string = 'void main() {\n';
            str += "vec2 texCoord = v_TexCoord;\n";
            return str;
        }
        private genFramentCode_normal():string
        {
            var str:string = "float mv = max(outcolor.x, outcolor.y);\n";
            str += "mv = max(mv, outcolor.z);\n";
            str += "if(mv > 1.0){\n";
            str += "outcolor.xyz = outcolor.xyz / mv;\n";
            str += "}\n";
            str += 'gl_FragColor = outcolor;\n';
            str += '}\n';
            return str;
        }
    }
}