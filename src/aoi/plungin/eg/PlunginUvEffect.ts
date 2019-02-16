module aoi {
    /** UV动画 */
    export class PlunginUvEffect extends PlunginVoBase{
        private _uvTexture:IMaterial;
        private _speedData:math.Vector3D;
        private _strongData:math.Vector3D;
        private _faceNor:number = 0;
        constructor(faceNor:number = 0)
        {
            super();
            this._key = "uveffect_" + faceNor;
            this.limitNum = 1;
            this.type = PlunginDefine.UV_EFFECT;
            this._speedData = new math.Vector3D(0.1,0.1,0.1,0.1);
            this._strongData = new math.Vector3D(1,1,1,1);
            this._faceNor = faceNor;
        }
        public setSpeed(spx:number, spy:number):void
        {
            this._speedData.x = spx;
            this._speedData.y = spy;
        }
        public setStrong(r:number, g:number, b:number):void
        {
            this._strongData.x = r;
            this._strongData.y = g;
            this._strongData.z = b;
        }
        public setTexture(val:IMaterial):void
        {
            this._uvTexture = val;
        }
        public genTextureIndex():void {
            this.txtIndex = this.pColloct.getTextureObj();
        }
        public getPrePlungin():Array<IPlunginVo>
        {
            var arr = new Array<IPlunginVo>();
            arr.push(new aoi.PlunginConst());
            arr.push(new aoi.PlunginUvMaskData());
            arr.push(new aoi.PlunginViewMatrix());
            if(this._faceNor == 1)
            {
                arr.push(new aoi.PlunginNormalAndTrangent());
            }
            return arr;
        }
        public getAttArr():Array<any> {
            var arr = [];
            arr.push({type: 2, name: "u_UvTexture"});
            arr.push({type: 2, name: "u_UvSpeedData"});
            arr.push({type: 2, name: "u_UvStrongData"});
            return arr;
        }
        public updateCode():void {
            this._fragmentCode.push(new OpenGlCodeVo(30100, this, this.genFramentCode2));
            if(this._faceNor == 1)
            {
                this._fragmentCode.push(new OpenGlCodeVo(70500, this, this.genFramentCode4_1));
            }
            else
            {
                this._fragmentCode.push(new OpenGlCodeVo(70500, this, this.genFramentCode4_0));
            }
            this._fragmentCode.push(new OpenGlCodeVo(70501, this, this.genFramentCode5));
        }
        private genFramentCode2():string {
            var str:string = 'uniform sampler2D u_UvTexture;\n';
            str += 'uniform vec4 u_UvSpeedData;\n';
            str += 'uniform vec4 u_UvStrongData;\n';
            str += 'uniform vec4 u_UvTexture_uv;\n';
            return str;
        }
        private genFramentCode4_0():string {
            var str:string = 'vec4 ' + this.getParamName("uvEffectC") + ' = texture2D(u_UvTexture, calUvOffset(texCoord + u_UvSpeedData.xy * v_const.xx, u_UvTexture_uv));\n';
            return str;
        }
        private genFramentCode4_1():string {
            var str:string = "";
            str += "vec2 viewDir = (v_ViewMatrix * vec4(norC,0.0)).xy*0.5+0.5;\n";
            str += "vec4 " + this.getParamName("uvEffectC") + " = texture2D(u_UvTexture, calUvOffset(viewDir, u_UvTexture_uv));\n";
            return str;
        }
        private genFramentCode5():string {
            var str:string = '';
            str += 'outcolor.xyz = ' + this.getParamName("uvEffectC") + '.xyz * ' + this.getParamName("uvEffectC") 
            + '.w * (maskVal.x * u_UvStrongData.x + maskVal.y * u_UvStrongData.y + maskVal.z * u_UvStrongData.z);\n';
            return str;
        }
        public active(gl:WebGLRenderingContext, subGeo:ISubGeometry, target:IRenderable, camera:ICamera, program:WebGLProgram, renderType:number):void {
            gl.activeTexture(gl["TEXTURE" + this.txtIndex]);
            gl.bindTexture(gl.TEXTURE_2D, this._uvTexture.getTextures(gl));
            gl.uniform1i(program["u_UvTexture"], this.txtIndex);

            gl.uniform4fv(program["u_UvSpeedData"], this._speedData.elements);
            gl.uniform4fv(program["u_UvStrongData"], this._strongData.elements);
            gl.uniform4fv(program["u_UvTexture_uv"], this._uvTexture.getOffsetData().elements);
        }
    }
}