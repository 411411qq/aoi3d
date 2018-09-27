module aoi {
    /** 取法线贴图的法线值计算公式 */
    export class PlunginCaculateNormal extends PlunginVoBase{
        constructor()
        {
            super();
            this.key = "c_nor";
            this.limitNum = 1;
            this.type = PlunginDefine.C_NORMAL;
        }
        public updateCode(renderType:number):void {
            this._fragmentCode.push(new OpenGlCodeVo(100, this, this.genFramentCode1));
        }
        private genFramentCode1():string {
            var str:string = '';
            str += "vec3 calNormal(vec2 p, sampler2D norTxt) {\n";
            str += "vec3 normal = texture2D(norTxt, p).xyz;\n";
            str += "normal = -1.0 + normal * 2.0;\n";
            str += "return normalize(normal);\n";
            str += "}\n";
            return str;
        }
    }
}