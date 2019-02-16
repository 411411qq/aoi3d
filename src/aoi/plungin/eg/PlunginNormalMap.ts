module aoi {
    /** 法线贴图 */
    export class PlunginNormalMap extends PlunginVoBase {
        private _norTexture:IMaterial;
        constructor() {
            super();
            this._key = "NMap";
            this.limitNum = 1;
            this.type = PlunginDefine.NORMAL_MAP;
            this.txtIndex = 0;
        }
        public getPrePlungin():Array<IPlunginVo>
        {
            var arr = new Array<IPlunginVo>();
            arr.push(new aoi.PlunginCaculateNormal());
            arr.push(new aoi.PlunginNormalAndTrangent());
            arr.push(new aoi.PlunginCaculateUV());
            return arr;
        }
        public setTexture(val:IMaterial):void
        {
            this._norTexture = val;
        }
        public genTextureIndex():void {
            this.txtIndex = this.pColloct.getTextureObj();
        }
        public getAttArr():Array<any> {
            var arr = [];
            arr.push({type: 2, name: "u_NorTexture"});
            arr.push({type: 2, name: "u_normal_uv"});
            return arr;
        }
        public updateCode():void {
            this._fragmentCode.push(new OpenGlCodeVo(30100, this, this.genFramentCode2));
            this._fragmentCode.push(new OpenGlCodeVo(70200, this, this.genFramentCode4));
        }
        private genFramentCode2():string {
            var str:string = 'uniform sampler2D u_NorTexture;\n';
            str += 'uniform vec4 u_normal_uv;\n';
            return str;
        }
        private genFramentCode4():string {
            var str:string = '';
            str += "mat3 tangentTransform = mat3(v_trangent, v_bitangent, v_normal);\n";
            str += "vec3 normalLocal = calNormal(calUvOffset(texCoord, u_normal_uv), u_NorTexture);\n";
            str += "normalLocal = tangentTransform * normalLocal;\n";
            str += "norC = normalize(normalLocal);\n";
            return str;
        }
        public active(gl:WebGLRenderingContext, subGeo:ISubGeometry, target:IRenderable, camera:ICamera, program:WebGLProgram, renderType:number):void {
            gl.activeTexture(gl["TEXTURE" + this.txtIndex]);
            gl.bindTexture(gl.TEXTURE_2D, this._norTexture.getTextures(gl));
            gl.uniform1i(program["u_NorTexture"], this.txtIndex);

            gl.uniform4fv(program["u_normal_uv"], this._norTexture.getOffsetData().elements);
        }
    }
}