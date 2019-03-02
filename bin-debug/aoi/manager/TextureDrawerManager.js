var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var aoi;
(function (aoi) {
    var TextureDrawerManager = (function () {
        function TextureDrawerManager() {
            this._dic = {};
        }
        Object.defineProperty(TextureDrawerManager, "instance", {
            get: function () {
                if (TextureDrawerManager._instance == null) {
                    TextureDrawerManager._instance = new TextureDrawerManager();
                }
                return TextureDrawerManager._instance;
            },
            enumerable: true,
            configurable: true
        });
        TextureDrawerManager.prototype.doDraw = function (gl) {
            for (var key in this._dic) {
                var data = this._dic[key];
                data.drawList(gl);
            }
        };
        TextureDrawerManager.prototype.genTextureDrawList = function () {
            var texture = new TextureDrawList();
            this._dic[texture.id] = texture;
            return texture;
        };
        TextureDrawerManager.prototype.disposeTexture = function (id) {
            if (this._dic[id] != null) {
                var texture = this._dic[id];
                delete this._dic[id];
                texture.dispose();
            }
        };
        TextureDrawerManager.prototype.dispose = function () {
            for (var key in this._dic) {
                var data = this._dic[key];
                data.dispose();
            }
            this._dic = {};
        };
        return TextureDrawerManager;
    }());
    aoi.TextureDrawerManager = TextureDrawerManager;
    __reflect(TextureDrawerManager.prototype, "aoi.TextureDrawerManager");
    var TextureDrawList = (function () {
        function TextureDrawList() {
            this._id = 0;
            this._list = [];
            TextureDrawList.gid++;
            this._id = TextureDrawList.gid;
        }
        Object.defineProperty(TextureDrawList.prototype, "id", {
            get: function () {
                return this._id;
            },
            enumerable: true,
            configurable: true
        });
        TextureDrawList.prototype.drawList = function (gl) {
            var len = this._list.length;
            for (var i = 0; i < len; i++) {
                this._list[i].doDraw(gl);
            }
        };
        TextureDrawList.prototype.addDrawPass = function (sourceTexture, width, height, collecter) {
            var tdd = new TextureDrawData(sourceTexture, width, height, collecter);
            this._list.push(tdd);
        };
        TextureDrawList.prototype.getLastTexture = function () {
            var len = this._list.length;
            if (len > 0) {
                return this._list[len - 1].outTexture;
            }
            return null;
        };
        TextureDrawList.prototype.dispose = function () {
            if (this._list != null) {
                var len = this._list.length;
                for (var i = 0; i < len; i++) {
                    this._list[i].dispose();
                }
                this._list = null;
            }
            if (this._id != -1) {
                TextureDrawerManager.instance.disposeTexture(this._id);
                this._id = -1;
            }
        };
        return TextureDrawList;
    }());
    TextureDrawList.gid = 0;
    aoi.TextureDrawList = TextureDrawList;
    __reflect(TextureDrawList.prototype, "aoi.TextureDrawList");
    var TextureDrawData = (function () {
        function TextureDrawData(sourceTexture, width, height, collecter) {
            this._sourceTexture = sourceTexture;
            this._targetTexture = new aoi.TextureDrawerTexture(width, height);
            this._collector = collecter;
        }
        Object.defineProperty(TextureDrawData.prototype, "outTexture", {
            get: function () {
                return this._targetTexture;
            },
            enumerable: true,
            configurable: true
        });
        TextureDrawData.prototype.doDraw = function (gl) {
            this._targetTexture.drawTexture(gl, this._sourceTexture, this._collector);
        };
        TextureDrawData.prototype.dispose = function () {
            if (this._targetTexture != null) {
                this._targetTexture.dispose();
                this._targetTexture = null;
            }
        };
        return TextureDrawData;
    }());
    aoi.TextureDrawData = TextureDrawData;
    __reflect(TextureDrawData.prototype, "aoi.TextureDrawData");
})(aoi || (aoi = {}));
//# sourceMappingURL=TextureDrawerManager.js.map