module aoi {
    /** 扰动 */
    export class PlunginPerturbation extends PlunginVoBase
    {
        private _noiseTexture:IMaterial;
        private _areaTexture:IMaterial;
        private _data:math.Vector3D;
        private _txtIndex2:number;
        constructor() {
            super();
            this._key = "Pertur";
            this.limitNum = 1;
            this.type = PlunginDefine.PERTURBATION;
            this._data = new math.Vector3D(0.05,0.05, 0.06,0.06);
        }
        public setData(moveSpeed:number, moveForce:number):void
        {
            this._data.x = moveSpeed;
            this._data.y = moveForce;
        }
        public getAttArr():Array<any> {
            var arr = [];
            arr.push({type: 2, name: "u_noiseTexture"});
            arr.push({type: 2, name: "u_areaTexture"});
            arr.push({type: 2, name: "u_pertur"});
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
        public setNoiseTexture(val:IMaterial):void
        {
            this._noiseTexture = val;
        }
        public setAreaTexture(val:IMaterial):void
        {
            this._areaTexture = val;
        }
        public genTextureIndex():void {
            this.txtIndex = this.pColloct.getTextureObj();
            this._txtIndex2 = this.pColloct.getTextureObj();
        }
        public updateCode():void 
        {
            this._fragmentCode.push(new OpenGlCodeVo(10000, this, this.genFramentCode1));
            this._fragmentCode.push(new OpenGlCodeVo(50100, this, this.genFramentCode2));
            this._fragmentCode.push(new OpenGlCodeVo(81000, this, this.genFramentCode3));
        }
        public active(gl:WebGLRenderingContext, subGeo:ISubGeometry, target:IRenderable, camera:ICamera, program:WebGLProgram, renderType:number):void {
            gl.activeTexture(gl["TEXTURE" + this.txtIndex]);
            gl.bindTexture(gl.TEXTURE_2D, this._noiseTexture.getTextures(gl));
            gl.uniform1i(program["u_noiseTexture"], this.txtIndex);

            gl.activeTexture(gl["TEXTURE" + this._txtIndex2]);
            gl.bindTexture(gl.TEXTURE_2D, this._areaTexture.getTextures(gl));
            gl.uniform1i(program["u_areaTexture"], this._txtIndex2);

            gl.uniform4fv(program["u_pertur"], this._data.elements);
        }
        private genFramentCode1():string {
            var str:string = 'uniform vec4 u_pertur;\n';
            str += "uniform sampler2D u_noiseTexture;\n";
            str += "uniform sampler2D u_areaTexture;\n";
            return str;
        }
        private genFramentCode2():string {
            var str:string = '';
            str += "vec4 areacolor = texture2D(u_areaTexture, texCoord);\n";
            str += "texCoord = (v_wpos.xy/v_wpos.w) * 0.5 + 0.5;\n";
            str += "vec3 normal = calNormal(texCoord + vec2(sin(v_const.x) * u_pertur.z, cos(v_const.x) * u_pertur.w), u_noiseTexture);\n";
            str += "vec2 p = -1.0 + 2.0 * texCoord;\n";
            str += "vec3 inVec = normalize(vec3(p, 0.0));\n";
            str += "vec3 refractVec = refract(inVec, normal, u_pertur.x);\n";
            str += "texCoord = texCoord + refractVec.xy * u_pertur.y;\n";
            return str;
        }
        private genFramentCode3():string 
        {
            var str:string = "";
            str += "outcolor = outcolor * areacolor;\n";
            str += "outcolor.xyzw = outcolor.xyzw * areacolor.r;\n";
            return str;
        }
    }
}