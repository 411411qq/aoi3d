module aoi {
    import EventBase = base.EventBase;
    export class TextureBase {
        protected texture:WebGLTexture;
        protected m_isReady:boolean;

        constructor() {
            GlobelConst.eventDispatcher.addEventListener(EventBase.CONTEXT_DISPOSE, this, this.onContextDispose);
            this.texture = null;
            this.m_isReady = false;
        }

        protected onContextDispose(event:EventBase):void {
            if (this.texture != null) {
                var gl:WebGLRenderingContext = GlobelConst.gl;
                gl.deleteTexture(this.texture);
                this.texture = null;
            }
        }

        public dispose():void {
            GlobelConst.eventDispatcher.removeEventListener(EventBase.CONTEXT_DISPOSE, this, this.onContextDispose);
            this.onContextDispose(null);
        }

        public get isReady():boolean {
            return this.m_isReady;
        }

        public set isReady(value:boolean) {
            this.m_isReady = value;
        }
        public getTextures(gl:WebGLRenderingContext):WebGLTexture {
            return null;
        }
    }
}