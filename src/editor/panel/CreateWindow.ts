module editor
{
    import Button = aoi.Button;
    import EventBase = base.EventBase;
    import CheckBox = aoi.CheckBox;
    import DrawList = aoi.DrawList;
    import InputItem = aoi.InputItem;
    export class CreateWindow extends Window
    {
        private checkBoxes:Array<CheckBox>;
        private createBtn:Button;
        constructor()
        {
            super(400, 300);
        }
        public buildShowItem():void
        {
            super.buildShowItem();
            this.checkBoxes = [];
            this.initTitle("CreatePanel");
            this.createBtn = UICreate.createBtn(100, 40, "Create");
            //this.addChild(this.createBtn);
            var strs:Array<string> = ["几何体", "序列帧", "obj", "骨骼", "粒子"];
            for(var i:number = 0; i<5; i++)
            {
                var cbox:CheckBox = new CheckBox(120, 30);
                cbox.x = 5 + 70 * i;
                cbox.y = -40;
                cbox.setLabel(strs[i]);
                this.addChild(cbox);
                this.checkBoxes.push(cbox);
            }

            var inputitem:InputItem = new InputItem(150, 30);
            inputitem.setLabel("ddd");
            inputitem.x = 150;
            inputitem.y = -240;
            this.addChild(inputitem);

            var btn:aoi.Button = UICreate.createBtn(90, 30, "save");
            btn.addEventListener(base.EventBase.MOUSE_DOWN, this, this.onBtnMouseDown);
            btn.x = 10;
            btn.y = -240;
            this.addChild(btn);
        }
        private onBtnMouseDown(event:EventBase):void
        {
            let by:base.ByteArray = new base.ByteArray(new ArrayBuffer(10240), base.Endian.LITTLE_ENDIAN);
            by.writeInt(111);
            by.writeString("aaaaa");
            by.writeInt(1123);
            by.writeString("bbbb");
            by.writeString("ccc");
            by.writeString("dddd");
            by.writeInt(57);
            base.Util.saveFile("bb.txt", by);
        }
        private onMouseDown(event:EventBase):void
        {
        	DataCenter.instance.dispatchEvent(new EventBase("TEXT_EVENT"));
        }
    }

}