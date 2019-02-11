module aoi {
    /** 颜色变化 */
    export class PlunginColorChange extends PlunginVoBase {
        static ADD:number = 1;
        static MUL:number = 2;
        private _color:Float32Array;
        private _blend_type:number;
        constructor(b_type:number = 2) {
            super();
            this._blend_type = b_type;
            this._key = "color_c" + b_type;
            this.limitNum = 1;
            this.type = PlunginDefine.COLOR_CHANGE;
            this._color = new Float32Array(4);
        }
        public setColor(r:number, g:number, b:number, a:number)
        {
            this._color[0] = r;
            this._color[1] = g;
            this._color[2] = b;
            this._color[3] = a;
        }
        public getAttArr():Array<any> {
            var arr = [];
            arr.push({type: 2, name: "u_Color"});
            return arr;
        }
        public updateCode(renderType:number):void {
            this._fragmentCode.push(new OpenGlCodeVo(30002, this, this.genFramentCode1));
            this._fragmentCode.push(new OpenGlCodeVo(85001, this, this.genFramentCode2));
        }
        private genFramentCode1():string
        {
            var str:string = 'uniform vec4 u_Color;\n';
            return str;
        }
        private genFramentCode2():string
        {
            var str:string = "";
            if(this._blend_type == PlunginColorChange.ADD)
            {
                str = "outcolor.xyz = outcolor.xyz + u_Color.xyz;\n";
            }
            else if(this._blend_type == PlunginColorChange.MUL)
            {
                str = "outcolor.xyzw = outcolor.xyzw * u_Color.xyzw;\n";
            }
            return str;
        }
        public active(gl:WebGLRenderingContext, subGeo:ISubGeometry, target:IRenderable, camera:ICamera, program:WebGLProgram, renderType:number):void 
        {
            gl.uniform4fv(program["u_Color"], this._color);
        }
    }
}