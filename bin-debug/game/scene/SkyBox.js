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
    var SkyBox = (function (_super) {
        __extends(SkyBox, _super);
        function SkyBox(urls, size) {
            var _this = _super.call(this, null, null, false) || this;
            _this.loadedNum = 0;
            _this.urls = urls;
            _this.reses = [];
            _this.size = size;
            _this.loadImages();
            return _this;
        }
        SkyBox.prototype.loadImages = function () {
            var len = this.urls.length;
            this.loadedNum = 0;
            for (var i = 0; i < len; i++) {
                aoi.AssetManager.instance.fetch(this.urls[i], aoi.AssetDefine.ASSET_IMG, this, this.onImageLoaded, i);
            }
        };
        SkyBox.prototype.onImageLoaded = function (param, obj) {
            var index = obj;
            var res = aoi.AssetManager.instance.gain(param.path, "SkyBox");
            this.reses[index] = res;
            this.loadedNum++;
            if (this.loadedNum == this.urls.length) {
                var imgs = [];
                for (var i = 0; i < this.urls.length; i++) {
                    imgs.push(this.reses[i].img);
                }
                this.cubeTexture = new aoi.CubeTexture(imgs);
                this.setShowInCameraState(aoi.Define.CAM_NORMAL, true);
                this.geometry = new aoi.CubeGeometry(this.size, this.size, this.size);
                this.material = new aoi.Material(this.cubeTexture);
                this.addPlugin(new aoi.PlunginSkyBox());
                this.addPlugin(new aoi.PlunginGray());
                this.pluginCollector.setParamMode(aoi.PlunginDefine.NORMAL, false, true, true);
            }
        };
        return SkyBox;
    }(aoi.Mesh));
    aoi.SkyBox = SkyBox;
    __reflect(SkyBox.prototype, "aoi.SkyBox");
})(aoi || (aoi = {}));
//# sourceMappingURL=SkyBox.js.map