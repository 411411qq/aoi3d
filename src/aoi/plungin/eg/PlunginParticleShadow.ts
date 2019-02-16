module aoi {
    /** 粒子基础 */
    export class PlunginParticleShadow extends PlunginParticleBase {
        private shadowVar:math.Vector3D;
        constructor() {
            super();
            this._key = "ParShdow";
            this.limitNum = 1;
            this.type = PlunginDefine.PARTICLE_SHADOW;
            this.txtIndex = 0;
            this.shadowVar = new math.Vector3D();
        }
        public getAttArr():Array<any> {
            var arr = super.getAttArr();
            arr.push({type: 2, name: "u_shadowVar"});
            return arr;
        }
        public updateCode():void 
        {
            super.updateCode();
            this._fragmentCode.push(new OpenGlCodeVo(30001, this, this.genFramentCode2_shadow));
            this._fragmentCode.push(new OpenGlCodeVo(90000, this, this.genFramentCode_shadow));
        }
        public active(gl:WebGLRenderingContext, subGeo:ISubGeometry, target:IRenderable, camera:ICamera, program:WebGLProgram, renderType:number):void {
            super.active(gl, subGeo, target, camera, program, renderType);
            gl.activeTexture(gl["TEXTURE" + this.txtIndex]);
            gl.bindTexture(gl.TEXTURE_2D, target.material.getTextures(gl));
            gl.uniform1i(program["u_Sampler"], this.txtIndex);
            gl.uniform4fv(program["u_Sampler_uv"], target.material.getOffsetData().elements);
            if(camera.projection.type == 1)
            {
                this.shadowVar.x = 1;
            }
            else
            {
                this.shadowVar.x = camera.projection.far;
            }
            gl.uniform4fv(program["u_shadowVar"], this.shadowVar.elements);
        }
        private genFramentCode2_shadow():string {
            var str:string = 'uniform vec4 u_shadowVar;\n';
            return str;
        }
        private genFramentCode_shadow():string
        {
            var str:string = "float mv = max(outcolor.x, outcolor.y);\n";
            str += "mv = max(mv, outcolor.z);\n";
            str += "if(mv > 1.0){\n";
            str += "outcolor.xyz = outcolor.xyz / mv;\n";
            str += "}\n";
            str += 'if(show == 1.0){\n';
            str += 'gl_FragColor = vec4(v_wpos.z / u_shadowVar.x, outcolor.w, v_wpos.z / u_shadowVar.x, 0.0);\n';
            str += '}\n';
            str += '}\n';
            return str;
        }
    }
}