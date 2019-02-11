module aoi {
    /** 摄像机位置 */
    export class PlunginEyePos extends PlunginVoBase{
        private constData:math.Vector3D;
        private startTime:number;
        constructor()
        {
            super();
            this._key = "eye";
            this.limitNum = 1;
            this.type = PlunginDefine.EYE_POS;
            this.txtIndex = 0;
            this.startTime = GlobelConst.nowTime;
        }
        public getAttArr():Array<any> {
            var arr = [];
            arr.push({type: 2, name: "u_eye"});
            return arr;
        }
        public active(gl:WebGLRenderingContext, subGeo:ISubGeometry, target:IRenderable, camera:ICamera, program:WebGLProgram, renderType:number):void 
        {
            if(this._lastFrame != GlobelConst.frameNum)
            {
                var eyePos:math.Vector3D = GlobelConst.view.camera.position;
                gl.uniform4fv(program["u_eye"], eyePos.elements);
            }
        }
        public updateCode(renderType:number):void 
        {
            this._vertexCode.push(new OpenGlCodeVo(101, this, this.genVertexCode1));
            this._vertexCode.push(new OpenGlCodeVo(70401, this, this.genVertexCode2));

            this._fragmentCode.push(new OpenGlCodeVo(30701, this, this.genFramentCode1));
        }
        private genVertexCode1():string
        {
            var str:string = "uniform vec4 u_eye;\n";
            str += "varying vec4 v_eye;\n";
            return str;
        }
        private genVertexCode2():string
        {
            var str:string = "v_eye = u_eye;\n";
            return str;
        }
        private genFramentCode1():string
        {
            var str:string = "varying vec4 v_eye;\n";
            return str;
        }
    }
}