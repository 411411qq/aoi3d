module aoi {
    /** 天空盒渲染 */
    export class PlunginSkyBox extends PlunginVoBase {
        constructor() {
            super();
            this.key = "skyBox";
            this.limitNum = 1;
            this.type = PlunginDefine.SKY_BOX;
            this.txtIndex = 0;
        }
        public updateCode(renderType:number):void 
        {
            this._vertexCode.push(new OpenGlCodeVo(0, this, this.genVertexCode1));
            this._vertexCode.push(new OpenGlCodeVo(30000, this, this.genVertexCode2));
            this._vertexCode.push(new OpenGlCodeVo(50000, this, this.genVertexCode3));
            this._vertexCode.push(new OpenGlCodeVo(70000, this, this.genVertexCode4));
            this._vertexCode.push(new OpenGlCodeVo(90000, this, this.genVertexCode5));

            this._fragmentCode.push(new OpenGlCodeVo(0, this, this.genFramentCode1));
            this._fragmentCode.push(new OpenGlCodeVo(30000, this, this.genFramentCode2));
            this._fragmentCode.push(new OpenGlCodeVo(50000, this, this.genFramentCode3));
            this._fragmentCode.push(new OpenGlCodeVo(70000, this, this.genFramentCode4));
            this._fragmentCode.push(new OpenGlCodeVo(90000, this, this.genFramentCode_normal));
        }
        public getAttArr():Array<any> {
            var arr = [];
            arr.push({type: 1, name: "a_Position"});
            arr.push({type: 2, name: "u_MvpMatrix"});
            arr.push({type: 2, name: "u_Sampler"});
            return arr;
        }
        public active(gl:WebGLRenderingContext, subGeo:ISubGeometry, target:IRenderable, camera:ICamera, program:WebGLProgram, renderType:number):void {
            var buffer:WebGLBuffer = subGeo.getVertexBuffer(gl), FSIZE = subGeo.bytesPerEle, perLen = subGeo.vertexStride;
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            this.initAttributeVariable(gl, program["a_Position"], buffer, 3, FSIZE * perLen, 0);

            gl.uniformMatrix4fv(program["u_MvpMatrix"], false, target.getFinalMatrix().elements);

            gl.activeTexture(gl["TEXTURE" + this.txtIndex]);
            gl.bindTexture(gl.TEXTURE_2D, target.material.getTextures(gl));
            gl.uniform1i(program["u_Sampler"], this.txtIndex);
        }
        public disactive(gl:WebGLRenderingContext, program:WebGLProgram):void { 
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            gl.disableVertexAttribArray(program["a_Position"]);
        }
        public genTextureIndex():void {
            this.txtIndex = this.pColloct.getTextureObj();
        }
        private genVertexCode1():string
        {
            var str:string = 'attribute vec3 a_Position;\n' +
                'uniform mat4 u_MvpMatrix;\n' +
                'varying vec2 v_TexCoord;\n';
            return str;
        }
        private genVertexCode2():string {
            var str:string = 'void main() {\n' +
                'vec2 n_TexCoord = vec2(a_Position.x + 1.0, 1.0 - a_Position.y) / 2.0;\n' + 
                'vec4 n_Position = vec4(a_Position,1.0);\n';
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
        private genFramentCode1():string {
            var str:string = '#ifdef GL_ES\n' +
                'precision mediump float;\n' +
                '#endif\n';
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
        private genFramentCode4():string {
            var str:string = "";
            str += 'vec4 outcolor = texture2D(u_Sampler, texCoord);\n';
            return str;
        }
        private genFramentCode_normal():string
        {
            var str:string = 'gl_FragColor = outcolor;\n';
            str += '}\n';
            return str;
        }
    }
}