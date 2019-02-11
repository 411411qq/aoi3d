module aoi {
    /** hsv转换 --todo*/
    export class PlunginHSVConvert extends PlunginVoBase {
        private _datas:Float32Array;
        constructor(hue:number, saturation:number, bright:number) {
            super();
            this.key = "HSVConvert";
            this.type = PlunginDefine.HSV;
            this.limitNum = 1;
            this._datas = new Float32Array(3);
            this.setData(hue, saturation, bright);
        }
        private setData(hue:number, saturation:number, bright:number):void
        {
            this._datas[0] = hue;
        	this._datas[1] = saturation;
            this._datas[2] = bright;
        }
        public updateCode(renderType:number):void {
            this._fragmentCode.push(new OpenGlCodeVo(102, this, this.genFramentCode1));
            this._fragmentCode.push(new OpenGlCodeVo(103, this, this.genFramentCode2));
            this._fragmentCode.push(new OpenGlCodeVo(104, this, this.genFramentCode3));
            this._fragmentCode.push(new OpenGlCodeVo(51, this, this.genFramentCode4));
            this._fragmentCode.push(new OpenGlCodeVo(75000, this, this.genFramentCode5));
        }
        public getAttArr() {
            var arr = [];
            arr.push({type: 2, name: "u_hsvData"});
            return arr;
        }
        public active(gl:WebGLRenderingContext, subGeo:ISubGeometry, target:IRenderable, camera:ICamera, program:WebGLProgram, renderType:number):void {
            gl.uniform3fv(program["u_hsvData"], this._datas);
        }
        private genFramentCode1():string {
            let str = "";
            str += "vec3 HSVConvertToRGB(vec3 hsv){\n";
            str += "float R;float G;float B;\n";
            str += "if(hsv.y == 0.0){\n";
            str += "R=hsv.z;G=hsv.z;B=hsv.z;\n";
            str += "}else{\n";
            str += "hsv.x = hsv.x/60.0;\n";
            str += "float i = floor(hsv.x);\n";
            str += "float f = hsv.x - i;\n";
            str += "float a = hsv.z * (1.0 - hsv.y);\n";
            str += "float b = hsv.z * (1.0 - hsv.y * f);\n";
            str += "float c = hsv.z * (1.0 - hsv.y * (1.0 - f));\n";
            str += "if(i == 0.0){R = hsv.z; G = c; B = a;}\n";
            str += "else if(i == 1.0){R = b; G = hsv.z; B = a; }\n";
            str += "else if(i == 2.0){R = a; G = hsv.z; B = c; }\n";
            str += "else if(i == 3.0){R = a; G = b; B = hsv.z; }\n";
            str += "else if(i == 4.0){R = c; G = a; B = hsv.z; }\n";
            str += "else{R = hsv.z; G = a; B = b; }\n";
            str += "}\n";
            str += "return vec3(R,G,B);";
            str += "}\n";
            return str;
        }
        private genFramentCode2():string
        {
            let str = "";
            str += "vec3 RGBConvertToHSV(vec3 rgb){\n";
            str += "float R = rgb.x,G = rgb.y,B = rgb.z;\n";
            str += "vec3 hsv;\n";
            str += "float max1=max(R,max(G,B));\n";
            str += "float min1=min(R,min(G,B));\n";
            str += "if (R == max1){hsv.x = (G-B)/(max1-min1);}\n";
            str += "if (G == max1){hsv.x = 2.0 + (B-R)/(max1-min1);}\n";
            str += "if (B == max1){hsv.x = 4.0 + (R-G)/(max1-min1);}\n";
            str += "hsv.x = hsv.x * 60.0;\n";
            str += "if (hsv.x < 0.0){hsv.x = hsv.x + 360.0;}\n";
            str += "hsv.z=max1;\n";
            str += "hsv.y=(max1-min1)/max1;\n";
            str += "return hsv;}\n";
            return str;
        } 
        private genFramentCode3():string
        {
            let str = "";
            str += "vec3 doTransColor(vec3 rgb, float hue, float saturation, float bright){\n";
            str += "vec3 colorHSV = vec3(rgb.x,rgb.y,rgb.z);\n";
            str += "colorHSV = RGBConvertToHSV(rgb.xyz);\n";
            str += "colorHSV.x = colorHSV.x + hue;\n";
            str += "if(colorHSV.x > 360.0){colorHSV.x = colorHSV.x - 360.0;}\n";
            str += "colorHSV.y = colorHSV.y * saturation;\n";
            str += "colorHSV.z = colorHSV.z * bright;\n";
            str += "colorHSV.xyz = HSVConvertToRGB(colorHSV.xyz);\n";
            str += "return colorHSV;\n";
            str += "}\n";
            return str;
        }
        private genFramentCode4():string
        {
        	var str = 'uniform vec3 u_hsvData;\n';
            return str;
        }
        private genFramentCode5():string
        {
            let str = "outcolor.xyz = doTransColor(outcolor.xyz, u_hsvData.x, u_hsvData.y, u_hsvData.z);\n";
            return str;
        }
    }
}