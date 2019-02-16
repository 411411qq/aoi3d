module aoi {
    /** UV偏移 */
    export class PlunginUvOffset extends PlunginVoBase{
        private _uvData:Float32Array;
        constructor()
        {
            super();
            this._key = "uvoffset";
            this.limitNum = 1;
            this.type = PlunginDefine.UV_OFFSET;
            this._uvData = new Float32Array(4);
        }
        public getPrePlungin():Array<IPlunginVo>
        {
            var arr = new Array<IPlunginVo>();
            arr.push(new aoi.PlunginCaculateUV());
            return arr;
        }
        public setData(offsetU:number = 0, offsetV:number = 0, scaleU:number = 1, scaleV:number = 1):void
        {
            this._uvData[0] = offsetU;
            this._uvData[1] = offsetV;
            this._uvData[2] = scaleU;
            this._uvData[3] = scaleV;
        }
        public getAttArr() {
            var arr = [];
            arr.push({type: 2, name: "u_uvData"});
            return arr;
        }
        public active(gl:WebGLRenderingContext, subGeo:ISubGeometry, target:IRenderable, camera:ICamera, program:WebGLProgram, renderType:number):void {
            gl.uniform2fv(program["u_uvData"], this._uvData);
        }
        public updateCode():void {
            this._vertexCode.push(new OpenGlCodeVo(0, this, this.genVertexCode1));
            this._vertexCode.push(new OpenGlCodeVo(60000, this, this.genVertexCode2));
        }
        public genVertexCode1() {
            var str = 'uniform vec2 u_uvData;\n';
            return str;
        }
        public genVertexCode2() {
            var str = '  n_TexCoord = calUvOffset(n_TexCoord, u_uvData);\n';
            return str;
        }
    }
}