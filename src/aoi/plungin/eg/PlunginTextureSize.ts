module aoi {
    /** 贴图尺寸 */
    export class PlunginTextureSize extends PlunginVoBase
    {
        private _size:Float32Array;
        constructor(type:number = 0, alpha:number = 0)
        {
            super();
            this.key = "t_size";
            this.limitNum = 1;
            this.type = PlunginDefine.TEXTURE_SIZE;
            this._size = new Float32Array(2);
        }
        public getAttArr() {
            var arr = [];
            arr.push({type: 2, name: "u_textureSize"});
            return arr;
        }
        public active(gl:WebGLRenderingContext, subGeo:ISubGeometry, target:IRenderable, camera:ICamera, program:WebGLProgram, renderType:number):void {
            var vec:math.Vector2D = target.material.getSize();
            this._size[0] = vec.x;
            this._size[1] = vec.x;
            gl.uniform2fv(program["u_textureSize"], this._size);
        }
        public updateCode(renderType:number):void {
        	this._fragmentCode.push(new OpenGlCodeVo(51, this, this.genFramentCode1));
        }
        private genFramentCode1():string
        {
        	var str = 'uniform vec2 u_textureSize;\n';
            return str;
        }
    }
}
