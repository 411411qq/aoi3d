module aoi {
    export class PlunginSimpleBase extends PlunginMainBase {
        
        constructor(precision:number) {
            super(precision);
            this._key = "";
            this.limitNum = 1;
            this.type = PlunginDefine.SIMPLE;
            this.txtIndex = 0;
            
        }
        
        public updateCode():void {
            this._vertexCode.push(new OpenGlCodeVo(0, this, this.genVertexCode1));
            this._vertexCode.push(new OpenGlCodeVo(30000, this, this.genVertexCode2));
            this._vertexCode.push(new OpenGlCodeVo(50000, this, this.genVertexCode3));
            this._vertexCode.push(new OpenGlCodeVo(70000, this, this.genVertexCode4));
            this._vertexCode.push(new OpenGlCodeVo(90000, this, this.genVertexCode5));

            this._fragmentCode.push(new OpenGlCodeVo(0, this, this.genFramentCode1));
            this._fragmentCode.push(new OpenGlCodeVo(30000, this, this.genFramentCode2));
            this._fragmentCode.push(new OpenGlCodeVo(50000, this, this.genFramentCode3));
        }

        private genVertexCode1():string {
            var str:string = 'attribute vec4 a_Position;\n' +
                'attribute vec2 a_TexCoord;\n' +
                'uniform mat4 u_MvpMatrix;\n' +
                'uniform vec4 u_Sampler_uv;\n' +
                'varying vec2 v_TexCoord;\n';
            return str;
        }

        private genVertexCode2():string {
            var str:string = 'void main() {\n' +
                'vec2 n_TexCoord = calUvOffset(a_TexCoord, u_Sampler_uv);\n' + 
                'vec4 n_Position = a_Position;\n';
            return str;
        }

        private genVertexCode3():string {
            var str:string = "";
            str += "vec4 endPos = u_MvpMatrix * n_Position;\n";
            str += "gl_Position = endPos;\n";
            return str;
        }

        public genVertexCode4() {
            var str = 'v_TexCoord = n_TexCoord;\n';
            return str;
        }

        private genVertexCode5():string {
            var str:string = '}\n';
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

        

        public getPrePlungin():Array<IPlunginVo>
        {
            var arr = new Array<IPlunginVo>();
            arr.push(new aoi.PlunginCaculateUV());
            arr.push(new aoi.PlunginDefaultTextureColor());
            return arr;
        }

        public getAttArr():Array<any> {
            var arr = [];
            arr.push({type: 1, name: "a_Position"});
            arr.push({type: 1, name: "a_TexCoord"});
            arr.push({type: 2, name: "u_MvpMatrix"});
            arr.push({type: 2, name: "u_Sampler"});
            arr.push({type: 2, name: "u_Sampler_uv"});
            return arr;
        }

        public genTextureIndex():void {
            this.txtIndex = this.pColloct.getTextureObj();
        }

        public active(gl:WebGLRenderingContext, subGeo:ISubGeometry, target:IRenderable, camera:ICamera, program:WebGLProgram, renderType:number):void {
            var buffer:WebGLBuffer = subGeo.getVertexBuffer(gl), FSIZE = subGeo.bytesPerEle, perLen = subGeo.vertexStride;
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            this.initAttributeVariable(gl, program["a_Position"], buffer, 3, FSIZE * perLen, 0);
            this.initAttributeVariable(gl, program["a_TexCoord"], buffer, 2, FSIZE * perLen, FSIZE * 3);

            gl.uniformMatrix4fv(program["u_MvpMatrix"], false, target.getFinalMatrix().elements);
        }

        public disactive(gl:WebGLRenderingContext, program:WebGLProgram):void {
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            gl.disableVertexAttribArray(program["a_Position"]);
            gl.disableVertexAttribArray(program["a_TexCoord"]);
        }
    }
}