module aoi {
    var OpenGlCodeVo = aoi.OpenGlCodeVo;
    var PlunginCollecter = aoi.PlunginCollecter;
    export class PlunginVoBase implements IPlunginVo {
        public pColloct:PlunginCollecter;
        protected _vertexCode:Array<OpenGlCodeVo>;
        protected _fragmentCode:Array<OpenGlCodeVo>;
        protected _lastFrame:number;
        public priority:number;
        public index:number;
        public type:number;
        protected _key:string;
        public limitNum:number;
        public txtIndex:number;
        protected _replaceType:number = 0;
        protected _replaceWeight:number = 0;

        constructor() {
            this.pColloct = null;
            this._vertexCode = null;
            this._fragmentCode = null;
            this.priority = 0;
            this.index = 0;
            this.type = 0;
            this._key = "";
            this.limitNum = 1;
        }
        public get key():string
        {
            return this._key;
        }
        protected getParamName(pName:string):string
        {
            return pName + this.index;
        }
        private _updateCode():void {
            //if (this._vertexCode == null || this._fragmentCode == null) {
                this._vertexCode = [];
                this._fragmentCode = [];
                this.updateCode();
            //}
        }
        public getReplaceType():number
        {
            return this._replaceType;
        }
        public getReplaceWeight():number
        {
            return this._replaceWeight;
        }
        protected updateCode():void {

        }

        public getVertexCode():Array<OpenGlCodeVo> {
            this._updateCode();
            return this._vertexCode;
        }

        public getFragmentCode():Array<OpenGlCodeVo> {
            this._updateCode();
            return this._fragmentCode;
        }

        public active(gl:WebGLRenderingContext, subGeo:ISubGeometry, target:IRenderable, camera:ICamera, program:WebGLProgram,renderType:number):void {

        }
        public endPlungin():void
        {
            this._lastFrame = GlobelConst.frameNum;
        }
        public disactive(gl:WebGLRenderingContext, program:WebGLProgram):void {

        }

        public getAttArr():Array<any> {
            return null;
        }

        public getPrePlungin():Array<IPlunginVo>
        {
            return null;
        }

        public dispose():void {
            this.pColloct = null;
            this._vertexCode = null;
            this._fragmentCode = null;
            this.priority = 0;
            this.index = 0;
        }

        public genTextureIndex():void {

        }

        public initAttributeVariable(gl:WebGLRenderingContext, a_attribute:number,
        buffer:WebGLBuffer, num:number, stride:number, offset:number, type:number = null, nor:boolean = false):void {
            type = type == null ? gl.FLOAT : type;
            gl.vertexAttribPointer(a_attribute, num, type, nor, stride, offset);
            gl.enableVertexAttribArray(a_attribute);
        }
    }
}