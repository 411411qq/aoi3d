module aoi {
    /** 高斯模糊 */
    export class PlunginGaussBlur extends PlunginVoBase 
    {
        private _data:Float32Array;
        constructor() {
            super();
            this.key = "g_b";
            this.type = PlunginDefine.GAUSS_BLUR;
            this.limitNum = 1;
            this._data = new Float32Array(3);
        }
        public setData(blueType:number, txtSize:number, blurRadius:number):void
        {
            this._data[0] = blueType;
            this._data[1] = txtSize;
            this._data[2] = blurRadius;
        }
        public getAttArr():Array<any> {
            var arr = [];
            arr.push({type: 2, name: "u_gaussData"});
            return arr;
        }
        public active(gl:WebGLRenderingContext, subGeo:ISubGeometry, target:IRenderable, camera:ICamera, program:WebGLProgram, renderType:number):void 
        {
            gl.uniform3fv(program["u_gaussData"], this._data);
        }
        public updateCode(renderType:number):void {
        }
        private genFramentCode1():string
        {
            var str:string = "";
            return str;
        }
        private genFramentCode2():string
        {
            var str:string = "";
            str += "vec3 getGaussBlurColor(float tetSize, float blurRadius, vec2 texcoord, sampler2D mainTxt){\n";
            str += "float space = 1.0 / tetSize;\n";
            str += "float rho = blurRadius * space / 3.0;\n";
            str += "float weightTotal = 0;\n";
            str += "int x = 0;\n";
            str += "int y = 0;\n";
            str += "for (x = -blurRadius; x <= blurRadius; x++){\n";
            str += "for (y = -blurRadius; y <= blurRadius; y++){\n";
            str += "weightTotal += GetGaussianDistribution(x * space, y * space, rho);\n";
            str += "}\n";
            str += "};\n";
            str += "float4 colorTmp = float4(0, 0, 0, 0);\n";
            str += "for (x = -blurRadius; x <= blurRadius; x++){\n";
            str += "for (y = -blurRadius; y <= blurRadius; y++){\n";
            str += "float weight = getGaussianDistribution(x * space, y * space, rho) / weightTotal;\n";
            str += "float4 color = tex2D(texture2D, texcoord + float2(x * space, y * space));\n";
            str += "color = color * weight;\n";
            str += "colorTmp += color;\n";
            str += "}\n";
            str += "};\n";
            str += "return colorTmp;\n";
            str += "}\n";
            return str;
        }
        private genFramentCode3():string
        {
            var str:string = "";
            str += "\n";
            str += "\n";
            str += "\n";
            str += "\n";
            str += "\n";
            str += "\n";
            str += "\n";
            str += "\n";
            str += "\n";
            str += "\n";
            str += "\n";
            str += "\n";
            str += "\n";
            str += "\n";
            return str;
        }
    }
}