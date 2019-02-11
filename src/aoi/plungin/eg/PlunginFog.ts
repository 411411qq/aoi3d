module aoi {
    /** 雾 */
    export class PlunginFog extends PlunginVoBase {
        private _color:base.Color;
        private _data:math.Vector3D;
        constructor() {
            super();
            this.key = "fog";
            this.type = PlunginDefine.FOG;
            this.limitNum = 1;
            this._color = new base.Color(0,0,0,1);
            this._data = new math.Vector3D(400,1000,0,1);
        }
        public getPrePlungin():Array<IPlunginVo>
        {
            var arr = new Array<IPlunginVo>();
            arr.push(new aoi.PlunginWorldPos());
            return arr;
        }
        public setFogColor(r:number, g:number, b:number):void
        {
            this._color.r = r;
            this._color.g = g;
            this._color.b = b;
        }
        public setFogData(near:number, far:number):void
        {
            this._data.x = near;
            this._data.y = far;
        }
        public getAttArr():Array<any> {
            var arr = [];
            arr.push({type: 2, name: "u_fogColor"});
            arr.push({type: 2, name: "u_fogData"});
            return arr;
        }
        public active(gl:WebGLRenderingContext, subGeo:ISubGeometry, target:IRenderable, camera:ICamera, program:WebGLProgram, renderType:number):void 
        {
            if(this._lastFrame != GlobelConst.frameNum)
            {
                var eyePos:math.Vector3D = GlobelConst.view.camera.position;
                gl.uniform4fv(program["u_fogColor"], this._color.elements);
                gl.uniform4fv(program["u_fogData"], this._data.elements);
            }
        }
        public updateCode(renderType:number):void {
            this._fragmentCode.push(new OpenGlCodeVo(30002, this, this.genFramentCode1));
            this._fragmentCode.push(new OpenGlCodeVo(81000, this, this.genFramentCode2));
        }
        private genFramentCode1():string
        {
            var str:string = "";
            str += "uniform vec4 u_fogColor;\n";
            str += "uniform vec4 u_fogData;\n";
            return str;
        }
        private genFramentCode2():string
        {
            var str:string = "";
            str += "float fogFactor = (u_fogData.y - v_wpos.w) / (u_fogData.y - u_fogData.x);\n";
            str += "outcolor.xyz = mix(u_fogColor.xyz, vec3(outcolor.xyz), clamp(fogFactor, 0.0, 1.0));\n";
            return str;
        }
    }
}