module aoi {
    /** 扰动 */
    export class PlunginPerturbation extends PlunginVoBase
    {
        private _data:math.Vector3D;
        private _norTexture:IMaterial;
        constructor() {
            super();
            this._key = "Pertur";
            this.limitNum = 1;
            this.type = PlunginDefine.PERTURBATION;
            this._data = new math.Vector3D(0.05,0.05, 0.06,0.06);
        }
        public setData(refractionFactor:number, offsetFactor:number, timeFactorX:number, timeFactorY:number):void
        {
            this._data.x = refractionFactor;
            this._data.y = offsetFactor;
            this._data.z = timeFactorX;
            this._data.w = timeFactorY;
        }
        public getAttArr():Array<any> {
            var arr = [];
            arr.push({type: 2, name: "u_pertur"});
            arr.push({type: 2, name: "u_pNorTxt"});
            return arr;
        }
        public getPrePlungin():Array<IPlunginVo>
        {
            var arr = new Array<IPlunginVo>();
            arr.push(new aoi.PlunginCaculateNormal());
            arr.push(new aoi.PlunginConst());
            arr.push(new aoi.PlunginWorldPos());
            return arr;
        }
        public setTexture(val:IMaterial):void
        {
            this._norTexture = val;
        }
        public genTextureIndex():void {
            this.txtIndex = this.pColloct.getTextureObj();
        }
        public updateCode():void 
        {
            this._fragmentCode.push(new OpenGlCodeVo(10000, this, this.genFramentCode1));
            this._fragmentCode.push(new OpenGlCodeVo(50100, this, this.genFramentCode2));
        }
        public active(gl:WebGLRenderingContext, subGeo:ISubGeometry, target:IRenderable, camera:ICamera, program:WebGLProgram, renderType:number):void {
            gl.uniform4fv(program["u_pertur"], this._data.elements);
        }
        private genFramentCode1():string {
            var str:string = 'uniform vec4 u_pertur;\n';
            str += "uniform sampler2D u_pNorTxt;\n";
            return str;
        }
        private genFramentCode2():string {
            var str:string = '';
            str += "vec3 normal = calNormal(texCoord + vec2(v_const.x * u_pertur.z, v_const.x * u_pertur.w), u_pNorTxt);\n";
            str += "vec2 p = -1.0 + 2.0 * texCoord;\n";
            str += "vec3 inVec = normalize(vec3(p, 0.0));\n";
            str += "vec3 refractVec = refract(inVec, normal, u_pertur.x);\n";
            str += "texCoord = (v_wpos.xy/v_wpos.w) * 0.5 + 0.5 + refractVec.xy * u_pertur.y;\n";
            return str;
        }
    }
}