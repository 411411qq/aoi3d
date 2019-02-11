module aoi {
    /** 当前视图矩阵 */
    export class PlunginViewMatrix extends PlunginVoBase{
        constructor()
        {
            super();
            this.key = "vm";
            this.limitNum = 1;
            this.type = PlunginDefine.VIEW_MATRIX;
        }
        public getPrePlungin():Array<IPlunginVo>
        {
            var arr = new Array<IPlunginVo>();
            arr.push(new aoi.PlunginModelMatrix());
            return arr;
        }
        public updateCode(renderType:number):void 
        {
            this._vertexCode.push(new OpenGlCodeVo(2, this, this.genVertexCode1));

            this._fragmentCode.push(new OpenGlCodeVo(30004, this, this.genFramentCode1));
        }
        private genVertexCode1():string {
            var str:string = 'uniform mat4 u_ViewMatrix;\n';
            str += "varying mat4 v_ViewMatrix;\n";
            return str;
        }
        private genFramentCode1():string
        {
            var str:string = 'varying mat4 v_ViewMatrix;\n';
            return str;
        }
        public active(gl:WebGLRenderingContext, subGeo:ISubGeometry, target:IRenderable, camera:ICamera, program:WebGLProgram, renderType:number):void
        {
            if(this._lastFrame != GlobelConst.frameNum)
            {
                var mm:math.Matrix4 = aoi.GlobelConst.view.camera.transform;
                gl.uniformMatrix4fv(program["u_ViewMatrix"], false, mm.elements);
            }
        }
        public getAttArr():Array<any> {
            var arr = [];
            arr.push({type: 2, name: "u_ViewMatrix"});
            return arr;
        }
    }
}