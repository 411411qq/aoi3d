module aoi {
    export class PlunginSepia extends PlunginVoBase
    {
        private _amount:number;
        constructor(amount:number = 0)
        {
            super();
            this._key = "sepia";
            this.limitNum = 1;
            this.type = PlunginDefine.SEPIA;
            this._amount = 0;
        }
        public getAttArr() {
            var arr = [];
            arr.push({type: 2, name: "u_sepiaamount"});
            return arr;
        }
        public active(gl:WebGLRenderingContext, subGeo:ISubGeometry, target:IRenderable, camera:ICamera, program:WebGLProgram, renderType:number):void {
            gl.uniform1f(program["u_sepiaamount"], this._amount);
        }
        public updateCode():void {
        	this._fragmentCode.push(new OpenGlCodeVo(50, this, this.genFramentCode1));
            this._fragmentCode.push(new OpenGlCodeVo(75003, this, this.genFramentCode2));
        }
        private genFramentCode1():string
        {
        	var str = 'uniform float u_sepiaamount;\n';
            return str;
        }
        private genFramentCode2():string
        {
        	var str = "";
            str += "float r1 = outcolor.r;\n";
            str += "float g1 = outcolor.g;\n";
            str += "float b1 = outcolor.b;\n";
            str += "outcolor.r = min(1.0, (r1 * (1.0 - (0.607 * u_sepiaamount))) + (g1 * (0.769 * u_sepiaamount)) + (b1 * (0.189 * u_sepiaamount)));\n";
            str += "outcolor.g = min(1.0, (r1 * 0.349 * u_sepiaamount) + (g1 * (1.0 - (0.314 * u_sepiaamount))) + (b1 * 0.168 * u_sepiaamount));\n";
            str += "outcolor.b = min(1.0, (r1 * 0.272 * u_sepiaamount) + (g1 * 0.534 * u_sepiaamount) + (b1 * (1.0 - (0.869 * u_sepiaamount))));\n";
            return str;
        }
    }
}