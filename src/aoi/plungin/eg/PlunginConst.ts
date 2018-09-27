module aoi {
    /** 通用常数, x：时间(秒)*/
    export class PlunginConst extends PlunginVoBase{
        private constData:math.Vector3D;
        private startTime:number;
        constructor()
        {
            super();
            this.key = "const";
            this.limitNum = 1;
            this.type = PlunginDefine.C_CONST;
            this.txtIndex = 0;
            this.constData = new math.Vector3D(0,0,0,0);
            this.startTime = GlobelConst.nowTime;
        }
        public getAttArr():Array<any> {
            var arr = [];
            arr.push({type: 2, name: "u_const"});
            return arr;
        }
        public active(gl:WebGLRenderingContext, subGeo:ISubGeometry, target:IRenderable, camera:ICamera, program:WebGLProgram, renderType:number):void {
            this.constData.x = (GlobelConst.nowTime - this.startTime) * 0.001;
            gl.uniform4fv(program["u_const"], this.constData.elements);
        }
        public updateCode(renderType:number):void {
            this._vertexCode.push(new OpenGlCodeVo(100, this, this.genVertexCode1));
            this._vertexCode.push(new OpenGlCodeVo(70400, this, this.genVertexCode2));

            this._fragmentCode.push(new OpenGlCodeVo(30700, this, this.genFramentCode1));
        }
        private genVertexCode1():string
        {
            var str:string = "uniform vec4 u_const;\n";
            str += "varying vec4 v_const;\n";
            return str;
        }
        private genVertexCode2():string
        {
            var str:string = "v_const = u_const;\n";
            return str;
        }
        private genFramentCode1():string
        {
            var str:string = "varying vec4 v_const;\n";
            return str;
        }
    }
}