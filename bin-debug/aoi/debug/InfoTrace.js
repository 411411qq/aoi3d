var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var aoi;
(function (aoi) {
    var InfoTrace = (function () {
        function InfoTrace() {
            this.infoTxt = document.createElement("div");
            this.infoTxt.style.position = 'absolute';
            this.infoTxt.style.top = '150px';
            this.infoList = [];
            this.infoTxt.innerHTML = "";
            document.body.appendChild(this.infoTxt);
            aoi.GlobelConst.eventDispatcher.addEventListener("TRACE_INFO", this, this.onInfoTrace);
        }
        InfoTrace.prototype.onInfoTrace = function (obj) {
            this.infoList.push(obj.data);
            while (this.infoList.length > 15) {
                this.infoList.shift();
            }
            var len = this.infoList.length;
            var str = "";
            for (var i = 0; i < len; i++) {
                str += "<font color=\"FFFFFF\">" + this.infoList[i] + "</font><br/>";
            }
            this.infoTxt.innerHTML = str;
        };
        return InfoTrace;
    }());
    aoi.InfoTrace = InfoTrace;
    __reflect(InfoTrace.prototype, "aoi.InfoTrace");
})(aoi || (aoi = {}));
//# sourceMappingURL=InfoTrace.js.map