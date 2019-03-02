module aoi {
    import EventBase = base.EventBase;
    export class TextureDrawerTexture extends FrameBufferTexture {
        private static planeMesh:Mesh;
        constructor(w:number, h:number) 
        {
            super(w,h);
        }
        public drawTexture(gl:WebGLRenderingContext, sourceTexture:TextureBase, collect:PlunginCollecter):void
        {
            var v = gl.getParameter(gl.VIEWPORT);
            this.beforeDraw(gl);
            gl.bindFramebuffer(gl.FRAMEBUFFER, this._frameBuffer);
            gl.viewport(0, 0, this._width, this._height);

            gl.clearColor(1.0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            if(TextureDrawerTexture.planeMesh == null)
            {
                let mesh = new aoi.Mesh(new PlaneGeometry(2,2, Define.XY), null, false);
                TextureDrawerTexture.planeMesh = mesh;
            }
            collect.setCullState(gl.FRONT);
            TextureDrawerTexture.planeMesh.material = new Material(sourceTexture);
            var shader:AoiShader = collect.getShader();
            collect.active(gl);
            shader.render(gl, TextureDrawerTexture.planeMesh, null, Define.CAM_NORMAL, collect);

            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            this.afterDraw(gl);
            gl.viewport(v[0], v[1], v[2], v[3]);
        }
    }
}