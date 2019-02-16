module aoi {
    export class PlunginDefaultTextureColor extends PlunginVoBase
    {
        constructor()
        {
            super();
            this._key = "TColor";
            this.limitNum = 1;
            this.type = PlunginDefine.DEFAULT_COLOR;
            this._replaceType = PlunginDefine.REPLACE_TEXTURE_COLOR;
        }
        public updateCode():void 
        {
            this._fragmentCode.push(new OpenGlCodeVo(70000, this, this.genFramentCode4));
        }
        private genFramentCode4():string {
            var str:string = "";
            str += 'vec4 outcolor = texture2D(u_Sampler, texCoord);\n';
            return str;
        }
    }
}