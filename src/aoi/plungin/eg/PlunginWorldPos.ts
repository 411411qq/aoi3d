module aoi {
    /** 顶点的世界坐标 */
    export class PlunginWorldPos extends PlunginVoBase{
        constructor()
        {
            super();
            this._key = "wp";
            this.limitNum = 1;
            this.type = PlunginDefine.WORLD_POS;
            this.txtIndex = 0;
        }
        public getPrePlungin():Array<IPlunginVo>
        {
            var arr = new Array<IPlunginVo>();
            arr.push(new aoi.PlunginModelMatrix());
            return arr;
        }
        public updateCode(renderType:number):void 
        {
            this._vertexCode.push(new OpenGlCodeVo(201, this, this.genVertexCode1));
            this._vertexCode.push(new OpenGlCodeVo(49301, this, this.genVertexCode2));

            this._fragmentCode.push(new OpenGlCodeVo(30003, this, this.genFramentCode1));
        }
        private genVertexCode1():string
        {
            let str:string = "";
            str += "varying vec4 v_wpos;\n";
            return str;
        }
        private genVertexCode2():string
        {
            let str:string = "";
            str += "v_wpos = u_MvpMatrix * n_Position;\n";
            return str;
        }
        private genFramentCode1():string
        {
            var str:string = '';
            str += 'varying vec4 v_wpos;\n';
            return str;
        }
    }
}