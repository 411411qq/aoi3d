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
        public getPrePlungin():Array<IPlunginVo>
        {
            var arr = new Array<IPlunginVo>();
            arr.push(new aoi.PlunginDefaultTextureColor());
            return arr;
        }
        public getAttArr():Array<any> {
            var arr = [];
            arr.push({type: 1, name: "a_Position"});
            arr.push({type: 2, name: "u_Sampler"});
            return arr;
        }
        public active(gl:WebGLRenderingContext, subGeo:ISubGeometry, target:IRenderable, camera:ICamera, program:WebGLProgram, renderType:number):void {
            super.active(gl, subGeo, target, camera, program, renderType);
             var buffer:WebGLBuffer = subGeo.getVertexBuffer(gl), FSIZE = subGeo.bytesPerEle, perLen = subGeo.vertexStride;
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            this.initAttributeVariable(gl, program["a_Position"], buffer, 3, FSIZE * perLen, 0);

            gl.activeTexture(gl["TEXTURE" + this.txtIndex]);
            gl.bindTexture(gl.TEXTURE_2D, target.material.getTextures(gl));
            gl.uniform1i(program["u_Sampler"], this.txtIndex);
        }
        public updateCode():void {
            this._vertexCode.push(new OpenGlCodeVo(0, this, this.genVertexCode1));

            this._fragmentCode.push(new OpenGlCodeVo(0, this, this.genFramentCode1));
            this._fragmentCode.push(new OpenGlCodeVo(30000, this, this.genFramentCode2));
            this._fragmentCode.push(new OpenGlCodeVo(50000, this, this.genFramentCode3));
            this._fragmentCode.push(new OpenGlCodeVo(90000, this, this.genFramentCode_normal));
        }
        public disactive(gl:WebGLRenderingContext, program:WebGLProgram):void {
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            gl.disableVertexAttribArray(program["a_Position"]);
        }
        private genVertexCode1():string
        {
            let str:string = "";
            str += 'attribute vec4 a_Position;\n';
            str += "varying vec2 v_TexCoord;\n";
            str += "void main() {\n";
            str += "v_TexCoord = a_Position.xy * 0.5 + 0.5;\n";
            str += "gl_Position = vec4(a_Position.xyz, 1.0);\n";
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