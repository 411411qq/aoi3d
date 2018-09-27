module aoi {
    import EventBase = base.EventBase;
    export class ShaderManager {
        private static _instance:ShaderManager;
        public static get instance():ShaderManager {
            if (ShaderManager._instance == null) {
                ShaderManager._instance = new ShaderManager()
            }
            return ShaderManager._instance;
        }

        private shaderCache:Object;

        constructor() {
            this.shaderCache = {};
            GlobelConst.eventDispatcher.addEventListener(EventBase.CONTEXT_DISPOSE, this, this.onContxtDispose)
        }

        public getShader(plunginCollocter:PlunginCollecter, renderType:number):AoiShader {
            var str = plunginCollocter.getShaderKey(renderType);
            if (this.shaderCache[str] == null) {
                var shader = this.createShader(plunginCollocter, renderType);
                this.shaderCache[str] = shader;
            }
            return this.shaderCache[str];
        }

        private createShader(plunginCollocter:PlunginCollecter, renderType:number):AoiShader {
            var shader:AoiShader = new AoiShader(plunginCollocter.getShaderKey(renderType));
            shader.generateCode(plunginCollocter, renderType);
            return shader;
        }

        public dispose():void {
            this.onContxtDispose(null);
        }

        private onContxtDispose(event:EventBase):void {

        }

    }
}