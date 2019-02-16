module aoi {
    /** 环境光 */
    export class PlunginAmbientColor extends PlunginVoBase
    {
        protected ambientColor:math.Vector3D;
        constructor()
        {
            super();
            this._key = "ambient";
            this.limitNum = 1;
            this.type = PlunginDefine.AMBIENT_COLOR;
            this.ambientColor = new math.Vector3D();
        }
        public setColor(val:number, alpha:number):void
        {
            this.ambientColor.x = ((val >> 16) & 0xff)/0xff;
            this.ambientColor.y = ((val >> 8) & 0xff)/0xff;
            this.ambientColor.z = (val & 0xff)/0xff;
            alpha = alpha < 0 ? 0 : alpha;
            alpha = alpha > 1 ? 1 : alpha;
            this.ambientColor.w = alpha;
        }
        public getAttArr():Array<any> {
            var arr = [];
            arr.push({type: 2, name: "u_ambientColor"});
            return arr;
        }
        public updateCode():void 
        {
            this._fragmentCode.push(new OpenGlCodeVo(30003, this, this.genFramentCode1));
            this._fragmentCode.push(new OpenGlCodeVo(85200, this, this.genFramentCode2));
        }
        private genFramentCode1():string
        {
            var str:string = 'uniform vec4 u_ambientColor;\n';
            return str;
        }
        private genFramentCode2():string
        {
            var str:string = "";
            str += "outcolor.xyz = mix(outcolor.xyz, u_ambientColor.xyz, u_ambientColor.w);\n";
            return str;
        }
        public active(gl:WebGLRenderingContext, subGeo:ISubGeometry, target:IRenderable, camera:ICamera, program:WebGLProgram, renderType:number):void 
        {
            gl.uniform4fv(program["u_ambientColor"], this.ambientColor.elements);
        }
    }
}