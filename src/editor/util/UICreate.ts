module editor
{
    import Altas = aoi.Altas;
    import Button = aoi.Button;
    import AssetManager = aoi.AssetManager;
    import UIDefine = aoi.UIDefine;
    import AltasAsset = aoi.AltasAsset;
    import Define = aoi.Define;
    export class UICreate
    {
        static _altas:AltasAsset;
        static get altas():Altas
        {
            if(UICreate._altas == null)
            {
                UICreate._altas = AssetManager.instance.gain(UIDefine.DEFAULT, "UICreate") as AltasAsset;
            }
            return UICreate._altas.altas;
        }

        static createBtn(width:number, height:number, labelTxt:string = "label"):Button
        {
            var btn:Button = new Button(width, height, labelTxt);
            btn.altas = UICreate.altas;
            btn.normal = "btn_normal";
            btn.horver = "btn_over";
            btn.clicked = "btn_press";
            return btn;
        }
    }
}