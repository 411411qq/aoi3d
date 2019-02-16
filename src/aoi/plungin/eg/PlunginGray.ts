module aoi {
    /** 灰度 */
    export class PlunginGray extends PlunginVoBase {
        constructor() {
            super();
            this._key = "gray";
            this.type = PlunginDefine.GRAY;
            this.limitNum = 1;
        }

        public updateCode():void {
            this._fragmentCode.push(new OpenGlCodeVo(80000, this, this.genFramentCode));
        }
        
        public genFramentCode():string {
            var str = 'float gray = outcolor.x * 0.3 + outcolor.y * 0.59 + outcolor.z * 0.11;\n' +
                'outcolor = vec4(gray,gray,gray, outcolor.w);\n';
            return str;
        }
    }
}