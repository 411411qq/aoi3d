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
    var ObjectDrawerTexture = (function (_super) {
        __extends(ObjectDrawerTexture, _super);
        function ObjectDrawerTexture(type, w, h, cam) {
            var _this = _super.call(this, w, h) || this;
            _this._camera = cam;
            _this._type = type;
            _this._clearColor = new math.Vector3D(0.5, 0.5, 0.5, 1.0);
            return _this;
        }
        ObjectDrawerTexture.prototype.setClearColor = function (r, g, b, a) {
            this._clearColor.x = r;
            this._clearColor.y = g;
            this._clearColor.z = b;
            this._clearColor.w = a;
        };
        Object.defineProperty(ObjectDrawerTexture.prototype, "type", {
            get: function () {
                return this._type;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ObjectDrawerTexture.prototype, "camera", {
            get: function () {
                return this._camera;
            },
            enumerable: true,
            configurable: true
        });
        ObjectDrawerTexture.prototype.drawFrameBuffer = function (gl, container, renderType) {
            this.beforeDraw(gl);
            gl.bindFramebuffer(gl.FRAMEBUFFER, this._frameBuffer);
            gl.viewport(0, 0, this._width, this._height);
            gl.clearColor(this._clearColor.x, this._clearColor.y, this._clearColor.z, this._clearColor.w);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            var rList = null;
            rList = aoi.RenderCollecter.instance.getRenderList(renderType);
            container.createRenderList(gl, this._camera, renderType, rList, true);
            rList.doRender(gl, this._camera, renderType);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            this.afterDraw(gl);
        };
        return ObjectDrawerTexture;
    }(aoi.FrameBufferTexture));
    aoi.ObjectDrawerTexture = ObjectDrawerTexture;
    __reflect(ObjectDrawerTexture.prototype, "aoi.ObjectDrawerTexture");
})(aoi || (aoi = {}));
//# sourceMappingURL=ObjectDrawerTexture.js.map