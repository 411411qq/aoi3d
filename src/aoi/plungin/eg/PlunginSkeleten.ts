module aoi {
    /** 骨骼动画基础 */
    export class PlunginSkeleten extends PlunginSkeletenBase {
        constructor(skeleton:Skeleton, precision:number = 2) {
            super(skeleton,precision);
            this._key = "skeleton";
            this.limitNum = 1;
            this.type = PlunginDefine.SKELETEN;
            this.txtIndex = 0;
            this._replaceType = PlunginDefine.REPLACE_MAIN;
            this._replaceWeight = 10;
        }
        public updateCode():void {
            super.updateCode();
            this._fragmentCode.push(new OpenGlCodeVo(90000, this, this.genFramentCode_normal));
        }
        private genFramentCode_normal():string
        {
            var str:string = "float mv = max(outcolor.x, outcolor.y);\n";
            str += "mv = max(mv, outcolor.z);\n";
            str += "if(mv > 1.0){\n";
            str += "outcolor.xyz = outcolor.xyz / mv;\n";
            str += "}\n";
            str += 'gl_FragColor = outcolor;\n';
            str += '}\n';
            return str;
        }
    }
}