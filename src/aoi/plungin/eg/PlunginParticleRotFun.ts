module aoi {
    /** 粒子旋转函数 */
    export class PlunginParticleRotFun extends PlunginVoBase {
        constructor() {
            super();
            this.key = "p_rf";
            this.limitNum = 1;
            this.type = PlunginDefine.P_ROT_FUN;
        }
        public updateCode(renderType:number):void {
            this._vertexCode.push(new OpenGlCodeVo(101, this, this.genVertexCode1));
        }
        private genVertexCode1() {
            var str = "";
            str += "vec4 rotVexter(vec4 pos, float rot){\n";
            str += "float sinval = sin(rot);\n";
            str += "float cosval = cos(rot);\n";
            str += "float rx = pos.x * cosval - pos.y * sinval;\n";
            str += "float ry = pos.x * sinval + pos.y * cosval;\n";
            str += "pos.x = rx;\n";
            str += "pos.y = ry;\n";
            str += "return pos;\n";
            str += "}\n";
            return str;
        }
    }
}