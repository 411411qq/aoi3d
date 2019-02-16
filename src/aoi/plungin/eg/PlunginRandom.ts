
module aoi {
    export class PlunginRandom extends PlunginVoBase
    {
        constructor()
        {
            super();
            this._key = "Random";
            this.limitNum = 1;
            this.type = PlunginDefine.RONDOM_FUN;
        }
        public updateCode():void {
            this._fragmentCode.push(new OpenGlCodeVo(101, this, this.genFramentCode1));
        }
        private genFramentCode1() {
            var str = "";
            str += "float random(vec3 scale, float seed) {\n";
            str += "return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);\n";
            str += "}\n";
            return str;
        }
    }
}