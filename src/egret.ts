class egret
{
    public static runEgret(obj:Object)
    {        
        var stageWidth = window.innerWidth;
        var stageHeight = window.innerHeight;
        let div:Element = document.body.getElementsByClassName("egret-player")[0];
        let canvas:HTMLCanvasElement = document.createElement("canvas");
        div.appendChild(canvas);
        var view = new editor.EditorMain(canvas, stageWidth, stageHeight);
        view.setup();
        //base.Util.loadScript("res/js/Stats.js");
    }
    private static abc()
    {
        var stageWidth = window.innerWidth;
        var stageHeight = window.innerHeight;
        let canvas = document.createElement("canvas");
        var view = new editor.EditorMain(canvas, stageWidth, stageHeight);
        view.setup();
    }
}