var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var aoi;
(function (aoi) {
    var TextureDrawerTexture = (function (_super) {
        __extends(TextureDrawerTexture, _super);
        function TextureDrawerTexture(w, h) {
            return _super.call(this, w, h) || this;
        }
        TextureDrawerTexture.prototype.drawTexture = function (gl, sourceTexture, collect) {
            var v = gl.getParameter(gl.VIEWPORT);
            this.beforeDraw(gl);
            gl.bindFramebuffer(gl.FRAMEBUFFER, this._frameBuffer);
            gl.viewport(0, 0, this._width, this._height);
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            if (TextureDrawerTexture.planeMesh == null) {
                var mesh = new aoi.Mesh(new aoi.PlaneGeometry(1, 1), null, false);
                TextureDrawerTexture.planeMesh = mesh;
            }
            var shader = collect.getShader();
            collect.active(gl);
            shader.render(gl, TextureDrawerTexture.planeMesh, null, aoi.Define.CAM_NORMAL, collect);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            this.afterDraw(gl);
            gl.viewport(v[0], v[1], v[2], v[3]);
        };
        return TextureDrawerTexture;
    }(aoi.FrameBufferTexture));
    aoi.TextureDrawerTexture = TextureDrawerTexture;
    __reflect(TextureDrawerTexture.prototype, "aoi.TextureDrawerTexture");
})(aoi || (aoi = {}));
//# sourceMappingURL=TextureDrawerTexture.js.map