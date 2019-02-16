module aoi {
    /** 方向灯 */
    export class PlunginDirectionLight extends PlunginVoBase
    {
        protected dirLight:DirectionLight;
        constructor() {
            super();
            this._key = "d_light";
            this.limitNum = 1;
            this.type = PlunginDefine.DIR_LIGHT;
        }
        public getPrePlungin():Array<IPlunginVo>
        {
            var arr = new Array<IPlunginVo>();
            arr.push(new aoi.PlunginModelInverseMatrix());
            return arr;
        }
        public setLight(val:DirectionLight):void
        {
            this.dirLight = val;
        }
        public updateCode():void 
        {
            this._vertexCode.push(new OpenGlCodeVo(200, this, this.genVertexCode1));
            this._vertexCode.push(new OpenGlCodeVo(75300, this, this.genVertexCode2));

            this._fragmentCode.push(new OpenGlCodeVo(30002, this, this.genFramentCode1));
            this._fragmentCode.push(new OpenGlCodeVo(85300, this, this.genFramentCode2));
        }
        private genVertexCode1():string
        {
            let str:string = "uniform vec4 u_lightDir;\n";
            str += "varying vec3 v_lightDir;\n";
            return str;
        }
        private genVertexCode2():string
        {
            let str:string = "vec4 lv = u_ModelInverseMatrix * u_lightDir;\n";
            str += "vec4 basePoint = vec4(0.0,0.0,0.0,1.0);\n";
            str += "basePoint = u_ModelInverseMatrix * basePoint;\n";
            str += "lv = basePoint - lv;\n";
            str += "v_lightDir = normalize(lv.xyz);\n";
            return str;
        }
        private genFramentCode1():string
        {
            var str:string = '';
            str += 'uniform vec4 u_lightColor;\n';
            str += 'varying vec3 v_lightDir;\n';
            return str;
        }
        private genFramentCode2():string
        {
            var str:string = "";
            str += "outcolor.xyz = outcolor.xyz + u_lightColor.xyz * u_lightColor.w * clamp(dot(v_lightDir, norC.xyz),0.0,1.0);\n";
            return str;
        }
        public active(gl:WebGLRenderingContext, subGeo:ISubGeometry, target:IRenderable, camera:ICamera, program:WebGLProgram, renderType:number):void 
        {
            gl.uniform4fv(program["u_lightDir"], this.dirLight.dataList);
            gl.uniform4fv(program["u_lightColor"], this.dirLight.colorData);
        }
        public getAttArr():Array<any> {
            var arr = [];
            arr.push({type: 2, name: "u_lightDir"});
            arr.push({type: 2, name: "u_lightColor"});
            return arr;
        }
    }
}