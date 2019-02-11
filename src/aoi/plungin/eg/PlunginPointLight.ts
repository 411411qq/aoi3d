module aoi {
    /** 点光源(多点光源还未支持) */
    export class PlunginPointLight extends PlunginVoBase
    {
        protected pointLight:PointLight;
        constructor() {
            super();
            this._key = "p_light";
            this.limitNum = 1;
            this.type = PlunginDefine.POINT_LIGHT;
        }
        public getPrePlungin():Array<IPlunginVo>
        {
            var arr = new Array<IPlunginVo>();
            arr.push(new aoi.PlunginModelMatrix());
            arr.push(new aoi.PlunginNormalAndTrangent());
            arr.push(new aoi.PlunginWorldPos());
            return arr;
        }
        public setLight(val:PointLight):void
        {
            this.pointLight = val;
        }
        public updateCode(renderType:number):void 
        {
            this._fragmentCode.push(new OpenGlCodeVo(30003, this, this.genFramentCode1));
            this._fragmentCode.push(new OpenGlCodeVo(85301, this, this.genFramentCode2));
        }
        private genFramentCode1():string
        {
            var str:string = '';
            str += 'uniform vec4 u_plightColor;\n';
            str += 'uniform vec4 u_plightPos;\n';
            return str;
        }
        private genFramentCode2():string
        {
            var str:string = "vec4 plightDir = v_wpos - u_plightPos;\n";
            str += "plightDir = normalize(plightDir);\n";
            str += "outcolor.xyz = mix(outcolor.xyz, u_plightColor.xyz * clamp(dot(plightDir.xyz, norC.xyz), 0.0, 1.0), u_plightColor.w);\n";
            return str;
        }
        public active(gl:WebGLRenderingContext, subGeo:ISubGeometry, target:IRenderable, camera:ICamera, program:WebGLProgram, renderType:number):void 
        {
            gl.uniform4fv(program["u_plightPos"], this.pointLight.dataList);
            gl.uniform4fv(program["u_plightColor"], this.pointLight.colorData);
        }
        public getAttArr():Array<any> {
            var arr = [];
            arr.push({type: 2, name: "u_plightPos"});
            arr.push({type: 2, name: "u_plightColor"});
            return arr;
        }
    }
}