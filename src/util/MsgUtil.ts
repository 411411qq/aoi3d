module base 
{
    export class MsgUtil
    { 
        private static msg_function:Object = {};
        private static obj:Object = {};
        public static addEventListener(msg_type:string, func:Function, thisObject:any)
        {
            if(this.msg_function[msg_type] == null)
            {
                this.msg_function[msg_type] = new Array<MsgStruct>();
            }
            let arr:Array<MsgStruct> = this.msg_function[msg_type];
            let len = arr.length;
            for(let i = 0; i < len; i++)
            {
                if(arr[i].fun == func && arr[i].obj == thisObject)
                {
                    return;
                }
            }
            let ms:MsgStruct = new MsgStruct();
            ms.fun = func;
            ms.obj = thisObject;
            arr.push(ms);
        }

        public static removeEventListener(msg_type:string, func:Function, thisObject:any)
        {
            if(this.msg_function[msg_type] != null)
            {
                let arr:Array<MsgStruct> = this.msg_function[msg_type];
                let len = arr.length;
                for(let i = 0; i < len; i++)
                {
                    if(arr[i].fun == func && arr[i].obj == thisObject)
                    {
                        arr.splice(i, 1);
                        return;
                    }
                }
            }
        }

        public static callFunc(msg_type:string, bc:Object = null)
        {
            if(this.msg_function[msg_type] != null)
            {
                let arr:Array<MsgStruct> = this.msg_function[msg_type];
                let len = arr.length;
                for(let i = 0; i < len; i++)
                {
                    arr[i].fun.call(arr[i].obj, bc);
                }
            }
        }

        public static removeAllEventListener()
        {
            this.msg_function = {};
            this.obj = {};
        }
    }
    export class MsgStruct
    {
        public obj:any;
        public fun:Function;
    }
}