
module aoi 
{
    export class PlunginDenoise extends PlunginVoBase {
        private _strength:number;
        private _exponent:number;
        constructor(strength:number, exponent:number)
        {
            super();
            this._key = "dnoise";
            this.limitNum = 1;
            this.type = PlunginDefine.DNOISE;
            this._replaceType = PlunginDefine.REPLACE_TEXTURE_COLOR;
            this._replaceWeight = 2;
            this._strength = strength;
            this._exponent = exponent;
        }
        public getAttArr() {
            var arr = [];
            arr.push({type: 2, name: "u_dnoiseData"});
            return arr;
        }
        public getPrePlungin():Array<IPlunginVo>
        {
            var arr = new Array<IPlunginVo>();
            arr.push(new aoi.PlunginTextureSize());
            return arr;
        }
        public active(gl:WebGLRenderingContext, subGeo:ISubGeometry, target:IRenderable, camera:ICamera, program:WebGLProgram, renderType:number):void {
            gl.uniform2f(program["u_dnoiseData"], this._strength, this._exponent);
        }
        public updateCode():void {
            this._fragmentCode.push(new OpenGlCodeVo(51, this, this.genFramentCode1));
        	this._fragmentCode.push(new OpenGlCodeVo(70000, this, this.genFramentCode2));
        }
        private genFramentCode1():string
        {
        	var str = 'uniform vec2 u_dnoiseData;\n';
            return str;
        }
        private genFramentCode2():string 
        {
            let str:string = "";
            str += "vec4 center = texture2D(u_Sampler, texCoord);\n";
            str += "vec4 outcolor = vec4(0.0);\n";
            str += "float total = 0.0;\n";
            str += "for (float x = -4.0; x <= 4.0; x += 1.0) {\n";
            str += "for (float y = -4.0; y <= 4.0; y += 1.0) {\n";
            str += "vec4 sample = texture2D(u_Sampler, texCoord + vec2(x, y) / u_textureSize);\n";
            str += "float weight = 1.0 - abs(dot(sample.rgb - center.rgb, vec3(0.25)));\n";
            str += "weight = pow(weight, u_dnoiseData.y);\n";
            str += "outcolor += sample * weight;\n";
            str += "total += weight;}}\n";
            str += "outcolor = outcolor / total;\n";
            return str;
        }
    }
}
