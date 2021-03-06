module aoi {
    export class PlunginParticlePerturbation extends PlunginParticleBase {
        constructor(precision:number = 2) {
            super(precision);
            this._key = "ParPer";
            this.limitNum = 1;
            this.type = PlunginDefine.PARTICLE_PERTURBATION;
            this.txtIndex = 0;
            this._replaceType = PlunginDefine.REPLACE_MAIN;
            this._replaceWeight = 12;
        }
        public updateCode():void 
        {
            super.updateCode();
            this._fragmentCode.push(new OpenGlCodeVo(90000, this, this.genFramentCode_normal));
        }
        public active(gl:WebGLRenderingContext, subGeo:ISubGeometry, target:IRenderable, camera:ICamera, program:WebGLProgram, renderType:number):void {
            super.active(gl, subGeo, target, camera, program, renderType);
            let fbo:ObjectDrawerTexture = FrameBufferManager.instance.getFrameBufferObject(Define.FBO_PERTURBATION);
            gl.activeTexture(gl["TEXTURE" + this.txtIndex]);
            gl.bindTexture(gl.TEXTURE_2D, fbo.getTextures(gl));
            gl.uniform1i(program["u_Sampler"], this.txtIndex);
            gl.uniform4fv(program["u_Sampler_uv"], target.material.getOffsetData().elements);
        }
        private genFramentCode_normal():string
        {
            var str:string = "float mv = max(outcolor.x, outcolor.y);\n";
            str += "mv = max(mv, outcolor.z);\n";
            str += "if(mv > 1.0){\n";
            str += "outcolor.xyz = outcolor.xyz / mv;\n";
            str += "}\n";
            str += 'if(show == 1.0){\n';
            str += 'gl_FragColor = outcolor;\n';
            str += '}\n';
            str += '}\n';
            return str;
        }
    }
}