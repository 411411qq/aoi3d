module aoi {
    /** 三角波 */
    export class PlunginWave extends PlunginVoBase{
        private data:math.Vector3D;
        constructor()
        {
            super();
            this._key = "wave";
            this.limitNum = 1;
            this.type = PlunginDefine.WAVE;
            this.data = new math.Vector3D(0,0,0,1);
        }
        public setData(amplitude:number, angularVelocity:number, speed:number):void
        {
            this.data.x = amplitude;
            this.data.y = angularVelocity;
            this.data.z = speed;
        }
        public getAttArr() {
            var arr = [];
            arr.push({type: 2, name: "u_wave"});
            return arr;
        }
        public getPrePlungin():Array<IPlunginVo>
        {
            var arr = new Array<IPlunginVo>();
            arr.push(new aoi.PlunginConst());
            return arr;
        }
        public active(gl:WebGLRenderingContext, subGeo:ISubGeometry, target:IRenderable, camera:ICamera, program:WebGLProgram, renderType:number):void {
            gl.uniform4fv(program["u_wave"], this.data.elements);
        }
        public updateCode():void {
            this._fragmentCode.push(new OpenGlCodeVo(30000, this, this.genFramentCode1));
            this._fragmentCode.push(new OpenGlCodeVo(50500, this, this.genFramentCode2));
        }
        public genFramentCode1():string {
            var str:string = 'uniform vec4 u_wave;\n';
            return str;
        }
        public genFramentCode2():string {
            var str:string = "";
            str += 'texCoord.y = texCoord.y + u_wave.x * sin(u_wave.y * texCoord.x + u_wave.z * u_const.x);\n';
            return str;
        }
    }
}