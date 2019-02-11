module aoi {
    /** 模型矩阵 */
    export class PlunginModelMatrix extends PlunginVoBase
    {
        constructor() {
            super();
            this._key = "mmx";
            this.type = PlunginDefine.MODEL_MATRIX;
            this.limitNum = 1;
        }
        public updateCode(renderType:number):void {
            this._vertexCode.push(new OpenGlCodeVo(2, this, this.genVertexCode));
        }
        private genVertexCode():string {
            var str:string =
                'uniform mat4 u_ModelMatrix;\n';
            return str;
        }
        public active(gl:WebGLRenderingContext, subGeo:ISubGeometry, target:IRenderable, camera:ICamera, program:WebGLProgram, renderType:number):void
        {
            gl.uniformMatrix4fv(program["u_ModelMatrix"], false, target.sceneTransform.elements);
        }
        public getAttArr():Array<any> {
            var arr = [];
            arr.push({type: 2, name: "u_ModelMatrix"});
            return arr;
        }
    }
}