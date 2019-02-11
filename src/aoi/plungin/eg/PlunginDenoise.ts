
module aoi 
{
    /** todo */
    export class PlunginDenoise extends PlunginVoBase {
        private _strength:number;
        constructor(strength:number)
        {
            super();
            this.key = "dnoise";
            this.limitNum = 1;
            this.type = PlunginDefine.DNOISE;
            this._strength = strength;
        }
        public getAttArr() {
            var arr = [];
            arr.push({type: 2, name: "u_noiseStrength"});
            return arr;
        }
        public getPrePlungin():Array<IPlunginVo>
        {
            var arr = new Array<IPlunginVo>();
            arr.push(new aoi.PlunginTextureSize());
            return arr;
        }
        public active(gl:WebGLRenderingContext, subGeo:ISubGeometry, target:IRenderable, camera:ICamera, program:WebGLProgram, renderType:number):void {
            gl.uniform1f(program["u_noiseStrength"], this._strength);
        }
        public updateCode(renderType:number):void {
            this._fragmentCode.push(new OpenGlCodeVo(51, this, this.genFramentCode1));
        	this._fragmentCode.push(new OpenGlCodeVo(74000, this, this.genFramentCode2));
        }
        private genFramentCode1():string
        {
        	var str = 'uniform float u_noiseStrength;\n';
            return str;
        }
        private genFramentCode2():string 
        {
            let str:string = "";
            return str;
        }
    }
}
