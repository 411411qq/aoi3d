module aoi {
    /** 计算UV偏移 */
    export class PlunginCaculateUV extends PlunginVoBase{
        constructor()
        {
            super();
            this.key = "c_uv";
            this.limitNum = 1;
            this.type = PlunginDefine.C_UV;
        }
        public updateCode(renderType:number):void {
            this._vertexCode.push(new OpenGlCodeVo(101, this, this.genVertexCode1));
            this._fragmentCode.push(new OpenGlCodeVo(101, this, this.genFramentCode1));
        }
        private genVertexCode1() {
            var str = "";
            str += "vec2 calUvOffset(vec2 texCoord, vec4 data){\n";
            str += "return texCoord * data.xy + data.zw;\n";
            str += "}\n";
            return str;
        }
        private genFramentCode1() {
            var str = "";
            str += "vec2 calUvOffset(vec2 texCoord, vec4 data){\n";
            str += "return texCoord * data.xy + data.zw;\n";
            str += "}\n";
            return str;
        }
    }
}