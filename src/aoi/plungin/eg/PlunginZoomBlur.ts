module aoi {
    export class PlunginZoomBlur extends PlunginVoBase
    {
        private _zoomData:Float32Array;
        private _runNum:string = "";
        constructor(centerx:number, centery:number, strength:number, runNum:number = 10)
        {
            super();
            let r = Math.floor(runNum);
            this._key = "ZB" + r;
            this._runNum = r + ".0";
            this.limitNum = 1;
            this.type = PlunginDefine.ZOOM_BLUR;
            this._replaceType = PlunginDefine.REPLACE_TEXTURE_COLOR;
            this._replaceWeight = 2;
            this._zoomData = new Float32Array(3);
            this.setData(centerx, centery, strength);
        }
        public getPrePlungin():Array<IPlunginVo>
        {
            var arr = new Array<IPlunginVo>();
            arr.push(new aoi.PlunginTextureSize());
            arr.push(new aoi.PlunginRandom());
            return arr;
        }
        public setData(centerx:number, centery:number, strength:number):void
        {
            this._zoomData[0] = centerx;
            this._zoomData[1] = centery;
            this._zoomData[2] = strength;
        }
        public getAttArr() {
            var arr = [];
            arr.push({type: 2, name: "u_zoomData"});
            return arr;
        }
        public active(gl:WebGLRenderingContext, subGeo:ISubGeometry, target:IRenderable, camera:ICamera, program:WebGLProgram, renderType:number):void {
            gl.uniform3fv(program["u_zoomData"], this._zoomData);
        }
        public updateCode():void {
        	this._fragmentCode.push(new OpenGlCodeVo(50, this, this.genFramentCode1));
            this._fragmentCode.push(new OpenGlCodeVo(70000, this, this.genFramentCode2));
        }
        private genFramentCode1():string
        {
        	var str = 'uniform vec3 u_zoomData;\n';
            return str;
        }
        private genFramentCode2():string
        {
        	var str = "";
            str += "vec4 outcolor = vec4(0.0);\n";
            str += "float total = 0.0;\n";
            str += "vec2 toCenter = u_zoomData.xy - texCoord * u_textureSize;\n";
            str += "float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);\n";
            str += "for (float t = 0.0; t <= " + this._runNum + "; t++) {\n";
            str += "float percent = (t + offset) / " + this._runNum + ";\n";
            str += "float weight = 4.0 * (percent - percent * percent);\n";
            str += "vec4 sample = texture2D(u_Sampler, texCoord + toCenter * percent * u_zoomData.z / u_textureSize);\n";
            str += "sample.rgb *= sample.a;\n";
            str += "outcolor += sample * weight;\n";
            str += "total += weight;\n";
            str += "}\n";
            str += "outcolor = outcolor / total;\n";
            return str;
        }
    }
}