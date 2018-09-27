module aoi {
    export class PlunginRecieveShadow extends PlunginVoBase {
        private reShadowVar:math.Vector3D;
        constructor() {
            super();
            this.key = "r_s";
            this.type = PlunginDefine.RECIEVE_SHADOW;
            this.limitNum = 1;
            this.txtIndex = 0;
            this.reShadowVar = new math.Vector3D();
        }
        public setShadowFar(shadowEpsilon:number, shadowDark:number):void
        {
            this.reShadowVar.y = shadowEpsilon;
            this.reShadowVar.z = shadowDark;
        }
        public getAttArr() {
            var arr = [];
            arr.push({type: 2, name: "u_ShadowMap"});
            arr.push({type: 2, name: "u_MvpMatrixLight"});
            arr.push({type: 2, name: "u_reShadowVar"});
            return arr;
        }
        public genTextureIndex():void {
            this.txtIndex = this.pColloct.getTextureObj();
        }
        public active(gl:WebGLRenderingContext, subGeo:ISubGeometry, target:IRenderable, camera:ICamera, program:WebGLProgram, renderType:number):void 
        {
            let fbo:FrameBufferObject = FrameBufferManager.instance.getFrameBufferObject(Define.FBO_SHADOW);
            if(fbo != null && renderType == Define.CAM_NORMAL)
            {
                gl.activeTexture(gl["TEXTURE" + this.txtIndex]);
                gl.bindTexture(gl.TEXTURE_2D, fbo.texture);
                gl.uniform1i(program["u_ShadowMap"], this.txtIndex);

                let mvpLight:math.Matrix4 = new math.Matrix4();
                mvpLight.identity();
                mvpLight.append(target.sceneTransform);
                mvpLight.append(fbo.camera.viewProjection);
                gl.uniformMatrix4fv(program["u_MvpMatrixLight"], false, mvpLight.elements);

                if(fbo.camera.projection.type == 1)
                {
                    this.reShadowVar.x = 1;
                    this.reShadowVar.w = 0.005;
                }
                else
                {
                    this.reShadowVar.x = camera.projection.far;
                    this.reShadowVar.w = 2.0;
                }
                gl.uniform4fv(program["u_reShadowVar"], this.reShadowVar.elements);
            }
        }
        public updateCode(renderType:number):void 
        {
            if(renderType != Define.CAM_SHADOW)
            {
                this._vertexCode.push(new OpenGlCodeVo(100, this, this.genVertexCode1));
                this._vertexCode.push(new OpenGlCodeVo(50100, this, this.genVertexCode2));

                this._fragmentCode.push(new OpenGlCodeVo(100, this, this.genFramentCode1));
                this._fragmentCode.push(new OpenGlCodeVo(30100, this, this.genFramentCode2));
                this._fragmentCode.push(new OpenGlCodeVo(88000, this, this.genFramentCode3));
            }
        }
        private genVertexCode1():string
        {
            var str:string = "";
            str += "uniform mat4 u_MvpMatrixLight;\n";
            str += "varying vec4 v_PositionFromLight;\n";
            return str;
        }
        private genVertexCode2():string
        {
            var str:string = "";
            str += "v_PositionFromLight = u_MvpMatrixLight * n_Position;\n";
            return str;
        }
        private genFramentCode1():string
        {
            var str:string = "";
            str += "float calShadowFun(vec3 txtCoord, sampler2D sTxt, vec2 offset, vec4 rvar, vec4 posFromLight){\n";
            str += "vec4 rgbaDepth = texture2D(sTxt, txtCoord.xy + offset);\n";
            str += "float depth = rgbaDepth.x * rvar.x * rvar.y;\n";
            str += "float visibility = (posFromLight.z > depth + rvar.w) ? rvar.z : 1.0;\n";
            str += "return visibility;\n";
            str += "}\n";
            return str;
        }
        private genFramentCode2():string
        {
            var str:string = "";
            str += "varying vec4 v_PositionFromLight;\n";
            str += "uniform sampler2D u_ShadowMap;\n";
            str += "uniform vec4 u_reShadowVar;\n";
            return str;
        }
        
        private genFramentCode3():string
        {
            var str:string = "";
            str += "vec3 shadowCoord = (v_PositionFromLight.xyz/v_PositionFromLight.w) * 0.5 + 0.5;\n";

            str += "float vvv = 0.0;\n";
/*
            str += "float an = 2.0 * 3.14 / 10.0;\n";
            str += "for(float i = 0.0; i < 10.0; i++){\n";
            str += "vec2 offsetVec = vec2(u_reShadowVar.w * sin(an * i), u_reShadowVar.w * cos(an * i));\n";
            str += "float v = calShadowFun(shadowCoord, u_ShadowMap, offsetVec, u_reShadowVar, v_PositionFromLight);\n";
            str += "vvv = vvv + v;\n";
            str += "}\n";
*/
            str += "vvv = vvv + calShadowFun(shadowCoord, u_ShadowMap, vec2(0.0,0.0), u_reShadowVar, v_PositionFromLight);\n";

            str += "outcolor = vec4(outcolor.rgb * vvv, outcolor.a);\n";
            return str;
        }
    }
}