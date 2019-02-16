module aoi {
    /** UV动画 mask数据，一般不直接添加 */
    export class PlunginUvMaskData extends PlunginVoBase{
        constructor()
        {
            super();
            this._key = "uv_m";
            this.limitNum = 1;
            this.type = PlunginDefine.UV_MASK_DATA;
        }
        public updateCode():void {
            this._fragmentCode.push(new OpenGlCodeVo(70400, this, this.genFramentCode3));
        }
        private genFramentCode3():string 
        {
            var str:string = "";
            str += "vec4 maskVal = vec4(0.33,0.33,0.33,1.0);\n";
            return str;
        }
    }
}