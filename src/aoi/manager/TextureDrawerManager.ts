module aoi {
    import EventBase = base.EventBase;
    export class TextureDrawerManager {
        private static _instance:TextureDrawerManager;
        public static get instance():TextureDrawerManager {
            if (TextureDrawerManager._instance == null) {
                TextureDrawerManager._instance = new TextureDrawerManager()
            }
            return TextureDrawerManager._instance;
        }
        private _dic:Object;
        public constructor()
        {
            this._dic = {};
        }
        public doDraw(gl:WebGLRenderingContext):void
        {
            for (var key in this._dic) 
            {
                var data = this._dic[key];
                (data as TextureDrawList).drawList(gl);
            }
        }
        public genTextureDrawList():TextureDrawList
        {
            let texture:TextureDrawList = new TextureDrawList();
            this._dic[texture.id] = texture;
            return texture;
        }
        public disposeTexture(id:number)
        {
            if(this._dic[id] != null)
            {
                let texture:TextureDrawList = this._dic[id] as TextureDrawList;
                delete this._dic[id];
                texture.dispose();
            }
        }
        public dispose():void
        {
            for (var key in this._dic) 
            {
                var data = this._dic[key];
                data.dispose();
            }
            this._dic = {};
        }
    }

    export class TextureDrawList
    {
        private static gid:number = 0;
        private _list:Array<TextureDrawData>;
        private _id:number = 0;
        public constructor()
        {
            this._list = [];
            TextureDrawList.gid ++;
            this._id = TextureDrawList.gid;
        }
        public get id():number
        {
            return this._id;
        }
        public drawList(gl:WebGLRenderingContext):void
        {
            let len:number = this._list.length;
            for(var i:number = 0; i<len; i++)
            {
                (this._list[i] as TextureDrawData).doDraw(gl);
            }
        }
        public addDrawPass(sourceTexture:TextureBase, width:number, height:number, collecter:PlunginCollecter):void
        {
            let tdd:TextureDrawData = new TextureDrawData(sourceTexture, width, height, collecter);
            this._list.push(tdd);
        }
        public getLastTexture():TextureBase
        {
            let len:number = this._list.length;
            if(len > 0)
            {
                return this._list[len - 1].outTexture;
            }
            return null;
        }
        public dispose()
        {
            if(this._list != null)
            {
                let len:number = this._list.length;
                for(var i:number = 0; i<len; i++)
                {
                    this._list[i].dispose();
                }
                this._list = null;
            }
            if(this._id != -1)
            {
                TextureDrawerManager.instance.disposeTexture(this._id);
                this._id = -1;
            }
        }
    }

    export class TextureDrawData
    {
        private _sourceTexture:TextureBase;
        private _targetTexture:TextureDrawerTexture;
        private _collector:PlunginCollecter;
        public constructor(sourceTexture:TextureBase, width:number, height:number, collecter:PlunginCollecter)
        {
            this._sourceTexture = sourceTexture;
            this._targetTexture = new TextureDrawerTexture(width, height);
            this._collector = collecter;
        }
        public get outTexture():TextureDrawerTexture
        {
            return this._targetTexture;
        }
        public doDraw(gl:WebGLRenderingContext):void
        {
            this._targetTexture.drawTexture(gl, this._sourceTexture, this._collector);
        }
        public dispose():void
        {
            if(this._targetTexture != null)
            {
                this._targetTexture.dispose();
                this._targetTexture = null;
            }
        }
    }
}