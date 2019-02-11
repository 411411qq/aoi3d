module aoi {
    /** UV动画某些部位不需要走UV的时候会用到 */
    export class PlunginUvEffectMask extends PlunginVoBase{
        private _uvMaskTexture:IMaterial;
        constructor()
        {
            super();
            this._key = "uveffect_m";
            this.limitNum = 1;
            this.type = PlunginDefine.UV_EFFECT_MASK;
            this.txtIndex = 0;
        }
        public getPrePlungin():Array<IPlunginVo>
        {
            var arr = new Array<IPlunginVo>();
            arr.push(new aoi.PlunginCaculateUV());
            return arr;
        }
        public setTexture(val:IMaterial):void
        {
            this._uvMaskTexture = val;
        }
        public genTextureIndex():void {
            this.txtIndex = this.pColloct.getTextureObj();
        }
        public getAttArr():Array<any> {
            var arr = [];
            arr.push({type: 2, name: "u_UvMaskTexture"});
            arr.push({type: 2, name: "u_UvMaskUv"});
            return arr;
        }
        public updateCode(renderType:number):void {
            this._fragmentCode.push(new OpenGlCodeVo(30100, this, this.genFramentCode1));
            this._fragmentCode.push(new OpenGlCodeVo(70450, this, this.genFramentCode2));
        }
        private genFramentCode1():string {
            var str:string = 'uniform sampler2D u_UvMaskTexture;\n';
            return str;
        }
        private genFramentCode2():string
        {
            var str:string = "";
            str += "maskVal = texture2D(u_UvMaskTexture, calUvOffset(texCoord, u_UvMaskUv));\n";
            return str;
        }
        public active(gl:WebGLRenderingContext, subGeo:ISubGeometry, target:IRenderable, camera:ICamera, program:WebGLProgram, renderType:number):void {            
            gl.activeTexture(gl["TEXTURE" + this.txtIndex]);
            gl.bindTexture(gl.TEXTURE_2D, this._uvMaskTexture.getTextures(gl));
            gl.uniform1i(program["u_UvMaskTexture"], this.txtIndex);

            gl.uniform4fv(program["u_UvMaskUv"], this._uvMaskTexture.getOffsetData().elements);
        }
    }
}