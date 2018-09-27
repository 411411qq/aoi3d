module aoi {
    /** 粒子基础 */
    export class PlunginParticle extends PlunginVoBase {
        private shadowVar:math.Vector3D;
        constructor() {
            super();
            this.key = "Particle";
            this.limitNum = 1;
            this.type = PlunginDefine.SIMPLE;
            this.txtIndex = 0;
            this.shadowVar = new math.Vector3D();
        }

        public getPrePlungin():Array<IPlunginVo>
        {
            var arr = new Array<IPlunginVo>();
            arr.push(new aoi.PlunginCaculateUV());
            return arr;
        }

        public updateCode(renderType:number):void {
            this._vertexCode.push(new OpenGlCodeVo(0, this, this.genVertexCode1));
            this._vertexCode.push(new OpenGlCodeVo(20000, this, this.genVertexCode2));
            this._vertexCode.push(new OpenGlCodeVo(30000, this, this.genVertexCode3));
            this._vertexCode.push(new OpenGlCodeVo(50000, this, this.genVertexCode4));
            this._vertexCode.push(new OpenGlCodeVo(70000, this, this.genVertexCode5));
            this._vertexCode.push(new OpenGlCodeVo(90000, this, this.genVertexCode6));

            this._fragmentCode.push(new OpenGlCodeVo(0, this, this.genFramentCode1));
            this._fragmentCode.push(new OpenGlCodeVo(30000, this, this.genFramentCode2));
            if(renderType == Define.CAM_SHADOW)
            {
                this._fragmentCode.push(new OpenGlCodeVo(30001, this, this.genFramentCode2_shadow));
            }
            this._fragmentCode.push(new OpenGlCodeVo(50000, this, this.genFramentCode3));
            this._fragmentCode.push(new OpenGlCodeVo(70000, this, this.genFramentCode4));
            if(renderType == Define.CAM_SHADOW)
            {
                this._fragmentCode.push(new OpenGlCodeVo(90000, this, this.genFramentCode_shadow));
            }
            else
            {
                this._fragmentCode.push(new OpenGlCodeVo(90000, this, this.genFramentCode_normal));
            }
        }

        public disactive(gl:WebGLRenderingContext, program:WebGLProgram):void {
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            gl.disableVertexAttribArray(program["a_Position"]);
            gl.disableVertexAttribArray(program["a_TexCoord"]);
            gl.disableVertexAttribArray(program["a_Time"]);
            gl.disableVertexAttribArray(program["a_Offset"]);
        }

        public active(gl:WebGLRenderingContext, subGeo:ISubGeometry, target:IRenderable, camera:ICamera, program:WebGLProgram, renderType:number):void {
            var buffer:WebGLBuffer = subGeo.getVertexBuffer(gl), FSIZE = subGeo.bytesPerEle, perLen = subGeo.vertexStride;
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

            this.initAttributeVariable(gl, program["a_Position"], buffer, 4, FSIZE * perLen, 0);
            this.initAttributeVariable(gl, program["a_TexCoord"], buffer, 2, FSIZE * perLen, FSIZE * 4);
            this.initAttributeVariable(gl, program["a_Offset"], buffer, 3, FSIZE * perLen, FSIZE * 6);
            this.initAttributeVariable(gl, program["a_Time"], buffer, 3, FSIZE * perLen, FSIZE * 9);

            if(target.pluginCollector.hasPlugin(PlunginDefine.PERTURBATION) == false)
            {
                gl.activeTexture(gl["TEXTURE" + this.txtIndex]);
                gl.bindTexture(gl.TEXTURE_2D, target.material.getTextures(gl));
                gl.uniform1i(program["u_Sampler"], this.txtIndex);
                gl.uniform4fv(program["u_Sampler_uv"], target.material.getOffsetData().elements);
            }
            else
            {
                let fbo:FrameBufferObject = FrameBufferManager.instance.getFrameBufferObject(Define.FBO_PERTURBATION);
                gl.activeTexture(gl["TEXTURE" + this.txtIndex]);
                gl.bindTexture(gl.TEXTURE_2D, fbo.texture);
                gl.uniform1i(program["u_Sampler"], this.txtIndex);
                gl.uniform4fv(program["u_Sampler_uv"], target.material.getOffsetData().elements);
            }

            gl.uniformMatrix4fv(program["u_MvpMatrix"], false, target.getFinalMatrix().elements);

            var allPastTime = target.animatorData.pastTime * target.animatorData.playSpeed / 100;
            var an = target.geometry.animator;
            var pastTime;
            allPastTime += 0;
            if (an["reverse"] == true) {
                pastTime = (an["reverseTime"] - allPastTime) / 1000;
            }
            else {
                pastTime = allPastTime / 1000;
            }
            pastTime = pastTime % 500000;
            gl.uniform4f(program["u_nowTime"], 0.0, an["lifeTime"] * 1.0, pastTime, 1.0);

            if(renderType == Define.CAM_SHADOW)
            {
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
        }

        public getAttArr() {
            var arr = [];
            arr.push({type: 1, name: "a_Position"});
            arr.push({type: 1, name: "a_TexCoord"});
            arr.push({type: 1, name: "a_Time"});
            arr.push({type: 1, name: "a_Offset"});
            arr.push({type: 2, name: "u_MvpMatrix"});
            arr.push({type: 2, name: "u_nowTime"});
            arr.push({type: 2, name: "u_Sampler"});
            arr.push({type: 2, name: "u_Sampler_uv"});
            return arr;
        }

        public genTextureIndex() {
            this.txtIndex = this.pColloct.getTextureObj();
        }

        public genVertexCode1() {
            var str = 'attribute vec4 a_Position;\n' +
                'attribute vec2 a_TexCoord;\n' +
                'attribute vec4 a_q;\n' +
                'attribute vec3 a_Time;\n' +
                'attribute vec3 a_Offset;\n' +
                'uniform vec4 u_nowTime;\n' +
                'uniform mat4 u_MvpMatrix;\n' +
                'varying vec4 v_Time;\n' +
                'uniform vec4 u_Sampler_uv;\n' +
                'varying vec2 v_TexCoord;\n';
            return str;
        }

        public genVertexCode2() {
            //u_nowTime 整体时间相关 x:0,y:lifeTime,z:特效显示时间，w:1.0
            //a_Time 粒子时间相关, x:隐藏时间，y:显示时间，z:总周期
            //time 计算后时间相关, x:当前生命周期经过时间，y:当前显示之后经过时间, z:当前显示时间百分比,w:当前粒子是否显示
            var str = 'void main() {\n'+
                'vec2 n_TexCoord = calUvOffset(a_TexCoord, u_Sampler_uv);\n' + 
                'vec4 n_Position = vec4(a_Position.xyz, 1.0);\n' + 
                'float index = a_Position.w;\n' + 
                'vec4 time = vec4(0,0,0,1);\n' +
                'time.x = fract(u_nowTime.z / a_Time.z);\n' +
                'time.x = time.x * a_Time.z;\n' +
                'time.y = time.x - a_Time.x;\n' +
                'time.z = time.y / a_Time.y;\n' +
                'if(time.x > a_Time.x && time.x < a_Time.z){\n' +
                'time.w = 1.0;\n' +
                '}else{\n' +
                'time.w = 0.0;\n' +
                '}\n';
            return str;
        }
        public genVertexCode3() {
            var str = 'n_Position.xyz = n_Position.xyz + a_Offset.xyz;\n';
            return str;
        }
        public genVertexCode4() {
            var str = "";
            str += "vec4 endPos = u_MvpMatrix * n_Position;\n";
            str += "gl_Position = endPos;\n";
            return str;
        }
        public genVertexCode5() {
            var str = '  v_TexCoord = n_TexCoord;\n' +
                'v_Time = time;\n';
            return str;
        }
        public genVertexCode6() {
            var str = '}\n';
            return str;
        }
        public genFramentCode1() {
            var str = '#ifdef GL_ES\n' +
                'precision mediump float;\n' +
                '#endif\n';
            return str;
        }
        public genFramentCode2() {
            var str = 'varying vec2 v_TexCoord;\n' +
                'varying vec4 v_Time;\n' +
                'uniform sampler2D u_Sampler;\n';
            return str;
        }
        private genFramentCode2_shadow():string {
            var str:string = 'uniform vec4 u_shadowVar;\n';
            return str;
        }
        public genFramentCode3() {
            var str = 'void main() {\n';
            str += "float show = 1.0;\n";
            str += "vec2 texCoord = v_TexCoord;\n";
            return str;
        }

        public genFramentCode4() {
            var str = '  vec4 outcolor = texture2D(u_Sampler, texCoord);\n';
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