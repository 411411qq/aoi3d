module aoi {
    /** 模型矩阵的逆矩阵 */
    export class PlunginModelInverseMatrix extends PlunginVoBase
    {
        constructor() {
            super();
            this._key = "mmx";
            this.type = PlunginDefine.MODEL_INVERSEMATRIX;
            this.limitNum = 1;
        }
        public updateCode(renderType:number):void {
            this._vertexCode.push(new OpenGlCodeVo(1, this, this.genVertexCode));
        }
        private genVertexCode():string {
            var str:string =
                'uniform mat4 u_ModelInverseMatrix;\n';
            return str;
        }
        public active(gl:WebGLRenderingContext, subGeo:ISubGeometry, target:IRenderable, camera:ICamera, program:WebGLProgram, renderType:number):void {
            gl.uniformMatrix4fv(program["u_ModelInverseMatrix"], false, target.inverseSceneTransform.elements);
        }
        public getAttArr():Array<any> {
            var arr = [];
            arr.push({type: 2, name: "u_ModelInverseMatrix"});
            return arr;
        }
    }
}