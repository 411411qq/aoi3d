module aoi {
    /** hsv转换 --todo*/
    export class PlunginHSVConvert extends PlunginVoBase {
        constructor() {
            super();
            this.key = "HSVConvert";
            this.type = PlunginDefine.HSV;
            this.limitNum = 1;
        }

        public updateCode(renderType:number):void {
            this._fragmentCode.push(new OpenGlCodeVo(102, this, this.genFramentCode1));
        }
        
        private genFramentCode1():string {
            var str = "";
            str += "vec3 HSVConvertToRGB(vec3 hsv){\n";
            str += "float R,G,B;\n";
            str += "if( hsv.y == 0 ){\n";
            str += "R=G=B=hsv.z;}\n";
            str += "else{\n";
            str += "hsv.x = hsv.x/60.0; \n";
            str += "int i = hsv.x;\n";
            str += "}\n";
            return str;
        }
    }
}