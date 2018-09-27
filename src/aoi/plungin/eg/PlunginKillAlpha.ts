module aoi {
    /** 不渲染透明区域，可用AlphaTest代替(待测) */
    export class PlunginKillAlpha extends PlunginVoBase
    {
    	private _alphas:Float32Array;
    	constructor(type:number = 0, alpha:number = 0)
        {
            super();
            this.key = "ka";
            this.limitNum = 1;
            this.type = PlunginDefine.KILL_ALPHA;
            this._alphas = new Float32Array(2);
            this.setData(type, alpha);
        }
        public getAttArr() {
            var arr = [];
            arr.push({type: 2, name: "u_alphaKill"});
            return arr;
        }
        public active(gl:WebGLRenderingContext, subGeo:ISubGeometry, target:IRenderable, camera:ICamera, program:WebGLProgram, renderType:number):void {
            gl.uniform2fv(program["u_alphaKill"], this._alphas);
        }
        public setData(type:number = 0, alpha:number = 0):void
        {
        	this._alphas[0] = type;
        	this._alphas[1] = alpha;
        }
        public updateCode(renderType:number):void {
        	this._fragmentCode.push(new OpenGlCodeVo(0, this, this.genFramentCode1));
            this._fragmentCode.push(new OpenGlCodeVo(85000, this, this.genFramentCode2));
        }
        private genFramentCode1():string
        {
        	var str = 'uniform vec2 u_alphaKill;\n';
            return str;
        }
        private genFramentCode2():string
        {
        	var str = 'if(u_alphaKill.x == 0.0 && outcolor.w < u_alphaKill.y){\n' + 
        	'discard;\n' +
        	'}\n'+
        	'if(u_alphaKill.x == 1.0 && outcolor.w != u_alphaKill.y){\n' + 
        	'discard;\n' +
        	'}\n'+
        	'if(u_alphaKill.x == 2.0 && outcolor.w > u_alphaKill.y){\n' + 
        	'discard;\n' +
        	'}\n';
            return str;
        }
    }
}