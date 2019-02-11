module aoi {
    /** 粒子旋转或者移动时候的输入 */
    export class PlunginParticleRotOrMove extends PlunginVoBase {
        constructor() {
            super();
            this._key = "p_morr";
            this.limitNum = 1;
            this.type = PlunginDefine.P_MOVE_OR_ROT;
        }
        public disactive(gl:WebGLRenderingContext, program:WebGLProgram):void {
            gl.disableVertexAttribArray(program["a_parMove"]);
        }

        public active(gl:WebGLRenderingContext, subGeo:ISubGeometry, target:IRenderable, camera:ICamera, program:WebGLProgram, renderType:number):void {
            var buffer:WebGLBuffer = subGeo.getVertexBuffer(gl), FSIZE = subGeo.bytesPerEle, perLen = subGeo.vertexStride;
            this.initAttributeVariable(gl, program["a_parMove"], buffer, 4, FSIZE * perLen, FSIZE * 12);
        }
        public updateCode(renderType:number) {
            this._vertexCode.push(new OpenGlCodeVo(100, this, this.genVertexCode1));
        }
        public getAttArr() {
            var arr = [];
            arr.push({type: 1, name: "a_parMove"});
            return arr;
        }
        public genVertexCode1():string {
            var str:string = "" +
                'attribute vec4 a_parMove;\n';
            return str;
        }
    }
}