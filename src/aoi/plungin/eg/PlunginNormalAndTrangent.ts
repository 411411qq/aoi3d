module aoi {
    /** 模型的顶点法线和顶点切线 */
    export class PlunginNormalAndTrangent extends PlunginVoBase
    {
        constructor() {
            super();
            this._key = "n_t";
            this.type = PlunginDefine.NOR_AND_TAN;
            this.limitNum = 1;
        }
        public getPrePlungin():Array<IPlunginVo>
        {
            var arr = new Array<IPlunginVo>();
            arr.push(new aoi.PlunginModelMatrix());
            return arr;
        }
        public updateCode():void {
            this._vertexCode.push(new OpenGlCodeVo(10, this, this.genVertexCode1));
            this._vertexCode.push(new OpenGlCodeVo(35001, this, this.genVertexCode2));
            this._vertexCode.push(new OpenGlCodeVo(70001, this, this.genVertexCode3));

            this._fragmentCode.push(new OpenGlCodeVo(30001, this, this.genFramentCode1));
            this._fragmentCode.push(new OpenGlCodeVo(70100, this, this.genFramentCode2));
        }
        private genVertexCode1():string {
            var str:string = 'attribute vec3 a_normal;\n' +
                'attribute vec3 a_trangent;\n' +
                'varying vec3 v_normal;\n' + 
                'varying vec3 v_trangent;\n' +
                'varying vec3 v_bitangent;\n';
            return str;
        }
        private genVertexCode2() :string {
            var str = 'vec3 normal = normalize(u_ModelMatrix * vec4(a_normal, 0.0)).xyz;\n';
            str += 'vec3 trangent = normalize(u_ModelMatrix * vec4(a_trangent, 0.0)).xyz;\n';
            str += 'vec3 bitangent = normalize(cross(a_normal, a_trangent));\n';
            return str;
        }
        private genVertexCode3() :string {
            var str = 'v_normal = normal;\n';
            str += "v_trangent = trangent;\n";
            str += "v_bitangent = bitangent;\n";
            return str;
        }
        private genFramentCode2():string {
            var str:string = 'vec3 norC = vec3(v_normal.x,v_normal.y,v_normal.z);\n';
            return str;
        }
        private genFramentCode1():string {
            var str:string = 'varying vec3 v_normal;\n';
            str += "varying vec3 v_trangent;\n";
            str += "varying vec3 v_bitangent;\n";
            return str;
        }
        public active(gl:WebGLRenderingContext, subGeo:ISubGeometry, target:IRenderable, camera:ICamera, program:WebGLProgram, renderType:number):void
        {
            var buffer:WebGLBuffer = subGeo.getVertexBuffer(gl), FSIZE = subGeo.bytesPerEle, perLen = subGeo.vertexStride;
            this.initAttributeVariable(gl, program["a_normal"], buffer, 3, FSIZE * perLen, FSIZE * 5, gl.FLOAT, true);
            this.initAttributeVariable(gl, program["a_trangent"], buffer, 3, FSIZE * perLen, FSIZE * 8, gl.FLOAT, true);
        }
        public disactive(gl:WebGLRenderingContext, program:WebGLProgram):void {
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            gl.disableVertexAttribArray(program["a_normal"]);
            gl.disableVertexAttribArray(program["a_trangent"]);
        }
        public getAttArr():Array<any> {
            var arr = [];
            arr.push({type: 1, name: "a_normal"});
            arr.push({type: 1, name: "a_trangent"});
            return arr;
        }
    }
}