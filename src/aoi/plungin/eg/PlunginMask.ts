module aoi {
    /** 2D界面的遮罩 */
    export class PlunginMask extends PlunginVoBase
    {
        private _rect:Float32Array;
        private _uicontainer:Object3DContainer;
        constructor() {
            super();
            this._key = "mask";
            this.type = PlunginDefine.MASK;
            this.limitNum = 1;
            this._rect = new Float32Array(4);
        }
        public updateCode(renderType:number):void {
            this._vertexCode.push(new OpenGlCodeVo(2, this, this.genVertexCode1));
            this._vertexCode.push(new OpenGlCodeVo(80000, this, this.genVertexCode2));
            this._fragmentCode.push(new OpenGlCodeVo(30001, this, this.genFramentCode1));
            this._fragmentCode.push(new OpenGlCodeVo(80001, this, this.genFramentCode2));
        }
        public setRect(x:number, y:number, width:number, height:number, container:Object3DContainer)
        {
            this._rect[0] = x;
            this._rect[1] = y;
            this._rect[2] = width + x;
            this._rect[3] = height + y;
            this._uicontainer = container;
        }
        private get rect():Float32Array
        {
            return this._rect;
        }
        public active(gl:WebGLRenderingContext, subGeo:ISubGeometry, target:IRenderable, camera:ICamera, program:WebGLProgram, renderType:number):void
        {
            gl.uniformMatrix4fv(program["u_MaskMatrix"], false, this._uicontainer.sceneTransform.elements);
            gl.uniform4fv(program["u_Rect"], this._rect);
        }
        private genFramentCode1():string
        {
            var str:string = 'varying vec4 v_WorldPos;\n' +
                'uniform vec4 u_Rect;\n';
            return str;
        }
        private genFramentCode2():string
        {
            var str:string = 'if(v_WorldPos.x < u_Rect.x || v_WorldPos.x > u_Rect.z || v_WorldPos.y < u_Rect.y || v_WorldPos.y > u_Rect.w){\n' +
                'show = 0.0;\n' +
                '}\n';
            return str;
        }
        private genVertexCode1():string
        {
            var str:string ='varying vec4 v_WorldPos;\n' +
                'uniform mat4 u_MaskMatrix;\n';
            return str;
        }
        private genVertexCode2():string
        {
            return "vec4 v_wPos = u_ModelMatrix * a_Position;\n" +
                "v_WorldPos = u_MaskMatrix * v_wPos;\n";
        }
        public getAttArr():Array<any> {
            var arr = [];
            arr.push({type: 2, name: "u_MaskMatrix"});
            arr.push({type: 2, name: "u_Rect"});
            return arr;
        }
        public isSame(value:PlunginMask):boolean
        {
            var r:Float32Array = value.rect;
            return (r[0] == this._rect[0] && r[1] == this._rect[1] && r[2] == this._rect[2] && r[3] == this._rect[3]);
        }
        public clone():PlunginMask
        {
            var p:PlunginMask = new PlunginMask();
            p.setRect(this._rect[0], this._rect[1], this._rect[2], this._rect[3], this._uicontainer);
            return p;
        }
    }
}